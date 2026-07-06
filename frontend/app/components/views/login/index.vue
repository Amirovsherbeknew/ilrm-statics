<template>
  <div
    class="relative min-h-screen bg-gray-100 flex items-center justify-center p-4 overflow-hidden"
  >
    <!-- Background Glow -->
    <div
      class="absolute -top-48 -right-48 w-[550px] h-[550px] rounded-full bg-blue-500/20 blur-3xl"
    />

    <div
      class="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-3xl"
    />

    <!-- Decorative circles -->
    <div
      class="absolute top-20 right-32 w-24 h-24 rounded-full border border-blue-300/40"
    />

    <div
      class="absolute bottom-24 left-32 w-16 h-16 rounded-full bg-white/40 backdrop-blur-md border border-white/50"
    />

    <!-- Login Card -->
    <div
      class="relative z-10 w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row"
    >
      <!-- Left panel -->
      <div
        class="relative md:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-6 flex items-center justify-center overflow-hidden"
      >
        <!-- Panel decoration -->
        <div
          class="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-white/10"
        />

        <div
          class="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-white/5"
        />

        <div
          class="absolute top-10 left-10 w-12 h-12 rounded-full border border-white/20"
        />

        <div
          class="absolute bottom-10 right-10 w-8 h-8 rounded-full bg-white/10"
        />

        <!-- Content -->
        <div
          class="relative z-10 bg-white rounded-2xl w-full p-8 flex flex-col items-center text-center shadow-lg"
        >
          <img
            src="https://btr.iplmr.uz/_nuxt/greb2.C9oZdOx_.png"
            alt="Logo"
            class="w-28 h-28 object-contain mb-5"
          />

          <h1 class="text-sm md:text-base font-bold text-gray-900 leading-relaxed">
            O‘zbekiston Respublikasi Kambag‘allikni qisqartirish va bandlik vazirligi huzuridagi 
            <br />
            Kambag‘allik va mehnat bozori tadqiqotlari instituti
          </h1>
        </div>
      </div>

      <!-- Right panel -->
      <div
        class="md:w-1/2 bg-white p-10 flex flex-col items-center justify-center text-center"
      >
        <h2 class="text-3xl font-bold text-gray-900">
          Tizimga kirish
        </h2>

        <p class="text-sm text-blue-600 mt-2 mb-6">
          Iltimos, davom etish uchun tizimga kiring
        </p>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="w-full max-w-xs text-left"
          @submit.prevent="handleLogin"
        >
          <el-form-item
            label="Login"
            prop="username"
          >
            <el-input
              v-model="form.username"
              placeholder="Login kiriting"
              size="large"
            />
          </el-form-item>

          <el-form-item
            label="Parol"
            prop="password"
          >
            <el-input
              v-model="form.password"
              type="password"
              placeholder="Parolni kiriting"
              size="large"
              show-password
            />
          </el-form-item>

          <el-button
            type="primary"
            native-type="submit"
            class="w-full"
            size="large"
            :loading="loading"
            @click="handleLogin"
          >
            Kirish
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const router = useRouter()
const { setAccessToken, setRole } = useToken()

const formRef = ref(null);
const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
});

const rules = {
  username: [{ required: true, message: "Login kiriting", trigger: "blur" }],
  password: [{ required: true, message: "Parolni kiriting", trigger: "blur" }],
};

async function handleLogin() {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;

    const { data, error } = await useFetchApi.post('/api/login', {
      username: form.username,
      password: form.password,
    });

    if (error.value) {

      ElMessage.error(`Login yoki parol noto'g'ri`)
      loading.value = false;
      return;
    }

    setAccessToken(data.value.token);
    setRole(data.value.role);
    loading.value = false;
    if (data.value?.role === 'hokimiyat') {
      router.push('/projects');
    }
    else router.push('/');
  });
}
</script>

<style scoped>
/* Element Plus asosiy tugma rangini loyihaga moslashtirish uchun */
:deep(.el-button--primary) {
  --el-color-primary: #4f46e5;
  --el-color-primary-light-3: #6366f1;
  --el-color-primary-dark-2: #4338ca;
}
</style>