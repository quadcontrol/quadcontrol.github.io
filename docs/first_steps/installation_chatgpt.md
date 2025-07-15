# 🛠️ Installation Guide

This guide contains step-by-step instructions for setting up your development environment. Follow each section in order to ensure a proper setup.

## ⚡ Prerequisites

Before starting, make sure you have:

- Windows 10 version 2004 or higher (Build 19041+)
- At least 4GB of RAM
- Administrator access to your computer
- Internet connection

## 📦 1. ARM Toolchain

The ARM Toolchain is required to compile the code that will run on the drone.

### a) Windows Installation

1. **Enable WSL (Windows Subsystem for Linux)**
   - Open PowerShell as administrator:
     1. Press `Win + X`
     2. Select "Windows PowerShell (Admin)"
     3. Click "Yes" in the confirmation window

   - Run the command:
   ```bash
   wsl --install
   ```
   > ⚠️ **Note**: This command may take a few minutes. Please wait for completion.

2. **Set up Ubuntu on WSL**
   - After installation, restart your computer
   - Open Ubuntu:
   ```bash
   wsl
   ```
   > 📝 On first run, you'll need to create a username and password for Ubuntu

3. **Install the Tools**
   - Update package list:
   ```bash
   sudo apt update
   ```
   
   - Install Make:
   ```bash
   sudo apt install make 
   ```
   
   - Install ARM Toolchain:
   ```bash
   sudo apt install gcc-arm-none-eabi
   ```

### b) Verification

To confirm everything was installed correctly:

1. **Verify Make**
   ```bash
   make --version
   ```
   > ✅ Should show Make version (e.g., GNU Make 4.3)

2. **Verify ARM Toolchain**
   ```bash
   arm-none-eabi-gcc --version
   ```
   > ✅ Should show GCC version (e.g., arm-none-eabi-gcc 10.3.1)

## 🐍 2. Python

Python is the main language we'll use to program the drone.

### a) Installation

1. **Download Python**
   - Go to [Python's official website](http://www.python.org/downloads/release/python-3119)
   - Download the Windows installer (64-bit)
   
2. **Run the installer**
   - ⚠️ **IMPORTANT**: Check the box `[✓] Add python.exe to PATH`
   - Click "Install Now"

### b) Verification

Run these commands in PowerShell to confirm installation:

```bash
python --version  # Should show Python 3.11.9
pip --version     # Should show pip version
```

## 🕹️ 3. Crazyflie Client

The Crazyflie Client is the interface we'll use to control the drone.

### a) Installation

1. **Install the client via pip**
   ```bash
   pip install cfclient
   ```

### b) Verification

1. **Launch the client**
   ```bash
   cfclient
   ```
   > ✅ Should open the Crazyflie graphical interface

## ❓ Common Issues

### WSL won't install
- Check if virtualization is enabled in BIOS
- Make sure Windows is up to date
- Run `sfc /scannow` in PowerShell as administrator

### Python not recognized
- Restart PowerShell/computer after installation
- Verify you checked "Add to PATH" during installation
- Add to PATH manually if needed

### Crazyflie Client won't open
- Check if all dependencies are installed
- Try reinstalling with: `pip install --upgrade cfclient`

## 📞 Need Help?

If you encounter any issues during installation:
1. Check the Common Issues section above
2. Consult the [official documentation](https://www.bitcraze.io/documentation/tutorials/getting-started-with-crazyflie-2-x/)
3. Contact your instructor 