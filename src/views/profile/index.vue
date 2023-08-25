<template>
  <div class="app-container">
    <el-upload
      class="avatar-uploader"
      action="/api/file/upload"
      :headers="headers"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :props-http="propsHttp"
    >
      <img v-if="user.photo" :src="user.photo" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <el-row :gutter="12">
      <el-col :span="8">姓名：</el-col>
      <el-col :span="16">{{ user.nickName }}</el-col>
      <el-col :span="8">电话：</el-col>
      <el-col :span="16">{{ user.phone }}</el-col>
      <el-col :span="8">用户名：</el-col>
      <el-col :span="16">{{ user.username }}</el-col>
      <el-col :span="8">邮箱：</el-col>
      <el-col :span="16">{{ user.email }}</el-col>
      <el-col :span="8">角色：</el-col>
      <el-col :span="16">
        <el-tag v-for="role in user.roles" :key="role.id">{{ role.name }}</el-tag>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { changeProfile, getInfo } from '@/api/user'
export default {
  name: 'Profile',
  data() {
    return {
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      propsHttp: {
        url: 'url',
        name: 'name',
        res: 'data'
      },
      user: {
      }
    }
  },
  computed: {
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      getInfo().then((res) => {
        this.user = res.data
      })
    },
    handleAvatarSuccess(res, file) {
      // todo 上传文件到文件服务器
      // todo 修改当前用户的头像地址
      this.user.photo = URL.createObjectURL(file.raw)
      console.log(res)
      const photo = res.data.url
      changeProfile({
        photo: photo
      }).then((res) => {

      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style>
.app-container {
  margin: auto;
  width: 30%;
}

.el-col {
  padding: 10px;
  color: #606266;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
