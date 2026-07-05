<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-4">ROI — Return on Investment</h1>

    
    <!-- Calculator -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div class="flex items-center gap-1 mb-5">
        <el-icon class="text-blue-800"><ArrowRight /></el-icon>
        <h3 class="text-blue-900 font-semibold text-base">Калькулятор ROI</h3>
      </div>

      <el-form :model="form" label-position="top" class="roi-form">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <el-form-item label="Общий доход (млн)">
            <el-input v-model.number="form.income" type="number" placeholder="150" />
          </el-form-item>

          <el-form-item label="Общие затраты (млн)">
            <el-input v-model.number="form.costs" type="number" placeholder="100" />
          </el-form-item>
        </div>

        <div class="flex gap-3 mt-2">
          <el-button type="primary" class="!bg-blue-950 !border-blue-950" @click="calculate">
            Рассчитать
          </el-button>
          <el-button @click="reset">Сбросить</el-button>
        </div>
      </el-form>

      <!-- Result -->
      <div
        v-if="result"
        class="mt-5 rounded-lg border p-4"
        :class="result.roi >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
      >
        <p
          class="font-semibold mb-3"
          :class="result.roi >= 0 ? 'text-green-700' : 'text-red-700'"
        >
          {{ result.roi >= 0 ? '✅' : '❌' }} ROI = {{ result.roi.toFixed(2) }}% —
          {{ result.roi >= 0 ? 'прибыльный проект' : 'убыточный проект' }}
        </p>

        <div class="bg-white/60 rounded-md p-3 mb-3">
          <pre class="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-6">Чистая прибыль = {{ form.income.toFixed(2) }} − {{ form.costs.toFixed(2) }} = {{ result.profit.toFixed(2) }} млн

ROI = ({{ result.profit.toFixed(2) }} / {{ form.costs.toFixed(2) }}) × 100% = {{ result.roi.toFixed(2) }}%</pre>
        </div>

        <p class="text-sm text-gray-600">
          На каждые 100 сум вложений проект приносит
          {{ result.roi >= 0 ? '' : '' }}{{ result.roi.toFixed(2) }} сум
          {{ result.roi >= 0 ? 'прибыли.' : 'убытка.' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

const form = reactive({
  income: 150,
  costs: 100
})

const result = ref(null)

function calculate() {
  const profit = form.income - form.costs
  const roi = form.costs !== 0 ? (profit / form.costs) * 100 : 0

  result.value = { profit, roi }
}

function reset() {
  form.income = 150
  form.costs = 100
  result.value = null
}
</script>

<style scoped>
.roi-form :deep(.el-form-item__label) {
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
  padding-bottom: 2px;
}
.roi-form :deep(.el-form-item) {
  margin-bottom: 0;
}
</style>