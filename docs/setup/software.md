---
title: Software
icon: material/laptop
---

# :material-laptop: Software

This section describes how to set up the software environment required to program and operate the drone. 

Follow the steps according to your operating system to ensure everything works correctly.

---

## Core Tools

These are system-level tools that are installed once and can be reused across multiple projects. They are not specific to Crazyflie, but are required to build, flash, and manage embedded software in general.

### System Package Manager

The system package manager is responsible for installing and maintaining development tools. It ensures that required software can be installed in a reliable and reproducible way.

=== ":fontawesome-brands-windows: Windows"

    1. Install WSL(1) by running PowerShell as administrator:
    {.annotate}
        
        1. Windows Subsystem for Linux
    
        ```bash
        wsl --install
        ```

    2. Restart your computer.

    3. On first launch, create a Linux username and password.

=== ":fontawesome-brands-apple: Mac"

    1. Install the Xcode Command Line Tools:
    ```bash
    xcode-select --install
    ```

    2. Install Homebrew:
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

    3. Add Homebrew to your `PATH`(1):
    {.annotate}

        1. Homebrew must be added to your `PATH` so that tools installed with Homebrew are correctly found by the system.
    
        ```bash
        echo 'export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:$PATH"' >> ~/.zprofile
        ```

    4. Reload the shell configuration:
    ```bash
    source ~/.zprofile
    ```

    5. Verify the installation:
    ```bash
    brew --version
    ```

### ARM Toolchain

The ARM toolchain is used to compile the firmware that runs on the Crazyflie microcontroller. Without it, the code cannot be built or flashed to the drone.

=== ":fontawesome-brands-windows: Windows"

    !!! warning "Important"
        All commands below must be executed inside the WSL terminal. Copying from Windows applications and pasting into the WSL terminal usually does not work, so you may need to type the commands manually.

    1. Initialize the WSL terminal:
    ```bash
    wsl
    ```

    2. Update the package list:
    ```bash
    sudo apt update
    ```

    3. Install Make:
    ```bash
    sudo apt install make
    ```

    4. Verify the Make installation:
    ```bash
    make --version
    ```

    5. Install the ARM embedded toolchain:
    ```bash
    sudo apt install gcc-arm-none-eabi
    ```

    6. Verify the ARM embedded toolchain:
    ```bash
    arm-none-eabi-gcc --version
    ```

    7. Install the native GCC toolchain:
    ```bash
    sudo apt install gcc
    ```

    8. Verify the GCC installation:
    ```bash
    gcc --version
    ```

    9. Close the WSL terminal:
    ```bash
    exit
    ```

=== ":fontawesome-brands-apple: Mac"

    1. Install the ARM embedded toolchain:
    ```bash
    brew install gcc-arm-embedded
    ```

    2. Verify the installation:
    ```bash
    arm-none-eabi-gcc --version
    ```

    3. Install GNU Core Utilities:
    ```bash
    brew install coreutils
    ```

    4. Verify the installation:
    ```bash
    gdate --version
    ```

## Crazyflie Tools

These tools are specific to the Crazyflie ecosystem and are required to communicate with the drone and flash it firmware.

### Python

Python is required because the Crazyflie Client and related utilities are written in Python. It is not used directly to program the firmware, but it is essential for running the tools that communicate with the drone.

!!! warning "Important"
    Even if you already have Python installed on your computer, we strongly recommend following the steps below and installing Python 3.11, a stable version and fully compatible with all Crazyflie tools. Newer versions (3.12+) may work in some cases, but they have not been thoroughly tested and can still cause issues with certain dependencies.

=== ":fontawesome-brands-windows: Windows"

    1. Download and install Python 3.11 from its [official website](https://www.python.org/downloads/release/python-3119/){target=_blank}.

    2. Make sure to check the ++"[✓] Add python.exe to PATH"++ box during installation.

    3. Verify the installation:
    ```bash
    python --version
    ```

    If the command prints `Python 3.11.x`, the installation was successful.

=== ":fontawesome-brands-apple: Mac"

    1. Install Python 3.11 using Homebrew:
    ```bash
    brew install python@3.11
    ```

    2. Add Python 3.11 to PATH:
    ```bash
    brew link --force --overwrite python@3.11
    ```

    3. Verify the installation:
    ```bash
    python3 --version
    ```

### Crazyflie Client

The Crazyflie Client is the main desktop application used to communicate with the drone and flash it firmware. It provides a graphical interface for interacting with the Crazyflie during development and testing.

=== ":fontawesome-brands-windows: Windows"

    1. Install the Crazyflie Client:
    ```bash
    pip install cfclient
    ```

    2. Launch the client:
    ```bash
    cfclient
    ```

    !!! warning "Important"
        If you are using Windows, you must restart your computer to make sure the Crazyflie Client can be called from the WSL.


=== ":fontawesome-brands-apple: Mac"

    1. Install the Crazyflie Client:
    ```bash
    python3 -m pip install cfclient
    ```

    3. Launch the client:
    ```bash
    cfclient
    ```


<!-- ---
title: Software
icon: material/laptop
---

# :material-laptop: Software

Antes de começar a programar o drone, vamos instalar os programas e componentes que o ambiente de desenvolvimento precisa para funcionar direitinho.

Siga cada passo com atenção, conforme seu sistema operacional, para garantir que tudo fique pronto e funcionando sem problemas.

---

## Git

=== ":fontawesome-brands-windows: Windows"

    1. Baixe o Git em seu [site oficial](https://git-scm.com){target=_blank} e instale-o.

    2. Verifique a instalação do Git pelo PowerShell:
    ```bash
    git --version
    ```

=== ":fontawesome-brands-apple: Mac"

    O Mac já vem de fábrica com o Git instalado.

---

## Python

=== ":fontawesome-brands-windows: Windows"

    !!! warning "Atenção"
        Não pule essa etapa mesmo que você já tenha uma distribuição do Python instalada em seu computador, pois precisará instalar uma distribuição específica (3.11.9) para tudo funcionar. Mas fique tranquilo, qualquer distribuição já instalada continuará funcionando normalmente.

    1. Baixe o Python 3.11.9 em seu [site oficial](http://www.python.org/downloads/release/python-3119){target=_blank} e instale-o.

    2. Certifique-se de marcar a caixa `[✓] Add python.exe to PATH` durante a instalação.

    3. Verifique a instalação do Python e do PIP (Gerenciador de Pacotes Python) pelo PowerShell:
    ```bash
    python --version
    pip --version
    ```

=== ":fontawesome-brands-apple: Mac"

    O Mac já vem de fábrica com o Python instalado.

---

## Crazyflie Client

=== ":fontawesome-brands-windows: Windows"

    1. Instale o Crazyflie Client usando o PIP pelo PowerShell:
    ```bash
    pip install cfclient
    ```

    2. Verifique a instalação do Crazyflie Client abrindo ele pelo PowerShell:
    ```bash
    cfclient
    ```

    !!! info "Dica"
        Caso prefira criar um ícone na área de trabalho para o Crazyflie Client, siga o passo a passo abaixo:

        1. Clique com o botão direito na área de trabalho e depois em `Novo` > `Atalho`

        2. No campo de destino, coloque "cfclient" e clique em `Avançar`

        3. No campo de nome, coloque "Crazyflie Client" e clique em `Concluir`

=== ":fontawesome-brands-apple: Mac"

    1. Instale o Crazyflie Client pelo Terminal:
    ```bash
    python3 -m pip install cfclient
    ```

    2. Verifique a instalação do Crazyflie Client abrindo ele pelo Terminal:
    ```bash
    cfclient
    ```

    !!! warning "Atenção"
        Caso o comando acima não abra o Crazyflie Client, pode ser que seu endereço não esteja no PATH. Para verificar onde ele foi instalado e colocar ele no PATH, basta rodar o comando abaixo no Terminal[^2]:
        ```bash
        cfclient_path=$(dirname $(which cfclient)) && echo "export PATH=\"$cfclient_path:\$PATH\"" >> ~/.zshrc
        ```

    [^2]: Reinicie o Terminal depois para a alteração fazer efeito.

    !!! info "Dica"
        Caso prefira criar um ícone na mesa para o Crazyflie Client, siga o passo a passo abaixo:

        1. Abra o Automator

        2. Clique em `Novo Documento` > `Aplicativo`

        3. Na biblioteca de ações, dê duplo clique em `Executar Script de Shell`

        4. No campo de script, cole:
        ```bash
        python3 -m cfclient.gui
        ```

        5. Clique em `Arquivo` > `Salvar`
        
        6. No campo de nome, coloque "Crazyflie Client" e clique em `Concluir`


---

## ARM Toolchain

=== ":fontawesome-brands-windows: Windows"

    1. Instale o WSL (Subsistema do Windows para Linux) pelo PowerShell executando ele como administrador:
    ```bash
    wsl --install
    ```

    2. Após a instalação, reinicie o computador.

    3. Depois que o computador tiver reiniciado, ele abrirá automaticamente o terminal WSL (Ubuntu). Caso ele não abra, você pode abri-lo pelo PowerShell:
    ```bash
    wsl
    ```

    4. Na primeira vez, será solicitado que você crie um nome de usuário para o Linux e defina uma senha (não necessariamente a mesma do Windows). 

        !!! warning "Atenção"
            Os comandos a seguir devem ser executados no terminal WSL (Ubuntu) e não no PowerShell

    5. Atualize a lista de pacotes:
    ```bash
    sudo apt update
    ```

    6. Instale o Make:
    ```bash
    sudo apt install make 
    ```

    7. Verifique a instalação do Make:
    ```bash
    make --version
    ```

    8. Instale o toolchain ARM embarcado:
    ```bash
    sudo apt install gcc-arm-none-eabi
    ```

    9. Verifique a instalação do toolchain ARM embarcado:
    ```bash
    arm-none-eabi-gcc --version
    ```

    10. Instale o toolchain GCC:
    ```bash
    sudo apt install gcc
    ```

    11. Verifique a instalação do toolchain GCC:
    ```bash
    gcc --version
    ```

=== ":fontawesome-brands-apple: Mac"

    1. Instale o Homebrew:
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

    2. Verifique a instalação do Homebrew:
    ```bash
    brew --version
    ```

    3. Instale o toolchain ARM embarcado:
    ```bash
    brew install gcc-arm-embedded
    ```

    4. Adicione-o ao PATH[^2]:
    ```bash
    echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
    ```

    5. Verifique a instalação do toolchain ARM embarcado:
    ```bash
    arm-none-eabi-gcc --version
    ```

    6. Instale os utilitários do GNU Core:
    ```bash
    brew install coreutils
    ```

    7. Adicione-o ao PATH[^2]:
    ```bash
    echo 'export PATH="/opt/homebrew/opt/coreutils/libexec/gnubin:$PATH"' >> ~/.zshrc
    ```

    8. Verifique a instalação do GNU Core:
    ```bash
    gdate --version
    ``` -->