<template>
  <section class="mx-auto max-w-6xl bg-white rounded-[16px] px-4 py-8 font-sans text-slate-900">
    <!-- Sarlavha -->
    <p class="mb-1 text-xs font-bold uppercase tracking-widest text-blue-600">
      Formula 10
    </p>
    <h1 class="mb-5 text-3xl font-extrabold text-slate-900 sm:text-4xl">
      EIRR — Iqtisodiy ichki daromadlilik normasi
    </h1>

    <!-- To'q ko'k banner -->
    <div class="mb-6 flex items-center gap-4 rounded-xl bg-blue-950 px-5 py-4 text-white">
      <span class="rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-bold">EIRR</span>
      <div>
        <p class="font-bold">Loyiha davlat uchun foydalimi?</p>
        <p class="mt-0.5 text-sm text-blue-200">
          Bu hisob-kitob loyihaning davlat uchun iqtisodiy jihatdan samarali
          yoki samarasiz ekanligini ko'rsatadi.
        </p>
      </div>
    </div>

    <!-- Qanday ishlaydi -->
    <div class="mb-6 rounded-xl border-2 border-blue-200 bg-white p-6">
      <div class="mb-5 flex items-center gap-4">
        <span
          class="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-blue-700 text-white"
        >
          <Icon name="lucide:target" class="h-7 w-7" />
        </span>
        <h2 class="text-lg font-bold leading-snug sm:text-xl">
          Tizim loyihaning samaradorlik foizini hisoblaydi va belgilangan eng
          kam foiz bilan <span class="text-blue-600">solishtiradi</span>.
        </h2>
      </div>

      <div class="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div class="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <span class="text-3xl font-extrabold text-blue-600">1</span>
          <p class="text-sm font-semibold">Samaradorlik foizi hisoblanadi</p>
        </div>
        <Icon name="lucide:arrow-right" class="hidden h-6 w-6 text-blue-400 lg:block" />
        <div class="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <span class="text-3xl font-extrabold text-blue-600">2</span>
          <p class="text-sm font-semibold">
            Belgilangan eng kam foiz bilan solishtiriladi
          </p>
        </div>
        <Icon name="lucide:arrow-right" class="hidden h-6 w-6 text-blue-400 lg:block" />
        <div class="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <span class="text-3xl font-extrabold text-blue-600">3</span>
          <p class="text-sm font-semibold">
            Loyihani amalga oshirish mumkin yoki mumkin emasligi aniqlanadi
          </p>
        </div>
      </div>
    </div>

    <!-- 4 ta info karta -->
    <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-slate-200 bg-white p-5">
        <div class="mb-3 flex items-center gap-2.5">
          <Icon name="lucide:trending-up" class="h-6 w-6 text-green-600" />
          <h3 class="font-bold">Nimani ko'rsatadi?</h3>
        </div>
        <p class="text-sm leading-relaxed text-slate-700">
          Loyiha davlat uchun qanchalik foydali ekanligini baholaydi.
        </p>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5">
        <div class="mb-3 flex items-center gap-2.5">
          <Icon name="lucide:target" class="h-6 w-6 text-purple-600" />
          <h3 class="font-bold">Taqqoslash foizi</h3>
        </div>
        <p class="text-sm leading-relaxed text-slate-700">
          Hisoblangan foiz shu ko'rsatkich bilan taqqoslanadi.
        </p>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5">
        <div class="mb-3 flex items-center gap-2.5">
          <Icon name="lucide:landmark" class="h-6 w-6 text-blue-600" />
          <h3 class="font-bold">Qaysi loyihalar uchun?</h3>
        </div>
        <p class="text-sm leading-relaxed text-slate-700">
          Yo'l, maktab, shifoxona va boshqa davlat loyihalari.
        </p>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5">
        <div class="mb-3 flex items-center gap-2.5">
          <Icon name="lucide:scale" class="h-6 w-6 text-orange-500" />
          <h3 class="font-bold">Farqi nimada?</h3>
        </div>
        <p class="text-sm leading-relaxed text-slate-700">
          Davlat uchun umumiy iqtisodiy samarani baholaydi.
        </p>
      </div>
    </div>

    <!-- Kalkulyator -->
    <div class="mb-6 rounded-xl border border-slate-200 bg-white p-6">
      <div class="mb-1 flex items-center gap-2.5">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Icon name="lucide:calculator" class="h-5 w-5" />
        </span>
        <h2 class="text-lg font-bold">EIRR kalkulyatori — Davlat loyihalari</h2>
      </div>
      <p class="mb-5 text-sm text-slate-600">
        Ma'lumotlarni kiriting. Tizim samaradorlik foizini hisoblaydi va
        belgilangan eng kam foiz bilan solishtiradi.
      </p>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

    <!-- Natija bloki -->
    <div
      v-if="result"
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
    <div
      v-if="result"
      class="mb-4 flex items-center gap-2.5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800"
    >
      <Icon name="lucide:info" class="h-5 w-5 flex-none text-blue-600" />
      Hisoblash avtomatik ravishda bajarildi. Formula va hisoblash jarayonini
      ko'rishingiz mumkin.
    </div>

    <!-- Batafsil hisoblash -->
    <div v-if="result" class="text-center">
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
        @click="showDetails = !showDetails"
      >
        <Icon :name="showDetails ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="h-4 w-4" />
        {{ showDetails ? 'Batafsil hisoblashni yopish' : "Batafsil hisoblashni ko'rish" }}
      </button>

      <div
        v-if="showDetails"
        class="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-left"
      >
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
const showDetails = ref(false);

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
  showDetails.value = false;

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
    emit("calculated", round2(eirrPct));
  });
}

function reset() {
  Object.assign(form, DEFAULTS);
  formRef.value?.clearValidate();
  result.value = null;
  error.value = "";
  showDetails.value = false;
  emit("calculated", null);
}

function format(n) {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}

function formatPct(n) {
  // 13,43 ko'rinishida (vergul bilan)
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
</script>