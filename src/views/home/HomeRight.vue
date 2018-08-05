<template>
  <div class="home-right-wrapper">
    <div class="base-info clearfix" @click="$router.push({'path': 'attendance', 'query': {'month': attendanceMonth}})">
      <div class="date-info">
        <p>{{date.substr(-2)}}</p>
        <span>{{date.substr(0, 7)}}</span>
      </div>
      <div class="attendance-info">
        <p><em>{{Number(attendanceMonth.split('-')[1])}}月考勤 <strong v-if="attendanceInfo.confirmStatus === 1">待确认</strong></em></p>
        <!--<p>-->
          <!--<span>漏打卡<strong> {{attendanceInfo.missCount}}次</strong>-->
            <!--&nbsp;&nbsp;&nbsp;&nbsp;休假<strong> {{attendanceInfo.askLeaveCount}}天</strong></span>-->
        <!--</p>-->
        <p class="confirm">
          <span v-if="attendanceInfo.unusual > 0">考勤异常<strong> {{attendanceInfo.unusual}}条</strong></span>
          <span v-else>考勤正常</span>
          <a v-if="attendanceInfo.confirmStatus === 1">去确认考勤</a>
        </p>
      </div>
    </div>
    <div class="outer">
      <div class="outer-head">
        <h3>其他系统链接</h3>
      </div>
      <ul class="outer-main clearfix">
        <li v-for="(item, index) in menuList" :key="index">
          <a :target="item.target" :href='item.url'>{{item.name}}</a>
        </li>
      </ul>
    </div>
    <div class="notice">
      <div class="notice-head">
        <h3>企业公告</h3>
      </div>
      <div class="notice-main">
        <a v-for="(item, index) in notices" :key="index" :href="item.url" :target="item.target">
          <span :title="item.text">{{item.text}}</span><strong :title="item.text">{{item.time}}</strong>
        </a>
      </div>
    </div>
    <div class="rule">
      <div class="rule-head clearfix">
        <h3>规章制度</h3>
        <p><a :target="rulesMore[0].target" :href='rulesMore[0].url'>{{rulesMore[0].text}}</a></p>
      </div>
      <div class="rule-main">
        <a v-for="(item, index) in rules" :key="index" :target="item.target" :href='item.url'>
          <span :title="item.text"><i v-if="item.isNew"></i>{{item.text}}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import * as api from '../../api/home'
  import { setOurterPageUrl } from '../../utils/sso.js'

  let notices = [
    {text: '恒昌创始人兼CEO秦洪涛荣获“2018中国双创先锋人', url: 'http://www.credithc.com/hcdt/mtbd/33_14000.html', time: '2018-07-23', target: 'notice_window'},
    {text: '扎实推进精准扶贫 恒昌助推顺义区对口帮扶', url: 'http://www.credithc.com/hcdt/mtbd/33_13999.html', time: '2018-07-17', target: 'notice_window'},
    {text: '积极探寻金融监管新范式 恒昌亮相2018青岛·中国财富论坛', url: 'http://www.credithc.com/hcdt/mtbd/33_13997.html', time: '2018-07-10', target: 'notice_window'},
    {text: '恒昌荣登“2018中国企业公民责任品牌50强”', url: 'http://www.credithc.com/hcdt/mtbd/33_13996.html', time: '2018-07-04 ', target: 'notice_window'},
    {text: '山西省互金协会领导莅临恒昌考察调研', url: 'http://www.credithc.com/hcdt/mtbd/33_13995.html', time: '2018-07-03', target: 'notice_window'}
  ];

  let rulesMore = [{name: '规章制度', text:'查看更多', url: '', isOuter: 1, target: ''},]
  let rules = [
    {name: '规章制度1', text: '员工考勤及假期管理办法（V1.4）', url: '', isNew: false, isOuter: 1, target: ''},
    {name: '规章制度1', text: '员工手册（V2.0）', url: '', isNew: false, isOuter: 1, target: ''},
    {name: '规章制度1', text: '职能岗员工异动管理办法（V1.1）', url: '', isNew: false, isOuter: 1, target: ''},
    {name: '规章制度2', text: '固定资产管理制度（V1.0）', url: '', isNew: false, isOuter: 1, target: ''},
    {name: '规章制度2', text: '快递管理办法(V1.2)', url: '', isNew: false, isOuter: 1, target: ''},
    {name: '规章制度3', text: '员工桌面终端安全使用管理规定（V2.0）', url: '', isNew: false, isOuter: 1, target: ''},
    {name: '规章制度3', text: '员工即时通讯软件安全使用管理规定', url: '', isNew: false, isOuter: 1, target: ''},
    {name: '规章制度3', text: '信息安全管理制度（V1.0）', url: '', isNew: false, isOuter: 1, target: ''},
    {name: '规章制度3', text: '员工上网行为安全管理规定（V3.0）', url: '', isNew: false, isOuter: 1, target: ''}
  ];

  let menuList = [
    {name: 'EHR',  index: 0, isOuter: 1, target: ''},
    {name: 'ERP', index: 1, isOuter: 1, target: ''},
    {name: 'OA', index: 2, isOuter: 1, target: ''},
    // {name: '合同', url: 'url', index: 3}   //这一期暂时没有
  ];

  export default {
    props: {},
    data() {
      return {
        attendanceInfo: {},  // 考勤相关信息
        date: '',  // 当前日期
        attendanceMonth: '',  // 考勤信息月份
        notices,  // 企业公告
        rules,  // 规章制度
        rulesMore, // 查看更多
        menuList,  // 其他系统
      };
    },
    mounted() {
      this.date = formatDate(new Date());
      this.initInfo();
    },
    computed: {
      ...mapState({
        userId: state => state.user.userAccount
      })
    },
    watch: {
      userId: function(newValue, oldValue) {
        if(newValue && newValue.length > 0) {
          this.initInfo();
        }
      }
    },
    methods: {
      async initInfo() {
        if (!this.userId) return;
        try {
          setOurterPageUrl(this.menuList);
          setOurterPageUrl(this.rules)
          setOurterPageUrl(this.rulesMore)

          let dateArray = this.date.split('-');
          let month = parseInt(this.date.split('-')[1]);

          let strMonth = month - 1 < 10 ? (month === 0 ? '12' : '0' + (month - 1)) : month - 1;
          this.attendanceMonth = dateArray[0] + '-' + strMonth;
          this.attendanceInfo = await api.getAttendance(this.userId, this.attendanceMonth);
          if (this.attendanceInfo.confirmStatus !== 1) {
            let strMonth = month < 10 ? '0' + month : month;
            this.attendanceMonth = dateArray[0] + '-' + strMonth;
            this.attendanceInfo = await api.getAttendance(this.userId, this.attendanceMonth);
          }
          let unusualCount = this.attendanceInfo.days.filter(val => {
            return val.hpsStauts === 'N';
          }).length;

          let deadline = this.attendanceInfo.deadline
          
          this.$set(this.attendanceInfo, 'unusual', unusualCount);
          // this.attendanceMonth  ,this.attendanceInfo  attendanceInfo.unusual
          if(this.attendanceInfo.confirmStatus === 1){
          this.$emit('infoGet',{month:this.attendanceMonth,count:this.attendanceInfo.unusual,deadline:deadline})

          }
        } catch(err) {
          console.log('error: ', err);
        }
      },
      toPage(url, isOuter=0) {
        // isOuter ? window.open(url) : this.$router.push(url);
      },
      toOuterPage (item) {
        item ? gotoSitePage(item) : gotoSitePage(this.rules[0]);
      }

    }
  }

  // 该方法可以提出去作为公共方法
  function formatDate(date) {
    let year = String(date.getUTCFullYear());
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    month = month.length === 1 ? '0' + month : month;
    day = day.length === 1 ? '0' + day : day;
    return [year, month, day].join('-');
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';

  .home-right-wrapper {

    .base-info {
      height: 103px;
      background: #fff;
      padding: 14px 0 14px 14px;
      cursor: pointer;
      border: 2px solid #fff;

      .date-info {
        text-align: center;
        width: 75px;
        height: 75px;
        background: #F5F5F6;
        margin-right: 10px;
        float: left;

        p {
          font-size: 40px;
          color: $secondary;
          margin: 0;
        }
        span {
          font-size: $smallSize;
          color: $minor;
        }
      }

      .attendance-info {
        float: left;
        padding-top: 8px;

        p {
          margin: 0 0 7px;
          font-size: $contentSize;
          color: $major;
        }
        em {
          font-style: normal;
          font-size: $subtitleSize;
        }
        span {
          font-size: $smallSize;
          color: $secondary;
        }
        strong {
          color: $alert;
          font-weight: normal;
        }
        .confirm {
          text-align: right;
          margin: 15px 15px 0 0;
          color: $secondary;

          span {
            font-size: $contentSize;
          }

          a {
            color: $link;
            font-size: $smallSize;
            display: inline-block;
            margin-left: 8px;
          }
        }
      }
    }

    .base-info:hover {
      /*box-shadow:0 2px 4px 0 rgba(7,6,38,0.5);*/
      border-color: $primary;
    }

    .outer {
      background: #fff;
      height: 208px;
      margin-top: 20px;
      padding: 14px 0 2px 15px;

      h3 {
        border-left: 5px solid $primary;
        padding-left: 15px;
        margin: 0;
      }

      .outer-main {
        padding-top: 20px;
        padding-left: 13px;

        li a {
          list-style: none;
          float: left;
          width: 109px;
          line-height: 55px;
          text-align: center;
          background: #F5F5FA;
          margin: 0 8px 8px 0;
          color: $major;
          font-size: $contentSize;
          cursor: pointer;
        }

        li a:hover {
          background: $primary;
          color: #fff;
        }
      }
    }

    .notice {
      background: #fff;
      margin-top: 16px;
      padding: 14px 0 2px 15px;
      height: 260px;

      h3 {
        border-left: 5px solid $primary;
        padding-left: 15px;
        margin: 0;
      }

      .notice-main {
        padding: 18px 0 0 13px;

        a {
          display: block;
          margin: 0 0 23px;
          font-size: $smallSize;
          cursor: pointer;
        }
        span {
          display: inline-block;
          width: 154px;
          margin-right: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: bottom;
          color: $secondary;
        }
        strong {
          color: $minor;
          font-weight: normal;
        }
        a:hover {
          span, strong {
            color: $link;
          }
        }
      }
    }

    .rule {
      background: #fff;
      margin-top: 24px;
      padding: 14px 0 2px 15px;

      .rule-head {
        h3 {
          border-left: 5px solid $primary;
          padding-left: 15px;
          margin: 0;
          float: left;
        }

        a {
          float: right;
          margin: 0 16px;
          font-size: $smallSize;
          line-height: 21px;
          color: $secondary;
          cursor: pointer;
          color: $primary;

          &:hover {
            color: $link;
          }
        }
      }

      .rule-main {
        padding: 18px 0 0 13px;

        a {
          display: block;
          margin: 0 0 18px;
          font-size: $smallSize;
        }
        i {
          width: 26px;
          height: 15px;
          margin-bottom: 1px;
          display: inline-block;
          background: url("../../assets/img/new.png");
          vertical-align: bottom;
        }
        span {
          display: inline-block;
          width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: $secondary;
          cursor: pointer;
        }
        span:hover {
          color: $link;
        }
      }

    }
  }

  .clearfix:after {
    content:"";
    display: block;
    clear:both;
  }
</style>
