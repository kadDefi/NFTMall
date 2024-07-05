const getters = {
  walletAddress: state => state.wallet.walletAddress,
  connectWalletType: state => state.wallet.connectWalletType,
  isConnectWallet: state => state.wallet.isConnectWallet,
  isBindSuperAddress: state => state.wallet.isBindSuperAddress,
  aladBalance: state => state.wallet.aladBalance,
}

export default getters;
