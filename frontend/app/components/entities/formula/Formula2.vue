<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="bg-blue-950 rounded-xl p-6 flex items-start gap-4 mb-6">
      <div class="bg-white/10 rounded-lg px-4 py-3 text-white font-bold text-lg shrink-0">
        IRR
      </div>
      <div>
        <h2 class="text-white font-semibold text-xl mb-1">Внутренняя норма доходности</h2>
        <p class="text-blue-200 text-sm">
          Максимальный процент кредита который проект способен выдержать
        </p>
      </div>
    </div>


    <!-- Calculator -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div class="flex items-center gap-1 mb-1">
        <el-icon class="text-blue-800"><ArrowRight /></el-icon>
        <h3 class="text-blue-900 font-semibold text-base">
          Калькулятор IRR — метод автоматического подбора
        </h3>
      </div>
      <p class="text-sm text-gray-400 mb-5">
        Введи параметры проекта и банковскую ставку. Система сама найдёт IRR и скажет — выгоден ли кредит.
      </p>

      <el-form :model="form" label-position="top" class="irr-form">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          <el-form-item label="Инвестиции I₀ (млн)">
            <el-input v-model.number="form.investment" type="number" placeholder="100" />
          </el-form-item>

          <el-form-item label="Денежный поток CF (млн/год)">
            <el-input v-model.number="form.cashFlow" type="number" placeholder="30" />
          </el-form-item>

          <el-form-item label="Срок проекта (лет)">
            <el-input v-model.number="form.years" type="number" placeholder="5" />
          </el-form-item>

          <el-form-item label="Ставка банка (%) — для сравнения">
            <el-input v-model.number="form.bankRate" type="number" placeholder="18" />
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
        :class="result.status === 'ok'
          ? (result.irr >= form.bankRate ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200')
          : 'bg-yellow-50 border-yellow-200'"
      >
        <template v-if="result.status === 'ok'">
          <p
            class="font-semibold mb-3"
            :class="result.irr >= form.bankRate ? 'text-green-700' : 'text-red-700'"
          >
            {{ result.irr >= form.bankRate ? '✅ Кредит выгоден.' : '❌ Кредит невыгоден.' }}
            IRR = {{ result.irr.toFixed(2) }}%
          </p>

          <pre class="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-6">0 = CF × [Σ 1/(1+IRR)^t] − I₀,  t = 1..{{ form.years }}

Найденная методом подбора ставка:
IRR = {{ result.irr.toFixed(2) }}%

Сравнение со ставкой банка:
IRR ({{ result.irr.toFixed(2) }}%)  {{ result.irr >= form.bankRate ? '>' : '<' }}  ставка банка ({{ form.bankRate }}%)

Запас прочности = {{ (result.irr - form.bankRate).toFixed(2) }} процентных пункта</pre>

          <p class="text-sm text-gray-600 mt-3">
            Проект способен выдержать кредит максимум под {{ result.irr.toFixed(2) }}% годовых.
            {{ result.irr >= form.bankRate
              ? `Банковская ставка ${form.bankRate}% ниже этого предела — брать кредит выгодно.`
              : `Банковская ставка ${form.bankRate}% выше этого предела — брать кредит невыгодно.` }}
          </p>
        </template>

        <template v-else>
          <p class="font-semibold text-yellow-700">
            ⚠️ IRR не найден
          </p>
          <p class="text-sm text-gray-600 mt-2">
            Даже при ставке дисконтирования 0% суммарный денежный поток не покрывает инвестиции.
            Проект убыточен независимо от процентной ставки.
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

const form = reactive({
  investment: 100,
  cashFlow: 30,
  years: 5,
  bankRate: 18
})

const result = ref(null)

// NPV(rate) — kerakli funksiya, rate 0..1 oralig'ida (masalan 0.18 = 18%)
function npvAt(rate, investment, cashFlow, years) {
  let sum = 0
  for (let t = 1; t <= years; t++) {
    sum += cashFlow / Math.pow(1 + rate, t)
  }
  return sum - investment
}

// IRR ni bisection (ikkiga bo'lish) usuli bilan topish
function findIRR(investment, cashFlow, years) {
  // 0% stavkada ham loyiha o'zini oqlamasa — IRR mavjud emas
  if (npvAt(0, investment, cashFlow, years) < 0) {
    return null
  }

  let low = 0
  let high = 10 // 1000% gacha qidiramiz — amalda yetarli

  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2
    const npv = npvAt(mid, investment, cashFlow, years)
    if (npv > 0) {
      low = mid
    } else {
      high = mid
    }
  }

  return (low + high) / 2
}

function calculate() {
  const irrDecimal = findIRR(form.investment, form.cashFlow, form.years)

  if (irrDecimal === null) {
    result.value = { status: 'none' }
    return
  }

  result.value = {
    status: 'ok',
    irr: irrDecimal * 100
  }
}

function reset() {
  form.investment = 100
  form.cashFlow = 30
  form.years = 5
  form.bankRate = 18
  result.value = null
}
</script>

<style scoped>
.irr-form :deep(.el-form-item__label) {
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
  padding-bottom: 2px;
}
.irr-form :deep(.el-form-item) {
  margin-bottom: 0;
}
</style>