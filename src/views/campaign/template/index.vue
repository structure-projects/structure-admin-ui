<script setup lang="ts">
defineOptions({
  name: "CampaignTemplate",
  inheritAttrs: false
});

/**
 * 导入组件依赖
 */
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, ElForm } from "element-plus";
import {
  createCampaignTemplateApi,
  getCampaignTemplateDetailApi,
  updateCampaignTemplateApi,
  deleteCampaignTemplateApi,
  getEnabledCampaignTemplatesApi,
  getAllCampaignTemplatesApi
} from "@/api/campaign";
import {
  CampaignTemplateDTO,
  CampaignTemplateVO
} from "@/api/campaign/types";

const queryFormRef = ref(ElForm);
const loading = ref(false);
const total = ref(0);

/**
 * 分页参数
 */
const pageQueryParams = reactive({
  page: 1,
  pageSize: 10
});

/**
 * 活动模板列表定义
 */
const campaignTemplateList = ref<CampaignTemplateVO[]>([]);

/**
 * 对话框相关
 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref(ElForm);
const isEdit = ref(false);
const currentId = ref(0);

/**
 * 表单数据
 */
const formData = reactive({
  config: undefined,
  cycle: undefined,
  cycleUnit: undefined,
  description: undefined,
  name: undefined,
  status: 1,
  type: 1
});

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getAllCampaignTemplatesApi({
    page: pageQueryParams.page,
    pageSize: pageQueryParams.pageSize
  })
    .then((response) => {
      const payload = response?.data ?? response;
      const parsedPayload = typeof payload === "string" ? JSON.parse(payload) : payload;
      const records = parsedPayload?.records
        ?? parsedPayload?.list
        ?? parsedPayload?.items
        ?? parsedPayload?.content
        ?? (Array.isArray(parsedPayload) ? parsedPayload : []);
      const totalCount = parsedPayload?.total
        ?? parsedPayload?.totalCount
        ?? parsedPayload?.count
        ?? records.length
        ?? 0;

      campaignTemplateList.value = records;
      total.value = Number(totalCount);
    })
    .finally(() => {
      loading.value = false;
    });
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
 * 打开添加对话框
 */
function handleAdd() {
  isEdit.value = false;
  dialogTitle.value = "添加活动模板";
  Object.assign(formData, {
    config: undefined,
    cycle: undefined,
    cycleUnit: undefined,
    description: undefined,
    name: undefined,
    status: 1,
    type: 1
  });
  dialogVisible.value = true;
}

/**
 * 打开编辑对话框
 */
function handleEdit(row: CampaignTemplateVO) {
  isEdit.value = true;
  dialogTitle.value = "编辑活动模板";
  currentId.value = row.id;
  Object.assign(formData, {
    config: row.config,
    cycle: row.cycle,
    cycleUnit: row.cycleUnit,
    description: row.description,
    name: row.name,
    status: row.status,
    type: row.type
  });
  dialogVisible.value = true;
}

/**
 * 删除活动模板
 */
function handleDelete(row: CampaignTemplateVO) {
  ElMessageBox.confirm(`确定要删除活动模板【${row.name}】吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCampaignTemplateApi(row.id)
      .then(() => {
        ElMessage.success("删除成功");
        handleQuery();
      });
  });
}

/**
 * 提交表单
 */
function submitForm() {
  if (!formRef.value) return;
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      const request = isEdit.value 
        ? updateCampaignTemplateApi({ ...formData, id: currentId.value })
        : createCampaignTemplateApi(formData);
      
      request.then(() => {
        ElMessage.success(isEdit.value ? "修改成功" : "添加成功");
        dialogVisible.value = false;
        handleQuery();
      }).finally(() => {
        loading.value = false;
      });
    }
  });
}

/**
 * 格式化活动类型
 */
function formatType(type: number): string {
  switch (type) {
    case 1:
      return "一次性";
    case 2:
      return "周期性";
    default:
      return "未知类型";
  }
}

/**
 * 格式化周期单位
 */
function formatCycleUnit(unit: number): string {
  switch (unit) {
    case 1:
      return "天";
    case 2:
      return "周";
    case 3:
      return "月";
    case 4:
      return "年";
    default:
      return "未知单位";
  }
}

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="{}" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <i-ep-search />
            刷新
          </el-button>
          <el-button type="success" @click="handleAdd">
            <i-ep-plus />
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="campaignTemplateList"
        highlight-current-row
        border
      >
        <el-table-column label="ID" prop="id" width="80" align="center" />
        <el-table-column label="模板名称" prop="name" min-width="150" />
        <el-table-column label="活动类型" prop="type" width="120" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.type === 1" type="primary">{{ formatType(scope.row.type) }}</el-tag>
            <el-tag v-else type="success">{{ formatType(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="周期" width="150" align="center">
          <template #default="scope">
            <span v-if="scope.row.cycle && scope.row.cycleUnit">
              {{ scope.row.cycle }}{{ formatCycleUnit(scope.row.cycleUnit) }}
            </span>
            <span v-else>
              -</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="200" align="center" />
        <el-table-column label="更新时间" prop="updateTime" width="200" align="center" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              :icon="iEpEdit"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
              :icon="iEpDelete"
            >
              删除
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

    <!-- 添加/编辑活动模板对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        label-width="120px"
      >
        <el-form-item label="模板名称" prop="name" required>
          <el-input v-model="formData.name" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="活动类型" prop="type" required>
          <el-select v-model="formData.type" placeholder="请选择活动类型">
            <el-option label="一次性" :value="1" />
            <el-option label="周期性" :value="2" />
          </el-select>
        </el-form-item>
        <template v-if="formData.type === 2">
          <el-form-item label="周期数值" prop="cycle">
            <el-input-number v-model="formData.cycle" :min="1" :step="1" placeholder="请输入周期数值" />
          </el-form-item>
          <el-form-item label="周期单位" prop="cycleUnit">
            <el-select v-model="formData.cycleUnit" placeholder="请选择周期单位">
              <el-option label="天" :value="1" />
              <el-option label="周" :value="2" />
              <el-option label="月" :value="3" />
              <el-option label="年" :value="4" />
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="状态" prop="status" required>
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动配置JSON" prop="config">
          <el-input
            v-model="formData.config"
            placeholder="请输入活动配置JSON"
            type="textarea"
            rows="5"
            style="font-family: monospace; font-size: 12px"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            placeholder="请输入活动描述"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
