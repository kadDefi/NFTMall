export const routes = [

  // PC 路由配置表
  {
    path: '/home',
    name: 'home',
    alias: '/',
    hidden: true,
    component: () => import('@/views/pc/home/home.vue'),
    meta: {
      title: '主页',
      scrollToTop: true,
    },
  },
  {
    path: '/market',
    name: 'market',
    hidden: true,
    component: () => import('@/views/pc/mark/market.vue'),
    meta: {
      title: 'NFT市场',
      scrollToTop: true,
    },
  },
  {
    path: '/nftdetial',
    name: 'nftdetial',
    hidden: true,
    component: () => import('@/views/pc/mark/nftdetial.vue'),
    meta: {
      title: 'NFT详情',
      scrollToTop: true,
    },
  },
  {
    path: '/shop',
    name: 'shop',
    hidden: true,
    component: () => import('@/views/pc/shop/shop.vue'),
    meta: {
      title: '店铺',
      scrollToTop: true,
    },
  },
  {
    path: '/lpMining',
    name: 'lpMining',
    hidden: true,
    component: () => import('@/views/pc/lp/lpMining.vue'),
    meta: {
      title: 'LP挖矿',
      scrollToTop: true,
    },
  },
  {
    path: '/wish',
    name: 'wish',
    hidden: true,
    component: () => import('@/views/pc/wish/wish.vue'),
    meta: {
      title: '许愿池',
      scrollToTop: true,
    },
  },
  {
    path: '/creator',
    name: 'creator',
    hidden: true,
    component: () => import('@/views/pc/labora/creator.vue'),
    meta: {
      title: '铸造者详情',
      scrollToTop: true,
    },
  },
  {
    path: '/labora',
    name: 'labora',
    hidden: true,
    component: () => import('@/views/pc/labora/labora.vue'),
    redirect: '/labora/casting',
    meta: {
      title: '实验室',
      scrollToTop: false,
    },
    children: [
      {
        path: 'casting',
        name: 'casting',
        component: () => import('@/views/pc/labora/casting.vue'),
        meta: {
          title: '铸造',
          keepAlive: false,
        }
      },
      {
        path: 'stock',
        name: 'stock',
        component: () => import('@/views/pc/labora/stock.vue'),
        meta: {
          title: '在售',
          keepAlive: false,
        }
      },
      {
        path: 'hold',
        name: 'hold',
        component: () => import('@/views/pc/labora/hold.vue'),
        meta: {
          title: '持有',
          keepAlive: false,
        }
      },
      {
        path: 'hotOrder',
        name: 'hotOrder',
        component: () => import('@/views/pc/labora/hotOrder.vue'),
        meta: {
          title: '火爆订单',
          keepAlive: false,
        }
      },
      {
        path: 'delivery',
        name: 'delivery',
        component: () => import('@/views/pc/labora/delivery.vue'),
        meta: {
          title: '交割',
          keepAlive: false,
        }
      },
      {
        path: 'shopOrder',
        name: 'shopOrder',
        component: () => import('@/views/pc/labora/shopOrder.vue'),
        meta: {
          title: '店铺订单',
          keepAlive: false,
        }
      },
      {
        path: 'wallet',
        name: 'wallet',
        component: () => import('@/views/pc/labora/wallet.vue'),
        meta: {
          title: '钱包',
          keepAlive: false,
        }
      },
      {
        path: 'promote',
        name: 'promote',
        component: () => import('@/views/pc/labora/promote.vue'),
        meta: {
          title: '推广',
          keepAlive: false,
        }
      },
      {
        path: 'freed',
        name: 'freed',
        component: () => import('@/views/pc/labora/freed.vue'),
        meta: {
          title: '冻结',
          keepAlive: false,
        }
      },
      {
        path: 'record',
        name: 'record',
        component: () => import('@/views/pc/labora/record.vue'),
        meta: {
          title: '记录',
          keepAlive: false,
        }
      },
    ]
  },

  // Phone 路由配置表
  {
    path: '/homeMb',
    name: 'homeMb',
    hidden: true,
    component: () => import('@/views/phone/homeMb/homeMb.vue'),
    meta: {
      title: '首页',
      scrollToTop: true,
    },
  },
  {
    path: '/marketMb',
    name: 'marketMb',
    hidden: true,
    component: () => import('@/views/phone/marketMb/marketMb.vue'),
    meta: {
      title: '市场',
      scrollToTop: true,
      keepAlive: true,
    },
  },
  {
    path: '/castingMb',
    name: 'castingMb',
    hidden: true,
    component: () => import('@/views/phone/castingMb/castingMb.vue'),
    meta: {
      title: '铸造',
      scrollToTop: true,
    },
  },
  {
    path: '/laboratoryMb',
    name: 'laboratoryMb',
    hidden: true,
    component: () => import('@/views/phone/laboratoryMb/laboratoryMb.vue'),
    redirect: '/laboratoryMb/stockMb',
    meta: {
      title: '实验室',
      scrollToTop: true,
    },
    children: [
      {
        path: 'stockMb',
        name: 'stockMb',
        component: () => import('@/views/phone/laboratoryMb/stockMb.vue'),
        meta: {
          title: '在售',
          keepAlive: false,
        }
      },
      {
        path: 'holdMb',
        name: 'holdMb',
        component: () => import('@/views/phone/laboratoryMb/holdMb.vue'),
        meta: {
          title: '持有',
          keepAlive: false,
        }
      },
      {
        path: 'hotOrderMb',
        name: 'hotOrderMb',
        component: () => import('@/views/phone/laboratoryMb/hotOrderMb.vue'),
        meta: {
          title: '火爆订单',
          keepAlive: false,
        }
      },
      {
        path: 'shopOrderMb',
        name: 'shopOrderMb',
        component: () => import('@/views/phone/laboratoryMb/shopOrderMb.vue'),
        meta: {
          title: '店铺订单',
          keepAlive: false,
        }
      },
      {
        path: 'deliveryMb',
        name: 'deliveryMb',
        component: () => import('@/views/phone/laboratoryMb/deliveryMb.vue'),
        meta: {
          title: '交割',
          keepAlive: false,
        }
      },
    ]
  },
  {
    path: '/meMb',
    name: 'meMb',
    hidden: true,
    component: () => import('@/views/phone/meMb/meMb.vue'),
    redirect: '/meMb/walletMb',
    meta: {
      title: '我的',
      scrollToTop: true,
    },
    children: [
      {
        path: 'walletMb',
        name: 'walletMb',
        component: () => import('@/views/phone/meMb/walletMb.vue'),
        meta: {
          title: '钱包',
          keepAlive: false,
        }
      },
      {
        path: 'promoteMb',
        name: 'promoteMb',
        component: () => import('@/views/phone/meMb/promoteMb.vue'),
        meta: {
          title: '持有',
          keepAlive: false,
        }
      },
      {
        path: 'freedMb',
        name: 'freedMb',
        component: () => import('@/views/phone/meMb/freedMb.vue'),
        meta: {
          title: '冻结',
          keepAlive: false,
        }
      },
      {
        path: 'recordMb',
        name: 'recordMb',
        component: () => import('@/views/phone/meMb/recordMb.vue'),
        meta: {
          title: '记录',
          keepAlive: false,
        }
      },
      {
        path: 'wishMB',
        name: 'wishMB',
        component: () => import('@/views/phone/meMb/wishMB.vue'),
        meta: {
          title: '许愿',
          keepAlive: false,
        }
      },
    ]
  },
  {
    path: '/nftdetialMb',
    name: 'nftdetialMb',
    hidden: true,
    component: () => import('@/views/phone/marketMb/nftdetialMb.vue'),
    meta: {
      title: 'NFT详情',
      scrollToTop: true,
    },
  },
  {
    path: '/creatorMb',
    name: 'creatorMb',
    hidden: true,
    component: () => import('@/views/phone/laboratoryMb/creatorMb.vue'),
    meta: {
      title: '铸造者详情',
      scrollToTop: true,
    },
  },

  // newPhone 路由配置表
  {
    path: '/nHome',
    name: 'nHome',
    //alias: '/',
    hidden: true,
    component: () => import('@/views/newPhone/nHome/nHome'),
    meta: {
      title: '手机端首页',
      scrollToTop: true,
    },
  },
  {
    path: '/nMarket',
    name: 'nMarket',
    hidden: true,
    component: () => import('@/views/newPhone/nMarket/nMarket'),
    meta: {
      title: '手机端市场',
      scrollToTop: true,
    },
  },
  {
    path: '/nShop',
    name: 'nShop',
    hidden: true,
    component: () => import('@/views/newPhone/nShop/nShop'),
    meta: {
      title: '手机端店铺',
      scrollToTop: true,
    },
  },
  {
    path: '/nShopDetail',
    name: 'nShopDetail',
    hidden: true,
    component: () => import('@/views/newPhone/nShop/nShopDetail'),
    meta: {
      title: '手机端店铺详情',
      scrollToTop: true,
    },
  },
  {
    path: '/nLpMining',
    name: 'nLpMining',
    hidden: true,
    component: () => import('@/views/newPhone/nLP/nLpMining'),
    meta: {
      title: '手机端农场',
      scrollToTop: true,
    },
  },
  {
    path: '/nWish',
    name: 'nWish',
    hidden: true,
    component: () => import('@/views/newPhone/nWish/nWish'),
    meta: {
      title: '手机端许愿池',
      scrollToTop: true,
    },
  },
  {
    path: '/nCenter',
    name: 'nCenter',
    hidden: true,
    component: () => import('@/views/newPhone/nCenter/nCenter'),
    meta: {
      title: '手机端个人中心',
      scrollToTop: true,
    },
  },

]
