<script setup lang="ts">
defineOptions({
  name: "Advertiser",
  inheritAttrs: false
});

/**
 * 导入组件依赖
 */
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, ElForm } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";
import {
  createAdvertiserApi,
  updateAdvertiserApi,
  getAdvertiserListApi,
  deleteAdvertiserApi,
  disableAdvertiserApi,
  enableAdvertiserApi
} from "@/api/advertiser";
import { CreateAdvertiserDTO, UpdateAdvertiserDTO, AdvertiserListParams, AdvertiserVO } from "@/api/advertiser/types";

const loading = ref(false);
const total = ref(0);

/**
 * 查询的参数
 */
const queryParams = reactive<AdvertiserListParams>({});

/**
 * 分页参数
 */
const pageQueryParams = reactive<PageQuery<AdvertiserListParams>>({
  page: 1,
  pageSize: 10,
  params: queryParams,
});

/**
 * 广告商列表定义
 */
const advertiserList = ref<AdvertiserVO[]>();

/**
 * 对话框相关
 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref<InstanceType<typeof ElForm>>();
const isEdit = ref(false);
const currentId = ref(0);

/**
 * 表单数据
 */
const formData = reactive<CreateAdvertiserDTO | UpdateAdvertiserDTO>({});

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getAdvertiserListApi({
    ...queryParams,
    currentPage: pageQueryParams.page,
    pageSize: pageQueryParams.pageSize
  })
    .then(({ data }) => {
      advertiserList.value = data.records;
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
    advertiserName: undefined,
    beginTime: undefined,
    endTime: undefined,
    status: undefined
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

/**
 * 打开添加对话框
 */
function handleAdd() {
  isEdit.value = false;
  dialogTitle.value = "添加广告商";
  Object.assign(formData, {});
  dialogVisible.value = true;
}

/**
 * 打开编辑对话框
 */
function handleEdit(row: AdvertiserVO) {
  isEdit.value = true;
  dialogTitle.value = "编辑广告商";
  currentId.value = row.id;
  Object.assign(formData, row);
  dialogVisible.value = true;
}

/**
 * 删除广告商
 */
function handleDelete(row: AdvertiserVO) {
  ElMessageBox.confirm(`确定要删除广告商【${row.advertiserName}】吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteAdvertiserApi(row.id)
      .then(() => {
        ElMessage.success("删除成功");
        handleQuery();
      });
  });
}

/**
 * 禁用广告商
 */
function handleDisable(row: AdvertiserVO) {
  ElMessageBox.confirm(`确定要禁用广告商【${row.advertiserName}】吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    disableAdvertiserApi(row.id)
      .then(() => {
        ElMessage.success("禁用成功");
        handleQuery();
      });
  });
}

/**
 * 启用广告商
 */
function handleEnable(row: AdvertiserVO) {
  ElMessageBox.confirm(`确定要启用广告商【${row.advertiserName}】吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    enableAdvertiserApi(row.id)
      .then(() => {
        ElMessage.success("启用成功");
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
        ? updateAdvertiserApi(formData as UpdateAdvertiserDTO)
        : createAdvertiserApi(formData as CreateAdvertiserDTO);
      
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

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="广告商名称">
          <el-input
            v-model="queryParams.advertiserName"
            placeholder="请输入广告商名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
    
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
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
        :data="advertiserList"
        highlight-current-row
        border
      >
        <el-table-column label="ID" prop="id" width="80" align="center" />
        <el-table-column label="广告商编码" prop="advertiserCode" min-width="150" />
        <el-table-column label="广告商名称" prop="advertiserName" min-width="150" />
        <el-table-column label="公司名称" prop="company" min-width="150" />
        <el-table-column label="联系人" prop="contactName" width="120" align="center" />
        <el-table-column label="联系电话" prop="contactPhone" width="150" align="center" />
        <el-table-column label="邮箱" prop="email" min-width="180" />
        <el-table-column label="状态" prop="status" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="200" align="center" />
        <el-table-column label="修改时间" prop="updateTime" width="200" align="center" />
        <el-table-column label="操作" width="240" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              <i-ep-edit />
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status === 1"
              type="warning"
              size="small"
              @click="handleDisable(scope.row)"
            >
              <i-ep-lock />
              禁用
            </el-button>
            <el-button
              v-else
              type="success"
              size="small"
              @click="handleEnable(scope.row)"
            >
              <i-ep-unlock />
              启用
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
            >
              <i-ep-delete />
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

    <!-- 添加/编辑广告商对话框 -->
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
        <el-form-item label="广告商编码" prop="advertiserCode" required>
          <el-input v-model="formData.advertiserCode" placeholder="请输入广告商编码" />
        </el-form-item>
        <el-form-item label="广告商名称" prop="advertiserName" required>
          <el-input v-model="formData.advertiserName" placeholder="请输入广告商名称" />
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="formData.company" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactName">
          <el-input v-model="formData.contactName" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱地址" />
        </el-form-item>
        <el-form-item v-if="isEdit" label="状态" prop="status" required>
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            placeholder="请输入广告商描述"
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
