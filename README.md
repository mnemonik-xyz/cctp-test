# Arc to Solana CCTP Bridge

Minimalistic, production-ready TypeScript example demonstrating how to transfer USDC from the
Arc Testnet to Solana Devnet using Circle's Cross-Chain Transfer Protocol (CCTP) and Bridge Kit.

---

## Overview

This example uses Circle's official `@circle-fin/bridge-kit` to execute a full end-to-end transfer:

1. **Burn on Arc**: Approves and burns USDC on Arc Testnet via `TokenMessengerV2`.
2. **Attestation**: Circle's Iris service verifies the burn event and signs an attestation.
3. **Automated Mint on Solana**: Uses Circle's Forwarder relayer (`useForwarder: true`) to submit
   the final `receiveMessage` transaction on Solana Devnet.

> **Note on Gas Abstraction**: Thanks to `useForwarder: true`, you only need a funded Arc Testnet
> private key (with testnet USDC for transfer and gas). You do not need SOL gas or a private key
> on Solana; the relayer mints the tokens directly to the specified recipient address.

---

## Technical Reference

| Parameter            | Arc Testnet                                  | Solana Devnet                   |
| :------------------- | :------------------------------------------- | :------------------------------ |
| **CCTP Domain ID**   | `26`                                         | `5`                             |
| **Chain ID**         | `5042002` (`0x4cef52`)                       | N/A                             |
| **Native Gas Token** | `USDC` (18 decimals)                         | `SOL`                           |
| **RPC URL**          | `https://rpc.testnet.arc.network`            | `https://api.devnet.solana.com` |
| **USDC Contract**    | `0x3600000000000000000000000000000000000000` | Devnet USDC Mint                |
| **Explorer**         | [ArcScan][arcscan]                           | [Solana Explorer][solscan]      |

[arcscan]: https://testnet.arcscan.app
[solscan]: https://explorer.solana.com/?cluster=devnet

---

## Prerequisites

- **Node.js** v20 or higher
- **Arc Testnet Account**: Funded with testnet USDC (used for both the transfer and gas fees)
- **Solana Devnet Address**: Any valid Solana public key (Base58 address) to receive USDC

---

## Quickstart

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and fill in your parameters:

```env
# Your Arc Testnet private key (hex string)
ARC_PRIVATE_KEY=0x...

# The destination Solana Devnet address to receive the minted USDC
SOLANA_RECIPIENT_ADDRESS=...

# USDC amount to transfer (default: 1.0)
TRANSFER_AMOUNT=1.0
```

### 3. Run the Transfer

Execute the bridge script:

```bash
npm run bridge
```

You will see real-time progress logs for approval, burn initiation on Arc, attestation
retrieval, and final delivery to the Solana recipient wallet.

---

## Development Scripts

- **`npm run bridge`**: Run the CCTP transfer script with `tsx`.
- **`npm run lint`**: Lint source files with ESLint.
- **`npm run lint:fix`**: Automatically fix linting issues.
- **`npm run format`**: Format all project files with Prettier.
- **`npm run format:check`**: Check code formatting compliance.
- **`npm run typecheck`**: Run TypeScript compiler verification without emitting code.

---

## Continuous Integration

The repository includes a GitHub Actions workflow in
[`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml) that verifies formatting,
linting, and type checking on every pull request and push to main.
