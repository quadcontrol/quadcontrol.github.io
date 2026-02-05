---
title: Motor coefficients
icon: material/alpha-m-box-outline
---

# :material-alpha-m-box-outline: Motor coefficients

In this section, you will experimentally identify the electric motor model coefficients.

---

## Theoretical background

PWM (Pulse-Width Modulation) is a technique used to control the average power delivered by a digitally switched signal. By rapidly switching the signal between its maximum value and zero (on-off) and varying the fraction of time the signal stays at its maximum (duty cycle), you can control the average power delivered to the load (i.e., by modulating the pulse width).

![PWM1](images/pwm1.svg){: width="450" style="display: block; margin: auto;" }
![PWM2](images/pwm2.svg){: width="450" style="display: block; margin: auto;" }
![PWM3](images/pwm3.svg){: width="450" style="display: block; margin: auto;" }

This is the mechanism used by the Crazyflie to drive its motors. In code you can set a real value between `0.0` and `1.0`, which corresponds to the motor PWM.

You will implement a function that, given a desired angular velocity, computes the corresponding PWM value.

---

## Experimental procedure

To measure the propeller angular velocity, you will use a tachometer. The tachometer detects the interruption of light when the propeller blade crosses its light beam. The rotational speed is then computed by counting how many times this happens within a given time interval.

![](images/tachometer.png){: width="300" style="display: block; margin: auto;" }

The ++"POWER"++ button turns on the devide, while the ++"SET"++ button configure the number of blades of the propeller. The screen will display the current angular velocity in $\text{rpm}$, while the maximum value will be memorized as "peak" data at the bottom.

You must flash a program to the drone that turns on only one motor using a chosen PWM value. You will collect propeller angular velocity data for 10 distinct PWM values. For each PWM value, repeat the experiment 3 times and compute the average.

![](images/device1_experiment.gif){: width="100%" style="display: block; margin: auto;" }

To simplify the procedure, you can change the PWM command using the ++"Up"++ and ++"Down"++ buttons in the Command Based Flight Control, located at the bottom-right corner of the Crazyflie Client.

![Command Based Flight Control](images/command_based_flight_control.png){: width=40% style="display: block; margin: auto;" }

Create a file named `motor_coefficients.c` inside `src/identification` with the following code:

```c title="motor_coeficients.c"
#include "FreeRTOS.h"      // FreeRTOS core definitions (needed for task handling and timing)
#include "task.h"          // FreeRTOS task functions (e.g., vTaskDelay)
#include "supervisor.h"    // Functions to check flight status (e.g., supervisorIsArmed)
#include "commander.h"     // Access to commanded setpoints (e.g., commanderGetSetpoint)
#include "motors.h"        // Low-level motor control interface (e.g., motorsSetRatio)

// Global variables to store the desired setpoint, the current state (not used here) and the computed PWM value.
setpoint_t setpoint;
state_t state;
float pwm;

// Main application
void appMain(void *param)
{
    // Infinite loop (runs forever)
    while (true)
    {
        // Check if the drone is armed (i.e., ready to fly)
        if (supervisorIsArmed())
        {
            // Fetch the latest setpoint from the commander and also fetch the current estimated state (not used here)
            commanderGetSetpoint(&setpoint, &state);

            // Compute a PWM value proportional to the commanded altitude (Z axis position)
            // The altitude command increases in 0.5 m steps, and we want the PWM to increase by 0.1 for each step.
            // Therefore, we divide Z by 5.0 so that: 0.5 m → 0.1 PWM
            pwm = (setpoint.position.z) / 5.0f;
        }
        else
        {
            // If not armed, stop the motor (set PWM to zero)
            pwm = 0.0f;
        }
        // Send the PWM signal to motor M1, scaling it to match the expected range [0, UINT16_MAX]
        motorsSetRatio(MOTOR_M1, pwm * UINT16_MAX);
        // Wait for 100 milliseconds before running the next iteration (10 Hz control loop)
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}
```

Follow these measurement steps:

1. Make sure the drone battery is fully charged.
2. Fix the drone at the table using masking tape.
3. Arm the drone by clicking ++"Arm"++ in the Crazyflie Client.
4. Turn on the motor at a specific PWM value using ++"Up"++ and ++"Down"++ buttons in the Command Based Flight Control.
5. Turn on the tachometer by clicking ++"POWER"++.
6. Point the tachometer at the propeller from approximately $30~\text{cm}$ away.
7. Write down the peak data shown on the display.
8. Repeat steps 1–7 for the other PWM values.

After the experiment, fill in the table below:

| ${\color{var(--c3)}PWM}$  | ${\color{var(--c1)}\omega_1}$ | ${\color{var(--c1)}\omega_2}$ | ${\color{var(--c1)}\omega_3}$ |
|-------|----------|----------|----------|
| `0.1` |          |          |          |
| `0.2` |          |          |          |
| `0.3` |          |          |          |
| `0.4` |          |          |          |
| `0.5` |          |          |          |
| `0.6` |          |          |          |
| `0.7` |          |          |          |
| `0.8` |          |          |          |
| `0.9` |          |          |          |
| `1.0` |          |          |          |

---

## Data analysis

Using your dataset, fit a curve that relates the propeller angular velocity ${\color{var(--c1)}\omega}$(1) to the corresponding ${\color{var(--c3)}PWM}$ command.
{.annotate}

1. Note that you must convert from $\text{rpm}$ to $\text{rad/s}$

![PWM](images/pwm_graph.svg){: width=100% style="display: block; margin: auto;" }

There are many possible model choices for this curve (linear, exponential, polynomial, etc.):

$$
    {\color{var(--c3)}\text{PWM}} = f({\color{var(--c1)}\omega})
$$

To decide which one is most appropriate here, we need to look more closely at the system dynamics. A simplified electromechanical model of an electric motor driving a propeller is shown below(1).
{.annotate}

1. Although the Crazyflie uses a brushless DC motor (BLDC), its mathematical model at steady state is equivalent to a brushed DC motor.

![Electric Motor](images/electric_motor.svg){: width="600" style="display: block; margin: auto;" }

Where:

- ${\color{var(--c3)}e_a}$ — Armature voltage ($\text{V}$)
- ${\color{var(--c2)}i_a}$ — Armature current ($\text{A}$)
- ${\color{var(--c1)}e_b}$ — Back-EMF voltage ($\text{V}$)
- ${\color{var(--c2)}\tau_m}$ — Motor torque ($\text{N.m}$)
- ${\color{var(--c1)}\omega}$ — Motor/propeller angular velocity ($\text{rad/s}$)
- $R_a$ — Armature resistance ($\Omega$)
- $L_a$ — Armature inductance ($\text{H}$)
- $k_d$ — Propeller drag constant ($\text{N.m.s}^2\text{/rad}^2$)
- $b$ — Viscous friction coefficient ($\text{N.m.s/rad}$)
- $I$ — Motor/propeller moment of inertia ($\text{kg.m}^2$)

!!! question "Exercise 1"
    Apply Kirchhoff’s voltage law (KVL) to the armature circuit.
    ??? info "Answer"
        $$
        \begin{align*}
            \sum_{i=1}^n {\color{var(--c1)}e_i} &= 0 \\
            {\color{var(--c3)}e_a} - R_a {\color{var(--c2)}i_a} - L_a \frac{d}{dt} {\color{var(--c2)}i_a} - {\color{var(--c1)}e_b} &= 0
        \end{align*}
        $$

!!! question "Exercise 2"
    Apply Newton’s second law for rotation about the motor shaft.
    ??? info "Answer"
        $$
        \begin{align*}
            \sum_{i=1}^n \tau_i &= I \frac{d}{dt} {\color{var(--c1)}\omega} \\
            {\color{var(--c2)}\tau_m} - k_d {\color{var(--c1)}\omega}^2 - b {\color{var(--c1)}\omega} &= I \frac{d}{dt} {\color{var(--c1)}\omega}
        \end{align*}
        $$

For a DC motor, the motor torque ${\color{var(--c2)}\tau_m}$ is directly proportional to the armature current ${\color{var(--c2)}i_a}$, and the back-EMF voltage ${\color{var(--c1)}e_b}$ is directly proportional to the angular velocity ${\color{var(--c1)}\omega}$:

$$
{\color{var(--c2)}\tau_m} = K_m {\color{var(--c2)}i_a} 
\qquad
{\color{var(--c1)}e_b} = K_m {\color{var(--c1)}\omega}
$$

Where:

- $K_m$ - Motor torque constant ($\text{N.m/A}$ or $\text{V.s/rad}$).

!!! question "Exercise 3"
    Substitute ${\color{var(--c2)}\tau_m}$ and ${\color{var(--c1)}e_b}$ into the two differential equations obtained above.
    ??? info "Answer"
        $$
        \left\{
            \begin{array}{l}
                L_a \dfrac{d}{dt} {\color{var(--c2)}i_a} + R_a {\color{var(--c2)}i_a} + K_m {\color{var(--c1)}\omega} = {\color{var(--c3)}e_a} \\ \\
                I \dfrac{d}{dt} {\color{var(--c1)}\omega} + k_d {\color{var(--c1)}\omega}^2 + b {\color{var(--c1)}\omega} - K_m {\color{var(--c2)}i_a} = 0
            \end{array}
        \right.
        $$

When the motor reaches steady state, the armature current ${\color{var(--c2)}i_a}$ and angular velocity ${\color{var(--c1)}\omega}$ become constant (this is what “steady state” means):

$$
    \dfrac{d}{dt} {\color{var(--c2)}i_a} = 0 \qquad \dfrac{d}{dt} {\color{var(--c1)}\omega} = 0
$$

!!! question "Exercise 4"
    Set the derivatives of ${\color{var(--c2)}i_a}$ and ${\color{var(--c1)}\omega}$ to zero and isolate ${\color{var(--c2)}i_a}$ in both equations.
    ??? info "Answer"
        $$
        \begin{align*}
                L_a \cancelto{0}{\dfrac{d}{dt} {\color{var(--c2)}i_a}} + R_a {\color{var(--c2)}i_a} + K_m {\color{var(--c1)}\omega} &= {\color{var(--c3)}e_a} \\
                R_a {\color{var(--c2)}i_a} &= {\color{var(--c3)}e_a} - K_m {\color{var(--c1)}\omega} \\
                {\color{var(--c2)}i_a} &= \dfrac{1}{R_a} {\color{var(--c3)}e_a} - \dfrac{K_m}{R_a} {\color{var(--c1)}\omega}
        \end{align*}
        $$

        $$
        \begin{align*}
            I \cancelto{0}{\dfrac{d}{dt} {\color{var(--c1)}\omega}} + k_d {\color{var(--c1)}\omega}^2 + b {\color{var(--c1)}\omega} - K_m {\color{var(--c2)}i_a} &= 0 \\
            K_m {\color{var(--c2)}i_a} &= k_d {\color{var(--c1)}\omega}^2 + b {\color{var(--c1)}\omega} \\
            {\color{var(--c2)}i_a} &= \dfrac{k_d}{K_m} {\color{var(--c1)}\omega}^2 + \dfrac{b}{K_m} {\color{var(--c1)}\omega}
        \end{align*}
        $$

!!! question "Exercise 5"
    Equate the two expressions for ${\color{var(--c2)}i_a}$ and isolate the armature voltage ${\color{var(--c3)}e_a}$.
    ??? info "Answer"
        $$
        \begin{align*}
            \dfrac{1}{R_a} {\color{var(--c3)}e_a} - \dfrac{K_m}{R_a} {\color{var(--c1)}\omega} &= \dfrac{k_d}{K_m} {\color{var(--c1)}\omega}^2 + \dfrac{b}{K_m} {\color{var(--c1)}\omega}\\
            \dfrac{1}{R_a} {\color{var(--c3)}e_a} &= \dfrac{k_d}{K_m} {\color{var(--c1)}\omega}^2 + \dfrac{b}{K_m} {\color{var(--c1)}\omega} + \dfrac{K_m}{R_a} {\color{var(--c1)}\omega} \\
            {\color{var(--c3)}e_a} &= \dfrac{R_a k_d}{K_m} {\color{var(--c1)}\omega}^2 + \dfrac{R_a b + K_m^2}{K_m} {\color{var(--c1)}\omega}
        \end{align*}
        $$

The ${\color{var(--c3)}\text{PWM}}$ command is the ratio between the armature voltage ${\color{var(--c3)}e_a}$ and the battery supply voltage $e_s$:

$$
    {\color{var(--c3)}\text{PWM}} = \frac{{\color{var(--c3)}e_a}}{e_s}
$$

!!! question "Exercise 6"
    Substitute ${\color{var(--c3)}e_a}$ into the equation above and isolate ${\color{var(--c3)}PWM}$.
    ??? info "Answer"
        $$
        \begin{align*}
            {\color{var(--c3)}\text{PWM}} &= \frac{{\color{var(--c3)}e_a}}{e_s} \\
            {\color{var(--c3)}\text{PWM}} &= \frac{\dfrac{R_a k_d}{K_m} {\color{var(--c1)}\omega}^2 + \dfrac{R_a b + K_m^2}{K_m} {\color{var(--c1)}\omega}}{e_s} \\
            {\color{var(--c3)}\text{PWM}} &= \dfrac{R_a k_d}{K_m e_s} {\color{var(--c1)}\omega}^2 + \dfrac{R_a b + K_m^2}{K_m e_s} {\color{var(--c1)}\omega}
        \end{align*}
        $$

You should obtain:

$$
    {\color{var(--c3)}\text{PWM}} =\dfrac{R_a k_d}{K_m e_s} {\color{var(--c1)}\omega}^2 + \dfrac{R_a b + K_m^2}{K_m e_s} {\color{var(--c1)}\omega}
$$

Since $R_a$, $k_d$, $b$, $K_m$, and $e_s$ are constant, we can group them into two coefficients:

$$
    {\color{var(--c3)}\text{PWM}} = \underbrace{\dfrac{R_a k_d}{K_m e_s}}_{a_2} \, {\color{var(--c1)}\omega}^2
               + \underbrace{\dfrac{R_a b + K_m^2}{K_m e_s}}_{a_1} \, {\color{var(--c1)}\omega}
$$

That is, the most appropriate curve fit here is a second-order polynomial with zero constant term:

$$
    {\color{var(--c3)}\text{PWM}} = a_2 {\color{var(--c1)}\omega}^2 + a_1 {\color{var(--c1)}\omega} + \cancelto{0}{a_0}
$$

So, instead of identifying each physical parameter ($R_a$, $k_d$, $b$, $K_m$, and $e_s$), you will experimentally identify only the coefficients $a_2$ and $a_1$(1).
{.annotate} 

1. Tip: use MATLAB’s Curve Fitting Toolbox.

---

## Results validation

Once you have estimated $a_2$ and $a_1$, declare their values in the code and modify your program so that, given a commanded angular velocity ${\color{var(--c1)}\omega}$, it computes the corresponding PWM value and sends it to motor M1.

```c title="motor_coeficients.c"
#include "FreeRTOS.h"      // FreeRTOS core definitions (needed for task handling and timing)
#include "task.h"          // FreeRTOS task functions (e.g., vTaskDelay)
#include "supervisor.h"    // Functions to check flight status (e.g., supervisorIsArmed)
#include "commander.h"     // Access to commanded setpoints (e.g., commanderGetSetpoint)
#include "motors.h"        // Low-level motor control interface (e.g., motorsSetRatio)

// Motor coefficients of the quadratic model: PWM = a_2 * omega^2 + a_1 * omega
const float a_2 = 0.0f;
const float a_1 = 0.0f;

// Global variables to store the desired setpoint, the current state (not used here), 
// the computed PWM value, and the desired angular velocity (omega)
setpoint_t setpoint;
state_t state;
float pwm;
float omega;

// Main application
void appMain(void *param)
{
    // Infinite loop (runs forever)
    while (true)
    {
        // Check if the drone is armed (i.e., ready to fly)
        if (supervisorIsArmed())
        {
            // Fetch the latest setpoint from the commander and also fetch the current estimated state (not used here)
            commanderGetSetpoint(&setpoint, &state);

            // Compute an angular velocity value proportional to the commanded altitude (Z axis position)
            // The altitude command increases in 0.5 m steps, and we want the angular velocity to increase 
            // by 200 rad/s for each step. Therefore, we multiply Z by 400.0 so that: 0.5 m → 200 rad/s
            omega = (setpoint.position.z) * 400.0f;

            // Convert angular velocity to PWM using the motor model: PWM = a_2 * omega^2 + a_1 * omega
            pwm = a_2 * omega * omega + a_1 * omega;
        }
        else
        {
            // If not armed, stop the motors (set PWM to zero)
            pwm = 0.0f;
        }

        // Send the PWM signal to motors M1, scaling it to match the expected range [0, UINT16_MAX]
        motorsSetRatio(MOTOR_M1, pwm * UINT16_MAX);

        // Wait for 100 milliseconds before running the next iteration (10 Hz control loop)
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}
```

This code uses Command Based Flight Control to command ${\color{var(--c1)}\omega}$ in steps of $200\,\text{rad/s}$. Test it by checking whether the commanded angular velocity is close(1) to the tachometer reading.
{.annotate}

1. It will not match perfectly because we are using a curve fit. This is not a problem, since we will later close the loop at a higher control level.


<!-- ---
title: Coeficientes do motor 
icon: material/alpha-m-box-outline
---

# :material-alpha-m-box-outline: Coeficientes do motor

Nesta secção, você irá determinar experimentalmente os coeficientes do motor elétrico.

---

## Fundamentos teóricos


O PWM ("pulse width modulation") é uma técnica para controlar a potência de um sinal utilizando uma comutação digital. Ao mudar rapidamente o sinal entre o máximo e zero ("on-off"), e variando a fração de tempo que o sinal está no máximo, pode-se controlar a potência transmitida (isto é, modulando a largura do pulso).

![PWM1](images/pwm1.svg){: width="450" style="display: block; margin: auto;" }
![PWM2](images/pwm2.svg){: width="450" style="display: block; margin: auto;" }
![PWM3](images/pwm3.svg){: width="450" style="display: block; margin: auto;" }

Este é o mecanismo utilizado pelo Crazyflie para acionar seus motores. Já [sabemos](../sensors_and_actuators/motors.md) que no código é possível definir um valor real entre `0.0` e `1.0` que corresponde ao sinal PWM do motor. 
    
Você irá implementar uma função que, dada uma velocidade angular desejada $\omega$, determine o sinal PWM correspondente. 

---

## Procedimento experimental

Para medir a velocidade angular da hélice, você pode utilizar um instrumento de medição do número de rotações chamado tacômetro. Para utilizá-lo, você deve fixar um pequeno pedaço de fita refletora em uma das hélices. Certifique-se de usar apenas um pequeno pedaço de fita e aplicar suavemente na hélice, caso contrário você interferirá no fluxo de ar e obterá dados ruins. 

![Reflective Strip](images/reflective_strip.jpeg){: width="450" style="display: block; margin: auto;" }

O tacômetro pode detectar quando a tira passa pelo seu feixe de luz, assim, a velocidade de rotação é calculada contando quantas vezes a tira passa em um determinado período de tempo. O tacômetro DT-2234C+ registra a velocidade angular enquanto você pressiona o botão `TEST` e, uma vez que este botão é liberado, ele armazena os valores mínimo, máximo e médio, que você pode conferir apertando o botão `MEM`.
    
![Tachometer](images/tachometer.png){: width="450" style="display: block; margin: auto;" }

Você deve carregar no drone um programa que ligue apenas o motor cuja hélice está com o pedaço de fita refletora com um determinado valor de sinal PWM. Serão levantados dados de velocidade angular da hélice para 10 valores distintos de sinal PWM (`0.1` até `1.0`), e, para cada valor de sinal PWM, você deverá realizar o experimento 3 vezes e tirar uma média. Para facilitar o experimento, você pode controlar o valor do PWM com os botões `Up` e `Down` do Command Based Flight Control através do CFClient.

![Commando Based Flight Control](images/command_based_flight_control.png){: width=100% style="display: block; margin: auto;" }

Crie um arquivo chamado `motor_coeficients.c` dentro da pasta `src/identification` com o seguinte código:

```c title="motor_coeficients.c"
#include "FreeRTOS.h"      // FreeRTOS core definitions (needed for task handling and timing)
#include "task.h"          // FreeRTOS task functions (e.g., vTaskDelay)
#include "supervisor.h"    // Functions to check flight status (e.g., supervisorIsArmed)
#include "commander.h"     // Access to commanded setpoints (e.g., commanderGetSetpoint)
#include "motors.h"        // Low-level motor control interface (e.g., motorsSetRatio)

// Global variables to store the desired setpoint, the current state (not used here) and the computed PWM value.
setpoint_t setpoint;
state_t state;
float pwm;

// Main application
void appMain(void *param)
{
    // Infinite loop (runs forever)
    while (true)
    {
        // Check if the drone is armed (i.e., ready to fly)
        if (supervisorIsArmed())
        {
            // Fetch the latest setpoint from the commander and also fetch the current estimated state (not used here)
            commanderGetSetpoint(&setpoint, &state);

            // Compute a PWM value proportional to the commanded altitude (Z axis position)
            // The altitude command increases in 0.5 m steps, and we want the PWM to increase by 0.1 for each step.
            // Therefore, we divide Z by 5.0 so that: 0.5 m → 0.1 PWM
            pwm = (setpoint.position.z) / 5.0f;
        }
        else
        {
            // If not armed, stop the motor (set PWM to zero)
            pwm = 0.0f;
        }
        // Send the PWM signal to motor M1, scaling it to match the expected range [0, UINT16_MAX]
        motorsSetRatio(MOTOR_M1, pwm * UINT16_MAX);
        // Wait for 100 milliseconds before running the next iteration (10 Hz control loop)
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}
```

As etapas para coletar um dado são as seguintes:

1. Garanta que a bateria do drone está carregada 
2. Prenda o drone na mesa com uma fita crepe
3. Arme o drone apertando o botão `Arm` no CFClient
4. Ligue o motor com um valor específico de sinal PWM com o Command Based Flight Control do CFClient
5. Aponte o tacômetro para a hélice segurando a aproximadamente $30cm$ de distância e, em seguida, pressione o botão `TEST`  
6. Mantenha o botão `TEST` pressionado o tempo todo, certificando-se de que o feixe aponta para onde a faixa refletora passa  
7. Mantenha essa posição por alguns segundos e solte o botão `TEST`  
8. Pressione o botão `MEM` uma vez e espere aparecer a segunda leitura, que corresponde à velocidade máxima (em $rpm$) observada durante o experimento  
9. Anote o número que aparece na tela
10. Repita as etapas 4-9 para outros valores de sinal PWM

Após o experimento, você deverá coletar dados para preencher a tabela abaixo.

| PWM   | N1 (rpm) | N2 (rpm) | N3 (rpm) |
|-------|----------|----------|----------|
| `0.1` |          |          |          |
| `0.2` |          |          |          |
| `0.3` |          |          |          |
| `0.4` |          |          |          |
| `0.5` |          |          |          |
| `0.6` |          |          |          |
| `0.7` |          |          |          |
| `0.8` |          |          |          |
| `0.9` |          |          |          |
| `1.0` |          |          |          |

---

## Análise de dados

Utilizando os dados coletados, você deverá ajustar uma curva que correlacione a velocidade angular das hélice $\omega$ com o sinal PWM correspondente do motor (note que você precisa converter a velocidade angular de $rpm$ para $rad/s$).

![PWM](images/pwm_graph.svg){: width=100% style="display: block; margin: auto;" }

Há diversos tipos de funções de ajuste para esta curva (linear, exponencial, polinomial, etc.):
    
$$
    \text{PWM} = f(\omega)
$$

Para definir qual é melhor para este caso, é necessário se aprofundar na dinâmica do sistema. O esquema eletromecânico de um motor elétrico com uma hélice pode ser visto no diagrama abaixo[^1].

[^1]: Embora o Crazyflie utilize um motor elétrico de corrente contínua sem escovas e não com escovas, a equação matemática de ambos é equivalente.

![Electric Motor](images/electric_motor.svg){: width="600" style="display: block; margin: auto;" }


Onde:


- $e_a$ - Tensão de armadura ($V$)
- $i_a$ - Corrente de armadura ($A$)
- $R_a$ - Resistência de armadura ($\Omega$)
- $L_a$ - Indutância de armadura ($H$)
- $e_b$ - Tensão contra-eletromotriz ($V$)
- $\omega$ - Velocidade angular do motor/hélice ($rad/s$)
- $\tau_m$ - Torque do motor ($N.m$)
- $k_d$ - Constante de arrasto da hélice ($N.m.s^2/rad^2$)
- $b$ - Coeficiente de atrito viscoso do motor ($N.m.s/rad$)
- $I$ - Momento de inércia do motor/hélice ($kg.m^2$)

!!! question "Exercício 1"
    Aplique a lei de Kirchoff das tensões no circuito de armadura.
    ??? info "Resposta"
        $$
        \begin{align*}
            \sum_{i=1}^n e_i &= 0 \\
            e_a - R_a i_a - L_a \frac{d}{dt} i_a - e_b &= 0
        \end{align*}
        $$

!!! question "Exercício 2"
    Aplique a 2º lei de Newton em torno do eixo do motor.
    ??? info "Resposta"
        $$
        \begin{align*}
            \sum_{i=1}^n \tau_i &= I \frac{d}{dt} \omega \\
            \tau_m - k_d \omega^2 - b \omega &= I \frac{d}{dt} \omega
        \end{align*}
        $$

Em um motor de corrente contínua, o torque do motor $\tau_m$ é diretamente proporcional à corrente de armadura $i_a$, e a tensão contra-eletromotriz $e_b$ é diretamente proporcional à velocidade angular $\omega$:

$$
\tau_m = K_m i_a 
\qquad
e_b = K_m \omega   
$$

Onde:

- $K_m$ - Constante de torque do motor ($N.m/A$ ou $V.s/rad$).

!!! question "Exercício 3"
    Substitua o torque do motor $\tau_m$ e a tensão contra-eletromotriz $e_b$ nas duas equações diferenciais obtidas anteriormente.
    ??? info "Resposta"
        $$
        \left\{
            \begin{array}{l}
                L_a \dfrac{d}{dt} i_a + R_a i_a + K_m \omega = e_a \\ \\
                I \dfrac{d}{dt} \omega + k_d \omega^2 + b \omega - K_m i_a = 0
            \end{array}
        \right.
        $$

Quando o motor entra em regime, a corrente de armadura $i_a$ e a velocidade angular $\omega$ tornam-se constantes (essa é a definição de ``regime''):

$$
    \dfrac{d}{dt} i_a = 0 \qquad \dfrac{d}{dt} \omega = 0
$$

!!! question "Exercício 4"
    Iguale as derivadas da corrente de armadura $i_a$ e da velocidade angular $\omega$ a zero e isole a corrente de armadura $i_a$ nas duas equações.
    ??? info "Resposta"
        $$
        \begin{align*}
                L_a \cancelto{0}{\dfrac{d}{dt} i_a} + R_a i_a + K_m \omega &= e_a \\
                R_a i_a &= e_a - K_m \omega \\
                i_a &= \dfrac{1}{R_a} e_a - \dfrac{K_m}{R_a} \omega
        \end{align*}
        $$

        $$
        \begin{align*}
            I \cancelto{0}{\dfrac{d}{dt} \omega} + k_d \omega^2 + b \omega - K_m i_a &= 0 \\
            K_m i_a &= k_d \omega^2 + b \omega \\
            i_a &= \dfrac{k_d}{K_m} \omega^2 + \dfrac{b}{K_m} \omega
        \end{align*}
        $$

!!! question "Exercício 5"
    Iguale a corrente de armadura $i_a$ obtida em cada uma das equações e isole a tensão de armadura $e_a$ na equação.
    ??? info "Resposta"
        $$
        \begin{align*}
            \dfrac{1}{R_a} e_a - \dfrac{K_m}{R_a} \omega &= \dfrac{k_d}{K_m} \omega^2 + \dfrac{b}{K_m} \omega\\
            \dfrac{1}{R_a} e_a &= \dfrac{k_d}{K_m} \omega^2 + \dfrac{b}{K_m} \omega + \dfrac{K_m}{R_a} \omega \\
            e_a &= \dfrac{R_a k_d}{K_m} \omega^2 + \dfrac{R_a b + K_m^2}{K_m} \omega
        \end{align*}
        $$

 O sinal PWM é a razão entre a tensão de armadura $e_a$ e a tensão da bateria $e_s$:
    
$$
    \text{PWM} = \frac{e_a}{e_s}
$$

!!! question "Exercício 6"
    Substitua a tensão de armadura $e_a$ na equação anterior e isole o sinal PWM na equação.
    ??? info "Resposta"
        $$
        \begin{align*}
            e_a &= \dfrac{R_a k_d}{K_m} \omega^2 + \dfrac{R_a b + K_m^2}{K_m} \omega \\
            e_s \text{PWM} &= \dfrac{R_a k_d}{K_m} \omega^2 + \dfrac{R_a b + K_m^2}{K_m} \omega \\
            \text{PWM} &= \dfrac{R_a k_d}{K_me_s} \omega^2 + \dfrac{R_a b + K_m^2}{K_me_s} \omega
        \end{align*}
        $$

Você deve ter chegado a:
    
$$
    \text{PWM} =\dfrac{R_a k_d}{K_me_s} \omega^2 + \dfrac{R_a b + K_m^2}{K_me_s} \omega
$$

Como $R_a$, $k_d$, $b$, $K_m$ e $e_s$ são parâmetros constantes, podemos agrupá-los em duas constantes:

$$
    \text{PWM} = \underbrace{\dfrac{R_a k_d}{K_me_s}}_{a_2} \omega^2 + \underbrace{\dfrac{R_a b + K_m^2}{K_me_s}}_{a_1} \omega
$$

Ou seja, o tipo de função mais adequado para realizar esse ajuste de curva é uma função polinomial de 2º grau cujo coeficiente de ordem zero é nulo:

$$
    \text{PWM} = a_2 \omega^2 + a_1 \omega + \cancelto{0}{a_0}	
$$

Dessa forma, ao invés de determinar os valores de cada parâmetro ($R_a$, $k_d$, $b$, $K_m$ e $e_s$), você irá determinar experimentalmente apenas os valores dos coeficientes $a_2$ e $a_1$ (dica: utilize o Curve Fitting Toolbox do MATLAB).

---

## Validação dos resultados

Uma vez determinados os coeficientes $a_2$ e $a_1$, declare os seus valores no código (linhas 10 e 11) e modifique seu programa para que, dada uma velocidade angular $\omega$ comandada (linhas 30 e 35), ele determine o sinal PWM correspondente (linha 41) e envie isso ao motor M1 (linha 50). Note que estamos imprimindo no console o valor de velocidade angular comandada (linha 38) e, para isso, devemos incluir uma biblioteca adicional (linha 6).

```c title="motor_coeficients.c"
#include "FreeRTOS.h"      // FreeRTOS core definitions (needed for task handling and timing)
#include "task.h"          // FreeRTOS task functions (e.g., vTaskDelay)
#include "supervisor.h"    // Functions to check flight status (e.g., supervisorIsArmed)
#include "commander.h"     // Access to commanded setpoints (e.g., commanderGetSetpoint)
#include "motors.h"        // Low-level motor control interface (e.g., motorsSetRatio)
#include "debug.h"         // Debug printing functions (e.g., DEBUG_PRINT)

// Motor coefficients of the quadratic model: PWM = a_2 * omega^2 + a_1 * omega
const float a_2 = 0.0f;
const float a_1 = 0.0f;

// Global variables to store the desired setpoint, the current state (not used here), 
// the computed PWM value, and the desired angular velocity (omega)
setpoint_t setpoint;
state_t state;
float pwm;
float omega;

// Main application
void appMain(void *param)
{
    // Infinite loop (runs forever)
    while (true)
    {
        // Check if the drone is armed (i.e., ready to fly)
        if (supervisorIsArmed())
        {
            // Fetch the latest setpoint from the commander and also fetch the current estimated state (not used here)
            commanderGetSetpoint(&setpoint, &state);

            // Compute an angular velocity value proportional to the commanded altitude (Z axis position)
            // The altitude command increases in 0.5 m steps, and we want the angular velocity to increase 
            // by 200 rad/s for each step. Therefore, we multiply Z by 400.0 so that: 0.5 m → 200 rad/s
            omega = (setpoint.position.z) * 400.0f;

            // Print the computed omega value to the debug console (rounded to nearest integer)
            DEBUG_PRINT("Omega (rad/s): %.0f\n", (double)omega);

            // Convert angular velocity to PWM using the motor model: PWM = a_2 * omega^2 + a_1 * omega
            pwm = a_2 * omega * omega + a_1 * omega;
        }
        else
        {
            // If not armed, stop the motors (set PWM to zero)
            pwm = 0.0f;
        }

        // Send the PWM signal to motors M1, scaling it to match the expected range [0, UINT16_MAX]
        motorsSetRatio(MOTOR_M1, pwm * UINT16_MAX);

        // Wait for 100 milliseconds before running the next iteration (10 Hz control loop)
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}
```

O código acima faz uso do Command Based Flight Control para comandar a velocidade angular $\omega$ em incrementos de $200rad/s$. Você deve testá-lo verificando se a velocidade angular comandada está próxima[^2] da leitura do tacômetro.

[^2]: Ela não vai bater na vírgula, pois fizemos um ajuste de curva. No entanto, essa divergência não será um problema pois ainda vamos fechar a malha de controle em um nível superior. -->