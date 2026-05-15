<template>
  <div class="dashboard-container">
    <el-card shadow="never" class="welcome-card dashboard-card">
      <div class="welcome-content">
        <div>
          <h2 class="welcome-title">{{ greetings }}</h2>
          <p class="welcome-desc">今日关键数据总览（可直接替换为接口数据）</p>
        </div>
        <div class="update-panel">
          <p class="update-tip">提示：数据更新为次日1点更新</p>
          <el-tag type="info">更新时间：{{ updateTime }}</el-tag>
        </div>
      </div>
    </el-card>

    <el-row :gutter="12" class="mt-3">
      <el-col v-for="(item, index) in overviewCards" :key="item.title" :xs="24" :sm="12" :lg="6">
        <el-card
          shadow="never"
          class="metric-card dashboard-card"
          :style="`--accent-color: ${item.accent}`"
        >
          <div class="metric-header">
            <span>{{ item.title }}</span>
            <el-tag :type="item.tagType">{{ item.tag }}</el-tag>
          </div>
          <div class="metric-value">{{ formatNumber(animatedOverviewValues[index] || 0) }}</div>
          <div class="metric-footer">
            <span>较昨日</span>
            <span :class="item.trend >= 0 ? 'up' : 'down'">
              {{ item.trend >= 0 ? "+" : "" }}{{ item.trend }}%
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="mt-3">
      <el-col :xs="24" :lg="12">
        <el-card shadow="never" class="section-card dashboard-card">
          <template #header>
            <div class="section-title">账户管理概括</div>
          </template>
          <div class="kv-grid">
            <div v-for="item in accountSummary" :key="item.label" class="kv-item">
              <span class="label">{{ item.label }}</span>
              <span class="value">{{ formatNumber(item.value) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card shadow="never" class="section-card dashboard-card">
          <template #header>
            <div class="section-title">流量与会员增长</div>
          </template>
          <div class="kv-grid">
            <div v-for="item in trafficSummary" :key="item.label" class="kv-item">
              <span class="label">{{ item.label }}</span>
              <span class="value">{{ formatNumber(item.value) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="mt-3">
      <el-col :xs="24" :lg="12">
        <el-card shadow="never" class="section-card dashboard-card">
          <template #header>
            <div class="section-title">广告曝光回调统计</div>
          </template>
          <div class="ad-chart-wrap">
            <div ref="adPieRef" class="ad-pie"></div>
            <div class="ad-legend">
              <div v-for="item in adExposureData" :key="item.name" class="ad-legend-item">
                <div class="left">
                  <span class="dot" :style="{ backgroundColor: item.color }"></span>
                  <span>{{ item.name }}</span>
                </div>
                <div class="right">
                  {{ formatNumber(item.value) }} ({{ calcAdPercent(item.value) }}%)
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card shadow="never" class="section-card dashboard-card">
          <template #header>
            <div class="section-title">奖励发放统计</div>
          </template>
          <div class="reward-chart-wrap">
            <div ref="rewardPieRef" class="reward-pie"></div>
            <div class="reward-legend">
              <div v-for="item in rewardProps" :key="item.name" class="reward-legend-item">
                <div class="left">
                  <span class="dot" :style="{ backgroundColor: item.color }"></span>
                  <span>{{ item.name }}</span>
                </div>
                <div class="right">
                  {{ formatNumber(item.value) }} ({{ calcPercent(item.value) }}%)
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="mt-3">
      <el-col :xs="24">
        <el-card shadow="never" class="section-card dashboard-card">
          <template #header>
            <div class="section-title">黄金发放情况统计（近7日）</div>
          </template>
          <div class="gold-list">
            <div v-for="item in goldTrend" :key="item.date" class="gold-item">
              <div class="gold-top">
                <span>{{ item.date }}</span>
                <span>{{ item.amount }} 克</span>
              </div>
              <el-progress :percentage="item.percent" :stroke-width="10" :show-text="false" color="#f3b241" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

import * as echarts from "echarts";
import { useUserStore } from "@/store/modules/user";

interface MetricItem {
  title: string;
  value: number;
  tag: string;
  tagType: "success" | "info" | "warning" | "danger";
  trend: number;
  accent: string;
}

interface KvItem {
  label: string;
  value: number;
}

interface RewardProp {
  name: string;
  value: number;
  color: string;
}

interface AdExposureItem {
  name: string;
  value: number;
  color: string;
}

const userStore = useUserStore();
const rewardPieRef = ref<HTMLElement>();
const adPieRef = ref<HTMLElement>();
let rewardPieChart: echarts.ECharts | null = null;
let adPieChart: echarts.ECharts | null = null;

const greetings = computed(() => `欢迎回来，${userStore.user.nickname || "管理员"}`);
const updateTime = new Date().toLocaleString();

const overviewCards: MetricItem[] = [
  { title: "新增会员数量", value: 128, tag: "今日", tagType: "success", trend: 12.5, accent: "#00d2ff" },
  { title: "访问量 PV", value: 26540, tag: "今日", tagType: "info", trend: 8.1, accent: "#7c5cff" },
  { title: "独立 IP", value: 9680, tag: "今日", tagType: "warning", trend: 5.8, accent: "#00c48c" },
  { title: "黄金发放总量(克)", value: 3120, tag: "本月", tagType: "danger", trend: 15.3, accent: "#ff8a00" },
];
const animatedOverviewValues = ref<number[]>(overviewCards.map(() => 0));

const accountSummary: KvItem[] = [
  { label: "账户总数", value: 2231 },
  { label: "活跃账户", value: 1679 },
  { label: "今日新增账户", value: 37 },
  { label: "冻结账户", value: 26 },
];

const rewardProps: RewardProp[] = [
  { name: "100%加速卡", value: 3260, color: "#409EFF" },
  { name: "500%倍加速卡", value: 1980, color: "#67C23A" },
  { name: "1000%加速卡", value: 1240, color: "#E6A23C" },
  { name: "10000%倍加速卡", value: 420, color: "#F56C6C" },
];

const adExposureData: AdExposureItem[] = [
  { name: "快手平台", value: 21350, color: "#409EFF" },
  { name: "抖音平台", value: 18720, color: "#67C23A" },
  { name: "腾讯广告", value: 12460, color: "#E6A23C" },
  { name: "百度信息流", value: 7860, color: "#F56C6C" },
];

const trafficSummary: KvItem[] = [
  { label: "今日 PV", value: 26540 },
  { label: "今日 IP", value: 9680 },
  { label: "近7日 PV", value: 175230 },
  { label: "近7日新增会员", value: 773 },
];

const goldTrend = [
  { date: "04-09", amount: 380, percent: 61 },
  { date: "04-10", amount: 420, percent: 67 },
  { date: "04-11", amount: 390, percent: 62 },
  { date: "04-12", amount: 510, percent: 82 },
  { date: "04-13", amount: 620, percent: 100 },
  { date: "04-14", amount: 470, percent: 75 },
  { date: "04-15", amount: 530, percent: 85 },
];

const formatNumber = (value: number) => {
  return value.toLocaleString();
};

const totalRewardCount = computed(() => {
  return rewardProps.reduce((sum, item) => sum + item.value, 0);
});

const calcPercent = (value: number) => {
  if (totalRewardCount.value === 0) return "0.0";
  return ((value / totalRewardCount.value) * 100).toFixed(1);
};

const totalAdCount = computed(() => {
  return adExposureData.reduce((sum, item) => sum + item.value, 0);
});

const calcAdPercent = (value: number) => {
  if (totalAdCount.value === 0) return "0.0";
  return ((value / totalAdCount.value) * 100).toFixed(1);
};

const initRewardPie = () => {
  if (!rewardPieRef.value) return;
  rewardPieChart = echarts.init(rewardPieRef.value);
  rewardPieChart.setOption({
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>数量: {c}<br/>占比: {d}%",
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "奖励发放占比",
        type: "pie",
        radius: ["45%", "72%"],
        center: ["50%", "50%"],
        label: {
          formatter: "{d}%",
        },
        data: rewardProps.map((item) => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: item.color },
        })),
      },
    ],
  });
};

const initAdPie = () => {
  if (!adPieRef.value) return;
  adPieChart = echarts.init(adPieRef.value);
  adPieChart.setOption({
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>曝光量: {c}<br/>占比: {d}%",
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "广告平台曝光占比",
        type: "pie",
        radius: ["45%", "72%"],
        center: ["50%", "50%"],
        label: {
          formatter: "{d}%",
        },
        data: adExposureData.map((item) => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: item.color },
        })),
      },
    ],
  });
};

const resizeRewardPie = () => {
  rewardPieChart?.resize();
};

const resizeAdPie = () => {
  adPieChart?.resize();
};

const startOverviewRolling = () => {
  const duration = 1400;
  const startTime = performance.now();
  const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

  const animate = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const easedProgress = easeOutCubic(progress);

    animatedOverviewValues.value = overviewCards.map((item) => {
      return Math.round(item.value * easedProgress);
    });

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

onMounted(() => {
  startOverviewRolling();
  initRewardPie();
  initAdPie();
  window.addEventListener("resize", resizeRewardPie);
  window.addEventListener("resize", resizeAdPie);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeRewardPie);
  window.removeEventListener("resize", resizeAdPie);
  rewardPieChart?.dispose();
  adPieChart?.dispose();
  rewardPieChart = null;
  adPieChart = null;
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 24px;
  min-height: calc(100vh - 84px);
  background:
    radial-gradient(circle at 0% 0%, rgb(64 158 255 / 10%), transparent 40%),
    radial-gradient(circle at 100% 20%, rgb(103 194 58 / 8%), transparent 38%),
    var(--el-bg-color-page);
}

.dashboard-card {
  border: none;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgb(15 23 42 / 6%);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgb(15 23 42 / 10%);
  }
}

.welcome-card {
  margin-bottom: 4px;
  background: linear-gradient(120deg, rgb(64 158 255 / 10%), rgb(103 194 58 / 7%));
  border: 1px solid rgb(64 158 255 / 16%);
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.update-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.update-tip {
  margin: 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.welcome-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: var(--el-text-color-primary);
}

.welcome-desc {
  margin: 8px 0 0;
  color: var(--el-text-color-regular);
}

.metric-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.metric-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 14%);
  background:
    linear-gradient(140deg, rgb(255 255 255 / 96%), rgb(246 250 255 / 92%)),
    linear-gradient(90deg, var(--accent-color, #409eff), transparent 70%);

  &::before {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    content: "";
    background:
      radial-gradient(circle at 12% 14%, color-mix(in srgb, var(--accent-color, #409eff) 24%, transparent), transparent 44%),
      radial-gradient(circle at 90% 76%, color-mix(in srgb, var(--accent-color, #409eff) 14%, transparent), transparent 50%);
  }

  &::after {
    position: absolute;
    top: 0;
    left: -130%;
    width: 120%;
    height: 100%;
    pointer-events: none;
    content: "";
    background: linear-gradient(115deg, transparent 0%, rgb(255 255 255 / 45%) 48%, transparent 100%);
    transform: skewX(-20deg);
    transition: left 0.7s ease;
  }

  &:hover::after {
    left: 120%;
  }
}

.metric-value {
  margin-top: 18px;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--el-text-color-primary);
  background: linear-gradient(120deg, var(--accent-color, #409eff), #1f2937);
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  text-shadow: 0 6px 18px color-mix(in srgb, var(--accent-color, #409eff) 28%, transparent);
}

.metric-footer {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  color: var(--el-text-color-secondary);
  font-size: 12px;

  .up {
    color: #00a96b;
    font-weight: 600;
  }

  .down {
    color: #ef4444;
    font-weight: 600;
  }
}

.section-title {
  position: relative;
  padding-left: 10px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #0f172a;

  &::before {
    position: absolute;
    top: 2px;
    left: 0;
    width: 4px;
    height: 18px;
    content: "";
    background: linear-gradient(180deg, #409eff, #67c23a);
    border-radius: 4px;
  }
}

.kv-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.kv-item {
  position: relative;
  padding: 12px;
  border: 1px solid rgb(148 163 184 / 22%);
  border-radius: 10px;
  background:
    radial-gradient(circle at 100% 0%, rgb(64 158 255 / 12%), transparent 38%),
    linear-gradient(180deg, rgb(255 255 255 / 96%), rgb(248 250 252 / 100%));
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: rgb(64 158 255 / 40%);
    box-shadow: 0 10px 20px rgb(64 158 255 / 12%);
  }

  .label {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  .value {
    display: block;
    margin-top: 8px;
    font-size: 22px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    text-shadow: 0 6px 16px rgb(59 130 246 / 12%);
  }
}

.gold-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gold-item {
  padding: 10px 12px;
  border: 1px solid rgb(148 163 184 / 22%);
  border-radius: 10px;
  background:
    radial-gradient(circle at 85% 20%, rgb(243 178 65 / 18%), transparent 35%),
    linear-gradient(180deg, rgb(255 255 255 / 96%), rgb(248 250 252 / 100%));
}

.gold-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.ad-chart-wrap,
.reward-chart-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ad-pie,
.reward-pie {
  width: 46%;
  min-width: 240px;
  height: 280px;
}

.ad-legend,
.reward-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ad-legend-item,
.reward-legend-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid rgb(148 163 184 / 22%);
  border-radius: 10px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 97%), rgb(248 250 252 / 100%));
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: rgb(64 158 255 / 40%);
    transform: translateX(4px);
    box-shadow: 0 10px 20px rgb(59 130 246 / 10%);
  }

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .right {
    color: var(--el-text-color-secondary);
    font-weight: 500;
  }
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgb(64 158 255 / 12%);
}

:deep(.section-card .el-card__header) {
  border-bottom: 1px solid rgb(226 232 240 / 80%);
  background:
    linear-gradient(90deg, rgb(64 158 255 / 7%), transparent 45%);
}

:deep(.section-card .el-card__body) {
  padding-top: 16px;
}

:deep(.el-progress-bar__outer) {
  background-color: rgb(226 232 240 / 70%);
}

:deep(.el-progress-bar__inner) {
  box-shadow: 0 4px 12px rgb(243 178 65 / 28%);
}

@media (max-width: 1200px) {
  .ad-chart-wrap,
  .reward-chart-wrap {
    flex-direction: column;
    align-items: stretch;
  }

  .ad-pie,
  .reward-pie {
    width: 100%;
    min-width: unset;
    height: 260px;
  }
}
</style>
