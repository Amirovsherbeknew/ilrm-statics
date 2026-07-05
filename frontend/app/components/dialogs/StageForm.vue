<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? 'Bosqichni tahrirlash' : 'Yangi bosqich qo\'shish'"
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
      <el-form-item label="Bosqich nomi" prop="name">
        <el-input
          v-model="form.name"
          placeholder="Masalan: Boshlang'ich bosqich"
          size="large"
        />
      </el-form-item>

      <el-form-item label="Boshlanish sanasi" prop="startDate" class="!w-full">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          placeholder="Sanani tanlang"
          size="large"
          class="!w-full"
          value-format="YYYY-MM-DD"
          :disabled-date="(d) => isAfterEndDate(d)"
        />
      </el-form-item>

      <el-form-item label="Tugash sanasi" prop="endDate" class="!w-full">
        <el-date-picker
          v-model="form.endDate"
          type="date"
          placeholder="Sanani tanlang"
          size="large"
          class="!w-full"
          value-format="YYYY-MM-DD"
          :disabled-date="(d) => isBeforeStartDate(d)"
        />
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

// Dialogning ko'rinish holati (v-model orqali StageList.vue dan boshqariladi)
const dialogVisible = defineModel();

// Tahrirlash uchun ma'lumot: null bo'lsa - yangi qo'shish, obyekt bo'lsa - tahrirlash
const props = defineProps({
  stageData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["save"]);

const formRef = ref(null);
const loading = ref(false);

const isEdit = computed(() => !!props.stageData);

const form = reactive({
  id: null,
  name: "",
  startDate: "",
  endDate: "",
});

const rules = {
  name: [{ required: true, message: "Bosqich nomini kiriting", trigger: "blur" }],
  startDate: [{ required: true, message: "Boshlanish sanasini tanlang", trigger: "change" }],
  endDate: [{ required: true, message: "Tugash sanasini tanlang", trigger: "change" }],
};

// Dialog ochilganda: tahrirlash uchun ma'lumotni formaga joylash,
// yoki yangi qo'shish uchun formani tozalash
watch(dialogVisible, (val) => {
  if (val) {
    if (props.stageData) {
      form.id = props.stageData.id;
      form.name = props.stageData.name;
      form.startDate = props.stageData.startDate;
      form.endDate = props.stageData.endDate;
    } else {
      resetForm();
    }
  }
});

function isBeforeStartDate(date) {
  if (!form.startDate) return false;
  return date < new Date(form.startDate);
}

function isAfterEndDate(date) {
  if (!form.endDate) return false;
  return date > new Date(form.endDate);
}

function resetForm() {
  form.id = null;
  form.name = "";
  form.startDate = "";
  form.endDate = "";
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
        id: form.id ?? Date.now(),
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
      });

      dialogVisible.value = false;
      resetForm();
    }, 300);
  });
}
</script>