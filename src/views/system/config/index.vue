<script setup lang="ts">
defineOptions({
  name: "Config",
  inheritAttrs: false,
});

/**
 * 导入组件依赖
 */
import {
  getConfigPage,
  updateConfig,
  geConfigById,
  addConfig,
  deleteConfig
} from "@/api/system/config";

import { ConfigQuery, Config, ConfigPageResult } from "@/api/system/config/types";

const queryFormRef = ref(ElForm);
const configFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

/**
 * 查询的参数
 */
const queryParams = reactive<ConfigQuery>({
})

/**
 * 分页参数
 */
const pageQueryParams = reactive<PageQuery<ConfigQuery>>({
  page: 1,
  pageSize: 10,
  params: queryParams
});
/**
 * 配置列表定义
 */
const configList = ref<Config[]>();

/**
 * dialog 数据定义
 */
const dialog = reactive<DialogType>({
  visible: false,
});

/**
 * 表单数据定义
 */
const formData = reactive<Config>({
});

const rules = reactive({
  key: [{ required: true, message: "请输入配置编码", trigger: "blur" }],
  value: [{ required: true, message: "请输入配置值", trigger: "blur" }],
});

const menuDialogVisible = ref(false);

const menuList = ref<OptionType[]>([]);

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getConfigPage(pageQueryParams)
    .then(({ data }) => {
      configList.value = data.records;
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
  queryFormRef.value.resetFields();
  pageQueryParams.page = 1;
  handleQuery();
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 打开配置表单弹窗
 *
 * @param configId
 */
function openDialog(configId?: number) {
  dialog.visible = true;
  if (configId) {
    dialog.title = "修改配置";
    geConfigById(configId).then(({ data }) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增配置";
  }
}

/**
 * 配置表单提交
 */
function handleSubmit() {
  configFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const configId = formData.id;
      if (configId) {
        updateConfig(configId, formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addConfig(formData)
          .then(() => {
            ElMessage.success("新增成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/**
 * 关闭弹窗
 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/**
 * 重置表单
 */
function resetForm() {
  configFormRef.value.resetFields();
  configFormRef.value.clearValidate();

  formData.id = undefined;
}

/**
 * 删除
 */
function handleDelete(configId?: number) {
  const configIds = [configId || ids.value].join(",");
  if (!configIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    deleteConfig(configIds)
      .then(() => {
        ElMessage.success("删除成功");
        resetQuery();
      })
      .finally(() => (loading.value = false));
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
        <el-form-item prop="keywords" label="关键字">
          <el-input v-model="queryParams.keywords" placeholder="配置名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery"><i-ep-search />搜索</el-button>
          <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <template #header>
        <el-button type="primary" @click="openDialog()"><i-ep-plus />新增</el-button>
        <el-button type="danger" :disabled="ids.length === 0" @click="handleDelete()"><i-ep-delete />删除</el-button>
      </template>

      <el-table ref="dataTableRef" v-loading="loading" :data="configList" highlight-current-row border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="配置编码" prop="key" min-width="100" />
        <el-table-column label="配置值" prop="value" width="150" />

        <el-table-column label="描述" prop="remark" align="center" width="150" />

        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="small" link @click="openDialog(scope.row.id)">
              <i-ep-edit />编辑
            </el-button>
            <el-button type="primary" size="small" link @click="handleDelete(scope.row.id)">
              <i-ep-delete />删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-if="total > 0" v-model:total="total" v-model:page="pageQueryParams.page"
        v-model:limit="pageQueryParams.pageSize" @pagination="handleQuery" />
    </el-card>

    <!-- 配置表单弹窗 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" @close="closeDialog">
      <el-form ref="configFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="配置编码" prop="key">
          <el-input v-model="formData.key" placeholder="请输入配置编码" />
        </el-form-item>

        <el-form-item label="配置值" prop="value">
          <el-input v-model="formData.value" placeholder="请输入配置值" />
        </el-form-item>

        <el-form-item label="配置描述" prop="remark">
          <el-input v-model="formData.remark" type="textarea" placeholder="配置描述"
            :autosize="{ minRows: 2, maxRows: 4 }" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
