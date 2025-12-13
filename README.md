# red_pill_rally_loop.mp3

This repository (`red_pill_rally_loop.mp3`) contains a LocalAI installation script.

## Configuration

This project supports the following configuration options:

- `USE_VULKAN=true` - Enable Vulkan graphics API support
- `USE_AIO=true` - Enable all-in-one LocalAI image (includes common models)

Configuration can be set via environment variables when running the installation script (see examples below).

## LocalAI Installation Script

This repository contains an installation script for LocalAI that can be easily executed via curl.

### Usage

#### Basic Installation
```bash
curl https://localai.io/install.sh | sh
```

#### Installation with Environment Variables
You can customize the installation by passing environment variables before the `sh` command:

```bash
curl https://localai.io/install.sh | PORT=9090 API_KEY=your-key THREADS=8 sh
```

#### Available Environment Variables

- `DOCKER_INSTALL` - Set to "true" to install Docker images (default: auto-detected)
- `USE_AIO` - Set to "true" to use the all-in-one LocalAI image (default: false)
- `USE_VULKAN` - Set to "true" to use Vulkan GPU support (default: false)
- `API_KEY` - API key for securing LocalAI access (default: none)
- `PORT` - Port to run LocalAI on (default: 8080)
- `THREADS` - Number of CPU threads to use (default: auto-detected)
- `MODELS_PATH` - Path to store models (default: /usr/share/local-ai/models)
- `CORE_IMAGES` - Set to "true" to download core LocalAI images (default: false)
- `P2P_TOKEN` - Token for P2P federation/worker mode (default: none)
- `WORKER` - Set to "true" to run as a worker node (default: false)
- `FEDERATED` - Set to "true" to enable federation mode (default: false)
- `FEDERATED_SERVER` - Set to "true" to run as a federation server (default: false)

#### Examples

Install with custom port and API key:
```bash
curl https://localai.io/install.sh | PORT=3000 API_KEY=my-secret-key sh
```

Install with Docker and use all-in-one image:
```bash
curl https://localai.io/install.sh | DOCKER_INSTALL=true USE_AIO=true sh
```

Install with multiple environment variables:
```bash
curl https://localai.io/install.sh | DOCKER_INSTALL=true USE_AIO=true API_KEY=your-key PORT=8080 THREADS=4 sh
```

#### Uninstallation

To uninstall LocalAI:
```bash
curl https://localai.io/install.sh | sh -s -- --uninstall
```

### Features

- **Automatic System Detection**: Detects OS, architecture, and available package managers
- **GPU Support**: Automatically detects and configures NVIDIA, AMD, and Intel GPUs
- **Docker Support**: Can install using Docker containers or native binaries
- **Service Configuration**: Sets up systemd or OpenRC services on Linux
- **Environment Variable Configuration**: All settings can be customized via environment variables
- **Uninstall Support**: Clean uninstallation of LocalAI and all related files

### Requirements

- Linux or macOS
- curl (for downloading)
- For binary installation: systemd or OpenRC (Linux only)
- For Docker installation: Docker daemon

### Script Location

The installation script is located at: `install.sh` in this repository.