#!/bin/bash

# TON Jetton Wallet Compilation Script with Environment Variables
# This script compiles the jetton-wallet.fc with commission address from .env

set -e

echo "🔧 TON Jetton Wallet Compilation"
echo "================================"

# Check if .env file exists
if [ ! -f "../../.env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your settings"
    exit 1
fi

# Load environment variables
source ../../.env

# Validate commission address hex
if [ -z "$COMMISSION_ADDRESS_HEX" ] || [ "$COMMISSION_ADDRESS_HEX" = "YOUR_HEX_ADDRESS_HERE" ]; then
    echo "❌ Error: COMMISSION_ADDRESS_HEX not set in .env file!"
    echo "Please set your commission address in hex format"
    exit 1
fi

# Validate hex format (64 characters)
if [[ ! "$COMMISSION_ADDRESS_HEX" =~ ^[0-9a-fA-F]{64}$ ]]; then
    echo "❌ Error: COMMISSION_ADDRESS_HEX must be 64 hex characters!"
    echo "Current value: $COMMISSION_ADDRESS_HEX"
    exit 1
fi

echo "✅ Commission address: $COMMISSION_ADDRESS"
echo "✅ Commission hex: $COMMISSION_ADDRESS_HEX"

# Create temporary file with substituted address
TEMP_FILE="jetton-wallet-compiled.fc"
cp jetton-wallet.fc "$TEMP_FILE"

# Replace placeholder with actual hex address
sed -i "s/800000000000000000000000000000000000000000000000000000000000000000000000/$COMMISSION_ADDRESS_HEX/g" "$TEMP_FILE"

echo "🔨 Compiling contract..."

# Compile the contract
if command -v func &> /dev/null; then
    func -APS -o jetton-wallet.fif stdlib.fc jetton-utils.fc op-codes.fc params.fc "$TEMP_FILE"
    echo "✅ Contract compiled successfully!"
    
    # Generate BOC file
    if command -v fift &> /dev/null; then
        echo "📦 Generating BOC file..."
        fift -s jetton-wallet.fif
        echo "✅ BOC file generated!"
    else
        echo "⚠️  Warning: fift not found, BOC file not generated"
    fi
else
    echo "❌ Error: func compiler not found!"
    echo "Please install TON development tools"
    exit 1
fi

# Clean up temporary file
rm -f "$TEMP_FILE"

echo ""
echo "🎉 Compilation completed!"
echo "📁 Output files:"
echo "   - jetton-wallet.fif (compiled contract)"
echo "   - jetton-wallet.boc (binary contract)"
echo ""
echo "⚠️  Important: Contract is compiled with commission address:"
echo "   $COMMISSION_ADDRESS"
echo ""
echo "🚀 Ready for deployment!"

func -SPA -o ./build/jetton-minter.fif ../stdlib.fc params.fc op-codes.fc jetton-utils.fc jetton-minter.fc
func -SPA -o ./build/jetton-minter-ICO.fif ../stdlib.fc params.fc op-codes.fc jetton-utils.fc jetton-minter-ICO.fc
func -SPA -o ./build/jetton-discovery.fif ../stdlib.fc params.fc op-codes.fc discovery-params.fc jetton-utils.fc jetton-discovery.fc
func -SPA -o ./build/jetton-minter-discoverable.fif ../stdlib.fc params.fc op-codes.fc discovery-params.fc jetton-utils.fc jetton-minter-discoverable.fc

fift -s build/print-hex.fif
