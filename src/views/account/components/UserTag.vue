<template>
  <div class="account-center-tags">
    <el-divider />
    <div class="tagsTitle">标签</div>

    <div class="gap-2">
      <el-tag v-for="tag in dynamicTags" :key="tag.id" class="mx-1" closable type="info" :disable-transitions="false"
        @close="handleClose(tag.id)">
        {{ tag.tag }}
      </el-tag>
      <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
        @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
      <el-button v-else class="button-new-tag" size="small" @click="showInput">
        + New Tag
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TagDto } from '@/api/tags/types';
import { getUserTags, addUserTags, delUserTags } from '@/api/tags';

const dynamicTags = ref<TagDto[]>();
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()
const handleClose = (id: number) => {
  delUserTags(id).then((data) => {
    getUserTagList();
  }).finally(() => {
  });
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

function getUserTagList() {
  getUserTags()
  .then((data) => {
    dynamicTags.value = data.data;
  }).catch ((e) => {
    console.log(e);
  } ).finally(() => { 
  });
}

onMounted(() => {
  getUserTagList();
});

const handleInputConfirm = () => {
  if (inputValue.value) {
    // dynamicTags.value.push(inputValue.value)
    const tagDto = {
      id: undefined,
      tag: inputValue.value
    };
    addUserTags(tagDto).then((data) => {
      getUserTagList();
    }).finally(() => {
    });
  }
  inputVisible.value = false
   inputValue.value = ''
}
</script>

<style></style>