<template>
  <div>
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="tooltipTitle || tooltip_titles[type]"
      placement="top-start"
    >
      <button
        :id="$attrs.id as string"
        type="button"
        :class="[type, { '!bg-stone-200 !text-white pointer-events-none': disabled }]"
        class="flex-center w-8 h-8 md:w-10 md:h-10 rounded-[10px] transition-colors duration-300"
        @click="emit('click')"
      >
        <component :is="`icon-${type}`" class="max-md:w-5 max-md:h-5" />
      </button>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
interface TProps {
  type:
    | 'search'
    | 'show'
    | 'delete'
    | 'clear'
    | 'exit'
    | 'file'
    | 'edit'
    | 'save'
    | 'removed'
    | 'file-download'
    | 'reload'
    | 'add-circle'
  disabled?: boolean
  tooltipTitle?: string
}
const emit = defineEmits(['click'])
withDefaults(defineProps<TProps>(), {
  tooltipTitle: undefined,
})
const tooltip_titles = {
  search: 'Qidirish',
  show: "Ko'rish",
  delete: "O'chirish",
  clear: 'Tozalash',
  exit: 'Chiqarish',
  file: "Hujjatni ko'rish",
  edit: "O'zgaritirish",
  save: 'Saqlash',
  reload: 'Yangilash',
  removed: 'Bekor qilish',
  'file-download': 'Yuklab olish',
  'add-circle': "Qo'shish",
}
</script>

<style scoped>
.file-download {
  background: var(--color-sky-500);
  color: var(--color-sky-600);
  padding-left: 4px;
}
.search,
.show {
  background: var(--color-sky-50);
  color: var(--color-sky-600);
}
.save {
  background-color: var(--color-sky-500);
}
.save:hover {
  background-color: var(--color-sky-700);
}

.file-download:hover {
  background: theme('colors.sky.700');
}

.search:hover,
.show:hover {
  background: theme('colors.sky.500');
}
.delete,
.removed,
.clear,
.exit {
  background: var(--color-rose-50);
  color: var(--color-red-600);
}

.delete:hover,
.removed:hover,
.clear:hover,
.exit:hover {
  background: theme('colors.rose.500');
}
.file {
  background: var(--color-violet-50);
  color: var(--color-violet-600);
}
.file:hover {
  background: theme('colors.violet.500');
}
.edit,
.reload {
  background: var(--color-teal-50);
  color: var(--color-teal-600);
}
.edit:hover,
.reload:hover {
  background: theme('colors.teal.500');
}

.add-circle {
  background: var(--color-emerald-50);
  color: var(--color-emerald-600);
}
.add-circle:hover {
  background: theme('colors.emerald.500');
}

.search:hover,
.show:hover,
.delete:hover,
.removed:hover,
.clear:hover,
.exit:hover,
.file:hover,
.save:hover,
.edit:hover,
.file-download:hover,
.reload:hover,
.add-circle:hover {
  color: #fff;
}
</style>
