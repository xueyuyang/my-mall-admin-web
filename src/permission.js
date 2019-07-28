import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

// ['/login','/home', '/pms', '/pms/product', '/pms/product/addProduct']
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  store.dispatch('get_access_token', (res) => {
    if (!res) {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next('/login')
        NProgress.done()
      }
    } else {
      if (to.path === '/login') {
          next({ path: '/' })
          NProgress.done() // if current page is dashboard will not trigger afterEach hook, so manually handle it
      } else {
          if (store.getters.roles.length === 0) {
            store.dispatch('GetInfo').then(res => { // 拉取用户信息
              next()
            }).catch((err) => {
              store.dispatch('FedLogOut').then(() => {
                Message.error(err || 'Verification failed, please login again')
                next({ path: '/' })
              })
            })
          } else {
            next()
          }
        }
    }
  });
  // if (getToken()) {
    
  // } else {
    
  // }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
