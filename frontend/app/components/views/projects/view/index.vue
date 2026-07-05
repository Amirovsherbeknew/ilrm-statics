<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center">
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col gap-6" v-loading="loading">

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ project?.name || 'Loyiha' }}</h1>
          <p class="text-sm text-gray-500">Loyiha tafsilotlari va bosqichlari</p>
        </div>
        <el-button size="large" @click="router.push('/projects')">Orqaga</el-button>
      </div>

      <el-descriptions v-if="project" :column="2" border>
        <el-descriptions-item label="Holati">
          <TableStatus :type="project.status" />
        </el-descriptions-item>
        <el-descriptions-item label="Loyiha turi">{{ project.type }}</el-descriptions-item>
        <el-descriptions-item label="Loyiha yili">{{ project.year }}</el-descriptions-item>
        <el-descriptions-item label="Investitsiya kim tomonidan">{{ project.investmentType }}</el-descriptions-item>
        <el-descriptions-item label="Tashkilot">{{ project.organization }}</el-descriptions-item>
        <el-descriptions-item label="Davlat">{{ project.country }}</el-descriptions-item>
        <el-descriptions-item label="Kafil bank">{{ project.guarantorBank || '—' }}</el-descriptions-item>
        <el-descriptions-item label="Sug'urta kompaniyasi">{{ project.insuranceCompany || '—' }}</el-descriptions-item>
        <el-descriptions-item label="Loyiha passporti">
          <a v-if="project.passportFile" :href="`${useRuntimeConfig().public?.apiBase}${project.passportFile}`" target="_blank">Passport</a>
          <template v-else>—</template>
        </el-descriptions-item>
        <el-descriptions-item label="Biznes plan">
          <a v-if="project.businessPlan" :href="`${useRuntimeConfig().public?.apiBase}${project.businessPlan}`" target="_blank">Biznes reja hujjati</a>
          <template v-else>—</template>
        </el-descriptions-item>
        <el-descriptions-item v-if="project.npv !== null && project.npv !== undefined" label="NPV">
          {{ format(project.npv) }} mln so'm
        </el-descriptions-item>
        <el-descriptions-item v-if="project.dpp !== null && project.dpp !== undefined" label="DPP">
          {{ format(project.dpp) }} yil
        </el-descriptions-item>
        <el-descriptions-item v-if="project.bcr !== null && project.bcr !== undefined" label="BCR">
          {{ format(project.bcr) }}
        </el-descriptions-item>
        <el-descriptions-item v-if="project.eirr !== null && project.eirr !== undefined" label="EIRR">
          {{ format(project.eirr) }}%
        </el-descriptions-item>
      </el-descriptions>

      <el-empty v-else-if="!loading" description="Loyiha topilmadi" />

      <div v-if="project">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Bosqichlar (Gant diagrammasi)</h2>
        <GanttChart :stages="stages" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const project = ref(null);
const stages = ref([]);

async function fetchData() {
  loading.value = true;

  const [{ data: projectsData }, { data: stagesData }] = await Promise.all([
    useFetchApi.get("/api/projects"),
    useFetchApi.get("/api/stages"),
  ]);

  project.value =
    (projectsData.value || []).find((p) => String(p.id) === String(route.params.id)) || null;
  stages.value = (stagesData.value || []).filter(
    (stage) => String(stage.projectId) === String(route.params.id)
  );

  loading.value = false;
}

onMounted(fetchData);

function format(n) {
  return Number(n).toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}
</script>
