import hcaxios from './hcaxios'

const data = {
  'id': 'ID00000048690',
  'punchCardStartDate': '',
  'punchCardEndDate': '18:00',
  'leadCardDate': '9:00',
  'reason': '原因原因原因原因原因原因原因原因原因原因原因原因原因原因原因',
  'name': '姓名:00000048690',
  'userAccount': '100000048690',
  'status': 'A',
  'statusStr': '已批准',
  'approverModels': [
    {
      'id': 'id000000',
      'approver': {
        'id': '10000000',
        'userAccount': null,
        'name': '测试0',
        'duty': '职位职位职位职位职位',
        'department': '部门部门部门部门部门'
      },
      'status': 'A',
      'statusStr': '已批准',
      'auditDate': 1530184340771,
      'comment': '理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由'
    },
    {
      'id': 'id000001',
      'approver': {
        'id': '10000001',
        'userAccount': null,
        'name': '测试1',
        'duty': '职位职位职位职位职位',
        'department': '部门部门部门部门部门'
      },
      'status': 'B',
      'statusStr': '审批中',
      'auditDate': 1530184340771,
      'comment': '理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由'
    },
    {
      'id': 'id000001',
      'approver': {
        'id': '10000001',
        'userAccount': null,
        'name': '测试1',
        'duty': '职位职位职位职位职位',
        'department': '部门部门部门部门部门'
      },
      'status': 'C',
      'statusStr': '待审批',
      'auditDate': 1530184340771,
      'comment': '理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由'
    },
    {
      'id': 'id000001',
      'approver': {
        'id': '10000001',
        'userAccount': null,
        'name': '测试1',
        'duty': '职位职位职位职位职位',
        'department': '部门部门部门部门部门'
      },
      'status': 'D',
      'statusStr': '已拒绝',
      'auditDate': 1530184340771,
      'comment': '理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由'
    }
  ]
}

// 这里需要获取审批人接口和提交漏打卡申请两个接口

export const getDetailData = (id) => Promise.resolve(data) // (date) => hcaxios.get('attendance', {date: date})

// 员工搜索
export const getApprover = (name, page = '', limit = '') => hcaxios.get(`employee/search?name=${name}&page=${page}&limit=${limit}`)

// 提交漏打卡申请
export const addLeakCard = (data) => hcaxios.send('leak_card/add', data)
