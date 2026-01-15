---
title: Firmware
icon: material/memory
---

# :material-memory: Firmware

Now that your environment is ready, it’s time to get your hands dirty with the drone’s code.

In this section, you will learn how to download, configure, and compile the firmware that runs on the Crazyflie, getting everything ready to test your own code on the real drone.

---

## Visual Studio Code

We will use Visual Studio Code as our IDE.


1. Download and install Visual Studio Code from its [official website](https://code.visualstudio.com/Download){target=_blank}.

---

## Repository

Before you start programming, we need to bring the firmware code to your machine. We’ll do this in two steps: first, you create a copy (*fork*) of the repository, and then you donwload (*clone*) that copy to your computer.

### Fork

1. Create a *fork* of the repository that contains the [firmware](https://github.com/quadcontrol/quadcontrol-firmware){target=_blank} into your GitHub account.

### Clone

1. Open Visual Studio Code.

2. Open a terminal window by clicking ++"Terminal"++ > ++"New Terminal"++(1).
    {.annotate}
    1. You can also use the shortcut ++ctrl++ + ++shift++ + ++"'"++.

    !!! warning "Important"
        If you are using Windows, Visual Studio Code opens a PowerShell terminal by default. You must initialize the WSL terminal first:
        ```bash
        wsl
        ```

3. Clone your forked repository and initialize all Git submodules(1):
    {.annotate}

    1. Git submodules are like “repositories inside repositories”, and they are initialize with the  the `--recursive` flag.

    ```bash
    git clone --recursive https://github.com/username/quadcontrol-firmware.git
    ```

    !!! warning "Important"
        You must replace `username` with your GitHub username.

4. Open the project folder by clicking ++"File"++ > ++"Open Folder..."++.

<!-- 4. Press ++"Enter"++ and select the location where you want to save the repository.

5. When the cloning process finishes and VS Code asks whether you want to open the cloned repository, click ++"Open"++.



7. Initialize all Git submodules(1) from the terminal:
    {.annotate}

    

    ```bash
    git submodule update --init --recursive
    ``` -->

### Structure

The repository is composed of two folders and two files:

![Firmware](images/firmware.png){: width="450" style="display: block; margin: auto;" }

Let’s take a closer look at each one:

- `crazyflie-firmware` – Folder that contains the Crazyflie firmware, which we use as a submodule  
- `src` – Folder that contains the programs we will develop throughout the course  
- `Kbuild` – File that defines which program will be compiled  
- `radio.config` – File that defines the radio channel used to communicate with the Crazyflie  

The `src` folder contains a subfolder called `examples` with two example programs: `led_blink.c` and `hello_world.c`. Open these files to see some very simple example programs:

=== "`led_blink.c`"
    ```c linenums="1"
    #include "FreeRTOS.h"      // FreeRTOS core definitions (needed for task handling and timing)
    #include "task.h"          // FreeRTOS task functions (e.g., vTaskDelay)
    #include "led.h"           // LED functions (e.g., ledSet)

    // Main application loop
    void appMain(void *param)
    {
        // Infinite loop (runs continuously while the quadcopter is powered on)
        while (true)
        {
            // Turn on left green led
            ledSet(LED_GREEN_L, true);
            // Wait for 100 milliseconds (2 Hz loop)
            vTaskDelay(pdMS_TO_TICKS(500));
            // Turn off left green led
            ledSet(LED_GREEN_L, false);
            // Wait for 100 milliseconds (2 Hz loop)
            vTaskDelay(pdMS_TO_TICKS(500));
        }
    }
    ```

=== "`hello_world.c`"
    ```c linenums="1"
    #include "FreeRTOS.h"      // FreeRTOS core definitions (needed for task handling and timing)
    #include "task.h"          // FreeRTOS task functions (e.g., vTaskDelay)
    #include "debug.h"         // Debug printing functions (e.g., DEBUG_PRINT)

    // Main application loop
    void appMain(void *param)
    {
        // Infinite loop (runs continuously while the quadcopter is powered on)
        while (true)
        {
            // Print message to console
            DEBUG_PRINT("Hello world!\n");
            // Wait for 100 milliseconds (2 Hz loop)
            vTaskDelay(pdMS_TO_TICKS(500));
        }
    }
    ```

We define which program will be compiled through the `Kbuild` file:

```bash linenums="1" title="Kbuild"
obj-y += src/examples/led_blink.o
```

As we develop new programs, don’t forget to update the `Kbuild` file with the name of the program you want to compile.

!!! warning "Important"
    Note that the file extension here is `.o`, not `.c.` What matters is that the program name matches exactly.

---

## Configure

Now that you have the firmware on your machine, let’s adjust some important configurations. These settings ensure everything is properly aligned with your Crazyflie before compiling the code.

### Radio Channel

1. Open the `radio.config` file.

2. Change the radio channel according to your Crazyflie configuration:
```c linenums="1" title="radio.config"
RADIO_CHANNEL=1
```

### Bypass the Stabilizer

1. Navigate to `crazyflie-firmware/src/modules/src` and open the `stabilizer.c` file.

2. Comment out lines 223–226, 326, and 356, as shown below(1):
    {.annotate}

    1. We do this to bypass the proprietary Crazyflie control algorithm. It will continue running in the background, but its commands will be ignored so that we can use our own control logic.


    ```c title="stabilizer.c"
    ```

    ```c linenums="221" hl_lines="3-6"
    static void setMotorRatios(const motors_thrust_pwm_t* motorPwm)
    {
    // motorsSetRatio(MOTOR_M1, motorPwm->motors.m1);
    // motorsSetRatio(MOTOR_M2, motorPwm->motors.m2);
    // motorsSetRatio(MOTOR_M3, motorPwm->motors.m3);
    // motorsSetRatio(MOTOR_M4, motorPwm->motors.m4);
    }
    ```
    ```c linenums="326" hl_lines="1"
        //stateEstimator(&state, stabilizerStep);
    ```
    ```c linenums="355" hl_lines="2"
        } else {
            // motorsStop();
        }
    ```

### Select the Hardware Platform

1. Configure the firmware for the Crazyflie 2.1 Brushless platform by running the following command in the terminal:

    ```bash
    make cf21bl_defconfig
    ```

---

## Compile and Upload

With the firmware properly configured, it’s time to turn it into something the drone can understand. We will compile and upload it to the Crazyflie. This process will be repeated every time you want to test a new version of your program.

### Build

1. Compile the firmware:
```bash
make
```

### Flash

1. Upload the firmware to the Crazyflie:
```bash
make cload
```

    !!! warning "Important"
        - The Crazyflie 2.1 Brushless must be powered on
        - The Crazyradio PA must be connected to a USB port

---

## Connect and Test

All set! Now let’s connect to the drone using the Crazyflie Client and verify that your code is running correctly. If everything is working as expected, you’ll see messages appearing in the console — and your drone will officially be under your control.

1. Open the Crazyflie Client:
```bash
cfclient
```

    !!! warning "Important"
        If you are using Windows, this is the only command that must be run in PowerShell terminal instead of WSL.

2. Click on ++"Scan"++ button

2. Select the corresponding Crazyflie.

4. Click on ++"Connect"++ button

5. Verify that the quadcopter is responding (battery voltage, sensor status, etc.).

6. Click on ++"View"++ > ++"Toolboxes"++ > ++"Console"++

7. Check whether messages from your code appear (for example, "Hello world!").

If no messages appear, you are most likely still running the `led_blink.c` program instead of `hello_world.c`. Update your Kbuild file to point to the correct program, then recompile and flash the firmware again.



<!-- ---
title: Firmware
icon: material/memory
---

# :material-memory: Firmware

Agora que seu ambiente está pronto, é hora de colocar a mão no código do drone.

Aqui, você vai aprender a baixar, configurar e compilar o firmware que roda dentro do Crazyflie — deixando tudo pronto para testar seu próprio código no drone real.

---

## Visual Studio Code

Vamos utilizar o Visual Studio Code como IDE (Ambiente de Desenvolvimento Integrado).

1. Baixe o Visual Studio Code em seu [site oficial](https://code.visualstudio.com/Download){target=_blank} e instale-o.

---

## Clonando

Antes de começar a programar, precisamos trazer o código do firmware para sua máquina. Vamos fazer isso em duas etapas: primeiro, você cria uma cópia (um *fork*) do repositório, e depois clona essa cópia para o seu computador.

### Fork

1. Crie um *fork* do repositório que contém o [firmware](https://github.com/quadcontrol/quadcontrol-firmware){target=_blank} para a sua conta do GitHub.

### Clone

1. Abra o Visual Studio Code

2. Clique em `Clone Git Repository...`

3. Coloque o endereço do repositório *forkado* para sua conta do GitHub:
```bash
https://github.com/username/quadcontrol-firmware.git
```

    !!! warning "Atenção"
        Você deve substituir `username` pelo seu nome de usuário do GitHub

4. Pressione `Enter` e selecione o local onde você quer salvar esse repositório.

5. Quando ele terminar de clonar e perguntar se você gostaria de abrir o repositório clonado, clique em `Open`.

6. Abra uma janela do terminal clicando em `Terminal` > `New Terminal` (ou usando o atalho `Crtl`+`Shift`+`'`).

    !!! warning "Atenção"
        Caso esteja utilizando Windows, ele abre por padrão um terminal do PowerShell, mas você deve alternar para um terminal do WSL (Ubuntu):
        ![WSL](images/wsl.png){: width="200" style="display: block; margin: auto;" }

8. Inicialize todos os submódulos[^1] pelo terminal:
```bash
git submodule update --init --recursive
```

[^1]: Submódulos do Git são como "repositórios dentro de repositórios". Esse comando garante que você tenha o código do firmware oficial (`crazyflie-firmware`) que está referenciado como submódulo.

### Organização

O firmware é composto por 2 pastas e 2 arquivos:

![Firmware](images/firmware.png){: width="450" style="display: block; margin: auto;" }

Vamos entender cada um deles:

- `crazyflie-firmware` - Pasta que contém o firmware do Crazyflie, o qual utilizaremos como submódulo
- `src` - Pasta que contém os programas que vamos desenvolver ao longo do curso
- `Kbuild` - Arquivo que define o programa que será compilado
- `radio.config` - Arquivo que define o canal de rádio utilizado para se comunicar com o Crazyflie

A pasta `src` possui uma subpasta `examples` com 2 exemplos de programas: `led_blink.c` e `hello_world.c`. Abra esses arquivos para ver alguns exemplos de programa bem simples:

=== "Led blink"
    ```c title="led_blink.c"
    #include "FreeRTOS.h"      // FreeRTOS core definitions (needed for task handling and timing)
    #include "task.h"          // FreeRTOS task functions (e.g., vTaskDelay)
    #include "led.h"           // LED functions (e.g., ledSet)

    // Main application loop
    void appMain(void *param)
    {
        // Infinite loop (runs continuously while the quadcopter is powered on)
        while (true)
        {
            // Turn on left green led
            ledSet(LED_GREEN_L, true);
            // Wait for 100 milliseconds (2 Hz loop)
            vTaskDelay(pdMS_TO_TICKS(500));
            // Turn off left green led
            ledSet(LED_GREEN_L, false);
            // Wait for 100 milliseconds (2 Hz loop)
            vTaskDelay(pdMS_TO_TICKS(500));
        }
    }
    ```

=== "Hello world"
    ```c title="hello_world.c"
    #include "FreeRTOS.h"      // FreeRTOS core definitions (needed for task handling and timing)
    #include "task.h"          // FreeRTOS task functions (e.g., vTaskDelay)
    #include "debug.h"         // Debug printing functions (e.g., DEBUG_PRINT)

    // Main application loop
    void appMain(void *param)
    {
        // Infinite loop (runs continuously while the quadcopter is powered on)
        while (true)
        {
            // Print message to console
            DEBUG_PRINT("Hello world!\n");
            // Wait for 100 milliseconds (2 Hz loop)
            vTaskDelay(pdMS_TO_TICKS(500));
        }
    }
    ```

Definimos qual o programa que vamos compilar através do arquivo `Kbuild`:

```bash title="Kbuild"
obj-y += src/examples/led_blink.o
```

Conforme formos desenvolvendo novos programas, não podemos esquecer de atualizar o arquivo `Kbuild` com o nome do programa que queremos compilar. 

!!! warning "Atenção"
    Note que a extensão do arquivo aqui é `.o` e não `.c`. O importante é o nome do programa estar igual.

---

## Configurando

Agora que você já tem o código na sua máquina, vamos ajustar algumas configurações importantes: o canal de rádio que será usado para comunicação e a plataforma de hardware do drone. Esses ajustes garantem que tudo esteja alinhado com o seu Crazyflie antes de compilar o código.

### Radio

1. Abra o arquivo `radio.config`

2. Altere o canal do rádio conforme a numeração do seu Crazyflie. 
```c title="radio.config"
RADIO_CHANNEL=1
```

### Submódulo

1. Navegue até a página `crazyflie-firmware/src/modules/src` e abra o arquivo `stabilizer.c`.

2. Comente as linhas 223-226, 326 e 356, conforme abaixo[^2]:
```c title="stabilizer.c" linenums="221"
static void setMotorRatios(const motors_thrust_pwm_t* motorPwm)
{
  // motorsSetRatio(MOTOR_M1, motorPwm->motors.m1);
  // motorsSetRatio(MOTOR_M2, motorPwm->motors.m2);
  // motorsSetRatio(MOTOR_M3, motorPwm->motors.m3);
  // motorsSetRatio(MOTOR_M4, motorPwm->motors.m4);
}
```
```c title="stabilizer.c" linenums="326"
      //stateEstimator(&state, stabilizerStep);
```
```c title="stabilizer.c" linenums="355"
      } else {
        // motorsStop();
      }
```

[^2]: Fazemos isso para contornar o algoritmo proprietário do controlador do Crazyflie (ele vai continuar rodando em segundo plano, mas vamos ignorar seus comandos para podermos usar os nossos).

### Plataforma

1. Configure o firmware para a plataforma do Crazyflie 2.1 Brushless rodando o seguinte código no terminal:
```bash
make cf21bl_defconfig
```

---

## Compilando

Com o código ajustado, é hora de transformar ele em algo que o drone entenda. Vamos compilar o firmware e enviá-lo para o Crazyflie. Esse processo será repetido sempre que você quiser testar uma nova versão do seu programa.

### Build

1. Compile o firmware:
```bash
make
```

### Flash

1. Programe o firmware no Crazyflie:
```bash
make cload
```

    !!! warning "Atenção"
        - O Crazyflie 2.1 Brushless precisa estar ligado
        - O Crazyradio PA precisa estar conectado na porta USB

---

## Testando

Tudo pronto! Agora vamos conectar no drone com o Crazyflie Client e verificar se ele está rodando o seu código corretamente. Se tudo estiver certo, você verá as mensagens aparecendo no console — e o seu drone estará oficialmente sob seu controle.

1. Abra o Crazyflie Client
```bash
cfclient
```
2. Clique no botão `Scan` 

2. Selecione o Crazyflie correspondente

4. Clique no botão `Connect`

5. Verifique se o quadricoptero está respondendo (tensão da bateria, estado dos sensores, etc.)

6. Clique em `View` > `Toolboxes` > `Console`

7. Verifique se aparecem as mensagens do seu código ("Hello world!")

Caso não apareça, muito provavelmente é por que você está rodando o programa `led_blink.c` e não `hello_world.c`. Modifique seu arquivo `Kbuild` para o programa correto e, em seguida, compile e envie o programa para o quadricoptero. -->