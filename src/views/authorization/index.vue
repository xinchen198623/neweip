<template>
  <div class="attendancePage">
    <breadcrumb :breadlist="navlist"></breadcrumb>
    <div class='content'>
      <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column
      prop="type"
      label="类型"
      width="180">
    </el-table-column>
    <el-table-column
      prop="auth"
      label="权限"
      width="180">
    </el-table-column>
    <el-table-column
      prop="staff"
      label="人员">
      <template slot-scope="scope">
        <span>{{nameList.join(', ')}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="operation"
      label="操作"
      width="180">
      <template slot-scope="scope">
        <span @click="handleEdit(scope.$index, scope.row)" class="edit-txt">编辑</span>
      </template>
    </el-table-column>
  </el-table>
  <edit :isShowEdit="showEdit" :staffList="staffList" @editFinished="showEdit=false" @nameConfirm="nameConfirm"></edit>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import * as api from '@/api/authorization'
import breadcrumb from '@/components/breadcrumb.vue'
import edit from './edit.vue'

export default {
  data () {
    return {
      staffList:[],
      navlist: [
        {
          name: '权限设置',
          path: '/authorization'
        }
      ],
      tableData:[
        {
          type: '收入证明',
          auth: '薪资查看',
          staff: [],
          operation: '操作'
        }
      ],
      showEdit: false,
      // index: 10,
      nameList: []
    }
  },
  components: {
    breadcrumb,
    edit
  },
  watch: {
    staffList: function(newVal, oldVal){
      this.tableData.staff = this.staffList
      let nameList = []
      for(let i=0;i<newVal.length;i++){
        nameList.push(newVal[i].userName)
      }
      console.log('namelist:',nameList)
      this.nameList = nameList
    }
  },
  computed: {
    // ...mapState({
    //   id: state => state.user.id
    // }),
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      // 获取人员列表
      console.log('获取人员列表')
      try {
        // console.log('fetchData')
        let data = await api.getList()
        console.log(data)
        this.staffList = data
      } catch (err){
        console.warn(err)
      }
    },
    async addStaff (data) {
      // 获取人员列表
      // console.log('添加人员',data)
      try {
        console.log('添加人员',data)
        // let generalApprovalPayPermissions = {'generalApprovalPayPermissions': data}
        // console.log('generalApprovalPayPermissions',JSON.stringify(generalApprovalPayPermissions))
        // console.log('stringify',JSON.stringify(generalApprovalPayPermissions))
        // let msg = await api.addStaff(generalApprovalPayPermissions)
        let msg = await api.addStaff(data)
        this.fetchData()
      } catch (err){
        console.warn(err)
      }
    },
    handleEdit(index, row) {
      // console.log(index,row)
      //打开右侧编辑
      this.index = index
      this.showEdit = true
    },
    nameConfirm(list){
      console.log('确认收到',list)
      this.addStaff(list)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/common.scss';
</style>
<style lang="scss" scoped>
@import '@/assets/css/common.scss';
.content {
  min-height: 500px;
}
.edit-txt {
  color: $primary;
}

</style>
