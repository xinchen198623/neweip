import hcaxios from './hcaxios'

let homeData = {
  todolist: {
    attendance:{
      leakCard: 30,     // 漏打卡
      publicOut: 20,    // 公出
      offShift: 23,     // 休假
      overTime: 32    // 加班
    },
    rzdl: { // 入转调离详情数据
      entry: 30,    // 入职
      dimission: 30,  // 离职
      recruitment: 30,  // 招聘
      regularization: 30  // 转正
    },
    baseFee: 20,  // 费用控制
    oa: 22,  // oa
    expense: 20,  // 基础费用
    right: 30,  // 权限
    other: 20  // 其它
  },
  inprocessApplies: { // 两周内“进行中”的申请汇总
    attendance:{
      leakCard: 30,     // 漏打卡
      publicOut: 20,    // 公出
      offShift: 23,     // 休假
      overTime: 32    // 加班
    },
    rzdl:{ // 入转调离详情数据
      entry: 30,    // 入职
      dimission: 30,  // 离职
      recruitment: 30,  // 招聘
      regularization: 30  // 转正
    },
    expense: 20,   // 费用控制（erp）
    oa: 22,   // oa
    basefee: 20,  // 基础费用
    right: 30,  //权限/IT
    other: 20   // 其它
  },
  rejectApplies: { // 两周内“已拒绝”的申请汇总
    attendance:{
      leakCard: 30,     // 漏打卡
      publicOut: 20,    // 公出
      offShift: 23,     // 休假
      overTime: 32    // 加班
    },
    rzdl:{ // 入转调离详情数据
      entry: 30,    // 入职
      dimission: 30,  // 离职
      recruitment: 30,  // 招聘
      regularization: 30  // 转正
    },
    expense: 20,   // 费用控制（erp）
    oa: 22,   // oa
    basefee: 20,  // 基础费用
    right: 30,  //权限/IT
    other: 20   // 其它
  },
  finishedApplies: {  // 两周内“已批准”的申请汇总
    attendance:{
      leakCard: 30,     // 漏打卡
      publicOut: 20,    // 公出
      offShift: 23,     // 休假
      overTime: 32    // 加班
    },
    rzdl:{ // 入转调离详情数据
      entry: 30,    // 入职
      dimission: 30,  // 离职
      recruitment: 30,  // 招聘
      regularization: 30  // 转正
    },
    expense: 20,   // 费用控制（erp）
    oa: 22,   // oa
    basefee: 20,  // 基础费用
    right: 30,  //权限/IT
    other: 20   // 其它
  },
  favorites: 'xiuJiaShengQing,louDaKa,jiaBan,gongChu,kaoQinChaXun,xinZiChaXun' // 自助入口字符串数组
  // favorites: ''
};

let attendanceData = {
  confirmStatus: 1,  // 确认考勤状态(0:未开始;1:确认中;2:已确认)
  absentCountYear: 0, // 年旷工总次数次数
  absentCount: 0,  // 旷工次数
  deadline:'2018-02-14',
  askLeaveCount: 2,  // 请假次数
  days: [  // 每日出勤
    {
      date: '2018-06-10',  // 日期
      hpsStatus: 0,  // 考勤状态(正常/异常/未同步)
      notes: '',  // 备注
      punchBegin: '09:00',  // 上班时间
      punchEnd: '20:01',  // 下班时间
    },
    {
      date: '2018-06-11',  // 日期
      hpsStatus: 1,  // 考勤状态(正常/异常/未同步)
      notes: '',  // 备注
      punchBegin: '09:00',  // 上班时间
      punchEnd: '20:01',  // 下班时间
    }
  ],
  lateCount: 0,  // 迟到次数
  leaveCount: 0,  // 早退次数
  missCount: 1,  // 漏打卡次数
  missCountYear: 27,  // 年漏打卡总次数
  offShiftCount: 1,  // 休假次数
};

// export const getHomeInfo = (employeeId) => Promise.resolve(homeData);
// export const getAttendance = (employeeId, month) => Promise.resolve(attendanceData);
// export const setFavorites = (favorites) => Promise.resolve({data: 1});

export const getEHRToken = () => hcaxios.get('api/token');

export const getHomeInfo = (employeeId) => hcaxios.get(`/api/portal/homeStatistics/home_info`, {employeeId})
export const getFavorites = (employeeId) => hcaxios.get(`/api/portal/generalStatistics/getFavorites`, {employeeId})
export const setFavorites = (employeeId, favorites) => hcaxios.get(`/api/portal/generalStatistics/setFavorites`, {employeeId, favorites})
export const getAttendance = (employeeId, month) => hcaxios.get(`/api/portal/compo/attendance/composite_info`, {employeeId, month})
