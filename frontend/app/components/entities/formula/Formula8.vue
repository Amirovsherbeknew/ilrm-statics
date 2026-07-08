<template>
  <section class="mx-auto max-w-6xl bg-white rounded-[16px] px-4 py-8 font-sans text-slate-900">
    

    <!-- Kalkulyator -->
    <div class="mb-6 rounded-xl border border-slate-200 bg-white p-6">
      <div class="mb-5 flex items-center gap-2.5">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Icon name="lucide:calculator" class="h-5 w-5" />
        </span>
        <h2 class="text-[28px] font-bold">Har 1 so’mga qancha foyda to’g’ri kelishini hisoblash kalkulyatori</h2>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          <el-form-item label="Loyihadan kutilayotgan yillik iqtisodiy samara (mln so'm)" prop="benefit">
            <el-input v-model.number="form.benefit" type="number" placeholder="Masalan: 150" />
            <p class="mt-1.5 text-xs text-slate-500">
              Barcha xarajatlar hisobga olingandan keyin kutilayotgan yillik
              iqtisodiy samara.
            </p>
          </el-form-item>

          <el-form-item label="Yillik xarajat (mln so'm)" prop="cost">
            <el-input v-model.number="form.cost" type="number" placeholder="Masalan: 100" />
            <p class="mt-1.5 text-xs text-slate-500">
              Bir yildagi jami xarajat.
            </p>
          </el-form-item>

          <el-form-item label="Yillik inflyatsiya (%)" prop="rate">
            <el-input v-model.number="form.rate" type="number" step="0.1" placeholder="Masalan: 12" />
            <p class="mt-1.5 text-xs text-slate-500">
              Kelajakdagi mablag'ni bugungi qiymatga keltirish uchun
              qo'llaniladi.
            </p>
          </el-form-item>

          <el-form-item label="Xavf darajasi (%)" prop="risk">
            <el-input v-model.number="form.risk" type="number" step="0.1" placeholder="Masalan: 5" />
            <p class="mt-1.5 text-xs text-slate-500">
              Loyiha xavfi — 25% dan oshmasligi kerak.
            </p>
          </el-form-item>

          <el-form-item label="Loyiha necha yil davom etadi? (yil)" prop="years">
            <el-input v-model.number="form.years" type="number" placeholder="Masalan: 10" />
            <p class="mt-1.5 text-xs text-slate-500">
              Loyiha amal qiladigan yillar soni.
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
          <Icon name="lucide:rotate-ccw" class="h-4 w-4" /> Tozalash
        </button>
      </div>

      <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
    </div>

    <BcrResultCard :result="result" />
  </section>
</template>

<script setup>
import { ref, reactive } from "vue";

const emit = defineEmits(["calculated"]);

/* --- Boshlang'ich qiymatlar (bo'sh — foydalanuvchi o'zi kiritadi) --- */
const DEFAULTS = { benefit: null, cost: null, rate: null, risk: null, years: null };

const formRef = ref(null);
const form = reactive({ ...DEFAULTS });

const rules = {
  benefit: [
    { required: true, message: "Yillik foydani kiriting", trigger: "blur" },
    { type: "number", min: 0, message: "Manfiy bo'lmagan son kiriting", trigger: "blur" },
  ],
  cost: [
    { required: true, message: "Yillik xarajatni kiriting", trigger: "blur" },
    { type: "number", min: 0.01, message: "Xarajat noldan katta bo'lishi kerak", trigger: "blur" },
  ],
  rate: [
    { required: true, message: "Foizni kiriting", trigger: "blur" },
    { type: "number", min: 0, message: "Manfiy bo'lmagan son kiriting", trigger: "blur" },
  ],
  risk: [
    { required: true, message: "Xavf darajasini kiriting", trigger: "blur" },
    { type: "number", min: 0, max: 25, message: "Xavf darajasi 0 dan 25 gacha bo'lishi kerak", trigger: "blur" },
  ],
  years: [
    { required: true, message: "Loyiha muddatini kiriting", trigger: "blur" },
    { type: "number", min: 1, message: "Loyiha muddati kamida 1 yil bo'lishi kerak", trigger: "blur" },
  ],
};

const result = ref(null);
const error = ref("");

/**
 * Diskontlangan qiymat (Present Value).
 * Har bir yil uchun: CF / (1 + r)^t, t = 1..n
 */
function presentValue(cashFlow, r, n) {
  if (r === 0) return cashFlow * n; // diskontsiz holat
  let pv = 0;
  for (let t = 1; t <= n; t++) {
    pv += cashFlow / Math.pow(1 + r, t);
  }
  return pv;
}

async function calculate() {
  error.value = "";
  result.value = null;

  if (!formRef.value) return;

  await formRef.value.validate((valid) => {
    if (!valid) return;

    const rPct = form.rate + form.risk;
    const r = rPct / 100;
    const pvBenefits = presentValue(form.benefit, r, form.years);
    const pvCosts = presentValue(form.cost, r, form.years);
    const bcr = pvBenefits / pvCosts;

    // --- Qoidaga ko'ra xulosa ---
    let status, headline, recommendation;
    if (bcr > 1) {
      status = "good";
      headline = "Loyihani amalga oshirish mumkin";
      recommendation = "Shuning uchun loyihani amalga oshirish tavsiya etiladi.";
    } else if (bcr === 1) {
      status = "neutral";
      headline = "Loyiha foyda ham, zarar ham keltirmaydi";
      recommendation = "Qaror boshqa omillarga qarab qabul qilinishi kerak.";
    } else {
      status = "bad";
      headline = "Loyihani amalga oshirish tavsiya etilmaydi";
      recommendation = "Chunki xarajatlar foydadan yuqori — loyiha zararli.";
    }

    result.value = {
      bcr,
      pvBenefits,
      pvCosts,
      r: rPct,
      status,
      headline,
      recommendation,
      benefit: form.benefit,
      cost: form.cost,
      rate: form.rate,
      risk: form.risk,
    };
    emit("calculated", round2(bcr), result.value);
  });
}

function reset() {
  Object.assign(form, DEFAULTS);
  formRef.value?.clearValidate();
  result.value = null;
  error.value = "";
  emit("calculated", null, null);
}
</script>