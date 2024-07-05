import { parseNumber } from './param.js'
import { MaxUint256 } from '@ethersproject/constants'
import constParam from './const.js'
import BigNumber from './bignumber.js'
import contractObject from './inits.js'
import { newTransactionHash, transactionNFTStatusWithHash } from '@/utils/queryHash'
import {chuDivision, getCurrentTime} from '@/utils/computing'
import { ethers } from "ethers";


// 获取GAKA对标USDT的价格
async function getGakaCoverToUSDTPrice(amount, callBack) {
  const router_obj = contractObject.getRouterObject();
  const amounts = parseNumber(1, 18);
  const addressList = [constParam.usdt_addr, constParam.gaka_addr];
  const toUSDTData = await router_obj.methods.getAmountsOut(amounts, addressList).call();
  const gakaPrice = toUSDTData[1] * amount;
  callBack(gakaPrice)
}

// 获取gaka合约地址可扣余额
function getGakaAllowance(address) {
  const gaka_obj = contractObject.getGakaErc2Object();
  return gaka_obj.methods.allowance(address, constParam.nft_addr).call();
}

// 授权gaka合约可扣blod数量 new BingNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
async function approveGakaContract(address, connectType) {
  if (connectType === '1') {
    const data = { from: address };
    const gaka_obj = contractObject.getGakaErc2Object();
    //const approveNum = parseFloat(MaxUint256.toString());
    return gaka_obj.methods.approve(constParam.nft_addr, MaxUint256).send(data);
  } else if (connectType === '2') {
    const gaka_obj = contractObject.getGakaErc2Object();
    const tx = gaka_obj.methods.approve(constParam.nft_addr, MaxUint256); // 合约操作的函数
    const data = tx.encodeABI();// 为指定的合约方法进行ABI编码，可用于发送交易、调用方法或向另一个合约方法传递参数。
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(address);
    // value
    // const _value = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    // const value = sanitizeHex(convertStringToHex(_value));
    // const value = MaxUint256._hex;
    const dataTx = {
      from: address,
      to: constParam.gaka_addr, // 虚拟机去那个合约地址执行授权操作
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 获取购买NFT时候可扣ALAD余额
function getCanBuckledALADAllowance(address) {
  const alad_obj = contractObject.getAladErc20Object();
  return alad_obj.methods.allowance(address, constParam.market_addr).call();
  // const alad_obj = contractObject.getAladErc20Object();
  // alad_obj.methods.allowance(address,constParam.market_addr).call((error,res) =>{
  //   const msUtils = Math.pow(10,18);
  //   const ret = BigNumber(res);
  //   const num = parseFloat(ret.dividedBy(msUtils));
  //   callBack(num);
  // });
}

// 授权market_add合约可扣ALAD数量
async function approveALADContract(address, connectType) {
  if (connectType === '1') {
    const data = { from: address };
    const alad_obj = contractObject.getAladErc20Object();
    //const approveNum = parseFloat(MaxUint256.toString());
    return alad_obj.methods.approve(constParam.market_addr, MaxUint256).send(data);
  } else if (connectType === '2') {
    const alad_obj = contractObject.getAladErc20Object();
    const tx = alad_obj.methods.approve(constParam.market_addr, MaxUint256); // 合约操作的函数
    const data = tx.encodeABI();// 为指定的合约方法进行ABI编码，可用于发送交易、调用方法或向另一个合约方法传递参数。
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(address);
    const dataTx = {
      from: address,
      to: constParam.alad_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 获取购买NFT时候可扣BUSD余额
function getCanBuckledBUSDAllowance(address) {
  const busd_obj = contractObject.getBUSDObject();
  return busd_obj.methods.allowance(address, constParam.market_addr).call();
}

// 授权market_add合约可扣BUSD数量
async function approveBUSDContract(address, connectType) {
  if (connectType === '1') {
    const data = { from: address };
    const busd_obj = contractObject.getBUSDObject();
    //const approveNum = parseFloat(MaxUint256.toString());
    return busd_obj.methods.approve(constParam.market_addr, MaxUint256).send(data);
  } else if (connectType === '2') {
    const busd_obj = contractObject.getBUSDObject();
    const tx = busd_obj.methods.approve(constParam.market_addr, MaxUint256); // 合约操作的函数
    const data = tx.encodeABI();// 为指定的合约方法进行ABI编码，可用于发送交易、调用方法或向另一个合约方法传递参数。
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(address);
    const dataTx = {
      from: address,
      to: constParam.usdt_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}


// 创建NFT
async function createToken(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const nft_obj = contractObject.getNFTObject();
    const price = parseNumber(dataMap.price, 18);
    return nft_obj.methods.NewcreateToken(dataMap.tokenURL, dataMap.nftType, dataMap.fSort, dataMap.sSort, price,dataMap.payType).send(data);
  } else if (connectType === '2') {
    const nft_obj = contractObject.getNFTObject();
    const price = parseNumber(dataMap.price, 18);
    const tx = nft_obj.methods.NewcreateToken(dataMap.tokenURL, dataMap.nftType, dataMap.fSort, dataMap.sSort, price,dataMap.payType);
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.nft_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    // hash值
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return transactionNFTStatusWithHash(hash);
    //const signTx = await contractObject.getInitGlobalWalletConenctor().signTransaction(dataTx);
    //const receipt = await contractObject.getInitGlobalWeb3().eth.sendSignedTransaction(signTx);
    //const result = await newTransactionHash(hash);
  }
}

// 创建爆款NFT
async function createHotToken(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const nft_obj = contractObject.getNFTObject();
    const price = parseNumber(dataMap.price, 18);
    return nft_obj.methods.MintHotNFT(dataMap.tokenURL, price, dataMap.fSort, dataMap.sSort, dataMap.addressList, dataMap.percentList).send(data);
  } else if (connectType === '2') {
    const nft_obj = contractObject.getNFTObject();
    const price = parseNumber(dataMap.price, 18);
    const tx = nft_obj.methods.MintHotNFT(dataMap.tokenURL, price, dataMap.fSort, dataMap.sSort, dataMap.addressList, dataMap.percentList);
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.nft_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    // hash值
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return transactionNFTStatusWithHash(hash);
    //const signTx = await contractObject.getInitGlobalWalletConenctor().signTransaction(dataTx);
    //const receipt = await contractObject.getInitGlobalWeb3().eth.sendSignedTransaction(signTx);
    //const result = await newTransactionHash(hash);
  }
}

// 添加到NFT市场
async function createOrder(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const price = parseNumber(dataMap.price, 18);
    console.log('上架价格price =',price);
    const market_obj = contractObject.getMaketObject();
    return market_obj.methods.createOrder(dataMap.assetID, price).send(data);
  } else if (connectType === '2') {
    const market_obj = contractObject.getMaketObject();
    const price = parseNumber(dataMap.price, 18);
    const tx = market_obj.methods.createOrder(dataMap.assetID, price);
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.market_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 绑定上级地址
async function bindUpLevelAddress(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const relation_obj = contractObject.getRelationObject();
    return relation_obj.methods.content(dataMap.superAddress).send(data);
  } else if (connectType === '2') {
    const relation_obj = contractObject.getRelationObject();
    const tx = relation_obj.methods.content(dataMap.superAddress);
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.relation_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 从市场撤销我的NFT
async function cancelOrder(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const market_obj = contractObject.getMaketObject();
    return market_obj.methods.cancelOrder(dataMap.tokenID).send(data);
  } else if (connectType === '2') {
    const market_obj = contractObject.getMaketObject();
    const tx = market_obj.methods.cancelOrder(dataMap.tokenID);
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.market_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 常规交割NFT
async function deliveryNft(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const nft_obj = contractObject.getNFTObject();
    return nft_obj.methods.MaketDeliveryNft(dataMap.tokenID).send(data);
  } else if (connectType === '2') {
    const nft_obj = contractObject.getNFTObject();
    const tx = nft_obj.methods.MaketDeliveryNft(dataMap.tokenID);
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.nft_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 艺术类交割NFT
async function deliveryArtNft(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const nft_obj = contractObject.getNFTObject();
    return nft_obj.methods.newDeliveryNft(dataMap.tokenID).send(data);
  } else if (connectType === '2') {
    const nft_obj = contractObject.getNFTObject();
    const tx = nft_obj.methods.newDeliveryNft(dataMap.tokenID);
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.nft_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}


// 销毁NFT
async function destroyNFT(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const nft_obj = contractObject.getNFTObject();
    return nft_obj.methods.destroyNFT(dataMap.tokenID).send(data);
  } else if (connectType === '2') {
    const nft_obj = contractObject.getNFTObject();
    const tx = nft_obj.methods.destroyNFT(dataMap.tokenID);
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.nft_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 获取冻结流通量
function aladCirculation() {
  const freeze_obj = contractObject.getFreezeObject();
  return freeze_obj.methods.aladCir().call();
}

// 提取可用的ALAD
async function aladWidth(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const freeze_obj = contractObject.getFreezeObject();
    return freeze_obj.methods.withDraw().send(data);
  } else if (connectType === '2') {
    const freeze_obj = contractObject.getFreezeObject();
    const tx = freeze_obj.methods.withDraw();
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.freeze_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 购买市场艺术类NFT
async function safeExecuteOrder(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const makret_obj = contractObject.getMaketObject();
    return makret_obj.methods.safeExecuteOrder(dataMap.tokenID,dataMap.payType).send(data);
  } else if (connectType === '2') {
    const makret_obj = contractObject.getMaketObject();
    const tx = makret_obj.methods.safeExecuteOrder(dataMap.tokenID,dataMap.payType);
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.market_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 购买市场常规NFT
async function executeNormalOrder(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const makret_obj = contractObject.getMaketObject();
    return makret_obj.methods.executeNormalOrder(dataMap.tokenID,dataMap.payType).send(data);
  } else if (connectType === '2') {
    const makret_obj = contractObject.getMaketObject();
    const tx = makret_obj.methods.safeExecuteOrder(dataMap.tokenID,dataMap.payType);
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.market_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 获取GAKA余额
function getGAKABlanace(dataMap) {
  const gakaERC20_obj = contractObject.getGakaErc2Object();
  return gakaERC20_obj.methods.balanceOf(dataMap.address).call();
}

// 获取ALAD余额
function getALADBlanace(dataMap) {
  const aladERC20_obj = contractObject.getAladErc20Object();
  return aladERC20_obj.methods.balanceOf(dataMap.address).call();
}

// 获取N个USDT需要多少阿拉丁
async function getAladPrice(usdtNum, callBack) {
  let router_obj = contractObject.getRouterObject();
  let amounts = parseNumber(1, 18);
  let addressList = [constParam.usdt_addr, constParam.alad_addr];
  let ocToUsdtData = await router_obj.methods.getAmountsOut(amounts, addressList).call();
  let msUtils = Math.pow(10, 18);
  let ret = new BigNumber(ocToUsdtData[1]);
  let price = (parseFloat(usdtNum) * parseFloat(ret.dividedBy(msUtils))).toFixed(4);
  callBack(price)
}

// 获取N个阿拉丁需要所少个BUST
function getNeedUSDTWithALAD() {
  let router_obj = contractObject.getRouterObject();
  let amounts = parseNumber(1, 18);
  let addressList = [constParam.usdt_addr, constParam.alad_addr];
  return router_obj.methods.getAmountsOut(amounts, addressList).call()

  // let ocToUsdtData = await router_obj.methods.getAmountsOut(amounts,addressList).call();
  // let msUtils = Math.pow(10,18);
  // let ret = new BigNumber(ocToUsdtData[1]);
  // let price = (parseFloat(aladNum) / parseFloat(ret.dividedBy(msUtils))).toFixed(4);
  // callBack(price)
}

// 获取阿拉丁价格
async function getSingleAladPrice() {
  let router_obj = contractObject.getRouterObject();
  let amounts = parseNumber(1, 18);
  let addressList = [constParam.alad_addr, constParam.usdt_addr];
  return await router_obj.methods.getAmountsOut(amounts, addressList).call();
}

// 获取钱包可以提取的ALAD数量
function getALADExtractBlanace(dataMap) {
  const freeze_obj = contractObject.getFreezeObject();
  return freeze_obj.methods.getUserInfo(dataMap.address).call();
}

// 获取出售NFT合约授权的地址
function getNFTApprovedSaleAddress(dataMap) {
  const nft_obj = contractObject.getNFTObject();
  return nft_obj.methods.getApproved(dataMap.tokenID).call();
}

// 授权出售NFT合约地址
async function ApprovedNFTSaleAddress(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const nft_obj = contractObject.getNFTObject();
    return nft_obj.methods.approve(dataMap.nftmarketAddress, dataMap.tokenID).send(data);
  } else if (connectType === '2') {
    const nft_obj = contractObject.getNFTObject();
    const tx = nft_obj.methods.approve(dataMap.nftmarketAddress, dataMap.tokenID);
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.nft_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 获取用户可领取的奖励
function getUserCanWithdrawNum(dataMap) {
  const chef_obj = contractObject.getCherfObject();
  return chef_obj.methods.pendingCake(0, dataMap.address).call();
}

// 获取用户质押LP的数量
function getUserStakeLPNum(dataMap) {
  const chef_obj = contractObject.getCherfObject();
  return chef_obj.methods.userInfo(0, dataMap.address).call();
}

// 获取总质押LP的数量
function getTotalStakeLPNum(dataMap, index = 1) {
  const lpErc20_obj = contractObject.getLpErc20Object();
  return lpErc20_obj.methods.balanceOf(constParam.pool_addr(index)).call();
}

// 获取LP铸造池的APR
async function getLPStakeRelatedData(userStakeNum, totalStakeNum) {
  let busdReserves;
  let lpErc20_obj = contractObject.getLpErc20Object();
  let chef_obj = contractObject.getCherfObject();
  let router_obj = contractObject.getRouterObject();
  // 获取币种地址
  let token0 = await lpErc20_obj.methods.token0().call();
  // 获取总的币种1、币种2的质押数量
  let { _reserve0, _reserve1 } = await lpErc20_obj.methods.getReserves().call();
  // 获取LP总的发行的数量
  let totalSupplyNum = await lpErc20_obj.methods.totalSupply().call();
  // 获取第0个池子占的份额
  let allocPointData = await chef_obj.methods.poolInfo(0).call();
  let allocPoint = allocPointData.allocPoint;
  // 获取总的份额
  let totalAllocPoint = await chef_obj.methods.totalAllocPoint().call();
  // 获取Max价格
  let amounts = parseNumber(1, 18);
  let addressList = [constParam.alad_addr, constParam.usdt_addr];
  let aladToUsdtData = await router_obj.methods.getAmountsOut(amounts, addressList).call();
  let aladPrice = aladToUsdtData[1];
  if (token0 == constParam.usdt_addr) {
    busdReserves = _reserve0;
  } else {
    busdReserves = _reserve1;
  }
  // 质押池一年产出数量
  let stakeProductMaxNum = 9986400;
  // 用户质押LP的价值
  let userStakeToUSDT = 2 * userStakeNum * chuDivision(busdReserves, 18) / totalSupplyNum;
  // 获取平台总的质押LP的价值
  let platformToUSDT = 2 * totalStakeNum * chuDivision(busdReserves, 18) / totalSupplyNum;
  // 年化率
  let lpValue = (totalStakeNum * busdReserves * 2) / totalSupplyNum;
  let lpARP = (allocPoint * stakeProductMaxNum * aladPrice) / (totalAllocPoint * lpValue);
  if (parseFloat(totalStakeNum) <= 0) {
    lpARP = 0;
  }
  return new Promise((resolve, reject) => {
    resolve({ userStakeToUSDT: userStakeToUSDT, platformToUSDT: platformToUSDT, lpARP: lpARP });
  });
}

// 领取LP质押ALAD奖励
async function depositLPStakeAwardALAD(dataMap, connectType, index = 1) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const chef_obj = contractObject.getPoolObject(index);
    return chef_obj.methods.deposit(0, 0).send(data);
  } else if (connectType === '2') {
    const chef_obj = contractObject.getPoolObject(index);
    const tx = chef_obj.methods.deposit(0, 0).send();
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.pool_addr(index),
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 撤回质押的LP数量
async function withdrawStakeLPNum(dataMap, connectType, index = 1) {
  if (connectType === '1') {
    const data = { from: dataMap.address };
    const chef_obj = contractObject.getPoolObject(index);
    return index === 1 ? chef_obj.methods.withdraw(0, dataMap.amount).send(data) : chef_obj.methods.withdraw(0).send(data);
  } else if (connectType === '2') {
    const chef_obj = contractObject.getPoolObject(index);
    const tx = index === 1 ? chef_obj.methods.withdraw(0, dataMap.amount).send() : chef_obj.methods.withdraw(0).send(data);
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.pool_addr(index),
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// LP质押
async function depositStakeLPALAD(dataMap, connectType, index = 1) {
  if (connectType === '1') {
    const data = { from: dataMap.address }
    const amount = parseNumber(dataMap.amount, 18);
    const chef_obj = contractObject.getPoolObject(index);
    return chef_obj.methods.deposit(0, amount).send(data);
  } else if (connectType === '2') {
    const chef_obj = contractObject.getPoolObject(index);
    const amount = parseNumber(dataMap.amount, 18);
    const tx = chef_obj.methods.deposit(0, amount).send();
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.pool_addr(index),
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 获取当前登录用户LP余额
function getLPBalance(dataMap) {
  let lpErc20_obj = contractObject.getLpErc20Object();
  return lpErc20_obj.methods.balanceOf(dataMap.address).call();
}

// 获取chef合约地址可扣余额
function getChefAllowance(address, index = 1) {
  const lpErc20_obj = contractObject.getLpErc20Object();
  return lpErc20_obj.methods.allowance(address, constParam.pool_addr(index)).call();
}

// 授权chef合约可扣blod数量
async function approveChefContract(address, connectType, index = 1) {
  if (connectType === '1') {
    const data = { from: address };
    const lpErc20_obj = contractObject.getLpErc20Object();
    //const approveNum = parseFloat(MaxUint256.toString());
    return lpErc20_obj.methods.approve(constParam.pool_addr(index), MaxUint256).send(data);
  } else if (connectType === '2') {
    const lpErc20_obj = contractObject.getLpErc20Object();
    const tx = lpErc20_obj.methods.approve(constParam.pool_addr(index), MaxUint256).send();
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.lp_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 获取出售价格区间的参数
function getXYpercent(dataMap) {
  let provide_obj = contractObject.getLpProvidebject();
  return provide_obj.methods.getXYpercent().call();
}

// 获取当前地址是否绑定了上级
function getParents(dataMap) {
  let relation_obj = contractObject.getRelationObject();
  return relation_obj.methods.getParents(dataMap.address).call();
}

// 获取绑定上级地址的根地址
function getSpecialAddr(dataMap) {
  let getProvide_obj = contractObject.getLpProvidebject();
  return getProvide_obj.methods.getSpecialAddr().call();
}

// 获取空投数据
function getAirdropInfoData(dataMap) {
  // const data = {from:dataMap.address}
  const airdrop_obj = contractObject.getAirdropObject();
  return airdrop_obj.methods.getUserAmount(dataMap.address).call();
}

// 提取空投
async function extractAirdrop(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address }
    const airdrop_obj = contractObject.getAirdropObject();
    return airdrop_obj.methods.claim().send(data);
  } else if (connectType === '2') {
    const airdrop_obj = contractObject.getAirdropObject();
    const tx = airdrop_obj.methods.claim().send();
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.airdrop_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 许愿池
async function wishDepositToken(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address }
    const amount = parseNumber(dataMap.amount, 18);
    const market_obj = contractObject.getMaketObject();
    return market_obj.methods.depositToken(amount).send(data);
  } else if (connectType === '2') {
    const amount = parseNumber(dataMap.amount, 18);
    const market_obj = contractObject.getMaketObject();
    const tx = market_obj.methods.depositToken(amount).send();
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.market_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 数字签名
function signature(dataMap) {
  // dataMap.name + dataMap.areaNum + dataMap.number + dataMap.area +
  const hash = contractObject.getInitGlobalWeb3().utils.keccak256(dataMap.tokenid);
  return contractObject.getInitGlobalWeb3().eth.sign(hash, dataMap.address);
}

// 许愿池
async function buyHotOrder(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address }
    const market_obj = contractObject.getMaketObject();
    const fullPhone = `${dataMap.areaNum} ${dataMap.number}`;
    return market_obj.methods.BuyHotOrder(dataMap.tokenID, dataMap.count, dataMap.receiver, fullPhone, dataMap.areDesc).send(data);
  } else if (connectType === '2') {
    const fullPhone = `${dataMap.areaNum} ${dataMap.number}`;
    const market_obj = contractObject.getMaketObject();
    const tx = market_obj.methods.BuyHotOrder(dataMap.tokenID, dataMap.count, dataMap.receiver, fullPhone, areDesc).send();
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.market_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

// 购买商店商品
async function buyOrder(dataMap, connectType) {
  if (connectType === '1') {
    const data = { from: dataMap.address }
    const market_obj = contractObject.getMaketObject();
    const fullPhone = `${dataMap.areaNum} ${dataMap.number}`;
    return market_obj.methods.buyOrder(dataMap.tokenID, dataMap.sellAddress, dataMap.count, dataMap.usdtValue, dataMap.receiver, fullPhone, dataMap.areDesc, dataMap.remarks,dataMap.payType).send(data);
  } else if (connectType === '2') {
    const fullPhone = `${dataMap.areaNum} ${dataMap.number}`;
    const market_obj = contractObject.getMaketObject();
    const tx = market_obj.methods.buyOrder(dataMap.tokenID, dataMap.sellAddress, dataMap.count, dataMap.usdtValue, dataMap.receiver, fullPhone, dataMap.areDesc, dataMap.remarks,dataMap.payType).send();
    const data = tx.encodeABI();
    // gasLimit
    const gasLimit = await tx.estimateGas({ from: dataMap.address });
    // gasPrice
    const gasPrice = await contractObject.getInitGlobalWeb3().eth.getGasPrice();
    // nonce
    const nonce = await contractObject.getInitGlobalWeb3().eth.getTransactionCount(dataMap.address);
    const dataTx = {
      from: dataMap.address,
      to: constParam.market_addr,
      data: data,
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const hash = await contractObject.getInitGlobalWalletConenctor().sendTransaction(dataTx);
    return newTransactionHash(hash);
  }
}

async function getPoolInfo(address, index) {
  let pool_obj = contractObject.getPoolObject(index);
  return pool_obj.methods.getPoolInfo(address).call();
}

async function getUserDeposit(address, index) {
  let pool_obj = contractObject.getPoolObject(index);
  return pool_obj.methods.getUserDeposit(address).call();
}

function getUserDepositAmount(address) {
  let shop_pool_obj = contractObject.getShopPoolObject();
  return shop_pool_obj.methods.getUserDepositAmount(address).call();
}

// 授权上架/下架商店商品签名操作
async function getApproveSignShopOnShelfGood(dataMap) {
  const times = getCurrentTime();
  const message = dataMap.sender.toLowerCase() + dataMap.orderid + times;
  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
  const provider = new ethers.providers.Web3Provider(contractObject.getInitGlobalWeb3().currentProvider);
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(hash, dataMap.sender);
  const signDict = {}
  signDict['time'] = times;
  signDict['signature'] = signature;

  return signDict;
}
// 授权发布商店商品签名操作
async function getApprovePublishOrderSignShopOnShelfGood(dataMap) {
  const times = getCurrentTime();
  const message = dataMap.sender.toLowerCase() + times;
  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
  const provider = new ethers.providers.Web3Provider(contractObject.getInitGlobalWeb3().currentProvider);
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(hash, dataMap.sender);
  const signDict = {}
  signDict['time'] = times;
  signDict['signature'] = signature;

  return signDict;
}


export default {createToken, createHotToken, createOrder, getGakaAllowance, approveGakaContract, getGakaCoverToUSDTPrice, bindUpLevelAddress, cancelOrder, deliveryNft, deliveryArtNft, destroyNFT, aladCirculation, aladWidth,
  safeExecuteOrder, getGAKABlanace, getALADBlanace, getAladPrice, getCanBuckledALADAllowance, approveALADContract, getALADExtractBlanace, getNFTApprovedSaleAddress, ApprovedNFTSaleAddress, getUserStakeLPNum, getTotalStakeLPNum, getLPStakeRelatedData, getUserCanWithdrawNum,
  depositLPStakeAwardALAD, depositStakeLPALAD, getLPBalance, withdrawStakeLPNum, getChefAllowance, approveChefContract, getXYpercent, getParents, getSpecialAddr, getSingleAladPrice, getNeedUSDTWithALAD, extractAirdrop, getAirdropInfoData,
  signature, wishDepositToken, executeNormalOrder, buyHotOrder, buyOrder, getPoolInfo, getUserDeposit, getUserDepositAmount, getCanBuckledBUSDAllowance, approveBUSDContract, getApproveSignShopOnShelfGood,getApprovePublishOrderSignShopOnShelfGood}


