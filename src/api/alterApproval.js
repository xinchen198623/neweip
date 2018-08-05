import hcaxios from './hcaxios'

let userTableData = {
  'code': 200,
  'message': "OK",
  'time': 1531293388012,
  'data': {
    'list': [{
      type: '收入证明',
      checker: '牛莉莉',
      successor: '小二黑',
      dateRange: '2016-05-02',
      filterName: '王小虎',
      key: 'travel'
    }, {
      type: '收入证明',
      checker: '牛莉莉',
      successor: '牛莉莉',
      dateRange: '2016-05-02',
      filterName: '王小虎',
      key: 'travel'
    }, {
      type: '离职证明',
      checker: '牛莉莉',
      successor: '小二黑',
      dateRange: '2016-05-02',
      filterName: '王小虎',
      key: 'other'
    }, {
      type: '收入证明',
      checker: '牛莉莉',
      successor: '小二黑',
      dateRange: '2016-05-02',
      filterName: '王小虎',
      key: 'other'
    }, {
      type: '收入证明',
      checker: '牛莉莉',
      successor: '牛莉莉',
      dateRange: '2016-05-02',
      filterName: '王小虎',
      key: ''
    }, {
      type: '收入证明',
      checker: '牛莉莉',
      successor: '牛莉莉',
      dateRange: '2016-05-02',
      filterName: '王小虎',
      key: ''
    }, {
      type: '收入证明',
      checker: '牛莉莉',
      successor: '牛莉莉',
      dateRange: '2016-05-02',
      filterName: '王小虎',
      key: ''
    }],
    'selList': [
      {
        name: '基础费用', key: 'baseFee', data: [
          {'name': '普通员工', key: 'staff', 'data': [{'name': '差旅交通费', 'key': 'travel'}, {'name': '差旅-其他', 'key': 'travelOther'}, {'name': '住宿费', 'key': 'stayFee'}]},
          {'name': '部门申请', key: 'depApply', 'data': [{'name': '项目奖金申请', 'key': 'projectPrize'},{'name': '费用分摊申请', 'key': 'feeShare'},]},
          {'name': '行政专用', 'key': 'admin', 'data': [{'name': '装修费', 'key': 'decoration'},{'name': '职场房租', 'key': 'workplace'},{'name': '物业费', 'key': 'try'},{'name': '物业费', 'key': 'try'},{'name': '物业费', 'key': 'try'},{'name': '物业费', 'key': 'try'},{'name': '物业费', 'key': 'try'},{'name': '物业费', 'key': 'try'},{'name': '物业费', 'key': 'try'},{'name': '物业费', 'key': 'try'},]}
        ]
      },
      {name: '权限/IT', key: 'author', data: [{'name': '权限', 'key': 'power'}, {'name': 'IT', 'key': 'it'}]},
      {name: '其他', key: 'other', data: [{'name': '其他', 'key': 'other1'}, {'name': '其他2', 'key': 'other2'},]},
    ]
  }
};


// export const getTableData = (searchName) =>  Promise.resolve(userTableData);

let remoteData = {
  'code': 200,
  'message': "OK",
  'time': 1531293388012,
  'data': {
    'list': [
      {id: 1, name: '红红'},
      {id: 2, name: '绿绿'},
      {id: 3, name: '花花'},
      {id: 4, name: '草草'},
      {id: 5, name: '蝴蝶'},
      {id: 6, name: '蜻蜓'},
      {id: 7, name: '红蜻蜓'},
      {id: 8, name: '绿蜻蜓'},
    ]
  }
};

export const getTipsData = (searchName) => hcaxios.get(`/api/portal/employee/search?name=${searchName}`);
export const getTableData = (val) =>  hcaxios.get(`/api/flow/admin/general_approval_auth/query?name=${val.name}` + (val.type ? `&&type=${val.type}` : ''));
export const saveEdit = (row) => hcaxios.send('/api/flow/admin/general_approval_auth/edit', row);
export const saveAdd = (row) => hcaxios.send('/api/flow/admin/general_approval_auth/add',row);

