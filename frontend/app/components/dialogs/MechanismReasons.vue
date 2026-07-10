<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`${mechanismData?.name || ''} — xabarlar`"
    width="520px"
    :close-on-click-modal="false"
  >
    <div class="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
      <el-empty v-if="messages.length === 0" description="Hozircha xabarlar yo'q" :image-size="60" />

      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex flex-col gap-1 rounded-xl px-3 py-2"
        :class="[
          msg.type === 'approved' ? 'self-center bg-teal-50 text-teal-800' :
          msg.type === 'rejected' ? 'self-center bg-rose-50 text-rose-700' :
          msg.createdBy === 'monitoring' ? 'self-end bg-blue-50 text-blue-900' : 'self-start bg-slate-100 text-slate-800',
        ]"
        style="max-width: 85%"
      >
        <div class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide opacity-60">
          <Icon v-if="msg.type === 'approved'" name="lucide:check-circle-2" class="h-3.5 w-3.5" />
          <Icon v-if="msg.type === 'rejected'" name="lucide:x-circle" class="h-3.5 w-3.5" />
          <span>{{ msg.createdBy === 'monitoring' ? 'Monitoring' : 'Hokimiyat' }}</span>
          <span>{{ formatDate(msg.createdAt) }}</span>
        </div>
        <p v-if="msg.text" class="whitespace-pre-wrap text-sm">{{ msg.text }}</p>
        <a
          v-if="msg.filePath"
          :href="`${apiBase}${msg.filePath}`"
          target="_blank"
          class="flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
        >
          <Icon name="lucide:paperclip" class="h-3.5 w-3.5" />
          {{ msg.fileName || 'Fayl' }}
        </a>
      </div>
    </div>

    <div class="mt-4 border-t border-slate-100 pt-3">
      <template v-if="canSend">
        <el-input v-model="text" type="textarea" :rows="2" placeholder="Xabar yozing..." />
        <div class="mt-2 flex items-center justify-between gap-2">
          <label class="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700">
            <Icon name="lucide:paperclip" class="h-4 w-4" />
            <span class="max-w-[160px] truncate">{{ file ? file.name : 'Fayl biriktirish' }}</span>
            <input type="file" class="hidden" @change="onFileChange" />
          </label>
          <el-button type="primary" :loading="sending" @click="sendMessage">Yuborish</el-button>
        </div>
      </template>
      <p v-else class="text-xs text-slate-400">
        Xabar yuborish uchun loyiha "Bajarilmoqda" holatida bo'lishi kerak
      </p>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">Yopish</el-button>
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
  projectStatus: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["sent"]);

const apiBase = useRuntimeConfig().public?.apiBase;

const text = ref("");
const file = ref(null);
const sending = ref(false);

const messages = computed(() => props.mechanismData?.reasons || []);
const canSend = computed(() => props.projectStatus === "IP");

watch(dialogVisible, (val) => {
  if (!val) {
    text.value = "";
    file.value = null;
  }
});

function onFileChange(e) {
  file.value = e.target.files?.[0] || null;
}

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

async function sendMessage() {
  if (!text.value.trim() && !file.value) {
    ElMessage.error("Matn yozing yoki fayl biriktiring");
    return;
  }

  const formData = new FormData();
  if (text.value.trim()) formData.append("text", text.value.trim());
  if (file.value) formData.append("file", file.value);

  sending.value = true;
  const { data, error } = await useFetchApi.post(`/api/mechanisms/${props.mechanismData.id}/reasons`, formData);
  sending.value = false;

  if (error.value) {
    ElMessage.error(error.value?.data?.message || "Xabar yuborishda xatolik yuz berdi");
    return;
  }

  emit("sent", data.value);
  text.value = "";
  file.value = null;
}
</script>
