<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Modal Demo</h1>
    
    <div class="mb-4">
      <button @click="testAlert" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Test Alert
      </button>
    </div>
    
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-4">
        <h2 class="text-lg font-semibold">Alert Modals</h2>
        
        <button @click="showInfoAlert" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Info Alert
        </button>
        
        <button @click="showSuccessAlert" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Success Alert
        </button>
        
        <button @click="showWarningAlert" class="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
          Warning Alert
        </button>
        
        <button @click="showErrorAlert" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Error Alert
        </button>
      </div>
      
      <div class="space-y-4">
        <h2 class="text-lg font-semibold">Confirm Modals</h2>
        
        <button @click="showInfoConfirm" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Info Confirm
        </button>
        
        <button @click="showWarningConfirm" class="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
          Warning Confirm
        </button>
        
        <button @click="showDeleteConfirm" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Delete Confirm
        </button>
      </div>
    </div>
    
    <div v-if="lastResult" class="mt-6 p-4 bg-gray-100 rounded-lg">
      <p class="text-sm text-gray-700">Last Result: {{ lastResult }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { showAlert, showConfirm } = useModal()
const lastResult = ref('')

async function testAlert() {
  console.log('Testing modal...')
  try {
    await showAlert('ทดสอบระบบ Modal', 'ทดสอบ', 'info')
    lastResult.value = 'Test alert completed'
    console.log('Modal completed')
  } catch (error) {
    console.error('Modal error:', error)
    alert('Fallback: ทดสอบระบบ Modal')
  }
}

async function showInfoAlert() {
  await showAlert('นี่คือข้อความแจ้งเตือนทั่วไป', 'ข้อมูล', 'info')
  lastResult.value = 'Info alert closed'
}

async function showSuccessAlert() {
  await showAlert('การดำเนินการสำเร็จ!', 'สำเร็จ', 'success')
  lastResult.value = 'Success alert closed'
}

async function showWarningAlert() {
  await showAlert('กรุณาตรวจสอบข้อมูลอีกครั้ง', 'คำเตือน', 'warning')
  lastResult.value = 'Warning alert closed'
}

async function showErrorAlert() {
  await showAlert('เกิดข้อผิดพลาดในระบบ', 'ข้อผิดพลาด', 'error')
  lastResult.value = 'Error alert closed'
}

async function showInfoConfirm() {
  const result = await showConfirm('คุณต้องการดำเนินการต่อหรือไม่?', 'ยืนยัน', 'info')
  lastResult.value = `Info confirm result: ${result}`
}

async function showWarningConfirm() {
  const result = await showConfirm('การดำเนินการนี้อาจมีผลกระทบ คุณแน่ใจหรือไม่?', 'คำเตือน', 'warning')
  lastResult.value = `Warning confirm result: ${result}`
}

async function showDeleteConfirm() {
  const result = await showConfirm('คุณต้องการลบข้อมูลนี้หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้', 'ยืนยันการลบ', 'error')
  lastResult.value = `Delete confirm result: ${result}`
}
</script>