<template>
  <div class="vacation">
    <breadcrumb :breadlist="navlist"></breadcrumb>
    <div class='content clearfix'>
      <div class="content-box">
        <div class='float-left leftblock' ref="leftblock">
          <el-button type="text" @click="centerDialogVisible = true">
            <el-button type='primary'  :disabled='disable' :class="['button-second', 'topbutton', {'button-disabled': canDrawback}]">{{cancel}}</el-button>
          </el-button>
          <el-dialog
            :visible.sync="centerDialogVisible " 
            width="390px"
            center>
            <p class="vacationApply">撤回休假申请？</p>
            <span slot="footer" class="dialog-footer">
              <el-button  @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" class="cancel" @click="enter()">确 定</el-button>
            </span>
          </el-dialog>

          <div class='emphasis-text'  ref="text">{{text}}</div>
        </div>
        <div class='float-right rightblock'>
          <div :class="['item-with-line','item-with-icon', 'first-item-with-line', {'icon_check':detailData.status==='AA'},{'icon_graypoint':detailData.status==='BB'}]">
            <div class='listitem'>
              <div class='title'><span>{{detailData.name}}</span><span>休假申请({{detailData.day}})</span></div>
              <div>类型：{{detailData.type}}</div>
              <div>原因：{{detailData.reason}}</div>
              <div>时间：{{detailData.leadCardDate}}</div>
              <div>工作交接人：{{detailData.handover}}</div>
              <div ref="disabled">附件：
                <!-- <el-upload
                  class="upload-demo" 
                  ref="upload"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  :auto-upload="false"
                  :disabled='upload_disable'>
                </el-upload> -->
                <!-- <upload @:updatefileList="updatefileList($event)" :file-list="fileList"></upload> -->
                <!-- <div slot="tip" class="el-upload__tip">温馨提示：此处最多上传3个附件，如超过3个请压缩上传</div> -->
                  <div class="upload">
                    <el-upload
                      ref="upload"
                      class="upload-demo"
                      :action="uploadUrl"
                      :before-upload="beforeUpload"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :limit="3"
                      :file-list="fileList"
                      :auto-upload="true">
                      <span class='icon-upload'></span>
                      <div slot="tip" class="tip-text">温馨提示：此处最多上传3个附件，如超过3个请压缩上传</div>
                    </el-upload>
                  </div>
              </div>
            </div>
          </div>
          <div :class="['item-with-line','item-with-icon', {'last-item-with-line': index === detailData.approverModels.length - 1}, {'icon_graypoint': approver.status === 'C'}, {'icon_check': approver.status==='A'},{'icon_point': approver.status==='B'}, {'icon_alert': approver.status==='D'}]"
            v-for="(approver, index) in detailData.approverModels" :key='index'>
            <div class='listitem'>
              <div class='title'> <span>{{approver.approver.name}}</span><span>{{approver.statusStr}}</span></div>
              <div v-show='approver.status === "A"'>{{new Date(approver.auditDate)}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb.vue'
import upload from '@/components/upload.vue'
import * as api from '@/api/punchClock.js'

export default {
  data: function () {
    return {
      navlist: [
        {
          name: '漏打卡申请',
          path: '/'
        },
        {
          name: '我的申请',
          path: '/'
        },
        {
          name: '休假详情',
          path: '/'
      }],
      detailData: {},
      DialogVisibl: false,
      centerDialogVisible: false,
      disable: true,
      upload_disable:false,
      cancel:'撤回',
      text:'第一个审批人审批之前，可以撤回申请',
      canDrawback:true,
      uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
      fileList: [{name: '中国人民武装部队证明文件.rar', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},{name: 'food2.rar', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},{name: 'food3.doc', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    }
  },
  computed: {
    // canDrawback: function() {
    //   let canBeback = true;
    //   canBeback = this.detailData && this.detailData.approverModels && this.detailData.approverModels[0] && this.detailData.approverModels[0].status != 'C';  //不是待审批状态，都不可编辑操作
    //   return canBeback
    // }
  },
  components: {
    breadcrumb,
    upload
  },
  mounted () {
    this.getDetailList();   
  },
  methods: {
    async getDetailList() {
      try {
        this.detailData  = await api.getDetailData();
          if(this.detailData && this.detailData.approverModels && this.detailData.approverModels[0] && this.detailData.approverModels[0].status === 'A'){//第一审批人已批准
             this.upload_disable=true;//点击后附件不可编辑
             this.$refs.leftblock.style.display='none';//左侧区不显示
          };
          if(this.detailData && this.detailData.approverModels && this.detailData.approverModels[0] && this.detailData.approverModels[0].status === 'B'){//第一审批人审批中
             this.upload_disable=true;//点击后附件不可编辑
             this.$refs.leftblock.style.display='none';//左侧区不显示
          };
          if(this.detailData && this.detailData.approverModels && this.detailData.approverModels[0] && this.detailData.approverModels[0].status === 'C'){//第一审批人待审批
            this.disable=false;  //第一审批人待审批，按钮可操作
            this.canDrawback=false;//第一审批人待审批，按钮高亮
          };
          if(this.detailData && this.detailData.approverModels && this.detailData.approverModels[0] && this.detailData.approverModels[0].status === 'D'){ //第一审批人已拒绝，全部置灰，不可编辑
             this.upload_disable=true;
             this.detailData.status='BB';//用户头像置灰,如果第一审批人拒绝，后面的审批人自然是没审批，默认全灰
             this.$refs.text.style.color="#CCCCCC";//第一审批人拒绝后,字体置灰
             console.log(this.detailData.status);
             console.log(this.detailData.approverModels);
            //  console.log(this.detailData.approverModels[0].status);
            //     this.detailData.approverModels.forEach(function (x,i) {
            //       console.log(i)
            //     })
          }
      
      } catch (err) {
        debuglog(err)
      }
    },
     beforeUpload (file) {
      // 限制上传文件大小2m
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handlePreview (file) {
      // 点击文件列表中已上传的文件时的钩子
      console.log('点击已上传的文件')
      console.log(file)
      // 文件下载 : 目前暂用这种方式   // 也许要通过后台调一下接口来实现
      let link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      link.click()
    },
    handleRemove (file, fileList) {
      // 文件删除时应该不用有任何动作
      return this.$confirm(`删除以下附件？        ${file.name}`)
    },
     handleSuccess (response, file, fileList) {
      console.log('文件上传成功触发')
      console.log(response)
      console.log(file)
      console.log(fileList)
      // 例子里面默认的是传完之后默认添加到filelist里面，不知道现在的接口是不是需要处理
      this.$message({
        message: '文件' + file.name + '上传成功',
        type: 'success'
      })
    },
    handleError (err, file, fileList) {
      // 文件上传失败时的钩子
      console.log(err)
      this.$message.error('上传失败，请重新上传')
    },
    handleExceed (files, fileList) {
      // 文件超出个数限制时的钩子
      this.$message({
        message: '最多只能上传3个文件',
        type: 'warning'
      })
    },
    enter(){
      if(this.detailData && this.detailData.approverModels && this.detailData.approverModels[0] && this.detailData.approverModels[0].status === 'C'){  //第一审批人待审批
          // this.$router.push('/');
          console.log(123);
          console.log(this.$route.params.id);
          this.cancel="已撤回";//点击后，变成已撤回
          this.canDrawback=true;//点击后，变成灰色
          this.disable=true;//点击后按钮不可编辑
          this.upload_disable=true;//点击后附件不可编辑
          // this.$refs.text.style.color="#CCCCCC";//点击后，字体置灰
          this.detailData.status='BB';//用户头像置灰,如果第一审批人待审批，后面的审批人自然是没审批，默认全灰
          this.centerDialogVisible = false;//对话框隐藏
          this.$refs.disabled.disabled = true;//附件不可编辑
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
.listitem {
  line-height: 35px;
  padding-bottom: 30px;
  font-size: $contentSize;

  div {
    span:first-child {
      padding-right: 15px;
    }
  }

  .title {
    font-size: $subtitleSize;
  }
}
.content-box {
  width: 750px;
  margin-top: 50px;
  .leftblock {
    width: 40%;
    text-align: right;
    padding-right: 40px;
  }
  .rightblock {
    width: 60%;
    margin-top: 10px;
  }
}
.topbutton {
  margin-bottom: 30px;
}
.el-upload__tip{
  color:#F39C12;
  margin-top: -62px;
  margin-left: 52px;
}
.vacationApply{
  font-size:20px;
  color:#333333;
  text-align: center;
}
.dialog-footer .el-button{
  width:87px;
  height:36px;
  line-height: 0px;
}
.cancel{
  background-color: $primary;
}
.upload{
    width: 400px;
    /*padding: 20px;*/
    background-color: #fff;
  }
  
</style>

<style>
.el-message-box{
    width:390px !important;
    height:217px !important;
    box-sizing: border-box;
  }
.el-message-box__message p{
  text-align: center;
  font-size:18px;
  font-color:#333333;
}
.el-message-box__btns {
  text-align:center;
  margin-top: 40px;
  padding-top: 34px;
}
.el-message-box__btns  button{
  width:87px;
  height:36px;
  line-height: 0px;
}
.el-message-box__btns button:nth-child(2){
  background-color: #FC5252;
}
.upload .el-upload{
    display: block;
    text-align: left;
    height: 45px;
  }
  .el-upload-list__item.is-success .el-upload-list__item-name:focus,
  .el-upload-list__item.is-success .el-upload-list__item-name:hover{
    color: #416DD7;
  }
  .upload .el-upload-list__item .el-icon-close{
    display: inline-block;
    background-color: #FC5252;
    border-radius: 100%;
    color: #fff;
    transform: scale(.75);
    font-size: 12px;
    line-height: 16px;
    width: 16px;
    text-align: center;
    top: 4px;
    right: 4px;
  }
  .upload .el-upload-list__item .el-icon-upload-success{
    display: none;
  }
</style>
