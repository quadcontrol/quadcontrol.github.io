# Instalações

Esta secção contém as instruções para instalar todas as ferramentas e dependências necessárias para o seu ambiente de desenvolvimento. 

Siga cada passo conforme seu sistema operacional com atenção, para garantir uma configuração correta.

---

## Git

=== "Windows"

    1. Baixe o Git em seu [site oficial](https://git-scm.com){target=_blank} e instale-o.

    2. Verifique a instalação do Git pelo PowerShell:
    ```bash
    git --version
    ```

=== "Mac"

    O Mac já vem de fábrica com o Git instalado.

---

## Python

=== "Windows"

    !!! warning "Atenção"
        Não pule essa etapa mesmo que você já tenha uma distribuição do Python instalada em seu computador, pois precisará instalar uma distribuição específica (3.11.9) para tudo funcionar. Mas fique tranquilo, qualquer distribuição já instalada continuará funcionando normalmente.

    1. Baixe o Python 3.11.9 em seu [site oficial](http://www.python.org/downloads/release/python-3119){target=_blank} e instale-o.

    2. Certifique-se de marcar a caixa `[✓] Add python.exe to PATH` durante a instalação.

    3. Verifique a instalação do Python e do PIP (Gerenciador de Pacotes Python) pelo PowerShell:
    ```bash
    python --version
    pip --version
    ```

=== "Mac"

    O Mac já vem de fábrica com o Python instalado.

---

## Crazyflie Client

=== "Windows"

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

=== "Mac"

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

=== "Windows"

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

=== "Mac"

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
    ```