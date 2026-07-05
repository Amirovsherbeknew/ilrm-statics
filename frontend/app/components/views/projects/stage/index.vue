<template>
  <div class="min-h-screen bg-gray-100 px-3 flex justify-center">
    <div class="w-full  bg-white rounded-2xl shadow-xl p-6 md:p-10">

      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Loyiha bosqichlari</h1>
          <p class="text-sm text-gray-500">
            Loyiha bosqichlari ro'yxati — qo'shish, tahrirlash, o'chirish
          </p>
        </div>

        <el-button v-if="isHokimiyat" type="primary" size="large" @click="openCreateDialog">
          + Bosqich qo'shish
        </el-button>
      </div>

      <el-table :data="stages" border style="width: 100%">
        <el-table-column type="index" label="#" width="60" />

        <el-table-column prop="name" label="Bosqich nomi" min-width="180" />

        <el-table-column label="Boshlanish sanasi" width="160">
          <template #default="{ row }">
            {{ row.startDate }}
          </template>
        </el-table-column>

        <el-table-column label="Tugash sanasi" width="160">
          <template #default="{ row }">
            {{ row.endDate }}
          </template>
        </el-table-column>

        <el-table-column v-if="isHokimiyat" label="Amallar" width="160" fixed="right">
          <template #default="{ row }">
            <div class="flex-center gap-2">
              <ActionButton type="edit" @click="openEditDialog(row)"/>
              <el-popconfirm
                title="Bosqichni o'chirishni tasdiqlaysizmi?"
                confirm-button-text="Ha"
                cancel-button-text="Yo'q"
                @confirm="removeStage(row.id)"
              >
                <template #reference>
                  <ActionButton type="delete"/>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="stages.length === 0"
        description="Hozircha bosqichlar qo'shilmagan"
        class="mt-4"
      />

      <!-- Qo'shish / tahrirlash dialogi -->
      <DialogsStageForm
        v-model="dialogVisible"
        :stage-data="editingStage"
        @save="handleSave"
      />

      <div class="flex justify-end mt-6">
        <el-button type="primary" size="large" @click="nextStep">
          Davom etish
        </el-button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";

const router = useRouter();

const activeStep = defineModel()

const props = defineProps({
  projectInfo: {
    type: Object,
    default: null,
  }
});

const { getRole } = useToken();
const isHokimiyat = computed(() => getRole() === 'hokimiyat');

const dialogVisible = ref(false);
const editingStage = ref(null); // null = yangi qo'shish, obyekt = tahrirlash

const stages = ref([]);

async function fetchStages() {
  const { data } = await useFetchApi.get("/api/stages");
  stages.value = (data.value || []).filter(
    (stage) => String(stage.projectId) === String(props.projectInfo?.id)
  );
}

onMounted(() => {
  if (props.projectInfo?.id) fetchStages();
});

function nextStep () {
  if (stages.value?.length > 0) {
    activeStep.value = 3
  }
  else ElMessage.error('Bosqichlarni qo\'shish majburiy')
}

function openCreateDialog() {
  editingStage.value = null;
  dialogVisible.value = true;
}

function openEditDialog(row) {
  editingStage.value = row;
  dialogVisible.value = true;
}

async function handleSave(stageData) {
  const isEdit = stages.value.some((s) => s.id === stageData.id);

  const payload = {
    name: stageData.name,
    startDate: stageData.startDate,
    endDate: stageData.endDate,
    projectId: props.projectInfo?.id,
  };

  if (isEdit) {
    const { data, error } = await useFetchApi.patch(`/api/stages/${stageData.id}`, payload);
    if (error.value) {
      ElMessage.error(error.value?.data?.message || "Bosqichni tahrirlashda xatolik yuz berdi");
      return;
    }
    const index = stages.value.findIndex((s) => s.id === stageData.id);
    stages.value[index] = data.value;
    ElMessage.success("Bosqich muvaffaqiyatli tahrirlandi");
  } else {
    const { data, error } = await useFetchApi.post("/api/stages", payload);
    if (error.value) {
      ElMessage.error(error.value?.data?.message || "Bosqichni qo'shishda xatolik yuz berdi");
      return;
    }
    stages.value.push(data.value);
    ElMessage.success("Bosqich muvaffaqiyatli qo'shildi");
  }
}

async function removeStage(id) {
  const { error } = await useFetchApi.delete(`/api/stages/${id}`);
  if (error.value) {
    ElMessage.error(error.value?.data?.message || "Bosqichni o'chirishda xatolik yuz berdi");
    return;
  }
  stages.value = stages.value.filter((s) => s.id !== id);
  ElMessage.success("Bosqich o'chirildi");
}
</script>