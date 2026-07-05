<template>
  <div class="w-full bg-gray-100 flex flex-col gap-2">
      <div class="w-full px-3">
        <Steps :active="active" class="mx-auto" />
      </div>
      <views-projects-create v-if="active === 1" v-model="active" :project-info="projectInfo"/>
      <views-projects-stage v-if="active === 2" v-model="active" :project-info="projectInfo"/>
      <views-projects-calculate v-if="active === 3" v-model="active" :project-info="projectInfo"/>
  </div>
</template>
<script setup>
const route = useRoute()
const active = ref(1)
const projectInfo = ref()

const projectId = computed(() => route.query.id || null)

onMounted(() => {
  if (projectId.value) {
    getProjectInfo()
  }
})

async function getProjectInfo () {
  const {data,error} = await useFetchApi.get(`/api/projects/${projectId.value}`)
  if (!error.value) {
    projectInfo.value = data.value
  }
}
</script>
