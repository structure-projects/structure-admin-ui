<template>
  <el-dialog
    v-model="visible"
    title="修改密码"
    width="400px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="80px"
      :rules="rules"
    >
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          v-model="form.oldPassword"
          type="password"
          placeholder="请输入旧密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          type="password"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请确认新密码"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { changeCurrentPassword } from "@/api/system/user";
import type { ChangePasswordDTO } from "@/api/system/user/types";
import { md5Hash } from "@/utils";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const visible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value)
});

const formRef = ref();
const loading = ref(false);

const form = reactive<{
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}>({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});

const rules = {
  oldPassword: [
    { required: true, message: "请输入旧密码", trigger: "blur" }
  ],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== form.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
};

watch(() => props.visible, (val) => {
  if (val) {
    form.oldPassword = "";
    form.newPassword = "";
    form.confirmPassword = "";
  }
});

const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      const data: ChangePasswordDTO = {
        oldPassword: md5Hash(form.oldPassword),
        newPassword: md5Hash(form.newPassword)
      };
      changeCurrentPassword(data)
        .then(() => {
          ElMessage.success("密码修改成功");
          visible.value = false;
        })
        .catch(() => {})
        .finally(() => {
          loading.value = false;
        });
    }
  });
};
</script>
