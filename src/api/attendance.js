import hcaxios from './hcaxios'

// 考勤确认
export const attendanceConfirm = (employeeId, month) => hcaxios.send('/api/portal/attendance/confirmAttendance', {employeeId, month})
// 获取月度考勤信息
export const getCompositeInfo = (employeeId, month) => hcaxios.get('/api/portal/compo/attendance/composite_info',{employeeId,month})
// export const getCompositeInfo = (employeeId, month) => Promise.resolve(detailData);
// normalNotes
// abnormalNotes
const detailData = {
    absentCount: 1,
    absentCountYear: 10,
    askLeaveCount: 5,
    confirmStatus: 1, //确认考勤状态(0:未开始;1:确认中;2已确认) 
    days:[
        {date:'2018-07-01 12:00:00',hpsStauts: 'Y', notes:'休假', puchBegin:'2018-07-01 09:00:00', punchEnd:'2018-07-01 18:00:00',offShift:1},
        {date:'2018-07-04 12:00:00',hpsStauts: 'Y', notes:'调休', puchBegin:'2018-07-01 09:00:00', punchEnd:'2018-07-01 18:00:00',offShift:1},
        {date:'2018-07-06 12:00:00',hpsStauts: 'N', notes:'旷工', puchBegin:'', punchEnd:'',offShift:0,normalNotes:["漏打卡"],abnormalNotes:["紧急事务1","紧急事务2"]},
        {date:'2018-07-07 12:00:00',hpsStauts: 'Y', notes:'', puchBegin:'', punchEnd:'',offShift:0,normalNotes:[],abnormalNotes:[]},
        {date:'2018-07-10 12:00:00',hpsStauts: 'N', notes:'漏打卡', puchBegin:'', punchEnd:'2018-07-01 18:00:00',offShift:0},
        {date:'2018-07-13 12:00:00',hpsStauts: 'Y', notes:'漏打卡', puchBegin:'2018-07-01 09:00:00', punchEnd:'2018-07-01 18:00:00',offShift:1},
        {date:'2018-07-21 12:00:00',hpsStauts: 'Y', notes:'漏打卡', puchBegin:'2018-07-01 09:00:00', punchEnd:'2018-07-01 18:00:00',offShift:1},
    ] ,
    lateCount:9,
    leaveCount: 2,
    missCount: 2,
    missCountYear: 4,
    offShiftCount: 9
}
// [
//     {day: '2018/6/1', status: 2, msg: '调休假', time: '16小时', start: '2018-09-09 09:00', end: '2018-09-11 18:00', tag: '回家'},
//     {day: '2018/6/2', status: 4, msg: ''},
//     {day: '2018/6/3', status: 4, msg: ''},
//     {day: '2018/6/4', status: 0, msg: '漏打卡', start: '8:50', end: '18:00', tag: 1}, //tag0/1判断起始时间哪个异常
//     {day: '2018/6/5', status: 2, msg: '倒休', time: '16小时', start: '2018-09-09 09:00', end: '2018-09-11 18:00', tag: '回家'},
//     {day: '2018/6/6', status: 1, msg: '带薪年假(审批中)'},
//     {day: '2018/6/7', status: 2, msg: '加班', time: '16小时', start: '2018-09-09 09:00', end: '2018-09-11 18:00', tag: '回家'},
//     {day: '2018/6/8', status: 0, msg: '旷工', start: '9:00', end: '18:00', tag: 0},
//     {day: '2018/6/9', status: 4, msg: ''},
//     {day: '2018/6/10', status: 4, msg: ''},
//     {day: '2018/6/11', status: 3, msg: '考勤未同步'}
//   ]