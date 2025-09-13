// FET Token Smart Contract Configuration
export const CONTRACT_CONFIG = {
  // Replace with your deployed contract address
  CONTRACT_ADDRESS: "",
  
  // ABI for the FET Token contract
  ABI:  as const,
  
  // Network configuration
  NETWORK: {
    chainId: "0xaa36a7", // Sepolia testnet
    chainName: "Sepolia",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "SEP",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  }
}

// Helper function to format token amount
export function formatTokenAmount(amount: bigint): string {
  return (Number(amount) / 10 ** 18).toString()
}

// Helper function to parse token amount
export function parseTokenAmount(amount: string): bigint {
  return BigInt(Math.floor(Number(amount) * 10 ** 18))
} 
