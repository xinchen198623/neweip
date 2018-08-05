<template scope>
  <!-- 每个模板定义自己的class，方便样式的隔离和控制 -->
  <div class="approver-com">
    <transition-group tag="div" v-if="addedApproverList.length>0" class="item-with-line item-with-icon icon_min">
    <div v-for="(item, index) in addedApproverList" style="display:inline-block;margin-right: 40px;margin-bottom:10px;"
         :key="index"
         draggable="true"
         @dragstart="handleDragStart($event, item)"
         @dragover.prevent="handleDragOver($event, item)"
         @dragenter="handleDragEnter($event, item)"
         @dragend="handleDragEnd($event, item)">
      <el-popover
        placement="right"
        width="180"
        trigger="click"
        ref="popover">
        <p>删除审批人"{{item.name}}"？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="hidePopover(index)">取消</el-button>
          <el-button type="primary" style="background-color: #D0021B;" size="mini" @click="delApprover(index)">删除</el-button>
        </div>
        <span class="approver-item" slot="reference">{{item.name}}</span>
      </el-popover>
    </div>
    </transition-group>
    <div class="item-with-line item-with-icon icon_plus" :class="{'last-item-with-line': isLast}">
      <el-form-item label="添加审批人">
        <span class="icon_info"></span>
        <el-select v-model="curApprover" v-loadmore="loadingMore" filterable remote :remote-method="remoteMethod" @change="addApprover($event)" :loading="loading" popper-class="approver-select" placeholder="添加审批人" no-match-text="没有搜索到相关人员" no-data-text="暂无审批人信息">
          <el-option
            v-for="(item, index) in approverList"
            v-if="index<=showNum"
            :key="index"
            :label="item.name"
            :value="index">
            <h3 class="approver-name">{{item.name}}（{{item.duty}}）</h3>
            <h4 class="approver-depart">{{item.department}}</h4>
          </el-option>
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import * as api from '../api/punchClock'

export default {
  props: ['isLast'],
  data: function () {
    return {
      loading: false,
      dragging: null,
      curApprover: '', // select当前选中的值
      showNum: 19, // dropdown默认可显示的审批人的数量
      approverList: [], // 从接口获取的审批人列表
      addedApproverList: [] // 已添加审批人
      // page: 1
    }
  },
  watch: {
    addedApproverList: { // 监控已添加审批人列表，并回传给父组件
      handler (curVal, oldVal) {
        this.$emit('updateApproverList', curVal)
        // console.log(curVal)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async getApproverList (name, page, limit) { // 员工搜索
      try {
        const data = await api.getApprover(name, page, limit)
        console.log(data)
        // 更新员工列表的值
        this.approverList = data.data.list
      } catch (err) {
        console.log('get data error', err)
      }
    },
    delApprover (index) {
      // 删除审批人
      // this.approverList.push(this.addedApproverList[index])
      this.$refs['popover'][index].doClose() // 隐藏popover
      this.addedApproverList.splice(index, 1)
    },
    addApprover (value) {
      // 添加审批人
      this.addedApproverList.push(this.approverList[value])
      // this.approverList.splice(value, 1)
    },
    remoteMethod (query) {
      // 搜索过滤
      this.showNum = 19
      if (query !== '') {
        this.getApproverList(query, this.page)
      }
    },
    loadingMore () {
      // dropdown滑动到底部更新数据
      let newNum = this.showNum + 20
      if (newNum > this.approverList.length) {
        this.showNum = this.approverList.length
        console.log('数组长度')
      } else {
        this.showNum = newNum
        console.log('增加20')
      }
    },
    hidePopover (index) {
      // 关闭popover
      this.$refs['popover'][index].doClose()
    },
    // 拖动效果
    handleDragStart (e, item) {
      this.dragging = item
    },
    handleDragEnd (e, item) {
      this.dragging = null
    },
    // 首先把div变成可以放置的元素，即重写dragenter/dragover
    handleDragOver (e) {
      e.dataTransfer.dropEffect = 'move'// e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragEnter (e, item) {
      e.dataTransfer.effectAllowed = 'move' // 为需要移动的元素设置dragstart事件
      if (item === this.dragging) {
        return
      }
      const newItems = [...this.addedApproverList]
      console.log(newItems)
      const src = newItems.indexOf(this.dragging)
      const dst = newItems.indexOf(item)

      newItems.splice(dst, 0, ...newItems.splice(src, 1))

      this.addedApproverList = newItems
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
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
  /**添加的审批人样式**/
  .item-with-line{
    min-height: 50px;
  }
  .approver-item{
    display: inline-block;
    margin-top: 10px;
    font-size: $contentSize;
    color: $primary;
  }
</style>
<style>
  .approver-select .el-select-dropdown__wrap{
    max-height: 186px;
  }
</style>
