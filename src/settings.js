/**
 * 设置模块下定义变量
 * 不同环境状态下定义不同的变量状态
 */
module.exports = {
  // 应用名称
  name: 'ALADDIN MALL',
  // 公链ID
  chainID: '97',
  // 测试服务器版本号
  devVersion: '1.0.0',
  // 正式服务器版本号
  disVersion: '1.0.0',
  // 设置是否是正式环境(该参数及其重要)
  isDistrucbuildEnvironment: false,
  // 服务器接口地址
  baseOneURL: 'https://xxx',
  // IPFS节点
  ipfsNode: 'test-ipfs-content.hermodbridge.lat',
  // NFT url
  ipfsNFTUrl: 'https://test-ipfs.hermodbridge.lat/ipfs/',
  // rpc 节点地址
  rpc: 'https://endpoints.omniatech.io/v1/bsc/testnet/public',
  // wallet Connect
  walletConnectBridge: 'https://bridge.walletconnect.org',
  // telegram
  telegramUrl: 'https://',
  // medium
  mediumUrl: 'https://',
  // twitter
  twitterUrl: 'https://',
  // alad
  aladUrl: 'https://',
  // rainbow nasie
  rainbowNasieUrl: 'https://',
  oraUrl: 'https://',
  // about us
  aboutUsUrl: 'https://',
  // guide
  guideUrlEN: 'https://',
  guideUrlCN: 'https://',
  // 置换流动性LP的地址
  lpUrl: 'https://pancakeswap.finance/add/xxx/xxx',
  buyUrl: 'https://pancakeswap.finance/swap?inputCurrency=xxx&outputCurrency=xxx',
}
