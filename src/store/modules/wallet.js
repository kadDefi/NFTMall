// 定义状态管理相关数据
const state = {
  walletAddress: '', // 连接钱包的地址
  connectWalletType: '', // 连接钱包的模式 1 metamske、2 walletConnect
  isConnectWallet: false, // 是否连接钱包
  isBindSuperAddress: false,// 是否绑定了父级地址
  aladBalance: 0, // 阿拉丁余额
}
// 修改状态管理值
const mutations = {
  SET_WALLETADDRESS(state, value) {
    state.walletAddress = value;
  },
  SET_CONNECTWALLETTYPE(state, value) {
    state.connectWalletType = value;
  },
  SET_CONNECTWALLET(state, value) {
    state.isConnectWallet = value;
  },
  SET_BINDSUPERADDRESS(state, value) {
    state.isBindSuperAddress = value;
  },
  SET_ALADBALANCE(state, value) {
    state.aladBalance = value;
  },
}
// 操作事件
const actions = {
  setWalletAddress({ commit }, value) {
    commit('SET_WALLETADDRESS', value);
  },
  setConnectWalletType({ commit }, value) {
    commit('SET_CONNECTWALLETTYPE', value);
  },
  setConnectWallet({ commit }, value) {
    commit('SET_CONNECTWALLET', value);
  },
  setBindSuperAddress({ commit }, value) {
    commit('SET_BINDSUPERADDRESS', value);
  },
  setAladBalance({ commit }, value) {
    commit('SET_ALADBALANCE', value);
  },
}

export default {
  namespaced: true, // 限定在当前模块的命名空间中
  state,
  mutations,
  actions
}
