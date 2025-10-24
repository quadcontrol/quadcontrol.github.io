---
title: Atuadores
icon: material/engine-outline
---

# Atuadores

Nesta secção, vamos fazer o drone girar um de seus motores pela primeira vez. Esse é o seu primeiro contato com controle real de hardware, um passo fundamental rumo ao voo autônomo.

Vamos criar um programa simples que liga o motor 1 com 10% de potência, sempre que o drone estiver armado (ou seja, autorizado a voar).

---

## Visão geral

Antes de começar, é importante entender alguns conceitos:

- Armar o drone significa autorizar o funcionamento dos motores. Isso é feito manualmente pelo operador através do Crazyflie Client e verificado no código com a função `supervisorIsArmed()`.
- O controle dos motores é feito através da função `motorsSetRatio(id, ratio)`, onde `id` corresponde ao motor que vai ser acionado e `ratio` à sua potência.
    - O Crazyflie possui quatro motores, identificados como `MOTOR_M1`, `MOTOR_M2`, `MOTOR_M3` e `MOTOR_M4`.
    - A potência vai de `0` (desligado) até `UINT16_MAX` (potência máxima).
- Em FreeRTOS, um delay é realizado através da função `vTaskDelay(pdMS_TO_TICKS(xTimeInMs))`, que recebe um tempo em milissegundos e o converte para ticks do sistema.

---

## Código

Crie um arquivo chamado `motors.c` dentro da pasta `src/examples` com o seguinte código:

```c title="motors.c"
#include "FreeRTOS.h"      // FreeRTOS core definitions (needed for task handling and timing)
#include "task.h"          // FreeRTOS task functions (e.g., vTaskDelay)
#include "supervisor.h"    // Functions to check flight status (e.g., supervisorIsArmed)
#include "motors.h"        // Low-level motor control interface (e.g., motorsSetRatio)
#include "debug.h"         // Debug printing functions (e.g., DEBUG_PRINT)

// Main application loop
void appMain(void *param)
{
    // Infinite loop (runs continuously while the drone is powered on)
    while (true)
    {
        // Check if the drone is armed (i.e., ready to receive motor commands)
        if (supervisorIsArmed())
        {
            // If armed, turn on motor 1 with 10% power
            motorsSetRatio(MOTOR_M1, 0.1f * UINT16_MAX);
        }
        else
        {
            // If not armed, stop motor 1
            motorsSetRatio(MOTOR_M1, 0);
        }
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
obj-y += src/examples/motors.o
```

Em seguida, compile e programe o quadricoptero.

---

## Testando

Para testar o funcionamento, siga as etapas abaixo:

1. Abra o Crazyflie Client e conecte-se ao drone.
2. Clique no botão `Arm`.
3. O motor 1 deve começar a girar com 10% de potência.
4. Ao clicar em `Disarm`, o motor deve parar imediatamente.

!!! warning "Atenção"
    O motor vai girar, mas o drone não vai levantar voo, pois estamos controlando apenas um motor isolado com baixa potência.

Você acaba de escrever seu primeiro programa que interage com o hardware real do drone — controlando motores com segurança. Um passo simples, mas poderoso, no caminho do voo autônomo.