<template>
    <div>
        <el-form v-loading="loading" :model="userDetail" label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="昵称">
                        <el-input v-model="userDetail.nickname" placeholder="请输入昵称" />
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <dictionary v-model="userDetail.sex" type-code="sex" />
                    </el-form-item>
                    <el-form-item label="电话" prop="phone">
                        <el-input v-model="userDetail.phone" placeholder="请输入电话号码" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="userDetail.email" placeholder="请输入邮箱" />
                    </el-form-item>
                    <el-form-item label="简介" prop="intro">
                        <el-input v-model="userDetail.intro" type="textarea" placeholder="请输入简介"
                            :autosize="{ minRows: 4, maxRows: 6 }" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="">
                        <single-upload v-model="userDetail.avatar" class="avatar-uploader" />
                    </el-form-item>
                </el-col>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">更新设置</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { UserDetail } from '@/api/system/user/types'
import { getUserDetailApi, changeCurrent } from '@/api/system/user'
const loading = ref(false);
const userDetail = ref<UserDetail>({
})

const onSubmit = () => {
    changeCurrent(userDetail.value)
        .then(() => {
        }).finally(() => {
        });
}
function handleGetUserInfo() {
    loading.value = true;
    getUserDetailApi()
        .then((data) => {
            userDetail.value = data.data;
        }).finally(() => {
            loading.value = false;
        });
}
onMounted(() => {
    handleGetUserInfo();
});
</script>
<style scoped>
.avatar-uploader {
    position: relative;
    top: 10px;
    left: 100px;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;

}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>