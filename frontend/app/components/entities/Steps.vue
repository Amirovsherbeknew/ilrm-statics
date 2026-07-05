<template>
  <div class="rounded-[16px] bg-white w-full py-2">
    <el-steps style="min-width: 60%;margin-bottom: 20px;" :active="active - 1" align-center>
        <el-step title="Loyiha"/>
        <el-step title="Bosqichlar"/>
        <el-step title="Kalkulyator"/>
    </el-steps>
  </div>
</template>
<script setup lang="ts">
defineProps<{
    active:number
}>()
</script>