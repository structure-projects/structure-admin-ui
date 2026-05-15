<!-- 用户管理 -->
<script setup lang="ts">
defineOptions({
  name: "user",
  inheritAttrs: false
});

import {
  getUserPage,
  updateUser,
  getUserById,
  deleteUser,
  addUser,
  updateUserPassword
} from "@/api/system/user";
import { getRoleOptions } from "@/api/system/role";

import {
  UserQuery,
  UserForm,
  UserPageVO,
  UserPageResult
} from "@/api/system/user/types";
import type { UploadInstance } from "element-plus";
import { genFileId } from "element-plus";

const queryFormRef = ref(ElForm); // 查询表单
const userFormRef = ref(ElForm); // 用户表单
const uploadRef = ref<UploadInstance>(); // 上传组件

const loading = ref(false); //  加载状态 用于分页
const removeIds = ref([]); // 删除用户ID集合 用于批量删除

const queryParams = reactive<UserQuery>({});

const pageQueryParams = reactive<PageQuery<UserQuery>>({
  currentPage: 1,
  page: 1,
  pageSize: 10,
  params: queryParams
});
const total = ref(0); // 数据总数
const pageData = ref<UserPageVO[]>(); // 用户分页数据
const roleList = ref<OptionType[]>(); // 角色下拉数据源

// 弹窗对象
const dialog = reactive({
  visible: false,
  type: "user-form",
  width: 1200,
  title: ""
});

// 用户表单数据
const formData = reactive<UserForm>({
  // status: 1
});

// 用户导入数据
const importData = reactive({
  deptId: undefined,
  file: undefined,
  fileList: []
});

// 校验规则
const rules = reactive({
  name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  phone: [
    { required: true, message: "用户是手机号不能为空", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ],
  deptId: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
  roleIds: [{ required: true, message: "用户角色不能为空", trigger: "blur" }]
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  getUserPage(pageQueryParams)
    .then(({ data }) => {
      pageData.value = data.records;
      total.value = Number(data.total);
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  pageQueryParams.page = 1;
  handleQuery();
}

/** 行选中事件 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/**重置密码 */
function resetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt("请输入用户「" + row.name + "」的新密码", "重置密码", {
    confirmButtonText: "确定",
    cancelButtonText: "取消"
  })
    .then(({ value }) => {
      if (!value) {
        ElMessage.warning("请输入新密码");
        return false;
      }
      updateUserPassword(row.id, value).then(() => {
        ElMessage.success("密码重置成功，新密码是：" + value);
      });
    })
    .catch(() => {});
}

/** 加载角色下拉数据源 */
async function loadRoleOptions() {
  getRoleOptions().then(response => {
    roleList.value = response.data;
  });
}

/**
 * 打开弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 * @param id 用户ID
 */
async function openDialog(type: string, id?: number) {
  dialog.visible = true;
  dialog.type = type;

  if (dialog.type === "user-form") {
    // 用户表单弹窗
    await loadRoleOptions();
    if (id) {
      dialog.title = "修改用户";
      getUserById(id).then(({ data }) => {
        Object.assign(formData, { ...data });
      });
    } else {
      dialog.title = "新增用户";
    }
  } else if (dialog.type === "user-import") {
    // 用户导入弹窗
    dialog.title = "导入用户";
    dialog.width = 600;
  }
}

/**
 * 关闭弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 */
function closeDialog() {
  dialog.visible = false;
  if (dialog.type === "user-form") {
    userFormRef.value.resetFields();
    userFormRef.value.clearValidate();

    formData.id = undefined;
    // formData.status = 1;
  } else if (dialog.type === "user-import") {
    importData.file = undefined;
    importData.fileList = [];
  }
}

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  if (dialog.type === "user-form") {
    userFormRef.value.validate((valid: any) => {
      if (valid) {
        const userId = formData.id;
        loading.value = true;
        if (userId) {
          updateUser(userId, formData)
            .then(() => {
              ElMessage.success("修改用户成功");
              closeDialog();
              resetQuery();
            })
            .finally(() => (loading.value = false));
        } else {
          addUser(formData)
            .then(() => {
              ElMessage.success("新增用户成功");
              closeDialog();
              resetQuery();
            })
            .finally(() => (loading.value = false));
        }
      }
    });
  }
}, 3000);

/** 删除用户 */
function handleDelete(id?: number) {
  const userIds = [id || removeIds.value].join(",");
  if (!userIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function () {
    deleteUser(userIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <!-- 用户列表 -->
    <div class="search-container">
      <el-form
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
        class="query-form"
      >
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="用户名/手机号"
            clearable
            class="query-keywords"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="是否启用" prop="enabled">
          <el-select
            v-model="queryParams.enabled"
            placeholder="全部"
            clearable
            class="query-select"
          >
            <el-option label="启用" value="true" />
            <el-option label="禁用" value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否锁定" prop="unlocked">
          <el-select
            v-model="queryParams.unlocked"
            placeholder="全部"
            clearable
            class="query-select"
          >
            <el-option label="未锁定" value="true" />
            <el-option label="已锁定" value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否过期" prop="unexpired">
          <el-select
            v-model="queryParams.unexpired"
            placeholder="全部"
            clearable
            class="query-select"
          >
            <el-option label="未过期" value="true" />
            <el-option label="已过期" value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <dictionary
            clearable
            class="query-select"
            v-model="formData.sex"
            type-code="sex"
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
      <template #header>
        <div class="flex justify-between">
          <div>
            <el-button
              v-hasPerm="['sys:user:add']"
              type="primary"
              @click="openDialog('user-form')"
            >
              <i-ep-plus />
              新增
            </el-button>
            <el-button
              v-hasPerm="['sys:user:del']"
              type="danger"
              :disabled="removeIds.length === 0"
              @click="handleDelete()"
            >
              <i-ep-delete />
              删除
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="pageData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />

        <el-table-column
          key="name"
          label="用户名"
          align="center"
          prop="username"
        />

        <el-table-column
          label="手机号码"
          align="center"
          prop="phone"
          width="120"
        />
        <el-table-column key="name" label="邮箱" align="center" prop="email" />

        <el-table-column label="性别" width="100" align="center" prop="sex" />

        <el-table-column
          label="是否启用"
          align="center"
          prop="enabled"
          width="120"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.enabled"
              :inactive-value="0"
              :active-value="1"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="是否锁定"
          align="center"
          prop="unlocked"
          width="120"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.unlocked"
              :inactive-value="0"
              :active-value="1"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="是否过期"
          align="center"
          prop="unexpired"
          width="120"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.unexpired"
              :inactive-value="0"
              :active-value="1"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="注册时间"
          align="center"
          prop="createTime"
          width="240"
        />
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="scope">
            <!--   v-hasPerm="['sys:user:reset_pwd']" -->
            <el-button
              v-hasPerm="['sys:user:reset_pwd']"
              type="primary"
              size="small"
              link
              @click="resetPassword(scope.row)"
            >
              <i-ep-refresh-left />
              重置密码
            </el-button>

            <el-button
              v-hasPerm="['sys:user:edit']"
              type="primary"
              link
              size="small"
              @click="openDialog('user-form', scope.row.id)"
            >
              <i-ep-edit />
              编辑
            </el-button>
            <el-button
              v-hasPerm="['sys:user:del']"
              type="primary"
              link
              size="small"
              @click="handleDelete(scope.row.id)"
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

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      :width="dialog.width"
      append-to-body
      @close="closeDialog"
    >
      <!-- 用户新增/编辑表单 -->
      <el-form
        v-if="dialog.type === 'user-form'"
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            :readonly="!!formData.id"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入电子邮箱" />
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <dictionary v-model="formData.sex" type-code="sex" />
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 弹窗底部操作按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.query-form :deep(.el-form-item) {
  margin-right: 12px;
}

.query-keywords {
  width: 220px;
}

.query-select {
  width: 120px;
}
</style>
