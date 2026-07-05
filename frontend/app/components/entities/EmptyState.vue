<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <!-- Icon -->
    <div class="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
      <el-icon :size="36" class="text-gray-400">
        <component :is="icon" />
      </el-icon>
    </div>

    <!-- Title -->
    <h3 class="text-base font-semibold text-gray-800 mb-1">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-sm text-gray-400 max-w-xs mb-5">
      {{ description }}
    </p>

    <!-- Optional action button -->
    <el-button v-if="showAction" type="primary" @click="$emit('action')">
      {{ actionText }}
    </el-button>
  </div>
</template>

<script setup>
import { Box } from '@element-plus/icons-vue'

defineProps({
  icon: {
    type: [Object, Function],
    default: () => Box
  },
  title: {
    type: String,
    default: "Ma'lumot topilmadi"
  },
  description: {
    type: String,
    default: "Hozircha bu yerda hech narsa yo'q"
  },
  showAction: {
    type: Boolean,
    default: false
  },
  actionText: {
    type: String,
    default: "Qo'shish"
  }
})

defineEmits(['action'])
</script>