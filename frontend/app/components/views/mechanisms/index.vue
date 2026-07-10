<template>
  <div class="flex flex-col gap-3 px-3" v-loading="loading">
    <div class="flex items-center justify-between h-[64px] rounded-xl bg-white px-5">
      <div>
        <h1 class="text-lg font-bold text-slate-900">Mexanizmlar</h1>
        <p class="text-xs text-slate-400">Barcha loyihalar bo'yicha mexanizmlar ro'yxati</p>
      </div>
    </div>

    <div class="flex items-center rounded-xl bg-white px-5 py-4">
      <el-segmented v-model="activeTab" :options="tabOptions" size="large" />
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md shadow-slate-200/50">
      <el-table
        :data="filteredRows"
        style="width: 100%"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
      >
        <el-table-column label="Loyiha" min-width="180">
          <template #default="{ row }">
            <nuxt-link
              v-if="row.projectId"
              :to="`/projects/${row.projectId}`"
              class="font-medium text-blue-700 hover:underline"
            >
              {{ row.projectName }}
            </nuxt-link>
            <span v-else class="text-slate-400">{{ row.projectName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="stageName" label="Bosqich" min-width="160" />

        <el-table-column label="Mexanizm nomi" min-width="180">
          <template #default="{ row }">
            <span class="font-medium text-slate-800">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Boshlanish sanasi" width="150">
          <template #default="{ row }">
            <span class="text-blue-700">{{ row.beforeDate }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Tugash sanasi" width="190">
          <template #default="{ row }">
            <span :class="mechanismDeadlineInfo(row).class">{{ mechanismDeadlineInfo(row).text }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Holati" width="220">
          <template #default="{ row }">
            <TableStatus :type="row.status" />
          </template>
        </el-table-column>

        <el-table-column label="Xabarlar" width="120">
          <template #default="{ row }">
            <button
              class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              @click="openReasonsDialog(row)"
            >
              <Icon name="lucide:message-circle" class="h-3.5 w-3.5" />
              {{ row.reasons?.length || 0 }}
            </button>
          </template>
        </el-table-column>

        <el-table-column v-if="isMonitoring || isHokimiyat" label="Amallar" width="320" fixed="right">
          <template #default="{ row }">
            <div class="flex-center gap-2">
              <template v-if="isHokimiyat">
                <el-popconfirm
                  v-if="row.status === 'BM'"
                  title="Mexanizmni boshlashni tasdiqlaysizmi?"
                  confirm-button-text="Ha"
                  cancel-button-text="Yo'q"
                  @confirm="startMechanism(row)"
                >
                  <template #reference>
                    <el-button type="primary" size="large" plain>Boshlash</el-button>
                  </template>
                </el-popconfirm>
                <el-button
                  v-if="['BM','IP'].includes(row.status)"
                  type="warning"
                  size="large"
                  plain
                  @click="openDecisionDialog(row, 'block')"
                >
                  Bloklash
                </el-button>
              </template>
              <template v-if="isMonitoring">
                <el-button type="success" :disabled="row?.status !== 'IR'" size="large" @click="openDecisionDialog(row, 'approve')">Tasdiqlash</el-button>
                <el-button type="warning" :disabled="row?.status !== 'IR'" size="large" plain @click="openDecisionDialog(row, 'reject')">Rad etish</el-button>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="!loading && filteredRows.length === 0"
        description="Mexanizmlar topilmadi"
        class="py-10"
      />
    </div>

    <!-- Mexanizm bo'yicha xabarlar (chat) dialogi -->
    <DialogsMechanismReasons
      v-model="reasonsDialogVisible"
      :mechanism-data="activeMechanism"
      :project-status="activeMechanism?.projectStatus"
      @sent="handleReasonSent"
    />

    <!-- Monitoring: tasdiqlash / rad etish dialogi -->
    <DialogsMechanismDecision
      v-model="decisionDialogVisible"
      :mechanism-data="decisionMechanism"
      :decision="decisionType"
      @decided="handleDecided"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";

const { getRole } = useToken();
const isMonitoring = computed(() => getRole() === "monitoring");
const isHokimiyat = computed(() => getRole() === "hokimiyat");

const loading = ref(false);
const mechanismsRaw = ref([]);
const stages = ref([]);
const projects = ref([]);

const activeTab = ref("all");

const statusTabsBase = [
  { label: "Barchasi", value: "all" },
  { label: "Boshlanmagan", value: "BM" },
  { label: "Bajarilmoqda", value: "IP" },
  { label: "Bloklangan", value: "BL" },
  { label: "Ko'rib chiqilmoqda", value: "IR" },
  { label: "Yakunlangan", value: "AD" },
  { label: "Rad etilgan", value: "RD" },
];

async function fetchAll() {
  loading.value = true;

  const [mechRes, stageRes, projectRes] = await Promise.all([
    useFetchApi.get("/api/mechanisms"),
    useFetchApi.get("/api/stages"),
    useFetchApi.get("/api/projects"),
  ]);

  mechanismsRaw.value = mechRes.data.value || [];
  stages.value = stageRes.data.value || [];
  projects.value = projectRes.data.value || [];

  loading.value = false;
}

onMounted(fetchAll);

const rows = computed(() =>
  mechanismsRaw.value.map((m) => {
    const stage = stages.value.find((s) => String(s.id) === String(m.stageId));
    const project = stage ? projects.value.find((p) => String(p.id) === String(stage.projectId)) : null;

    return {
      ...m,
      stageName: stage?.name || "—",
      projectName: project?.name || "—",
      projectId: project?.id ?? null,
      projectStatus: project?.status ?? null,
    };
  })
);

const tabCounts = computed(() => {
  const counts = { all: rows.value.length, BM: 0, IP: 0, BL: 0, IR: 0, AD: 0, RD: 0 };
  rows.value.forEach((r) => {
    if (counts[r.status] !== undefined) counts[r.status]++;
  });
  return counts;
});

const tabOptions = computed(() =>
  statusTabsBase.map((t) => ({ ...t, label: `${t.label} (${tabCounts.value[t.value] ?? 0})` }))
);

const filteredRows = computed(() =>
  activeTab.value === "all" ? rows.value : rows.value.filter((r) => r.status === activeTab.value)
);

/* ---------- Mexanizm xabarlari (chat) ---------- */
const reasonsDialogVisible = ref(false);
const activeMechanism = ref(null);

function openReasonsDialog(row) {
  activeMechanism.value = row;
  reasonsDialogVisible.value = true;
}

function handleReasonSent(updatedMechanism) {
  updateMechanismInList(updatedMechanism);
  activeMechanism.value = { ...activeMechanism.value, ...updatedMechanism };
}

/* ---------- Hokimiyat: boshlash / bloklash, Monitoring: tasdiqlash / rad etish ---------- */
async function startMechanism(row) {
  const { data, error } = await useFetchApi.post(`/api/mechanisms/${row.id}/action`, { action: "start" });
  if (error.value) {
    ElMessage.error(error.value?.data?.message || "Mexanizmni boshlashda xatolik yuz berdi");
    return;
  }
  updateMechanismInList(data.value);
  ElMessage.success("Mexanizm boshlandi");
}

const decisionDialogVisible = ref(false);
const decisionMechanism = ref(null);
const decisionType = ref("approve");

function openDecisionDialog(row, type) {
  decisionMechanism.value = row;
  decisionType.value = type;
  decisionDialogVisible.value = true;
}

function handleDecided(updatedMechanism) {
  updateMechanismInList(updatedMechanism);
}

function updateMechanismInList(updatedMechanism) {
  const index = mechanismsRaw.value.findIndex((m) => m.id === updatedMechanism.id);
  if (index !== -1) mechanismsRaw.value[index] = updatedMechanism;
}

const headerCellStyle = {
  background: "#f8fafc",
  color: "#475569",
  fontWeight: 600,
  fontSize: "11.5px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid #e2e8f0",
  padding: "12px 14px",
};

const cellStyle = {
  borderBottom: "1px solid #eef2f7",
  padding: "12px 14px",
  fontSize: "13px",
  color: "#334155",
};
</script>
