import request from '@/utils/request'

export function login(username, password, imageCode, deviceId) {
  return request({
    url: '/uac/auth/form',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'deviceId': deviceId
    },
    auth: {
      username: 'paascloud-client-uac',
      password: 'paascloudClientSecret'
    },
    params: {
      "username" : username,
      "password" : password,
      "imageCode" : imageCode
    }
  })
}

export function getImage(deviceId) {
  return request({
    url: '/uac/auth/code/image',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'deviceId': deviceId
    }
  })
}

export function getInfo() {
  return request({
    url: '/uac/user/getInformation',
    method: 'post',
  })
}

export function logout(accessToken) {
  return request({
    url: '/uac/user/logout',
    method: 'post',
    params: {
      "accessToken" : accessToken
    }
  })
}
