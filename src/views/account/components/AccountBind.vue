<template>
    <div>
        <el-form :model="formData" label-width="auto">
            <el-row class="bind-row">
                <el-col :span="4">
                    <span>钉钉：</span>
                </el-col>
                <el-col :span="8">
                    <span>weixinhao</span>
                </el-col>
                <el-col :span="10">
                    <el-button type="primary" @click="onSubmit('dingding')">绑定</el-button>
                </el-col>
            </el-row>
            <el-row class="bind-row">
                <el-col :span="4">
                    <span>微信：</span>
                </el-col>
                <el-col :span="8">
                    <span>weixinhao</span>
                </el-col>
                <el-col :span="10">
                    <el-button type="primary" @click="onSubmit('wechat')">绑定</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
const formData = reactive({
    name: '',
})
const onSubmit = (type: string) => {
    console.log('submit!' + type)
}
</script>
<style>
.bind-row {
    padding-top: 10px;
    padding-bottom: 10px;
    font-weight: 500;
    color: rgba(65, 64, 64, 0.85);
    margin-bottom: 12px;
}
</style>