/* eslint-disable */
import * as api from '../api/home'
import { debuglog } from 'util';
import Vue from 'vue'

// 获取所有外部页面的url
let lock = false;
export function setOurterPageUrl(source) {
  getToken()
  if(source instanceof Array) {
    source.forEach( (d, i) => {
      if (d.isOuter) {
        // 获取跳转链接的信息
        const {url ,target} = getOuterPageUrl(d.name)
        d.url = url
        d.target = target
        Vue.set(source, i, d)
      }
    })
  }else {
    if(source.isOuter) {
      const {url ,target} = getOuterPageUrl(d.name)
      source.url = url
    }
  }
}

async function getToken() {
  if(!lock){
    lock = true
    if(window.sessionStorage.getItem('token') === "undefined" || !window.sessionStorage.getItem('token')) {
      try {
      const token = await api.getEHRToken()
      window.sessionStorage.setItem('token', token)
      lock = false
      } catch (error){
        debuglog('get token error')
        lock = false
      }
    }
  }
}

function getOuterPageUrl(key) {
  if(!key){
    return ''
  }
  const item = urlSettings.find(d => d.name.toLowerCase() === key.toLowerCase())
  let outerPageUrl = ''
  if(item) {
    switch(item.host.toLowerCase().trim()) {
      case 'ehr': {
        const pageUrl = process.env.EHR_HOST + (item.url.startsWith('/') ? '' : '/') + item.url
        outerPageUrl = '/static/redirect.html?t=' + pageUrl + '&m=' + (item.method ? item.method : 'get')
        break
      }
      case 'erp':
        outerPageUrl = process.env.ERP_HOST + (item.url.startsWith('/') ? '' : '/') + item.url
        break
      case 'oa':
        outerPageUrl = process.env.OA_HOST + (item.url.startsWith('/') ? '' : '/') + item.url
        break
    }
  }
  return  { url: outerPageUrl, target: item.host.toLowerCase() + "_window" }
}

const urlSettings = [
  {name: 'EHR', key: 'ehr', method: 'post', url: '/h/?tab=DEFAULT', host: 'ehr'},
  {name: 'ERP', key: 'erp', url: '/modules/eip/sso_index.jsp?urlPara=0', host: 'erp'},
  {name: '合同', key: 'hetong', url: '', host: 'contract'},  //这一期暂时没有
  {name: 'OA', key: 'oa', hoverFlag: 1, url: '/login/index?cas=1', host: 'oa'},  //待审批 暂时没有

  {name: '个人信息', key: 'geRenXinXi', url: 'c/HPS_MENU.CST_PER_BASIC_COM.GBL?FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HC_PERSONAL_INFO_ESS.CST_PER_BASIC_COM_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder', host: 'ehr'},
  {name: '更改密码', key: 'gengGaiMiMa', url: '/c/MAINTAIN_SECURITY.CHANGE_PASSWORD.GBL?FolderPath=PORTAL_ROOT_OBJECT.PT_CHANGE_PASSWORD_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder', host: 'ehr'},
  
  {name: '考勤', key: 'attendance', url: '/s/WEBLIB_LEAVE.ISCRIPT1.FieldFormula.IScript_create_app?kq_type=3', host: 'ehr'},
  {name: '休假申请', key: 'xiuJiaShengQing', url: '/s/WEBLIB_LEAVE.ISCRIPT1.FieldFormula.IScript_create', host: 'ehr'},
  {name: '漏打卡申请', key: 'louDaKa', url: '/s/WEBLIB_LEAVE.ISCRIPT1.FieldFormula.IScript_create_ldk', host: 'ehr'},
  {name: '加班申请', key: 'jiaBanShengQing', url: '/s/WEBLIB_LEAVE.ISCRIPT1.FieldFormula.IScript_create_jb', host: 'ehr'},
  {name: '公出申请', key: 'gongChuShenQing', url: '/s/WEBLIB_LEAVE.ISCRIPT1.FieldFormula.IScript_create_gc', host: 'ehr'},
  {name: '薪资查询', key: 'xinZiChaXun', url: '/c/HPS_MENU.HPS_GP_PAYROLL.GBL?Page=HPS_GP_PAYROLL&Action=U', host: 'ehr'},
  {name: '规章制度', key: 'guiZhangZhiDu', url: '/c/HPS_MENU.CS_PORTAL_ARTI_COM.GBL?FolderPath=PORTAL_ROOT_OBJECT.CST_NKGZ.CS_PORTAL_ARTI_COM_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder', host: 'ehr'},
  {name: '规章制度1', key: 'guiZhangZhiDu1', url: '/c/HPS_MENU.CS_PORTAL_ARTI_COM.GBL?FolderPath=PORTAL_ROOT_OBJECT.CST_NKGZ.CS_PORTAL_ARTI_COM_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder', host: 'ehr'},
  {name: '规章制度2', key: 'guiZhangZhiDu', url: '/c/HPS_MENU.CS_PORTAL_ARTI_COM.GBL?FolderPath=PORTAL_ROOT_OBJECT.CST_NKGZ.CS_PORTAL_ARTI_COM_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder', host: 'ehr'},
  {name: '规章制度3', key: 'guiZhangZhiDu', url: '/c/HPS_MENU.CS_PORTAL_ARTI_COM.GBL?FolderPath=PORTAL_ROOT_OBJECT.CST_NKGZ.CS_PORTAL_ARTI_COM_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder', host: 'ehr'},
  
  {name: '工牌打印', key: 'gongPaiDayin', url: 'c/HC_ROOT_MENU.HC_JOBCARDPAGE.GBL', host: 'ehr'},
  {name: '我的申请-漏打卡', key: 'shenQingLouDaKa', url: '/s/WEBLIB_LEAVE.ISCRIPT1.FieldFormula.IScript_create_ldkHist', host: 'ehr'},
  {name: '我的申请-休假', key: 'shenQingXiuJia', url: '/s/WEBLIB_LEAVE.ISCRIPT1.FieldFormula.IScript_createHist', host: 'ehr'},
  {name: '我的申请-加班', key: 'shenQingJiaBan', url: '/s/WEBLIB_LEAVE.ISCRIPT1.FieldFormula.IScript_create_jbHist', host: 'ehr'},
  {name: '我的申请-公出', key: 'shenQingGongChu', url: '/s/WEBLIB_LEAVE.ISCRIPT1.FieldFormula.IScript_create_gcHist', host: 'ehr'},
  {name: '我的申请-招聘', key: 'shenQingZhaoPin', url: '', host: 'ehr'}, //没有链接
  {name: '我的申请-入职', key: 'shenQingRuZhi', url: '', host: 'ehr'}, //没有链接
  {name: '我的申请-转正', key: 'shenQingZhuanzheng', url: '', host: 'ehr'}, 
  {name: '我的申请-离职', key: 'shenQingLiZhi', url: 's/WEBLIB_TER1.ISCRIPT1.FieldFormula.IScript_create?&FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HPS_TER.CST_TER_APPLY_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder', host: 'ehr'},
  {name: '费控', key: 'shenQingFeiKong', url: '/modules/eip/sso_index.jsp?urlPara=2', host: 'erp'},
  {name: '我的申请-已批准费控', key: 'shenQingFeiKong', url: '/modules/eip/sso_index.jsp?urlPara=3', host: 'erp'},
  {name: '我的申请-已拒绝费控', key: 'shenQingFeiKong', url: '/modules/eip/sso_index.jsp?urlPara=4', host: 'erp'},
  {name: '我的申请-审批中费控', key: 'shenQingFeiKong', url: '/modules/eip/sso_index.jsp?urlPara=2', host: 'erp'},
  {name: '我的申请-OA', key: 'shenQingOA', hoverFlag: 1, url: '/login/index?cas=1', host: 'oa'}, 

  {name: '待审批-考勤', key: 'shenPiLouDaKa', url: '/s/WEBLIB_LEAVE.ISCRIPT1.FieldFormula.IScript_create_app?kq_type=3', host: 'ehr'},
  {name: '待审批-招聘', key: 'shenPiZhaoPin', url: '/c/HPS_MENU.CST_ENTRY_OFFER.GBL?FolderPath=PORTAL_ROOT_OBJECT.CO_MANAGER_SELF_SERVICE.HC_RZDL_ENDORSE.CST_ENTRY_OFFER_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder', host: 'ehr'},
  {name: '待审批-入职', key: 'shenPiRuZhi', url: '/c/HPS_MENU.CST_ENTRY_CHECK.GBL?FolderPath=PORTAL_ROOT_OBJECT.CO_MANAGER_SELF_SERVICE.HC_RZDL_ENDORSE.CST_ENTRY_CHECK_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder', host: 'ehr'},
  {name: '待审批-转正', key: 'shenPiZhuanZheng',  url: '/s/WEBLIB_PRC2.ISCRIPT_TRAN_APPRO.FieldFormula.IScript_create', host: 'ehr'},
  {name: '待审批-离职', key: 'shenPiLiZhi', url: '/s/WEBLIB_TER_TNS2.ISCRIPT_TRNS_APPRO.FieldFormula.IScript_create', host: 'ehr'},
  {name: '待审批-费控', key: 'shenPiFeiKong', url: '/modules/eip/sso_index.jsp?urlPara=1', host: 'erp'},
  {name: '待审批-OA', key: 'shenPiOA', hoverFlag: 1, url: '/login/index?cas=1', host: 'oa'}, 
]
