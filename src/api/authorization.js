import hcaxios from './hcaxios'
//通用审批薪资附件可查看人员权限

// 员工搜索
// const ApproverList = {
//     'code': 200,
//     'message': "OK",
//     'time': 1531293388012,
//     'data': {
//       'list': [
//         {"userDept":"测试部门1","userId":"10000001","userName":"测试1","userPost":"测试职位1"},
//         {"userDept":"测试部门2","userId":"10000002","userName":"测试2","userPost":"测试职位2"},
//         {"userDept":"测试部门3","userId":"10000003","userName":"测试3","userPost":"测试职位3"},
//         {"userDept":"测试部门4","userId":"10000004","userName":"测试4","userPost":"测试职位4"},
//         {"userDept":"测试部门5","userId":"10000005","userName":"测试5","userPost":"测试职位5"},
//         {"userDept":"测试部门6","userId":"10000006","userName":"测试6","userPost":"测试职位6"},
//         {"userDept":"测试部门7","userId":"10000007","userName":"测试7","userPost":"测试职位7"},
//         {"userDept":"测试部门8","userId":"10000008","userName":"测试8","userPost":"测试职位8"},
//         {"userDept":"测试部门9","userId":"10000009","userName":"测试9","userPost":"测试职位9"},
//         {"userDept":"测试部门10","userId":"10000010","userName":"测试10","userPost":"测试职位10"},
//         {"userDept":"测试部门11","userId":"10000011","userName":"测试11","userPost":"测试职位11"},
//         {"userDept":"测试部门12","userId":"10000012","userName":"测试12","userPost":"测试职位12"},
//         {"userDept":"测试部门13","userId":"10000013","userName":"测试13","userPost":"测试职位13"},
//         {"userDept":"测试部门14","userId":"10000014","userName":"测试14","userPost":"测试职位14"},
//         {"userDept":"测试部门15","userId":"10000015","userName":"测试15","userPost":"测试职位15"},
//       ],
//       'count': 15
//     }
//   }

export const getOptionList = (name, page, limit) => hcaxios.get('/api/portal/employee/search',{name:name,page:page,limit:limit})
// export const getApprover = (name, page = '', limit = '') => Promise.resolve(ApproverList)

// 列表
export const getList = () => hcaxios.get('/api/flow/admin/pay_permission/query')

// 添加
// export const addStaff = (data) => hcaxios.send('/api/flow/admin/pay_permission/add', data)
export const addStaff = (data) => hcaxios.send('/api/flow/admin/pay_permission/add', {generalApprovalPayPermissions: data})

// 删除
// export const deleteStaff = (id) => hcaxios.send(`/api/flow/admin/pay_permission/delete?employeeId=${id}`)
