<template>
  <section class="mx-auto max-w-6xl bg-white rounded-[16px] px-4 py-8 font-sans text-slate-900">
  

    <!-- Kalkulyator -->
    <div class="mb-6 rounded-xl border border-slate-200 bg-white p-6">
      <div class="mb-1 flex items-center gap-2.5">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Icon name="lucide:calculator" class="h-5 w-5" />
        </span>
        <h2 class="text-[28px] font-bold">Loyiha o‘zini oqlashi uchun kerakli eng kam samaradorlik foizi</h2>
      </div>
      <p class="mb-5 text-sm text-slate-600">
        Ma'lumotlarni kiriting. Tizim samaradorlik foizini hisoblaydi va
        belgilangan eng kam foiz bilan solishtiradi.
      </p>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          <el-form-item prop="initialCost">
            <template #label>
              <span class="inline-flex items-center gap-2">
                <span class="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-blue-600 text-white">
                  <Icon name="lucide:wallet" class="h-4 w-4" />
                </span>
                Loyiha boshida kiritiladigan mablag' (mln so'm)
              </span>
            </template>
            <el-input v-model.number="form.initialCost" type="number" placeholder="Masalan: 800" />
            <p class="mt-1.5 text-xs text-slate-500">
              Loyihani boshlash uchun sarflanadigan jami mablag'.
            </p>
          </el-form-item>

          <el-form-item prop="annualBenefit">
            <template #label>
              <span class="inline-flex items-center gap-2">
                <span class="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-green-600 text-white">
                  <Icon name="lucide:coins" class="h-4 w-4" />
                </span>
                Loyihadan kutilayotgan yillik iqtisodiy samara (mln so'm)
              </span>
            </template>
            <el-input v-model.number="form.annualBenefit" type="number" placeholder="Masalan: 150" />
            <p class="mt-1.5 text-xs text-slate-500">
              Barcha xarajatlar hisobga olingandan keyin kutilayotgan yillik
              iqtisodiy samara.
            </p>
          </el-form-item>

          <el-form-item prop="years">
            <template #label>
              <span class="inline-flex items-center gap-2">
                <span class="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-green-600 text-white">
                  <Icon name="lucide:calendar-days" class="h-4 w-4" />
                </span>
                Loyiha necha yil davom etadi? (yil)
              </span>
            </template>
            <el-input v-model.number="form.years" type="number" placeholder="Masalan: 10" />
            <p class="mt-1.5 text-xs text-slate-500">
              Loyiha amal qiladigan yillar soni.
            </p>
          </el-form-item>

          <el-form-item prop="minRate">
            <template #label>
              <span class="inline-flex items-center gap-2">
                <span class="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-purple-700 text-white">
                  <Icon name="lucide:percent" class="h-4 w-4" />
                </span>
                Loyihani amalga oshirish uchun kerakli eng kam foiz (%)
              </span>
            </template>
            <el-input v-model.number="form.minRate" type="number" step="0.1" placeholder="Masalan: 12" />
            <p class="mt-1.5 text-xs text-slate-500">
              Hisoblangan foiz shu ko'rsatkich bilan solishtiriladi.
            </p>
          </el-form-item>

          <el-form-item prop="risk">
            <template #label>
              <span class="inline-flex items-center gap-2">
                <span class="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-red-500 text-white">
                  <Icon name="lucide:shield-alert" class="h-4 w-4" />
                </span>
                Xavf darajasi (%)
              </span>
            </template>
            <el-input v-model.number="form.risk" type="number" step="0.1" placeholder="Masalan: 5" />
            <p class="mt-1.5 text-xs text-slate-500">
              Loyiha xavfi — 25% dan oshmasligi kerak.
            </p>
          </el-form-item>
        </div>
      </el-form>

      <div class="mt-5 flex flex-wrap gap-3">
        <button
          class="flex items-center gap-2 rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          @click="calculate"
        >
          <Icon name="lucide:calculator" class="h-4 w-4" /> Hisoblash
        </button>
        <button
          class="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
          @click="reset"
        >
          <Icon name="lucide:trash-2" class="h-4 w-4" /> Tozalash
        </button>
      </div>

      <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
    </div>

    <EirrResultCard :result="result" />
  </section>
</template>

<script setup>
import { ref, reactive } from "vue";

const emit = defineEmits(["calculated"]);

/* --- Boshlang'ich qiymatlar (bo'sh — foydalanuvchi o'zi kiritadi) --- */
const DEFAULTS = { initialCost: null, annualBenefit: null, years: null, minRate: null, risk: null };

const formRef = ref(null);
const form = reactive({ ...DEFAULTS });

const rules = {
  initialCost: [
    { required: true, message: "Boshlang'ich mablag'ni kiriting", trigger: "blur" },
    { type: "number", min: 0.01, message: "Boshlang'ich mablag' noldan katta bo'lishi kerak", trigger: "blur" },
  ],
  annualBenefit: [
    { required: true, message: "Yillik foydani kiriting", trigger: "blur" },
    { type: "number", min: 0.01, message: "Yillik foyda noldan katta bo'lishi kerak", trigger: "blur" },
  ],
  years: [
    { required: true, message: "Loyiha muddatini kiriting", trigger: "blur" },
    { type: "number", min: 1, message: "Loyiha muddati kamida 1 yil bo'lishi kerak", trigger: "blur" },
  ],
  minRate: [
    { required: true, message: "Kerakli eng kam foizni kiriting", trigger: "blur" },
    { type: "number", min: 0, message: "Manfiy bo'lmagan son kiriting", trigger: "blur" },
  ],
  risk: [
    { required: true, message: "Xavf darajasini kiriting", trigger: "blur" },
    { type: "number", min: 0, max: 25, message: "Xavf darajasi 0 dan 25 gacha bo'lishi kerak", trigger: "blur" },
  ],
};

const result = ref(null);
const error = ref("");

/**
 * NPV funksiyasi: berilgan r stavkada
 *   NPV(r) = Σ EB / (1 + r)^t  −  EC₀ ,  t = 1..n
 */
function npv(r, ec0, eb, n) {
  let sum = 0;
  for (let t = 1; t <= n; t++) {
    sum += eb / Math.pow(1 + r, t);
  }
  return sum - ec0;
}

/**
 * EIRR ni bisektsiya usuli bilan topish:
 * NPV(EIRR) = 0 bo'ladigan r qidiriladi.
 * Oraliq: -99% dan 1000% gacha. Yechim topilmasa null qaytadi.
 */
function solveEirr(ec0, eb, n) {
  let lo = -0.99;
  let hi = 10;

  let fLo = npv(lo, ec0, eb, n);
  let fHi = npv(hi, ec0, eb, n);

  // Ildiz shu oraliqda bo'lishi uchun ishoralar har xil bo'lishi kerak
  if (fLo * fHi > 0) return null;

  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fMid = npv(mid, ec0, eb, n);

    if (Math.abs(fMid) < 1e-9) return mid;

    if (fLo * fMid < 0) {
      hi = mid;
    } else {
      lo = mid;
      fLo = fMid;
    }
  }
  return (lo + hi) / 2;
}

async function calculate() {
  error.value = "";
  result.value = null;

  if (!formRef.value) return;

  await formRef.value.validate((valid) => {
    if (!valid) return;

    const eirr = solveEirr(form.initialCost, form.annualBenefit, form.years);

    if (eirr === null) {
      error.value =
        "Bu ma'lumotlar bilan EIRR topilmadi — yillik foyda boshlang'ich xarajatni umuman qoplamaydi.";
      return;
    }

    const eirrPct = eirr * 100;
    const effectiveMinRate = form.minRate + form.risk;
    const ok = eirrPct >= effectiveMinRate;

    result.value = {
      initialCost: form.initialCost,
      annualBenefit: form.annualBenefit,
      years: form.years,
      baseMinRate: form.minRate,
      risk: form.risk,
      minRate: effectiveMinRate,
      eirr: eirrPct,
      ok,
      verdictShort: ok
        ? `Hisoblangan foiz talab qilinadigan eng kam foizdan yuqori (${formatPct(eirrPct)}% ≥ ${formatPct(effectiveMinRate)}%)`
        : `Hisoblangan foiz talab qilinadigan eng kam foizdan past (${formatPct(eirrPct)}% < ${formatPct(effectiveMinRate)}%)`,
      verdictLong: ok
        ? `Hisoblangan foiz talab qilinadigan eng kam foizdan yuqori (${formatPct(eirrPct)}% ≥ ${formatPct(effectiveMinRate)}%).`
        : `Hisoblangan foiz talab qilinadigan eng kam foizdan past (${formatPct(eirrPct)}% < ${formatPct(effectiveMinRate)}%).`,
    };
    emit("calculated", round2(eirrPct), result.value);
  });
}

function reset() {
  Object.assign(form, DEFAULTS);
  formRef.value?.clearValidate();
  result.value = null;
  error.value = "";
  emit("calculated", null, null);
}

function formatPct(n) {
  // 13,43 ko'rinishida (vergul bilan)
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
</script>