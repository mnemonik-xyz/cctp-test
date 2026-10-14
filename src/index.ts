import { BridgeKit } from '@circle-fin/bridge-kit';
import { createViemAdapterFromPrivateKey } from '@circle-fin/adapter-viem-v2';
import { loadConfig } from './config.js';

interface BridgeStep {
  name?: string;
  state?: string;
  txHash?: string;
}

interface BridgeResultPayload {
  state: string;
  steps?: BridgeStep[];
  error?: string;
}

function logStepProgress(step: BridgeStep): void {
  const stepName = step.name ?? 'Step';
  const status = step.state ?? 'in progress';
  const txInfo = step.txHash ? ` (Tx: ${step.txHash})` : '';
  console.log(`  -> [${status.toUpperCase()}] ${stepName}${txInfo}`);
}

async function runBridge(): Promise<void> {
  const config = loadConfig();

  console.log('========================================================');
  console.log(' Circle CCTP Bridge: Arc Testnet -> Solana Devnet');
  console.log('========================================================');
  console.log(` Source Chain:     Arc Testnet (Domain 26)`);
  console.log(` Destination:      Solana Devnet (Domain 5)`);
  console.log(` Amount:           ${config.transferAmount} USDC`);
  console.log(` Solana Recipient: ${config.solanaRecipientAddress}`);
  console.log(` Relayer Mode:     Circle Forwarder (automated destination mint)`);
  console.log('========================================================\n');

  console.log('[1/3] Initializing BridgeKit and Arc EVM adapter...');
  const kit = new BridgeKit();
  const evmAdapter = createViemAdapterFromPrivateKey({
    privateKey: config.arcPrivateKey,
  });

  // Track progress updates in real-time
  kit.on('*', (event: unknown) => {
    if (event && typeof event === 'object' && 'name' in event) {
      logStepProgress(event as BridgeStep);
    }
  });

  console.log('[2/3] Executing cross-chain transfer via Circle CCTP...');
  const result = (await kit.bridge({
    from: {
      adapter: evmAdapter,
      chain: 'Arc_Testnet',
    },
    to: {
      chain: 'Solana_Devnet',
      useForwarder: true,
      recipientAddress: config.solanaRecipientAddress,
    },
    amount: config.transferAmount,
  })) as BridgeResultPayload;

  console.log('\n[3/3] Execution completed.');
  console.log(`Final State: ${result.state}`);

  if (result.steps && result.steps.length > 0) {
    console.log('\nTransaction Lifecycle Summary:');
    for (const step of result.steps) {
      logStepProgress(step);
    }
  }

  if (result.state === 'success') {
    console.log('\n Success! USDC bridged successfully to Solana Devnet recipient.');
  } else {
    console.error(
      `\n Transfer did not complete successfully. Reason: ${result.error ?? 'Unknown'}`,
    );
    process.exitCode = 1;
  }
}

runBridge().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('\n Unhandled bridge failure:', message);
  process.exitCode = 1;
});
