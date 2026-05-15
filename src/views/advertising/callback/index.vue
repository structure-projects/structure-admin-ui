<script setup lang="ts">
defineOptions({
  name: "AdvertisingCallback",
  inheritAttrs: false
});

/**
 * 导入组件依赖
 */
import { ref, reactive, onMounted } from "vue";
import { ElForm } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";
import {
  getAdvertisingCallbackListApi
} from "@/api/advertising";
import { AdvertisingCallbackListParams, AdvertisingCallbackVO } from "@/api/advertising/types";

const queryFormRef = ref<InstanceType<typeof ElForm>>();
const loading = ref(false);
const total = ref(0);

/**
 * 查询的参数
 */
const queryParams = reactive<AdvertisingCallbackListParams>({});

/**
 * 分页参数
 */
const pageQueryParams = reactive<PageQuery<AdvertisingCallbackListParams>>({
  page: 1,
  pageSize: 10,
  params: queryParams,
});

/**
 * 广告回调记录列表定义
 */
const callbackList = ref<AdvertisingCallbackVO[]>();

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  const { beginTime, endTime, ...restQueryParams } = queryParams;
  getAdvertisingCallbackListApi({
    ...restQueryParams,
    currentPage: pageQueryParams.page,
    pageSize: pageQueryParams.pageSize,
    beginTime,
    endTime
  })
    .then(({ data }) => {
      callbackList.value = data.records;
      total.value = Number(data.total);
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置查询
 */
function resetQuery() {
  Object.assign(queryParams, {
    beginTime: undefined,
    endTime: undefined,
    keyword: undefined,
    advertiserCode: undefined,
    callbackStatus: undefined,
    callbackType: undefined
  });
  pageQueryParams.page = 1;
  handleQuery();
}

/**
 * 分页变更
 */
function handlePagination({ page, limit }: { page: number; limit: number }) {
  pageQueryParams.page = page;
  pageQueryParams.pageSize = limit;
  handleQuery();
}

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字">
          <el-input v-model="queryParams.keyword" placeholder="广告ID/交易号" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="广告商编码">
          <el-input v-model="queryParams.advertiserCode" placeholder="广告商编码" clearable />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="queryParams.beginTime" type="datetime" placeholder="选择开始时间" clearable
            style="width: 200px" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="queryParams.endTime" type="datetime" placeholder="选择结束时间" clearable
            style="width: 200px" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <i-ep-search />
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <i-ep-refresh />
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="callbackList" highlight-current-row border>
        <el-table-column label="ID" prop="id" width="80" align="center" />
        <!-- <el-table-column label="广告ID" prop="adId" min-width="120" /> -->
        <el-table-column label="广告商编码" prop="advertiserCode" width="150" />
        <el-table-column label="回调类型" prop="callbackType" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.callbackType === 1" type="primary">展示</el-tag>
            <el-tag v-else-if="scope.row.callbackType === 2" type="success">点击</el-tag>
            <el-tag v-else type="info">{{ scope.row.callbackTypeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="回调状态" prop="callbackStatus" width="120" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.callbackStatus === 1" type="warning">待处理</el-tag>
            <el-tag v-else-if="scope.row.callbackStatus === 2" type="info">处理中</el-tag>
            <el-tag v-else-if="scope.row.callbackStatus === 3" type="success">处理完成</el-tag>
            <el-tag v-else-if="scope.row.callbackStatus === 4" type="danger">处理失败</el-tag>
            <el-tag v-else type="info">{{ scope.row.callbackStatusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="ECPM收益" prop="ecpm" width="100" align="center">
          <template #default="scope">
            {{ scope.row.ecpm }} 分
          </template>
        </el-table-column>
        <el-table-column label="用户ID" prop="uid" width="100" align="center" />
        <el-table-column label="成员ID" prop="mid" width="100" align="center" />
        <!-- <el-table-column label="IP地址" prop="ipAddress" width="150" /> -->
        <el-table-column label="交易号" prop="transactionId" min-width="150" />
        <el-table-column label="描述" prop="description" min-width="200" />
        <el-table-column label="创建时间" prop="createTime" width="200" align="center" />
      </el-table>

      <pagination v-if="total > 0" v-model:total="total" v-model:page="pageQueryParams.page"
        v-model:limit="pageQueryParams.pageSize" @pagination="handlePagination" />
    </el-card>
  </div>
</template>