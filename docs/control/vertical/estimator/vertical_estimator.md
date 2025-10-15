# Estimador vertical

Nesta secção você irá implementar o estimador vertical, que estima a posição $z$ e velocidade $v_z$ a partir da leitura do sensor de proximidade $d$.

![Architecture - Vertical Estimator](../../architecture/images/architecture_vertical_estimator.svg){: width=100% style="display: block; margin: auto;" }

Para isto, será implementada uma nova função:

- `verticalEstimator()`

Além de uma alteração em uma função já previamente implementada:

- `sensors()`

---

## Implementação

Para começar, copie e cole o arquivo `attitude_controller.c` e renomeie ele para `vertical_estimator.c`.

### Definições

#### Variáveis globais

Declare mais algumas variáveis globais, que são as variáveis que entram e saem da função do estimador vertical.

```c hl_lines="4 9 10"
// Sensors
float ax, ay, az;             // Accelerometer [m/s^2]
float gx, gy, gz;             // Gyroscope [rad/s]
float d;                      // Range [m]

// System states
float phi, theta, psi;        // Euler angles [rad]
float wx, wy, wz;             // Angular velocities [rad/s]
float z;                      // Vertical position [m]
float vz;                     // Vertical velocity [m/s]
```

#### Variáveis de registro

Adicione as variáveis criadas ao grupo de registro previamente definido, para que seja possível visualizar nossa estimativa em tempo real no Crazyflie Client.

```c hl_lines="6 7"
// Logging group that stream variables to CFClient.
LOG_GROUP_START(stateEstimate)
LOG_ADD_CORE(LOG_FLOAT, roll, &log_phi)
LOG_ADD_CORE(LOG_FLOAT, pitch, &log_theta)
LOG_ADD_CORE(LOG_FLOAT, yaw, &log_psi)
LOG_ADD_CORE(LOG_FLOAT, z, &z)
LOG_ADD_CORE(LOG_FLOAT, vz, &vz)
LOG_GROUP_STOP(stateEstimate)
```

### Loop principal

Inclua no seu loop principal a chamada da função `verticalEstimator()` entre as funções `attitudeEstimator()` e `attitudeController()`.

```c hl_lines="10"
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
        attitudeController();         // Compute desired roll/pitch/yaw torques
        mixer();                      // Convert desired force/torques into motor PWM
        actuators();                  // Send commands to motors
        vTaskDelay(pdMS_TO_TICKS(5)); // Loop delay (5 ms)
    }
}
```

### Funções

#### Sensores

Inclue na função `sensors()` um código adicional que pega a leitura do sensor de proximidade e armazena ela na variável global previamente declarada.

```c hl_lines="24-27"
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
            ax = -measurement.data.acceleration.acc.x * g;
            ay = -measurement.data.acceleration.acc.y * g;
            az = -measurement.data.acceleration.acc.z * g;
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
        default:
            break;
        }
    }
}
```

#### Estimador vertical

A função `verticalEstimator()` é quem estima a posição e velocidade vertical a partir da leitura do sensor de proximidade.

```c
// Estimate vertical position/velocity from range sensor
void verticalEstimator()
{
}
```

##### Observador de estados

###### Observador de ordem 1

###### Observador de ordem 2

###### Observador de ordem 2 (com entrada)

---

## Validação