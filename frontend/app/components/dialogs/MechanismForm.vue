<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? 'Mexanizmni tahrirlash' : 'Yangi mexanizm qo\'shish'"
    width="480px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="Mexanizm nomi" prop="name">
        <el-input
          v-model="form.name"
          placeholder="Masalan: Yer ajratish"
          size="large"
        />
      </el-form-item>

      <el-form-item label="Boshlanish sanasi" prop="beforeDate" class="!w-full">
        <el-date-picker
          v-model="form.beforeDate"
          type="date"
          placeholder="Sanani tanlang"
          size="large"
          class="!w-full"
          value-format="YYYY-MM-DD"
          :disabled-date="(d) => isAfterEndDate(d)"
        />
      </el-form-item>

      <el-form-item label="Tugash sanasi" prop="afterDate" class="!w-full">
        <el-date-picker
          v-model="form.afterDate"
          type="date"
          placeholder="Sanani tanlang"
          size="large"
          class="!w-full"
          value-format="YYYY-MM-DD"
          :disabled-date="(d) => isBeforeStartDate(d)"
        />
      </el-form-item>

      <p v-if="stageDateRange?.start && stageDateRange?.end" class="-mt-2 text-xs text-slate-400">
        Bosqich muddati: {{ stageDateRange.start }} — {{ stageDateRange.end }} oralig'ida bo'lishi kerak
      </p>

      <el-form-item v-if="isEdit" label="Holati">
        <TableStatus :type="props.mechanismData?.status" />
        <p class="mt-1 text-xs text-slate-400">
          Holati xabar yuborilganda va monitoring qarori bilan avtomatik o'zgaradi
        </p>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button size="large" @click="handleClose">Bekor qilish</el-button>
      <el-button type="primary" size="large" :loading="loading" @click="handleSave">
        Saqlash
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch, computed } from "vue";
import { ElMessage } from "element-plus";

// Dialogning ko'rinish holati (v-model orqali StageForm ga o'xshab boshqariladi)
const dialogVisible = defineModel();

const props = defineProps({
  // Tahrirlash uchun ma'lumot: null bo'lsa - yangi qo'shish, obyekt bo'lsa - tahrirlash
  mechanismData: {
    type: Object,
    default: null,
  },
  // Yangi mexanizm qaysi bosqichga bog'lanishi
  stageId: {
    type: [Number, String],
    default: null,
  },
  // Tanlangan bosqichning muddati — mexanizm sanalari shu oraliqda bo'lishi kerak
  stageDateRange: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["save"]);

const formRef = ref(null);
const loading = ref(false);

const isEdit = computed(() => !!props.mechanismData);

const form = reactive({
  id: null,
  name: "",
  beforeDate: "",
  afterDate: "",
});

const rules = {
  name: [{ required: true, message: "Mexanizm nomini kiriting", trigger: "blur" }],
  beforeDate: [{ required: true, message: "Boshlanish sanasini tanlang", trigger: "change" }],
  afterDate: [{ required: true, message: "Tugash sanasini tanlang", trigger: "change" }],
};

watch(dialogVisible, (val) => {
  if (val) {
    if (props.mechanismData) {
      form.id = props.mechanismData.id;
      form.name = props.mechanismData.name;
      form.beforeDate = props.mechanismData.beforeDate;
      form.afterDate = props.mechanismData.afterDate;
    } else {
      resetForm();
    }
  }
});

function isOutsideStageRange(date) {
  const { start, end } = props.stageDateRange || {};
  if (start && date < new Date(start)) return true;
  if (end && date > new Date(end)) return true;
  return false;
}

// "Tugash sanasi" pikeri uchun: boshlanish sanasidan oldingi va bosqich muddatidan tashqari kunlarni bloklaydi
function isBeforeStartDate(date) {
  if (form.beforeDate && date < new Date(form.beforeDate)) return true;
  return isOutsideStageRange(date);
}

// "Boshlanish sanasi" pikeri uchun: tugash sanasidan keyingi va bosqich muddatidan tashqari kunlarni bloklaydi
function isAfterEndDate(date) {
  if (form.afterDate && date > new Date(form.afterDate)) return true;
  return isOutsideStageRange(date);
}

function resetForm() {
  form.id = null;
  form.name = "";
  form.beforeDate = "";
  form.afterDate = "";
  formRef.value?.clearValidate();
}

function handleClose() {
  dialogVisible.value = false;
  resetForm();
}

async function handleSave() {
  if (!formRef.value) return;

  await formRef.value.validate((valid) => {
    if (!valid) {
      ElMessage.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    loading.value = true;

    setTimeout(() => {
      loading.value = false;

      emit("save", {
        id: form.id,
        name: form.name,
        beforeDate: form.beforeDate,
        afterDate: form.afterDate,
        stageId: props.stageId,
      });

      dialogVisible.value = false;
      resetForm();
    }, 300);
  });
}
</script>
