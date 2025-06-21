# Nível 1

Texto

## Nível 2

```c title="lab10.c"
#include "math.h"       // Math functions (e.g., sqrtf, roundf, powf)
#include "FreeRTOS.h"   // FreeRTOS core definitions (needed for task handling and timing)
#include "task.h"       // FreeRTOS task functions (e.g., vTaskDelay)
#include "supervisor.h" // Functions to check flight status (e.g., supervisorIsArmed)
#include "commander.h"  // Access to commanded setpoints (e.g., commanderGetSetpoint)
#include "estimator.h"  // Estimation framework for sensor fusion
#include "motors.h"     // Low-level motor control interface (e.g., motorsSetRatio)
#include "debug.h"      // Debug printing functions (e.g., DEBUG_PRINT)
#include "log.h"        // Logging utilities to send data to the CFClient

// Global parameters
static const float pi = 3.1416f; // Mathematical constant
static const float g = 9.81f;    // Gravitational acceleration [m/s^2]
static const float dt = 0.005f;  // Loop time step [s] (5 ms -> 200 Hz)

// Sensors
float ax, ay, az; // Accelerometer [m/s^2]
float gx, gy, gz; // Gyroscope [rad/s]
float d;          // Range [m]
float px, py;     // Optical flow [pixels]

// Motors
float pwm1, pwm2, pwm3, pwm4; // PWM values [0.0-1.0]

// System inputs
float ft;         // Total thrust [N]
float tx, ty, tz; // Torques [N.m]

// System states
float phi, theta, psi; // Euler angles [rad]
float wx, wy, wz;      // Angular velocity [rad/s]
float x, y, z;         // Position [m]
float vx, vy, vz;      // Velocity [m/s]

// System references
float phi_r, theta_r, psi_r; // Euler angles [rad]
float wx_r, wy_r, wz_r;      // Angular velocity [rad/s]
float x_r, y_r, z_r;         // Position [m]
float vx_r, vy_r, vz_r;      // Velocity [m/s]

// Auxiliary variables for logging Euler angles (CFClient uses degrees and not radians)
float log_phi, log_theta, log_psi;

// Logging group that stream variables to CFClient.
LOG_GROUP_START(stateEstimate)
LOG_ADD_CORE(LOG_FLOAT, roll, &log_phi)
LOG_ADD_CORE(LOG_FLOAT, pitch, &log_theta)
LOG_ADD_CORE(LOG_FLOAT, yaw, &log_psi)
LOG_ADD_CORE(LOG_FLOAT, x, &x)
LOG_ADD_CORE(LOG_FLOAT, y, &y)
LOG_ADD_CORE(LOG_FLOAT, z, &z)
LOG_ADD_CORE(LOG_FLOAT, vx, &vx)
LOG_ADD_CORE(LOG_FLOAT, vy, &vy)
LOG_ADD_CORE(LOG_FLOAT, vz, &vz)
LOG_GROUP_STOP(stateEstimate)

// Get reference setpoints from commander module
void reference()
{
    // Declare variables that store the most recent setpoint and state from commander
    static setpoint_t setpoint;
    static state_t state;

    // Retrieve the current commanded setpoints and state from commander module
    commanderGetSetpoint(&setpoint, &state);

    // Extract position references from the received setpoint
    x_r = setpoint.position.x;               // X position reference [m]
    y_r = 0.0f;                              // Y position reference [m]
    z_r = setpoint.position.z;               // Z position reference [m]
    psi_r = setpoint.position.y * pi / 2.0f; // Yaw angle reference [rad] (maps 0.5m -> 45º)
}

// Get sensor readings from estimator module
void sensors()
{
    // Declare variable that store the most recent measurement from estimator
    static measurement_t measurement;

    // Retrieve the current measurement from estimator module
    while (estimatorDequeue(&measurement))
    {
        switch (measurement.type)
        {
        // Get accelerometer sensor readings and convert [G's -> m/s^2]
        case MeasurementTypeAcceleration:
            ax = -measurement.data.acceleration.acc.x * 9.81f;
            ay = -measurement.data.acceleration.acc.y * 9.81f;
            az = -measurement.data.acceleration.acc.z * 9.81f;
            break;
        // Get gyroscope sensor readings and convert [deg/s -> rad/s]
        case MeasurementTypeGyroscope:
            gx = measurement.data.gyroscope.gyro.x * pi / 180.0f;
            gy = measurement.data.gyroscope.gyro.y * pi / 180.0f;
            gz = measurement.data.gyroscope.gyro.z * pi / 180.0f;
            break;
        // Get flow sensor readings [m]
        case MeasurementTypeTOF:
            d = measurement.data.tof.distance;
            break;
        // Get optical flow sensor readings and convert [10.px -> px]
        case MeasurementTypeFlow:
            px = measurement.data.flow.dpixelx * 0.1f;
            py = measurement.data.flow.dpixely * 0.1f;
            break;
        default:
            break;
        }
    }
}

// Compute motor commands
void mixer()
{
    // Quadcopter parameters
    static const float l = 35.0e-3f;  // Distance from motor to quadcopter center of mass [m]
    static const float a2 = 6.2e-8f;  // Quadratic motor model gain [s^2/rad^2]
    static const float a1 = 2.4e-4f;  // Linear motor model gain [s/rad]
    static const float kl = 2.0e-08f; // Lift coefficient [N.s^2]
    static const float kd = 2.0e-10f; // Drag coefficient [N.m.s^2]

    // Compute required motor angular velocities squared (omega^2)
    float omega1 = (1.0f / 4.0f) * (ft / kl - tx / (kl * l) - ty / (kl * l) - tz / kd);
    float omega2 = (1.0f / 4.0f) * (ft / kl - tx / (kl * l) + ty / (kl * l) + tz / kd);
    float omega3 = (1.0f / 4.0f) * (ft / kl + tx / (kl * l) + ty / (kl * l) - tz / kd);
    float omega4 = (1.0f / 4.0f) * (ft / kl + tx / (kl * l) - ty / (kl * l) + tz / kd);

    // Clamp to non-negative and take square root
    omega1 = (omega1 >= 0.0f) ? sqrtf(omega1) : 0.0f;
    omega2 = (omega2 >= 0.0f) ? sqrtf(omega2) : 0.0f;
    omega3 = (omega3 >= 0.0f) ? sqrtf(omega3) : 0.0f;
    omega4 = (omega4 >= 0.0f) ? sqrtf(omega4) : 0.0f;

    // Compute motor PWM using motor model
    pwm1 = a2 * omega1 * omega1 + a1 * omega1;
    pwm2 = a2 * omega2 * omega2 + a1 * omega2;
    pwm3 = a2 * omega3 * omega3 + a1 * omega3;
    pwm4 = a2 * omega4 * omega4 + a1 * omega4;
}

// Apply motor commands
void motors()
{
    // Check is quadcopter is armed or disarmed
    if (supervisorIsArmed())
    {
        // Check if quadcopter has been commanded to take-off or land
        if (z_r > 0.0f)
        {
            // Apply calculated PWM values if is commanded to take-off
            motorsSetRatio(MOTOR_M1, pwm1 * UINT16_MAX);
            motorsSetRatio(MOTOR_M2, pwm2 * UINT16_MAX);
            motorsSetRatio(MOTOR_M3, pwm3 * UINT16_MAX);
            motorsSetRatio(MOTOR_M4, pwm4 * UINT16_MAX);
        }
        else
        {
            // Apply idle PWM value if is commanded to land
            motorsSetRatio(MOTOR_M1, 0.1f * UINT16_MAX);
            motorsSetRatio(MOTOR_M2, 0.1f * UINT16_MAX);
            motorsSetRatio(MOTOR_M3, 0.1f * UINT16_MAX);
            motorsSetRatio(MOTOR_M4, 0.1f * UINT16_MAX);
        }
    }
    else
    {
        // Turn-off all motor if disarmed
        motorsStop();
    }
}

// Estimate orientation from IMU sensor
void attitudeEstimator()
{
    // Estimator parameters
    static const float wc = 1.0f; // Cutoff frequency for complementary filter [rad/s]

    // Use gyroscope for integration
    wx = gx;
    wy = gy;
    wz = gz;

    // Compute angles from accelerometer
    float phi_a = atan2f(-ay, -az);
    float theta_a = atan2f(ax, sqrt(ay * ay + az * az));

    // Integrate gyroscope rates (Euler)
    float phi_g = phi + (wx + wy * sinf(phi) * tanf(theta) + wz * cosf(phi) * tanf(theta)) * dt;
    float theta_g = theta + (wy * cosf(phi) - wz * sinf(phi)) * dt;
    float psi_g = psi + (wy * sinf(phi) / cosf(theta) + wz * cosf(phi) / cosf(theta)) * dt;

    // Complementary filter: blend gyro (high freq) and accel (low freq)
    phi = (1.0f - wc * dt) * phi_g + wc * dt * phi_a;
    theta = (1.0f - wc * dt) * theta_g + wc * dt * theta_a;
    psi = psi_g; // No absolute reference for yaw

    //
    log_phi = phi * 180.0f / pi;
    log_theta = -theta * 180.0f / pi;
    log_psi = psi * 180.0f / pi;
}

// Compute desired torques
void attitudeController()
{
    // Quadcopter parameters
    static const float Ixx = 20.0e-6f; // Moment of inertia around x-axis [kg/m^2]
    static const float Iyy = 20.0e-6f; // Moment of inertia around y-axis [kg/m^2]
    static const float Izz = 40.0e-6f; // Moment of inertia around z-axis [kg/m^2]

    // Controller parameters (settling time of 0.3s and overshoot of 0,05%)
    float kp = 240.28f; // State regulator gain for angle error [1/s^2]
    float kd = 26.67f;  // State regulator gain for angular velocity [1/s]

    // Compute torques required
    tx = Ixx * (kp * (phi_r - phi) + kd * (wx_r - wx));
    ty = Iyy * (kp * (theta_r - theta) + kd * (wy_r - wy));
    tz = Izz * ((kp / 4.0f) * (psi_r - psi) + (kd / 2.0f) * (wz_r - wz)); // Settling time 2x slower (0.6s) for yaw
}

// Estimate vertical position/velocity from range sensor
void verticalEstimator()
{
    // Quadcopter parameters
    float m = 37.0e-3f;

    // Estimator parameters
    static const float lp = 14.14f;      // State observer gain for position correction [1/s]
    static const float ld = 100.0f;      // State observer gain for velocity correction [1/s^2]
    static const float dt_range = 0.05f; // Update rate of range sensor [s] (50ms -> 20Hz)

    // Prediction step (system model)
    z += vz * dt;
    vz += (ft / m - g) * dt;

    // Calculate measured distante from range sensor
    float z_m = d * cosf(phi) * cosf(theta);

    // Correction step (sensor)
    vz += (ld * dt_range) * (z_m - z);
    z += (lp * dt_range) * (z_m - z);
}

// Compute desired total thrust
void verticalController()
{
    // Quadcopter parameters
    float m = 37.0e-3f;

    // Controller parameters (settling time of 2.0s and overshoot of 0,05%)
    static const float kp = 5.41f; // State regulator gain for position error [1/s^2]
    static const float kd = 4.00f; // State regulator gain for velocity error [1/s]
    static const float ki = 5.41f; // State regulator gain for integral error [1/s^3]

    // Integral term for vertical position (static to retain value amoung function calls)
    static float z_int;

    // Compute total thrust required
    ft = m * (g + ki * z_int + kp * (z_r - z) + kd * (vz_r - vz));
    z_int += (z_r - z) * dt;
}

// Estimate horizontal position/velocity from optical flow sensor
void horizontalEstimator()
{
    // Estimator parameters
    static const float sigma = 2.19f; // Optical flow scaling factor
    static const float wc = 50.0f;    // Cutoff frequency for complementary filter [rad/s]

    // Prediction step (system model)
    x += vx * dt;
    y += vy * dt;
    vx += theta * g * dt;
    vy -= phi * g * dt;

    // Calculate range distance from estimates
    float d = z / (cosf(phi) * cosf(theta));

    // Calculate measured velocity from optical flow
    float vx_m = (px * sigma + wy) * d;
    float vy_m = (py * sigma - wx) * d;

    // Correction step (sensor)
    vx += wc * dt * (vx_m - vx);
    vy += wc * dt * (vy_m - vy);
}

// Compute desired roll/pitch angles
void horizontalController()
{
    // Controller parameters (settling time of 3.0s and overshoot of 0,05%)
    static const float kp = 2.40f;
    static const float kd = 2.67f;

    // Compute angle reference (nested control)
    phi_r = -(1.0f / g) * (kp * (y_r - y) + kd * (vy_r - vy));
    theta_r = (1.0f / g) * (kp * (x_r - x) + kd * (vx_r - vx));
}

// Main application task
void appMain(void *param)
{
    // Infinite loop (runs at 200Hz)
    while (true)
    {
        reference();                  // Get reference setpoints from commander module
        sensors();                    // Get sensor readings from estimator module
        attitudeEstimator();          // Estimate orientation from IMU sensor
        verticalEstimator();          // Estimate vertical position/velocity from range sensro
        horizontalEstimator();        // Estimate horizontal position/velocity from optical flow sensor
        horizontalController();       // Compute desired roll/pitch angles
        verticalController();         // Compute desired total thrust
        attitudeController();         // Compute desired torques
        mixer();                      // Compute motor commands
        motors();                     // Apply motor commands
        vTaskDelay(pdMS_TO_TICKS(5)); // Wait 5 ms
    }
}
```
