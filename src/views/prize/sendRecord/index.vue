<script setup lang="ts">
defineOptions({
  name: "SendRecord",
  inheritAttrs: false
});

/**
 * 导入组件依赖
 */
import { ref, reactive, onMounted } from "vue";
import { ElForm } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";
import { getSendRecordApi } from "@/api/prize";
import { SendRecordParams, SenderPrizeVO } from "@/api/prize/types";

const queryFormRef = ref<InstanceType<typeof ElForm>>();
const loading = ref(false);
const total = ref(0);

/**
 * 查询的参数
 */
const queryParams = reactive<SendRecordParams>({});

/**
 * 分页参数
 */
const pageQueryParams = reactive<PageQuery<SendRecordParams>>({
  page: 1,
  pageSize: 10,
  params: queryParams,
});

/**
 * 奖品发放记录列表定义
 */
const recordList = ref<SenderPrizeVO[]>();

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getSendRecordApi(pageQueryParams)
    .then(({ data }) => {
      recordList.value = data.records;
      console.log(data);
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
  queryFormRef.value?.resetFields();
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

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="queryParams.beginTime"
            type="datetime"
            placeholder="选择开始时间"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="queryParams.endTime"
            type="datetime"
            placeholder="选择结束时间"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="关键字">
          <el-input
            v-model="queryParams.keyword"
            placeholder="奖品名称或会员ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="奖品状态">
          <el-select
            v-model="queryParams.state"
            placeholder="选择奖品状态"
            clearable
            style="width: 150px"
          >
            <el-option label="待发放" :value="1" />
            <el-option label="发放中" :value="2" />
            <el-option label="已发放" :value="3" />
            <el-option label="发放失败" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="奖品类型">
          <el-select
            v-model="queryParams.type"
            placeholder="选择奖品类型"
            clearable
            style="width: 150px"
          >
            <el-option label="系统道具" :value="1" />
            <el-option label="虚拟物品" :value="2" />
            <el-option label="实物" :value="3" />
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
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="recordList"
        highlight-current-row
        border
      >
        <el-table-column label="ID" prop="id" width="80" align="center" />
        <el-table-column label="会员ID" prop="mid" width="100" align="center" />
        <el-table-column label="奖品名称" prop="prizeName" min-width="150" />
        <el-table-column label="奖品编码" prop="prizeCode" min-width="120" />
        <el-table-column label="奖品类型" prop="type" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.type === 1" type="primary">系统道具</el-tag>
            <el-tag v-else-if="scope.row.type === 2" type="success">虚拟物品</el-tag>
            <el-tag v-else-if="scope.row.type === 3" type="warning">实物</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="奖品数量" prop="prizeNumber" width="100" align="center" />
        <el-table-column label="发放状态" prop="sendStatus" width="120" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.sendStatus === 1" type="info">待发放</el-tag>
            <el-tag v-else-if="scope.row.sendStatus === 2" type="warning">发放中</el-tag>
            <el-tag v-else-if="scope.row.sendStatus === 3" type="success">已发放</el-tag>
            <el-tag v-else-if="scope.row.sendStatus === 4" type="danger">发放失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发放时间" prop="sendTime" width="200" align="center" />
        <el-table-column label="领取时间" prop="receiveTime" width="200" align="center" />
        <el-table-column label="发放渠道" prop="channelType" width="120" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.channelType === 1" type="primary">站内通知</el-tag>
            <el-tag v-else-if="scope.row.channelType === 2" type="success">外部通知</el-tag>
            <el-tag v-else-if="scope.row.channelType === 3" type="warning">物流系统</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="自动领取" prop="auto" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.auto" type="success">是</el-tag>
            <el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发放失败原因" prop="failReason" min-width="150">
          <template #default="scope">
            <el-tooltip :content="scope.row.failReason" placement="top" :disabled="!scope.row.failReason">
              <span>{{ scope.row.failReason || '-' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" min-width="150" />
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="pageQueryParams.page"
        v-model:limit="pageQueryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>
