<script setup lang="ts">
defineOptions({
  name: "CampaignRecord",
  inheritAttrs: false
});

/**
 * 导入组件依赖
 */
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElForm } from "element-plus";
import {
  getCampaignRecordListApi,
  getCampaignRecordDetailApi
} from "@/api/campaign";
import { getAllCampaignCategoriesApi } from "@/api/campaign";
import {
  CampaignExecutionRecordListParams,
  CampaignExecutionRecordVO,
  CampaignCategoryVO
} from "@/api/campaign/types";

const queryFormRef = ref(ElForm);
const loading = ref(false);
const total = ref(0);

/**
 * 查询的参数
 */
const queryParams = reactive<CampaignExecutionRecordListParams>({
  currentPage: 1,
  pageSize: 10
});

/**
 * 分页参数
 */
const pageQueryParams = reactive({
  page: 1,
  pageSize: 10
});

/**
 * 活动执行记录列表定义
 */
const executionRecordList = ref<CampaignExecutionRecordVO[]>([]);

/**
 * 活动分类列表
 */
const campaignCategories = ref<CampaignCategoryVO[]>([]);

/**
 * 对话框相关
 */
const detailDialogVisible = ref(false);
const detailTitle = ref("");
const currentExecutionRecord = ref<CampaignExecutionRecordVO | null>(null);

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  const selectedCategoryId = queryParams.categoryId;
  getCampaignRecordListApi({
    ...queryParams,
    // 兼容后端可能仍使用 campaignPlanId 的场景
    campaignPlanId: queryParams.campaignPlanId ?? selectedCategoryId,
    currentPage: pageQueryParams.page,
    pageSize: pageQueryParams.pageSize
  })
    .then((response) => {
      executionRecordList.value = response.records;
      total.value = response.total;
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
    categoryId: undefined,
    campaignPlanId: undefined,
    endTime: undefined,
    keyword: undefined,
    status: undefined
  });
  pageQueryParams.page = 1;
  handleQuery();
}

/**
 * 分页变更
 */
function handlePagination(page: number, pageSize: number) {
  pageQueryParams.page = page;
  pageQueryParams.pageSize = pageSize;
  handleQuery();
}

/**
 * 查看活动记录详情
 */
function handleViewDetail(row: CampaignExecutionRecordVO) {
  loading.value = true;
  getCampaignRecordDetailApi(row.executionId)
    .then((response) => {
      currentExecutionRecord.value = response;
      detailTitle.value = `活动记录详情 - ${row.campaignName}`;
      detailDialogVisible.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 格式化执行状态
 */
function formatExecutionStatus(status: number): string {
  switch (status) {
    case 1:
      return "执行中";
    case 2:
      return "执行成功";
    case 3:
      return "执行失败";
    default:
      return "未知状态";
  }
}

/**
 * 格式化执行状态标签类型
 */
function getStatusTagType(status: number): string {
  switch (status) {
    case 1:
      return "warning";
    case 2:
      return "success";
    case 3:
      return "danger";
    default:
      return "info";
  }
}

/**
 * 加载活动分类数据
 */
function loadCampaignData() {
  // 加载活动分类
  getAllCampaignCategoriesApi().then(response => {
    const payload = response?.data ?? response ?? [];
    campaignCategories.value = Array.isArray(payload) ? payload : (payload.records ?? []);
  });
}

onMounted(() => {
  loadCampaignData();
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="search-form">
        <el-form-item label="关键字">
          <el-input
            v-model="queryParams.keyword"
            placeholder="活动名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="执行状态">
          <el-select
            v-model="queryParams.status"
            placeholder="选择执行状态"
            clearable
            style="width: 150px"
          >
            <el-option label="执行中" :value="1" />
            <el-option label="执行成功" :value="2" />
            <el-option label="执行失败" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动分类">
          <el-select
            v-model="queryParams.categoryId"
            placeholder="选择活动分类"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="category in campaignCategories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="queryParams.beginTime"
            type="datetime"
            placeholder="选择开始时间"
            clearable
            style="width: 170px"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="queryParams.endTime"
            type="datetime"
            placeholder="选择结束时间"
            clearable
            style="width: 170px"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
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
      <el-table
        v-loading="loading"
        :data="executionRecordList"
        highlight-current-row
        border
      >
        <el-table-column label="执行ID" prop="executionId" width="100" align="center" />
        <el-table-column label="活动名称" prop="campaignName" min-width="150" />
        <el-table-column label="执行时间" prop="executionTime" width="200" align="center" />
        <el-table-column label="开始时间" prop="startTime" width="200" align="center" />
        <el-table-column label="结束时间" prop="endTime" width="200" align="center" />
        <el-table-column label="执行状态" prop="executionStatus" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.executionStatus)">
              {{ formatExecutionStatus(scope.row.executionStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleViewDetail(scope.row)"
              :icon="iEp-view"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="pageQueryParams.page"
        v-model:limit="pageQueryParams.pageSize"
        @pagination="handlePagination"
      />
    </el-card>

    <!-- 执行记录详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="detailTitle"
      width="800px"
      destroy-on-close
    >
      <el-descriptions :column="1" border v-if="currentExecutionRecord">
        <el-descriptions-item label="执行ID">
          {{ currentExecutionRecord.executionId }}
        </el-descriptions-item>
        <el-descriptions-item label="活动名称">
          {{ currentExecutionRecord.campaignName }}
        </el-descriptions-item>
        <el-descriptions-item label="执行时间">
          {{ currentExecutionRecord.executionTime }}
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ currentExecutionRecord.startTime }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ currentExecutionRecord.endTime }}
        </el-descriptions-item>
        <el-descriptions-item label="执行状态">
          <el-tag :type="getStatusTagType(currentExecutionRecord.executionStatus)">
            {{ formatExecutionStatus(currentExecutionRecord.executionStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="执行参数">
          <el-input
            v-model="currentExecutionRecord.executionParams"
            type="textarea"
            :rows="5"
            readonly
            style="font-family: monospace; font-size: 12px"
          />
        </el-descriptions-item>
        <el-descriptions-item label="执行结果">
          <el-input
            v-model="currentExecutionRecord.executionResult"
            type="textarea"
            :rows="8"
            readonly
            style="font-family: monospace; font-size: 12px"
          />
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.search-form {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  overflow-x: auto;
  padding-bottom: 2px;
}

.search-form :deep(.el-form-item) {
  margin-right: 12px;
  margin-bottom: 18px;
}
</style>
