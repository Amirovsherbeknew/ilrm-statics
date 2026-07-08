<template>
  <div v-if="result">
    <!-- Natija bloki -->
    <div
      class="mb-6 rounded-xl border p-6"
      :class="result.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
    >
      <!-- Sarlavha -->
      <div class="mb-1 flex items-center gap-3">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-full text-white"
          :class="result.ok ? 'bg-green-600' : 'bg-red-600'"
        >
          <Icon :name="result.ok ? 'lucide:check' : 'lucide:x'" class="h-6 w-6" />
        </span>
        <h2
          class="text-xl font-extrabold sm:text-2xl"
          :class="result.ok ? 'text-green-700' : 'text-red-600'"
        >
          {{ result.ok ? 'Loyihani amalga oshirish tavsiya etiladi' : 'Loyiha amalga oshirish tavsiya etilmaydi' }}
        </h2>
      </div>
      <p class="mb-5 ml-14 text-sm" :class="result.ok ? 'text-green-800' : 'text-red-800'">
        {{ result.ok
          ? 'Loyiha davlat uchun iqtisodiy jihatdan samarali.'
          : 'Loyiha davlat uchun iqtisodiy jihatdan samarasiz.' }}
      </p>

      <!-- 3 ta karta -->
      <div class="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div class="rounded-xl border border-red-100 bg-red-50/50 p-5 text-center">
          <div class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold text-red-700">
            <Icon name="lucide:wallet" class="h-5 w-5" /> Loyiha boshida kiritilgan mablag'
          </div>
          <p class="text-3xl font-extrabold">{{ format(result.initialCost) }}</p>
          <p class="text-sm text-slate-500">mln so'm</p>
        </div>

        <Icon name="lucide:arrow-right" class="hidden h-6 w-6 text-slate-400 lg:block" />

        <div class="rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">
          <div class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold text-blue-700">
            <Icon name="lucide:chart-column" class="h-5 w-5" /> Hisoblangan samaradorlik foizi
          </div>
          <p class="text-3xl font-extrabold">
            {{ result.eirr !== null ? formatPct(result.eirr) + ' %' : '—' }}
          </p>
        </div>

        <Icon name="lucide:arrow-right" class="hidden h-6 w-6 text-slate-400 lg:block" />

        <div class="rounded-xl border border-slate-200 bg-white p-5">
          <div
            class="mb-1 flex items-center gap-2 text-sm font-semibold"
            :class="result.ok ? 'text-green-700' : 'text-red-700'"
          >
            <span
              class="flex h-6 w-6 flex-none items-center justify-center rounded-full text-white"
              :class="result.ok ? 'bg-green-600' : 'bg-red-600'"
            >
              <Icon :name="result.ok ? 'lucide:check' : 'lucide:x'" class="h-4 w-4" />
            </span>
            Natija
          </div>
          <p
            class="text-sm font-bold leading-relaxed"
            :class="result.ok ? 'text-green-700' : 'text-red-600'"
          >
            {{ result.verdictShort }}
          </p>
        </div>
      </div>

      <!-- Xulosa -->
      <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <p class="mb-1 font-bold" :class="result.ok ? 'text-green-700' : 'text-red-600'">
          Xulosa
        </p>
        <p class="text-sm leading-relaxed">
          {{ result.verdictLong }}<br />
          {{ result.ok
            ? "Shuning uchun loyihani amalga oshirish tavsiya etiladi."
            : "Shuning uchun loyihani amalga oshirish tavsiya etilmaydi." }}
        </p>
      </div>
    </div>

    <!-- Info qatori -->
    <div class="mb-4 flex items-center gap-2.5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
      <Icon name="lucide:info" class="h-5 w-5 flex-none text-blue-600" />
      Hisoblash avtomatik ravishda bajarildi. Formula va hisoblash jarayonini
      ko'rishingiz mumkin.
    </div>

    <!-- Batafsil hisoblash -->
    <div class="text-center">
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
        @click="showDetails = !showDetails"
      >
        <Icon :name="showDetails ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="h-4 w-4" />
        {{ showDetails ? 'Batafsil hisoblashni yopish' : "Batafsil hisoblashni ko'rish" }}
      </button>

      <div v-if="showDetails" class="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-left">
        <h3 class="mb-4 text-base font-bold">Hisoblash jarayoni</h3>

        <pre class="mb-4 whitespace-pre-wrap rounded-xl bg-blue-950 px-5 py-4 font-mono text-sm leading-7 text-slate-200">
        EB₁           EB₂                 EBₙ
0 = ─────────── + ─────────── + ... + ─────────── − EC₀
    (1+EIRR)¹     (1+EIRR)²           (1+EIRR)ⁿ

EB  = Economic Benefits (davlat uchun iqtisodiy foyda)
EC₀ = Economic Costs (boshlang'ich iqtisodiy xarajat)

EIRR — NPV ni nolga tenglashtiruvchi foiz. U analitik topilmaydi,
shuning uchun bisektsiya (oraliqni ikkiga bo'lish) usuli bilan
taxminan hisoblanadi.</pre>

        <div class="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-lg bg-slate-100 p-4">
            <p class="text-slate-500">EC₀ (boshlang'ich xarajat)</p>
            <p class="text-lg font-bold">{{ format(result.initialCost) }} mln so'm</p>
          </div>
          <div class="rounded-lg bg-slate-100 p-4">
            <p class="text-slate-500">EB (yillik foyda) × n</p>
            <p class="text-lg font-bold">
              {{ format(result.annualBenefit) }} × {{ result.years }} yil
            </p>
          </div>
          <div class="rounded-lg bg-slate-100 p-4">
            <p class="text-slate-500">Hisoblangan EIRR</p>
            <p class="text-lg font-bold">
              {{ result.eirr !== null ? formatPct(result.eirr) + ' %' : 'topilmadi' }}
            </p>
          </div>
          <div class="rounded-lg bg-slate-100 p-4">
            <p class="text-slate-500">Taqqoslash</p>
            <p class="text-lg font-bold">
              {{ result.eirr !== null ? formatPct(result.eirr) : '—' }}%
              {{ result.ok ? '≥' : '<' }} {{ formatPct(result.minRate) }}%
              <span class="block text-xs font-normal text-slate-500">
                (kerakli foiz {{ formatPct(result.baseMinRate) }}% + xavf {{ formatPct(result.risk) }}%)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  result: {
    type: Object,
    default: null,
  },
});

const showDetails = ref(false);

function format(n) {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}

function formatPct(n) {
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
</script>
