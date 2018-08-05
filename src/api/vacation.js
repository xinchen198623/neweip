import hcaxios from './hcaxios'

const typeList = [
  {name: '带薪年假', value: 0},
  {name: '加班倒休', value: 1},
  {name: '病假', value: 2},
  {name: '事假', value: 3}
]
// 获取月度考勤信息
export const getUserInfo = () => hcaxios.get(`/api/test`)
export const getTypeList = (date) => Promise.resolve(typeList) // (date) => hcaxios.get('attendance', {date: date})
