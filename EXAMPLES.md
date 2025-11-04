# LocalAI Installation Examples

This document provides examples of how to use the `install.sh` script with various configurations.

## Basic Usage

### Simple Installation
```bash
curl https://localai.io/install.sh | sh
```
This will install LocalAI with default settings.

## Advanced Usage with Environment Variables

### Custom Port
```bash
curl https://localai.io/install.sh | PORT=3000 sh
```
Install LocalAI to run on port 3000 instead of the default 8080.

### With API Key Security
```bash
curl https://localai.io/install.sh | API_KEY=my-secret-key-123 sh
```
Install LocalAI with API key authentication enabled.

### Custom Thread Count
```bash
curl https://localai.io/install.sh | THREADS=16 sh
```
Install LocalAI configured to use 16 CPU threads.

### Docker Installation
```bash
curl https://localai.io/install.sh | DOCKER_INSTALL=true sh
```
Force installation using Docker containers.

### All-in-One Docker Image
```bash
curl https://localai.io/install.sh | DOCKER_INSTALL=true USE_AIO=true sh
```
Install using the all-in-one Docker image (includes common models).

### Vulkan GPU Support
```bash
curl https://localai.io/install.sh | USE_VULKAN=true sh
```
Install with Vulkan GPU acceleration support.

### Complete Custom Configuration
```bash
curl https://localai.io/install.sh | \
  DOCKER_INSTALL=true \
  USE_AIO=true \
  API_KEY=secure-key-123 \
  PORT=9090 \
  THREADS=8 \
  MODELS_PATH=/data/localai/models \
  sh
```
Install with multiple custom configurations.

## Worker and Federation Modes

### P2P Worker Node
```bash
curl https://localai.io/install.sh | P2P_TOKEN=my-token WORKER=true sh
```
Install as a P2P worker node.

### Federated Mode
```bash
curl https://localai.io/install.sh | FEDERATED=true P2P_TOKEN=federation-token sh
```
Install in federated mode for distributed AI workloads.

### Federation Server
```bash
curl https://localai.io/install.sh | FEDERATED=true FEDERATED_SERVER=true sh
```
Install as a federation server.

## Uninstallation

### Remove LocalAI
```bash
curl https://localai.io/install.sh | sh -s -- --uninstall
```
Completely remove LocalAI and all related files.

## Testing the Installation

After installation, verify LocalAI is running:

```bash
# Check if the service is running (systemd)
sudo systemctl status local-ai

# Check if Docker container is running
docker ps | grep local-ai

# Test the API endpoint
curl http://localhost:8080/v1/models
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `DOCKER_INSTALL` | Use Docker installation | auto-detected |
| `USE_AIO` | Use all-in-one image | false |
| `USE_VULKAN` | Enable Vulkan GPU | false |
| `API_KEY` | API authentication key | none |
| `PORT` | Service port | 8080 |
| `THREADS` | CPU thread count | auto-detected |
| `MODELS_PATH` | Model storage path | /usr/share/local-ai/models |
| `CORE_IMAGES` | Download core images | false |
| `P2P_TOKEN` | P2P federation token | none |
| `WORKER` | Run as worker node | false |
| `FEDERATED` | Enable federation | false |
| `FEDERATED_SERVER` | Run as federation server | false |

## Notes

- The installation script automatically detects your OS, architecture, and GPU
- NVIDIA, AMD, and Intel GPUs are supported
- Both systemd and OpenRC init systems are supported on Linux
- macOS is supported for binary installation
- The script requires superuser privileges for system-wide installation
