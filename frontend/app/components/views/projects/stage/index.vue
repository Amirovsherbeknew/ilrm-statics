<template>
  <div class="min-h-screen bg-gray-100 px-3 flex justify-center">
    <div class="w-full  bg-white rounded-2xl shadow-xl p-6 md:p-10">

      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Loyiha bosqichlari</h1>
          <p class="text-sm text-gray-500">
            Loyiha bosqichlari va ularning mexanizmlari ro'yxati — qo'shish, tahrirlash, o'chirish
          </p>
        </div>
      </div>

      <StageMechanismTable
        :stages="stages"
        :project-id="projectInfo?.id"
        :project-status="projectInfo?.status"
        @stage-created="onStageCreated"
        @stage-updated="onStageUpdated"
        @stage-deleted="onStageDeleted"
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
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";

const activeStep = defineModel()

const props = defineProps({
  projectInfo: {
    type: Object,
    default: null,
  }
});

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

function onStageCreated(stage) {
  stages.value.push(stage);
}

function onStageUpdated(stage) {
  const index = stages.value.findIndex((s) => s.id === stage.id);
  if (index !== -1) stages.value[index] = stage;
}

function onStageDeleted(id) {
  stages.value = stages.value.filter((s) => s.id !== id);
}

function nextStep () {
  if (stages.value?.length > 0) {
    activeStep.value = 3
  }
  else ElMessage.error('Bosqichlarni qo\'shish majburiy')
}
</script>
