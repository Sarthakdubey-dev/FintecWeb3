# Financial Literacy Playground

A gamified financial education platform with blockchain token rewards. Learn personal finance concepts and earn FET (Financial Education Tokens) for completing courses.

## 🚀 Features

- **Interactive Courses**: Budgeting, Saving, and Investment fundamentals
- **Blockchain Integration**: Real FET tokens on Ethereum testnet
- **Gamified Learning**: XP system, achievements, and badges
- **Wallet Connection**: MetaMask integration for token management
- **Progress Tracking**: Persistent learning progress and rewards

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Blockchain**: Ethereum (Sepolia testnet), ethers.js
- **Smart Contract**: Solidity, OpenZeppelin ERC-20

## 📋 Prerequisites

- Node.js 18+ and pnpm
- MetaMask browser extension
- Sepolia testnet ETH for gas fees

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/Sarthakdubey-dev/Fintec.git
cd Fintec
pnpm install
```

### 2. Configure Smart Contract

1. **Deploy the FET Token Contract**:
   ```solidity
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.20;
   
   import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
   import "@openzeppelin/contracts/access/Ownable.sol";
   
   contract FETToken is ERC20, Ownable {
       constructor(address initialOwner)
           ERC20("Financial Education Token", "FET")
           Ownable(initialOwner)
       {}
   
       function mint(address to, uint256 amount) public onlyOwner {
           _mint(to, amount);
       }
   }
   ```

2. **Update Contract Address**:
   - Open `lib/contract-config.ts`
   - Replace `YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE` with your deployed contract address

### 3. Configure MetaMask

1. **Add Sepolia Testnet**:
   - Network Name: Sepolia
   - RPC URL: https://rpc.sepolia.org
   - Chain ID: 11155111
   - Currency Symbol: SEP

2. **Get Test ETH**:
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Add your wallet address to receive test ETH

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to start learning!

## 🎮 How to Use

### 1. Connect Wallet
- Click "Connect Wallet" in the navbar
- Approve MetaMask connection
- Your wallet address and balance will display

### 2. Start Learning
- Browse available courses
- Complete lessons and quizzes
- Earn XP and FET tokens for each completion

### 3. Track Progress
- View your wallet page for token balance
- Check achievement badges
- Monitor learning progress

## 🔗 Smart Contract Integration

### Token Minting
When you complete a course block:
1. Frontend calls `claimTokens(amount)`
2. Smart contract `mint()` function is called
3. FET tokens are minted to your wallet address
4. Balance is automatically refreshed

### Balance Queries
- Real-time token balance from blockchain
- Automatic balance updates after transactions
- Error handling for network issues

## 📊 Course Structure

### Available Courses
- **Budgeting 101**: 500 XP, 50 FET tokens
- **Saving Basics**: 400 XP, 40 FET tokens  
- **Investment Fundamentals**: 750 XP, 75 FET tokens

### Reward System
- **Lessons**: 5-75 FET + 50-75 XP
- **Quizzes**: 10-100 FET + 100 XP (70% pass threshold)
- **Achievements**: Badges for milestones

## 🛡️ Security Features

- **Read-only wallet connection** (no transaction signing except minting)
- **Owner-only minting** (prevents unauthorized token creation)
- **Error handling** for failed transactions
- **Network validation** for correct testnet

## 🚧 Development Notes

### Current Implementation
- ✅ Smart contract deployed and integrated
- ✅ Real token minting on blockchain
- ✅ MetaMask wallet connection
- ✅ On-chain balance queries
- ⏳ XP still stored locally (can be moved to blockchain)
- ⏳ Achievement NFTs (future enhancement)

### Future Enhancements
1. **XP on Blockchain**: Store XP as NFTs or in smart contract
2. **Achievement NFTs**: Mint badges as ERC-721 tokens
3. **Governance**: Token voting for course content
4. **Staking**: Stake tokens for bonus rewards
5. **Backend Verification**: Server-side course completion validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

**"Failed to connect wallet"**
- Ensure MetaMask is installed and unlocked
- Check if you're on the correct network (Sepolia)

**"Failed to claim tokens"**
- Verify you have enough Sepolia ETH for gas
- Check if the contract address is correct
- Ensure you're the contract owner (for minting)

**"Failed to fetch balance"**
- Check network connection
- Verify contract address in config
- Try refreshing the page

### Support
For issues or questions, please open an issue on GitHub.

---

**Happy Learning! 🎓💰** 