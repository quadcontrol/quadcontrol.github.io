# Instalações

Esta secção contém as instruções para instalar todas as ferramentas e dependências necessárias para o seu ambiente de desenvolvimento. 

Siga cada passo conforme seu sistema operacional com atenção, para garantir uma configuração correta.

---

## Windows 

![Windows](images/windows.svg){: width="100"}

Caso seu sistema operacional seja Windows, siga o passo a passo abaixo:

### Visual Studio Code

1. Baixe o Visual Studio Code em seu [site oficial](https://code.visualstudio.com/Download){target=_blank} e instale ele.

### Git

1. Baixe o Git em seu [site oficial](https://git-scm.com){target=_blank} e instale ele.

### Python

!!! warning "Atenção"
    Não pule essa etapa mesmo que você já tenha uma distribuição do Python instalado em seu computador, precisamos instalar uma distribuição especifica (3.11.9) para tudo funcionar. Mas fique tranquilo que qualquer distribuição já instalada continuára funcionando normalmente.

1. Baixe o Python em seu [site oficial](http://www.python.org/downloads/release/python-3119){target=_blank} e instale ele.

2. Certifique-se de marcar a caixa `[✓] Add python.exe to PATH` durante a instalação.

3. Verifique a instalação do Python e do PIP (Gerenciador de Pacotes Python) pelo PowerShell:
```bash
python --version
pip --version
```

### Crazyflie Client

1. Instale o Crazyflie Client usando o PIP pelo PowerShell:
```bash
pip install cfclient
```

2. Configure o aplicativo de inicialização do Crazyflie Client

    1. Clique com o botão direito na área de trabalho e depois em `Novo` > `Atalho`

    2. No campo de destino, coloque "cfclient" e clique em `Avançar`

    3. No campo de nome, coloque "Crazyflie Client" e clique em `Concluir`

### ARM Toolchain

1. Instale o WSL (Subsistema do Windows para Linux) pelo PowerShell executando ele como administrador:
```bash
wsl --install
```

2. Após a instalação, reinicie o computador.

3. Depois que o computador tiver reiniciado, ele abrirá automaticamente o terminal WSL (Ubuntu). Caso ele não abra, você deverá abri-lo:
```bash
wsl
```

4. Na primeira vez, será solicitado que você crie um nome de usuário para o Linux e defina uma senha (não necessariamente a mesma do Windows). 

    !!! warning "Atenção"
        Os comandos a seguir devem ser executados no terminal WSL (Ubuntu) e não no Windows PowerShell

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


---

## Mac 

![Windows](images/mac.svg){: width="100"}

Caso seu sistema operacional seja Mac, siga o passo a passo abaixo:


### Visual Studio Code

1. Baixe o Visual Studio Code em seu [site oficial](https://code.visualstudio.com/Download){target=_blank} e instale ele.


### Crazyflie Client

1. Instale o Crazyflie Client pelo Terminal:
```bash
python3 -m pip install cfclient
```

2. Configure o aplicativo de inicialização do Crazyflie Client

    1. Abra o Automator

    2. Clique em `Novo Documento` > `Aplicativo`

    3. No bliblioteca de ações dê duplo clique em `Executar Script de Shell`

    4. No campo de script, cole:
    ```bash
    python3 -m cfclient.gui
    ```

    5. Clique em `Arquivo` > `Salvar` e a


### ARM Toolchain

1. Instale o Homebrew pelo terminal:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Instale o toolchain ARM embarcado:
```bash
brew Install gcc-arm-embedded
```
