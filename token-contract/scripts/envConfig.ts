import { config } from 'dotenv';
import { Address } from '@ton/core';

// Load environment variables
config();

export interface EnvConfig {
  // Commission settings
  commissionAddress: string;
  commissionAddressHex: string;
  
  // Deployment settings
  deploymentMnemonic?: string;
  deploymentPrivateKey?: string;
  tonNetwork: 'testnet' | 'mainnet';
  tonApiEndpoint: string;
  
  // Jetton settings
  initialSupply: number;
  jettonName: string;
  jettonSymbol: string;
  jettonDescription: string;
  jettonDecimals: number;
  
  // Testing settings
  testOwnerAddress?: string;
  testRecipientAddress?: string;
  testTransferAmount: number;
  testMintAmount: number;
  
  // API keys
  tonApiKey?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  
  // Security settings
  debugMode: boolean;
  testMode: boolean;
  
  // Blockchain settings
  deployGasLimit: number;
  transferGasLimit: number;
  mintGasLimit: number;
  workchain: number;
}

function validateAddress(address: string, name: string): void {
  if (!address || address === 'UQ_YOUR_COMMISSION_ADDRESS_HERE') {
    throw new Error(`${name} must be set in .env file`);
  }
  
  try {
    Address.parse(address);
  } catch (error) {
    throw new Error(`Invalid ${name} format: ${address}`);
  }
}

function validateHexAddress(hex: string, name: string): void {
  if (!hex || hex === 'YOUR_HEX_ADDRESS_HERE') {
    throw new Error(`${name} must be set in .env file`);
  }
  
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error(`Invalid ${name} format: must be 64 hex characters`);
  }
}

export function loadEnvConfig(): EnvConfig {
  const commissionAddress = process.env.COMMISSION_ADDRESS || '';
  const commissionAddressHex = process.env.COMMISSION_ADDRESS_HEX || '';
  
  // Validate critical settings
  validateAddress(commissionAddress, 'COMMISSION_ADDRESS');
  validateHexAddress(commissionAddressHex, 'COMMISSION_ADDRESS_HEX');
  
  const tonNetwork = process.env.TON_NETWORK as 'testnet' | 'mainnet' || 'testnet';
  if (!['testnet', 'mainnet'].includes(tonNetwork)) {
    throw new Error('TON_NETWORK must be either "testnet" or "mainnet"');
  }
  
  return {
    // Commission settings
    commissionAddress,
    commissionAddressHex,
    
    // Deployment settings
    deploymentMnemonic: process.env.DEPLOYMENT_MNEMONIC,
    deploymentPrivateKey: process.env.DEPLOYMENT_PRIVATE_KEY,
    tonNetwork,
    tonApiEndpoint: process.env.TON_API_ENDPOINT || 
      (tonNetwork === 'testnet' 
        ? 'https://testnet.toncenter.com/api/v2/jsonRPC'
        : 'https://toncenter.com/api/v2/jsonRPC'),
    
    // Jetton settings
    initialSupply: parseInt(process.env.INITIAL_SUPPLY || '1000000'),
    jettonName: process.env.JETTON_NAME || 'Commission Token',
    jettonSymbol: process.env.JETTON_SYMBOL || 'COMM',
    jettonDescription: process.env.JETTON_DESCRIPTION || 'Token with 6% commission and 1/66 lottery',
    jettonDecimals: parseInt(process.env.JETTON_DECIMALS || '9'),
    
    // Testing settings
    testOwnerAddress: process.env.TEST_OWNER_ADDRESS,
    testRecipientAddress: process.env.TEST_RECIPIENT_ADDRESS,
    testTransferAmount: parseInt(process.env.TEST_TRANSFER_AMOUNT || '1000000000'),
    testMintAmount: parseInt(process.env.TEST_MINT_AMOUNT || '100000000000'),
    
    // API keys
    tonApiKey: process.env.TON_API_KEY,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.TELEGRAM_CHAT_ID,
    
    // Security settings
    debugMode: process.env.DEBUG_MODE === 'true',
    testMode: process.env.TEST_MODE === 'true',
    
    // Blockchain settings
    deployGasLimit: parseInt(process.env.DEPLOY_GAS_LIMIT || '100000000'),
    transferGasLimit: parseInt(process.env.TRANSFER_GAS_LIMIT || '50000000'),
    mintGasLimit: parseInt(process.env.MINT_GAS_LIMIT || '100000000'),
    workchain: parseInt(process.env.WORKCHAIN || '0'),
  };
}

export const envConfig = loadEnvConfig(); 