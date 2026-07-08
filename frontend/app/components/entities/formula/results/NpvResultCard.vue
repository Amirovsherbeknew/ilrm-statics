<template>
  <div v-if="result">
    <!-- Natija bloki -->
    <div
      class="mb-6 rounded-xl border p-6"
      :class="result.npv >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
    >
      <!-- Sarlavha -->
      <div class="mb-1 flex items-center gap-3">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-full text-white"
          :class="result.npv >= 0 ? 'bg-green-600' : 'bg-red-600'"
        >
          <Icon :name="result.npv >= 0 ? 'lucide:check' : 'lucide:x'" class="h-6 w-6" />
        </span>
        <h2
          class="text-xl font-extrabold sm:text-2xl"
          :class="result.npv >= 0 ? 'text-green-700' : 'text-red-600'"
        >
          {{ result.npv >= 0 ? 'Loyihani amalga oshirish mumkin' : 'Loyiha iqtisodiy jihatdan foydali emas' }}
        </h2>
      </div>
      <p class="mb-5 ml-14 text-sm" :class="result.npv >= 0 ? 'text-green-800' : 'text-red-800'">
        {{ result.npv >= 0
          ? 'Loyiha iqtisodiy jihatdan foydali.'
          : "Loyihaga kiritilgan mablag' to'liq qoplanmaydi." }}
      </p>

      <!-- 3 ta karta -->
      <div class="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div class="rounded-xl border border-red-200 bg-white p-5 text-center">
          <div class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold text-red-700">
            <Icon name="lucide:wallet" class="h-5 w-5" /> Boshlang'ich mablag'
          </div>
          <p class="text-3xl font-extrabold">{{ format(result.investment) }}</p>
          <p class="text-sm text-slate-500">mln so'm</p>
        </div>

        <Icon name="lucide:arrow-right" class="hidden h-6 w-6 text-slate-400 lg:block" />

        <div class="rounded-xl border border-blue-200 bg-blue-50 p-5 text-center">
          <div class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold text-blue-700">
            <Icon name="lucide:chart-column" class="h-5 w-5" /> Bugungi qiymatdagi jami iqtisodiy samara
          </div>
          <p class="text-3xl font-extrabold text-blue-900">{{ format(result.sumPv) }}</p>
          <p class="text-sm text-slate-500">mln so'm</p>
        </div>

        <Icon name="lucide:arrow-right" class="hidden h-6 w-6 text-slate-400 lg:block" />

        <div
          class="rounded-xl border bg-white p-5 text-center"
          :class="result.npv >= 0 ? 'border-green-200' : 'border-red-200'"
        >
          <div
            class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold"
            :class="result.npv >= 0 ? 'text-green-700' : 'text-red-700'"
          >
            <Icon name="lucide:coins" class="h-5 w-5" />
            {{ result.npv >= 0 ? 'Sof iqtisodiy samara' : 'Sof iqtisodiy samara (zarar)' }}
          </div>
          <p
            class="text-3xl font-extrabold"
            :class="result.npv >= 0 ? 'text-green-700' : 'text-red-600'"
          >
            {{ result.npv >= 0 ? '+' : '−' }}{{ format(Math.abs(result.npv)) }}
          </p>
          <p class="text-sm text-slate-500">mln so'm</p>
        </div>
      </div>

      <!-- Xulosa -->
      <div v-if="result.summary" class="mt-4 rounded-xl border bg-white p-4" :class="result.npv >= 0 ? 'border-green-200' : 'border-red-200'">
        <p class="mb-1 font-bold" :class="result.npv >= 0 ? 'text-green-700' : 'text-red-600'">
          Xulosa
        </p>
        <p class="text-sm leading-relaxed">{{ result.summary }}</p>
      </div>
    </div>

    <!-- Info qatori -->
    <div class="mb-4 flex items-center gap-2.5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
      <Icon name="lucide:info" class="h-5 w-5 flex-none text-blue-600" />
      Diskontlash avtomatik tarzda bajarildi. Formula va hisoblash jarayonini
      pastda ko'rishingiz mumkin.
    </div>

    <!-- Batafsil hisob-kitob -->
    <div class="text-center">
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
        @click="showDetails = !showDetails"
      >
        <Icon :name="showDetails ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="h-4 w-4" />
        {{ showDetails ? "Batafsil hisob-kitobni yopish" : "Batafsil hisob-kitobni ko'rish" }}
      </button>

      <div v-if="showDetails" class="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-left">
        <h3 class="mb-4 text-base font-bold">Hisoblash jarayoni</h3>

        <pre class="whitespace-pre-wrap rounded-xl bg-blue-950 px-5 py-4 font-mono text-sm leading-6 text-slate-200">{{ result.formulaLine }}

r = {{ result.r.toFixed(2) }}%  →  bo'luvchi = {{ (1 + result.r / 100).toFixed(2) }}

Yil | Koeffitsiyent | Diskont. CF
----|---------------|------------
<template v-for="row in result.rows" :key="row.year">{{ row.year }}   | {{ row.coef.toFixed(2) }}          | {{ row.pv.toFixed(2) }} mln
</template>----|---------------|------------
Σ PV = {{ result.sumPv.toFixed(2) }} mln
NPV  = {{ result.sumPv.toFixed(2) }} − {{ result.investment.toFixed(2) }} = {{ result.npv.toFixed(2) }} mln</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  result: {
    type: Object,
    default: null,
  },
})

const showDetails = ref(false)

function format(n) {
  return n.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
</script>
