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

    <NpvResultCard :result="results[active]" />
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
    subtitle: "",
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
    results[key].summary = calc.summary(f, results[key])

    emit('calculated', round2(npv), results[key])
  })
}

function reset(key) {
  const calc = calculators.find((c) => c.key === key)
  forms[key] = buildDefaultForm(calc)
  results[key] = null
  formRef.value?.clearValidate()
  emit('calculated', null, null)
}

function switchCalc(key) {
  active.value = key
  formRef.value?.clearValidate()
  emit('calculated', results[key] ? round2(results[key].npv) : null, results[key] || null)
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