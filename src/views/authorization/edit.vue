<template>
    <!-- 每个模板定义自己的class，方便样式的隔离和控制 -->
    <div class="edit">
      <div class="modal" v-show="isShowEdit"></div>
      <div class="modal-content edit-content" :class="{ show: isShowEdit }">
        <span class="close-btn" @click="closeEdit"></span>
        <h3 class="title">编辑人员</h3>
        <div class="edit">
          <!-- <span class="addStaff">添加人员：</span> -->
          <ul class="staff-list">
            <li v-for="(item,index) in nameList" :key="index">
              <span class="name">{{ item.userName }}</span>
              <span class="delete-btn" @click="deleteName(index)"></span>
            </li>
          </ul>
        </div>
        <!-- <el-input v-model="input" placeholder="请输入内容" @keyup.enter.native="submit"></el-input> -->
        <el-select 
          v-model="curStaff" 
          v-loadmore="loadingMore" 
          filterable 
          remote 
          :remote-method="remoteMethod" 
          @change="addOption($event)" 
          :loading="loading" 
          popper-class="approver-select" 
          placeholder="输入ID/姓名" 
          no-match-text="没有搜索到相关人员" 
          no-data-text="加载中">
        <el-option
          v-for="(item, index) in optionList"
          :key="index"
          :label="item.userName"
          :value="index">
          <div>
            <span class="approver-name">{{item.userName}}</span>
            <span class="approver-depart">{{item.userId}}/{{item.userDept}}/{{item.userPost}}</span>
          </div>
        </el-option>
      </el-select>
        <el-row>
          <el-button class="button-popover" @click="closeEdit">取消</el-button>
          <el-button size="medium" type="primary" @click.native="confirm" class="button-medium-primary">确定</el-button>
        </el-row>
      </div>
    </div>
</template>

<script>
import * as api from '@/api/authorization'
export default {
  props: {
    // ruleList: {
    //   type: Object,
    //   required: true
    // }
    isShowEdit: {
      type: Boolean,
      required: true
    },
    staffList: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      nameList: [], // 编辑后成员列表
      // input: '',
      curStaff: '', // select当前选中的值
      optionList: [], // 从接口获取的员工列表
      showNum: 19, // dropdown默认可显示的审批人的数量
      loading: false,
      page: 1,
      // list:[1,2,3,4,5]
    }
  },
  computed: {
    // nameList: function(newVal,oldVal){
    //   return this.staffList
    // }
  },
  watch : {
    // staffList: function(newVal,oldVal) {
    //   console.log('staffList changed',newVal)
    //   // this.nameList = newVal
    //   this.nameList = JSON.parse(JSON.stringify(newVal))
    // }
    isShowEdit: function(newVal,oldVal) {
      console.log('isshowedit changed',newVal)
      if(newVal){
        this.nameList = JSON.parse(JSON.stringify(this.staffList))
      }
    }
  },
  mounted () {
    // console.log('mounted')
    // this.nameList = this.staffList
  },
  methods: {
    async getOptionList (name, page, limit) { // 员工搜索
      try {
        const data = await api.getOptionList(name, page, limit)
        console.log('员工列表:',data)
        // 更新员工列表的值
        this.optionList = this.handleList(data.list)
      } catch (err) {
        console.log('get data error', err)
        debuggerLog(err)
      }
    },
    handleList: function (list){
      // console.log('handle',list)
      let arr = []
      // department -> userDept
      // id -> userId
      // name -> userName
      // duty -> userPost
      for(let i=0;i<list.length;i++){
        let obj = {}
        obj.userDept = list[i].department
        obj.userId = list[i].userAccount
        obj.userName = list[i].name
        obj.userPost = list[i].duty
        arr.push(obj)
      }
      // console.log('list转换',arr)
      return arr
    },
    closeEdit () {
      this.$emit('editFinished')
      this.nameList = []
      this.curStaff = ''
    },
    // submit (e){
    //   console.log(this.curStaff)
    //   this.nameList.push(this.input)
    //   // this.input = ''
    // },
    deleteName (index) {
      // console.log('删除',index)
      this.nameList.splice(index,1)
    },
    confirm () {
      // console.log('list:',this.nameList)
      // let array = this.nameList
      this.$emit('nameConfirm',this.nameList)
      // this.nameList = []
      this.closeEdit()
    },
    remoteMethod (query) {
      // 搜索过滤
      this.showNum = 19
      console.log('调用获取员工的接口')
      if (query !== '') {
        this.getOptionList(query, this.page)
      }
    },
    loadingMore () {
      // dropdown滑动到底部更新数据
      console.log('load more')
      let newNum = this.showNum + 20
      if (newNum > this.optionList.length) {
        this.showNum = this.optionList.length
        console.log('数组长度不变')
      } else {
        this.showNum = newNum
        console.log('数组长度增加20')
      }
    },
    addOption (index) {
      // 添加审批人
      console.log('add approver',index)
      console.log(this.curStaff)
      this.nameList.push(this.optionList[index])
      this.curStaff = ''
      this.optionList.splice(index, 1)
    },
  }
}
</script>

<style lang="scss">
</style>
<style lang="scss" scoped>
  @import '@/assets/css/common.scss';
  /**制度**/
  // .edit{}
  .modal{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: rgba(0,0,0,.5);
    transition: display .5s linear;
    -moz-transition: display .5s linear;
    -webkit-transition: display .5s linear;
    -o-transition: display .5s linear;
  }
  .close-btn {
    display: block;
    position: absolute;
    right: 23px;
    top: 25px;
    height: 29px;
    width: 29px;
    background: url(../../assets/img/modal-close.png);
    background-size: 100% 100%;
  }
  .title {
    font-size: $headerSize;
    color: $major;
    line-height: 1.4;
    padding-bottom: 10px;
    border-bottom: 1px solid #EBEEF5;
    margin: 0;
  }
  .edit-content{
    position: fixed;
    top: 0;
    right: -373px;
    z-index: 101;
    width: 373px;
    height: 100%;
    padding: 50px 29px 50px 33px;
    background-color: #fff;
    overflow-y: auto;
    transition: all .3s linear;
    -moz-transition: all .3s linear;
    -webkit-transition: all .3s linear;
    -o-transition: all .3s linear;
  }
  .edit-content.show{
    right: 0;
  }
  // .addStaff {
  //   margin-bottom: 20px;
  // }
  .staff-list {
    margin-top: 26px;
    padding-left: 0;
    font-size: 0;
  }
  .staff-list li {
    position: relative;
    display: inline-block;
    min-width: 80px;
    height: 32px;
    margin-right: 14px;
    margin-bottom: 10px;
    padding: 0 29px 0 9px;
    font-size: $contentSize;
    list-style-type: none;
    background-color: rgba(236,244,255,1);
    border:1px solid rgba(216,227,255,1);
    border-radius: 2px;
  }
  .name {
    display: inline-block;
    height: 100%;
    min-width: 40px;
    color: $primary;
    line-height: 32px;
    text-align: center;
  }
  .delete-btn {
    position: absolute;
    right: 11px;
    top: 12px;
    display: inline-block;
    height: 8px;
    width: 8px;
    margin-left: 8px;
    background: url(../../assets/img/icon_close_blue.png);
    background-size: 100% 100%;
    vertical-align: middle;
  }
  .delete-btn:hover {
    right: 8px;
    top: 8px;
    display: inline-block;
    height: 15px;
    width: 15px;
    margin-left: 2px;
    background: url(../../assets/img/icon_close_circle.png);
    background-size: 100% 100%;
    vertical-align: middle;
  }
  .el-input {
    width: 310px;
    height: 40px;
    margin-top: 20px;
  }
  .el-row {
    padding: 47px 0 0 57px;
  }

  /*select*/
  .el-select{
    width: 100%;
  }
  .el-select-dropdown__item{
    height: inherit;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .approver-name{
    margin: 0;
    font-size: $contentSize;
    color: $secondary;
    line-height: 1.4;
    font-weight: normal;
  }
  .approver-depart{
    margin: 0;
    font-size: $mincontentSize;
    color: $minor;
    line-height: 1.4;
    font-weight: normal;
  }
  .approver-select .el-select-dropdown__wrap{
    max-height: 186px;
  }
</style>
