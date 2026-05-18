<script setup lang="ts">
defineOptions({
  name: "OperationRecord",
  inheritAttrs: false
});

/**
 * 导入组件依赖
 */
import { ref, reactive, onMounted } from "vue";
import { ElForm, ElTable, ElDatePicker, ElInput, ElButton } from "element-plus";
import type { FormInstance } from "element-plus";
import { getOperationRecordApi } from "@/api/system/operation-record";
import { OperationRecordQuery, OperationRecordVO } from "@/api/system/operation-record/types";

const queryFormRef = ref<FormInstance>();
const loading = ref(false);
const total = ref(0);

/**
 * 查询的参数
 */
const queryParams = reactive<OperationRecordQuery>({});

/**
 * 分页参数
 */
const pageQueryParams = reactive<PageQuery<OperationRecordQuery>>({
  page: 1,
  pageSize: 10,
  params: queryParams
});

/**
 * 操作记录列表定义
 */
const recordList = ref<OperationRecordVO[]>([]);

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getOperationRecordApi(pageQueryParams)
    .then(({ data }) => {
        recordList.value = data.records || [];
        total.value = Number(data.total ?? 0);
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value?.resetFields();
  pageQueryParams.page = 1;
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
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker
            v-model="queryParams.beginTime"
            type="datetime"
            placeholder="选择开始时间"
            clearable
            style="width: 200px"
             value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="queryParams.endTime"
            type="datetime"
            placeholder="选择结束时间"
            clearable
            style="width: 200px"
             value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="关键字" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入关键字"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="操作行为" prop="action">
          <el-input
            v-model="queryParams.action"
            placeholder="请输入操作行为"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery" :loading="loading">
            <i-ep-search />
            查询
          </el-button>
          <el-button @click="resetQuery">
            <i-ep-refresh />
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据列表 -->
    <el-card shadow="never" class="mt-3">
      <template #header>
        <div class="card-header">
          <span>操作记录列表</span>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="recordList"
        stripe
        border
        style="width: 100%"
        height="calc(100vh - 320px)"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <!-- <el-table-column prop="module" label="操作模块" width="120" align="center" /> -->
        <el-table-column prop="action" label="操作行为" width="150" align="center" />
        <el-table-column prop="operationUser" label="操作人" width="150" align="center" />
        <el-table-column prop="mid" label="成员ID" width="120" align="center" />
        <el-table-column prop="ipAddress" label="操作IP" width="180" align="center" />
        <el-table-column prop="operationTime" label="操作时间" width="200" align="center" />
        <el-table-column prop="costTime" label="耗时(ms)" width="120" align="center" />
        <el-table-column prop="operationParams" label="操作参数" min-width="200" show-overflow-tooltip />
        <el-table-column prop="operationResult" label="操作结果" min-width="200" show-overflow-tooltip />
        <el-table-column prop="errorMsg" label="错误信息" min-width="200" show-overflow-tooltip />
        <el-table-column prop="userAgent" label="用户代理" min-width="200" show-overflow-tooltip />
      </el-table>

      <!-- 分页组件 -->
      <pagination
        v-model:total="total"
        v-model:page="pageQueryParams.page"
        v-model:limit="pageQueryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.pagination-container {
  margin-top: 16px;
  text-align: right;
}
</style>
