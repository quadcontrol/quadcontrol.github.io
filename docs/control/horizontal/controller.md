---
title: Controlador horizontal
icon: material/gamepad-circle-outline
---

# :material-pan-horizontal: Controlador horizontal

Nesta secção você irá implementar o controlador horizontal, que comanda os ângulos de rolagem e inclinação de referência ${\color{var(--c3)}\phi_r}$ e ${\color{var(--c3)}\theta_r}$a partir da diferença entre as posições horizontais de referência ${\color{var(--c3)}x_r}$ e ${\color{var(--c3)}y_r}$ e estimadas ${\color{var(--c1)}x}$ e ${\color{var(--c1)}y}$.

![Architecture - Horizontal Controller](../images/architecture_horizontal_controller.svg){: width=100% style="display: block; margin: auto;" }

Para isto, será implementada uma nova função:

- `horizontalController()`

Além de uma alteração em uma função já previamente implementada:

- `reference()`

---

## Implementação

Para começar, copie e cole o arquivo `horizontal_estimator.c` e renomeie ele para `horizontal_controller.c`.

### Definições

#### Variáveis globais

Declare mais algumas variáveis globais, que correspondem às posições horizontais de referência ${\color{var(--c3)}x_r}$ e ${\color{var(--c3)}y_r}$.

```c hl_lines="21"
// Actuators
float pwm1, pwm2, pwm3, pwm4; // Motors PWM

// Sensors
float ax, ay, az;             // Accelerometer [m/s^2]
float gx, gy, gz;             // Gyroscope [rad/s]
float d;                      // Range [m]

// System inputs
float ft;                    // Thrust force [N]
float tx, ty, tz;            // Roll, pitch and yaw torques [N.m]

// System states
float phi, theta, psi;       // Euler angles [rad]
float wx, wy, wz;            // Angular velocities [rad/s]
float x, y, z;               // Positions [m]
float vx, vy, vz;            // Velocities [m/s]

// System references
float phi_r, theta_r, psi_r; // Euler angles reference [rad]
float x_r, y_r, z_r;         // Positions reference [m]
```

### Loop principal

Inclua a chamada da função `horizontalController()` no loop principal.

```c hl_lines="12"
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
        horizontalEstimator();        // Estimate horizontal positions/velocities from optical flow sensor
        horizontalController();       // Compute desired roll/pitch angles
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

As posições horizontais de referência ${\color{var(--c3)}x_r}$ e ${\color{var(--c3)}y_r}$ serão comandadas pelo Command Based Flight Control do Crazyflie Client utilizando os botões ++"↑"++ ++"↓"++ e ++"←"++ ++"→"++.

<!-- ![](images/reference.svg){: width=60% style="display: block; margin: auto;" } -->

Modifique a função `reference()` para que as posições horizontais de referência ${\color{var(--c3)}x_r}$ e ${\color{var(--c3)}y_r}$ sejam definidas pelas variáveis `setpoint.position.x` e `setpoint.position.y`.

```c hl_lines="13-14"
// Get reference setpoints from commander module
void reference()
{
    // Declare variables that store the most recent setpoint and state from commander
    static setpoint_t setpoint;
    static state_t state;

    // Retrieve the current commanded setpoints and state from commander module
    commanderGetSetpoint(&setpoint, &state);

    // Extract position references from the received setpoint
    z_r = setpoint.position.z;  // Z position reference [m]
    x_r = setpoint.position.x;  // X position reference [m]
    y_r = setpoint.position.y;  // Y position reference [m]
    psi_r = 0.0f;               // Yaw reference command [rad]
}
```

#### Controlador horizontal

A função `horizontalController()` é quem comanda os ângulos de rolagem e inclinação de referência ${\color{var(--c3)}\phi_r}$ e ${\color{var(--c3)}\theta_r}$a partir da diferença entre as posições horizontais de referência ${\color{var(--c3)}x_r}$ e ${\color{var(--c3)}y_r}$ e estimadas ${\color{var(--c1)}x}$ e ${\color{var(--c1)}y}$.

```c
// Compute desired roll/pitch angles
void horizontalController()
{
}
```

Já [vimos](../../../modeling/3d_model.md) que a dinâmica linearizada de um quadricóptero pode ser representada pelo diagrama de blocos abaixo:
    
![Commando Based Flight Control](../../../modeling/images/3d_plant.svg){: width=100% style="display: block; margin: auto;" }

Como a dinâmica de posição horizontal de cada eixo está desacoplada, é possível controlar cada um deles individualmente. Toda a técnica de controle explorada aqui será realizada para a posição ${\color{var(--c1)}x}$, e a mesma será replicada depois para a posição ${\color{var(--c1)}y}$.
    
A dinâmica de posição horizontal pode ser representada pelo seguinte trecho:

![](images/plant.svg){: width=65% style="display: block; margin: auto;" }

A entrada da dinâmica horizontal é a saída da dinâmica de atitude. Como a dinâmica de atitude já está sendo controlada, podemos controlar a posição horizontal através do ângulo de referência do controlador de atitude(1):
{.annotate}

1. Fazemos isso pois a dinâmica de atitude (em malha fechada) é muito mais rápida, e, portanto, pode ser assumida como um ganho unitário.

![](images/plant_inner_loop.svg){: width=100% style="display: block; margin: auto;" }

Podemos cancelar a aceleração da gravidade de modo que a variável de controle seja a aceleração horizontal:

![](images/plant_inner_loop_cancelation.svg){: width=100% style="display: block; margin: auto;" }

Isso reduz o sistema a ser controlado a um integrador duplo, exatamente como fizemos com o controlador de atitude e vertical. Vamos utilizar um regulador de estados para fazer esse controle:

![](images/controller_lqr_plant.svg){: width=100% style="display: block; margin: auto;" }

??? question "Definição dos ganhos $k_p$ e $k_d$"

Olhando o controlador isoladamente, temos o seguinte diagrama de blocos(1):
{.annotate}

1. No sistema linearizado temos que ${\color{var(--c3)}\dot{x}_r} = {\color{var(--c3)}v_{x_r}}$ e ${\color{var(--c1)}\dot{x}} = {\color{var(--c1)}v_x}$.

![](images/controller_lqr.svg){: width=65% style="display: block; margin: auto;" }

Que se traduz na equação abaixo(1):
{.annotate}

1. Como o objetivo é deixar o quadricóptero estacionário, a velocidade angular de referência ${\color{var(--c3)}v_{x_r}}$ pode ser assumida como sendo zero, o que reduz um dos termos:

    $$
    k_d \left( \cancelto{0}{{\color{var(--c3)}v_{x_r}}} - {\color{var(--c1)}v_x} \right) = - k_d  {\color{var(--c1)}v_x}
    $$

$$
\left\{
\begin{array}{l}
    {\color{var(--c3)}\phi_r} = -\dfrac{1}{g} \left( k_p \left( {\color{var(--c3)}y_r} - {\color{var(--c1)}y} \right) - k_d {\color{var(--c1)}v_y} \right) \\
    {\color{var(--c3)}\theta_r} = \dfrac{1}{g} \left( k_p \left( {\color{var(--c3)}x_r} - {\color{var(--c1)}x} \right) - k_d {\color{var(--c1)}v_x} \right)
\end{array}
\right.
$$

Inclua na função `attitudeController()` duas variáveis locais $k_p$ e $k_d$, que correspondem aos ganhos do controlador, e, em seguida, calcule os ângulos de rolagem e inclinação de referência ${\color{var(--c3)}\phi_r}$ e ${\color{var(--c3)}\theta_r}$ seguindo as equações acima.

```c hl_lines="5-6 9-10"
// Compute desired roll/pitch angles
void horizontalController()
{
    // Controller parameters (settling time of 3.0s and overshoot of 0,05%)
    static const float kp = 
    static const float kd = 

    // Compute angle reference (nested control)
    phi_r = 
    theta_r = 
}
```
