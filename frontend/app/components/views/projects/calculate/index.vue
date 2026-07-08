<template>
    <div class="flex flex-col gap-4 px-3" v-loading="loading">
        <div class="grid grid-cols-2 gap-4">
            <template v-if="projectInfo?.investmentType === 'davlat'">
                <Formula1 :list="['government']" @calculated="(v, d) => onCalculated('npv', v, d)"/>
                <Formula3 @calculated="(v, d) => onCalculated('dpp', v, d)"/>
                <Formula8 @calculated="(v, d) => onCalculated('bcr', v, d)"/>
                <Formula10 @calculated="(v, d) => onCalculated('eirr', v, d)"/>
            </template>
            <template v-if="projectInfo?.investmentType === 'xususiy'">
                <Formula1 :list="['credit','ownFunds','wacc']" @calculated="(v, d) => onCalculated('npv', v, d)"/>
                <Formula3 @calculated="(v, d) => onCalculated('dpp', v, d)"/>
            </template>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6 flex justify-end">
            <el-button
                type="primary"
                size="large"
                :disabled="!allCalculated"
                :loading="finishing"
                @click="handleFinish"
            >
                Yakunlash
            </el-button>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  projectInfo: {
    type: Object,
    default: null,
  }
});
const router = useRouter();

const loading = ref(false);
const finishing = ref(false);
const projectInfoInvestmentTypes = ref(null);

const calculatedValues = reactive({ npv: null, dpp: null, bcr: null, eirr: null });
const calculatedDetails = reactive({ npv: null, dpp: null, bcr: null, eirr: null });

function onCalculated(key, value, detail) {
  calculatedValues[key] = value;
  calculatedDetails[key] = detail ?? null;
}

const requiredKeys = computed(() =>
  projectInfoInvestmentTypes.value?.investmentType === "davlat" ? ["npv", "dpp", "bcr", "eirr"] : ["npv", "dpp"]
);

const allCalculated = computed(() =>
  requiredKeys.value.every(
    (key) => calculatedValues[key] !== null && calculatedValues[key] !== undefined
  )
);

async function fetchProject() {
  loading.value = true;
  const { data } = await useFetchApi.get("/api/projects");
  projectInfoInvestmentTypes.value = (data.value || []).find((p) => String(p.id) === String(props.projectInfo?.id)) || null;
  loading.value = false;
}

onMounted(() => {
  if (props.projectInfo?.id) fetchProject();
});

async function handleFinish() {
  if (!allCalculated.value || !props.projectInfo?.id) return;

  finishing.value = true;

  const payload = { status: "IP", resultDetails: {} };
  requiredKeys.value.forEach((key) => {
    payload[key] = calculatedValues[key];
    payload.resultDetails[key] = calculatedDetails[key];
  });

  const { error } = await useFetchApi.patch(`/api/projects/${props.projectInfo?.id}`, payload);

  finishing.value = false;

  if (error.value) {
    ElMessage.error(error.value?.data?.message || "Yakunlashda xatolik yuz berdi");
    return;
  }

  ElMessage.success("Loyiha muvaffaqiyatli yakunlandi");
  router.push("/projects");
}
</script>
