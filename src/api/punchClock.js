import hcaxios from './hcaxios'

const data = {
  'id': 'ID00000048690',
  'punchCardStartDate': '',
  'punchCardEndDate': '18:00',
  'leadCardDate': '9:00',
  'reason': '回家过年',
  'day':'3天',
  'type':'带薪年假',
  'handover':'张力',
  'name': '张珊珊',
  'userAccount': '100000048690',
  'status': 'AA',//用户状态 BB,区分审批人状态
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
      'status': 'C',
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

export const getDetailData = (id) => Promise.resolve(data) // (date) => hcaxios.get('attendance', {date: date})

// 员工搜索
// export const getApprover = (name, page = '', limit = '') => hcaxios.get(`employee/search?name=${name}&page=${page}&limit=${limit}`)

const ApproverList = {
  'code': 200,
  'message': "OK",
  'time': 1531293388012,
  'data': {
    'list': [
      {
        'id': '086b1bf03e3a4aa2aab8918222f06589',
        'userAccount': '10382210',
        'name': '测试0',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': 'd96d67131ec14b36b537dab17180d7fc',
        'userAccount': '10382211',
        'name': '测试1',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': 'dea392393883421186f35b9a2fc68fa1',
        'userAccount': '10382212',
        'name': '测试2',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': '84b9c9de45484626a18ae642725d6d71',
        'userAccount': '10382213',
        'name': '测试3',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': 'cec7df8d401144c59f218f3423ca8be7',
        'userAccount': '10382214',
        'name': '测试4',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': '7c4aff96c9634e87bb997599211b1ded',
        'userAccount': '10382215',
        'name': '测试5',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': '234dcb1aa9ed4ee6ac92ce1d8ec251ef',
        'userAccount': '10382216',
        'name': '测试6',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': '125554f2e6e24c2b8e3fe1fb167f4679',
        'userAccount': '10382217',
        'name': '测试7',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': 'f57f40f294324d63991058fb1a11a7ba',
        'userAccount': '10382218',
        'name': '测试8',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': 'bea9b169033b4cb2a3cfce8804d33f9b',
        'userAccount': '10382219',
        'name': '测试9',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': '712c67608613493487394a7cea4b734a',
        'userAccount': '10382220',
        'name': '测试10',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': 'ddb86fb15f4d4828b48a8d6b65920475',
        'userAccount': '10382221',
        'name': '测试11',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': 'a7056834aa3a4bb095d1cae312b52d86',
        'userAccount': '10382222',
        'name': '测试12',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': '93aabcf195244bb9bf415269230b6f56',
        'userAccount': '10382223',
        'name': '测试13',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': '4378f83d316647f58832405837aed27e',
        'userAccount': '10382224',
        'name': '测试14',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': '6f169b7bcd1e4ebcbb65c854f8423815',
        'userAccount': '10382225',
        'name': '测试15',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': '742867870d2943939b85fc85bf85f460',
        'userAccount': '10382226',
        'name': '测试16',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': 'b3b08330ac234d3ba21bf44775df3120',
        'userAccount': '10382227',
        'name': '测试17',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': '32c7d03a599e4ab69270a7e8601522bc',
        'userAccount': '10382228',
        'name': '测试18',
        'duty': '测试岗位',
        'department': '测试部门'
      },
      {
        'id': '6da7df0f42a6498d8b69b5d626f9cae2',
        'userAccount': '10382229',
        'name': '测试19',
        'duty': '测试岗位',
        'department': '测试部门'
      }
    ],
    'count': 20
  }
}
export const getApprover = (name, page = '', limit = '') => Promise.resolve(ApproverList)

// 提交漏打卡申请
export const addLeakCard = (data) => hcaxios.send('/api/leak_card/add', data)
