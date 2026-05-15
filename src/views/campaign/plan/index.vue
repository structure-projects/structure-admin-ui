<script setup lang="ts">
defineOptions({
  name: "CampaignPlan",
  inheritAttrs: false
});

/**
 * 导入组件依赖
 */
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, ElForm } from "element-plus";
import {
  createCampaignPlanApi,
  getCampaignPlanListApi,
  getCampaignPlanDetailApi,
  updateCampaignPlanApi,
  startCampaignPlanApi,
  endCampaignPlanApi,
  cancelCampaignPlanApi
} from "@/api/campaign";
import { getAllCampaignCategoriesApi } from "@/api/campaign";
import { getEnabledCampaignTemplatesApi } from "@/api/campaign";
import {
  CampaignPlanListParams,
  CampaignPlanVO,
  CampaignCategoryVO,
  CampaignTemplateVO
} from "@/api/campaign/types";

const queryFormRef = ref(ElForm);
const loading = ref(false);
const total = ref(0);

/**
 * 查询的参数
 */
const queryParams = reactive<CampaignPlanListParams>({
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
 * 活动计划列表定义
 */
const campaignPlanList = ref<CampaignPlanVO[]>([]);

/**
 * 活动分类列表
 */
const campaignCategories = ref<CampaignCategoryVO[]>([]);

/**
 * 活动模板列表
 */
const campaignTemplates = ref<CampaignTemplateVO[]>([]);

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
  categoryId: undefined,
  cycle: undefined,
  cycleUnit: undefined,
  description: undefined,
  endTime: undefined,
  name: undefined,
  startTime: undefined,
  templateId: undefined,
  type: 1
});

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getCampaignPlanListApi({
    ...queryParams,
    page: pageQueryParams.page,
    current: pageQueryParams.page,
    currentPage: pageQueryParams.page,
    pageNum: pageQueryParams.page,
    size: pageQueryParams.pageSize,
    pageSize: pageQueryParams.pageSize
  })
    .then((response) => {
      const payload = response?.data ?? response;
      const records = payload?.records ?? (Array.isArray(payload) ? payload : []);
      const totalCount = payload?.total ?? records.length ?? 0;

      campaignPlanList.value = records;
      total.value = Number(totalCount);
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
    categoryId: undefined,
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
 * 选择活动模板后同步类型和周期配置
 */
function handleTemplateChange(templateId: number | undefined) {
  if (!templateId) {
    formData.type = 1;
    formData.cycle = undefined;
    formData.cycleUnit = undefined;
    return;
  }
  const selectedTemplate = campaignTemplates.value.find(item => item.id === templateId);
  if (!selectedTemplate) {
    return;
  }
  formData.type = selectedTemplate.type ?? 1;
  if (formData.type === 2) {
    formData.cycle = selectedTemplate.cycle ?? undefined;
    formData.cycleUnit = selectedTemplate.cycleUnit ?? undefined;
  } else {
    formData.cycle = undefined;
    formData.cycleUnit = undefined;
  }
}

/**
 * 打开添加对话框
 */
function handleAdd() {
  isEdit.value = false;
  dialogTitle.value = "添加活动计划";
  Object.assign(formData, {
    categoryId: undefined,
    cycle: undefined,
    cycleUnit: undefined,
    description: undefined,
    endTime: undefined,
    name: undefined,
    startTime: undefined,
    templateId: undefined,
    type: 1
  });
  dialogVisible.value = true;
}

/**
 * 打开编辑对话框
 */
function handleEdit(row: CampaignPlanVO) {
  isEdit.value = true;
  dialogTitle.value = "编辑活动计划";
  currentId.value = row.id;
  loading.value = true;
  getCampaignPlanDetailApi(row.id)
    .then((response) => {
      const detail = response?.data ?? response ?? row;
      const startTime = detail?.startTime ?? detail?.beginTime ?? row.startTime ?? row.beginTime;
      Object.assign(formData, {
        categoryId: detail?.categoryId ?? row.categoryId,
        cycle: detail?.cycle ?? row.cycle,
        cycleUnit: detail?.cycleUnit ?? row.cycleUnit,
        description: detail?.description ?? row.description,
        endTime: detail?.endTime ?? row.endTime,
        name: detail?.name ?? row.name,
        startTime,
        templateId: detail?.templateId ?? row.templateId,
        type: detail?.type ?? row.type ?? 1
      });
      dialogVisible.value = true;
    })
    .catch(() => {
      const startTime = row.startTime ?? row.beginTime;
      Object.assign(formData, {
        categoryId: row.categoryId,
        cycle: row.cycle,
        cycleUnit: row.cycleUnit,
        description: row.description,
        endTime: row.endTime,
        name: row.name,
        startTime,
        templateId: row.templateId,
        type: row.type ?? 1
      });
      dialogVisible.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 启动活动计划
 */
function handleStart(row: CampaignPlanVO) {
  ElMessageBox.confirm(`确定要启动活动计划【${row.name}】吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info"
  }).then(() => {
    startCampaignPlanApi(row.id)
      .then(() => {
        ElMessage.success("启动成功");
        handleQuery();
      });
  });
}

/**
 * 结束活动计划
 */
function handleEnd(row: CampaignPlanVO) {
  ElMessageBox.confirm(`确定要结束活动计划【${row.name}】吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    endCampaignPlanApi(row.id)
      .then(() => {
        ElMessage.success("结束成功");
        handleQuery();
      });
  });
}

/**
 * 取消活动计划
 */
function handleCancel(row: CampaignPlanVO) {
  ElMessageBox.confirm(`确定要取消活动计划【${row.name}】吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    cancelCampaignPlanApi(row.id)
      .then(() => {
        ElMessage.success("取消成功");
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
      const submitData = {
        ...formData,
        // 避免向后端传 null，未选择时改为 undefined（序列化时会被忽略）
        startTime: formData.startTime ?? undefined,
        beginTime: formData.startTime ?? undefined,
        endTime: formData.endTime ?? undefined,
        cycle: formData.type === 2 ? formData.cycle ?? undefined : undefined,
        cycleUnit: formData.type === 2 ? formData.cycleUnit ?? undefined : undefined
      };
      const request = isEdit.value
        ? updateCampaignPlanApi({ ...submitData, id: currentId.value })
        : createCampaignPlanApi(submitData);
      
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
 * 加载活动分类和模板数据
 */
function loadCampaignData() {
  // 加载活动分类
  getAllCampaignCategoriesApi().then(response => {
    campaignCategories.value = response?.data ?? response ?? [];
  });
  
  // 加载启用的活动模板
  getEnabledCampaignTemplatesApi().then(response => {
    campaignTemplates.value = response?.data ?? response ?? [];
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
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字">
          <el-input
            v-model="queryParams.keyword"
            placeholder="活动名称"
            clearable
            style="width: 140px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="活动分类">
          <el-select
            v-model="queryParams.categoryId"
            placeholder="选择活动分类"
            clearable
            style="width: 120px"
          >
            <el-option
              v-for="category in campaignCategories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select
            v-model="queryParams.status"
            placeholder="选择活动状态"
            clearable
            style="width: 120px"
          >
            <el-option label="未开始" :value="1" />
            <el-option label="进行中" :value="2" />
            <el-option label="已结束" :value="3" />
            <el-option label="已取消" :value="4" />
          </el-select>
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
        :data="campaignPlanList"
        highlight-current-row
        border
      >
        <el-table-column label="ID" prop="id" width="80" align="center" />
        <el-table-column label="活动名称" prop="name" min-width="150" />
        <el-table-column label="活动分类" prop="categoryName" width="120" align="center">
          <template #default="scope">
            <el-tag type="primary">{{ scope.row.categoryName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" width="200" align="center">
          <template #default="scope">
            {{ scope.row.startTime || scope.row.beginTime || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" prop="endTime" width="200" align="center" />
        <el-table-column label="状态" prop="status" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="info">未开始</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">进行中</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="warning">已结束</el-tag>
            <el-tag v-else-if="scope.row.status === 4" type="danger">已取消</el-tag>
            <el-tag v-else type="info">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="200" align="center" />
        <el-table-column label="操作" width="240" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              :disabled="scope.row.status === 2"
              :icon="iEpEdit"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status === 1"
              type="success"
              size="small"
              @click="handleStart(scope.row)"
              :icon="iEp-video-play"
            >
              启动
            </el-button>
            <el-button
              v-else-if="scope.row.status === 2"
              type="warning"
              size="small"
              @click="handleEnd(scope.row)"
              :icon="iEp-stop"
            >
              结束
            </el-button>
            <el-button
              v-if="scope.row.status === 1"
              type="danger"
              size="small"
              @click="handleCancel(scope.row)"
            >
              取消
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

    <!-- 添加/编辑活动计划对话框 -->
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
        <el-form-item label="活动名称" prop="name" required>
          <el-input v-model="formData.name" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="活动分类" prop="categoryId" required>
          <el-select v-model="formData.categoryId" placeholder="请选择活动分类">
            <el-option
              v-for="category in campaignCategories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动模板" prop="templateId" required>
          <el-select v-model="formData.templateId" placeholder="请选择活动模板" @change="handleTemplateChange">
            <el-option
              v-for="template in campaignTemplates"
              :key="template.id"
              :label="template.name"
              :value="template.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动类型" prop="type" required>
          <el-select v-model="formData.type" placeholder="请选择活动类型" style="width: 100%">
            <el-option label="一次性" :value="1" />
            <el-option label="周期性" :value="2" />
          </el-select>
        </el-form-item>
        <template v-if="formData.type === 2">
          <el-form-item label="活动周期数值" prop="cycle">
            <el-input-number v-model="formData.cycle" :min="1" :step="1" placeholder="请输入周期数值" style="width: 100%" />
          </el-form-item>
          <el-form-item label="周期单位" prop="cycleUnit">
            <el-select v-model="formData.cycleUnit" placeholder="请选择周期单位" style="width: 100%">
              <el-option label="天" :value="1" />
              <el-option label="周" :value="2" />
              <el-option label="月" :value="3" />
              <el-option label="年" :value="4" />
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="开始时间" prop="startTime" required>
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime" required>
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
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
