import hcaxios from './hcaxios'
const userData = {
  userAccount: '10000011',
  adminName: '张小小',
}

// 获取登录用户信息
export const getUserInfo = () => Promise.resolve(userData)
// export const getUserInfo = () => hcaxios.get(`/api/test`)
