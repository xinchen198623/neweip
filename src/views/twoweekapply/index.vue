<template>
  <div class="weekwrap">
    <breadcrumb :breadlist="navlist"></breadcrumb>
    <div class="content_box">
      <div class="nav-right">去往<router-link :to="{name: 'commonApplyHistory'}">我的申请>></router-link></div>
      <div class = "tabs" v-loading="loading">
          <ul class="clearfix">
            <li class="tab alltotal" v-if='allTotal > 0'>全部 <span class="tabNum">(<i> {{allTotal}} </i>)</span> </li>
            <li class="tab" v-for="(item,index) in tabs" v-if='item.total !==0' @click="tabChanged(index)" :key="index" :class="{istabactive:tabIndex===index}">
                {{item.title}}
                <span class="tabNum">(<i> {{item.total}} </i>)</span>
                <span :class="{'arrow':ArrowIndex===index}"></span>
            </li>
          </ul>
          <div class="section"  >
              <div class='subtabs clearfix'>
                <ul class="tabsparam clearfix">
                  <li class="tab" v-for="(item,tabsparamindex) in subTypeList" v-if='item.total>0' @click="tabsparamChanged(tabsparamindex)" :class="{isactive:tabsparamindex===subactive}"  :key="tabsparamindex">
                      <span  >{{item.title}}</span>
                      <span class="tabNum" >( <i> {{item.total}}</i> )</span>
                  </li>
                </ul>
              </div>

              <div class="develop" v-if="showUndo"><span>{{selectedTabItem.tip}}</span><br><a :target="selectedTabItem.target" :href='selectedTabItem.url' class='golink'>{{selectedTabItem.linktext}}</a></div>
              <div class="table" v-if="!showUndo && !emptyShow" v-loading="tableLoading">
                <el-table
                  :data="pageData"
                  style="width: 100%;"
                  @row-click="toDetailPage"
                  :default-sort = "{prop: 'createAt', order: 'descending'}"
                  stripe 
                  v-if='!tableLoading'>
                  <el-table-column
                    prop="typeName"
                    label="类型"
                    :show-overflow-tooltip="true"
                    width="150">
                    <template slot-scope="scope">
                      <div class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.typeName }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="createAt"
                    label="申请时间"
                    sortable
                    :formatter="formatDate">
                  </el-table-column>
                  <el-table-column
                    prop="comment"
                    label="附件"
                    :show-overflow-tooltip="true">
                    width="300"
                    v-if="subactive!==9">
                    <template slot-scope="scope">
                      <div class="table-attachment" v-for="(item, index) in scope.row.generalApprovalAttachments" :key="index">
                        <!-- <a target="view_window" :href="`/api/file/download?fileHash=${item.fileHash}&fileName=${item.fileName}`">{{item.fileName}}</a> -->
                        <span @click.stop='openFile(item)'>{{item.fileName}}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="comment"
                    label="备注"
                    :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column
                    prop="state"
                    label="状态"
                    width="150px"
                    :formatter="stateDictionary">
                  </el-table-column>
                </el-table>
                <div class="pagination">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="pageSize"
                    :total="totalNum"
                    @current-change="changePage">
                  </el-pagination>
                </div>
              </div>
              <div class="develop img"  v-if="emptyShow" ><img src="../../assets/img/null.png"><p class="text">暂无内容</p></div>
          </div>

        </div>
      </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import * as api from "../../api/twoweek";
import breadcrumb from "../../components/breadcrumb";
import { setOurterPageUrl } from "../../utils/sso.js";
import dateformat from "@hc/core/lib/date";

export default {
  data() {
    return {
      navlist: [
        {
          name: "2周内申请",
          path: ""
        }
      ],
      allTotal: 0, // 全部
      subTypeList: [], // 选中tab的二级菜单列表
      currentStatus: "", // 选中tab的状态：‘审批中’，‘已拒绝’，‘已批准’
      selectedTabItem: {
        tip: "",
        linktext: "",
        url: ""
      },
      tabs: [
        {
          type: "rejectApplies",
          title: "已拒绝",
          state: "R",
          total: 0,
          subtype: [
            {
              type: "offShift",
              title: "休假",
              name: "我的申请-休假",
              total: 0,
              tip: "查看已拒绝的休假详情, 请打开",
              linktext: "EHR系统 - 休假历史记录",
              isOuter: true
            },
            {
              type: "leakCard",
              title: "漏打卡",
              name: "我的申请-漏打卡",
              total: 0,
              tip: "查看已拒绝的漏打卡详情, 请打开",
              linktext: "EHR系统 - 漏打卡历史记录",
              isOuter: true
            },
            {
              type: "publicOut",
              title: "公出",
              name: "我的申请-公出",
              total: 0,
              tip: "查看已拒绝的公出详情, 请打开",
              linktext: "EHR系统 - 公出历史记录",
              isOuter: true
            },
            {
              type: "overTime",
              title: "加班",
              name: "我的申请-加班",
              total: 0,
              tip: "查看已拒绝的加班详情, 请打开",
              linktext: "EHR系统 - 加班历史记录",
              isOuter: true
            },
            {
              type: "regularization",
              title: "转正",
              name: "我的申请-转正",
              total: 0,
              tip: "查看已拒绝的转正详情, 请打开",
              linktext: "EHR系统 - 员工自我鉴定",
              isOuter: true
            },
            {
              type: "dimission",
              title: "离职",
              name: "我的申请-离职",
              total: 0,
              tip: "查看已拒绝的员工离职申请, 请打开",
              linktext: "EHR系统 - 员工离职申请",
              isOuter: true
            },
            {
              type: "expense",
              title: "费控",
              name: "我的申请-已拒绝费控",
              total: 0,
              tip: "查看已拒绝的费控申请，请打开",
              linktext: "ERP系统 - 被退回的申请",
              isOuter: true
            },
            {
              type: "oa",
              title: "OA",
              name: "我的申请-OA",
              total: 0,
              tip: "查看已拒绝的OA详情, 请打开",
              linktext: "OA系统 - 流程办结",
              isOuter: true
            },
            {
              type: "basic",
              title: "基础费用",
              name: "我的申请 - 基础费用",
              total: 0,
              isOuter: false
            },
            {
              type: "authIT",
              title: "权限/IT",
              name: "我的申请 - 权限/IT",
              total: 0,
              isOuter: false
            },
            {
              type: "other",
              title: "其他",
              name: "我的申请 - 其他",
              total: 0,
              isOuter: false
            }
          ]
        },
        {
          type: "finishedApplies",
          title: "已批准",
          state: "A",
          total: 0,
          subtype: [
            {
              type: "offShift",
              title: "休假",
              name: "我的申请-休假",
              total: 0,
              tip: "查看已批准的休假详情, 请打开",
              linktext: "EHR系统 - 休假历史记录",
              isOuter: true
            },
            {
              type: "leakCard",
              title: "漏打卡",
              name: "我的申请-漏打卡",
              total: 0,
              tip: "查看已批准的漏打卡详情, 请打开",
              linktext: "EHR系统 - 漏打卡历史记录",
              isOuter: true
            },
            {
              type: "publicOut",
              title: "公出",
              name: "我的申请-公出",
              total: 0,
              tip: "查看已批准的公出详情, 请打开",
              linktext: "EHR系统 - 公出历史记录",
              isOuter: true
            },
            {
              type: "overTime",
              title: "加班",
              name: "我的申请-加班",
              total: 0,
              tip: "查看已批准的加班详情, 请打开",
              linktext: "EHR系统 - 加班历史记录",
              isOuter: true
            },
            {
              type: "regularization",
              title: "转正",
              name: "我的申请-转正",
              total: 0,
              tip: "查看已批准的转正详情, 请打开",
              linktext: "EHR系统 - 员工自我鉴定",
              isOuter: true
            },
            {
              type: "dimission",
              title: "离职",
              name: "我的申请-离职",
              total: 0,
              tip: "查看已批准的员工离职申请, 请打开",
              linktext: "EHR系统 - 员工离职申请",
              isOuter: true
            },
            {
              type: "expense",
              title: "费控",
              name: "我的申请-已批准费控",
              total: 0,
              tip: "查看已批准的费控申请, 请打开",
              linktext: "ERP系统 - 我完成的申请",
              isOuter: true
            },
            {
              type: "oa",
              title: "OA",
              name: "我的申请-OA",
              total: 0,
              tip: "查看已批准的OA详情, 请打开",
              linktext: "OA系统 - 流程办结",
              isOuter: true
            },
            {
              type: "basic",
              title: "基础费用",
              name: "我的申请-基础费用",
              total: 0,
              isOuter: false
            },
            {
              type: "authIT",
              title: "权限/IT",
              name: "我的申请-权限/IT",
              total: 0,
              isOuter: false
            },
            {
              type: "other",
              title: "其他",
              name: "我的申请-其他",
              total: 0,
              isOuter: false
            }
          ]
        },
        {
          type: "inprocessApplies",
          title: "审批中",
          state: "I,S",
          total: 0,
          subtype: [
            {
              type: "offShift",
              title: "休假",
              name: "我的申请-休假",
              total: 0,
              tip: "查看审批中的休假详情, 请打开",
              linktext: "EHR系统 - 休假历史记录",
              isOuter: true
            },
            {
              type: "leakCard",
              title: "漏打卡",
              name: "我的申请-漏打卡",
              total: 0,
              tip: "查看审批中的漏打卡详情, 请打开",
              linktext: "EHR系统 - 漏打卡历史记录",
              isOuter: true
            },
            {
              type: "publicOut",
              title: "公出",
              name: "我的申请-公出",
              total: 0,
              tip: "查看审批中的公出详情, 请打开",
              linktext: "EHR系统 - 公出历史记录",
              isOuter: true
            },
            {
              type: "overTime",
              title: "加班",
              name: "我的申请-加班",
              total: 0,
              tip: "查看审批中的加班详情, 请打开",
              linktext: "EHR系统 - 加班历史记录",
              isOuter: true
            },
            {
              type: "regularization",
              title: "转正",
              name: "我的申请-转正",
              total: 0,
              tip: "查看审批中的转正详情, 请打开",
              linktext: "EHR系统 - 员工自我鉴定",
              isOuter: true
            },
            {
              type: "dimission",
              title: "离职",
              name: "我的申请-离职",
              total: 0,
              tip: "查看审批中的员工离职申请, 请打开",
              linktext: "EHR系统 - 员工离职申请",
              isOuter: true
            },
            {
              type: "expense",
              title: "费控",
              name: "我的申请-审批中费控",
              total: 0,
              tip: "查看审批中的费控申请, 请打开",
              linktext: "ERP系统 - 我当前的申请",
              isOuter: true
            },
            {
              type: "oa",
              title: "OA",
              name: "我的申请-OA",
              total: 0,
              tip: "查看审批中的OA详情, 请打开",
              linktext: "OA系统 - 流程办结",
              isOuter: true
            },
            {
              type: "basic",
              title: "基础费用",
              name: "我的申请-基础费用",
              total: 0,
              isOuter: false
            },
            {
              type: "authIT",
              title: "权限/IT",
              name: "我的申请-权限/IT",
              total: 0,
              isOuter: false
            },
            {
              type: "other",
              title: "其他",
              name: "我的申请-其他",
              total: 0,
              isOuter: false
            }
          ]
        }
      ],
      tabIndex:0,
      ArrowIndex: 0, //箭头
      active:0,
      subactive: 0,
      showUndo: false, // 是否显示‘跳轉到其他系統’模块
      emptyShow: false, // 是否显示table表格
      tableData: [], // 通用审批列
      pageData: [], // 单页显示审批列
      loading: true, // 整个页面的加载
      tableLoading: true, // table是否loading
      page: 1, // 当前页
      pageSize: 20, // 每页显示条数
      totalNum: 0, // 从接口获取的总条数
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.userAccount
    })
  },
  watch: {
    userId: function(newValue, oldValue) {
      if (newValue && newValue.length > 0) {
        this.init();
      }
    }
  },
  components: {
    breadcrumb
  },
  mounted() {
    if (this.userId.length > 0) {
      this.init();
    }
  },
  methods: {
    async init() {
      try {
        this.tabs.forEach(tab => setOurterPageUrl(tab.subtype));

        const apiData = await api.gettwoweek(this.userId);
        this.convertData(apiData); //賦值

        // show default tab
        let index = this.$route.query.index // ? this.$route.query.index : 0
        if(!index) {
          for (let i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].total !== 0) {
              index = i;
              break;
            }
          }
        }
      
        this.loading = false
        this.tabChanged(index);
      } catch (err) {
        debuglog(err);
      }
    },
    async tabChanged(index) {
      console.log('main tab',index)
      this.showUndo = false;
      this.tabIndex = parseInt(index);//首页带过来的index转化为数值 
      this.ArrowIndex = parseInt(index);
      this.subTypeList = this.tabs[index].subtype; // tab对应的子菜单
      this.currentStatus = this.tabs[index].state; // tab对应的状态
      this.active=index;
      // 默认显示第一个非空下級菜單
      for (let i = 0; i < this.tabs[index].subtype.length; i++) {
        if (this.tabs[index].subtype[i].total !== 0) {
          this.tabsparamChanged(i);
          break;
        }
      }
      const apiData = await api.gettwoweek(this.userId);
      this.convertData(apiData); //賦值
    },
    async tabsparamChanged(index) {
      console.log('subtab',index)
      const currentTab = this.subTypeList[index];
      if (currentTab.isOuter) {
        // 直接链接到外部
        this.selectedTabItem = currentTab;
        this.showUndo = true;
        this.subactive = index;
      } else {
        // 显示列表
        this.showUndo = false;
        this.subactive = index;
        // 获取列表数据
        this.tableLoading = true;
        this.page = 1;
        this.tableData = [];
        this.tableData = await api.getListData(
            currentTab.type,
            this.currentStatus,
            true)
        this.tableLoading = false;
        this.pageData = this.tableData.slice(0,this.pageSize)
        this.totalNum = this.tableData.length
        this.emptyShow = this.tableData.length > 0 ? false : true;
        
      }
      const apiData = await api.gettwoweek(this.userId);
      this.convertData(apiData); //賦值
    },
    convertData(apiData) {
      this.allTotal = 0;
      this.transformData("inprocessApplies", apiData.inprocessApplies);
      this.transformData("rejectApplies", apiData.rejectApplies);
      this.transformData("finishedApplies", apiData.finishedApplies);
    },
    transformData(key, data) {
      const item = this.tabs.find(d => d.type === key);
      item.subtype.find(d => d.type === "leakCard").total =
        data.attendance.leakCard;
      item.subtype.find(d => d.type === "publicOut").total =
        data.attendance.publicOut;
      item.subtype.find(d => d.type === "offShift").total =
        data.attendance.offShift;
      item.subtype.find(d => d.type === "overTime").total =
        data.attendance.overTime;
      item.subtype.find(d => d.type === "dimission").total =
        data.rzdl.dimission;
      item.subtype.find(d => d.type === "regularization").total =
        data.rzdl.regularization;
      item.subtype.find(d => d.type === "expense").total = data.expense;
      item.subtype.find(d => d.type === "oa").total = data.oa;
      item.subtype.find(d => d.type === "basic").total = data.baseFee;
      item.subtype.find(d => d.type === "authIT").total = data.right;
      item.subtype.find(d => d.type === "other").total = data.other;

      item.total =
        data.attendance.leakCard +
        data.attendance.publicOut +
        data.attendance.offShift +
        data.attendance.overTime +
        data.rzdl.dimission +
        data.rzdl.regularization +
        data.expense +
        data.oa +
        data.baseFee +
        data.right +
        data.other;

      this.allTotal += item.total;
    },
    toDetailPage(row) {
      // 跳转到申请的详情页
      this.$router.push({ path: "/commonApply/detail", query: { id: row.id, bread: 2 } });
    },
    stateDictionary(state) {
      let stateStr = "";
      switch (state.state) {
        case "A":
          stateStr = "已批准";
          break;
        case "R":
          stateStr = "已拒绝";
          break;
        case "D":
          stateStr = "已撤回";
          break;
        case "I":
          stateStr = "审批中";
          break;
        case "S":
          stateStr = "已提交";
          break;
      }

      return stateStr;
    },
    formatDate(row) {
      return dateformat.format(new Date(row.createAt), "yyyy-MM-dd HH:mm");
    },
    openFile(file) {
      let link = document.createElement('a')
      link.href = `/api/file/download?fileHash=${file.fileHash}&fileName=${file.fileName}`
      // link.target = '_blank'
      link.download = file.fileName
      link.click()
    },
    changePage (newPage) {
      // 换页
      // console.log('换页', newPage)
      this.page = newPage
      let startNum = (this.page - 1) * this.pageSize
      let endNum = this.page * this.pageSize
      this.pageData = this.tableData.slice(startNum, endNum)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/common.scss";

.weekwrap {
  .nav-right {
    position: absolute;
    right: 0px;
    top: -57px;
    font-size:$subtitleSize;
    a {
      color: #416dd7;
      margin-left: 5px;
    }
  }

  .content_box {
    padding: 0px !important;
    position: relative;
    width: 1160px;
    margin: 20px auto;
    background-color: #fff;
  }
  .tabs {
    min-height: 606px;
    padding-bottom: 30px;
    ul {
      margin: 0;
      padding-left: 18px;
    }
    margin: 0 auto;
    background-color: #fff;
    .tab {
      // display: inline-block;
      cursor: pointer;
      float: left;
      position: relative;
      // width: 95px;
      list-style: none;
      // margin-right: 50px;
      line-height: 54px;
      white-space: nowrap;
      padding: 0 12px;
      font-size: $contentSize;
      color: $secondary;
    }
    .tabNum {
      color: #666666;
      i {
        color: #fc5252;
        font-style: normal;
      }
    }
    .alltotal {
      cursor: auto;
      font-size: $subtitleSize;
      font-weight:600;
    }

    .arrow {
      &::before {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        border-top: 1px solid #e6e6e6;
        border-left: 1px solid #e6e6e6;
        background-color: #fafafa;
        bottom: -6px;
        left: 50%;
        transform: rotate(45deg);
        z-index:100;
      }
    }
  }
  .section {
    margin: 0 auto;
    .tabsparam {
      transition: height 0.2s;
      transition-timing-function: ease;
      // padding-left: 34px;
      position: relative;
      border-top: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
      background: #fafafa;
      li {
        line-height: 47px;
      }
    }
  }
  .develop {
    min-height: 450px;
    margin: 0 auto;
    text-align: center;
    margin: 10px 50px;
    padding-top: 150px;
    span {
      font-size: $subtitleSize;
      color: $secondary;
      text-align: center;
    }
    .golink {
      font-size: $titleSize !important;
      color: $primary !important;
      cursor: pointer;
      text-decoration: underline;
      margin-top: 20px;
      display: inline-block;
      
    }
  }
  .isactive {
    color: #3e6ada !important;
    border-bottom: 3px solid #416dd7;
  }
  .istabactive{
    color: #3e6ada !important;
  }
  .el-table--fit {
    // padding-left: 20px;
    // padding: 0 20px;
  }
  .el-tag {
    height: 30px;
    text-align: center;
    background-color: #fafafa;
    border: 1px solid $placeholder;
    color: $secondary;
    font-size: $contentSize;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .img {
    width: $contentWidth;
    margin: 0 auto;
  }
  .text {
    font-size: $subtitleSize;
    color: $secondary;
  }
  .table-attachment {
    a,p,span {
      margin: 0 0 4px;
      color: $link;
      cursor: pointer;
    }
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.table {
  padding: 0 34px;
  min-height: 450px;
}
.subtabs .clearfix li:first-child{
  margin-left:114px;
}
</style>

<style>
  .el-table__row {
    cursor: pointer;
  }

</style>
