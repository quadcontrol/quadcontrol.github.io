# Arquitetura

Para controlar um drone, precisamos de uma arquitetura bem definida. Essa arquitetura estabelece como as informações dos sensores são processadas por estimadores, comparadas com as referências pelos controladores e, por fim, enviadas como comandos aos motores.

O diagrama abaixo resume essa sequência em blocos:

![Architecture](images/architecture_horizontal_controller.svg){: width=100% style="display: block; margin: auto;" }

No diagrama:

- Os blocos representam as funções que serão chamadas no loop principal.
- As setas representam as variáveis que fluem de um bloco para outro.

A passagem dessas informações entre as funções será feita por meio de variáveis globais(1), que atuarão como o “fio” que conecta os módulos do sistema.
{ .annotate }

1. Embora variáveis globais não sejam a melhor prática em programação, aqui adotamos essa solução para manter o código em C mais direto, evitando o excesso de ponteiros e semáforos. Como o foco do curso está na teoria de controle — e não em engenharia de software — essa escolha facilita a compreensão sem comprometer o aprendizado.

---

## Estrutura das variáveis globais

Logo no início do código, declararemos as variáveis que representam os atuadores, sensores, entradas, estados e referências — espelhando o diagrama.

```c
// Motors
float pwm1, pwm2, pwm3, pwm4; // PWM

// Sensors
float ax, ay, az;             // Accelerometer [m/s^2]
float gx, gy, gz;             // Gyroscope [rad/s]
float d;                      // Range [m]
float px, py;                 // Optical flow [pixels]

// System inputs
float ft;                     // Thrust force [N]
float tx, ty, tz;             // Torques [N.m]

// System states
float phi, theta, psi;        // Euler angles [rad]
float wx, wy, wz;             // Angular velocity [rad/s]
float x, y, z;                // Position [m]
float vx, vy, vz;             // Velocity [m/s]

// System references
float phi_r, theta_r, psi_r; // Euler angles [rad]
float x_r, y_r, z_r;         // Position [m]
```

---

## Loop principal de controle

Toda a lógica de controle será implementada dentro de um loop que roda a 200 Hz (ou seja, a cada 5 ms). Dentro desse loop, chamamos as funções na ordem do diagrama: primeiro os sensores, depois os estimadores, então os controladores e, por fim, os atuadores.

```c
// Main application task
void appMain(void *param)
{
    // Infinite loop (runs at 200Hz)
    while (true)
    {
        reference();                  // Get reference setpoints from commander module
        sensors();                    // Get sensor readings from estimator module
        attitudeEstimator();          // Estimate orientation from IMU sensor
        verticalEstimator();          // Estimate vertical position/velocity from range sensor
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

---

## Como vamos avançar

A implementação será feita passo a passo, uma função por vez. Dessa forma, você poderá entender o papel de cada bloco isoladamente antes de ver o sistema completo em ação.

![Architecture](images/architecture.gif){: width=100% style="display: block; margin: auto;" }

Nos próximos capítulos, vamos começar pelo mixer, depois evoluir para os estimadores e controladores. Ao final, você terá construído — bloco a bloco — uma arquitetura de controle completa para drones.