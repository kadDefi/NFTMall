const settingConfig = require('../settings.js');
import constParam from './const.js'
import Web3 from "web3";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

//初始化代币合约对象
let nft_obj = null;
let market_obj = null;
let relation_obj = null;
let gakaErc2_obj = null;
let aladErc2_obj = null;
let router_obj = null;
let freeze_obj = null;
let chef_obj = null;
let lpErc2_obj = null;
let provide_obj = null;
let airdrop_obj = null;
let pool1_obj = null;
let pool2_obj = null;
let pool3_obj = null;
let pool4_obj = null;
let pool5_obj = null;
let shop_pool_obj = null;
let busd_obj = null;

// 定义一个全局的Web3对象
let globalWeb3 = null;
// 定义全局的wallector对象
let globalWalletConenctor = null;

function initWithContractObjec() {
    if (nft_obj !== null && market_obj !== null && relation_obj !== null && gakaErc2_obj !== null && aladErc2_obj !== null && router_obj !== null && freeze_obj !== null && chef_obj !== null && lpErc2_obj !== null
        && provide_obj !== null && airdrop_obj !== null && busd_obj !== null) {
        console.log('contract object Initialized');
        return;
    }
    // if(globalWeb3 == null){
    //   globalWeb3 = web3;
    // }
    console.log('初始化NFT、TOKEN、BATTLE、BOSS合约');
    // 初始化对应合约
    const web3 = getInitGlobalWeb3();
    nft_obj = new web3.eth.Contract(constParam.nft_abi, constParam.nft_addr);
    market_obj = new web3.eth.Contract(constParam.market_abi, constParam.market_addr);
    relation_obj = new web3.eth.Contract(constParam.relation_abi, constParam.relation_addr);
    gakaErc2_obj = new web3.eth.Contract(constParam.erc2_abi, constParam.usdt_addr);
    aladErc2_obj = new web3.eth.Contract(constParam.erc2_abi, constParam.alad_addr);
    router_obj = new web3.eth.Contract(constParam.router_abi, constParam.router_addr);
    freeze_obj = new web3.eth.Contract(constParam.freeze_abi, constParam.freeze_addr);
    chef_obj = new web3.eth.Contract(constParam.chef_abi, constParam.chef_addr);
    lpErc2_obj = new web3.eth.Contract(constParam.lpErc20_abi, constParam.lp_addr);
    provide_obj = new web3.eth.Contract(constParam.provide_abi, constParam.provide_addr);
    airdrop_obj = new web3.eth.Contract(constParam.airdrop_abi, constParam.airdrop_addr);
    pool2_obj = new web3.eth.Contract(constParam.pool_abi, constParam.pool_addr(2));
    pool3_obj = new web3.eth.Contract(constParam.pool_abi, constParam.pool_addr(3));
    pool4_obj = new web3.eth.Contract(constParam.pool_abi, constParam.pool_addr(4));
    pool5_obj = new web3.eth.Contract(constParam.pool_abi, constParam.pool_addr(5));
    shop_pool_obj = new web3.eth.Contract(constParam.shop_pool_abi, constParam.shop_pool_addr);
    busd_obj = new web3.eth.Contract(constParam.erc2_abi, constParam.usdt_addr);
}

// 获取web3对象
function getInitGlobalWeb3() {
    if (globalWeb3 !== null) {
        return globalWeb3;
    }
    if (typeof window.ethereum !== 'undefined') {
        globalWeb3 = new Web3(window.ethereum);
    } else {
        globalWeb3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(settingConfig.rpc));
    }
    return globalWeb3;
}

// 当使用walletConnect连接钱包保存connector对象
function initGlobalWalletConenctor(connector) {
    globalWalletConenctor = connector;
}

// 获取connector对象
function getInitGlobalWalletConenctor() {
    if (globalWalletConenctor !== null) {
        return globalWalletConenctor;
    }
    globalWalletConenctor = new WalletConnect({bridge: settingConfig.walletConnectBridge, qrcodeModal: QRCodeModal});
    return globalWalletConenctor;
}

// NFT合约对象
function getNFTObject() {
    return nft_obj;
}

// market合约对象
function getMaketObject() {
    return market_obj;
}

// relation合约对象
function getRelationObject() {
    return relation_obj;
}

// gaka合约对象
function getGakaErc2Object() {
    return gakaErc2_obj;
}

// alad合约对象
function getAladErc20Object() {
    return aladErc2_obj;
}

// router合约对象
function getRouterObject() {
    return router_obj;
}

// freeze_obj合约对象
function getFreezeObject() {
    return freeze_obj;
}

// chef_obj合约对象
function getCherfObject() {
    return chef_obj;
}

// chef_obj合约对象
function getLpErc20Object() {
    return lpErc2_obj;
}

// provide_obj合约对象
function getLpProvidebject() {
    return provide_obj;
}

// airdrop_obj合约对象
function getAirdropObject() {
    return airdrop_obj;
}

// busd_obj合约对象
function getBUSDObject() {
  return busd_obj;
}

function getPoolObject(index) {
    let pool_obj;
    switch (index) {
        case 1:
            pool_obj = chef_obj;
            break
        case 2:
            pool_obj = pool2_obj;
            break
        case 3:
            pool_obj = pool3_obj;
            break
        case 4:
            pool_obj = pool4_obj;
            break
        case 5:
            pool_obj = pool5_obj;
            break
    }
    return pool_obj;
}

function getShopPoolObject() {
    return shop_pool_obj;
}


export default {initWithContractObjec, getInitGlobalWeb3, getNFTObject, getMaketObject, getRelationObject, getGakaErc2Object, getAladErc20Object, getRouterObject, getFreezeObject, initGlobalWalletConenctor,
    getInitGlobalWalletConenctor, getCherfObject, getLpErc20Object, getLpProvidebject, getAirdropObject, getPoolObject, getShopPoolObject, getBUSDObject};







