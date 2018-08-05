import hcaxios from './hcaxios'

// 按员工姓名搜索
export const employeeSearch = (searchName, page = 1, limit = 20) => hcaxios.get(`/api/portal/employee/search?name=${searchName}&page=${page}&limit=${limit}`);

// 按员工ID搜索
export const employeeSearchById = (employeeId, page = 1, limit = 20) => hcaxios.get(`/api/portal/employee/searchById?employeeId=${employeeId}&page=${page}&limit=${limit}`);
