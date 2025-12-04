<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl shadow-lg mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">ระบบจัดการค่าเช่า</h1>
        <p class="text-sm text-gray-600">เข้าสู่รูะบบเพื่อจัดการค่าเช่ารายเดือน</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
            <input
              v-model="email"
              type="email"
              required
              class="py-3 px-4 block w-full border-2 border-gray-300 rounded-lg text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:opacity-50 disabled:pointer-events-none transition-all"
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
            <input
              v-model="password"
              type="password"
              required
              class="py-3 px-4 block w-full border-2 border-gray-300 rounded-lg text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:opacity-50 disabled:pointer-events-none transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div v-if="error" class="flex items-center gap-x-2 p-3 bg-danger-50 border border-danger-200 rounded-lg">
            <svg class="flex-shrink-0 w-4 h-4 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm text-danger-700">{{ error }}</span>
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p class="text-xs font-medium text-gray-700 mb-2">ข้อมูลทดสอบ:</p>
          <div class="space-y-1 text-xs text-gray-600">
            <p>อีเมล: <span class="font-mono bg-white px-2 py-0.5 rounded border">admin@example.com</span></p>
            <p>รหัส: <span class="font-mono bg-white px-2 py-0.5 rounded border">admin123</span></p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6">
        <p class="text-xs text-gray-500">ระบบจัดการค่าเช่ารายเดือน & แจ้งเตือน LINE</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const router = useRouter()
const email = ref('admin@example.com')
const password = ref('admin123')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    router.push('/dashboard')
  } catch (e: any) {
    error.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    loading.value = false
  }
}
</script>
