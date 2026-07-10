<template>
  <div>
    <div v-if="manageStages" class="flex items-center justify-end mb-4">
      <el-button v-if="isHokimiyat" type="primary" class="flex justify-center gap-1 items-center" size="large" @click="openCreateStageDialog">
        <IconAddCircle/> Bosqich qo'shish
      </el-button>
    </div>

    <el-table :data="tableRows" border style="width: 100%" row-key="rowKey" :row-class-name="rowClassName">
      <el-table-column label="#" width="70">
        <template #default="{ row }">
          <span :class="row.type === 'stage' ? 'font-bold text-slate-800' : 'text-slate-400'">
            {{ row.number }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Nomi" min-width="220">
        <template #default="{ row }">
          <span v-if="row.type === 'stage'" class="font-semibold text-blue-900">
            {{ row.name }}
          </span>
          <span v-else class="pl-5 text-slate-600 before:mr-1.5 before:text-slate-300 before:content-['↳']">
            {{ row.name }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Narx (mln so'm)" width="150">
        <template #default="{ row }">
          <template v-if="row.type === 'stage'">
            {{ row.price !== null && row.price !== undefined ? formatPrice(row.price) : '—' }}
          </template>
          <template v-else>—</template>
        </template>
      </el-table-column>

      <el-table-column label="Boshlanish sanasi" width="150">
        <template #default="{ row }">
          {{ row.type === 'stage' ? row.startDate : row.beforeDate }}
        </template>
      </el-table-column>

      <el-table-column label="Tugash sanasi" width="170">
        <template #default="{ row }">
          <span v-if="row.type === 'stage'" class="text-blue-700">{{ row.endDate }}</span>
          <span v-else :class="mechanismDeadlineInfo(row).class">{{ mechanismDeadlineInfo(row).text }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Holati" width="220">
        <template #default="{ row }">
          <TableStatus v-if="row.type === 'mechanism'" :type="row.status" />
          <span v-else class="text-slate-300">—</span>
        </template>
      </el-table-column>

      <el-table-column label="Xabarlar" width="130">
        <template #default="{ row }">
          <button
            v-if="row.type === 'mechanism'"
            class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            @click="openReasonsDialog(row)"
          >
            <Icon name="lucide:message-circle" class="h-3.5 w-3.5" />
            {{ row.reasons?.length || 0 }}
          </button>
          <span v-else class="text-slate-300">—</span>
        </template>
      </el-table-column>

      <el-table-column v-if="isHokimiyat || isMonitoring" label="Amallar" width="290" fixed="right">
        <template #default="{ row }">
          <div class="flex-center gap-2">
            <template v-if="row.type === 'stage'">
              <ActionButton v-if="isHokimiyat" type="add-circle" tooltip-title="Mexanizm qo'shish" @click="openCreateMechanismDialog(row)"/>
              <template v-if="isHokimiyat && manageStages">
                <ActionButton type="edit" @click="openEditStageDialog(row)"/>
                <el-popconfirm
                  title="Bosqichni o'chirishni tasdiqlaysizmi? Unga bog'liq mexanizmlar ham o'chiriladi."
                  confirm-button-text="Ha"
                  cancel-button-text="Yo'q"
                  @confirm="removeStage(row.id)"
                >
                  <template #reference>
                    <ActionButton type="delete"/>
                  </template>
                </el-popconfirm>
              </template>
            </template>
            <template v-else>
              <template v-if="isHokimiyat">
                <ActionButton type="edit" @click="openEditMechanismDialog(row)"/>
                <el-popconfirm
                  title="Mexanizmni o'chirishni tasdiqlaysizmi?"
                  confirm-button-text="Ha"
                  cancel-button-text="Yo'q"
                  @confirm="removeMechanism(row.id)"
                >
                  <template #reference>
                    <ActionButton type="delete"/>
                  </template>
                </el-popconfirm>
                <!-- <el-popconfirm
                  v-if="row.status === 'BM'"
                  title="Mexanizmni boshlashni tasdiqlaysizmi?"
                  confirm-button-text="Ha"
                  cancel-button-text="Yo'q"
                  @confirm="startMechanism(row)"
                >
                  <template #reference>
                    <el-button type="primary" size="small" plain>Boshlash</el-button>
                  </template>
                </el-popconfirm> -->
                <el-button
                  v-if="row.status === 'IP'"
                  type="warning"
                  size="small"
                  plain
                  @click="openDecisionDialog(row, 'block')"
                >
                  Bloklash
                </el-button>
              </template>
              <template v-if="isMonitoring">
                <el-button type="success" size="small" @click="openDecisionDialog(row, 'approve')">Tasdiqlash</el-button>
                <el-button type="danger" size="small" plain @click="openDecisionDialog(row, 'reject')">Rad etish</el-button>
              </template>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-empty
      v-if="stages.length === 0"
      description="Hozircha bosqichlar qo'shilmagan"
      class="mt-4"
    />

    <!-- Bosqich qo'shish / tahrirlash dialogi -->
    <DialogsStageForm
      v-if="manageStages"
      v-model="stageDialogVisible"
      :stage-data="editingStage"
      @save="handleStageSave"
    />

    <!-- Mexanizm qo'shish / tahrirlash dialogi -->
    <DialogsMechanismForm
      v-model="mechanismDialogVisible"
      :mechanism-data="editingMechanism"
      :stage-id="activeStageId"
      :stage-date-range="stageDateRange"
      @save="handleMechanismSave"
    />

    <!-- Mexanizm bo'yicha xabarlar (chat) dialogi -->
    <DialogsMechanismReasons
      v-model="reasonsDialogVisible"
      :mechanism-data="activeMechanism"
      :project-status="projectStatus"
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
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  stages: {
    type: Array,
    default: () => [],
  },
  projectId: {
    type: [Number, String],
    default: null,
  },
  // Bosqichlarni qo'shish/tahrirlash/o'chirish imkoniyatini ko'rsatish (loyiha yaratish jarayonida true)
  manageStages: {
    type: Boolean,
    default: true,
  },
  // Mexanizm xabarlarini yuborish faqat loyiha "Bajarilmoqda" (IP) holatida ruxsat etiladi
  projectStatus: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["stage-created", "stage-updated", "stage-deleted"]);

const { getRole } = useToken();
const isHokimiyat = computed(() => getRole() === "hokimiyat");
const isMonitoring = computed(() => getRole() === "monitoring");

const stageDialogVisible = ref(false);
const editingStage = ref(null); // null = yangi qo'shish, obyekt = tahrirlash

const mechanismDialogVisible = ref(false);
const editingMechanism = ref(null); // null = yangi qo'shish, obyekt = tahrirlash
const activeStageId = ref(null); // yangi mexanizm qaysi bosqichga bog'lanadi

const reasonsDialogVisible = ref(false);
const activeMechanism = ref(null); // xabarlar dialogida ko'rsatilayotgan mexanizm

const decisionDialogVisible = ref(false);
const decisionMechanism = ref(null); // tasdiqlash/rad etish dialogida ko'rsatilayotgan mexanizm
const decisionType = ref("approve"); // 'approve' | 'reject'

const activeStage = computed(() =>
  props.stages.find((s) => String(s.id) === String(activeStageId.value))
);

const stageDateRange = computed(() => ({
  start: activeStage.value?.startDate || "",
  end: activeStage.value?.endDate || "",
}));

const allMechanisms = ref([]);

const mechanisms = computed(() => {
  const stageIds = props.stages.map((s) => String(s.id));
  return allMechanisms.value.filter((m) => stageIds.includes(String(m.stageId)));
});

/* ---------- Bosqich + mexanizm qatorlarini birlashtirish (1, 1.1, 1.2, 2, ...) ---------- */
const tableRows = computed(() => {
  const rows = [];
  props.stages.forEach((stage, sIndex) => {
    rows.push({
      ...stage,
      type: "stage",
      rowKey: `stage-${stage.id}`,
      number: `${sIndex + 1}`,
    });

    const stageMechanisms = mechanisms.value.filter(
      (m) => String(m.stageId) === String(stage.id)
    );

    stageMechanisms.forEach((mechanism, mIndex) => {
      rows.push({
        ...mechanism,
        type: "mechanism",
        rowKey: `mechanism-${mechanism.id}`,
        number: `${sIndex + 1}.${mIndex + 1}`,
      });
    });
  });
  return rows;
});

function rowClassName({ row }) {
  return row.type === "mechanism" ? "bg-slate-50/60" : "";
}

async function fetchMechanisms() {
  const { data } = await useFetchApi.get("/api/mechanisms");
  allMechanisms.value = data.value || [];
}

fetchMechanisms();

/* ---------- Bosqich amallari ---------- */
function openCreateStageDialog() {
  editingStage.value = null;
  stageDialogVisible.value = true;
}

function openEditStageDialog(row) {
  editingStage.value = row;
  stageDialogVisible.value = true;
}

async function handleStageSave(stageData) {
  const isEdit = props.stages.some((s) => s.id === stageData.id);

  const payload = {
    name: stageData.name,
    price: stageData.price,
    startDate: stageData.startDate,
    endDate: stageData.endDate,
    projectId: props.projectId,
  };

  if (isEdit) {
    const { data, error } = await useFetchApi.patch(`/api/stages/${stageData.id}`, payload);
    if (error.value) {
      ElMessage.error(error.value?.data?.message || "Bosqichni tahrirlashda xatolik yuz berdi");
      return;
    }
    emit("stage-updated", data.value);
    ElMessage.success("Bosqich muvaffaqiyatli tahrirlandi");
  } else {
    const { data, error } = await useFetchApi.post("/api/stages", payload);
    if (error.value) {
      ElMessage.error(error.value?.data?.message || "Bosqichni qo'shishda xatolik yuz berdi");
      return;
    }
    emit("stage-created", data.value);
    ElMessage.success("Bosqich muvaffaqiyatli qo'shildi");
  }
}

async function removeStage(id) {
  const { error } = await useFetchApi.delete(`/api/stages/${id}`);
  if (error.value) {
    ElMessage.error(error.value?.data?.message || "Bosqichni o'chirishda xatolik yuz berdi");
    return;
  }

  // Bosqichga bog'liq mexanizmlarni ham serverdan o'chiramiz
  const relatedMechanisms = allMechanisms.value.filter((m) => String(m.stageId) === String(id));
  await Promise.all(
    relatedMechanisms.map((m) => useFetchApi.delete(`/api/mechanisms/${m.id}`))
  );

  allMechanisms.value = allMechanisms.value.filter((m) => String(m.stageId) !== String(id));
  emit("stage-deleted", id);
  ElMessage.success("Bosqich o'chirildi");
}

/* ---------- Mexanizm amallari ---------- */
function openCreateMechanismDialog(stageRow) {
  editingMechanism.value = null;
  activeStageId.value = stageRow.id;
  mechanismDialogVisible.value = true;
}

function openEditMechanismDialog(row) {
  editingMechanism.value = row;
  activeStageId.value = row.stageId;
  mechanismDialogVisible.value = true;
}

async function handleMechanismSave(mechanismData) {
  const isEdit = allMechanisms.value.some((m) => m.id === mechanismData.id);

  const payload = {
    name: mechanismData.name,
    beforeDate: mechanismData.beforeDate,
    afterDate: mechanismData.afterDate,
    stageId: mechanismData.stageId,
  };

  if (isEdit) {
    const { data, error } = await useFetchApi.patch(`/api/mechanisms/${mechanismData.id}`, payload);
    if (error.value) {
      ElMessage.error(error.value?.data?.message || "Mexanizmni tahrirlashda xatolik yuz berdi");
      return;
    }
    const index = allMechanisms.value.findIndex((m) => m.id === mechanismData.id);
    allMechanisms.value[index] = data.value;
    ElMessage.success("Mexanizm muvaffaqiyatli tahrirlandi");
  } else {
    const { data, error } = await useFetchApi.post("/api/mechanisms", payload);
    if (error.value) {
      ElMessage.error(error.value?.data?.message || "Mexanizmni qo'shishda xatolik yuz berdi");
      return;
    }
    allMechanisms.value.push(data.value);
    ElMessage.success("Mexanizm muvaffaqiyatli qo'shildi");
  }
}

async function removeMechanism(id) {
  const { error } = await useFetchApi.delete(`/api/mechanisms/${id}`);
  if (error.value) {
    ElMessage.error(error.value?.data?.message || "Mexanizmni o'chirishda xatolik yuz berdi");
    return;
  }
  allMechanisms.value = allMechanisms.value.filter((m) => m.id !== id);
  ElMessage.success("Mexanizm o'chirildi");
}

/* ---------- Mexanizm xabarlari (chat) ---------- */
function openReasonsDialog(row) {
  activeMechanism.value = row;
  reasonsDialogVisible.value = true;
}

function handleReasonSent(updatedMechanism) {
  const index = allMechanisms.value.findIndex((m) => m.id === updatedMechanism.id);
  if (index !== -1) allMechanisms.value[index] = updatedMechanism;
  activeMechanism.value = updatedMechanism;
}

/* ---------- Hokimiyat: boshlash / bloklash, Monitoring: tasdiqlash / rad etish ---------- */
async function startMechanism(row) {
  const { data, error } = await useFetchApi.post(`/api/mechanisms/${row.id}/action`, { action: "start" });
  if (error.value) {
    ElMessage.error(error.value?.data?.message || "Mexanizmni boshlashda xatolik yuz berdi");
    return;
  }
  const index = allMechanisms.value.findIndex((m) => m.id === row.id);
  if (index !== -1) allMechanisms.value[index] = data.value;
  ElMessage.success("Mexanizm boshlandi");
}

function openDecisionDialog(row, type) {
  decisionMechanism.value = row;
  decisionType.value = type;
  decisionDialogVisible.value = true;
}

function handleDecided(updatedMechanism) {
  const index = allMechanisms.value.findIndex((m) => m.id === updatedMechanism.id);
  if (index !== -1) allMechanisms.value[index] = updatedMechanism;
}

function formatPrice(n) {
  return Number(n).toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}
</script>
