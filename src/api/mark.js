import request from "@/utils/request";

/**
 * 获取市场NFT列表数据
 */
export function getMarkListNFT(params) {
  return request.post('markList', params)
}

/**
 * 获取铸造NFT中一二级分类列表
 */
export function getCastingNFTClassification(params) {
  return request.get('getClassification', params)
}

/**
 * 上传用户头像
 */
export function uploadAvatar(params) {
  return request.post('picture', params)
}

/**
 * 获取和修改名称
 */
export function getCustomerInfoData(params) {
  return request.post('name', params)
}

/**
 * 获取用户持有、在售、待交割
 */
export function getCustomerNFTList(params) {
  return request.get('list', params)
}

/**
 * 获取用户邀请的下级
 */
export function getCustomerPromoteList(params) {
  return request.get('promote', params)
}

/**
 * 获取用户钱包数据
 */
export function getCustomerWalletList(params) {
  return request.get('wallet', params)
}

/**
 * 获取NFT详情
 */
export function getNFTDetailInfo(params) {
  return request.get('inStockCheck', params)
}

/**
 * 喜欢NFT/不喜欢NFT
 */
export function operationLikeNFT(params) {
  return request.post('like', params)
}

/**
 * 创世NFT
 */
export function getGenesisNFT(params) {
  return request.get('genesis', params)
}

/**
 * 获取市场列表
 */
export function getMarketNFTListData(params) {
  return request.get('market', params)
}

/**
 * 获取公告列表
 */
export function getAnnounmentListData(params) {
  return request.get('notice', params)
}

/**
 * 获取铸造者详情
 */
export function getCreatorListData(params) {
  return request.get('userlist', params)
}

/**
 * 每日释放
 */
export function getUserReleaseListData(params) {
  return request.get('userRelease', params)
}

/**
 * 历史记录
 */
export function getHistoryRecordListData(params) {
  return request.get('history', params)
}

/**
 * 填写收货信息
 */
export function deliveLogisticsInfoData(params) {
  return request.post('deliveInfo', params)
}

/**
 * 取消交割
 */
export function cancleDeliveryInfoData(params) {
  return request.post('cancleDelivery', params)
}

/**
 * 获取收货人的收货信息
 */
export function getReceiverLogisticsInfoData(params) {
  return request.get('getReceiver', params)
}

/**
 * 卖家确认发货
 */
export function toBeDeliveryInfoData(params) {
  return request.post('toBeDelivery', params)
}

/**
 * 获取收货信息和物流信息
 */
export function getExpressLogisticsInfoData(params) {
  return request.get('getExpress', params)
}

/**
 * 获取收货信息和物流信息(更新物流快递单号公司)
 */
export function updateExpressLogisticsInfoData(params) {
  return request.get('getUserExpress', params)
}

/**
 * 更新物流信息
 */
export function updateLogisticsInfoData(params) {
  return request.post('updateExpress', params)
}

/**
 * 获取用户是否满足进行许愿
 */
export function getCustomerSatisfyWish(params) {
  return request.get('getTime', params)
}

/**
 * 获取铸造者的信息
 */
export function getCasterInfo(params) {
  return request.get('/getCasterInfo', params)
}

/**
 * 判断是否为特殊的地址
 */
export function getSpecialAddr(params) {
  return request.get('/specialAddr', params)
}


/**
 * 爆款商品的分类
 */
export function getSpecialAddrHotClassify(params) {
  return request.get('/hotClassify', params)
}

/**
 * 购买的爆款商品列表
 */
export function getHotOrderList(params) {
  return request.get('/hotOrder', params)
}

/**
 * 获取爆款商品的物流信息
 */
export function getHotOrderLogisticsInfoData(params) {
  return request.get('/getHotExpress', params)
}

/**
 * 获取爆款商品铸造时候的比列
 */
export function getHotOrderCastingPencent(params) {
  return request.get('/getUserPencent', params)
}

/**
 * 是否特色地址(能创建店铺订单)
 */
export function getSpecialSeller(params) {
  return request.get('/specialSeller', params)
}

/**
 * 发布店铺商品(特殊地址才能铸造)
 * @param params
 * @returns {AxiosPromise}
 */
export function publishOrder(params) {
  return request.post('/publishOrder', params)
}

/**
 * 是否有权限申请店铺
 * @param params
 * @returns {AxiosPromise}
 */
export function getShopStatus(params) {
  return request.get('/getShopStatus', params)
}

/**
 * 申请成为商家
 * @param params
 * @returns {AxiosPromise}
 */
export function applySeller(params) {
  return request.post('/applySeller', params)
}

/**
 * 店铺列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getShop(params) {
  return request.get('/getShop', params)
}

/**
 * 店铺商品用户-详情
 * @param params
 * @returns {AxiosPromise}
 */
export function getShopList(params) {
  return request.get('/getShopList', params)
}

/**
 * 店铺商品详情
 * @param params
 * @returns {AxiosPromise}
 */
export function getShopDetail(params) {
  return request.get('/getShopDetail', params)
}

/**
 * 取消店铺商品
 * @param params
 * @returns {AxiosPromise}
 */
export function cancelOrder(params) {
  return request.post('/cancelOrder', params)
}

/**
 * 创建店铺商品
 * @param params
 * @returns {AxiosPromise}
 */
export function createOrder(params) {
  return request.post('/createlOrder', params)
}

/**
 * 获取收货信息
 * @param params
 * @returns {AxiosPromise}
 */
export function getShopReceiver(params) {
  return request.get('/getShopReceiver', params)
}

/**
 * 获取快递信息
 * @param params
 * @returns {AxiosPromise}
 */
export function getShopExpress(params) {
  return request.get('/getShopExpress', params)
}

/**
 * 火爆商家
 * @param params
 * @returns {AxiosPromise}
 */
export function getHotShop(params) {
  return request.get('/getHotShop', params)
}

/**
 * 填写快递单号
 * @param params
 * @returns {AxiosPromise}
 */
export function shopOrderExpress(params) {
  return request.post('/shopOrderExpress', params)
}

/**
 * 修改地址
 * @param params
 * @returns {AxiosPromise}
 */
export function modifyOrderReceiver(params) {
  return request.post('/modifyOrderReceiver', params)
}

export function getShopInfo(params) {
  return request.get('/getShopInfo', params)
}

/**
 * 购买的店铺商品列表
 */
export function getList(params) {
  return request.get('/getList', params)
}

/**
 * 确认收货
 * @param params
 * @returns {AxiosPromise}
 */
export function confirmedOrder(params) {
  return request.post('/confirmedOrder', params)
}


export function publishCover(params){
  return request.post('/publishCover', params)
}

export  function checkWithdraw(params){
  return request.get('/withdraw', params)
}


export function getReleaseRate(params){
  return request.get('/getReleaseRate', params)
}