<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-4">PI — Profitability Index</h1>



    <!-- Calculator -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div class="flex items-center gap-1 mb-5">
        <el-icon class="text-blue-800"><ArrowRight /></el-icon>
        <h3 class="text-blue-900 font-semibold text-base">Калькулятор PI</h3>
      </div>

      <el-form :model="form" label-position="top" class="pi-form">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          <el-form-item label="Инвестиции I₀ (млн)">
            <el-input v-model.number="form.investment" type="number" placeholder="90" />
          </el-form-item>

          <el-form-item label="Денежный поток CF (млн/год)">
            <el-input v-model.number="form.cashFlow" type="number" placeholder="30" />
          </el-form-item>

          <el-form-item label="Ставка дисконтирования r (%)">
            <el-input v-model.number="form.rate" type="number" placeholder="15" />
          </el-form-item>

          <el-form-item label="Срок проекта (лет)">
            <el-input v-model.number="form.years" type="number" placeholder="5" />
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
        :class="result.pi >= 1 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
      >
        <p
          class="font-semibold mb-3"
          :class="result.pi >= 1 ? 'text-green-700' : 'text-red-700'"
        >
          {{ result.pi >= 1 ? '✅' : '❌' }} PI = {{ result.pi.toFixed(2) }} —
          {{ result.pi > 1 ? 'проект выгоден' : (result.pi === 1 ? 'проект безубыточен' : 'проект убыточен') }}
        </p>

        <pre class="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-6">Сумма дисконтированных CF:
r = {{ form.rate.toFixed(2) }}%  →  делитель = {{ (1 + form.rate / 100).toFixed(2) }}

Год | Коэффициент | CF дисконт.
----|-------------|------------
<template v-for="row in result.rows" :key="row.year">{{ row.year }}   | {{ row.coef.toFixed(2) }}        | {{ row.pv.toFixed(2) }} млн
</template>----|-------------|------------
Σ PV = {{ result.sumPv.toFixed(2) }} млн

PI = {{ result.sumPv.toFixed(2) }} / {{ form.investment.toFixed(2) }} = {{ result.pi.toFixed(2) }}</pre>

        <p class="text-sm text-gray-600 mt-3">
          На каждый вложенный сум проект приносит {{ result.pi.toFixed(2) }} сума.
          {{ result.pi >= 1
            ? `Прибыль: ${((result.pi - 1) * 100).toFixed(2)}% сверх вложений.`
            : `Убыток: ${((1 - result.pi) * 100).toFixed(2)}% от вложений.` }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

const form = reactive({
  investment: 90,
  cashFlow: 30,
  rate: 15,
  years: 5
})

const result = ref(null)

function calculate() {
  const { investment, cashFlow, rate, years } = form
  const rDecimal = rate / 100

  const rows = []
  let sumPv = 0

  for (let year = 1; year <= years; year++) {
    const coef = Math.pow(1 + rDecimal, year)
    const pv = cashFlow / coef
    sumPv += pv
    rows.push({ year, coef, pv })
  }

  const pi = sumPv / investment

  result.value = { rows, sumPv, pi }
}

function reset() {
  form.investment = 90
  form.cashFlow = 30
  form.rate = 15
  form.years = 5
  result.value = null
}
</script>

<style scoped>
.pi-form :deep(.el-form-item__label) {
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
  padding-bottom: 2px;
}
.pi-form :deep(.el-form-item) {
  margin-bottom: 0;
}
</style>