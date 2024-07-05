//import { parseLog } from 'ethereum-event-logs';
import contractObject from '../decentralizedApi/inits.js';
import contractInit from '../decentralizedApi/const.js';

// 轮询查找交易状态
export function transactionHash(hash,callBack){
  var number_takeGain = 0;
  const web3 = contractObject.getInitGlobalWeb3();
  let timer_takeGain = setInterval(() => {
    number_takeGain++;
    // 查询交易是否完成，这里要通过这个方法去一直查询交易是否完成
    web3.eth.getTransactionReceipt(hash).then(function(result) {
      if(result == null) {
        //callBack(result)
        console.log('轮询查找交易状态为空');
      }else if (result.status){
        callBack(result)
        clearInterval(timer_takeGain);
        console.log('轮询查找交易已经完成');
      }else{
        callBack(result);
        clearInterval(timer_takeGain);
        console.log('轮询查找返回交易失败');
      }
    });
    if(number_takeGain > 10) {
      clearInterval(timer_takeGain);
      callBack(result);
      console.log('轮询查找交易时间超时');
     }
  }, 2000);
}

// 轮询查找交易状态
export function newTransactionHash(hash) {
  var number_takeGain = 0;
  const web3 = contractObject.getInitGlobalWeb3();
  return new Promise((resolve,reject) => {
    let timer_takeGain = setInterval( async () => {
      number_takeGain++;
      // 查询交易是否完成，这里要通过这个方法去一直查询交易是否完成
      const result = await web3.eth.getTransactionReceipt(hash);
      if(result == null) {
        console.log('轮询查找交易状态为空');
      }else if (result.status){
        clearInterval(timer_takeGain);
        console.log('轮询查找交易已经完成');
        resolve(result);
      }else{
        clearInterval(timer_takeGain);
        console.log('轮询查找返回交易失败');
        reject(result)
      }
      if(number_takeGain > 10) {
        clearInterval(timer_takeGain);
        console.log('轮询查找交易时间超时');
        reject(result)
      }
    }, 2000);
  });
}

// 查找创建NFT交易状态
export function transactionNFTStatusWithHash(hash){
  var number_takeGain = 0;
  const web3 = contractObject.getInitGlobalWeb3();
  return new Promise((resolve,reject) => {
    let timer_takeGain = setInterval( async () => {
      number_takeGain++;
      // 查询交易是否完成，这里要通过这个方法去一直查询交易是否完成
      const result = await web3.eth.getTransactionReceipt(hash);
      if(result == null) {
        console.log('轮询查找交易状态为空');
      }else if (result.status){
        //let logs = result.logs;
        //const events = parseLog([logs[4]],contractInit.nft_abi);
        //result['events'] = events[0];
        clearInterval(timer_takeGain);
        console.log('轮询查找交易已经完成');
        resolve(result);
      }else{
        clearInterval(timer_takeGain);
        console.log('轮询查找返回交易失败');
        reject(result)
      }
      if(number_takeGain > 10) {
        clearInterval(timer_takeGain);
        console.log('轮询查找交易时间超时');
        reject(result)
      }
    }, 2000);
  });
}
