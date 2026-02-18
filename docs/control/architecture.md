---
title: Architecture
icon: material/sitemap-outline
---

# :material-sitemap-outline: Architecture

To control a quadcopter, we need a well-defined architecture. This architecture specifies how sensor measurements are processed by estimators, compared with reference signals by controllers, and finally converted into commands sent to the actuators.

The diagram below summarizes this sequence using block representation:

![Architecture](images/architecture_horizontal_controller.svg){: width=100% style="display: block; margin: auto;" }

In the diagram:

- The blocks represent the functions that will be called inside the main loop.
- The arrows represent the variables flowing from one block to another.

The information exchange between these functions will be handled through global variables(1), which act as the “wires” connecting the system modules.
{ .annotate }

1. Although global variables are generally not considered best practice in software engineering, we adopt this approach here to keep the C code straightforward and avoid excessive pointers and semaphores. Since the focus of this course is control theory — not software architecture — this decision improves clarity without compromising learning.

---

## Source Code

To get started, create a file called `main.c` inside the `src/control` folder.  This file will be organized into three major parts, described below.

### Definitions

The first part contains all libraries, parameters, constants, and variables.

#### Libraries

At the top of the file, import all(1) required libraries:
{ .annotate }

1. Some of these libraries will only be used later, but we include them now to avoid revisiting this section repeatedly.

```c linenums="1"
#include "math.h"       // Math functions (e.g., sqrtf, roundf, powf)
#include "FreeRTOS.h"   // FreeRTOS core definitions (needed for task handling and timing)
#include "task.h"       // FreeRTOS task functions (e.g., vTaskDelay)
#include "supervisor.h" // Functions to check flight status (e.g., supervisorIsArmed)
#include "commander.h"  // Access to commanded setpoints (e.g., commanderGetSetpoint)
#include "estimator.h"  // Estimation framework for sensor fusion
#include "motors.h"     // Low-level motor control interface (e.g., motorsSetRatio)
#include "debug.h"      // Debug printing functions (e.g., DEBUG_PRINT)
#include "log.h"        // Logging utilities to send data to the CFClient
```

#### Parameters and Constants

Next, declare(1) the physical constants and quadcopter parameters:
{ .annotate }

1. We use `const` to ensure the value does not change at runtime. The `static` keyword restricts the variable’s visibility to the current file, preventing name conflicts in other compilation units. Together, `static const` defines immutable, file-scoped constants.

```c linenums="11"
// Physical constants
static const float pi = 3.1416f; // Mathematical constant
static const float g = 9.81f;    // Gravitational acceleration [m/s^2]
static const float dt = 0.005f;  // Loop time step [s] (5 ms -> 200 Hz)

// Quadcopter parameters
static const float l = 35.0e-3f;   // Distance from motor to quadcopter center of mass [m]
static const float m = 38.6e-3f;   // Mass [kg]
static const float Ixx = 20.0e-6f; // Moment of inertia around x-axis [kg.m^2]
static const float Iyy = 20.0e-6f; // Moment of inertia around y-axis [kg.m^2]
static const float Izz = 40.0e-6f; // Moment of inertia around z-axis [kg.m^2]
```

#### Global Variables

Then, declare the variables that flow from one block to another, mirroring the architecture diagram.

```c linenums="23"
// Actuators
float pwm1, pwm2, pwm3, pwm4; // Motors PWM

// Sensors
float ax, ay, az;             // Accelerometer [m/s^2]
float gx, gy, gz;             // Gyroscope [rad/s]
float d;                      // Range [m]
float px, py;                 // Optical flow [pixels]

// System inputs
float ft;                     // Thrust force [N]
float tx, ty, tz;             // Roll, pitch and yaw torques [N.m]

// System states
float phi, theta, psi;        // Euler angles [rad]
float wx, wy, wz;             // Angular velocities [rad/s]
float x, y, z;                // Positions [m]
float vx, vy, vz;             // Velocities [m/s]

// System references
float phi_r, theta_r, psi_r; // Euler angles reference [rad]
float x_r, y_r, z_r;         // Positions reference [m]
```

#### Logging Variables

Finally, define which of these variables will be logged so they can be sent to the Crazyflie Client and visualized in real time(1).
{ .annotate }

1. We use auxiliary variables for Euler angles because the Crazyflie Client expects angles in degrees rather than radians.

```c linenums="46"
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
```

### Functions

The second part consists of the functions that will be called inside the main loop:

```c linenums="62"
// Get reference setpoints from commander module
void reference()
{
}

// Get sensor readings from estimator module
void sensors()
{
}

// Apply motor commands
void actuators()
{
}

// Compute motor commands
void mixer()
{
}

// Estimate orientation from IMU sensor
void attitudeEstimator()
{
}

// Compute desired torques
void attitudeController()
{
}

// Estimate vertical position/velocity from range sensor
void verticalEstimator()
{
}

// Compute desired thrust force
void verticalController()
{
}

// Estimate horizontal position/velocity from optical flow sensor
void horizontalEstimator()
{
}

// Compute desired roll/pitch angles
void horizontalController()
{
}
```

Notice that all functions are currently declared but left empty. This is intentional: we will implement them step by step, one function at a time. This approach allows you to clearly understand the role of each component before seeing the complete system running.

![Architecture](images/architecture.gif){: width=100% style="display: block; margin: auto;" }

In the next sections, we begin with the actuators, sensors and reference functions — which form the interface between our code and the physical world. After that, we introduce the mixer and then move on to estimators and controllers. Each subsystem will be studied in pairs — attitude (orientation), vertical (altitude) and horizontal (planar position) — combining estimation and control concepts from both classical and modern control theory in a structured and pedagogically progressive sequence.

<div class="grid cards" markdown>

-   :material-power:{ .lg .middle } **Mixer**

    ---

    We implement a coordinate transformation that allows us to work with aerodynamic forces and torques as system inputs instead of raw motor PWM signals.

-   :material-rotate-orbit:{ .lg .middle } **Attitude**

    ---

    We study low-pass filters, high-pass filters, and the complementary filter for sensor fusion. Stabilization is achieved using a cascaded P–P controller acting on angular velocity and angle, forming the fastest control loop in the system.

-   :material-pan-vertical:{ .lg .middle } **Vertical**

    ---

    We introduce first- and second-order state observers to estimate vertical velocity and position. We start with a PD controller, which naturally evolves into a PID when compensating for steady-state error caused by constant disturbances such as gravity.

-   :material-pan-horizontal:{ .lg .middle } **Horizontal**

    ---

    We advance to optimal state estimation and regulation. We show that the LQE is simply a linear Kalman filter, while the LQR corresponds to a PD controller with optimal gains. When estimation and control are optimally integrated, we obtain the well-known LQG framework.

</div>

---

### Main Loop

The third and final part contains the main loop. All control logic is implemented inside a loop running at 200 Hz (i.e., every 5 ms). Inside this loop, we call the functions following the architecture diagram sequence: references → sensors → estimators → controllers → actuators.

```c linenums="112"
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


<!-- ---
title: Arquitetura
icon: material/sitemap-outline
---

# :material-sitemap-outline: Arquitetura

Para controlar um drone, precisamos de uma arquitetura bem definida. Essa arquitetura estabelece como as informações dos sensores são processadas por estimadores, comparadas com as referências pelos controladores e, por fim, enviadas como comandos aos atuadores.

O diagrama abaixo resume essa sequência em blocos:

![Architecture](images/architecture_horizontal_controller.svg){: width=100% style="display: block; margin: auto;" }

No diagrama:

- Os blocos representam as funções que serão chamadas no loop principal.
- As setas representam as variáveis que fluem de um bloco a outro.

A passagem dessas informações entre as funções será feita por meio de variáveis globais(1), que atuarão como o “fio” que conecta os módulos do sistema.
{ .annotate }

1. Embora variáveis globais não sejam a melhor prática em programação, aqui adotamos essa solução para manter o código em C mais direto, evitando o excesso de ponteiros e semáforos. Como o foco do curso está na teoria de controle — e não em engenharia de software — essa escolha facilita a compreensão sem comprometer o aprendizado.

---

## Código base

Para começar, crie um arquivo chamado `main.c` dentro da pasta `src/control`. Esse arquivo será dividido em três grandes partes, conforme detalhamento a seguir.

### Definições

A primeiro parte consiste em definir todas as bibliotecas, parâmetros, constantes e variáveis.

#### Bibliotecas

Logo no início, você deve importar todas(1) as bibliotecas que serão utilizadas:
{.annotate}

1. Algumas dessas bibliotecas serão necessárias apenas mais pra frente, mas já as incluímos agora para evitar preocupações futuras.

```c linenums="1"
#include "math.h"       // Math functions (e.g., sqrtf, roundf, powf)
#include "FreeRTOS.h"   // FreeRTOS core definitions (needed for task handling and timing)
#include "task.h"       // FreeRTOS task functions (e.g., vTaskDelay)
#include "supervisor.h" // Functions to check flight status (e.g., supervisorIsArmed)
#include "commander.h"  // Access to commanded setpoints (e.g., commanderGetSetpoint)
#include "estimator.h"  // Estimation framework for sensor fusion
#include "motors.h"     // Low-level motor control interface (e.g., motorsSetRatio)
#include "debug.h"      // Debug printing functions (e.g., DEBUG_PRINT)
#include "log.h"        // Logging utilities to send data to the CFClient
```

#### Parâmetros e constantes

Na sequência, declare(1) as constantes físicas e parâmetros do quadricoptero:
{ .annotate }

1. Usamos `const` para garantir que o valor não muda em tempo de execução. Já o `static` limita a visibilidade da variável ao arquivo atual, evitando conflitos de nomes em outros arquivos. Assim, `static const` cria constantes imutáveis e restritas ao arquivo.


```c linenums="11"
// Physical constants
static const float pi = 3.1416f; // Mathematical constant
static const float g = 9.81f;    // Gravitational acceleration [m/s^2]
static const float dt = 0.005f;  // Loop time step [s] (5 ms -> 200 Hz)

// Quadcopter parameters
static const float l = 35.0e-3f;   // Distance from motor to quadcopter center of mass [m]
static const float m = 38.6e-3f;   // Mass [kg]
static const float Ixx = 20.0e-6f; // Moment of inertia around x-axis [kg.m^2]
static const float Iyy = 20.0e-6f; // Moment of inertia around y-axis [kg.m^2]
static const float Izz = 40.0e-6f; // Moment of inertia around z-axis [kg.m^2]
```

#### Variáveis globais

Em seguida, declarare as variáveis que fluem de um bloco a outro, espelhando o diagrama inicial.

```c linenums="23"
// Actuators
float pwm1, pwm2, pwm3, pwm4; // Motors PWM

// Sensors
float ax, ay, az;             // Accelerometer [m/s^2]
float gx, gy, gz;             // Gyroscope [rad/s]
float d;                      // Range [m]
float px, py;                 // Optical flow [pixels]

// System inputs
float ft;                     // Thrust force [N]
float tx, ty, tz;             // Roll, pitch and yaw torques [N.m]

// System states
float phi, theta, psi;        // Euler angles [rad]
float wx, wy, wz;             // Angular velocities [rad/s]
float x, y, z;                // Positions [m]
float vx, vy, vz;             // Velocities [m/s]

// System references
float phi_r, theta_r, psi_r; // Euler angles reference [rad]
float x_r, y_r, z_r;         // Positions reference [m]
```

#### Variáveis de registro

Por fim, defina quais dessas variáveis serão utilizadas para registro, de modo que elas sejam enviados ao Crazyflie Client e seja possível visualizar nossas estimativas em tempo real(1).
{.annotate}

1. Nós utilizamos variáveis auxiliares para os ângulos de Euler pois o Crazyflie Client trabalha com ângulos em graus e não em radianos.

```c linenums="46"
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
```

### Funções

A segunda parte consiste na implementação das funções que serão chamadas no loop principal:

```c linenums="62"
// Get reference setpoints from commander module
void reference()
{
}

// Get sensor readings from estimator module
void sensors()
{
}

// Apply motor commands
void actuators()
{
}

// Compute motor commands
void mixer()
{
}

// Estimate orientation from IMU sensor
void attitudeEstimator()
{
}

// Compute desired torques
void attitudeController()
{
}

// Estimate vertical position/velocity from range sensor
void verticalEstimator()
{
}

// Compute desired thrust force
void verticalController()
{
}

// Estimate horizontal position/velocity from optical flow sensor
void horizontalEstimator()
{
}

// Compute desired roll/pitch angles
void horizontalController()
{
}
```

Note que estamos declarando toda as funções em branco. Fazemos isso pois a implementação será feita passo a passo, uma função por vez. Dessa forma, você poderá entender o papel de cada uma isoladamente antes de ver o sistema completo em ação.

![Architecture](images/architecture.gif){: width=100% style="display: block; margin: auto;" }

Nas próximas seções, começaremos pelas funções de referência, atuadores e sensores, que representam a interface do nosso código com o mundo real.
Em seguida, abordaremos o mixer e, depois, avançaremos para os estimadores e controladores. Cada subsistema será estudado em pares - estimador e controlador de atitude, vertical (altura) e horizontal (posição no plano) — abrangendo diferentes conceitos da teoria de controle clássico e moderno em uma sequência didática.

<div class="grid cards" markdown>

-   :material-power:{ .lg .middle } **Mixer**

    ---

    Implementamos uma transformação de coordenadas para trabalharmos com forças e torques aerodinâmicos como entrada do sistema ao invês de sinais PWM dos motores.

-   :material-rotate-orbit:{ .lg .middle } **Atitude**

    ---

    Estudamos filtros passa-baixa, passa-alta e o filtro complementar para fusão sensorial. A estabilização é feita com um controlador P–P em cascata, que atua sobre velocidade e ângulo, formando a base da malha mais rápida do sistema.

-   :material-pan-vertical:{ .lg .middle } **Vertical**

    ---

    Introduzimos o uso de observadores de estados de 1ª e 2ª ordem para estimar velocidade e posição vertical. Partimos de um controlador PD, que se transforma naturalmente em um PID ao lidar com o erro em regime permanente causado por distúrbios constantes, como a gravidade.

-   :material-pan-horizontal:{ .lg .middle } **Horizontal**

    ---

    Avançamos para um observador e regulador de estados ótimo. Mostramos que o LQE nada mais é do que um filtro de Kalman linear, enquanto o LQR equivale a um controlador PD com ganhos ideais. Quando utilizado em conjunto, integrando estimação e controle de maneira otimizada, temos o famoso LQG.

</div>

### Loop principal

A terceira e última parte consiste no loop principal. Toda a lógica de controle será implementada dentro de um loop que roda a 200 Hz (ou seja, a cada 5 ms). Dentro desse loop, chamamos as funções na sequência do diagrama: referências → sensores → estimadores → controladores → atuadores.

```c
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
        motors();                     // Send commands to motors
        vTaskDelay(pdMS_TO_TICKS(5)); // Loop delay (5 ms)
    }
}
``` -->

