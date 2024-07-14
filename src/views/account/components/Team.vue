<template>
    <div>
        <div class="account-center-team">
            <!-- 团队组件 -->
            <el-divider />
            <div class="teamTitle">团队</div>
            <el-row :gutter="20">
                <el-col :span="12" v-for="team in props.teams">
                    <el-avatar :src="team.logo" />
                    <span>{{ team.title }}</span>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script setup lang="ts">

export interface TeamData {
    logo?: string,
    title?: string,
}

const props = defineProps<{
    teams?: TeamData[]
}>()
</script>
<style>
.account-center-team {
    color: #3a3939;
}

.teamTitle {
    font-weight: 500;
    color: rgba(65, 64, 64, 0.85);
    margin-bottom: 12px;
}
</style>