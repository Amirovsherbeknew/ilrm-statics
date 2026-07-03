<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
    <!-- Header -->
    <div class="flex items-center gap-1 mb-1">
      <el-icon class="text-blue-800"><ArrowRight /></el-icon>
      <h3 class="text-blue-900 font-semibold text-base">
        Калькулятор NPV — Собственные средства
      </h3>
    </div>
    <p class="text-sm text-gray-400 mb-5">
      r = депозитная ставка + риск проекта (упущенная выгода)
    </p>

    <!-- Form -->
    <el-form :model="form" label-position="top" class="npv-form">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
        <el-form-item label="Депозитная ставка (%)">
          <el-input v-model.number="form.deposit" type="number" placeholder="15" />
          <span class="text-xs text-gray-400 mt-1">Например: 15</span>
        </el-form-item>

        <el-form-item label="Риск проекта (%)">
          <el-input v-model.number="form.risk" type="number" placeholder="5" />
          <span class="text-xs text-gray-400 mt-1">Например: 5</span>
        </el-form-item>

        <el-form-item label="Инвестиции I₀ (млн)">
          <el-input v-model.number="form.investment" type="number" placeholder="90" />
          <span class="text-xs text-gray-400 mt-1">Начальные вложения</span>
        </el-form-item>

        <el-form-item label="Денежный поток CF (млн/год)">
          <el-input v-model.number="form.cashFlow" type="number" placeholder="30" />
          <span class="text-xs text-gray-400 mt-1">Доход минус расходы в год</span>
        </el-form-item>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 mt-1">
        <el-form-item label="Срок проекта (лет)">
          <el-input v-model.number="form.years" type="number" placeholder="3" />
          <span class="text-xs text-gray-400 mt-1">Количество лет</span>
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
      :class="result.npv >= 0
        ? 'bg-green-50 border-green-200'
        : 'bg-red-50 border-red-200'"
    >
      <p
        class="font-semibold mb-3"
        :class="result.npv >= 0 ? 'text-green-700' : 'text-red-700'"
      >
        {{ result.npv >= 0 ? '✅ Проект выгоден.' : '❌ Проект невыгоден.' }}
        NPV = {{ result.npv >= 0 ? '+' : '' }}{{ result.npv.toFixed(2) }} млн сум
      </p>

      <pre class="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-6">r = {{ form.deposit }}% (депозит) + {{ form.risk }}% (риск) = {{ result.r }}%

r = {{ result.r.toFixed(2) }}%  →  делитель = {{ (1 + result.r / 100).toFixed(2) }}

Год | Коэффициент | CF дисконт.
----|-------------|------------
<template v-for="row in result.rows" :key="row.year">{{ row.year }}   | {{ row.coef.toFixed(2) }}        | {{ row.pv.toFixed(2) }} млн
</template>----|-------------|------------
Σ PV = {{ result.sumPv.toFixed(2) }} млн
NFV  = {{ result.sumPv.toFixed(2) }} - {{ form.investment.toFixed(2) }} = {{ result.npv.toFixed(2) }} млн</pre>

      <p class="text-sm text-gray-600 mt-3">
        При депозитной ставке {{ form.deposit }}% и риске {{ form.risk }}% проект приносит
        {{ result.npv >= 0 ? 'реальную прибыль' : 'убыток' }}
        {{ Math.abs(result.npv).toFixed(2) }} млн сум по сравнению с депозитом.
        {{ result.npv >= 0 ? 'Вкладывать собственные средства выгодно.' : 'Выгоднее оставить деньги на депозите.' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

const form = reactive({
  deposit: 15,
  risk: 5,
  investment: 90,
  cashFlow: 30,
  years: 3
})

const result = ref(null)

function calculate() {
  const r = (form.deposit || 0) + (form.risk || 0)
  const rDecimal = r / 100

  const rows = []
  let sumPv = 0

  for (let year = 1; year <= form.years; year++) {
    const coef = Math.pow(1 + rDecimal, year)
    const pv = form.cashFlow / coef
    sumPv += pv
    rows.push({ year, coef, pv })
  }

  const npv = sumPv - form.investment

  result.value = { r, rows, sumPv, npv }
}

function reset() {
  form.deposit = 15
  form.risk = 5
  form.investment = 90
  form.cashFlow = 30
  form.years = 3
  result.value = null
}
</script>

<style scoped>
.npv-form :deep(.el-form-item__label) {
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
  padding-bottom: 2px;
}
.npv-form :deep(.el-form-item) {
  margin-bottom: 0;
}
</style>