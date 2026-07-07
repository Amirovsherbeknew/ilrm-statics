<template>
  <section class="max-w-6xl bg-white rounded-[16px] px-4 py-8 font-sans text-slate-900">
    <!-- Switcher (segmented buttons) -->
    <div class="mb-6 flex flex-wrap gap-2">
      <button
        v-for="calc in calculators?.filter(resp => list?.includes(resp?.key))"
        :key="calc.key"
        class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
        :class="active === calc.key
          ? 'border-blue-950 bg-blue-950 text-white'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
        @click="switchCalc(calc.key)"
      >
        {{ calc.shortTitle }}
      </button>
    </div>

    <!-- Kalkulyator kartasi -->
    <div class="mb-6 rounded-xl border border-slate-200 bg-white p-6">
      <div class="mb-1 flex items-center gap-2.5">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Icon name="lucide:calculator" class="h-5 w-5" />
        </span>
        <h2 class="text-[28px] font-bold">Loyiha iqtisodiy baholash kalkulyatori</h2>
      </div>
      <p class="mb-5 text-sm text-slate-500">{{ current.subtitle }}</p>

      <el-form ref="formRef" :model="forms[active]" :rules="rules" label-position="top" class="npv-form">
        <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-2">
          <div v-for="field in current.fields" :key="field.key">
            <el-form-item :prop="field.key">
              <template #label>
                {{ field.label }} <span class="text-red-500">*</span>
              </template>
              <el-input
                v-model.number="forms[active][field.key]"
                type="number"
                :placeholder="`Masalan: ${field.default}`"
              />
            </el-form-item>
            <p v-if="field.hint" class="mt-1.5 text-xs text-slate-500">
              {{ field.hint }}
            </p>
            <!-- Xavf darajasi legendasi (faqat xavf maydonlari uchun) -->
            <div
              v-if="RISK_FIELD_KEYS.includes(field.key)"
              class="mt-1.5 space-y-0.5 text-xs"
            >
              <p><span class="font-semibold text-green-600">1–4%</span> — past xavf</p>
              <p><span class="font-semibold text-amber-500">5–14%</span> — o'rtacha xavf</p>
              <p><span class="font-semibold text-red-600">15% va yuqori</span> — yuqori xavf</p>
            </div>
          </div>
        </div>

        <div class="mt-4 flex gap-3">
          <el-button type="primary" class="!bg-blue-800 !border-blue-800" @click="calculate(active)">
            <Icon name="lucide:calculator" class="mr-1.5 h-4 w-4" /> Hisoblash
          </el-button>
          <el-button @click="reset(active)">
            <Icon name="lucide:trash-2" class="mr-1.5 h-4 w-4" /> Tozalash
          </el-button>
        </div>
      </el-form>
    </div>

    <!-- Natija bloki -->
    <div
      v-if="results[active]"
      class="mb-6 rounded-xl border p-6"
      :class="results[active].npv >= 0
        ? 'border-green-200 bg-green-50'
        : 'border-red-200 bg-red-50'"
    >
      <!-- Sarlavha -->
      <div class="mb-1 flex items-center gap-3">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-full text-white"
          :class="results[active].npv >= 0 ? 'bg-green-600' : 'bg-red-600'"
        >
          <Icon
            :name="results[active].npv >= 0 ? 'lucide:check' : 'lucide:x'"
            class="h-6 w-6"
          />
        </span>
        <h2
          class="text-xl font-extrabold sm:text-2xl"
          :class="results[active].npv >= 0 ? 'text-green-700' : 'text-red-600'"
        >
          {{ results[active].npv >= 0
            ? 'Loyihani amalga oshirish mumkin'
            : 'Loyiha iqtisodiy jihatdan foydali emas' }}
        </h2>
      </div>
      <p
        class="mb-5 ml-14 text-sm"
        :class="results[active].npv >= 0 ? 'text-green-800' : 'text-red-800'"
      >
        {{ results[active].npv >= 0
          ? 'Loyiha iqtisodiy jihatdan foydali.'
          : "Loyihaga kiritilgan mablag' to'liq qoplanmaydi." }}
      </p>

      <!-- 3 ta karta -->
      <div class="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div class="rounded-xl border border-red-200 bg-white p-5 text-center">
          <div class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold text-red-700">
            <Icon name="lucide:wallet" class="h-5 w-5" /> Boshlang'ich mablag'
          </div>
          <p class="text-3xl font-extrabold">{{ format(results[active].investment) }}</p>
          <p class="text-sm text-slate-500">mln so'm</p>
        </div>

        <Icon name="lucide:arrow-right" class="hidden h-6 w-6 text-slate-400 lg:block" />

        <div class="rounded-xl border border-blue-200 bg-blue-50 p-5 text-center">
          <div class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold text-blue-700">
            <Icon name="lucide:chart-column" class="h-5 w-5" /> Bugungi qiymatdagi jami iqtisodiy samara
          </div>
          <p class="text-3xl font-extrabold text-blue-900">{{ format(results[active].sumPv) }}</p>
          <p class="text-sm text-slate-500">mln so'm</p>
        </div>

        <Icon name="lucide:arrow-right" class="hidden h-6 w-6 text-slate-400 lg:block" />

        <div
          class="rounded-xl border bg-white p-5 text-center"
          :class="results[active].npv >= 0 ? 'border-green-200' : 'border-red-200'"
        >
          <div
            class="mb-1 flex items-center justify-center gap-2 text-sm font-semibold"
            :class="results[active].npv >= 0 ? 'text-green-700' : 'text-red-700'"
          >
            <Icon name="lucide:coins" class="h-5 w-5" />
            {{ results[active].npv >= 0 ? 'Sof iqtisodiy samara' : 'Sof iqtisodiy samara (zarar)' }}
          </div>
          <p
            class="text-3xl font-extrabold"
            :class="results[active].npv >= 0 ? 'text-green-700' : 'text-red-600'"
          >
            {{ results[active].npv >= 0 ? '+' : '−' }}{{ format(Math.abs(results[active].npv)) }}
          </p>
          <p class="text-sm text-slate-500">mln so'm</p>
        </div>
      </div>

      <!-- Xulosa -->
      <div
        class="mt-4 rounded-xl border bg-white p-4"
        :class="results[active].npv >= 0 ? 'border-green-200' : 'border-red-200'"
      >
        <p class="mb-1 font-bold" :class="results[active].npv >= 0 ? 'text-green-700' : 'text-red-600'">
          Xulosa
        </p>
        <p class="text-sm leading-relaxed">
          {{ current.summary(forms[active], results[active]) }}
        </p>
      </div>
    </div>

    <!-- Info qatori -->
    <div
      v-if="results[active]"
      class="mb-4 flex items-center gap-2.5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800"
    >
      <Icon name="lucide:info" class="h-5 w-5 flex-none text-blue-600" />
      Diskontlash avtomatik tarzda bajarildi. Formula va hisoblash jarayonini
      pastda ko'rishingiz mumkin.
    </div>

    <!-- Batafsil hisob-kitob -->
    <div v-if="results[active]" class="text-center">
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
        <h3 class="mb-4 text-base font-bold">Hisoblash jarayoni</h3>

        <pre class="whitespace-pre-wrap rounded-xl bg-blue-950 px-5 py-4 font-mono text-sm leading-6 text-slate-200">{{ results[active].formulaLine }}

r = {{ results[active].r.toFixed(2) }}%  →  bo'luvchi = {{ (1 + results[active].r / 100).toFixed(2) }}

Yil | Koeffitsiyent | Diskont. CF
----|---------------|------------
<template v-for="row in results[active].rows" :key="row.year">{{ row.year }}   | {{ row.coef.toFixed(2) }}          | {{ row.pv.toFixed(2) }} mln
</template>----|---------------|------------
Σ PV = {{ results[active].sumPv.toFixed(2) }} mln
NPV  = {{ results[active].sumPv.toFixed(2) }} − {{ forms[active].investment.toFixed(2) }} = {{ results[active].npv.toFixed(2) }} mln</pre>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const props = defineProps({
  list:{
    type:Array,
    default:['credit','ownFunds','government','wacc']
  }
})

const emit = defineEmits(['calculated'])

// ---------- Konfiguratsiya: har bir kalkulyator o'z formulasi bilan ----------
const calculators = [
  {
    key: 'credit',
    shortTitle: 'Bank krediti',
    title: 'NPV kalkulyatori — Bank krediti',
    subtitle: "r avtomatik hisoblanadi: kredit stavkasi + loyiha xavfi",
    fields: [
      { key: 'rate', label: 'Kredit stavkasi (%)', hint: '', default: 18 },
      { key: 'risk', label: 'Loyiha xavfi (%)', hint: '', default: 5 },
      { key: 'investment', label: "Investitsiya I₀ (mln)", hint: "Boshlang'ich qo'yilma", default: 90 },
      { key: 'cashFlow', label: 'Pul oqimi CF (mln/yil)', hint: 'Yillik daromad minus xarajat', default: 30 },
      { key: 'years', label: 'Loyiha muddati (yil)', hint: 'Yillar soni', default: 3 }
    ],
    getR: (f) => f.rate + f.risk,
    rFormula: (f, r) => `r = ${f.rate}% (kredit) + ${f.risk}% (xavf) = ${r}%`,
    summary: (f, res) =>
      `Kredit stavkasi ${f.rate}% va xavf ${f.risk}% bo'lganda loyiha ${res.npv >= 0 ? 'real foyda' : 'zarar'} keltiradi: ${Math.abs(res.npv).toFixed(2)} mln so'm. ${res.npv >= 0 ? 'Kredit olish foydali.' : 'Kredit olish foydali emas.'}`
  },
  {
    key: 'ownFunds',
    shortTitle: "O'z mablag'lari",
    title: "NPV kalkulyatori — O'z mablag'lari",
    subtitle: "r = depozit stavkasi + loyiha xavfi (boy berilgan foyda)",
    fields: [
      { key: 'deposit', label: 'Depozit stavkasi (%)', hint: '', default: 15 },
      { key: 'risk', label: 'Loyiha xavfi (%)', hint: '', default: 5 },
      { key: 'investment', label: "Investitsiya I₀ (mln)", hint: "Boshlang'ich qo'yilma", default: 90 },
      { key: 'cashFlow', label: 'Pul oqimi CF (mln/yil)', hint: 'Yillik daromad minus xarajat', default: 30 },
      { key: 'years', label: 'Loyiha muddati (yil)', hint: 'Yillar soni', default: 3 }
    ],
    getR: (f) => f.deposit + f.risk,
    rFormula: (f, r) => `r = ${f.deposit}% (depozit) + ${f.risk}% (xavf) = ${r}%`,
    summary: (f, res) =>
      `Depozit stavkasi ${f.deposit}% va xavf ${f.risk}% bo'lganda loyiha depozit bilan solishtirganda ${res.npv >= 0 ? 'real foyda' : 'zarar'} keltiradi: ${Math.abs(res.npv).toFixed(2)} mln so'm. ${res.npv >= 0 ? "O'z mablag'ini kiritish foydali." : "Pulni depozitda qoldirish foydaliroq."}`
  },
  {
    key: 'government',
    shortTitle: 'Davlat loyihasi',
    title: 'NPV kalkulyatori — Davlat loyihasi',
    subtitle: '',
    fields: [
      { key: 'inflation', label: 'Yillik inflyatsiya (%)', hint: '', default: 9 },
      { key: 'countryRisk', label: 'Mamlakatdagi xavf darajasi (%)', hint: "Investitsiyaga ta'sir qilishi mumkin bo'lgan mamlakatdagi iqtisodiy va siyosiy xavf darajasi.", default: 3 },
      { key: 'investment', label: "Loyiha boshida kiritiladigan mablag' (mln so'm)", hint: "", default: 800 },
      { key: 'cashFlow', label: "Loyihadan kutilayotgan yillik iqtisodiy samara (mln so'm)", hint: "Barcha xarajatlar hisobga olingandan keyin kutilayotgan yillik iqtisodiy samara.", default: 150 },
      { key: 'years', label: 'Loyiha necha yil davom etadi? (Yil)', hint: '', default: 10 }
    ],
    getR: (f) => f.inflation + f.countryRisk,
    rFormula: (f, r) => `r = ${f.inflation}% (inflyatsiya) + ${f.countryRisk}% (mamlakat xavfi) = ${r}%`,
    summary: (f, res) =>
      res.npv >= 0
        ? `Loyiha xarajatlarni qoplaydi va davlatga qo'shimcha ${res.npv.toFixed(2)} mln so'm sof foyda keltiradi.`
        : `Loyihaga kiritilgan mablag' to'liq qoplanmaydi. ${Math.abs(res.npv).toFixed(2)} mln so'm zarar keltiradi.`
  },
  {
    key: 'wacc',
    shortTitle: 'WACC orqali',
    title: 'NPV kalkulyatori — WACC orqali (aralash moliyalashtirish)',
    subtitle: "Pulning bir qismi o'z mablag', bir qismi kredit bo'lganda. WACC avtomatik hisoblanadi.",
    fields: [
      { key: 'equity', label: "O'z kapitali (mln)", hint: '', default: 70 },
      { key: 'debt', label: 'Kredit (mln)', hint: '', default: 30 },
      { key: 'costEquity', label: "O'z kapitali qiymati (%)", hint: '', default: 15 },
      { key: 'costDebt', label: 'Kredit qiymati (%)', hint: '', default: 20 },
      { key: 'investment', label: 'Investitsiya I₀ (mln)', hint: '', default: 100 },
      { key: 'cashFlow', label: 'Pul oqimi CF (mln/yil)', hint: '', default: 30 },
      { key: 'years', label: 'Loyiha muddati (yil)', hint: '', default: 5 }
    ],
    getR: (f) => {
      const total = f.equity + f.debt
      if (!total) return 0
      return (f.equity / total) * f.costEquity + (f.debt / total) * f.costDebt
    },
    rFormula: (f, r) => {
      const total = f.equity + f.debt
      return `WACC = (${f.equity}/${total}) × ${f.costEquity}% + (${f.debt}/${total}) × ${f.costDebt}% = ${r.toFixed(2)}%`
    },
    summary: (f, res) =>
      `WACC ${res.r.toFixed(2)}% (o'z kapitali ${f.equity} mln + kredit ${f.debt} mln) bo'lganda loyiha ${res.npv >= 0 ? 'real foyda' : 'zarar'} keltiradi: ${Math.abs(res.npv).toFixed(2)} mln so'm. ${res.npv >= 0 ? 'Aralash moliyalashtirish foydali.' : 'Aralash moliyalashtirish foydali emas.'}`
  }
]

// ---------- State ----------
const active = ref(props.list[0])
const showDetails = ref(false)
const formRef = ref(null)

const current = computed(() => calculators.find((c) => c.key === active.value))

// "Xavf" turidagi maydonlar 25% dan oshmasligi kerak.
const RISK_FIELD_KEYS = ['risk', 'countryRisk']

const rules = computed(() => {
  const result = {}
  current.value.fields.forEach((field) => {
    const isRiskField = RISK_FIELD_KEYS.includes(field.key)
    result[field.key] = [
      { required: true, message: `${field.label} kiritilishi shart`, trigger: 'blur' },
      isRiskField
        ? { type: 'number', min: 0, max: 25, message: `${field.label} 0 dan 25 gacha bo'lishi kerak`, trigger: 'blur' }
        : { type: 'number', min: 0, message: "Manfiy bo'lmagan son kiriting", trigger: 'blur' },
    ]
  })
  return result
})

function buildDefaultForm(calc) {
  const obj = {}
  calc.fields.forEach((f) => (obj[f.key] = null))
  return obj
}

const forms = reactive(
  Object.fromEntries(calculators.map((c) => [c.key, buildDefaultForm(c)]))
)

const results = reactive(Object.fromEntries(calculators.map((c) => [c.key, null])))

// ---------- Logic ----------
async function calculate(key) {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (!valid) return

    const calc = calculators.find((c) => c.key === key)
    const f = forms[key]

    const r = calc.getR(f)
    const rDecimal = r / 100

    const rows = []
    let sumPv = 0

    for (let year = 1; year <= f.years; year++) {
      const coef = Math.pow(1 + rDecimal, year)
      const pv = f.cashFlow / coef
      sumPv += pv
      rows.push({ year, coef, pv })
    }

    const npv = sumPv - f.investment

    results[key] = {
      r,
      rows,
      sumPv,
      npv,
      investment: f.investment,
      formulaLine: calc.rFormula(f, r)
    }
    showDetails.value = false
    emit('calculated', round2(npv))
  })
}

function reset(key) {
  const calc = calculators.find((c) => c.key === key)
  forms[key] = buildDefaultForm(calc)
  results[key] = null
  showDetails.value = false
  formRef.value?.clearValidate()
  emit('calculated', null)
}

function switchCalc(key) {
  active.value = key
  showDetails.value = false
  formRef.value?.clearValidate()
  emit('calculated', results[key] ? round2(results[key].npv) : null)
}

function format(n) {
  return n.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
</script>

<style scoped>
.npv-form :deep(.el-form-item__label) {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  padding-bottom: 2px;
  line-height: 1.35;
}
.npv-form :deep(.el-form-item) {
  margin-bottom: 0;
}
.npv-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 4px 12px;
}
</style>