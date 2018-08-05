<template>
  <div class='alterApproval'>

    <breadcrumb :breadlist='opts'></breadcrumb>
    <div class="content">
      <div class="search-box">
        <label for="searchInput">审批人：</label>
        <el-select
          v-model.trim="searchInput"
          v-loadmore="loadMoreSearch"
          filterable
          remote
          placeholder="请输入审批人..."
          :remote-method="searchRemoteMethod"
          :loading="loading"
          clearable
          id="searchInput">
          <el-option
            v-for="(item, i) in searchList"
            :key="item.value"
            v-if="i<=showSearchNum"
            :label="item.label.name"
            :value="item.label.userAccount">
            <span>{{item.label.name}}</span>
            <span class="search-min">{{item.label.userAccount + '/' + item.label.duty + '/' + item.label.department}}</span>
          </el-option>
        </el-select><input type="button" value="搜索" @click="getSearchData">
      </div>
      <div class="contents-box" v-if="isAppear">
        <el-tabs v-model="activeName" @tab-click="tabHandleClick">
          <el-tab-pane label="全部" name="first"></el-tab-pane>
          <el-tab-pane label="基础费用" name="basic"></el-tab-pane>
          <el-tab-pane label="权限/IT" name="authIT"></el-tab-pane>
          <el-tab-pane label="其他" name="other"></el-tab-pane>
        </el-tabs>
        <div class="table-content">
          <div class="table">
            <el-table
              :data="userTableData"
              stripe
              style="width: 100%">
              <el-table-column
                prop="typeName"
                :show-overflow-tooltip="true"
                label="类型">
                <template slot-scope="scope">
                  <span class="pay-check">{{scope.row.typeName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="approverName"
                label="审批人">
              </el-table-column>
              <el-table-column
                prop="toName"
                label="替换人">
              </el-table-column>
              <el-table-column
                prop="dateRange"
                label="时间段">
                <template slot-scope="scope">
                  <p >{{scope.row.startTime && scope.row.endTime ? dateFormat(new Date(scope.row.startTime), 'yyyy/MM/dd') + '-' + dateFormat(new Date(scope.row.endTime), 'yyyy/MM/dd') : ''}}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="medium" @click="edit(scope.$index, scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!--弹窗-->
    <sideModal :isShow="popPage" class="popPage" @closeModal="popPage = false">
      <div class="alter">
        <p>替换人</p>
        <el-select
          v-model.trim="idOrName"
          v-loadmore="loadMore"
          filterable
          remote
          placeholder="输入ID/姓名"
          :remote-method="remoteMethod"
          no-match-text="没有搜索到相关人员"
          no-data-text="暂无审批人信息"
          :loading="loading"
          class="input"
          clearable
          popper-class="alter-approval" @change="getChooseId">
          <el-option
            v-for="(item, index) in list"
            :key="index"
            v-if="index<=showNum"
            :label="item.label.name"
            :value="item.label">
            <span>{{item.label.name}}</span>
            <span class="search-min">{{item.label.userAccount + '/' + item.label.duty + '/' + item.label.department}}</span>
          </el-option>
        </el-select>
      </div>
      <div class="time-range">
        <p>时间段</p>
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="dateStyle"
          @change="checkDate">
        </el-date-picker>
        <p v-show="dateValuetip" class="dataTip">请选择时间段</p>
      </div>
      <div class="btn">
        <el-button class="button-medium-cancel" @click="popPage = false">取消</el-button>
        <el-button type="primary" class="button-medium-primary" @click="save()">确定</el-button>
      </div>
    </sideModal>
  </div>
</template>

<script>
  import * as api from '../../api/alterApproval'
  import breadcrumb from '@/components/breadcrumb.vue'
  import sideModal from '@/components/SideModal.vue'
  import dateformat from '@hc/core/lib/date'

  let timer = null;
  let anglePosition = [95, 190, 262];

  export default {
    data() {
      return {
        loading: false,
        searchInput: '',  // 搜索框
        userTableData: [],  // 用户管理表格数据
        tableTime: '',
        idOrName: [],  // 弹窗搜索值
        checkedId: '',  // 选中的id
        list: [],  // 处理数据（添加唯一key）
        searchList: [],  // 搜索（添加唯一key）
        tabVal: '', // 点击tab栏
        remoteData: [], // 获取的远程数据
        activeName: 'first',  // 控制选中
        showNum: 20,  // 弹框搜索显示数量
        showSearchNum: 10, // 搜索显示数量
        isAppear: false, // 控制表格列表是否显示
        opts: [{
          name: '替换审批人',
          path: '/alterApproval',
        }],
        popPage: false,  // 弹窗
        popContent: {}, // 编辑-当前数据
        dateValue: [],  // 日期变量
        dateValuetip: false, // 时间不为空提示
        // activeAngle: '',  // 尖角位置
        // chooseStyle: '',  // 当前选中过滤条件的样式
        // selListContent: [], // 筛选条件列表
        anglePosition,
      }
    },
    methods: {
      // 获取表格数据
      async getSearchData() {
        if (this.searchInput) {
          this.isAppear = true;
          try {
            let params = {};
            params.name = this.searchInput;
            params.type = this.tabVal;
            const data = await api.getTableData(params);
            this.userTableData = data;  // 表格数据
            this.typeName = data
          } catch (err) {
            console.log('get data error', err)
          }
        }
        else {
          this.tips('请输入姓名哦~');
        }
      },

      // 获取搜索提示数据
      async getRemoteData(query, sel) {
        try {
          const data = await api.getTipsData(query);
          this.remoteData = data.list;
          // 添加唯一key
          if(sel === 'pop'){
            this.list = this.remoteData.map(item => {
              return {value: item.userAccount, label: item};
            });
          }else {
            this.searchList = this.remoteData.map(item => {
              return {value: item.id, label: item};
            });
          }
        } catch (err) {
          console.log('get data error', err);
        }
      },

      // 替换联系人
      async save() {
        try {
          if(!this.dateValue && this.idOrName){
           this.dateValuetip = true;  // 红色字提示
          }else if(!this.idOrName) {
            this.dateValue = this.popContent.startTime = this.popContent.endTime = '';
            if(this.popContent.authId){
              const data = await api.saveEdit(this.popContent);
              debugger
            }else {
              const data = await api.saveAdd(this.popContent);
            }
            this.popPage = false;
          }else{
            this.popContent.startTime = this.dateValue[0];
            this.popContent.endTime = this.dateValue[1];
            this.popContent.toId = this.checkedId;
            this.popContent.toName = this.idOrName;
            if(this.popContent.authId){
              const data = await api.saveEdit(this.popContent);
            }else {
              const data = await api.saveAdd(this.popContent);
            }
            this.popPage = false;
          }
        } catch (err) {
          this.tips('保存失败，请稍候重试~')
        }
        this.getSearchData();
      },

      // 搜索框远程搜索赋值
      searchRemoteMethod(query) {
        this.searchInput = query;
        this.getNameList(query, 'search');
      },

      // 弹框远程搜索赋值
      remoteMethod(query) {
        this.idOrName = query;
        this.getNameList(query, 'pop');
      },

      // 远程搜索
      getNameList(query, sel){
        // this.idOrName = query;
        if (query !== '') {
          this.loading = true;
          clearTimeout(timer);
          timer = setTimeout(() => {
            this.loading = false;
            this.getRemoteData(query, sel);
          }, 200);
        } else {
          this.list = [];
          this.searchList = [];
        }
      },
      loadMoreSearch(){
        this.more('showSearchNum')
      },

      loadMore(){
        this.more('showNum')
      },

      more(val) {
        let List = val === 'showNum' ? this.list : this.searchList;
        let num = val === 'showNum' ? this.showNum : this.showSearchNum;
        let newNum = num + 10;
        if (newNum > List.length) {
          if(val === 'showNum'){
            this.showNum = List.length;
          }
          else {
            this.showSearchNum = List.length;
          }
          console.log('数组长度')
        } else {
          if(val === 'showNum'){
            this.showNum = newNum;
          }
          else {
            this.showSearchNum = newNum;
          }
          console.log('增加20')
        }
      },

      // 点击过滤
      tabHandleClick(val){
        if(val.name !== 'first'){
          this.tabVal = val.name;
        }
        else {
          this.tabVal = '';
        }
        this.getSearchData();
      },
      // 编辑
      edit(index, row){
        this.popPage = true;
        // 传弹出框值
        this.popContent = row;
        this.idOrName = row.toName;
        this.dateValue = row.startTime && row.endTime ? [row.startTime, row.endTime] : '';
      },

      // 获取选中id
      getChooseId(val){
        this.checkedId = val.userAccount;
        this.idOrName = val.name;
      },

      // 日期格式化
      dateFormat(val, format){
        return dateformat.format(val, format)
      },

      checkDate(){
        this.dateValuetip = false;
        if(!this.idOrName){
          this.dateValue = ''
        }
      },

      tips(val){
        this.$message({
          message: val,
          type: 'warning'
        });
      },
    },
    components: {
      breadcrumb, sideModal
    },
  };

</script>

<style lang="scss" scoped>
  .selected>span{
    font-weight: normal;
  }
  .search-min{
    display: inline-block;
    margin-left: 10px;
    color: #999;
    font-size: 12px;
    font-weight: normal;
  }
  .alterApproval {
    .search-box {
      margin: 14px auto;
      font-size: 16px;
      color: #666666;
      vertical-align: bottom;
      width: 585px;
      input[type="button"] {
        width: 104px;
        height: 40px;
        background-color: #416DD7;
        border: 1px solid #416DD7;
        color: #fff;
        vertical-align: top;
        font-size: 16px;
      }

      .table-alt {
        .pay-check {
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 70px;
          height: 32px;
        }
      }
    }

    .contents-box {
      .shelter{
        width: 1200px;
        height: 10px;
        background-color: #fff;
        margin-left: -34px;
        margin-top: -20px;
        z-index: 200;
        position: absolute;
      }

      .select-box{
        width: 1200px;
        background-color: #FAFAFA;
        border-top:1px solid rgba(230,230,230,1);
        border-bottom:1px solid rgba(230,230,230,1);
        margin-left: -34px;
        margin-top: -5px;
        position: relative;
        padding: 5px 20px 5px 66px;
        .sel-list{
          p span{
            display: inline-block;
            width: 120px;
            line-height: 35px;
          }
          p span:hover{
            color: #416DD7;
            cursor: pointer;
          }
          .checked{
            color: #416DD7;
          }
          p.third-title{
            color: #999;
            width: 100px;
            margin-top: 8px;
          }
          p{
            margin: 0;
            vertical-align: top;
            display: inline-block;
          }
          p:last-child{
            width: 1000px;
          }
        }

      }

      .sharp-angled{
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #FAFAFA;
        transform: rotate(45deg);
        z-index: 2;
        left: 95px;
        top: -5px;
        border-left:1px solid rgba(230,230,230,1);
        border-top:1px solid rgba(230,230,230,1);
      }
    }
    .popPage {
      font-size: 16px;
      font-weight: bold;
      .time-range {
        margin-top: 42px;
        p{
          margin-bottom: 16px;
        }
      }
      .btn {
        margin-top: 50px;
        text-align: center;
      }
      .input {
        width: 310px;
        margin-top: 16px;
        margin-left: 0;
      }
      .dataTip{
        float: left;
        line-height: 20px;
        font-size: 12px;
        color: #EC3636;
        font-weight: normal;
      }
    }
    .alter{
      position: relative;
      .icon{
        position: absolute;
        right: 40px;
        top: 49px;
        z-index: 10;
        cursor: pointer;
      }
    }
  }
</style>
