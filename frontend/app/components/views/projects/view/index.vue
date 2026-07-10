<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center">
    <div class="w-full w-full bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col gap-6" v-loading="loading">

      <div class="flex items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ project?.name || 'Loyiha' }}</h1>
          <p class="text-sm text-gray-500">Loyiha tafsilotlari va bosqichlari</p>
        </div>
        <el-button size="large" @click="router.push('/projects')">Orqaga</el-button>
      </div>

      <template v-if="project">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
          <div class="flex flex-col gap-1.5">
            <TableStatus :type="project.status" />
            <p v-if="project.status === 'RD' && project.reason" class="text-xs text-rose-500">
              Sabab: {{ project.reason }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <template v-if="isMonitoring && project.status === 'IR'">
              <el-button type="success" :loading="statusUpdating" @click="approveProject">
                Tasdiqlash
              </el-button>
              <el-button type="danger" plain :loading="statusUpdating" @click="rejectProject">
                Rad etish
              </el-button>
            </template>
            <el-segmented
              v-model="activeTab"
              :options="tabOptions"
              size="large"
              class="self-start sm:self-auto"
            />
          </div>
        </div>

        <transition name="tab-fade" mode="out-in">
          <div v-if="activeTab === 'passport'" key="passport" class="flex flex-col gap-7">

            <section v-for="group in infoGroups" :key="group.title" class="flex flex-col gap-3">
              <h3 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <Icon :name="group.icon" class="h-4 w-4" />
                {{ group.title }}
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div
                  v-for="item in group.items"
                  :key="item.label"
                  class="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <p class="text-xs text-gray-400 mb-1">{{ item.label }}</p>
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ item.value }}</p>
                </div>
              </div>
            </section>

            <section v-if="metrics.length" class="flex flex-col gap-3">
              <h3 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <Icon name="lucide:chart-column" class="h-4 w-4" />
                Samaradorlik ko'rsatkichlari
              </h3>

              <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div
                  v-for="m in metrics"
                  :key="m.label"
                  class="rounded-xl px-4 py-3 ring-1 ring-inset transition"
                  :class="[metricClasses(m.color), hasDetail(m.key) ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : '']"
                  @click="openDetail(m.key)"
                >
                  <div class="flex items-center justify-between gap-2">
                    <p class="text-xs font-medium opacity-70">{{ m.label }}</p>
                    <Icon v-if="hasDetail(m.key)" name="lucide:maximize-2" class="h-3.5 w-3.5 opacity-50" />
                  </div>
                  <p class="text-lg font-bold">{{ format(m.value) }}{{ m.suffix }}</p>
                </div>
              </div>
            </section>

            <section class="flex flex-col gap-3">
              <h3 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <Icon name="lucide:paperclip" class="h-4 w-4" />
                Hujjatlar
              </h3>
              <div v-if="documentFiles.length" class="flex flex-wrap gap-2.5">
                <a
                  v-for="f in documentFiles"
                  :key="f.label"
                  :href="`${apiBase}${f.path}`"
                  target="_blank"
                  class="flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                >
                  <Icon :name="f.icon" class="h-4 w-4" />
                  {{ f.label }}
                </a>
              </div>
              <p v-else class="text-sm text-gray-400">Hujjatlar biriktirilmagan</p>
            </section>

          </div>

          <div v-else-if="activeTab === 'schedule'" key="schedule" class="flex flex-col gap-4">
            <h3 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <Icon name="lucide:gantt-chart" class="h-4 w-4" />
              Bosqichlar jadvali
            </h3>
            <GanttChart :stages="stages" :mechanisms="mechanisms" />
          </div>

          <div v-else key="mechanisms" class="flex flex-col gap-4">
            <h3 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <Icon name="lucide:list-checks" class="h-4 w-4" />
              Mexanizmlar
            </h3>
            <StageMechanismTable
              :stages="stages"
              :project-id="project?.id"
              :manage-stages="false"
              :project-status="project?.status"
            />
          </div>
        </transition>
      </template>

      <el-empty v-else-if="!loading" description="Loyiha topilmadi" />

      <el-dialog v-model="dialogVisible" :title="selectedLabel" width="90%" style="max-width: 900px" destroy-on-close>
        <NpvResultCard v-if="selectedKey === 'npv'" :result="selectedResult" />
        <DppResultCard v-else-if="selectedKey === 'dpp'" :result="selectedResult" />
        <BcrResultCard v-else-if="selectedKey === 'bcr'" :result="selectedResult" />
        <EirrResultCard v-else-if="selectedKey === 'eirr'" :result="selectedResult" />
      </el-dialog>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const route = useRoute();
const router = useRouter();
const apiBase = useRuntimeConfig().public?.apiBase;

const { getRole } = useToken();
const isMonitoring = computed(() => getRole() === "monitoring");

const loading = ref(false);
const statusUpdating = ref(false);
const project = ref(null);
const stages = ref([]);
const mechanisms = ref([]);
const activeTab = ref("passport");

const tabOptions = [
  { label: "Loyiha passporti", value: "passport" },
  { label: "Bosqichlar jadvali", value: "schedule" },
  { label: "Mexanizmlar", value: "mechanisms" },
];

async function fetchData() {
  loading.value = true;

  const { data: projectsData, error } = await useFetchApi.get(`/api/projects/${route.params?.id}`);

  if (!error.value) {
    project.value = projectsData.value || null;
    stages.value = projectsData.value?.stages || [];
    await fetchMechanisms();
  }

  loading.value = false;
}

async function fetchMechanisms() {
  const { data } = await useFetchApi.get("/api/mechanisms");
  const stageIds = stages.value.map((s) => String(s.id));
  mechanisms.value = (data.value || []).filter((m) => stageIds.includes(String(m.stageId)));
}

onMounted(fetchData);

async function updateProjectStatus(status, reason) {
  statusUpdating.value = true;
  const { data, error } = await useFetchApi.patch(`/api/projects/${project.value.id}/status`, { status, reason });
  statusUpdating.value = false;

  if (error.value) {
    ElMessage.error(error.value?.data?.message || "Loyiha holatini yangilashda xatolik yuz berdi");
    return;
  }

  project.value = { ...project.value, ...data.value };
  ElMessage.success("Loyiha holati yangilandi");
}

function approveProject() {
  updateProjectStatus("IP");
}

async function rejectProject() {
  try {
    const { value: reason } = await ElMessageBox.prompt(
      "Rad etish sababini kiriting",
      "Loyihani rad etish",
      {
        confirmButtonText: "Rad etish",
        cancelButtonText: "Bekor qilish",
        inputPlaceholder: "Sabab...",
        inputValidator: (val) => !!val?.trim() || "Sababni kiritish majburiy",
      }
    );
    await updateProjectStatus("RD", reason);
  } catch {
    // foydalanuvchi bekor qildi
  }
}

function format(n) {
  return Number(n).toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}

const infoGroups = computed(() => {
  if (!project.value) return [];

  return [
    {
      title: "Asosiy ma'lumotlar",
      icon: "lucide:info",
      items: [
        { label: "Loyiha turi", value: project.value.type || "—" },
        { label: "Loyiha yili", value: project.value.year || "—" },
        { label: "Investitsiya kim tomonidan", value: project.value.investmentType || "—" },
        { label: "Tashkilot", value: project.value.organization || "—" },
        { label: "Davlat", value: project.value.country || "—" },
      ],
    },
    {
      title: "Ijtimoiy-iqtisodiy ko'rsatkichlar",
      icon: "lucide:users",
      items: [
        { label: "Kafil bank", value: project.value.guarantorBank || "—" },
        { label: "Sug'urta kompaniyasi", value: project.value.insuranceCompany || "—" },
        { label: "Ish o'rin (Mahaliy)", value: project.value.localJobsCount ?? "—" },
        { label: "Ish o'rin (Xorijiy)", value: project.value.foreignJobsCount ?? "—" },
        { label: "Mas'ul xodim", value: project.value.responsibleEmployee || "—" },
      ],
    },
  ];
});

const documentFiles = computed(() => {
  if (!project.value) return [];

  return [
    { label: "Loyiha passporti", path: project.value.passportFile, icon: "lucide:id-card" },
    { label: "Biznes plan", path: project.value.businessPlan, icon: "lucide:file-text" },
    { label: "Jamoatchilik fikri", path: project.value.publicOpinionFile, icon: "lucide:megaphone" },
  ].filter((f) => f.path);
});

const metrics = computed(() => {
  if (!project.value) return [];

  return [
    { key: "npv", label: "NPV",title:'Loyiha iqtisodiy baholash kalkulyatori', value: project.value.npv, suffix: " mln so'm", color: "blue" },
    { key: "dpp", label: "DPP",title:'Loyihaning qoplanish muddatini hisoblash kalkulyatori', value: project.value.dpp, suffix: " yil", color: "emerald" },
    { key: "bcr", label: "BCR",title:'Har 1 so’mga qancha foyda to’g’ri kelishini hisoblash kalkulyatori', value: project.value.bcr, suffix: "", color: "amber" },
    { key: "eirr", label: "EIRR",title:'Loyiha o‘zini oqlashi uchun kerakli eng kam samaradorlik foizi', value: project.value.eirr, suffix: "%", color: "violet" },
  ].filter((m) => m.value !== null && m.value !== undefined);
});

function hasDetail(key) {
  return !!project.value?.resultDetails?.[key];
}

const selectedKey = ref(null);

const selectedResult = computed(() =>
  selectedKey.value ? project.value?.resultDetails?.[selectedKey.value] || null : null
);

const selectedLabel = computed(
  () => metrics.value.find((m) => m.key === selectedKey.value)?.label || ""
);

const dialogVisible = computed({
  get: () => !!selectedKey.value,
  set: (val) => {
    if (!val) selectedKey.value = null;
  },
});

function openDetail(key) {
  if (hasDetail(key)) selectedKey.value = key;
}

const metricColorMap = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
};

function metricClasses(color) {
  return metricColorMap[color] || metricColorMap.blue;
}
</script>

<style scoped>
:deep(.el-segmented) {
  --el-segmented-bg-color: #f3f4f6;
  --el-segmented-item-selected-bg-color: #ffffff;
  --el-segmented-item-selected-color: #4f46e5;
  border-radius: 12px;
  padding: 4px;
}
:deep(.el-segmented__item) {
  border-radius: 12px;
  font-weight: 600;
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.15s ease;
}
.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
}
</style>
