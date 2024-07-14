<template>
  <div class="app-container">
    <div class="page-header-index-wide page-header-wrapper-grid-content-main">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card v-loading="loading">
            <template #header>
              <div class="account-center-avatarHolder">
                <div class="avatar">
                  <img :src="userDetail.avatar">
                </div>
                <div class="username">{{ userDetail.nickname }}</div>
                <div class="intro">{{ userDetail.intro }}</div>
              </div>

              <purse-account v-if="capitalAccount" :data="capitalAccount" />

              <div class="account-center-detail">
                <el-divider />
                <p><el-icon>
                    <Iphone />
                  </el-icon>
                  <span>{{ userDetail.phone }}</span>
                </p>
                <p><el-icon>
                    <Message />
                  </el-icon>
                  <span>{{ userDetail.email }}</span>
                </p>
                <p> <svg-icon icon-class='tree' />
                  <span>{{ deptInfo }}</span>
                </p>
                <p>
                  <svg-icon icon-class="role" />
                  <span>
                    <el-tag v-for="tag in userDetail.role " :key="tag" :disable-transitions="false">
                      {{ tag.label }}
                    </el-tag>
                  </span>
                </p>
              </div>
              <user-tag />
              <team v-if="teams" :teams="teams" />
            </template>
          </el-card>
        </el-col>
        <el-col :span="18">
          <el-card v-loading="loading" style=" padding: '16px 0';max-width: 100% ; height: 100%">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="基本设置" name="basic-setting"><basic-setting /></el-tab-pane>
              <el-tab-pane label="帐号绑定" name="bind"><account-bind /></el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  useUserStore
} from "@/store";
import { getUserDetailApi } from '@/api/system/user'
import { getMemberDeptTree } from '@/api/system/member'
import type { UserDetail } from '@/api/system/user/types'
import type { TabsPaneContext } from 'element-plus'
import { Purse } from './components/PurseAccount.vue'
import { TeamData } from './components/Team.vue'
const userStore = useUserStore()
const loading = ref(false);
const deptInfo = ref<string>('');
const userDetail = ref<UserDetail>({});
const capitalAccount = ref<Purse>();
const teams = ref<TeamData[]>();
const activeName = ref('basic-setting')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  // console.log(tab, event)
}

function handleGetUserInfo() {
  loading.value = true;
  getUserDetailApi()
    .then((data) => {
      userDetail.value = data.data;
    }).finally(() => {
      loading.value = false;
    });
  getMemberDeptTree(userStore.user.id)
    .then((data) => {
      deptInfo.value = data.data;
    }).finally(() => {
    });
}
onMounted(() => {
  handleGetUserInfo();
});

</script>

<style>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  p {
    color: rgba(73, 72, 72, 0.85);
  }

  p span {
    padding-left: 10px;
  }

  .intro {
    color: rgba(73, 72, 72, 0.85);
  }

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    &>.avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;

      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }
  }
}
</style>
