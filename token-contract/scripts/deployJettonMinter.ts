import { Address, beginCell, Cell, fromNano, toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';
import { envConfig } from './envConfig';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    
    ui.write('🚀 Deploying Jetton Minter with Environment Configuration\n');
    ui.write('========================================================\n');
    
    // Display configuration
    ui.write(`📋 Configuration:\n`);
    ui.write(`   Network: ${envConfig.tonNetwork}\n`);
    ui.write(`   Commission Address: ${envConfig.commissionAddress}\n`);
    ui.write(`   Token Name: ${envConfig.jettonName}\n`);
    ui.write(`   Token Symbol: ${envConfig.jettonSymbol}\n`);
    ui.write(`   Initial Supply: ${envConfig.initialSupply.toLocaleString()}\n`);
    ui.write(`   Decimals: ${envConfig.jettonDecimals}\n\n`);
    
    // Validate environment
    if (envConfig.commissionAddress === 'UQ_YOUR_COMMISSION_ADDRESS_HERE') {
        ui.write('❌ Error: Commission address not configured!\n');
        ui.write('Please set COMMISSION_ADDRESS in your .env file\n');
        return;
    }
    
    // Parse commission address
    let commissionAddr: Address;
    try {
        commissionAddr = Address.parse(envConfig.commissionAddress);
    } catch (error) {
        ui.write(`❌ Error: Invalid commission address format: ${envConfig.commissionAddress}\n`);
        return;
    }
    
    // Create jetton content
    const jettonContent = beginCell()
        .storeUint(0, 8) // onchain content tag
        .storeStringTail(JSON.stringify({
            name: envConfig.jettonName,
            symbol: envConfig.jettonSymbol,
            description: envConfig.jettonDescription,
            decimals: envConfig.jettonDecimals.toString(),
            image: "", // Add image URL if needed
        }))
        .endCell();
    
    // Compile jetton minter
    const jettonMinter = await compile('JettonMinter');
    
    // Create initial data
    const initialData = beginCell()
        .storeCoins(0) // total_supply
        .storeAddress(commissionAddr) // admin_address (commission address)
        .storeRef(jettonContent) // content
        .storeRef(await compile('JettonWallet')) // jetton_wallet_code
        .endCell();
    
    const minter = provider.open(JettonMinter.createFromConfig({
        admin: commissionAddr,
        content: jettonContent,
        wallet_code: await compile('JettonWallet')
    }, jettonMinter));
    
    ui.write('💰 Checking deployment cost...\n');
    
    const deployResult = await minter.sendDeploy(
        provider.sender(), 
        toNano(envConfig.deployGasLimit / 1000000000) // Convert from nano to TON
    );
    
    await provider.waitForDeploy(minter.address);
    
    ui.write('✅ Jetton Minter deployed successfully!\n\n');
    ui.write(`📍 Contract Address: ${minter.address}\n`);
    ui.write(`🔗 Explorer: https://${envConfig.tonNetwork === 'testnet' ? 'testnet.' : ''}tonscan.org/address/${minter.address}\n\n`);
    
    // Mint initial supply to commission address
    if (envConfig.initialSupply > 0) {
        ui.write(`🪙 Minting initial supply of ${envConfig.initialSupply.toLocaleString()} tokens...\n`);
        
        await minter.sendMint(
            provider.sender(),
            commissionAddr,
            toNano(envConfig.initialSupply),
            toNano(envConfig.transferGasLimit / 1000000000), // forward amount
            toNano(envConfig.mintGasLimit / 1000000000) // total amount
        );
        
        ui.write('✅ Initial supply minted to commission address!\n');
    }
    
    // Display final information
    ui.write('\n🎉 Deployment completed!\n');
    ui.write('========================\n');
    ui.write(`Minter Address: ${minter.address}\n`);
    ui.write(`Admin/Commission: ${envConfig.commissionAddress}\n`);
    ui.write(`Token: ${envConfig.jettonSymbol} (${envConfig.jettonName})\n`);
    ui.write(`Features: 6% commission + 1/66 lottery\n`);
    ui.write(`Network: ${envConfig.tonNetwork}\n\n`);
    
    if (envConfig.debugMode) {
        ui.write('🔍 Debug Information:\n');
        ui.write(`Gas Limits: Deploy=${envConfig.deployGasLimit}, Transfer=${envConfig.transferGasLimit}, Mint=${envConfig.mintGasLimit}\n`);
        ui.write(`Workchain: ${envConfig.workchain}\n`);
    }
}
