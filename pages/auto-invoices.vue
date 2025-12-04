<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">ระบบสร้างใบแจ้งหนี้อัตโนมัติ</h1>
      <p class="text-gray-600">จัดการการสร้างใบแจ้งหนี้รายเดือนอัตโนมัติ</p>
    </div>

    <!-- Period Selection -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">เลือกช่วงเวลา</h2>
      <div class="flex gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ปี</label>
          <select v-model="selectedYear" class="border rounded-md px-3 py-2">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">เดือน</label>
          <select v-model="selectedMonth" class="border rounded-md px-3 py-2">
            <option v-for="(month, index) in months" :key="index + 1" :value="index + 1">
              {{ month }}
            </option>
          </select>
        </div>
        <button 
          @click="checkStatus" 
          :disabled="loading"
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {{ loading ? 'กำลังตรวจสอบ...' : 'ตรวจสอบสถานะ' }}
        </button>
      </div>
    </div>

    <!-- Status Summary -->
    <div v-if="status" class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">สถานะการสร้างใบแจ้งหนี้ {{ status.period }}</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ status.summary.totalActiveLeases }}</div>
          <div class="text-sm text-gray-600">สัญญาเช่าที่ใช้งาน</div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-green-600">{{ status.summary.invoicesGenerated }}</div>
          <div class="text-sm text-gray-600">ใบแจ้งหนี้ที่สร้างแล้ว</div>
        </div>
        <div class="bg-yellow-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-yellow-600">{{ status.summary.pendingGeneration }}</div>
          <div class="text-sm text-gray-600">รอการสร้าง</div>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">{{ status.summary.completionRate }}%</div>
          <div class="text-sm text-gray-600">ความสมบูรณ์</div>
        </div>
      </div>

      <!-- Generate Button -->
      <div v-if="status.summary.pendingGeneration > 0" class="mb-6">
        <button 
          @click="generateInvoices" 
          :disabled="generating"
          class="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          {{ generating ? 'กำลังสร้าง...' : `สร้างใบแจ้งหนี้ (${status.summary.pendingGeneration} รายการ)` }}
        </button>
      </div>
    </div>

    <!-- Generated Invoices -->
    <div v-if="status?.details.generated.length > 0" class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">ใบแจ้งหนี้ที่สร้างแล้ว ({{ status.details.generated.length }} รายการ)</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">หน่วย</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">อาคาร</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้เช่า</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ค่าเช่า</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ค่าปรับ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รวม</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">กำหนดชำระ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันเริ่มปรับ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันยกเลิก</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="invoice in status.details.generated" :key="invoice.invoiceId">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ invoice.unitCode }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ invoice.propertyName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ invoice.tenantName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatCurrency(invoice.rentAmount || invoice.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatCurrency(invoice.lateFeeAmount || 0) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ formatCurrency(invoice.totalAmount || invoice.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(invoice.dueDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ invoice.lateFeeStartDate ? formatDate(invoice.lateFeeStartDate) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ invoice.terminationDate ? formatDate(invoice.terminationDate) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(invoice.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getStatusText(invoice.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pending Generation -->
    <div v-if="status?.details.pending.length > 0" class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">รอการสร้างใบแจ้งหนี้ ({{ status.details.pending.length }} รายการ)</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">หน่วย</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">อาคาร</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้เช่า</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ค่าเช่า/เดือน</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันครบกำหนด</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ค่าปรับ/วัน</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เริ่มปรับหลัง</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ยกเลิกหลัง</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="lease in status.details.pending" :key="lease.leaseId">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ lease.unitCode }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ lease.propertyName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ lease.tenantName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatCurrency(lease.monthlyRent) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                วันที่ {{ lease.dueDayOfMonth }} ของเดือน
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatCurrency(lease.dailyLateFee || 100) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ lease.lateFeeStartDay || 3 }} วัน
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ lease.terminationDay || 30 }} วัน
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const loading = ref(false)
const generating = ref(false)
const status = ref(null)

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

const months = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

const checkStatus = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/invoices/auto-status', {
      query: {
        year: selectedYear.value,
        month: selectedMonth.value
      }
    })
    status.value = response
  } catch (error) {
    console.error('Error checking status:', error)
    const { showAlert } = useModal()
    await showAlert('เกิดข้อผิดพลาดในการตรวจสอบสถานะ', 'ข้อผิดพลาด', 'error')
  } finally {
    loading.value = false
  }
}

const generateInvoices = async () => {
  const { showAlert, showConfirm } = useModal()
  const confirmed = await showConfirm(`ต้องการสร้างใบแจ้งหนี้สำหรับเดือน ${selectedMonth.value}/${selectedYear.value} หรือไม่?`, 'ยืนยันการสร้าง', 'info')
  if (!confirmed) return

  generating.value = true
  try {
    const response = await $fetch('/api/invoices/trigger-generation', {
      method: 'POST',
      body: {
        year: selectedYear.value,
        month: selectedMonth.value
      }
    })
    
    await showAlert(response.message, 'สำเร็จ', 'success')
    await checkStatus() // Refresh status
  } catch (error) {
    console.error('Error generating invoices:', error)
    await showAlert('เกิดข้อผิดพลาดในการสร้างใบแจ้งหนี้', 'ข้อผิดพลาด', 'error')
  } finally {
    generating.value = false
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('th-TH')
}

const getStatusClass = (status) => {
  const classes = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'PARTIALLY_PAID': 'bg-blue-100 text-blue-800',
    'PAID': 'bg-green-100 text-green-800',
    'OVERDUE': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    'PENDING': 'รอชำระ',
    'PARTIALLY_PAID': 'ชำระบางส่วน',
    'PAID': 'ชำระแล้ว',
    'OVERDUE': 'เกินกำหนด'
  }
  return texts[status] || status
}

// Auto-check status on mount
onMounted(() => {
  checkStatus()
})
</script>