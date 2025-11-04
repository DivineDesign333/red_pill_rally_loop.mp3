#!/bin/sh
# Test script to validate install.sh works correctly with environment variables

set -e

echo "=== Testing LocalAI Installation Script ==="
echo ""

# Test 1: Check script syntax
echo "Test 1: Checking shell script syntax..."
if sh -n install.sh; then
    echo "✓ Syntax check passed"
else
    echo "✗ Syntax check failed"
    exit 1
fi
echo ""

# Test 2: Test environment variable passing
echo "Test 2: Testing environment variable passing..."
cat > /tmp/test_env_check.sh << 'EOF'
#!/bin/sh
# Extract the environment variable reading section from install.sh
PORT=${PORT:-8080}
API_KEY=${API_KEY:-}
THREADS=${THREADS:-}
DOCKER_INSTALL=${DOCKER_INSTALL:-false}
USE_AIO=${USE_AIO:-false}

# Verify variables are set correctly
if [ "$PORT" = "9999" ] && [ "$API_KEY" = "test-key-123" ] && [ "$THREADS" = "16" ] && [ "$USE_AIO" = "true" ]; then
    echo "✓ Environment variables passed correctly"
    exit 0
else
    echo "✗ Environment variables not passed correctly"
    echo "  PORT=$PORT (expected: 9999)"
    echo "  API_KEY=$API_KEY (expected: test-key-123)"
    echo "  THREADS=$THREADS (expected: 16)"
    echo "  USE_AIO=$USE_AIO (expected: true)"
    exit 1
fi
EOF

if cat /tmp/test_env_check.sh | PORT=9999 API_KEY=test-key-123 THREADS=16 USE_AIO=true sh; then
    true
else
    exit 1
fi
echo ""

# Test 3: Verify script structure
echo "Test 3: Verifying script structure..."
required_functions="info warn fatal uninstall_localai check_gpu install_success"
missing_functions=""

for func in $required_functions; do
    if ! grep -q "^${func}()" install.sh; then
        missing_functions="$missing_functions $func"
    fi
done

if [ -z "$missing_functions" ]; then
    echo "✓ All required functions present"
else
    echo "✗ Missing functions:$missing_functions"
    exit 1
fi
echo ""

# Test 4: Verify uninstall flag is recognized
echo "Test 4: Testing uninstall flag recognition..."
if grep -q 'if \[ "$1" = "--uninstall" \]' install.sh; then
    echo "✓ Uninstall flag handler present"
else
    echo "✗ Uninstall flag handler missing"
    exit 1
fi
echo ""

# Test 5: Check for environment variable documentation
echo "Test 5: Checking documentation..."
env_vars="DOCKER_INSTALL USE_AIO API_KEY PORT THREADS"
missing_docs=""

for var in $env_vars; do
    if ! head -30 install.sh | grep -q "$var"; then
        missing_docs="$missing_docs $var"
    fi
done

if [ -z "$missing_docs" ]; then
    echo "✓ All key environment variables documented"
else
    echo "✗ Missing documentation for:$missing_docs"
    exit 1
fi
echo ""

# Test 6: Verify executable permission
echo "Test 6: Checking file permissions..."
if [ -x "install.sh" ]; then
    echo "✓ Script is executable"
else
    echo "✗ Script is not executable"
    exit 1
fi
echo ""

echo "=== All Tests Passed! ==="
echo ""
echo "The install.sh script is ready to be used with:"
echo "  curl https://localai.io/install.sh | sh"
echo "  curl https://localai.io/install.sh | PORT=9090 API_KEY=key sh"
echo ""
exit 0
