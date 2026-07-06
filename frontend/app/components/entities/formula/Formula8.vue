<template>
  <section class="mx-auto max-w-6xl bg-white rounded-[16px] px-4 py-8 font-sans text-slate-900">
    <!-- Sarlavha -->
    <p class="mb-1 text-xs font-bold uppercase tracking-widest text-blue-600">
      Formula 8
    </p>
    <h1 class="mb-5 text-3xl font-extrabold text-white sm:text-4xl">
      BCR — Har 1 so'm xarajat qancha foyda keltiradi?
    </h1>

    <!-- To'q ko'k banner -->
    <div class="mb-6 flex items-center gap-4 rounded-xl bg-blue-950 px-5 py-4 text-white">
      <span class="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold">BCR</span>
      <p class="text-sm font-semibold sm:text-base">
        Bu hisob-kitob har 1 so'm xarajat evaziga qancha so'm foyda olinishini
        ko'rsatadi.
      </p>
    </div>

    <!-- 4 ta info karta -->
    <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-slate-200 bg-white p-5">
        <div class="mb-3 flex items-center gap-2.5">
          <Icon name="lucide:trending-up" class="h-6 w-6 text-green-600" />
          <h3 class="font-bold">Nimani ko'rsatadi?</h3>
        </div>
        <p class="text-sm leading-relaxed text-slate-700">
          Har 1 so'm xarajat qancha foyda keltirishini baholaydi.
        </p>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5">
        <div class="mb-3 flex items-center gap-2.5">
          <Icon name="lucide:target" class="h-6 w-6 text-purple-600" />
          <h3 class="font-bold">Qoida</h3>
        </div>
        <ul class="space-y-2 text-sm leading-relaxed text-slate-700">
          <li class="flex items-start gap-2">
            <Icon name="lucide:circle-check" class="mt-0.5 h-4 w-4 flex-none text-green-600" />
            <span>1 dan yuqori — loyiha foydali</span>
          </li>
          <li class="flex items-start gap-2">
            <Icon name="lucide:circle-minus" class="mt-0.5 h-4 w-4 flex-none text-amber-500" />
            <span>1 ga teng — foyda ham, zarar ham yo'q</span>
          </li>
          <li class="flex items-start gap-2">
            <Icon name="lucide:circle-x" class="mt-0.5 h-4 w-4 flex-none text-red-600" />
            <span>1 dan past — loyiha zararli</span>
          </li>
        </ul>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5">
        <div class="mb-3 flex items-center gap-2.5">
          <Icon name="lucide:landmark" class="h-6 w-6 text-blue-600" />
          <h3 class="font-bold">Qaysi loyihalar uchun?</h3>
        </div>
        <p class="text-sm leading-relaxed text-slate-700">
          Yo'l, maktab, shifoxona va boshqa davlat loyihalari uchun.
        </p>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5">
        <div class="mb-3 flex items-center gap-2.5">
          <Icon name="lucide:scale" class="h-6 w-6 text-orange-500" />
          <h3 class="font-bold">Farqi nimada?</h3>
        </div>
        <p class="text-sm leading-relaxed text-slate-700">
          Har 1 so'm xarajatga qancha foyda to'g'ri kelishini ko'rsatadi.
        </p>
      </div>
    </div>

    <!-- Formula banneri -->
    <div
      class="mb-6 flex flex-col gap-4 rounded-xl bg-blue-950 px-6 py-5 text-white sm:flex-row sm:items-center"
    >
      <div class="flex flex-none items-center gap-3">
        <span class="text-lg font-bold">BCR =</span>
        <div class="text-center font-bold">
          <p class="border-b-2 border-white px-2 pb-1">PV (Foyda)</p>
          <p class="px-2 pt-1">PV (Xarajat)</p>
        </div>
      </div>
      <div class="space-y-1.5 text-sm leading-relaxed sm:border-l sm:border-blue-800 sm:pl-6">
        <p>
          <span class="font-bold">PV (Foyda)</span> — barcha yillar bo'yicha
          keltirilgan (diskontlangan) foydalar yig'indisi
        </p>
        <p>
          <span class="font-bold">PV (Xarajat)</span> — barcha yillar bo'yicha
          keltirilgan (diskontlangan) xarajatlar yig'indisi
        </p>
      </div>
    </div>

    <!-- Kalkulyator -->
    <div class="mb-6 rounded-xl border border-slate-200 bg-white p-6">
      <div class="mb-5 flex items-center gap-2.5">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Icon name="lucide:calculator" class="h-5 w-5" />
        </span>
        <h2 class="text-lg font-bold">BCR kalkulyatori</h2>
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

    <!-- Natija bloki -->
    <div
      v-if="result"
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
          <p class="text-3xl font-extrabold">{{ format(form.benefit) }}</p>
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
          <p class="text-3xl font-extrabold">{{ format(form.cost) }}</p>
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
    <div
      v-if="result"
      class="mb-4 flex items-center gap-2.5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800"
    >
      <Icon name="lucide:info" class="h-5 w-5 flex-none text-blue-600" />
      Hisoblash avtomatik ravishda amalga oshirildi. Formula va diskontlash
      usuli ADB talablariga muvofiq.
    </div>

    <!-- Batafsil hisoblash -->
    <div v-if="result" class="text-center">
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
        @click="showDetails = !showDetails"
      >
        <Icon :name="showDetails ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="h-4 w-4" />
        {{ showDetails ? 'Batafsil hisob-kitobni yopish' : "Batafsil hisob-kitobni ko'rish" }}
      </button>

      <div
        v-if="showDetails"
        class="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-left"
      >
        <h3 class="mb-4 text-base font-bold">Hisoblash jarayoni</h3>

        <pre class="mb-4 whitespace-pre-wrap rounded-xl bg-blue-950 px-5 py-4 font-mono text-sm leading-7 text-slate-200">
BCR = PV(Foyda) / PV(Xarajat)

PV = CF x (1 - (1 + r)^-n) / r   (har yilgi oqim bir xil bo'lganda)
r = {{ form.rate }}% (inflyatsiya) + {{ form.risk }}% (xavf) = {{ result.r.toFixed(2) }}%</pre>

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
const showDetails = ref(false);

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
  showDetails.value = false;

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

    result.value = { bcr, pvBenefits, pvCosts, r: rPct, status, headline, recommendation };
    emit("calculated", round2(bcr));
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

function formatBcr(n) {
  // 1,5 ko'rinishida (vergul bilan)
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
}
</script>