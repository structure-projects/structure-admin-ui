<template>
    <div class="account-center-detail">
        <el-divider />
        <p> <el-icon><Money /></el-icon>
            <span>余额:</span><span>{{props.data.balance}}</span>
        </p>
        <p> <el-icon><Coin /></el-icon>
            <span>积分:</span><span>{{props.data.accumulate}}</span>
        </p>
    </div>
</template>

<script setup lang="ts">
export interface Purse {
    balance?:number;
    accumulate?:number;
}
const props = defineProps<{
    data:Purse
}>()

</script>

<style></style>
