import hcaxios from './hcaxios'
import URLSafeBase64 from 'urlsafe-base64'
import encrypt from '../utils/encrypt'

const userData = {
  department: '用户体验部',
  duty: '前端工程师',
  id: '10000011',
  name: '张珊珊',
  userAccount: 'zhangshanshan180623'
}

// 获取登录用户信息
// export const getUserInfo = () => Promise.resolve(userData)
export const getUserInfo = () => hcaxios.get(`/api/getUserInfo`)

export const logout = () => {
  const url = URLSafeBase64.encode(encrypt(window.location.origin))
  return hcaxios.get(`/api/logout/${url}`)
}
