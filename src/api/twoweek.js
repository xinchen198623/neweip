import hcaxios from './hcaxios'

const data = {
  inprocessApplies: { // 两周内“进行中”的申请汇总
    attendance: {
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
    expense: 20,   // 费用控制（erp）
    oa: 22,   // oa
    baseFee: 20,  // 基础费用
    right: 30,  //权限/IT
    other: 20   // 其它
  },
  rejectApplies: { // 两周内“已拒绝”的申请汇总
    attendance: {
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
    expense: 20,   // 费用控制（erp）
    oa: 22,   // oa
    baseFee: 20,  // 基础费用
    right: 30,  //权限/IT
    other: 20   // 其它 
  },
  finishedApplies: {// 两周内“已批准”的申请汇总 
    attendance: {
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
    expense: 20,   // 费用控制（erp）
    oa: 22,   // oa
    baseFee: 20,  // 基础费用
    right: 30,  //权限/IT
    other: 20   // 其它
  }
}

const listData = [
  {
    "id": "a89ebd4d864911e88ba4dc4a3e40364c",
    "type": "CLEANING_FEE",
    "typeName": "保洁费",
    "createByName": "测试1",
    "comment": "给老子2w块",
    "state": "R",
    "createAt": 1531451155000,
    "generalApprovalAttachments": [{
        fileName: '发票1.jpg',
        fileType: 'jpg'
      },
      {
        fileName: '发票2.jpg',
        fileType: 'jpg'
      }
    ],
    "generalApprovalHistoryDaos": null
  },
  {
    "id": "ecca944a8b0011e88be2024234e4098d",
    "type": "string",
    "typeName": "保洁费",
    "createByName": "测试1",
    "state": "R",
    "comment": "string",
    "createAt": 1531969672000,
    "generalApprovalAttachments":  [{
      fileName: '发票1.jpg',
      fileType: 'jpg'
    },
    {
      fileName: '发票2.jpg',
      fileType: 'jpg'
    }
  ],
    "generalApprovalHistoryDaos": null
  }
]

// export const gettwoweek = () => Promise.resolve(data)
export const gettwoweek = (employeeId) => hcaxios.get(`/api/portal/homeStatistics/home_info?employeeId=${employeeId}`);

export const getListData = (type, state, inTwoWeeks) => hcaxios.get(`/api/flow/general_approval/my?type=${type}&state=${state}&inTwoWeeks=${inTwoWeeks}`)
// export const getListData = (type,state,inTwoWeeks) => Promise.resolve(listData) 