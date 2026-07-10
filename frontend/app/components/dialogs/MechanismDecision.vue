<template>
  <el-dialog
    v-model="dialogVisible"
    :title="config.title"
    width="480px"
    :close-on-click-modal="false"
  >
    <p class="mb-3 text-sm text-slate-500">{{ mechanismData?.name }}</p>

    <el-input v-model="text" type="textarea" :rows="3" :placeholder="config.defaultText" />

    <label class="mt-2 flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700">
      <Icon name="lucide:paperclip" class="h-4 w-4" />
      <span class="max-w-[220px] truncate">{{ file ? file.name : 'Fayl biriktirish (ixtiyoriy)' }}</span>
      <input type="file" class="hidden" @change="onFileChange" />
    </label>

    <template #footer>
      <el-button @click="dialogVisible = false">Bekor qilish</el-button>
      <el-button
        :type="config.confirmType"
        :loading="sending"
        @click="confirmDecision"
      >
        {{ config.confirmLabel }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";

const dialogVisible = defineModel();

const props = defineProps({
  mechanismData: {
    type: Object,
    default: null,
  },
  // 'approve' | 'reject' | 'block'
  decision: {
    type: String,
    default: "approve",
  },
});

const emit = defineEmits(["decided"]);

// Har bir amal qaysi endpointga, qaysi maydon nomi bilan yuborilishini va dialog matnlarini belgilaydi
const ACTION_CONFIG = {
  approve: {
    endpoint: "decision",
    field: "decision",
    title: "Mexanizmni tasdiqlash",
    confirmLabel: "Tasdiqlash",
    confirmType: "success",
    defaultText: "Mexanizm tasdiqlandi",
  },
  reject: {
    endpoint: "decision",
    field: "decision",
    title: "Mexanizmni rad etish",
    confirmLabel: "Rad etish",
    confirmType: "danger",
    defaultText: "Mexanizm rad etildi",
  },
  block: {
    endpoint: "action",
    field: "action",
    title: "Mexanizmni bloklash",
    confirmLabel: "Bloklash",
    confirmType: "warning",
    defaultText: "Mexanizm bloklandi",
  },
};

const config = computed(() => ACTION_CONFIG[props.decision]);

const text = ref("");
const file = ref(null);
const sending = ref(false);

watch(dialogVisible, (val) => {
  if (val) {
    text.value = config.value.defaultText;
    file.value = null;
  }
});

function onFileChange(e) {
  file.value = e.target.files?.[0] || null;
}

async function confirmDecision() {
  const formData = new FormData();
  formData.append(config.value.field, props.decision);
  formData.append("text", text.value.trim() || config.value.defaultText);
  if (file.value) formData.append("file", file.value);

  sending.value = true;
  const { data, error } = await useFetchApi.post(
    `/api/mechanisms/${props.mechanismData.id}/${config.value.endpoint}`,
    formData
  );
  sending.value = false;

  if (error.value) {
    ElMessage.error(error.value?.data?.message || "Amalni bajarishda xatolik yuz berdi");
    return;
  }

  emit("decided", data.value);
  ElMessage.success(config.value.defaultText);
  dialogVisible.value = false;
}
</script>
