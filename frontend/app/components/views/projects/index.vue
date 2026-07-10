<template>
    <div class="flex flex-col gap-3 px-3">
        <div class="flex justify-between items-center h-[64px] rounded-xl bg-white px-5">
            <div>
                <h1 class="text-lg font-bold text-slate-900">Loyihalar</h1>
                <p class="text-xs text-slate-400">Barcha loyihalar ro'yxati</p>
            </div>
            <el-button v-if="isHokimiyat" type="primary" size="large" class="!rounded-lg flex justify-center gap-1 items-center" @click="router.push('/projects/create')">
                <IconAddCircle/> Loyiha yaratish
            </el-button>
        </div>

        <div class="modern-table-card overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md shadow-slate-200/50">
            <el-table
                :data="tableData"
                style="width: 100%"
                v-loading="mainStore.loading"
                class="modern-table"
                :header-cell-style="headerCellStyle"
                :cell-style="cellStyle"
            >
                <el-table-column type="index" label="#" width="56" align="center" />

                <el-table-column prop="name" label="Loyiha nomi" min-width="200">
                    <template #default="{ row }">
                        <span class="font-semibold text-slate-800">{{ row.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="type" label="Turi" width="160">
                    <template #default="{ row }">
                        <span class="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                            {{ row.type }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column prop="year" label="Yili" width="90" align="center">
                    <template #default="{ row }">
                        <span class="font-semibold text-slate-700">{{ row.year }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="investmentType" label="Investitsiya" width="120" align="center">
                    <template #default="{ row }">
                        <span
                            class="inline-block rounded-md px-2 py-1 text-xs font-semibold capitalize"
                            :class="row.investmentType === 'davlat'
                                ? 'bg-violet-50 text-violet-600'
                                : 'bg-sky-50 text-sky-600'"
                        >
                            {{ row.investmentType }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="Holati" width="240" align="center">
                    <template #default="{ row }">
                        <TableStatus :type="row.status" />
                    </template>
                </el-table-column>

                <el-table-column prop="organization" label="Tashkilot" min-width="170">
                    <template #default="{ row }">
                        <span class="text-slate-600">{{ row.organization }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="country" label="Davlat" width="140">
                    <template #default="{ row }">
                        <span class="text-slate-600">{{ row.country }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="guarantorBank" label="Kafil bank" width="140">
                    <template #default="{ row }">
                        <span class="text-slate-600">{{ row.guarantorBank }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="insuranceCompany" label="Sug'urta" width="140">
                    <template #default="{ row }">
                        <span class="text-slate-600">{{ row.insuranceCompany }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="Amallar" width="110" align="center" fixed="right">
                    <template #default="{ row }">
                        <div class="flex-center gap-2">
                            <ActionButton v-if="['DR','RD   '].includes(row?.status)" type="edit" @click="router.push(`/projects/create?id=${row.id}`)"/>
                            <ActionButton type="show" @click="router.push(`/projects/${row.id}`)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <el-empty
                v-if="!mainStore.loading && tableData.length === 0"
                description="Hozircha loyihalar mavjud emas"
                class="py-10"
            />
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

const LAST_COLUMN_INDEX = 10

function headerCellStyle({ columnIndex }) {
  return {
    background: '#f8fafc',
    color: '#475569',
    fontWeight: 600,
    fontSize: '11.5px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e2e8f0',
    borderRight: columnIndex === LAST_COLUMN_INDEX ? 'none' : '1px solid #e2e8f0',
    padding: '12px 14px',
  }
}

function cellStyle({ columnIndex }) {
  return {
    borderBottom: '1px solid #eef2f7',
    borderRight: columnIndex === LAST_COLUMN_INDEX ? 'none' : '1px solid #f1f5f9',
    padding: '12px 14px',
    fontSize: '13px',
    color: '#334155',
  }
}
</script>

<style scoped>
.modern-table :deep(.el-table__inner-wrapper::before) {
  display: none;
}

.modern-table :deep(.el-table__row) {
  transition: background-color 0.15s ease;
}

.modern-table :deep(.el-table__row:hover > td) {
  background-color: #f8fafc;
}

.modern-table :deep(.el-table__row:last-child td) {
  border-bottom: none;
}

.modern-table :deep(.el-loading-mask) {
  border-radius: 16px;
}
</style>