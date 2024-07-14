<!-- 成员管理 -->
<script setup lang="ts">
defineOptions({
  name: "member",
  inheritAttrs: false,
});

import {
  getMemberPage,
  updateMember,
  getMemberById,
  deleteMember,
  addMember,
  updateMemberPassword,
  downloadTemplateApi,
  exportMember,
  importMember,
  updateMemberStatus
} from "@/api/system/member";
import { getDeptOptions } from "@/api/system/dept";
import { getRoleOptions } from "@/api/system/role";

import { MemberQuery, Member, MemberPageResult } from "@/api/system/member/types";
import type { UploadInstance } from "element-plus";
import { genFileId } from "element-plus";

const queryFormRef = ref(ElForm); // 查询表单
const memberFormRef = ref(ElForm); // 成员表单
const uploadRef = ref<UploadInstance>(); // 上传组件

const loading = ref(false); //  加载状态 用于分页
const removeIds = ref([]); // 删除成员ID集合 用于批量删除

const queryParams = reactive<MemberQuery>({
})

const pageQueryParams = reactive<PageQuery<MemberQuery>>({
  page: 1,
  pageSize: 10,
  params: queryParams,
});
const total = ref(0); // 数据总数
const pageData = ref<Member[]>(); // 成员分页数据
const deptList = ref<OptionType[]>(); // 部门下拉数据源
const roleList = ref<OptionType[]>(); // 角色下拉数据源

// 弹窗对象
const dialog = reactive({
  visible: false,
  type: "member-form",
  width: 1200,
  title: "",
});

// 成员表单数据
const formData = reactive<Member>({
  state: 1,
});

// 成员导入数据
const importData = reactive({
  deptId: undefined,
  file: undefined,
  fileList: [],
});

// 校验规则
const rules = reactive({
  name: [{ required: true, message: "成员名不能为空", trigger: "blur" }],
  phone: [{ required: true, message: "成员是手机号不能为空", trigger: "blur" },
  {
    pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
    message: "请输入正确的手机号码",
    trigger: "blur",
  }
  ],
  deptId: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
  roleIds: [{ required: true, message: "成员角色不能为空", trigger: "blur" }]
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  getMemberPage(pageQueryParams)
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
  queryParams.deptId = undefined;
  handleQuery();
}

/** 行选中事件 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 成员状态 Change*/
function changeMemberStatus(row: { [key: string]: any }) {
  const text = row.status === 1 ? "启用" : "停用";
  ElMessageBox.confirm("确认要" + text + row.name + "成员吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    updateMemberStatus(row.id, row.state)
      .then(() => {
        ElMessage.success(text + "成功");
      })
      .catch(() => {
        row.state = row.state === 1 ? 0 : 1;
      });
  });
}

/**重置密码 */
function resetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt(
    "请输入成员「" + row.name + "」的新密码",
    "重置密码",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    }
  )
    .then(({ value }) => {
      if (!value) {
        ElMessage.warning("请输入新密码");
        return false;
      }
      updateMemberPassword(row.id, value).then(() => {
        ElMessage.success("密码重置成功，新密码是：" + value);
      });
    })
    .catch(() => { });
}

/** 加载角色下拉数据源 */
async function loadRoleOptions() {
  getRoleOptions().then((response) => {
    roleList.value = response.data;
  });
}

/** 加载部门下拉数据源 */
async function loadDeptOptions() {
  getDeptOptions().then((response) => {
    deptList.value = response.data;
  });
}

/**
 * 打开弹窗
 *
 * @param type 弹窗类型  成员表单：member-form | 成员导入：member-import
 * @param id 成员ID
 */
async function openDialog(type: string, id?: number) {
  dialog.visible = true;
  dialog.type = type;

  if (dialog.type === "member-form") {
    // 成员表单弹窗
    await loadDeptOptions();
    await loadRoleOptions();
    if (id) {
      dialog.title = "修改成员";
      getMemberById(id)
        .then(({ data }) => {
          Object.assign(formData, { ...data });
        });
    } else {
      dialog.title = "新增成员";
    }
  } else if (dialog.type === "member-import") {
    // 成员导入弹窗
    dialog.title = "导入成员";
    dialog.width = 600;
    loadDeptOptions();
  }
}

/**
 * 关闭弹窗
 *
 * @param type 弹窗类型  成员表单：member-form | 成员导入：member-import
 */
function closeDialog() {
  dialog.visible = false;
  if (dialog.type === "member-form") {
    memberFormRef.value.resetFields();
    memberFormRef.value.clearValidate();

    formData.id = undefined;
    formData.state = 1;
  } else if (dialog.type === "member-import") {
    importData.file = undefined;
    importData.fileList = [];
  }
}

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  if (dialog.type === "member-form") {
    memberFormRef.value.validate((valid: any) => {
      if (valid) {
        const memberId = formData.id;
        loading.value = true;
        if (memberId) {
          updateMember(memberId, formData)
            .then(() => {
              ElMessage.success("修改成员成功");
              closeDialog();
              resetQuery();
            })
            .finally(() => (loading.value = false));
        } else {
          addMember(formData)
            .then(() => {
              ElMessage.success("新增成员成功");
              closeDialog();
              resetQuery();
            })
            .finally(() => (loading.value = false));
        }
      }
    });
  } else if (dialog.type === "member-import") {
    if (!importData?.deptId) {
      ElMessage.warning("请选择部门");
      return false;
    }
    if (!importData?.file) {
      ElMessage.warning("上传Excel文件不能为空");
      return false;
    }
    importMember(importData?.deptId, importData?.file).then((response) => {
      ElMessage.success(response.data);
      closeDialog();
      resetQuery();
    });
  }
}, 3000);

/** 删除成员 */
function handleDelete(id?: number) {
  const memberIds = [id || removeIds.value].join(",");
  if (!memberIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除成员?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    deleteMember(memberIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

/** 下载导入模板 */
function downloadTemplate() {
  downloadTemplateApi().then((response: any) => {
    const fileData = response.data;
    const fileName = decodeURI(
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    );
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";

    const blob = new Blob([fileData], { type: fileType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadUrl);
  });
}

/** Excel文件 Change */
function handleFileChange(file: any) {
  importData.file = file.raw;
}

/** Excel文件 Exceed  */
function handleFileExceed(files: any) {
  uploadRef.value!.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
  importData.file = file;
}

/** 导出成员 */
function handleExport() {
  exportMember(queryParams).then((response: any) => {
    const fileData = response.data;
    const fileName = decodeURI(
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    );
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";

    const blob = new Blob([fileData], { type: fileType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadUrl);
  });
}

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col :lg="4" :xs="24" class="mb-[12px]">
        <dept-tree v-model="queryParams.deptId" @node-click="handleQuery" />
      </el-col>

      <!-- 成员列表 -->
      <el-col :lg="20" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input v-model="queryParams.keywords" placeholder="成员名/手机号" clearable style="width: 200px"
                @keyup.enter="handleQuery" />
            </el-form-item>

            <el-form-item label="状态" prop="state">
              <el-select v-model="queryParams.state" placeholder="全部" clearable style="width: 200px">
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQuery"><i-ep-search />搜索</el-button>
              <el-button @click="resetQuery">
                <i-ep-refresh />
                重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div>
                <el-button v-hasPerm="['sys:member:add']" type="primary"
                  @click="openDialog('member-form')"><i-ep-plus />新增</el-button>
                <el-button v-hasPerm="['sys:member:del']" type="danger" :disabled="removeIds.length === 0"
                  @click="handleDelete()"><i-ep-delete />删除</el-button>
              </div>
              <!-- todo 隐藏导入导出 -->
              <!-- <div>
                <el-dropdown split-button>
                  导入
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="downloadTemplate">
                        <i-ep-download />下载模板</el-dropdown-item>
                      <el-dropdown-item @click="openDialog('member-import')">
                        <i-ep-top />导入数据</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button class="ml-3" @click="handleExport"><template #icon><i-ep-download /></template>导出</el-button>
              </div> -->
            </div>
          </template>

          <el-table v-loading="loading" :data="pageData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />

            <el-table-column key="name" label="成员名" align="center" prop="name" />

            <el-table-column label="性别" width="100" align="center" prop="sex" />

            <el-table-column label="部门" width="120" align="center" prop="deptName" />
            <el-table-column label="手机号码" align="center" prop="phone" width="120" />

            <el-table-column label="状态" align="center" prop="state">
              <template #default="scope">
                <el-switch v-model="scope.row.state" :inactive-value="0" :active-value="1"
                  @change="changeMemberStatus(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button v-hasPerm="['sys:member:reset_pwd']" type="primary" size="small" link
                  @click="resetPassword(scope.row)"><i-ep-refresh-left />重置密码</el-button>

                <el-button v-hasPerm="['sys:member:edit']" type="primary" link size="small"
                  @click="openDialog('member-form', scope.row.id)"><i-ep-edit />编辑</el-button>
                <el-button v-hasPerm="['sys:member:del']" type="primary" link size="small"
                  @click="handleDelete(scope.row.id)"><i-ep-delete />删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-if="total > 0" v-model:total="total" v-model:page="pageQueryParams.page"
            v-model:limit="pageQueryParams.pageSize" @pagination="handleQuery" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" :width="dialog.width" append-to-body @close="closeDialog">
      <!-- 成员新增/编辑表单 -->
      <el-form v-if="dialog.type === 'member-form'" ref="memberFormRef" :model="formData" :rules="rules"
        label-width="80px">
        <el-form-item label="成员名" prop="name">
          <el-input v-model="formData.name" :readonly="!!formData.id" placeholder="请输入成员名" />
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号码" maxlength="11" />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId">
          <el-tree-select v-model="formData.deptId" placeholder="请选择所属部门" :data="deptList" filterable check-strictly
            :render-after-expand="false" />
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <dictionary v-model="formData.sex" type-code="sex" />
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>


        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="formData.state">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!-- 成员导入表单 -->
      <el-form v-else-if="dialog.type === 'member-import'" :model="importData" label-width="100px">
        <el-form-item label="部门">
          <el-tree-select v-model="importData.deptId" placeholder="请选择部门" :data="deptList" filterable check-strictly />
        </el-form-item>

        <el-form-item label="Excel文件">
          <el-upload ref="uploadRef" action="" drag
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :limit="1" :auto-upload="false" :file-list="importData.fileList" :on-change="handleFileChange"
            :on-exceed="handleFileExceed">
            <el-icon class="el-icon--upload">
              <i-ep-upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <template #tip>
              <div>xls/xlsx files</div>
            </template>
          </el-upload>
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
