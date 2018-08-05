<template>
    <!-- 每个模板定义自己的class，方便样式的隔离和控制 -->
  <div class="upload" :class="{'disabled': !isActive, 'one-must': oneFileMust, 'not-upload': !isUpload}">
    <el-upload
      ref="upload"
      class="upload-demo"
      :action="uploadUrl"
      :disabled="!isActive"
      :before-upload="beforeUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :before-remove="beforeRemove"
      :limit="3"
      :file-list="fileList"
      :auto-upload="true">
      <span class='icon-upload'></span>
      <div slot="tip" class="tip-text small-size">温馨提示：此处最多上传3个附件，如超过3个请压缩上传</div>
    </el-upload>
  </div>
</template>

<script>
// import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'upload',
  props: {
    fileList: { // 父组件传过来的文件列表
      type: Array,
      required: true
    },
    isActive: { // upload是否为disabled,默认为非disabled
      type: Boolean,
      default: function () {
        return true
      }
    },
    oneMust: { // 最少剩下一下，默认为false，不限制剩下一个文件不可删除
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {
      uploadUrl: '/api/file/upload',
      files: [],
      oneFileMust: false,
      isUpload: true, // 是否可以上传,默认为可以上传，但是可以删除
      // active: true
    }
  },
  computed: {
  },
  watch: {
    fileList: {
      handler (curVal,oldVal) {
        console.log('监控文件列表')
        console.log(curVal)
        // 删除的时候，剩下一个文件不可删除
        if (this.oneMust && curVal.length < 2) {
          console.log(curVal.length)
          console.log('文件个数小于2')
          this.oneFileMust = true
        } else {
          this.oneFileMust = false
        }
        // 如果文件个数大于等于三，不可上传
        if (curVal.length >= 3) {
          // 不可再上传固件
          this.isUpload = false
        } else {
          this.isUpload = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    beforeUpload (file) {
      // 限制上传文件大小50m
      const isLt2M = file.size / 1024 / 1024 <= 50
      const isLt30 = file.name.length <= 30

      if (!isLt2M) {
        // this.$message.error('附件大小不能超过50M')
        this.$alert('附件大小在50M以内才能上传', '附件大小不能超过50M', {
          confirmButtonText: '我知道了',
          type: 'warning',
          center: true
        })
      }

      if (!isLt30) {
        // this.$message.error('附件名称长度不能超过30字')
        this.$alert('附件名称长度在30字以内才能上传', '附件名称长度不能超过30字', {
          confirmButtonText: '我知道了',
          type: 'warning',
          center: true
        })
      }

      return isLt2M && isLt30
    },
    async handlePreview (file) {
      // 点击文件列表中已上传的文件时的钩子
      console.log('点击已上传的文件')
      console.log(file)

      // 文件下载
      console.log('下载: ', file.name)
      let link = document.createElement('a')
      link.href = `/api/file/download?fileHash=${file.fileHash}&fileName=${file.name}`
      // link.target = '_blank'
      link.download = file.name
      link.click()
    },
    beforeRemove (file, fileList) {
      // 这个验证没有问题
      console.log(fileList)
      if (file && file.status === 'success') {
        // return this.$confirm(`确定移除 ${file.name}？`)
        // 剩下一个文件不可删除
        if (fileList.length < 2 && this.oneMust) {
          return false
        }
        return this.$confirm(`${file.name}`, '删除以下附件？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: '',
          center: true
        })
      }
      return true
    },
    handleRemove (file, fileList) {
      // 文件删除时应该不用有任何动作
      console.log('文件删除触发')
      console.log(fileList)

      if (fileList.length < 2 && this.oneMust) {
        // 只剩一个文件，不可再删除
        this.oneFileMust = true
      }
      if (fileList.length < 3) {
        // 小于3个文件，可以继续上传
        this.isUpload = true
      }

      this.files = this.files.filter(val => {
        return val.fileHash !== file.fileHash
      })
      this.$emit('updateFiles', file, 'del')
    },
    handleSuccess (response, file, fileList) {
      console.log('文件上传成功触发')
      console.log(response)
      console.log(file)
      console.log(fileList)
      if (fileList.length >= 3) {
        // 文件个数为3，不能再上传文文件
        this.isUpload = false
      }
      if (fileList.length > 1) {
        // 文件个数大于1，可以删除
        this.oneFileMust = false
      }

      file.fileHash = response.data
      this.files.push(file)
      console.log('this.files', this.files)
      this.$emit('updateFiles', file, 'add')

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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
  .upload{
    width: 400px;
    /*padding: 20px;*/
    background-color: #fff;
  }
  .tip-text{
    line-height: 20px;
  }
  .colorGrey{
    color: $minor !important;
  }
  .small-size{
    font-size: 12px !important;
  }
</style>
<style>
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
    right: -20px;
  }
  .upload .el-upload-list__item .el-icon-upload-success{
    display: none;
  }
  .upload.disabled .el-upload, .upload.not-upload .el-upload{
    display: none;
    height: 0;
  }
  .upload.disabled .tip-text{
    display: none;
  }
  .el-upload-list__item .el-icon-close-tip{
    top: 7px;
    right: 0px;
  }
  .el-button--primary,.el-button--primary:focus, .el-button--primary:hover{
    background-color: #416DD7;
    border-color: #416DD7;
  }
  .upload .el-upload-list__item-name{
    display: inline;
  }
  .upload .el-upload-list__item .el-icon-close{
    opacity: 1;
  }
  .upload.one-must .el-upload-list__item .el-icon-close{
    display: none;
  }
  .upload.one-must .el-upload-list__item .el-icon-close-tip{
    display: none !important;
  }
  .el-upload-list{
    padding-right: 20px;
  }
  li.el-upload-list__item.is-success{
    overflow: hidden;
    text-overflow: ellipsis;
    width:300px;
    
  }

</style>
