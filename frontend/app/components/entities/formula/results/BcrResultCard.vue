<template>
  <div v-if="result">
    <!-- Natija bloki -->
    <div
      class="mb-6 rounded-xl border p-6"
      :class="{
        'border-green-200 bg-green-50': result.status === 'good',
        'border-amber-200 bg-amber-50': result.status === 'neutral',
        'border-red-200 bg-red-50': result.status === 'bad',
      }"
    >
      <!-- Xulosa sarlavhasi -->
      <div class="mb-1 flex items-center gap-3">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-full text-white"
          :class="{
            'bg-green-600': result.status === 'good',
            'bg-amber-500': result.status === 'neutral',
            'bg-red-600': result.status === 'bad',
          }"
        >
          <Icon
            :name="result.status === 'good' ? 'lucide:check' : result.status === 'neutral' ? 'lucide:minus' : 'lucide:x'"
            class="h-6 w-6"
          />
        </span>
        <h2
          class="text-xl font-extrabold sm:text-2xl"
          :class="{
            'text-green-700': result.status === 'good',
            'text-amber-700': result.status === 'neutral',
            'text-red-600': result.status === 'bad',
          }"
        >
          {{ result.headline }}
        </h2>
      </div>
      <p
        class="mb-5 ml-14 text-sm"
        :class="{
          'text-green-800': result.status === 'good',
          'text-amber-800': result.status === 'neutral',
          'text-red-800': result.status === 'bad',
        }"
      >
        {{ result.status === 'good'
          ? 'Loyiha davlat uchun iqtisodiy jihatdan samarali.'
          : result.status === 'neutral'
            ? 'Loyiha foyda ham, zarar ham keltirmaydi.'
            : 'Loyiha davlat uchun iqtisodiy jihatdan samarasiz.' }}
      </p>

      <!-- 3 ta karta: samara -> xarajat -> natija -->
      <div class="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div class="rounded-xl border border-slate-200 bg-white p-5 text-center">
          <div
            class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold"
            :class="{
              'text-green-700': result.status === 'good',
              'text-amber-700': result.status === 'neutral',
              'text-red-700': result.status === 'bad',
            }"
          >
            <Icon name="lucide:wallet" class="h-5 w-5" /> Iqtisodiy samara
          </div>
          <p class="text-3xl font-extrabold">{{ format(result.benefit) }}</p>
          <p class="text-sm text-slate-500">mln so'm</p>
        </div>

        <Icon name="lucide:arrow-right" class="hidden h-6 w-6 text-slate-400 lg:block" />

        <div class="rounded-xl border border-slate-200 bg-white p-5 text-center">
          <div
            class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold"
            :class="{
              'text-green-700': result.status === 'good',
              'text-amber-700': result.status === 'neutral',
              'text-orange-600': result.status === 'bad',
            }"
          >
            <Icon name="lucide:coins" class="h-5 w-5" /> Yillik xarajat
          </div>
          <p class="text-3xl font-extrabold">{{ format(result.cost) }}</p>
          <p class="text-sm text-slate-500">mln so'm</p>
        </div>

        <Icon name="lucide:arrow-right" class="hidden h-6 w-6 text-slate-400 lg:block" />

        <div class="rounded-xl border border-slate-200 bg-white p-5">
          <div
            class="mb-1 flex items-center gap-2 text-sm font-semibold"
            :class="{
              'text-green-700': result.status === 'good',
              'text-amber-700': result.status === 'neutral',
              'text-red-700': result.status === 'bad',
            }"
          >
            <Icon
              :name="result.status === 'bad' ? 'lucide:trending-down' : 'lucide:trending-up'"
              class="h-5 w-5"
            />
            Natija
          </div>
          <p class="text-sm font-semibold leading-relaxed">
            Har 1 so'm xarajatga
            <span
              class="text-2xl font-extrabold"
              :class="{
                'text-green-700': result.status === 'good',
                'text-amber-700': result.status === 'neutral',
                'text-red-600': result.status === 'bad',
              }"
            >{{ formatBcr(result.bcr) }}</span>
            so'm iqtisodiy samara to'g'ri keladi.
          </p>
        </div>
      </div>

      <!-- Xulosa matni -->
      <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <div class="flex items-start gap-2.5">
          <Icon
            :name="result.status === 'good' ? 'lucide:circle-check' : result.status === 'neutral' ? 'lucide:triangle-alert' : 'lucide:circle-x'"
            class="mt-0.5 h-5 w-5 flex-none"
            :class="{
              'text-green-600': result.status === 'good',
              'text-amber-500': result.status === 'neutral',
              'text-red-600': result.status === 'bad',
            }"
          />
          <div class="text-sm leading-relaxed">
            <p
              class="mb-1 font-bold"
              :class="{
                'text-green-700': result.status === 'good',
                'text-amber-700': result.status === 'neutral',
                'text-red-600': result.status === 'bad',
              }"
            >
              Xulosa
            </p>
            <p>
              Har 1 so'm xarajat evaziga {{ formatBcr(result.bcr) }} so'm
              iqtisodiy samara olinadi.<br />
              {{ result.recommendation }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Info qatori -->
    <div class="mb-4 flex items-center gap-2.5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
      <Icon name="lucide:info" class="h-5 w-5 flex-none text-blue-600" />
      Hisoblash avtomatik ravishda amalga oshirildi. Formula va diskontlash
      usuli ADB talablariga muvofiq.
    </div>

    <!-- Batafsil hisoblash -->
    <div class="text-center">
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
        @click="showDetails = !showDetails"
      >
        <Icon :name="showDetails ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="h-4 w-4" />
        {{ showDetails ? 'Batafsil hisob-kitobni yopish' : "Batafsil hisob-kitobni ko'rish" }}
      </button>

      <div v-if="showDetails" class="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-left">
        <h3 class="mb-4 text-base font-bold">Hisoblash jarayoni</h3>

        <pre class="mb-4 whitespace-pre-wrap rounded-xl bg-blue-950 px-5 py-4 font-mono text-sm leading-7 text-slate-200">
BCR = PV(Foyda) / PV(Xarajat)

PV = CF x (1 - (1 + r)^-n) / r   (har yilgi oqim bir xil bo'lganda)
r = {{ result.rate }}% (inflyatsiya) + {{ result.risk }}% (xavf) = {{ result.r.toFixed(2) }}%</pre>

        <div class="grid gap-3 text-sm sm:grid-cols-3">
          <div class="rounded-lg bg-slate-100 p-4">
            <p class="text-slate-500">PV (Foyda)</p>
            <p class="text-lg font-bold">{{ format(result.pvBenefits) }} mln so'm</p>
          </div>
          <div class="rounded-lg bg-slate-100 p-4">
            <p class="text-slate-500">PV (Xarajat)</p>
            <p class="text-lg font-bold">{{ format(result.pvCosts) }} mln so'm</p>
          </div>
          <div class="rounded-lg bg-slate-100 p-4">
            <p class="text-slate-500">BCR</p>
            <p class="text-lg font-bold">
              {{ format(result.pvBenefits) }} / {{ format(result.pvCosts) }} =
              {{ result.bcr.toFixed(3) }}
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

function formatBcr(n) {
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
}
</script>
