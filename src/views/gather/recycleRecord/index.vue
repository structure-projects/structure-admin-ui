<script setup lang="ts">
defineOptions({
  name: "RecycleRecord",
  inheritAttrs: false
});

/**
 * 导入组件依赖
 */
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, ElForm } from 'element-plus';
import { queryRecycleRecord } from '@/api/gather';
import { RecycleRecordQuery, RecycleRecordVO } from '@/api/gather/types';

const queryFormRef = ref(ElForm);
const loading = ref(false);
const total = ref(0);

/**
 * 查询的参数
 */
const queryParams = reactive<RecycleRecordQuery>({
  beginTime: '',
  endTime: '',
  keyword: '',
  currentPage: 1,
  pageSize: 10
});

/**
 * 回收记录列表定义
 */
const recycleRecordList = ref<RecycleRecordVO[]>([]);

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  queryRecycleRecord(queryParams)
    .then((response) => {
      const data = response.data;
      recycleRecordList.value = data.records || [];
      total.value = data.total || 0;
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
  queryParams.currentPage = 1;
  handleQuery();
}

/**
 * 分页变更
 */
function handleSizeChange(newSize: number) {
  queryParams.pageSize = newSize;
  handleQuery();
}

/**
 * 页码变更
 */
function handleCurrentChange(newPage: number) {
  queryParams.currentPage = newPage;
  handleQuery();
}

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker
            v-model="queryParams.beginTime"
            type="datetime"
            placeholder="选择开始时间"
            clearable
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="queryParams.endTime"
            type="datetime"
            placeholder="选择结束时间"
            clearable
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="关键字" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入关键字"
            clearable
            @keyup.enter="handleQuery"
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
        :data="recycleRecordList"
        highlight-current-row
        border
        stripe
      >
        <el-table-column prop="gatherRecordId" label="回收记录ID" min-width="120" />
        <el-table-column prop="uid" label="用户ID" min-width="100" />
        <el-table-column prop="mid" label="会员ID" min-width="100" />
        <el-table-column prop="score" label="积分" min-width="100" />
        <el-table-column prop="showScore" label="展示积分" min-width="120" />
        <el-table-column prop="recycle" label="是否回收" min-width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.recycle" type="success">已回收</el-tag>
            <el-tag v-else type="info">未回收</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="complete" label="是否完成" min-width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.complete" type="success">已完成</el-tag>
            <el-tag v-else type="warning">未完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间" min-width="180" />
        <el-table-column prop="endTime" label="截止时间" min-width="180" />
        <el-table-column prop="sourceDescription" label="来源描述" min-width="150" />
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-if="total > 0"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page="queryParams.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryParams.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}
</style>