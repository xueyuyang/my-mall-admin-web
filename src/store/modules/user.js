import { login, getImage, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { refreshToken } from '@/api/index';
import { PcCookie, PcLockr, enums } from '../../utils/';

const user = {
  state: {
    token: getToken(),
    name: '',
    rememberMe: false,
    avatar: '',
    roles: [],
    redirectUri: '',
    authToken: {
      access_token: '',
      expires_in: '',
      timestamp: ''
    },
    refreshToken: {
      refresh_token: ''
    }
  },

  getters : {
    getRememberMe: (state) => {
      if (!state.rememberMe) {
        state.rememberMe = !!PcCookie.get(enums.USER.REMEMBER_ME);
      }
      return state.rememberMe;
    },
    getRefreshToken: (state) => {
      if (!state.refreshToken) {
        state.refreshToken = PcCookie.get(enums.USER.REFRESH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.REFRESH_TOKEN)) : {};
      }
      return state.refreshToken.refresh_token;
    },
    getAccessToken: (state) => {
      if (!state.authToken) {
        state.authToken = PcCookie.get(enums.USER.AUTH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.AUTH_TOKEN)) : {};
      }
      return state.authToken.access_token;
    },
    getAuthToken: (state) => {
      if (!state.authToken || state.authToken.access_token === '') {
        state.authToken = PcCookie.get(enums.USER.AUTH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.AUTH_TOKEN)) : {};
      }
      return state.authToken;
    },
    getRedirectUri: (state) => {
      if (!state.redirectUri) {
        state.redirectUri = PcCookie.get(enums.USER.REDIRECT_URI) ? PcCookie.get(enums.USER.REDIRECT_URI) : 'http://dev-mall.paascloud.net';
      }
      return state.redirectUri;
    },
    getLoginName: (state) => {
      if (!state.authToken || state.authToken.access_token === '') {
        state.authToken = PcCookie.get(enums.USER.AUTH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.AUTH_TOKEN)) : {};
      }
      if (state.authToken) {
        // 判断是否需要续租
        if ((new Date().getTime() - state.authToken.timestamp) > 120 * 60 * 1000) {
          return '';
        }
      }
      return state.authToken.loginName;
    }
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    updateUserName (state, loginName) {
      state.loginName = loginName;
      PcCookie.set({
        key: enums.USER.LOGIN_NAME,
        value: loginName
      });
    },
    updateAuthToken (state, authToken) {
      state.authToken = authToken;
      // https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#expire-cookies-in-less-than-a-day
      let expires = 2 / 24;
      let isRemember = !!PcCookie.get(enums.USER.REMEMBER_ME);
      if (isRemember) {
        expires = 7;
      }
      // debugger;
      delete authToken['jti'];
      delete authToken['token_type'];
      let refreshToken = {};
      Object.assign(refreshToken, authToken);
      // delete authToken['scope'];
      delete authToken['refresh_token'];
      delete refreshToken['access_token'];
      state.refreshToken = refreshToken;
      console.info('token:', authToken);
      PcCookie.set({
        key: enums.USER.AUTH_TOKEN,
        value: authToken,
        expires: expires
      });
      PcCookie.set({
        key: enums.USER.REFRESH_TOKEN,
        value: refreshToken,
        expires: expires
      });
    },
    deleteUserName (state) {
      PcCookie.delete({
        key: enums.USER.LOGIN_NAME
      });
      state.loginName = '';
      PcCookie.delete({
        key: enums.USER.REMEMBER_ME
      });
      state.rememberMe = false;
    },
    deleteAuthToken (state) {
      PcCookie.delete({
        key: enums.USER.AUTH_TOKEN
      });
      state.authToken = {};
    }
  },

  actions: {
    get_access_token({commit, state}, cb) {
      if (!state.authToken || state.authToken.access_token === '') {
        state.authToken = PcCookie.get(enums.USER.AUTH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.AUTH_TOKEN)) : {};
      }
      console.info('refresh_token:', state.authToken.refresh_token);
      if (state.authToken.access_token) {
        // 判断是否需要续租
        if ((new Date().getTime() - state.authToken.timestamp) > 100 * 60 * 1000) {
          refreshToken().then(res => {
            console.info('res:', res);
            if (res.data.code === 200) {
              commit('updateAuthToken', res.data.result);
            } else {
              commit('deleteUserInfo');
              commit('deleteAuthToken');
              commit('deleteMenuList');
              commit('deleteRememberMe');
              jumpLoginPage();
            }
          });
        }
      }
      cb && cb(state.authToken.access_token);
    },
    // 登录
    Login({ commit }, userInfo, deviceId) {
      const username = userInfo.username.trim()
      const imageCode = userInfo.captchaCode.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, imageCode, userInfo.deviceId).then(response => {
          // const data = response.data
          // const tokenStr = data.tokenHead+data.token
          // setToken(tokenStr)
          // commit('SET_TOKEN', tokenStr)
          if (response && response.code == '200') {
            commit('updateAuthToken', response.result);
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetImage({commit, state}, deviceId) {
      return new Promise((resolve, reject) => {
        getImage(deviceId).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error);
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.result
          // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', data.roles)
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
          commit('updateUserName', data.userName)
          // commit('SET_AVATAR', data.icon)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      let accessToken = this.getters.getAccessToken;
      return new Promise((resolve, reject) => {
        logout(accessToken).then(() => {
          commit('deleteUserName');
          commit('deleteAuthToken');
          resolve()
        }).catch(error => {
          commit('deleteUserName');
          commit('deleteAuthToken');
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
