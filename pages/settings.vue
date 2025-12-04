<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">ตั้งค่าระบบ</h1>
    
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>
    
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">การตั้งค่า LINE Messaging API</h2>
      <form @submit.prevent="saveSettings" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Channel Access Token</label>
          <input 
            v-model="settings.lineChannelAccessToken"
            type="text" 
            class="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter LINE Channel Access Token"
          />
          <p class="text-xs text-gray-500 mt-1">ดูได้จาก LINE Developers Console</p>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Channel Secret</label>
          <input 
            v-model="settings.lineChannelSecret"
            type="text" 
            class="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter LINE Channel Secret"
          />
          <p class="text-xs text-gray-500 mt-1">ดูได้จาก LINE Developers Console</p>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Webhook URL</label>
          <input 
            :value="webhookUrl" 
            disabled
            class="w-full px-3 py-2 border rounded-lg bg-gray-50"
          />
          <p class="text-xs text-gray-500 mt-1">ใช้ URL นี้ในการตั้งค่า Webhook ที่ LINE Developers Console</p>
        </div>
        <div class="flex items-center">
          <input 
            v-model="settings.autoLineReminderEnabled"
            type="checkbox" 
            class="mr-2"
          />
          <label>เปิดใช้งานการแจ้งเตือนอัตโนมัติ</label>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Cron Schedule</label>
          <input 
            v-model="settings.autoLineReminderCron"
            type="text" 
            class="w-full px-3 py-2 border rounded-lg"
            placeholder="0 9 * * *"
          />
          <p class="text-xs text-gray-500 mt-1">รูปแบบ Cron (เช่น "0 9 * * *" = ทุกวัน 09:00)</p>
        </div>
        <button 
          type="submit" 
          :disabled="saving"
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {{ saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า' }}
        </button>
      </form>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">ตารางการแจ้งเตือนอัตโนมัติ</h2>
      <div class="space-y-4">
        <div class="flex items-center">
          <input type="checkbox" checked disabled class="mr-2" />
          <label>แจ้งเตือนก่อนถึงวันครบกำหนด 3 วัน</label>
        </div>
        <div class="flex items-center">
          <input type="checkbox" checked disabled class="mr-2" />
          <label>แจ้งเตือนในวันครบกำหนดชำระ</label>
        </div>
        <div class="flex items-center">
          <input type="checkbox" checked disabled class="mr-2" />
          <label>แจ้งเตือนเมื่อเกินกำหนดชำระ (ทุก 1, 3, 7 วัน)</label>
        </div>
        <p class="text-sm text-gray-600">
          💡 การแจ้งเตือนอัตโนมัติจะทำงานผ่าน Cron Job หรือ Nitro Scheduled Tasks
        </p>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-bold mb-4">การสร้างใบแจ้งหนี้อัตโนมัติ</h2>
      <div class="space-y-4">
        <div class="flex items-center">
          <input type="checkbox" checked disabled class="mr-2" />
          <label>สร้างใบแจ้งหนี้อัตโนมัติทุกวันที่ 1 ของเดือน</label>
        </div>
        <p class="text-sm text-gray-600">
          💡 ระบบจะสร้างใบแจ้งหนี้สำหรับสัญญาเช่าที่มีสถานะ ACTIVE ทั้งหมดโดยอัตโนมัติ
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { showAlert } = useModal()
const config = useRuntimeConfig()
const webhookUrl = computed(() => `${config.public.appBaseUrl}/api/line/webhook`)

const settings = ref({
  lineChannelAccessToken: '',
  lineChannelSecret: '',
  autoLineReminderEnabled: true,
  autoLineReminderCron: '0 9 * * *'
})

const saving = ref(false)
const successMessage = ref('')

onMounted(async () => {
  const data = await $fetch('/api/settings')
  settings.value = data
})

const saveSettings = async () => {
  saving.value = true
  successMessage.value = ''
  
  try {
    await $fetch('/api/settings', {
      method: 'PATCH',
      body: settings.value
    })
    successMessage.value = 'บันทึกการตั้งค่าเรียบร้อยแล้ว'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (error) {
    await showAlert('เกิดข้อผิดพลาดในการบันทึก', 'ข้อผิดพลาด', 'error')
  } finally {
    saving.value = false
  }
}
</script>
