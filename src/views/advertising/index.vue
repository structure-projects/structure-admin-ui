<script setup lang="ts">
defineOptions({
  name: "Advertising",
  inheritAttrs: false
});

/**
 * 导入组件依赖
 */
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, ElForm } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";
import {
  addAdvertisingApi,
  getAdvertisingListApi,
  getAdvertisingApi,
  updateAdvertisingApi,
  deleteAdvertisingApi
} from "@/api/advertising";
import { AdvertisingDTO, AdvertisingListParams, AdvertisingVO } from "@/api/advertising/types";

const queryFormRef = ref<InstanceType<typeof ElForm>>();
const loading = ref(false);
const total = ref(0);

/**
 * 查询的参数
 */
const queryParams = reactive<AdvertisingListParams>({});

/**
 * 分页参数
 */
const pageQueryParams = reactive<PageQuery<AdvertisingListParams>>({
  page: 1,
  pageSize: 10,
  params: queryParams,
});

/**
 * 广告列表定义
 */
const advertisingList = ref<AdvertisingVO[]>();

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
const formData = reactive<AdvertisingDTO>({});

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getAdvertisingListApi({
    ...queryParams,
    currentPage: pageQueryParams.page,
    pageSize: pageQueryParams.pageSize
  })
    .then(({ data }) => {
      advertisingList.value = data.records;
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
  dialogTitle.value = "添加广告";
  Object.assign(formData, {});
  dialogVisible.value = true;
}

/**
 * 打开编辑对话框
 */
function handleEdit(row: AdvertisingVO) {
  isEdit.value = true;
  dialogTitle.value = "编辑广告";
  currentId.value = row.id;
  Object.assign(formData, row);
  dialogVisible.value = true;
}

/**
 * 删除广告
 */
function handleDelete(row: AdvertisingVO) {
  ElMessageBox.confirm(`确定要删除广告【${row.adName}】吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteAdvertisingApi(row.id)
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
        ? updateAdvertisingApi(currentId.value, formData)
        : addAdvertisingApi(formData);
      
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
  
        <el-form-item label="关键字">
          <el-input
            v-model="queryParams.keyword"
            placeholder="广告名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="广告状态">
          <el-select
            v-model="queryParams.status"
            placeholder="选择广告状态"
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
        :data="advertisingList"
        highlight-current-row
        border
      >
        <el-table-column label="ID" prop="id" width="80" align="center" />
        <el-table-column label="广告名称" prop="adName" min-width="150" />
        <el-table-column label="广告位置" prop="adPlaceCode" width="150" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.adPlaceCode === 'welcome'" type="primary">欢迎页</el-tag>
            <el-tag v-else-if="scope.row.adPlaceCode === 'index_banner'" type="success">首页Banner</el-tag>
            <el-tag v-else-if="scope.row.adPlaceCode === 'index'" type="warning">首页平铺</el-tag>
            <el-tag v-else type="info">{{ scope.row.adPlaceCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="广告类型" prop="adType" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.adType === 1" type="primary">图片</el-tag>
            <el-tag v-else-if="scope.row.adType === 2" type="success">视频</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="链接类型" prop="linkType" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.linkType === 0" type="info">无跳转</el-tag>
            <el-tag v-else-if="scope.row.linkType === 1" type="primary">站内</el-tag>
            <el-tag v-else-if="scope.row.linkType === 2" type="success">站外</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" width="200" align="center" />
        <el-table-column label="结束时间" prop="endTime" width="200" align="center" />
        <el-table-column label="排序" prop="sort" width="80" align="center" />
        <el-table-column label="操作" width="180" align="center">
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
        @pagination="handleQuery"
      />
    </el-card>

    <!-- 添加/编辑广告对话框 -->
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
        <el-form-item label="广告名称" prop="adName" required>
          <el-input v-model="formData.adName" placeholder="请输入广告名称" />
        </el-form-item>
        <el-form-item label="广告位置" prop="adPlaceCode" required>
          <el-select v-model="formData.adPlaceCode" placeholder="请选择广告位置">
            <el-option label="欢迎页" value="welcome" />
            <el-option label="首页Banner" value="index_banner" />
            <el-option label="首页平铺" value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="广告类型" prop="adType" required>
          <el-select v-model="formData.adType" placeholder="请选择广告类型">
            <el-option label="图片" :value="1" />
            <el-option label="视频" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="链接类型" prop="linkType" required>
          <el-select v-model="formData.linkType" placeholder="请选择链接类型">
            <el-option label="无跳转" :value="0" />
            <el-option label="站内" :value="1" />
            <el-option label="站外" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源地址" prop="resourcesUrl" required>
          <el-input v-model="formData.resourcesUrl" placeholder="请输入资源地址" />
        </el-form-item>
        <el-form-item label="目标URL" v-if="formData.linkType === 2">
          <el-input v-model="formData.targetUrl" placeholder="请输入目标URL" />
        </el-form-item>
        <el-form-item label="站内标识" v-if="formData.linkType === 1">
          <el-input v-model="formData.targetId" placeholder="请输入站内标识" />
        </el-form-item>
        <el-form-item label="站内模块" v-if="formData.linkType === 1">
          <el-input v-model="formData.targetModuleName" placeholder="请输入站内模块" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status" required>
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            placeholder="请输入广告描述"
            type="textarea"
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
