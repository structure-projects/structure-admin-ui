<script setup lang="ts">
defineOptions({
  name: "CampaignCategory",
  inheritAttrs: false
});

/**
 * 导入组件依赖
 */
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, ElForm } from "element-plus";
import { View, Delete, Search, Plus } from "@element-plus/icons-vue";
import {
  createCampaignCategoryApi,
  deleteCampaignCategoryApi,
  getAllCampaignCategoriesApi
} from "@/api/campaign";
import {
  CampaignCategoryVO,
  CampaignCategoryResult
} from "@/api/campaign/types";

const loading = ref(false);

/**
 * 活动分类列表定义
 */
const campaignCategoryList = ref<CampaignCategoryResult>([]);

/**
 * 对话框相关
 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref(ElForm);
const isView = ref(false);

/**
 * 表单数据
 */
const formData = reactive({
  code: "",
  description: "",
  name: ""
});

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getAllCampaignCategoriesApi()
    .then((response) => {
      campaignCategoryList.value = response.data;
    })
    .catch((error) => {
      ElMessage.error(error.message || '获取活动分类列表失败');
    })
    .finally(() => {
      loading.value = false;
    });
}



/**
 * 打开添加对话框
 */
function handleAdd() {
  isView.value = false;
  dialogTitle.value = "添加活动分类";
  Object.assign(formData, {
    code: "",
    description: "",
    name: ""
  });
  dialogVisible.value = true;
}

/**
 * 打开查看对话框
 */
function handleView(row: CampaignCategoryVO) {
  isView.value = true;
  dialogTitle.value = "查看活动分类";
  Object.assign(formData, {
    code: row.code,
    description: row.description,
    name: row.name
  });
  dialogVisible.value = true;
}

/**
 * 删除活动分类
 */
function handleDelete(row: CampaignCategoryVO) {
  ElMessageBox.confirm(`确定要删除活动分类【${row.name}】吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCampaignCategoryApi(row.id)
      .then(() => {
        ElMessage.success("删除成功");
        handleQuery();
      })
      .catch((error) => {
        ElMessage.error(error.message || '删除活动分类失败');
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
      createCampaignCategoryApi(formData)
        .then(() => {
          ElMessage.success("添加成功");
          dialogVisible.value = false;
          handleQuery();
        })
        .catch((error) => {
          ElMessage.error(error.message || '添加活动分类失败');
        })
        .finally(() => {
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
      <el-form ref="queryFormRef" :model="{}" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <Search />
            刷新
          </el-button>
          <el-button type="success" @click="handleAdd">
            <Plus />
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="campaignCategoryList" highlight-current-row border>
        <el-table-column label="ID" prop="id" width="80" align="center" />
        <el-table-column label="分类名称" prop="name" min-width="150" />
        <el-table-column label="分类编码" prop="code" min-width="150" />
        <el-table-column label="描述" prop="description" min-width="200" />
        <el-table-column label="创建时间" prop="createTime" width="200" align="center" />
        <el-table-column label="更新时间" prop="updateTime" width="200" align="center" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)" :icon="View">
              查看
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)" :icon="Delete">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>


    </el-card>

    <!-- 添加/编辑活动分类对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" destroy-on-close>
      <el-form ref="formRef" :model="formData" label-width="120px">
        <el-form-item label="分类名称" prop="name" required>
          <el-input v-model="formData.name" placeholder="请输入分类名称" :disabled="isView" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code" required>
          <el-input v-model="formData.code" placeholder="请输入分类编码" :disabled="isView" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" placeholder="请输入分类描述" type="textarea" :rows="3" :disabled="isView" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="!isView" type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>