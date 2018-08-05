import hcaxios from './hcaxios'

const monthCount = 1
const yearCount = 3
const leakcardData = [
  {date: '03/29', time: '9:00-', leak: '18:00', status: '审批中'},
  {date: '03/26', time: '-18:00', leak: '9:00', status: '已批准'}
]
// 获取月度漏打卡信息
export const getLeakcardData = (id, page, month) => Promise.resolve(leakcardData) // hcaxios.get('/api/leak_card/query', {employeeId: id, page: page, date: month})
// 获取月度漏打卡次数
export const getMonthCount = (month) => Promise.resolve(monthCount)
// 获取年度漏打卡次数
export const getYearCount = (year) => Promise.resolve(yearCount)
// 获取tabs数据
export const getTabs = (employeeId) => hcaxios.get('/api/portal/homeStatistics/home_info_all?',{employeeId});
// export const getTabs = (employeeId) => Promise.resolve(homeData)

// let homeData = {
//   todolist: {
//     attendance:{
//       leakCard: 3,     // 漏打卡
//       publicOut: 2,    // 公出
//       offShift: 2,     // 休假
//       overTime: 2    // 加班
//     },
//     rzdl: { // 入转调离详情数据
//       entry: 3,    // 入职
//       dimission: 10,  // 离职
//       recruitment: 3,  // 招聘
//       regularization: 3  // 转正
//     },
//     baseFee: 2,  // 费用控制
//     oa: 2,  // oa
//     expense: 0,  // 基础费用
//     right: 0,  // 权限
//     other: 2  // 其它
//   },
//   inprocessApplies: { // 两周内“进行中”的申请汇总
//     attendance:{
//       leakCard: 0,     // 漏打卡
//       publicOut: 2,    // 公出
//       offShift: 23,     // 休假
//       overTime: 2    // 加班
//     },
//     rzdl:{ // 入转调离详情数据
//       entry: 30,    // 入职
//       dimission: 0,  // 离职
//       recruitment: 0,  // 招聘
//       regularization: 3  // 转正
//     },
//     expense: 2,   // 费用控制（erp）
//     oa: 2,   // oa
//     baseFee: 0,  // 基础费用
//     right: 3,  //权限/IT
//     other: 20   // 其它
//   },
//   rejectApplies: { // 两周内“已拒绝”的申请汇总
//     attendance:{
//       leakCard: 3,     // 漏打卡
//       publicOut: 0,    // 公出
//       offShift: 3,     // 休假
//       overTime: 3    // 加班
//     },
//     rzdl:{ // 入转调离详情数据
//       entry: 0,    // 入职
//       dimission: 3,  // 离职
//       recruitment: 3,  // 招聘
//       regularization: 3  // 转正
//     },
//     expense: 2,   // 费用控制（erp）
//     oa: 2,   // oa
//     baseFee: 2,  // 基础费用
//     right: 0,  //权限/IT
//     other: 2  // 其它
//   },
//   finishedApplies: {  // 两周内“已批准”的申请汇总
//     attendance:{
//       leakCard: 3,     // 漏打卡
//       publicOut: 2,    // 公出
//       offShift: 3,     // 休假
//       overTime: 2    // 加班
//     },
//     rzdl:{ // 入转调离详情数据
//       entry: 3,    // 入职
//       dimission: 3,  // 离职
//       recruitment: 3,  // 招聘
//       regularization: 3  // 转正
//     },
//     expense: 2,   // 费用控制（erp）
//     oa: 22,   // oa
//     baseFee: 20,  // 基础费用
//     right: 0,  //权限/IT
//     other: 0   // 其它
//   },
//   favorites: 'xiuJiaShengQing,louDaKa,jiaBan,gongChu,kaoQinChaXun,xinZiChaXun' // 自助入口字符串数组
//   // favorites: ''
// }

let homeData = {
  todolist: {
    attendance:{
      leakCard: 0,     // 漏打卡
      publicOut: 0,    // 公出
      offShift: 0,     // 休假
      overTime: 0    // 加班
    },
    rzdl: { // 入转调离详情数据
      entry: 0,    // 入职
      dimission: 0,  // 离职
      recruitment: 0,  // 招聘
      regularization: 0  // 转正
    },
    baseFee: 0,  // 费用控制
    oa: 0,  // oa
    expense: 0,  // 基础费用
    right: 0,  // 权限
    other: 0 // 其它
  },
  inprocessApplies: { // 两周内“进行中”的申请汇总
    attendance:{
      leakCard: 0,     // 漏打卡
      publicOut: 0,    // 公出
      offShift: 0,     // 休假
      overTime: 0    // 加班
    },
    rzdl:{ // 入转调离详情数据
      entry: 0,    // 入职
      dimission: 0,  // 离职
      recruitment: 0,  // 招聘
      regularization: 0  // 转正
    },
    expense: 0,   // 费用控制（erp）
    oa: 0,   // oa
    baseFee: 0,  // 基础费用
    right: 0,  //权限/IT
    other: 0   // 其它
  },
  rejectApplies: { // 两周内“已拒绝”的申请汇总
    attendance:{
      leakCard: 0,     // 漏打卡
      publicOut: 0,    // 公出
      offShift: 0,     // 休假
      overTime: 0    // 加班
    },
    rzdl:{ // 入转调离详情数据
      entry: 0,    // 入职
      dimission: 0,  // 离职
      recruitment: 0,  // 招聘
      regularization: 0  // 转正
    },
    expense: 0,   // 费用控制（erp）
    oa: 0,   // oa
    baseFee: 0,  // 基础费用
    right: 0,  //权限/IT
    other: 0  // 其它
  },
  finishedApplies: {  // 两周内“已批准”的申请汇总
    attendance:{
      leakCard: 0,     // 漏打卡
      publicOut: 0,    // 公出
      offShift: 0,     // 休假
      overTime: 0    // 加班
    },
    rzdl:{ // 入转调离详情数据
      entry: 0,    // 入职
      dimission: 0,  // 离职
      recruitment: 0,  // 招聘
      regularization: 0  // 转正
    },
    expense: 0,   // 费用控制（erp）
    oa: 0,   // oa
    baseFee: 0,  // 基础费用
    right: 12,  //权限/IT
    other: 0   // 其它
  },
  favorites: 'xiuJiaShengQing,louDaKa,jiaBan,gongChu,kaoQinChaXun,xinZiChaXun' // 自助入口字符串数组
  // favorites: ''
}