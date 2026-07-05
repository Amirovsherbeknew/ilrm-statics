<template>
    <div class="flex flex-col gap-2 px-3">
        <div class="flex justify-between items-center h-[64px] rounded-xl bg-white px-3">
            <div></div>
            <el-button v-if="isHokimiyat" type="primary" @click="router.push('/projects/create')">Loyiha yaratish</el-button>
        </div>
        <div class="rounded-[16px] bg-white shadow px-3 py-5">
            <el-table :data="tableData" border style="width: 100%" v-loading="mainStore.loading">
                <el-table-column prop="name" label="Loyiha nomi" min-width="180" />
                <el-table-column prop="type" label="Turi" width="150" />
                <el-table-column prop="year" label="Yili" width="90" />
                <el-table-column prop="investmentType" label="Investitsiya" width="110" />
                <el-table-column label="Holati" >
                    <template #default="{ row }">
                        <TableStatus :type="row.status"/>
                    </template>
                </el-table-column>
                <el-table-column prop="organization" label="Tashkilot" min-width="160" />
                <el-table-column prop="country" label="Davlat" width="140" />
                <el-table-column prop="guarantorBank" label="Kafil bank" width="140" />
                <el-table-column prop="insuranceCompany" label="Sug'urta" width="140" />
                <el-table-column label="Amallar" width="110" fixed="right">
                    <template #default="{ row }">
                        <div class="flex-center gap-2">
                            <ActionButton v-if="row?.status === 'DR'" type="edit" @click="router.push(`/projects/create?id=${row.id}`)"/>
                            <ActionButton type="show" @click="router.push(`/projects/${row.id}`)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-empty v-if="!mainStore.loading && tableData.length === 0" description="Hozircha loyihalar mavjud emas" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useMainStore } from '../../../../store/index'

const router = useRouter()
const { getRole } = useToken()
const mainStore = useMainStore()

const isHokimiyat = computed(() => getRole() === 'hokimiyat')

const tableData = ref([])

async function fetchProjects() {
  const { data } = await useFetchApi.get('/api/projects')
  tableData.value = data.value || []
}

onMounted(() => {
  fetchProjects()
})
</script>