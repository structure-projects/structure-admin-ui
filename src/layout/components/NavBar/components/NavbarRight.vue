<template>
  <div class="flex">
    <template v-if="device !== 'mobile'">
      <div class="setting-item" @click="toggle">
        <svg-icon :icon-class="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" />
      </div>

      <el-tooltip content="布局大小" effect="dark" placement="bottom">
        <size-select class="setting-item" />
      </el-tooltip>

      <lang-select class="setting-item" />
    </template>

    <el-dropdown class="setting-item" trigger="click">
      <div class="flex-center h100% p10px">
        <img :src="userStore.user.avatar + '?imageView2/1/w/80/h/80'" class="rounded-full mr-10px w24px w24px" />
        <span>{{ userStore.user.nickname }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <router-link to="/account">
              个人中心
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item @click="showChangePassword = true">
            修改密码
          </el-dropdown-item>
          <a target="_blank" href="https://github.com/structure-projects/structure-admin">
            <el-dropdown-item divided>项目地址</el-dropdown-item>
          </a>
          <a target="_blank" href="https://structure-admin.structured.cn">
            <el-dropdown-item>项目文档</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click="logout">
            注销登出
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <template v-if="defaultSettings.showSettings">
      <div class="setting-item" @click="settingStore.settingsVisible = true">
        <svg-icon icon-class="setting" />
      </div>
    </template>
  </div>

  <ChangePassword v-model:visible="showChangePassword" />
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  useAppStore,
  useTagsViewStore,
  useUserStore,
  useSettingsStore,
} from "@/store";
import defaultSettings from "@/settings";
import ChangePassword from "@/views/account/components/ChangePassword.vue";

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();
const settingStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

const device = computed(() => appStore.device);

const { isFullscreen, toggle } = useFullscreen();

const showChangePassword = ref(false);

/**
 * 注销
 */
function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false,
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`);
      });
  }).catch(()=>{});;
}
</script>
<style lang="scss" scoped>
.setting-item {
  display: inline-block;
  min-width: 40px;
  height: $navbar-height;
  line-height: $navbar-height;
  color: var(--el-text-color);
  text-align: center;
  cursor: pointer;

  &:hover {
    background: rgb(0 0 0 / 10%);
  }
}

.layout-top,
.layout-mix {

  .setting-item,
  .el-icon {
    color: var(--el-color-white);
  }
}

.dark .setting-item:hover {
  background: rgb(255 255 255 / 20%);
}
</style>
