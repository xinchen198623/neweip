<template>
  <div class="content-wrapper">
    <div class="banner" v-if="true"><img src="../../assets/img/banner.jpg" alt="图丢了呢~"></div>
    <div class="loading-box" ref="loadingBox" v-if="isLoading"></div>
    <div class="approval-pending" v-if="todoSum > 0">
      <h3>待我审批<span class="total">({{todoSum}})</span></h3>
      <ul class="clearfloat">
        <div v-for="(item, index) in approve" :key='index'>
          <template v-if="objSum(apiData.todolist[item.key]) > 0">
            <li v-if="item.isOuter">
              <a class="waiting-hover" :href="item.url" :target="item.target">
                <p class="title">{{item.text}}</p>
                <span class="count">{{objSum(apiData.todolist[item.key])}}</span>
              </a>
            </li>
            <li @click="switchPage(item.url, {'key': item.key})" v-else>
              <a class="waiting-hover">
                <p class="title">{{item.text}}</p>
                <span class="count">{{objSum(apiData.todolist[item.key])}}</span>
              </a>
            </li>
          </template>
        </div>
      </ul>
    </div>
    <div class="application" v-if="applySum > 0">
      <h3>两周内我发起的申请<span class="total">({{this.applySum}})</span></h3>
      <p>
        <span @click="switchPage('twoweekapply', {'index': '0'})" v-if="rejectCount > 0"><!--i class="warning-o"></i-->已拒绝&nbsp;&nbsp;( <i>{{rejectCount}}</i> )</span>
        <span @click="switchPage('twoweekapply', {'index': '1'})" v-if="finishedCount > 0">已批准&nbsp;&nbsp;( <i>{{finishedCount}}</i> )</span>
        <span @click="switchPage('twoweekapply', {'index': '2'})" v-if="inprocessCount > 0">审批中&nbsp;&nbsp;( <i>{{inprocessCount}}</i> )</span>
      </p>
    </div>
    <div class="self-service">
      <div class="list">
        <h3>我的自助</h3>
        <div class="loading-box-self" ref="loadingBoxSelf" v-if="isFavoriteLoading"></div>
        <div class="null" v-if="selectedOption.length === 0 && isShowNull">
          <img src="../../assets/img/null.png"/>
          <p>还没有收藏内容</p>
        </div>
        <ul class="clearfloat">
          <li v-for="(item, index) in selectedOption" :key="index">
            <span class="showStar" v-if="item.isOuter">
              <a :target="item.target" :href='item.url'>
                <img :src="item.img" alt="">
                <span>{{item.text}}</span>
              </a>
              <img class="star" src="../../assets/img/star.png" @click.stop.prevent="removeAdd(item.key)"/>
            </span>
            <span class="showStar" v-else>
              <a>
                <img :src="item.img" alt="" @click.prevent="switchPage(item.url, {'params': encodeURIComponent(item.text), type: item.type})">
                <span @click.prevent="switchPage(item.url, {'params': encodeURIComponent(item.text), type: item.type})">{{item.text}}</span>
                <img class="star" src="../../assets/img/star.png" @click.stop.prevent="removeAdd(item.key)"/>
              </a>
            </span>
          </li>
        </ul>
        <div class="tips">
          <span>点击下方 <i></i> 图标，收藏内容</span>
        </div>
      </div>

      <div class="apply-list clearfloat">
        <div class="expense">
          <h4><img src="../../assets/img/fee.png" alt="">基础费用申请</h4>
          <div class="expend-line">
            <div class="staff">
              <h4>员工专用</h4>
              <ul class="clearfloat">
                <li v-for="(item, index) in optionValue.ptyg" :key="index" class="option-list">
                  <label-star :labelInfo=item :isSelected=optionSelectInfo[item.key].isSelected @addMenu="addMenu"></label-star>
                </li>
              </ul>
            </div>
            <div class="admin">
              <h4>行政专用</h4>
              <ul class="clearfloat">
                <li v-for="(item, index) in optionValue.xzzy" :key="index" class="option-list">
                  <label-star :labelInfo=item :isSelected=optionSelectInfo[item.key].isSelected @addMenu="addMenu"></label-star>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="attendance">
          <h4><img src="../../assets/img/time.png">考勤申请</h4>
          <ul class="clearfloat">
            <li v-for="(item, index) in optionValue.kqsq" :key="index" class="option-list">
              <label-star :labelInfo=item :isSelected=optionSelectInfo[item.key].isSelected @addMenu="addMenu"></label-star>
            </li>
          </ul>
        </div>
        <div class="limit">
          <h4><img src="../../assets/img/lock.png">权限/其他申请</h4>
          <ul class="clearfloat">
            <li v-for="(item, index) in optionValue.qx" :key="index" class="option-list">
              <label-star :labelInfo=item :isSelected=optionSelectInfo[item.key].isSelected @addMenu="addMenu"></label-star>
            </li>
          </ul>
        </div>
        <div class="office">
          <h4><img src="../../assets/img/search.png">自动查询/办公</h4>
          <ul class="clearfloat">
            <li v-for="(item, index) in optionValue.zdcx" :key="index" class="option-list">
              <label-star :labelInfo=item :isSelected=optionSelectInfo[item.key].isSelected @addMenu="addMenu"></label-star>
            </li>
          </ul>
        </div>
      </div>
      <!--弹框-->
      <el-dialog
        title="提示"
        :visible.sync="isMax"
        width="400px"
        center
        class="dialog">
        <p>
          <img src="../../assets/img/information.png" alt="">
          <span>收藏不能超过10个</span>
        </p>
        <p>收藏满10个时，取消已收藏的内容后，才能继续收藏</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isMax = false">我知道了</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import * as api from '../../api/home'
  import LabelStar from '../../components/LabelStar'
  import { setOurterPageUrl } from '../../utils/sso.js'

  // 待审批数据
  let approve = [
    {text: '考勤', name: '待审批-考勤', color: '#ff776e', img: require('../../assets/img/kaoqin.png'), key: 'attendance', isOuter: 1, target: ''},
    {text: '入职', name: '待审批-入职', color: '#65A6EC', img: require('../../assets/img/ruzhuan.png'), key: 'entry', isOuter: 1, target: ''},
    {text: '离职', name: '待审批-离职', color: '#65A6EC', img: require('../../assets/img/ruzhuan.png'), key: 'dimission', isOuter: 1, target: ''},
    {text: '招聘', name: '待审批-招聘', color: '#65A6EC', img: require('../../assets/img/ruzhuan.png'), key: 'recruitment', isOuter: 1, target: ''},
    {text: '转正', name: '待审批-转正', color: '#65A6EC', img: require('../../assets/img/ruzhuan.png'), key: 'regularization', isOuter: 1, target: ''},
    {text: '费控', name: '待审批-费控', color: '#F8B61D', img: require('../../assets/img/feikong.png'), key: 'expense', isOuter: 1, target: ''},
    {text: 'OA系统', name: '待审批-OA', color: '#17C295', img: require('../../assets/img/oa.png'), key: 'oa', isOuter: 1, target: ''},
    {text: '基础费用', name: '待审批-基础费用', color: '#47B3E1', img: require('../../assets/img/feiyong.png'), key: 'baseFee', isOuter: 0, url: 'approval/commonApproval', target: ''},
    {text: '权限/IT', name: '待审批-权限/IT', color: '#B29BDD', img: require('../../assets/img/quanxian.png'), key: 'right', isOuter: 0, url: 'approval/commonApproval', target: ''},
    {text: '其他', name: '待审批-其他', color: '#F7B55E', img: require('../../assets/img/qita.png'), key: 'other', isOuter: 0, url: 'approval/commonApproval', target: ''}
  ];

  // 员工自助数据源
  let optionValue = {
    ptyg: [
      {text: '差旅交通费', type: 'TRAVEL_EXPENSES', key: 'chaiLvJiaoTongFei', img: require('../../assets/img/cljtf.png'), url: 'commonApply1', isOuter: 0},
      {text: '差旅-其他', type: 'TRAVEL_OTHER', key: 'chaiLv-qiTa', img: require('../../assets/img/clqt.png'), url: 'commonApply1', isOuter: 0},
      {text: '住宿费', type: 'QUARTERAGE', key: 'zhuSuFei', img: require('../../assets/img/zsf.png'), url: 'commonApply1', isOuter: 0},
      {text: '交通费', type: 'TRAFFIC_EXPENSES', key: 'jiaoTongFei', img: require('../../assets/img/jtf.png'), url: 'commonApply1', isOuter: 0},
      {text: '误餐费', type: 'LUNCH_EXPENSES', key: 'wuCanFei', img: require('../../assets/img/wcf.png'), url: 'commonApply1', isOuter: 0},
      {text: '招待费', type: 'ENTERTAINMENT', key: 'zhaoDaiFei', img: require('../../assets/img/zdf.png'), url: 'commonApply1', isOuter: 0},
      {text: '客服短信', type: 'SMS', key: 'keFuDuanXin', img: require('../../assets/img/kfdx.png'), url: 'commonApply1', isOuter: 0}],
    xzzy: [
      {text: '装修费', type: 'FITMENT_COST', key: 'zhuangXiuFei', img: require('../../assets/img/zxf.png'), url: 'commonApply1', isOuter: 0},
      {text: '电话费', type: 'TELEPHONE_BILL', key: 'dianHuaFei', img: require('../../assets/img/dhf.png'), url: 'commonApply1', isOuter: 0},
      {text: '职场房租', type: 'WORKPLACE_RENT', key: 'zhiChangFangZu', img: require('../../assets/img/zcfz.png'), url: 'commonApply1', isOuter: 0},
      {text: '快递费', type: 'EXPRESS_FEE', key: 'kuaiDiFei', img: require('../../assets/img/kdf.png'), url: 'commonApply1', isOuter: 0},
      {text: '车辆使用费', type: 'VEHICLE_USE_FEE', key: 'cheLiangShiYongFei', img: require('../../assets/img/clsyf.png'), url: 'commonApply1', isOuter: 0},
      {text: '物业费', type: 'PROPERTY_FEE', key: 'wuYeFei', img: require('../../assets/img/wyf.png'), url: 'commonApply1', isOuter: 0},
      {text: '绿化费', type: 'GREEN_FEES',key: 'lvHuaFei', img: require('../../assets/img/lhf.png'), url: 'commonApply1', isOuter: 0},
      {text: '职场专线', type: 'WORKPLACE_LINE', key: 'zhiChangZhuanXian', img: require('../../assets/img/xzcx.png'), url: 'commonApply1', isOuter: 0},
      {text: '水电费', type: 'UTILITIES', key: 'shuiDianFei', img: require('../../assets/img/sdf.png'), url: 'commonApply1', isOuter: 0},
      {text: 'IT机房专线', type: 'SERVER_LINE', key: 'ITJiFangZhuanXian', img: require('../../assets/img/it.png'), url: 'commonApply1', isOuter: 0},
      {text: '保洁费', type: 'CLEANING_FEE', key: 'baoJieFei', img: require('../../assets/img/bjf.png'), url: 'commonApply1', isOuter: 0},
      {text: '职场修缮费', type: 'OFFICE_REPAIR', key: 'zhiChangXiuShanFei', img: require('../../assets/img/zcxsf.png'), url: 'commonApply1', isOuter: 0},
      {text: '其他IT费用', type: 'IT_OTHER_FEE', key: 'qiTaITFeiYong', img: require('../../assets/img/qtit.png'), url: 'commonApply1', isOuter: 0},
      {text: '安全器材', type: 'SAFETY_EQUIPMENT', key: 'anQuanQiCai', img: require('../../assets/img/aqqc.png'), url: 'commonApply1', isOuter: 0},
      {text: '安保服务', type: 'SECURITY_SERVICE', key: 'anBaoFuWu', img: require('../../assets/img/abfw.png'), url: 'commonApply1', isOuter: 0},
      {text: '牌匾制作费', type: 'PLAQUE_FEE', key: 'paiBianZhiZuoFei', img: require('../../assets/img/pbzzf.png'), url: 'commonApply1', isOuter: 0},
      {text: '公杂费', type: 'WORK_FEES', key: 'gongZaFei', img: require('../../assets/img/gzf.png'), url: 'commonApply1', isOuter: 0},
      {text: '低值易耗品', type: 'LOW_VALUE_ARTICLES', key: 'diZhiYiHaoPin', img: require('../../assets/img/dzyhp.png'), url: 'commonApply1', isOuter: 0},
      {text: '电子耗材', type: 'ELECTRICITY_ARTICLES', key: 'dianZiHaoCai', img: require('../../assets/img/dzhc.png'), url: 'commonApply1', isOuter: 0},
      {text: '咨询费', type: 'CONSULTING_FEE', key: 'ziXunFei', img: require('../../assets/img/zixunfei.png'), url: 'commonApply1', isOuter: 0}],
    kqsq: [
      {text: '休假申请', type: '', name: '休假申请', key: 'xiuJiaShengQing', img: require('../../assets/img/xiujia.png'), isOuter: 1, url: '', target: ''},
      {text: '漏打卡申请', type: '', name: '漏打卡申请', key: 'louDaKa', img: require('../../assets/img/ldksq.png'), isOuter: 1, url: '', target: ''},
      {text: '加班申请', type: '', name: '加班申请', key: 'jiaBanShengQing', img: require('../../assets/img/jbsq.png'), isOuter: 1, url: '', target: ''},
      {text: '公出申请', type: '', name: '公出申请', key: 'gongChuShenQing', img: require('../../assets/img/gcsq.png'),  isOuter: 1, url: '', target: ''}],
    qx: [
      {text: 'SVN申请', type: 'SVN', key: 'svnShenQing', img: require('../../assets/img/svn.png'), url: 'commonApply', isOuter: 0},
      {text: 'IT设备申请', type: 'IT_DEVICE_APPLY', key: 'ITshebeishenqing', img: require('../../assets/img/ITdevice.png'), url: 'commonApply', isOuter: 0},
      {text: '车位申请', type: 'PARK_APPLY', key: 'cheWeiShenQing', img: require('../../assets/img/cwsq.png'), url: 'commonApply1', isOuter: 0},
      {text: '名片打印', type: 'PRINT_CARD', key: 'mingPianDaYin', img: require('../../assets/img/mpdy.png'), url: 'commonApply1', isOuter: 0},
      {text: '收入证明', type: 'PROOF_OF_INCOME', key: 'shouRuZhengMing', img: require('../../assets/img/srzm.png'), url: 'commonApply1', isOuter: 0},
      {text: '在职证明', type: 'INCUMBENCY', key: 'zaiZhiZhengMing', img: require('../../assets/img/zzzm.png'), url: 'commonApply1', isOuter: 0},
      {text: '实习证明', type: 'INTERNSHIP_PROVE', key: 'shiXiZhengMing', img: require('../../assets/img/sxzm.png'), url: 'commonApply1', isOuter: 0},
      {text: '自定义申请', type: 'OTHER', key: 'ziDingYiShenQing', img: require('../../assets/img/zdysq.png'), url: 'commonApply2', isOuter: 0}],
    zdcx: [
      {text: '会议室预定', type: '', name: 'OA', key: 'huiYiShiYuDing', img: require('../../assets/img/hysyd.png'), url: 'todo', isOuter: 1, target: ''},
      {text: '薪资查询', type: '', name: '薪资查询', key: 'xinZiChaXun', img: require('../../assets/img/xzcx.png'), url: 'todo', isOuter: 1, target: ''},
      {text: '考勤查询', type: '', key: 'kaoQinChaXun', img: require('../../assets/img/kqcx.png'), url: 'attendance', isOuter: 0, target: ''},
      {text: '工牌打印', type: '', name: '工牌打印', key: 'gongPaiDayin', img: require('../../assets/img/gpdy.png'), url: 'todo', isOuter: 1, target: ''}]
  };

  // 获取星星
  let optionSelectInfo = {};
  for (let section in optionValue) {
    for (let item of optionValue[section]) {
      optionSelectInfo[item.key] = Object.assign({}, item, {isSelected: false});
    }
  }

  export default {
    components: {LabelStar},
    data() {
      return {
        apiData: {
          todolist: {},  // 待审批
          finishedApplies: {},  // 两周内的申请-完成
          rejectApplies: {},  // 两周内的申请-拒绝
          inprocessApplies: {},  // 两周内的申请-进行中
          favorites: '',  // 员工自助
          rzdlDetail: {  // 入转调离详情数据
            recruitment: 6,  // 招聘
            entry: 6,  // 入职
            regularization: 7,  // 转正
            dimission: 4  // 离职
          }
        },  // 接口数据
        finishedCount: 0,
        rejectCount: 0,
        inprocessCount: 0,
        todoSum: 0,  // 待审批总和
        applySum: 0,  // 两周内申请总和
        approve,  // 待审批列表
        optionValue,  // 数据源
        optionSelectInfo,  // 控制星星
        isMax: false,  // 控制弹框
        tip: true,
        selectedOption: [],
        isUpdateFavorites: false,
        isShowNull: false,  // 控制我的自助为空时图片展示
        isLoading: true,  // 汇总数据的loading标志
        isFavoriteLoading: true,  // 员工自助的loading标志
        loadingError: true,
        loadingObj: '',
        loadingSelfObj: '',
      }
    },
    computed: {
      ...mapState({
        userId: state => state.user.userAccount
      })
    },
    mounted() {
      // loading
      this.loadingObj = this.$loading({
        target: this.$refs.loadingBox,
      });
      this.loadingSelfObj = this.$loading({
        target: this.$refs.loadingBoxSelf,
      });

      this.initInfo();
    },
    watch:{
      optionSelectInfo: {
        handler() {
          this.updateSelected();
        },
        immediate: true,
        deep: true
      },
      userId: function(newValue, oldValue) {
        if(newValue && newValue.length > 0) {
          this.initInfo();
        }
      }
    },
    methods: {
      async initInfo() {
        if (!this.userId) return;
        this.selectedOption = [];
        try {
          // // get outer page url for each item
          setOurterPageUrl(this.approve)
          setOurterPageUrl(this.optionValue.ptyg)
          setOurterPageUrl(this.optionValue.xzzy)
          setOurterPageUrl(this.optionValue.qx)
          setOurterPageUrl(this.optionValue.zdcx)
          setOurterPageUrl(this.optionValue.kqsq)

          const favorites = await api.getFavorites(this.userId);
          this.isFavoriteLoading = false;
          for (let temp of favorites.split(',')) {
            if (this.optionSelectInfo[temp]) {
              this.optionSelectInfo[temp].isSelected = true;
              this.selectedOption.push(this.optionSelectInfo[temp]);
            }
          }
          setOurterPageUrl(this.selectedOption)

          let response = await api.getHomeInfo(this.userId);
          this.loadingObj.close();
          this.loadingSelfObj.close();
          this.isLoading = false;
          this.loadingError = false;
          this.apiData = Object.assign({}, this.apiData, response);
          this.todoSum = this.objSum(this.apiData.todolist);
          this.finishedCount = this.objSum(this.apiData.finishedApplies);
          this.rejectCount = this.objSum(this.apiData.rejectApplies);
          this.inprocessCount = this.objSum(this.apiData.inprocessApplies);
          this.applySum = this.finishedCount + this.rejectCount + this.inprocessCount;

          for (let key in this.apiData.todolist.rzdl) {
            this.apiData.todolist[key] = this.apiData.todolist.rzdl[key];
          }
          this.apiData.todolist.rzdl = 0;

          this.isShowNull = true;

          this.$nextTick(function() {
            this.isUpdateFavorites = true;
          }.bind(this));
        } catch (err) {
          console.log('error: ', err);
          this.loadingObj.close();
          this.loadingSelfObj.close();
          this.isFavoriteLoading = false;
          this.isLoading = false;
        }
      },
      // 对象求和
      objSum(obj) {
        if ((typeof obj) === 'number') return obj;
        let sum = 0;
        for (let key in obj) {
          if ((typeof obj[key]) === 'object') {
            sum += this.objSum(obj[key]);
          } else {
            sum += obj[key];
          }
        }
        return sum;
      },
      // 生成自助列表
      async updateSelected() {
        let cacheKeys = [];
        let _this = this;
        // 移除
        this.selectedOption = this.selectedOption.filter(val => {
          if (_this.optionSelectInfo[val.key].isSelected) {
            cacheKeys.push(val.key);
            return true;
          }
        });
        // 添加
        for (let item in this.optionSelectInfo) {
          if (this.optionSelectInfo[item].isSelected && cacheKeys.indexOf(item) === -1) {
            this.selectedOption.push(this.optionSelectInfo[item]);
            cacheKeys.push(item);
          }
        }
        this.tip = !(this.selectedOption.length >= 10 && this.tip);

        if (this.isUpdateFavorites) {
          try {
            // console.log('cacheKeys: ', cacheKeys);
            let response = await api.setFavorites(this.userId, cacheKeys.join(','));
            // console.log('res:', response);
          } catch (err) {
            console.log('err', err);
          }
        }
      },
      // 添加菜单
      addMenu(key, isSelected) {
        if (this.loadingError) return;
        if(this.selectedOption.length >= 10 && !isSelected) {
          this.isMax = true;
          return;
        }
        this.optionSelectInfo[key].isSelected = !isSelected;
      },
      // 取消添加
      removeAdd(key){
        this.optionSelectInfo[key].isSelected = false;
      },
      // 自助服务列表跳转
      switchPage (url, params){
        if (!url) return;
        params ? this.$router.push({path: url, query: params}) : this.$router.push(url);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';

  * {
    padding: 0;
    margin: 0;
  }

  ul li {
    list-style: none;
    float: left;
  }

  .clearfloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0
  }

  a {
    text-decoration: none;
    color: #333;
  }

  .content-wrapper {
    /*background-color: white;*/
    height: 100%;

    .loading-box {
      height: 100px;
      background: #fff;
      margin-top: 20px;
    }
  }
  .banner{
    font-size: 0;
  }
  .banner > img {
    width: 100%;
    height: 103px;
  }

  .approval-pending {
    padding: 20px 20px 10px;
    margin-top: 20px;
    background-color: #fff;

    .waiting-hover{
      cursor: pointer;
    }
    .waiting-hover:hover{
      background: $primary;

      p,span {
        color: #fff;
      }
    }
  }

  /*提示框*/
  .el-popover{

    .attendance{
      h4{
        margin-bottom: 8px;
        text-align: center;
      }
      h4 a{
        margin-right: 15px;
        text-decoration: underline;
        color: #416DD7;
        font-weight: normal;
        cursor: pointer;
      }
      p{
        font-size: 10px;
        color: #999;
      }
      strong {
        font-weight: normal;
        color: #FC5252;
      }
    }
    .attendance, .tipStyle {
      h4 a{
        margin-right: 15px;
        text-decoration: underline;
        color: #416DD7;
        font-weight: normal;
        cursor: pointer;
      }
      h4 span{
        margin-right: 8px;
        color: #999;
        font-weight: normal;
      }
    }
  }

  h3 {
    position: relative;
    padding-left: 15px;
    margin-top: 0;
  }
  h3::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 3px;
    height: 15px;
    width: 5px;
    background-color: $primary;
  }

  .total {
    margin-left: 10px;
  }

  ul {
    margin-top: 16px;
  }

  .approval-pending ul li a {
    width: 109px;
    height: 60px;
    margin-left: 8px;
    margin-bottom: 8px;
    color: #fff;
    padding: 8px 9px 20px 10px;
    text-align: center;
    background: #F5F5FA;
    display: inline-block;
  }

  .approval-pending ul li a {
    font-weight: normal;
    /*float: left;*/

    p {
      color: $major;
    }
  }

  .approval-pending ul li .count {
    font-size: 20px;
    color: #FC5252;
  }

  .approval-pending ul li .icon {
    float: right;
    padding-top: 2px;
  }

  .application {
    padding: 20px;
    margin-top: 16px;
    background-color: #fff;
    height: 102px;

    .warning-o {
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url(../../assets/img/warning-o.png);
      vertical-align: middle;
      margin-right: 5px;
    }

    p span:hover {
      color: $link;
    }
  }

  .application p {
    padding-top: 20px;
    margin-left: 11px;
  }

  .application p span {
    display: inline-block;
    margin-left: 8px;
    margin-right: 53px;
    cursor: pointer;
  }

  .application p span i {
    font-style: normal;
    color: #FC5252;
  }

  .self-service {
    padding: 20px;
    margin-top: 23px;
    background-color: #fff;
    min-height: calc(100% - 382px);
    a{
      cursor: pointer;
    }

    .loading-box-self {
      height: 80px;
    }

    .null {
      text-align: center;
      margin-top: 21px;
      margin-bottom: 42px;

      img {
        width: 120px;
        height: 90px;
      }

      p {
        font-size: $subtitleSize;
        color: $secondary;
      }
    }

    .tips {
      background: #F5F5FA;
      line-height: 26px;
      text-align: center;
      color: $secondary;
      font-size: $smallSize;

      i {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-bottom: -1px;
        background: url(../../assets/img/star-outline.png) no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .self-service .list ul {
    /*border-bottom: 1px solid rgba(241, 241, 241, 1);*/
    margin-top: 25px;
  }

  .self-service .list li {
    padding-left: 8px;
    width: 165px;
    height: 65px;
  }

  .self-service .list li a {
    display: inline-block;
    height: 33px;
  }

  .self-service .list li span {
    margin-left: 8px;
  }

  .self-service .list li img {
    vertical-align: middle;
  }

  .col-tips {
    line-height: 55px;
    a {
      cursor: default;
    }
    img {
      display: inline-block;
      vertical-align: baseline !important;
    }
    p {
      display: inline-block;
      width: 70px;
      line-height: 19px;
      font-size: 12px;
      color: #999;
    }
  }

  .self-service li span:hover {
    color: $primary;
  }

  .self-service .showStar {
    .star {
      width: 12px;
      height: 12px;
      display: none;
      margin-left: 13px;
      margin-bottom: 4px;
    }
  }

  .self-service li:hover {
    .star {
      display: inline;
    }
  }

  .apply-list {
    padding-left: 8px;
    padding-top: 24px;
    .expense, .attendance, .limit, .office {
      float: left;
    }
    img {
      margin-right: 6px;
      vertical-align: bottom;
      width: 17px;
      height: 17px;
    }
    h4 {
      margin-bottom: 16px;
    }
    .option-list {
      margin-right: 32px;
      height: 33px;
    }
    .expense {
      width: 362px;
      .expend-line {
        padding-left: 23px;
        height: 382px;
        border-right: 1px rgba(241, 241, 241, 1) solid;
        .staff, .admin {
          h4 {
            font-weight: bold;
            color: #C0C0C0;
          }
        }
      }
    }
    .attendance {
      padding-left: 13px;
      width: 148px;
      ul {
        padding-left: 23px;
        height: 382px;
        border-right: 1px rgba(241, 241, 241, 1) solid;
      }
    }
    .limit {
      padding-left: 13px;
      width: 150px;
      ul {
        padding-left: 23px;
        height: 382px;
        border-right: 1px rgba(241, 241, 241, 1) solid;
      }
    }
    .office {
      padding-left: 13px;
      width: 149px;
      ul {
        padding-left: 23px;
        height: 382px;
        border-right: 1px rgba(241, 241, 241, 1) solid;
      }
    }
  }
  /*对话框*/
  .dialog{
    .el-button{
      padding: 12px 20px;
      background-color: #4A90E2;
      color: #fff;
    }
    img{
      vertical-align: middle;
      width: 28px;
      height: 29px;
    }
    p:nth-child(1){
      line-height: 36px;
      font-size: 16px;
    }
    p:nth-child(2){
      padding-top: 11px;
      padding-left: 8px;
    }
  }

</style>
