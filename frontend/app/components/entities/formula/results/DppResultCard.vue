<template>
  <div v-if="result">
    <!-- Natija bloki -->
    <div
      class="mb-6 rounded-xl border p-6"
      :class="result.dppFound ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
    >
      <!-- Sarlavha -->
      <div class="mb-1 flex items-center gap-3">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-full text-white"
          :class="result.dppFound ? 'bg-green-600' : 'bg-red-600'"
        >
          <Icon :name="result.dppFound ? 'lucide:check' : 'lucide:x'" class="h-6 w-6" />
        </span>
        <h2
          class="text-xl font-extrabold sm:text-2xl"
          :class="result.dppFound ? 'text-green-700' : 'text-red-600'"
        >
          {{ result.dppFound
            ? "Loyiha o'zini qoplaydi"
            : "Loyihani amalga oshirish tavsiya etilmaydi" }}
        </h2>
      </div>
      <p class="mb-5 ml-14 text-sm" :class="result.dppFound ? 'text-green-800' : 'text-red-800'">
        {{ result.dppFound
          ? "Kiritilgan sarmoya belgilangan muddat ichida to'liq qaytib keladi."
          : "Kiritilgan sarmoya belgilangan muddat ichida to'liq qaytmaydi." }}
      </p>

      <!-- 3 ta karta -->
      <div class="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div class="rounded-xl border border-red-100 bg-red-50/50 p-5 text-center">
          <div class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold text-red-700">
            <Icon name="lucide:wallet" class="h-5 w-5" /> Loyiha boshida kiritiladigan mablag'
          </div>
          <p class="text-3xl font-extrabold">{{ format(result.investment) }}</p>
          <p class="text-sm text-slate-500">mln so'm</p>
        </div>

        <Icon name="lucide:arrow-right" class="hidden h-6 w-6 text-slate-400 lg:block" />

        <div class="rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">
          <div
            class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold"
            :class="result.dppFound ? 'text-blue-700' : 'text-orange-600'"
          >
            <Icon name="lucide:coins" class="h-5 w-5" /> Yillik iqtisodiy samara
          </div>
          <p class="text-3xl font-extrabold">{{ format(result.cashFlow) }}</p>
          <p class="text-sm text-slate-500">mln so'm</p>
        </div>

        <Icon name="lucide:arrow-right" class="hidden h-6 w-6 text-slate-400 lg:block" />

        <div class="rounded-xl border border-slate-200 bg-white p-5">
          <div
            class="mb-1 flex items-center gap-2 text-sm font-semibold"
            :class="result.dppFound ? 'text-green-700' : 'text-red-700'"
          >
            <Icon name="lucide:clock" class="h-5 w-5" /> Natija
          </div>
          <p
            class="text-sm font-bold leading-relaxed"
            :class="result.dppFound ? 'text-green-700' : 'text-red-600'"
          >
            <template v-if="result.dppFound">
              Loyiha {{ formatYears(result.dpp) }} yilda o'zini to'liq
              qoplaydi.
            </template>
            <template v-else>
              Loyiha <span class="text-red-600">{{ result.maxYears }} yil</span>
              ichida o'zini to'liq qoplamaydi.
            </template>
          </p>
        </div>
      </div>

      <!-- Xulosa -->
      <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <p class="mb-1 font-bold" :class="result.dppFound ? 'text-green-700' : 'text-red-600'">
          Xulosa
        </p>
        <p class="text-sm font-semibold leading-relaxed">
          <template v-if="result.dppFound">
            Belgilangan {{ result.maxYears }} yillik muddat ichida sarflangan
            mablag' to'liq qaytib keladi.<br />
            Shuning uchun loyihani amalga oshirish maqsadga muvofiq.
          </template>
          <template v-else>
            Belgilangan {{ result.maxYears }} yillik muddat ichida sarflangan
            mablag' to'liq qaytmaydi.<br />
            Shuning uchun <span class="text-red-600">loyihani amalga oshirish tavsiya etilmaydi</span>.
          </template>
        </p>
      </div>
    </div>

    <!-- Info qatori -->
    <div class="mb-4 flex items-center gap-2.5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
      <Icon name="lucide:info" class="h-5 w-5 flex-none text-blue-600" />
      Hisoblash avtomatik ravishda amalga oshirildi. Formula va hisoblash
      jarayonini pastda ko'rishingiz mumkin.
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
        <h3 class="mb-3 text-base font-bold">Hisoblash jarayoni</h3>

        <p class="mb-1 font-semibold text-slate-800">
          PP = {{ result.pp.toFixed(2) }} yil
          <span class="text-sm font-normal text-slate-500">
            (oddiy qoplanish, inflyatsiyasiz: I₀ / CF)
          </span>
        </p>

        <p
          class="mb-4 flex items-center gap-1.5 font-semibold"
          :class="result.dppFound ? 'text-green-700' : 'text-red-600'"
        >
          <Icon
            :name="result.dppFound ? 'lucide:circle-check' : 'lucide:circle-x'"
            class="h-4 w-4 flex-none"
          />
          DPP =
          {{ result.dppFound
            ? result.dpp.toFixed(2) + " yil"
            : result.maxYears + " yilda qoplanmaydi" }}
          <span class="text-sm font-normal text-slate-500">
            ({{ result.rate }}% stavka hisobga olinganda)
          </span>
        </p>

        <pre class="whitespace-pre-wrap rounded-xl bg-blue-950 px-5 py-4 font-mono text-sm leading-6 text-slate-200">Yil | Diskont. CF | Yig'ilgan
----|-------------|-----------
<template v-for="row in result.rows" :key="row.year">{{ row.year }}   | {{ row.pv.toFixed(2) }}       | {{ row.cumulative.toFixed(2) }}{{ row.crossed ? "  ← shu yerda qoplandi" : "" }}
</template>----|-------------|-----------
I₀ = {{ result.investment.toFixed(2) }} mln so'm</pre>

        <p class="mt-3 text-sm text-slate-600">
          Inflyatsiyasiz pul {{ result.pp.toFixed(2) }} yilda qaytadi.
          {{ result.dppFound
            ? `${result.rate}% stavka (pulning real qiymati) hisobga olinganda — ${result.dpp.toFixed(2)} yilda.`
            : `${result.rate}% stavka hisobga olinganda loyiha ajratilgan ${result.maxYears} yil ichida qoplanishga ulgurmaydi — muddat yoki shartlarni qayta ko'rib chiqish kerak.` }}
        </p>
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
  return n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })
}

function formatYears(n) {
  return n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })
}
</script>
