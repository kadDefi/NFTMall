import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './router'

Vue.use(VueRouter)

// 设置路由
const router = new VueRouter({
  // mode: 'history', // require service support
  //scrollBehavior: () => ({ y: 0}),
  scrollBehavior(to, from, savedPosition) {
    if(savedPosition) {
        return savedPosition
    } else {
      const position = {};
      if (to.matched.some(m => m.meta.scrollToTop)) {//如果路由元信息中存在参数，对参数做进一步判断（此示例代表滚动到顶部）
        position.x = 0
        position.y = 0
      }
     //如果返回一个 falsy (假的值)，或者是一个空对象，那么不会发生滚动。
      return position;
    }
  },
  routes
})

// 重置路由
export function resetRouter() {
  const newRouter = new VueRouter({
    // mode: 'history', // require service support
    // scrollBehavior: () => ({ y: 0 }),
    scrollBehavior(to, from, savedPosition) {
      console.log('savedPosition =',savedPosition);
      if(savedPosition) {
          return savedPosition
      } else {
          return {x: 0,y: 0}
      }
    },
    routes: routes
  });
  router.matcher = newRouter.matcher; // reset router
}

// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//    return originalPush.call(this, location).catch(err => err)
// }

// 解决报错
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

export default router
