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

    <DppResultCard :result="result" />
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
      maxYears,
      rate
    }
    emit('calculated', dppFound ? round2(dpp) : null, result.value)
  })
}

function reset() {
  Object.assign(form, DEFAULTS)
  result.value = null
  formRef.value?.clearValidate()
  emit('calculated', null, null)
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