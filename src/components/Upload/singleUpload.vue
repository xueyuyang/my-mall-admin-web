<template> 
  <div>
    <el-upload
      action="http://dev-api.paascloud.net:7979/opc/file/uploadSingleImg"
      :data="dataObj"
      :headers="headersObj"
      list-type="picture"
      :multiple="false" :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {policy, queryAttachmentByIdSync, queryAttachmentById} from '@/api/oss'

  export default {
    name: 'singleUpload',
    props: {
      value: String
    },
    
    watch: {
      value: {
    　　handler(newName, oldName) {
      　　if (newName != null && newName != '') {
            console.log(newName);
            queryAttachmentById(this.value).then(res => {
              console.log(res)
              if (res && res.result) {
                  this.imageName = res.result.name,
                  this.imageUrl = 'http://psb7edjec.bkt.clouddn.com/' + res.result.path + res.result.name
              }
            })
          }
    　　},
    　　immediate: true
      }
    } ,
    computed: {
      // imageUrl() {
      //   return this.value;
      // },
      // imageName() {
      //   if (this.value != null && this.value !== '') {
      //     return this.value.substr(this.value.lastIndexOf("/") + 1);
      //   } else {
      //     return null;
      //   }
      // },
      fileList() {
        if (this.imageName != null && this.imageName != ''
          && this.imageUrl != null && this.imageUrl != '') {
          return [{
            name: this.imageName,
            url: this.imageUrl
          }];
        } else {
          return [{
          }]
        }
        
      },
      showFileList: {
        get: function () {
          return this.imageUrl !== null && this.imageUrl !== ''&& this.imageUrl!==undefined;
        },
        set: function (newValue) {
        }
      },

    },
    data() {
      return {
        dataObj: {
          fileType: 'picture',
          filePath: '',
          bucketName: 'open-img-bucket',
          userId: '',
          userName: ''
        },
        headersObj: {
          Authorization: ''
        },
        dialogVisible: false,
        imageUrl: '',
        imageName: ''
      };
    },
    methods: {
      emitInput(val) {
        this.$emit('input', val)
      },
      handleRemove(file, fileList) {
        this.emitInput('');
      },
      handlePreview(file) {
        this.dialogVisible = true;
      },
      beforeUpload(file) {
        let _self = this;
        this.$store.dispatch('get_access_token', (res) => {
          if (res) {
            _self.headersObj.Authorization = 'Bearer ' + res;
          } else {
            console.log(res);
          }
          
        })
      },
      handleUploadSuccess(res, file) {
        this.showFileList = true;
        this.imageName = file.name;
        this.imageUrl = 'http://' + res.result.attachmentUrl;
        //this.fileList.pop();
        //this.fileList.push({name: file.name, url: 'http://' + res.result.attachmentUrl});
        this.emitInput(res.result.attachmentId);
      }
    }
  }
</script>
<style>

</style>


