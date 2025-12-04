<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">การแจ้งเตือน LINE</h1>
    
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">ส่งข้อความด่วน</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">เลือกผู้เช่า</label>
          <select v-model="manualForm.tenantId" class="w-full px-3 py-2 border rounded-lg">
            <option value="">เลือกผู้เช่า</option>
            <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
              {{ tenant.fullName }} - {{ tenant.leases[0]?.unit.property.name }} {{ tenant.leases[0]?.unit.unitCode }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">ข้อความ</label>
          <textarea v-model="manualForm.message" class="w-full px-3 py-2 border rounded-lg" rows="4"></textarea>
        </div>
        <button @click="sendManual" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          ส่งข้อความ
        </button>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <h2 class="text-xl font-bold">ประวัติการส่งข้อความ</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้เช่า</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ประเภท</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ข้อความ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="log in logs" :key="log.id">
              <td class="px-6 py-4">{{ new Date(log.sentAt).toLocaleString('th-TH') }}</td>
              <td class="px-6 py-4">{{ log.tenant.fullName }}</td>
              <td class="px-6 py-4">{{ getTypeText(log.type) }}</td>
              <td class="px-6 py-4 max-w-md truncate">{{ log.messageContent }}</td>
              <td class="px-6 py-4">
                <span :class="log.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'">
                  {{ log.status === 'SUCCESS' ? 'สำเร็จ' : 'ล้มเหลว' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { showAlert } = useModal()
const tenants = ref([])
const logs = ref([])
const manualForm = ref({
  tenantId: '',
  message: ''
})

async function loadData() {
  const [tenantsRes, logsRes] = await Promise.all([
    $fetch('/api/tenants'),
    $fetch('/api/line/logs').catch(() => ({ logs: [] }))
  ])
  tenants.value = tenantsRes.tenants.filter((t: any) => t.lineUserId)
  logs.value = logsRes.logs || []
}

async function sendManual() {
  if (!manualForm.value.tenantId || !manualForm.value.message) {
    await showAlert('กรุณากรอกข้อมูลให้ครบถ้วน', 'ข้อมูลไม่ครบ', 'warning')
    return
  }
  
  await $fetch('/api/line/send-manual', {
    method: 'POST',
    body: manualForm.value
  })
  
  await showAlert('ส่งข้อความเรียบร้อย', 'สำเร็จ', 'success')
  manualForm.value = { tenantId: '', message: '' }
  loadData()
}

function getTypeText(type: string) {
  const texts: any = {
    MONTHLY_REMINDER: 'แจ้งเตือนรายเดือน',
    REMINDER_BEFORE_DUE: 'แจ้งก่อนครบกำหนด',
    ON_DUE_DATE: 'แจ้งวันครบกำหนด',
    OVERDUE: 'แจ้งเกินกำหนด',
    MANUAL: 'ส่งด่วน'
  }
  return texts[type] || type
}

onMounted(loadData)
</script>
