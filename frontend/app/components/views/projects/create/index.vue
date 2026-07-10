<template>
  <div class="w-full bg-gray-100 px-2 md:px-3 flex justify-center">
    <div class="w-full bg-white rounded-2xl shadow-xl p-4">

      <h1 class="text-2xl font-bold text-gray-900 mb-1">Yangi loyiha yaratish</h1>
      <p class="text-sm text-gray-500 mb-6">
        Quyidagi maydonlarni to'ldiring va loyihani saqlang
      </p>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :disabled="fieldsDisabled"
        label-position="top"
        class="grid grid-cols-1 md:grid-cols-2 gap-x-3"
      >
        <!-- 1) Loyiha nomi -->
          <el-form-item label="Loyiha nomi" prop="name">
            <el-input
              v-model="form.name"
              placeholder="Loyiha nomini kiriting"
              size="large"
            />
          </el-form-item>
          <!-- 2) Loyiha turi (4 ta) -->
          <el-form-item label="Loyiha turi" prop="type">
            <el-select
              v-model="form.type"
              placeholder="Turini tanlang"
              size="large"
              class="w-full"
            >
              <el-option
                v-for="item in projectTypes"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>       

        <!-- 6) Formulalar - alohida ishlanadi, bu yerda yo'q -->

        

        <!-- 9) Qaysi tashkilot -->
        <el-form-item label="Qaysi tashkilot" prop="organization">
          <el-input
            v-model="form.organization"
            placeholder="Tashkilot nomini kiriting"
            size="large"
          />
        </el-form-item>

        <!-- 10) Qaysi davlat -->
        <el-form-item label="Qaysi davlat" prop="country">
          <el-select
            v-model="form.country"
            filterable
            placeholder="Davlatni tanlang"
            size="large"
            class="w-full"
          >
            <el-option
              v-for="c in countries"
              :key="c"
              :label="c"
              :value="c"
            />
          </el-select>
        </el-form-item>

        <!-- 11) Kafil bank -->
        <el-form-item label="Kafil bank" prop="guarantorBank">
          <el-select
            v-model="form.guarantorBank"
            filterable
            placeholder="Bankni tanlang"
            size="large"
            class="w-full"
          >
            <el-option
              v-for="bank in banks"
              :key="bank"
              :label="bank"
              :value="bank"
            />
          </el-select>
        </el-form-item>

        <!-- 12) Sug'urta kompaniyasi -->
        <el-form-item label="Sug'urta kompaniyasi" prop="insuranceCompany">
          <el-select
            v-model="form.insuranceCompany"
            filterable
            placeholder="Sug'urta kompaniyasini tanlang"
            size="large"
            class="w-full"
          >
            <el-option
              v-for="ic in insuranceCompanies"
              :key="ic"
              :label="ic"
              :value="ic"
            />
          </el-select>
        </el-form-item>

        <!-- 13) Loyiha tegishli hududlar -->
        <el-form-item label="Hududlar" prop="regions">
          <el-select
            v-model="form.regions"
            multiple
            filterable
            placeholder="Hududlarni tanlang"
            size="large"
            class="w-full"
          >
            <el-option
              v-for="r in regionOptions"
              :key="r.id"
              :label="r.name_uz"
              :value="r.id"
            />
          </el-select>
        </el-form-item>

        <!-- 14) Loyiha tegishli tumanlar -->
        <el-form-item label="Tumanlar" prop="districts">
          <el-select
            v-model="form.districts"
            multiple
            filterable
            :disabled="form.regions.length === 0"
            :placeholder="form.regions.length === 0 ? 'Avval hududni tanlang' : 'Tumanlarni tanlang'"
            size="large"
            class="w-full"
          >
            <el-option
              v-for="d in districtOptions"
              :key="d.id"
              :label="d.name_uz"
              :value="d.id"
            />
          </el-select>
        </el-form-item>

        <!-- 15-16) Qancha ish o'rni yaratiladi -->
        <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-3">
          <el-form-item label="Qancha ish o'rin yaratiladi (Mahaliy)" prop="localJobsCount">
            <el-input-number
              v-model="form.localJobsCount"
              :min="0"
              placeholder="Mahaliy ish o'rinlari sonini kiriting"
              size="large"
              class="!w-full"
              controls-position="right"
            />
          </el-form-item>

          <el-form-item label="Qancha ish o'rin yaratiladi (Xorijiy)" prop="foreignJobsCount">
            <el-input-number
              v-model="form.foreignJobsCount"
              :min="0"
              placeholder="Xorijiy ish o'rinlari sonini kiriting"
              size="large"
              class="!w-full"
              controls-position="right"
            />
          </el-form-item>
        </div>

        <!-- 17) Mas'ul xodim -->
        <el-form-item label="Mas'ul xodim" prop="responsibleEmployee">
          <el-input
            v-model="form.responsibleEmployee"
            placeholder="Mas'ul xodimni kiriting"
            size="large"
          />
        </el-form-item>

        <div class="grid grid-cols-2 gap-2">
              <!-- 3) Loyiha yili (default - tizimdagi joriy yil) -->
              <el-form-item label="Loyiha yili" prop="year">
                <el-date-picker
                  v-model="form.year"
                  type="year"
                  placeholder="Yilni tanlang"
                  size="large"
                  class="!w-full"
                  value-format="YYYY"
                />
              </el-form-item>

              <!-- 5) Investitsiya kim tomonidan kiritiladi -->
              <el-form-item label="Investitsiya kim tomonidan kiritiladi" prop="investmentType" clas="w-full grid">
                <el-radio-group v-model="form.investmentType" size="large" class="w-full flex-nowrap !grid grid-cols-2">
                  <el-radio-button label="xususiy">Xususiy</el-radio-button>
                  <el-radio-button label="davlat">Davlat</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>

        <div class="col-span-2 grid grid-cols-3 gap-2">
          <!-- 7) Biznes plan (fayl) -->
          <el-form-item label="Biznes plan (fayl)" prop="businessPlan">
            <el-upload
              class="w-full"
              drag
              :auto-upload="false"
              :limit="1"
              :disabled="fieldsDisabled"
              :on-change="(file) => (form.businessPlan = file)"
              :on-remove="() => (form.businessPlan = null)"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                Faylni shu yerga tashlang yoki <em>yuklash uchun bosing</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">PDF, DOC, DOCX (max 10MB)</div>
              </template>
            </el-upload>
          </el-form-item>

          <!-- 8) Loyiha passporti (fayl) -->
          <el-form-item label="Loyiha passporti (fayl)" prop="passportFile">
            <el-upload
              class="w-full"
              drag
              :auto-upload="false"
              :limit="1"
              :disabled="fieldsDisabled"
              :on-change="(file) => (form.passportFile = file)"
              :on-remove="() => (form.passportFile = null)"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                Faylni shu yerga tashlang yoki <em>yuklash uchun bosing</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">PDF, DOC, DOCX (max 10MB)</div>
              </template>
            </el-upload>
          </el-form-item>

          <!-- 18) Jamoatchilik fikri (fayl) -->
          <el-form-item label="Jamoatchilik fikri (fayl)" prop="publicOpinionFile">
            <el-upload
              class="w-full"
              drag
              :auto-upload="false"
              :limit="1"
              :disabled="fieldsDisabled"
              :on-change="(file) => (form.publicOpinionFile = file)"
              :on-remove="() => (form.publicOpinionFile = null)"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                Faylni shu yerga tashlang yoki <em>yuklash uchun bosing</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">PDF, DOC, DOCX (max 10MB)</div>
              </template>
            </el-upload>
          </el-form-item>
        </div>

        <!-- Tugmalar -->
        <div class="md:col-span-2 flex gap-3 mt-4">
          <el-button
            size="large"
            class="flex-1"
            @click="handleReset"
          >
            Bekor qilish
          </el-button>
          <el-button
            type="primary"
            size="large"
            class="flex-1"
            :loading="loading"
            @click="handleSubmit"
          >
            {{ isEditing ? "Davom etish" : "Saqlash" }}
          </el-button>
          
        </div>

      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  projectInfo: {
    type: Object,
    default: null,
  },
});

// ====== Joriy tizim yili (default qiymat) ======
const currentYear = new Date().getFullYear().toString();

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);

const activeStep = defineModel()
const emit = defineEmits(["created","update"]);

// ====== Tanlov ro'yxatlari (o'zingizga moslab o'zgartiring) ======
const projectTypes = [
  "Qishloq xo'jaligi",
  "Xizmat ko'rsatish",
  "Sanoat",
  "Qurilish",
];

const countries = [
  "O'zbekiston",
  "Qozog'iston",
  "Qirg'iziston",
  "Tojikiston",
  "Turkmaniston",
  "Rossiya",
  "Xitoy",
];

const banks = [
  "Xalq banki",
  "Agrobank",
  "Ipoteka bank",
  "Milliy bank",
  "Asaka bank",
];

const insuranceCompanies = [
  "Uzbekinvest",
  "Kafolat",
  "Alskom",
  "Gross Insurance",
  "Apex Sug'urta",
];

const regionOptions = useConstants().regionList;
const allDistricts = useConstants().dictrictList;

const districtOptions = computed(() =>
  allDistricts.filter((d) => form.regions.includes(d.region?.id))
);

// ====== Forma ma'lumotlari ======
const form = reactive({
  name: "",
  type: "",
  year: currentYear,
  investmentType: "xususiy",
  businessPlan: null,
  passportFile: null,
  organization: "",
  country: "",
  guarantorBank: "",
  insuranceCompany: "",
  regions: [],
  districts: [],
  localJobsCount: null,
  foreignJobsCount: null,
  responsibleEmployee: "",
  publicOpinionFile: null,
});

// ====== Validatsiya qoidalari ======
const rules = {
  name: [{ required: true, message: "Loyiha nomini kiriting", trigger: "blur" }],
  type: [{ required: true, message: "Loyiha turini tanlang", trigger: "change" }],
  year: [{ required: true, message: "Loyiha yilini tanlang", trigger: "change" }],
  investmentType: [{ required: true, message: "Investitsiya turini tanlang", trigger: "change" }],
  organization: [{ required: true, message: "Tashkilotni kiriting", trigger: "blur" }],
  businessPlan: [{ required: true, message: "Biznes rejani yuklang", trigger: "change" }],
  passportFile: [{ required: true, message: "Loyiha passportini yuklang", trigger: "change" }],
  publicOpinionFile: [{ required: true, message: "Jamoatchilik fikrini yuklang", trigger: "change" }],
  country: [{ required: true, message: "Davlatni tanlang", trigger: "change" }],
  guarantorBank: [{ required: true, message: "Kafil bankni tanlang", trigger: "change" }],
  insuranceCompany: [{ required: true, message: "Sug'urta kompaniyasini tanlang", trigger: "change" }],
  regions: [{ required: true, type: "array", min: 1, message: "Kamida bitta hududni tanlang", trigger: "change" }],
  districts: [{ required: true, type: "array", min: 1, message: "Kamida bitta tumanni tanlang", trigger: "change" }],
  localJobsCount: [{ required: true, type: "number", message: "Mahaliy ish o'rinlari sonini kiriting", trigger: "change" }],
  foreignJobsCount: [{ required: true, type: "number", message: "Xorijiy ish o'rinlari sonini kiriting", trigger: "change" }],
  responsibleEmployee: [{ required: true, message: "Mas'ul xodimni kiriting", trigger: "blur" }],
};

// Hudud o'zgarganda, endi tegishli bo'lmagan tumanlarni tanlovdan olib tashlaymiz.
watch(
  () => form.regions,
  () => {
    const validIds = new Set(districtOptions.value.map((d) => d.id));
    form.districts = form.districts.filter((id) => validIds.has(id));
  },
  { deep: true }
);

// ====== Tahrirlash holati ======
// DR = loyiha hali qoralama (draft) bosqichida — asosiy ma'lumotlarni
// o'zgartirish mumkin. Boshqa har qanday statusda loyiha allaqachon
// keyingi bosqichlarga o'tgan hisoblanadi va bu forma faqat o'qish uchun bo'ladi.
const isEditing = computed(() => !!props.projectInfo);
const isDraft = computed(() => ['DR','RD'].includes(props.projectInfo?.status));
const fieldsDisabled = computed(() => isEditing.value && !isDraft.value);

const EDITABLE_KEYS = [
  "name",
  "type",
  "year",
  "investmentType",
  "organization",
  "country",
  "guarantorBank",
  "insuranceCompany",
  "regions",
  "districts",
  "localJobsCount",
  "foreignJobsCount",
  "responsibleEmployee",
];

const originalForm = reactive({});

const isDirty = computed(() => {
  const fileChanged = !!(form.businessPlan?.raw || form.passportFile?.raw || form.publicOpinionFile?.raw);
  const fieldsChanged = EDITABLE_KEYS.some(
    (key) => String(form[key] ?? "") !== String(originalForm[key] ?? "")
  );
  return fileChanged || fieldsChanged;
});

watch(
  () => props.projectInfo,
  (val) => {
    if (val) {
      form.name = val?.name;
      form.type = val?.type;
      form.year = val?.year || currentYear;
      form.investmentType = val?.investmentType;
      form.businessPlan = val?.businessPlan;
      form.passportFile = val?.passportFile;
      form.organization = val?.organization;
      form.country = val?.country;
      form.guarantorBank = val?.guarantorBank;
      form.insuranceCompany = val?.insuranceCompany;
      form.regions = val?.regions || [];
      form.districts = val?.districts || [];
      form.localJobsCount = val?.localJobsCount ?? null;
      form.foreignJobsCount = val?.foreignJobsCount ?? null;
      form.responsibleEmployee = val?.responsibleEmployee || "";
      form.publicOpinionFile = val?.publicOpinionFile;

      EDITABLE_KEYS.forEach((key) => {
        originalForm[key] = Array.isArray(form[key]) ? [...form[key]] : form[key];
      });
    }
  },
  { deep: true, immediate: true }
)

// ====== Saqlash ======
async function handleSubmit() {
  // Loyiha DR (qoralama) bosqichidan chiqib ketgan bo'lsa — forma o'qish uchun,
  // hech narsani saqlamasdan keyingi bosqichga o'tamiz.
  if (fieldsDisabled.value) {
    activeStep.value = 2;
    return;
  }

  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    if (isEditing.value) {
      // Hech narsa o'zgartirilmagan bo'lsa — PATCH yubormaymiz, shunchaki davom etamiz.
      if (!isDirty.value) {
        activeStep.value = 2;
        return;
      }

      loading.value = true;

      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("type", form.type);
      payload.append("year", form.year);
      payload.append("investmentType", form.investmentType);
      payload.append("organization", form.organization);
      payload.append("country", form.country);
      payload.append("regions", JSON.stringify(form.regions));
      payload.append("districts", JSON.stringify(form.districts));
      payload.append("localJobsCount", form.localJobsCount);
      payload.append("foreignJobsCount", form.foreignJobsCount);
      payload.append("responsibleEmployee", form.responsibleEmployee);
      if (form.guarantorBank) payload.append("guarantorBank", form.guarantorBank);
      if (form.insuranceCompany) payload.append("insuranceCompany", form.insuranceCompany);
      if (form.businessPlan?.raw) payload.append("businessPlan", form.businessPlan.raw);
      if (form.passportFile?.raw) payload.append("passportFile", form.passportFile.raw);
      if (form.publicOpinionFile?.raw) payload.append("publicOpinionFile", form.publicOpinionFile.raw);

      const { error } = await useFetchApi.patch(`/api/projects/${props.projectInfo.id}`, payload);

      loading.value = false;

      if (error.value) {
        ElMessage.error(error.value?.data?.message || "Loyihani saqlashda xatolik yuz berdi");
        return;
      }
      emit('update')
      ElMessage.success("Loyiha muvaffaqiyatli yangilandi");
      activeStep.value = 2;
      return;
    }

    if (!form.businessPlan?.raw || !form.passportFile?.raw) {
      ElMessage.error("Iltimos, biznes plan va loyiha passporti fayllarini yuklang");
      return;
    }

    loading.value = true;

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("type", form.type);
    payload.append("year", form.year);
    payload.append("investmentType", form.investmentType);
    payload.append("organization", form.organization);
    payload.append("country", form.country);
    payload.append("regions", JSON.stringify(form.regions));
    payload.append("districts", JSON.stringify(form.districts));
    payload.append("localJobsCount", form.localJobsCount);
    payload.append("foreignJobsCount", form.foreignJobsCount);
    payload.append("responsibleEmployee", form.responsibleEmployee);
    if (form.guarantorBank) payload.append("guarantorBank", form.guarantorBank);
    if (form.insuranceCompany) payload.append("insuranceCompany", form.insuranceCompany);
    payload.append("businessPlan", form.businessPlan.raw);
    payload.append("passportFile", form.passportFile.raw);
    if (form.publicOpinionFile?.raw) payload.append("publicOpinionFile", form.publicOpinionFile.raw);

    const { data, error } = await useFetchApi.post("/api/projects", payload);

    loading.value = false;

    if (error.value) {
      ElMessage.error(error.value?.data?.message || "Loyihani saqlashda xatolik yuz berdi");
      return;
    }

    ElMessage.success("Loyiha muvaffaqiyatli saqlandi");
    emit('update',data.value?.id)
    router.replace({
      query:{
        id:data.value?.id
      }
    })
    activeStep.value = 2;
  });
}

function handleReset() {
  formRef.value?.resetFields();
  form.year = currentYear;
  form.businessPlan = null;
  form.passportFile = null;
  form.publicOpinionFile = null;
  router.push('/projects')
}
</script>

<style scoped>
:deep(.el-button--primary) {
  --el-color-primary: #4f46e5;
  --el-color-primary-light-3: #6366f1;
  --el-color-primary-dark-2: #4338ca;
}
:deep(.el-radio-button__inner) {
  width: 100%;
}
:deep(.el-radio-button ) {
  width: 100%;
}
</style>