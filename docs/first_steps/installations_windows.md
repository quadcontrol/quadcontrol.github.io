# Instalações

Esta página contém instruções passo a passo para instalar todas as ferramentas e dependências necessárias para o seu ambiente de desenvolvimento. Siga cada seção com atenção para garantir uma configuração correta.

---

## ARM Toolchain

Pressione `Iniciar` e digite "Windows PowerShell". Depois, clique com o botão direito e selecione `Executar como administrador`.

Instale o WSL (Subsistema do Windows para Linux) na janela do PowerShell:
```bash
wsl --install
```

Após a instalação, abra seu terminal WSL (Ubuntu):
```bash
wsl
```

Na primeira vez, será solicitado que você crie um nome de usuário para o Linux e defina uma senha (diferente da sua senha do Windows).

Atualize a lista de pacotes:
```bash
sudo apt update
```

Instale o Make:
```bash
sudo apt install make 
```

Verifique a instalação do Make:
```bash
make --version
```

Instale o toolchain ARM embarcado:
```bash
sudo apt install gcc-arm-none-eabi
```

Verifique a instalação do toolchain ARM embarcado:
```bash
arm-none-eabi-gcc --version
```

---

## Python

Baixe o Python 3.11.9 em seu [site oficial](http://www.python.org/downloads/release/python-3119) e instale ele certificando-se de marcar a caixa `[✓] Add python.exe to PATH`.

Verifique a instalação do Python e do PIP (Gerenciador de Pacotes Python):
```bash
python --version
pip --version
```

---

## Crazyflie Client

Instale o cliente Crazyflie usando o PIP:
```bash
pip install cfclient
```


