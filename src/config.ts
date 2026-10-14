import 'dotenv/config';

export interface BridgeConfig {
  arcPrivateKey: `0x${string}`;
  solanaRecipientAddress: string;
  transferAmount: string;
}

/**
 * Validates and normalizes required environment variables.
 */
export function loadConfig(): BridgeConfig {
  const rawPrivateKey = process.env.ARC_PRIVATE_KEY?.trim();
  const solanaRecipientAddress = process.env.SOLANA_RECIPIENT_ADDRESS?.trim();
  const transferAmount = process.env.TRANSFER_AMOUNT?.trim() ?? '1.0';

  if (!rawPrivateKey) {
    throw new Error(
      'Missing ARC_PRIVATE_KEY in environment. Please set it in .env or your environment variables.',
    );
  }

  const arcPrivateKey: `0x${string}` = rawPrivateKey.startsWith('0x')
    ? (rawPrivateKey as `0x${string}`)
    : (`0x${rawPrivateKey}` as `0x${string}`);

  if (!solanaRecipientAddress) {
    throw new Error(
      'Missing SOLANA_RECIPIENT_ADDRESS in environment. Please set it in .env or your environment variables.',
    );
  }

  const parsedAmount = parseFloat(transferAmount);
  if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error(
      `Invalid TRANSFER_AMOUNT "${transferAmount}". Amount must be a positive number.`,
    );
  }

  return {
    arcPrivateKey,
    solanaRecipientAddress,
    transferAmount,
  };
}
