<template>
  <section class="mx-auto max-w-6xl bg-white rounded-[16px] px-4 py-8 font-sans text-slate-900">


    

    <!-- Kalkulyator -->
    <div class="mb-6 rounded-xl border border-slate-200 bg-white p-6">
      <div class="mb-5 flex items-center gap-2.5">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Icon name="lucide:calculator" class="h-5 w-5" />
        </span>
        <h2 class="text-[28px] font-bold">Loyihaning qoplanish muddatini hisoblash kalkulyatori</h2>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="pp-form">
        <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-2">
          <div>
            <el-form-item prop="investment">
              <template #label>
                Loyiha boshida kiritiladigan mablag' (mln so'm)
                <span class="text-red-500">*</span>
              </template>
              <el-input v-model.number="form.investment" type="number" placeholder="Masalan: 90" />
            </el-form-item>
            <!-- <p class="mt-1.5 text-xs text-slate-500">
              Loyihaga kiritiladigan umumiy mablag'.
            </p> -->
          </div>

          <div>
            <el-form-item prop="cashFlow">
              <template #label>
                Loyihadan kutilayotgan yillik iqtisodiy samara (mln so'm)
                <span class="text-red-500">*</span>
              </template>
              <el-input v-model.number="form.cashFlow" type="number" placeholder="Masalan: 30" />
            </el-form-item>
            <p class="mt-1.5 text-xs text-slate-500">
              Barcha xarajatlar hisobga olingandan keyin kutilayotgan yillik
              iqtisodiy samara.
            </p>
          </div>

          <div>
            <el-form-item prop="rate">
              <template #label>
                Yillik inflyatsiya (%)
                <span class="text-red-500">*</span>
              </template>
              <el-input v-model.number="form.rate" type="number" placeholder="Masalan: 15" />
            </el-form-item>
          </div>

          <div>
            <el-form-item prop="maxYears">
              <template #label>
                Loyiha necha yil davom etadi? (yil)
                <span class="text-red-500">*</span>
              </template>
              <el-input v-model.number="form.maxYears" type="number" placeholder="Masalan: 10" />
            </el-form-item>
            <!-- <p class="mt-1.5 text-xs text-slate-500">
              Loyihani baholash uchun maksimal yillar soni.
            </p> -->
          </div>
        </div>

        <div class="mt-4 flex gap-3">
          <el-button type="primary" class="!bg-blue-800 !border-blue-800" @click="calculate">
            <Icon name="lucide:calculator" class="mr-1.5 h-4 w-4" /> Hisoblash
          </el-button>
          <el-button @click="reset">
            <Icon name="lucide:rotate-ccw" class="mr-1.5 h-4 w-4" /> Tozalash
          </el-button>
        </div>
      </el-form>
    </div>

    <!-- Natija bloki -->
    <div
      v-if="result"
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
    <div
      v-if="result"
      class="mb-4 flex items-center gap-2.5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800"
    >
      <Icon name="lucide:info" class="h-5 w-5 flex-none text-blue-600" />
      Hisoblash avtomatik ravishda amalga oshirildi. Formula va hisoblash
      jarayonini pastda ko'rishingiz mumkin.
    </div>

    <!-- Batafsil hisob-kitob -->
    <div v-if="result" class="text-center">
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
        @click="showDetails = !showDetails"
      >
        <Icon :name="showDetails ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="h-4 w-4" />
        {{ showDetails ? "Batafsil hisob-kitobni yopish" : "Batafsil hisob-kitobni ko'rish" }}
      </button>

      <div
        v-if="showDetails"
        class="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-left"
      >
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
            ({{ form.rate }}% stavka hisobga olinganda)
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
            ? `${form.rate}% stavka (pulning real qiymati) hisobga olinganda — ${result.dpp.toFixed(2)} yilda.`
            : `${form.rate}% stavka hisobga olinganda loyiha ajratilgan ${result.maxYears} yil ichida qoplanishga ulgurmaydi — muddat yoki shartlarni qayta ko'rib chiqish kerak.` }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['calculated'])

const DEFAULTS = {
  investment: null,
  cashFlow: null,
  rate: null,
  maxYears: null
}

const formRef = ref(null)
const form = reactive({ ...DEFAULTS })

const rules = {
  investment: [
    { required: true, message: "Boshlang'ich sarmoyani kiriting", trigger: 'blur' },
    { type: 'number', min: 0.01, message: "Boshlang'ich sarmoya noldan katta bo'lishi kerak", trigger: 'blur' },
  ],
  cashFlow: [
    { required: true, message: 'Yillik sof foydani kiriting', trigger: 'blur' },
    { type: 'number', min: 0.01, message: "Yillik sof foyda noldan katta bo'lishi kerak", trigger: 'blur' },
  ],
  rate: [
    { required: true, message: 'Foiz stavkasini kiriting', trigger: 'blur' },
    { type: 'number', min: 0, message: "Manfiy bo'lmagan son kiriting", trigger: 'blur' },
  ],
  maxYears: [
    { required: true, message: 'Loyiha muddatini kiriting', trigger: 'blur' },
    { type: 'number', min: 1, message: 'Loyiha muddati kamida 1 yil bo\'lishi kerak', trigger: 'blur' },
  ],
}

const result = ref(null)
const showDetails = ref(false)

async function calculate() {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (!valid) return

    const { investment, cashFlow, rate, maxYears } = form
    const rDecimal = rate / 100

    // ---- PP: oddiy (diskontsiz) okupaemost ----
    const pp = investment / cashFlow

    // ---- DPP: diskontlangan pul oqimlari yig'indisi orqali ----
    const rows = []
    let cumulative = 0
    let dpp = null
    let dppFound = false

    for (let year = 1; year <= maxYears; year++) {
      const pv = cashFlow / Math.pow(1 + rDecimal, year)
      const prevCumulative = cumulative
      cumulative += pv

      let crossed = false

      if (!dppFound && cumulative >= investment) {
        // shu yil ichida investitsiya qoplanadi — aniqroq (kasr) qiymatni topamiz
        const remaining = investment - prevCumulative
        const fraction = remaining / pv
        dpp = (year - 1) + fraction
        dppFound = true
        crossed = true
      }

      rows.push({ year, pv, cumulative, crossed })
    }

    result.value = {
      pp,
      dpp,
      dppFound,
      rows,
      investment,
      cashFlow,
      maxYears
    }
    showDetails.value = false
    emit('calculated', dppFound ? round2(dpp) : null)
  })
}

function reset() {
  Object.assign(form, DEFAULTS)
  result.value = null
  showDetails.value = false
  formRef.value?.clearValidate()
  emit('calculated', null)
}

function format(n) {
  return n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })
}

function formatYears(n) {
  // butun bo'lsa "3", kasr bo'lsa "4,29" ko'rinishida
  return n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })
}
</script>

<style scoped>
.pp-form :deep(.el-form-item__label) {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  padding-bottom: 2px;
  line-height: 1.35;
}
.pp-form :deep(.el-form-item) {
  margin-bottom: 0;
}
.pp-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 4px 12px;
}
</style>