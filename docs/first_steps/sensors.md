# Sensores

Nesta secção, vamos aprender como ler os dados dos sensores do drone em tempo real. Esses dados são fundamentais para tarefas como estabilização, controle, navegação e autonomia.

Vamos criar um programa que lê e imprime no console os seguintes sensores:

- Acelerômetro ($a_x$, $a_y$ e $a_z$)
- Giroscópio ($g_x$, $g_y$ e $g_z$)
- Lidar ($d$)
- Fluxo óptico ($p_x$ e $p_y$)

---

## Visão geral

Antes de começar, é importante entender alguns conceitos:

- Os sensores no Crazyflie são processados por um sistema de estimação que envia os dados via uma fila interna. Usamos a função `estimatorDequeue(&m)`, para preencher a estrutura `measurement_t m`, que contém diferentes tipos de leitura, identificados por `m.type`.
- O sistema coleta dados continuamente em alta frequência, que vêm da IMU (acelerômetro e giroscópio), do lidar e da câmera de fluxo óptico.
- Usamos `DEBUG_PRINT()` para exibir os valores no console serial.

---

## Código

Crie um arquivo chamado `sensors.c` dentro da pasta `src/examples` com o seguinte conteúdo:

```c title="sensors.c"
#include "FreeRTOS.h"   // FreeRTOS core definitions (needed for task handling and timing)
#include "task.h"       // FreeRTOS task functions (e.g., vTaskDelay)
#include "supervisor.h" // Functions to check flight status (e.g., supervisorIsArmed)
#include "debug.h"      // Debug printing functions (e.g., DEBUG_PRINT)
#include "estimator.h"  // Estimator functions (e.g., estimatorDequeue)

// Sensors data
float ax, ay, az; // Accelerometer [m/s^2]
float gx, gy, gz; // Gyroscope [rad/s]
float d;          // Range [m]
float px, py;     // Optical flow [pixels]

// Main application loop
void appMain(void *param)
{
    // Infinite loop (runs continuously while the drone is powered on)
    while (true)
    {
        // Get sensor data from queue
        measurement_t m;
        while (estimatorDequeue(&m))
        {
            switch (m.type)
            {
            case MeasurementTypeGyroscope:
                gx = m.data.gyroscope.gyro.x;
                gy = m.data.gyroscope.gyro.y;
                gz = m.data.gyroscope.gyro.z;
                break;
            case MeasurementTypeAcceleration:
                ax = m.data.acceleration.acc.x;
                ay = m.data.acceleration.acc.y;
                az = m.data.acceleration.acc.z;
                break;
            case MeasurementTypeTOF:
                d = m.data.tof.distance;
            case MeasurementTypeFlow:
                px = m.data.flow.dpixelx;
                py = m.data.flow.dpixely;
            default:
                break;
            }
        }
        // Print sensor data to console
        DEBUG_PRINT("Acc: %4.2f %4.2f %4.2f | Gyr: %6.2f %6.2f %6.2f | Dis: %4.2f | Flow: %2.0f %2.0f %6.4f\n",(double)ax,(double)ay,(double)az,(double)gx,(double)gy,(double)gz,(double)d,(double)px,(double)py);
        // Wait for 100 milliseconds before checking again (10 Hz loop)
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}
```

Você pode simplesmente copiar e colar o código acima. Mas é importante que você leia e entenda o que cada linha está fazendo (o código está bem comentado).

---

## Compilando

Para que o firmware compile seu novo programa, modifique o arquivo `Kbuild`:

```c title="Kbuild"
obj-y += src/examples/sensors.o
```

Em seguida, compile e programe o quadricoptero.

---

## Testando

Para testar o funcionamento, siga as etapas abaixo:

1. Abra o Crazyflie Client e conecte-se ao drone.
2. Clique em `View` > `Toolboxes` > `Console`
3. Verifique se os dados dos sensores estão sendo impressos

!!! warning "Atenção"
    Movimente o drone com a mão e observe a variação dos sensores em tempo real.

Agora você sabe como acessar dados brutos dos sensores do drone. Esses dados são a base para algoritmos de controle, filtros e navegação. A partir daqui, você terá todo o poder necessário para construir sistemas embarcados inteligentes — do jeito que quiser!
