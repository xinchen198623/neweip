import hcaxios from './hcaxios'

// 获取审批详情
export const getApplyDetail = (id) => hcaxios.get(`/api/flow/general_approval/detail?id=${id}`)

// 详情页：撤回申请
export const withdraw = (data) => hcaxios.send('/api/flow/general_approval/withdraw', data)

// 提交通用审批申请（index）
export const addApplication = (data) => hcaxios.send('/api/flow/general_approval/add', data)

// 获取历史添加的审批人
export const getApplyUserHistory = (type) => hcaxios.get(`/api/flow/general_approval/user_type_history?type=${type}`)

// 获取历史申请记录 (history)
const historyList = {
  list: [
    {
      'id': 1,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '因为工作需要申请',
      'status': 'A'
    },
    {
      'id': 2,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    },
    {
      'id': 3,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    },
    {
      'id': 4,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '因为工作需要申请',
      'status': 'A'
    },
    {
      'id': 5,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    },
    {
      'id': 6,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    },
    {
      'id': 7,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '因为工作需要申请',
      'status': 'A'
    },
    {
      'id': 8,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    },
    {
      'id': 9,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    },
    {
      'id': 10,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '因为工作需要申请',
      'status': 'A'
    },
    {
      'id': 11,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    },
    {
      'id': 12,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    },
    {
      'id': 13,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '因为工作需要申请',
      'status': 'A'
    },
    {
      'id': 14,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    },
    {
      'id': 15,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    },
    {
      'id': 16,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '因为工作需要申请',
      'status': 'A'
    },
    {
      'id': 17,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    },
    {
      'id': 18,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    },
    {
      'id': 19,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '因为工作需要申请',
      'status': 'A'
    },
    {
      'id': 20,
      'name': '苑雪娇',
      'date': '2018/03/29',
      'reason': '名片更新，旧名片不是适用，因此申请新名片',
      'status': 'C'
    }
  ],
  length: 899
}
// 获取申请历史
// export const getHistoryList = (data) => Promise.resolve(historyList)
export const getHistoryList = (type) => hcaxios.get('/api/flow/general_approval/my',{type})

// 通用详情更新附件信息
export const attachmentEdit = (data) => hcaxios.send('/api/flow/general_approval/attachment/edit', data)

// 获取待审批列表 (approval)
const approvalPendingList = [
  {
    id: 1,
    typeName: '保洁费',
    createByName: '李莉莉',
    createAt: 1532086052,
    comment: '保洁费报销保洁费报销保洁费报销保洁费报销保洁费报销保洁费报销保洁费报销',
    generalApprovalAttachments: [{fileName: '附件.jpg'}, {fileName: '附件.png'}],
    GeneralApprovalHistoryDao: [
      {
        createAt: 1532086052,  // 审批时间，目前后端接口没有
        approver: '王美丽',
        generalApprovalHistoryAttachments: {fileName: '附件.txt'},
        action: 'AGREE'
      },
      {
        createAt: 1532086052,  // 审批时间，目前后端接口没有
        approver: '王美丽',
        generalApprovalHistoryAttachments: {fileName: '附件.txt'},
        action: 'AGREE'
      }
    ]
  },
  {
    id: 2,
    typeName: '交通报销',
    createByName: '李莉莉',
    createAt: 1532086052,
    comment: '保洁费报销'
  },
  {
    id: 3,
    typeName: '保洁费',
    createByName: '李莉莉',
    createAt: 1532086052,
    comment: '保洁费报销'
  },
  {
    id: 4,
    typeName: '带薪年假',
    createByName: '李莉莉',
    createAt: 1532086052,
    comment: '保洁费报销'
  },
  {
    id: 4,
    typeName: '保洁费',
    createByName: '李莉莉',
    createAt: 1532086052,
    comment: '保洁费报销'
  },
  {
    id: 4,
    typeName: '保洁费',
    createByName: '李莉莉',
    createAt: 1532086052,
    comment: '保洁费报销'
  },
  {
    id: 4,
    typeName: '保洁费',
    createByName: '李莉莉',
    createAt: 1532086052,
    comment: '保洁费报销'
  },
  {
    id: 4,
    typeName: '保洁费',
    createByName: '李莉莉',
    createAt: 1532086052,
    comment: '保洁费报销'
  },
  {
    id: 11,
    typeName: '保洁费aaaa',
    createByName: '李莉莉',
    createAt: 1532086052,
    comment: '保洁费报销'
  }
]
// export const getApprovalPendingList = (id) => Promise.resolve(approvalPendingList)
export const getApprovalPendingList = (type) => hcaxios.get(`/api/flow/general_approval/approval_pending/query?type=${type}`)

// 获取待审批详情
export const getApprovalPendingDetail = (id) => hcaxios.get(`/api/flow/general_approval/approval_pending/query_detail?id=${id}`)

// 单个审批
export const addSingleApproval = (params) => hcaxios.send('/api/flow/general_approval/approval_pending/approve', params)

// 批量审批
export const addApprovalByList = (params) => hcaxios.send('/api/flow/general_approval/approval_pending/approve_batch', params)

// 批量审批 (approval)
const addApprovalData = {
  'code': 200,
  'message': "OK",
  'time': 1531122263101,
  'data': []
}
// export const addApprovalByList = (data) => Promise.resolve(addApprovalData)

// 单个审批 （approval）
const addSingleApprovalData = {
  'code': 200,
  'message': "OK",
  'time': 1531122263101,
  'data': []
}
// export const addSingleApproval = (data) => Promise.resolve(addSingleApprovalData)

// 单个拒绝 （approval）
const rejectSingleData = {
  'code': 200,
  'message': "OK",
  'time': 1531122263101,
  'data': []
}
export const rejectSingleApproval = (data) => Promise.resolve(rejectSingleData)

// 单个拒绝到上一级 （approval）
const rejectUpperData = {
  'code': 200,
  'message': "OK",
  'time': 1531122263101,
  'data': []
}
export const rejectUpper = (data) => Promise.resolve(rejectUpperData)
