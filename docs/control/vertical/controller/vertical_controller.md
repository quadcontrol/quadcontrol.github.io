---
icon: material/camera-control
---

# Controlador vertical

Nesta secção você irá implementar o controlador vertical, que comanda a força de empuxo ${\color{var(--c2)}f_t}$ a partir da diferença entre a posição vertical de referência ${\color{var(--c3)}z_r}$ e estimada ${\color{var(--c1)}z}$.

![Architecture - Vertical Controller](../../architecture/images/architecture_vertical_controller.svg){: width=100% style="display: block; margin: auto;" }

Para isto, será implementada uma nova função:

- `verticalController()`

Além de uma alteração em uma função já previamente implementada:

- `reference()`

---

## Implementação

Para começar, copie e cole o arquivo `vertical_estimator.c` e renomeie ele para `vertical_controller.c`.

### Definições

#### Variáveis globais

Declare mais uma variável global, que é a referência que entra na função do controlador vertical.

```c hl_lines="21"
// Actuators
float pwm1, pwm2, pwm3, pwm4; // Motors PWM

// Sensors
float ax, ay, az;             // Accelerometer [m/s^2]
float gx, gy, gz;             // Gyroscope [rad/s]
float d;                      // Range [m]

// System inputs
float ft;                     // Thrust force [N]
float tx, ty, tz;             // Roll, pitch and yaw torques [N.m]

// System states
float phi, theta, psi;        // Euler angles [rad]
float wx, wy, wz;             // Angular velocities [rad/s]
float z;                      // Vertical position [m]
float vz;                     // Vertical velocity [m/s]

// System references
float phi_r, theta_r, psi_r; // Euler angles reference [rad]
float z_r
```

### Loop principal

Inclua no seu loop principal a chamada da função `verticalController()` entre as funções `verticalEstimator()` e `attitudeController()`.

```c hl_lines="11"
// Main application task
void appMain(void *param)
{
    // Infinite loop (runs at 200Hz)
    while (true)
    {
        reference();                  // Read reference setpoints (from Crazyflie Client)
        sensors();                    // Read raw sensor measurements
        attitudeEstimator();          // Estimate orientation (roll/pitch/yaw) from IMU sensor
        verticalEstimator();          // Estimate vertical position/velocity from range sensor
        verticalController();         // Compute desired thrust force
        attitudeController();         // Compute desired roll/pitch/yaw torques
        mixer();                      // Convert desired force/torques into motor PWM
        actuators();                  // Send commands to motors
        vTaskDelay(pdMS_TO_TICKS(5)); // Loop delay (5 ms)
    }
}
```

### Funções

#### Referência

A posição vertical de referência ${\color{var(--c3)}z_r}$ será comandada pelo Command Based Flight Control do Crazyflie Client utilizando os botões ++"Up"++ e ++"Down"++.

![Commando Based Flight Control](../../../identification/images/command_based_flight_control.png){: width=100% style="display: block; margin: auto;" }

![](images/reference_attitude_controller.svg){: width=60% style="display: block; margin: auto;" }

Modifique a função `reference()` para que a posição vertical de referência ${\color{var(--c3)}z_r}$ seja definida pela variável `setpoint.position.z`.

```c hl_lines="12"
// Get reference setpoints from commander module
void reference()
{
    // Declare variables that store the most recent setpoint and state from commander
    static setpoint_t setpoint;
    static state_t state;

    // Retrieve the current commanded setpoints and state from commander module
    commanderGetSetpoint(&setpoint, &state);

    // Extract position references from the received setpoint
    z_r = setpoint.position.z;                        // Z position reference [m]
    phi_r = (setpoint.position.y * 2.0f) * pi/4.0f;   // Roll reference command [rad] (maps 0.5m -> pi/4 rad)
    theta_r = (setpoint.position.y * 2.0f) * pi/4.0f; // Pitch reference command [rad] (maps 0.5m -> pi/4 rad)
    psi_r = 0.0f;                                     // Yaw reference command [rad]
}
```