<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="菜单名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon><i-ep-search /></template>
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <template #icon><i-ep-refresh /></template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格容器 -->
    <el-card shadow="never" class="table-container">
      <template #header>
        <!-- 功能按钮 -->
        <el-button
          v-hasPerm="['sys:menu:add']"
          type="primary"
          @click="openDialog(0)"
        >
          <template #icon><i-ep-plus /></template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['sys:menu:add']"
          type="success"
          @click="handleImportStaticMenus"
        >
          <template #icon><i-ep-upload /></template>
          导入静态菜单
        </el-button>
      </template>
      <!-- 表格定义 -->
      <el-table
        v-loading="loading"
        :data="menuList"
        highlight-current-row
        row-key="id"
        :expand-row-keys="['1']"
        @row-click="onRowClick"
        :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren'
        }"
      >
        <el-table-column label="菜单名称" min-width="200">
          <template #default="scope">
            <svg-icon :icon-class="scope.row.icon" />
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column label="类型" align="center" width="80">
          <template #default="scope">
            <el-tag
              v-if="scope.row.type === MenuTypeEnum.CATALOG"
              type="warning"
            >
              目录
            </el-tag>
            <el-tag v-if="scope.row.type === MenuTypeEnum.MENU" type="success">
              菜单
            </el-tag>
            <el-tag v-if="scope.row.type === MenuTypeEnum.BUTTON" type="danger">
              按钮
            </el-tag>
            <el-tag v-if="scope.row.type === MenuTypeEnum.EXTLINK" type="info">
              外链
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="路由路径"
          align="left"
          width="150"
          prop="path"
        />

        <el-table-column
          label="组件路径"
          align="left"
          width="250"
          prop="component"
        />

        <el-table-column
          label="权限标识"
          align="center"
          width="200"
          prop="perm"
        />

        <el-table-column label="状态" align="center" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.visible" type="success">显示</el-tag>
            <el-tag v-else type="info">隐藏</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="排序" align="center" width="80" prop="sort" />

        <el-table-column fixed="right" align="center" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-if="scope.row.type == 'CATALOG' || scope.row.type == 'MENU'"
              v-hasPerm="['sys:menu:add']"
              type="primary"
              link
              size="small"
              @click.stop="openDialog(scope.row.id)"
            >
              <i-ep-plus />
              新增
            </el-button>

            <el-button
              v-hasPerm="['sys:menu:edit']"
              type="primary"
              link
              size="small"
              @click.stop="openDialog(undefined, scope.row.id)"
            >
              <i-ep-edit />
              编辑
            </el-button>
            <el-button
              v-hasPerm="['sys:menu:del']"
              type="primary"
              link
              size="small"
              @click.stop="handleDelete(scope.row.id)"
            >
              <i-ep-delete />
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      destroy-on-close
      append-to-body
      width="1000px"
      @close="closeDialog"
      top="5vh"
    >
      <el-form
        ref="menuFormRef"
        :model="formData"
        :rules="rules"
        label-width="160px"
      >
        <el-form-item label="父级菜单" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            placeholder="选择上级菜单"
            :data="menuOptions"
            filterable
            node-key="id"
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>

        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入菜单名称" />
        </el-form-item>

        <el-form-item label="功能编号" prop="code">
          <el-input v-model="formData.code" placeholder="请输入功能编号" />
        </el-form-item>

        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type" @change="onMenuTypeChange">
            <el-radio value="CATALOG">目录</el-radio>
            <el-radio value="MENU">菜单</el-radio>
            <el-radio value="BUTTON">按钮</el-radio>
            <el-radio value="EXTLINK">外链</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="formData.type == 'EXTLINK'"
          label="外链地址"
          prop="path"
        >
          <el-input v-model="formData.path" placeholder="请输入外链完整路径" />
        </el-form-item>

        <el-form-item
          v-if="
            formData.type == MenuTypeEnum.CATALOG ||
            formData.type == MenuTypeEnum.MENU
          "
          label="路由路径"
          prop="path"
        >
          <el-input
            v-if="formData.type == MenuTypeEnum.CATALOG"
            v-model="formData.path"
            placeholder="system"
          />
          <el-input v-else v-model="formData.path" placeholder="user" />
        </el-form-item>

        <!-- 组件页面完整路径 -->
        <el-form-item
          v-if="
            formData.type == MenuTypeEnum.CATALOG ||
            formData.type == MenuTypeEnum.MENU
          "
          label="前端组件"
          prop="component"
        >
          <el-input
            v-model="formData.component"
            placeholder="system/user/index"
            style="width: 95%"
          >
            <template v-if="formData.type == MenuTypeEnum.MENU" #prepend>
              src/views/
            </template>
            <template v-if="formData.type == MenuTypeEnum.MENU" #append>
              .vue
            </template>
          </el-input>
        </el-form-item>

        <el-form-item
          v-if="formData.type !== MenuTypeEnum.BUTTON"
          prop="visible"
          label="显示状态"
        >
          <el-radio-group v-model="formData.visible">
            <el-radio :value="true">显示</el-radio>
            <el-radio :value="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="formData.type === MenuTypeEnum.CATALOG"
          label="根目录始终显示"
        >
          <template #label>
            <div>
              根目录始终显示
              <el-tooltip placement="bottom" effect="light">
                <template #content>
                  是：根目录只有一个子路由显示目录
                  <br />
                  否：根目录只有一个子路由不显示目录，只显示子路由
                </template>
                <i-ep-QuestionFilled class="inline-block" />
              </el-tooltip>
            </div>
          </template>

          <el-radio-group v-model="formData.alwaysShow">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="formData.type === MenuTypeEnum.MENU"
          label="是否缓存"
        >
          <el-radio-group v-model="formData.keepAlive">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            style="width: 100px"
            controls-position="right"
            :min="0"
          />
        </el-form-item>

        <!-- 权限标识 -->
        <el-form-item
          v-if="formData.type == MenuTypeEnum.BUTTON"
          label="权限标识"
          prop="perm"
        >
          <el-input v-model="formData.perm" placeholder="sys:user:add" />
        </el-form-item>

        <el-form-item
          v-if="formData.type !== MenuTypeEnum.BUTTON"
          label="图标"
          prop="icon"
        >
          <!-- 图标选择器 -->
          <icon-select v-model="formData.icon" />
        </el-form-item>

        <el-form-item
          v-if="formData.type == MenuTypeEnum.CATALOG"
          label="跳转路由"
        >
          <el-input v-model="formData.redirect" placeholder="跳转路由" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="importSelect.visible"
      title="选择导入的静态菜单"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <el-alert
        type="info"
        :closable="false"
        title="请选择要导入的菜单，未勾选项不会导入"
        style="margin-bottom: 12px"
      />
      <el-tree
        ref="importTreeRef"
        :data="importSelect.menuTree"
        node-key="importKey"
        show-checkbox
        default-expand-all
        :default-checked-keys="importSelect.defaultCheckedKeys"
        :props="{ label: 'name', children: 'children', disabled: 'disabled' }"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleSelectAllImportMenus">全选</el-button>
          <el-button @click="handleInvertSelectImportMenus">反选</el-button>
          <el-button @click="importSelect.visible = false">取 消</el-button>
          <el-button type="primary" @click="confirmImportStaticMenus">
            开始导入
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="importProgress.visible"
      title="静态菜单导入进度"
      width="520px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-progress
        :percentage="importProgressPercentage"
        :status="importProgress.failedCount > 0 ? 'exception' : undefined"
      />
      <div style="margin-top: 12px">已完成：{{ importProgress.current }} / {{ importProgress.total }}</div>
      <div style="margin-top: 6px">当前菜单：{{ importProgress.currentName || "-" }}</div>
      <div style="margin-top: 6px">
        新增：{{ importProgress.successCount }}，合并：{{ importProgress.mergedCount }}，失败：{{ importProgress.failedCount }}
      </div>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
defineOptions({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Menu",
  inheritAttrs: false
});

import {
  MenuQuery,
  MenuForm,
  MenuVO,
  StaticMenuImportItem
} from "@/api/system/menu/types";
import {
  listMenus,
  getMenuForm,
  getMenuOptions,
  addMenu,
  deleteMenu,
  updateMenu
} from "@/api/system/menu";
import { constantRoutes } from "@/router";

import { MenuTypeEnum } from "@/enums/MenuTypeEnum";
import { RouteRecordRaw } from "vue-router";

const queryFormRef = ref(ElForm);
const menuFormRef = ref(ElForm);
const importTreeRef = ref();

const loading = ref(false);
const dialog = reactive({
  title: "",
  visible: false
});

const queryParams = reactive<MenuQuery>({});
const menuList = ref<MenuVO[]>([]);

const menuOptions = ref<OptionType[]>([]);

const formData = reactive<MenuForm>({
  parentId: "0",
  visible: 1,
  sort: 1,
  type: MenuTypeEnum.MENU,
  alwaysShow: 0,
  keepAlive: 0
});

const rules = reactive({
  parentId: [{ required: true, message: "请选择顶级菜单", trigger: "blur" }],
  code: [{ required: true, message: "请输入功能编号", trigger: "blur" }],
  name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
  path: [{ required: true, message: "请输入路由路径", trigger: "blur" }],

  component: [{ required: true, message: "请输入组件路径", trigger: "blur" }],
  visible: [{ required: true, message: "请输入路由路径", trigger: "blur" }]
});

// 选择表格的行菜单ID
const selectedRowMenuId = ref<number | undefined>();

const menuCacheData = reactive({
  type: "",
  path: ""
});

interface ImportStaticMenuItem extends StaticMenuImportItem {
  importKey: string;
  disabled?: boolean;
  children?: ImportStaticMenuItem[];
}

const importSelect = reactive({
  visible: false,
  menuTree: [] as ImportStaticMenuItem[],
  defaultCheckedKeys: [] as string[]
});

const importProgress = reactive({
  visible: false,
  total: 0,
  current: 0,
  currentName: "",
  successCount: 0,
  mergedCount: 0,
  failedCount: 0
});

const importProgressPercentage = computed(() => {
  if (!importProgress.total) {
    return 0;
  }
  return Math.min(
    100,
    Math.round((importProgress.current / importProgress.total) * 100)
  );
});

/**
 * 查询
 */
function handleQuery() {
  // 重置父组件
  loading.value = true;
  listMenus(queryParams)
    .then(({ data }) => {
      menuList.value = data;
    })
    .then(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

/**行点击事件 */
function onRowClick(row: MenuVO) {
  selectedRowMenuId.value = row.id;
}

/**
 * 打开表单弹窗
 *
 * @param parentId 父菜单ID
 * @param menuId 菜单ID
 */
function openDialog(parentId?: number, menuId?: number) {
  getMenuOptions()
    .then(({ data }) => {
      menuOptions.value = [
        { id: "0", value: "0", label: "顶级菜单", children: data }
      ];
    })
    .then(() => {
      dialog.visible = true;
      if (menuId) {
        dialog.title = "编辑菜单";
        getMenuForm(menuId).then(({ data }) => {
          Object.assign(formData, data);
          menuCacheData.type = data.type;
          menuCacheData.path = data.path ?? "";
        });
      } else {
        dialog.title = "新增菜单";
        formData.parentId = parentId + "" ?? "0";
      }
    });
}

/** 菜单类型切换事件处理 */
function onMenuTypeChange() {
  // 如果菜单类型改变，清空路由路径；未改变在切换后还原路由路径
  if (formData.type !== menuCacheData.type) {
    formData.path = "";
  } else {
    formData.path = menuCacheData.path;
  }
}

/** 菜单保存提交 */
function submitForm() {
  menuFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      const menuId = formData.id;
      if (menuId) {
        updateMenu(menuId, formData).then(() => {
          ElMessage.success("修改成功");
          closeDialog();
          handleQuery();
        });
      } else {
        addMenu(formData).then(() => {
          ElMessage.success("新增成功");
          closeDialog();
          handleQuery();
        });
      }
    }
  });
}

/** 删除菜单 */
function handleDelete(menuId: number) {
  if (!menuId) {
    ElMessage.warning("请勾选删除项");
    return false;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteMenu(menuId).then(() => {
        ElMessage.success("删除成功");
        handleQuery();
      });
    })
    .catch(() => ElMessage.info("已取消删除"));
}

/**
 * 将路由组件解析为菜单组件路径
 */
function parseComponentPath(component: unknown): string | undefined {
  if (typeof component !== "function") {
    return undefined;
  }

  const fnText = component.toString();
  const patterns = [
    /@\/views\/(.+?)\.vue/,
    /\/src\/views\/(.+?)\.vue/,
    /views\/(.+?)\.vue/
  ];

  for (const pattern of patterns) {
    const match = fnText.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return undefined;
}

/**
 * 由路由生成菜单唯一编码
 */
function buildMenuCode(route: RouteRecordRaw, fullPath: string): string {
  const source = String(route.name || fullPath || route.path || "menu");
  return source
    .replace(/[^a-zA-Z0-9/_-]/g, "")
    .replace(/[/-]/g, ":")
    .replace(/:+/g, ":")
    .replace(/^:|:$/g, "")
    .toLowerCase();
}

/**
 * 转换静态路由树为菜单导入数据
 */
function convertRoutesToMenus(
  routes: RouteRecordRaw[],
  parentPath = ""
): StaticMenuImportItem[] {
  return routes
    .filter((route) => !route.meta?.hidden)
    .map((route, index) => {
      const currentPath = route.path.startsWith("/")
        ? route.path
        : `${parentPath}/${route.path}`.replace(/\/+/g, "/");
      const children = route.children
        ? convertRoutesToMenus(route.children, currentPath)
        : [];
      const hasChildren = children.length > 0;
      const routeTitle = String(route.meta?.title || route.name || route.path);

      return {
        code: buildMenuCode(route, currentPath),
        name: routeTitle,
        type: hasChildren ? MenuTypeEnum.CATALOG : MenuTypeEnum.MENU,
        path: route.path,
        component: hasChildren ? "Layout" : parseComponentPath(route.component),
        icon: (route.meta?.icon as string) || "",
        visible: route.meta?.hidden ? 0 : 1,
        sort: index + 1,
        redirect: route.redirect ? String(route.redirect) : undefined,
        keepAlive: route.meta?.keepAlive ? 1 : 0,
        alwaysShow: route.meta?.alwaysShow ? 1 : 0,
        children: hasChildren ? children : undefined
      };
    })
    .filter((item) => item.name && item.path);
}

function countMenuItems(items: StaticMenuImportItem[]): number {
  return items.reduce((total, item) => {
    const childCount = item.children ? countMenuItems(item.children) : 0;
    return total + 1 + childCount;
  }, 0);
}

function appendImportKeys(
  items: StaticMenuImportItem[],
  parentKey = "root"
): ImportStaticMenuItem[] {
  return items.map((item, index) => {
    const importKey = `${parentKey}-${index}-${item.name}-${item.path}`;
    return {
      ...item,
      importKey,
      children: item.children ? appendImportKeys(item.children, importKey) : undefined
    };
  });
}

function collectImportKeys(items: ImportStaticMenuItem[]): string[] {
  return items.flatMap((item) => {
    const childKeys = item.children ? collectImportKeys(item.children) : [];
    return [item.importKey, ...childKeys];
  });
}

function collectSelectableImportKeys(items: ImportStaticMenuItem[]): string[] {
  return items.flatMap((item) => {
    const current = item.disabled ? [] : [item.importKey];
    const childKeys = item.children ? collectSelectableImportKeys(item.children) : [];
    return [...current, ...childKeys];
  });
}

function findMatchedMenu(
  existingMenus: MenuVO[],
  item: StaticMenuImportItem
): MenuVO | undefined {
  return existingMenus.find((menu) => {
    const samePath =
      !!menu.path &&
      !!item.path &&
      menu.path.toLowerCase() === item.path.toLowerCase();
    const sameNameAndType =
      !!menu.name &&
      !!item.name &&
      menu.name === item.name &&
      menu.type === item.type;
    return samePath || sameNameAndType;
  });
}

function markExistingMenusDisabled(
  items: ImportStaticMenuItem[],
  parentId: number | string,
  existingMenuMap: Map<string, MenuVO[]>
) {
  const existingMenus = existingMenuMap.get(String(parentId)) || [];

  items.forEach((item) => {
    const matchedMenu = findMatchedMenu(existingMenus, item);
    if (matchedMenu?.id) {
      item.disabled = true;
      if (item.children?.length) {
        markExistingMenusDisabled(item.children, matchedMenu.id, existingMenuMap);
      }
    }
  });
}

function filterCheckedImportTree(
  items: ImportStaticMenuItem[],
  checkedKeys: Set<string>
): StaticMenuImportItem[] {
  return items
    .map((item) => {
      const children = item.children
        ? filterCheckedImportTree(item.children, checkedKeys)
        : [];
      const isChecked = checkedKeys.has(item.importKey);
      if (!isChecked && children.length === 0) {
        return undefined;
      }
      return {
        code: item.code,
        name: item.name,
        type: item.type,
        path: item.path,
        component: item.component,
        icon: item.icon,
        visible: item.visible,
        sort: item.sort,
        redirect: item.redirect,
        keepAlive: item.keepAlive,
        alwaysShow: item.alwaysShow,
        children: children.length ? children : undefined
      };
    })
    .filter((item): item is StaticMenuImportItem => !!item);
}

function resetImportProgress(total: number) {
  importProgress.visible = true;
  importProgress.total = total;
  importProgress.current = 0;
  importProgress.currentName = "";
  importProgress.successCount = 0;
  importProgress.mergedCount = 0;
  importProgress.failedCount = 0;
}

function toMenuForm(item: StaticMenuImportItem, parentId: number | string): MenuForm {
  return {
    parentId: parentId + "",
    code: item.code,
    name: item.name,
    visible: item.visible,
    icon: item.icon,
    sort: item.sort,
    component: item.component,
    path: item.path,
    redirect: item.redirect,
    type: item.type,
    keepAlive: item.keepAlive ?? 0,
    alwaysShow: item.alwaysShow ?? 0
  };
}

function extractCreatedMenuId(response: any): number | undefined {
  const candidates = [
    response?.data?.id,
    response?.data?.menuId,
    response?.data,
    response?.id,
    response?.menuId
  ];

  for (const candidate of candidates) {
    const id = Number(candidate);
    if (!Number.isNaN(id) && id > 0) {
      return id;
    }
  }

  return undefined;
}

async function importMenusRecursively(
  items: StaticMenuImportItem[],
  parentId: number | string,
  existingMenuMap: Map<string, MenuVO[]>
) {
  for (const item of items) {
    importProgress.currentName = item.name;
    importProgress.current += 1;

    try {
      const existingMenus = existingMenuMap.get(String(parentId)) || [];
      const matchedMenu = findMatchedMenu(existingMenus, item);

      let currentMenuId: number | undefined = matchedMenu?.id;
      if (matchedMenu?.id) {
        importProgress.mergedCount += 1;
        if (!matchedMenu.component && item.component) {
          await updateMenu(String(matchedMenu.id), toMenuForm(item, parentId));
        }
      } else {
        const response = await addMenu(toMenuForm(item, parentId));
        currentMenuId = extractCreatedMenuId(response);
        importProgress.successCount += 1;
      }

      if (item.children?.length) {
        if (!currentMenuId) {
          throw new Error(`菜单【${item.name}】创建成功但未返回ID，无法导入子菜单`);
        }
        await importMenusRecursively(item.children, currentMenuId, existingMenuMap);
      }
    } catch (error) {
      importProgress.failedCount += 1;
      throw error;
    }
  }
}

function buildExistingMenuMap(items: MenuVO[]): Map<string, MenuVO[]> {
  const menuMap = new Map<string, MenuVO[]>();

  const walk = (menus: MenuVO[], parentId: number | string) => {
    const key = String(parentId);
    const list = menuMap.get(key) || [];
    list.push(...menus);
    menuMap.set(key, list);

    menus.forEach((menu) => {
      if (menu.id && menu.children?.length) {
        walk(menu.children, menu.id);
      }
    });
  };

  walk(items, "0");
  return menuMap;
}

/** 导入静态菜单 */
async function handleImportStaticMenus() {
  const staticMenus = convertRoutesToMenus(constantRoutes).flatMap((item) => {
    if (item.path === "/") {
      return item.children || [];
    }
    return item;
  });

  if (!staticMenus.length) {
    ElMessage.warning("未找到可导入的静态菜单");
    return;
  }

  try {
    const { data: existingMenus } = await listMenus({});
    const existingMenuMap = buildExistingMenuMap(existingMenus || []);
    const menuTree = appendImportKeys(staticMenus);
    markExistingMenusDisabled(menuTree, "0", existingMenuMap);

    importSelect.menuTree = menuTree;
    importSelect.defaultCheckedKeys = collectSelectableImportKeys(menuTree);
    importSelect.visible = true;
  } catch {
    ElMessage.error("获取现有菜单失败，请稍后重试");
  }
}

function handleSelectAllImportMenus() {
  importTreeRef.value?.setCheckedKeys(collectSelectableImportKeys(importSelect.menuTree));
}

function handleInvertSelectImportMenus() {
  const selectableKeys = collectSelectableImportKeys(importSelect.menuTree);
  const checkedKeys = new Set(
    (importTreeRef.value?.getCheckedKeys() as string[]) || []
  );
  const targetKeys = selectableKeys.filter((key) => !checkedKeys.has(key));
  importTreeRef.value?.setCheckedKeys(targetKeys);
}

async function confirmImportStaticMenus() {
  const checkedKeys = new Set(
    (importTreeRef.value?.getCheckedKeys() as string[]) || []
  );
  const selectedMenus = filterCheckedImportTree(importSelect.menuTree, checkedKeys);

  if (!selectedMenus.length) {
    ElMessage.warning("请先选择要导入的菜单");
    return;
  }

  importSelect.visible = false;
  resetImportProgress(countMenuItems(selectedMenus));

  try {
    const { data: existingMenus } = await listMenus({});
    const existingMenuMap = buildExistingMenuMap(existingMenus || []);
    await importMenusRecursively(selectedMenus, "0", existingMenuMap);
    ElMessage.success(
      `导入完成：新增 ${importProgress.successCount} 条，合并 ${importProgress.mergedCount} 条，失败 ${importProgress.failedCount} 条`
    );
    handleQuery();
  } catch (error: any) {
    ElMessage.error(error?.message || "导入中断，请检查后重试");
  } finally {
    importProgress.currentName = "";
    setTimeout(() => {
      importProgress.visible = false;
    }, 600);
  }
}

/** 关闭弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/** 重置表单 */
function resetForm() {
  menuFormRef.value.resetFields();
  menuFormRef.value.clearValidate();
  formData.id = undefined;
  formData.parentId = "0";
  formData.visible = 1;
  formData.sort = 1;
  formData.perm = undefined;
  formData.component = undefined;
  formData.path = undefined;
  formData.redirect = undefined;
  formData.alwaysShow = undefined;
  formData.keepAlive = undefined;
}

onMounted(() => {
  handleQuery();
});
</script>
