# Arquitetura

Para controlar um drone de forma estável, precisamos de uma arquitetura clara de processamento de sinais e comandos. Essa arquitetura define como as informações dos sensores percorrem o sistema, são processadas por estimadores e controladores e, por fim, viram comandos dos motores.

O diagrama abaixo resume essa sequência em blocos:

![Architecture](images/architecture_horizontal_controller.svg){: width=100% style="display: block; margin: auto;" }

No diagrama:

- Os blocos representam funções que serão chamadas no loop principal.
- As setas representam as variáveis (sinais) que fluem de um bloco para outro.

A passagem desses sinais entre as funções será feita por variáveis globais(1), que atuarão como o “fio” que conecta os módulos do sistema.
{ .annotate }

1. Sabemos que variáveis globais não são a melhor prática em programação. No entanto, como estamos programando tudo em C e cada função precisaria receber e retornar múltiplos parâmetros, essa prática acaba sendo mais simples do que utilizar ponteiros, semáforos etc. Como o foco aqui é mais na teoria de controle do que em engenharia de software, seguiremos dessa forma.

---

## Estrutura das variáveis globais

Logo no início do código, declararemos as variáveis que representam atuadores, sensores, entradas, estados e referências — espelhando o diagrama e deixando claro “quem fala com quem” no controle.

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

Toda a lógica do sistema será implementada dentro de um loop que roda a 200 Hz (ou seja, a cada 5 ms). Esse ciclo rápido é necessário porque drones são sistemas dinâmicos muito instáveis: se o controle atrasar, o drone não consegue se equilibrar.

Dentro do loop, chamamos as funções na ordem do diagrama: primeiro coletamos leituras, depois estimamos estados, então calculamos os sinais de controle e, por fim, aplicamos os comandos aos motores.

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

A implementação será feita passo a passo, uma função de cada vez. Dessa forma, você poderá entender a função de cada bloco isoladamente antes de ver o sistema completo em ação.
Nos próximos capítulos, vamos começar pelo mixer, depois evoluir para os estimadores e controladores, até chegar ao mixer e aos motores. Ao final, você terá construído — linha por linha — uma arquitetura de controle completa para drones.

No fim desse percurso, você terá construído — bloco a bloco — uma arquitetura de controle completa para drones, entendendo tanto o papel de cada função quanto o caminho que cada variável percorre pelo sistema.

Nos vamos implementar uma função por vez para que você possa ir entendendo cada passo.
