<template>
  <div>
    <div class="flex flex-col gap-3 mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold">ใบแจ้งหนี้รายเดือน</h1>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button @click="generateMonthly" class="px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span class="hidden sm:inline">สร้างใบแจ้งหนี้เดือนนี้</span>
          <span class="sm:hidden">สร้างใบแจ้งหนี้</span>
        </button>
        <button @click="sendBatch" class="px-3 sm:px-4 py-2.5 sm:py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <span class="hidden sm:inline">ส่งแจ้งเตือน LINE ทั้งหมด</span>
          <span class="sm:hidden">ส่ง LINE</span>
        </button>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">โครงการ</label>
          <select v-model="filters.propertyId" class="w-full px-3 py-2 border rounded-lg">
            <option value="">ทั้งหมด</option>
            <option v-for="prop in properties" :key="prop.id" :value="prop.id">
              {{ prop.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">ปี</label>
          <input v-model.number="filters.year" type="number" class="w-full px-3 py-2 border rounded-lg" />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">เดือน</label>
          <select v-model.number="filters.month" class="w-full px-3 py-2 border rounded-lg">
            <option value="">ทั้งหมด</option>
            <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">สถานะ</label>
          <select v-model="filters.status" class="w-full px-3 py-2 border rounded-lg">
            <option value="">ทั้งหมด</option>
            <option value="PENDING">รอชำระ</option>
            <option value="PARTIALLY_PAID">ชำระบางส่วน</option>
            <option value="PAID">ชำระแล้ว</option>
            <option value="OVERDUE">เกินกำหนด</option>
          </select>
        </div>
      </div>
      
      <button @click="loadInvoices" class="mt-3 sm:mt-4 w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700">
        ค้นหา
      </button>
    </div>
    
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
      <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">รายการใบแจ้งหนี้</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">ทั้งหมด {{ invoices.length }} รายการ</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
        <div class="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
          <div class="flex justify-center">
            <div class="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!invoices.length" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มีรายการใบแจ้งหนี้</h3>
        <p class="mt-1 text-sm text-gray-500">ลองสร้างใบแจ้งหนี้สำหรับเดือนนี้</p>
        <div class="mt-6">
          <button @click="generateMonthly" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            สร้างใบแจ้งหนี้เดือนนี้
          </button>
        </div>
      </div>

      <!-- Mobile Card View -->
      <div v-else class="lg:hidden divide-y divide-gray-200">
        <div v-for="invoice in invoices" :key="invoice.id" class="p-4 hover:bg-gray-50">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-800 text-sm">{{ invoice.lease.tenant.fullName }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">{{ invoice.property.name }} - {{ invoice.unit.unitCode }}</p>
            </div>
            <span :class="getStatusClass(invoice.status)">
              {{ getStatusText(invoice.status) }}
            </span>
          </div>
          <div class="space-y-1 text-xs mb-3">
            <div><span class="text-gray-500">เดือน/ปี:</span> {{ invoice.billingMonth }}/{{ invoice.billingYear + 543 }}</div>
            <div><span class="text-gray-500">ครบกำหนด:</span> {{ new Date(invoice.dueDate).toLocaleDateString('th-TH') }}</div>
            <div><span class="text-gray-500">ยอดสุทธิ:</span> ฿{{ invoice.totalAmount.toLocaleString() }}</div>
            <div><span class="text-gray-500">ชำระแล้ว:</span> ฿{{ invoice.paidAmount.toLocaleString() }}</div>
            <div><span class="text-gray-500">คงค้าง:</span> <span class="font-semibold text-red-600">฿{{ (invoice.totalAmount - invoice.paidAmount).toLocaleString() }}</span></div>
          </div>
          <div class="flex gap-2">
            <button @click="recordPayment(invoice)" class="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              บันทึกชำระ
            </button>
            <button @click="sendReminder(invoice)" class="flex-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700">
              ส่ง LINE
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <table v-if="!loading && invoices.length" class="hidden lg:table w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้เช่า</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">โครงการ</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ห้อง</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">เดือน/ปี</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันครบกำหนด</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ยอดสุทธิ</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชำระแล้ว</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">คงค้าง</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="invoice in invoices" :key="invoice.id">
            <td class="px-4 py-3">{{ invoice.lease.tenant.fullName }}</td>
            <td class="px-4 py-3">{{ invoice.property.name }}</td>
            <td class="px-4 py-3">{{ invoice.unit.unitCode }}</td>
            <td class="px-4 py-3">{{ invoice.billingMonth }}/{{ invoice.billingYear + 543 }}</td>
            <td class="px-4 py-3">{{ new Date(invoice.dueDate).toLocaleDateString('th-TH') }}</td>
            <td class="px-4 py-3">{{ invoice.totalAmount.toLocaleString() }}</td>
            <td class="px-4 py-3">{{ invoice.paidAmount.toLocaleString() }}</td>
            <td class="px-4 py-3 font-semibold">{{ (invoice.totalAmount - invoice.paidAmount).toLocaleString() }}</td>
            <td class="px-4 py-3">
              <span :class="getStatusClass(invoice.status)">
                {{ getStatusText(invoice.status) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <button @click="recordPayment(invoice)" class="text-blue-600 hover:underline text-sm mr-2">
                บันทึกชำระ
              </button>
              <button @click="sendReminder(invoice)" class="text-green-600 hover:underline text-sm">
                ส่ง LINE
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="showPaymentModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center min-h-screen px-4 py-6 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">บันทึกการชำระเงิน</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">จำนวนเงิน</label>
            <input v-model.number="payment.amount" type="number" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">วันที่ชำระ</label>
            <input v-model="payment.paidDate" type="date" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">วิธีชำระ</label>
            <select v-model="payment.method" class="w-full px-3 py-2 border rounded-lg">
              <option value="CASH">เงินสด</option>
              <option value="BANK_TRANSFER">โอนเงิน</option>
              <option value="PROMPTPAY">พร้อมเพย์</option>
              <option value="OTHER">อื่นๆ</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">หมายเหตุ</label>
            <textarea v-model="payment.note" class="w-full px-3 py-2 border rounded-lg" rows="2"></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button @click="showPaymentModal = false" class="px-4 py-2 border rounded-lg">ยกเลิก</button>
          <button @click="submitPayment" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { showAlert, showConfirm } = useModal()
const properties = ref([])
const invoices = ref([])
const loading = ref(true)
const filters = ref({
  propertyId: '',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  status: ''
})

const showPaymentModal = ref(false)
const selectedInvoice = ref<any>(null)
const payment = ref({
  amount: 0,
  paidDate: new Date().toISOString().split('T')[0],
  method: 'CASH',
  note: ''
})

async function loadInvoices() {
  loading.value = true
  try {
    const query: any = {}
    if (filters.value.propertyId) query.propertyId = filters.value.propertyId
    if (filters.value.year) query.year = filters.value.year
    if (filters.value.month) query.month = filters.value.month
    if (filters.value.status) query.status = filters.value.status
    
    const res = await $fetch('/api/invoices', { query })
    invoices.value = res.invoices
  } finally {
    loading.value = false
  }
}

async function generateMonthly() {
  const confirmed = await showConfirm('สร้างใบแจ้งหนี้สำหรับเดือนนี้?', 'ยืนยันการสร้าง', 'info')
  if (!confirmed) return
  
  await $fetch('/api/invoices/generate-monthly', {
    method: 'POST',
    body: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    }
  })
  
  await showAlert('สร้างใบแจ้งหนี้เรียบร้อย', 'สำเร็จ', 'success')
  loadInvoices()
}

async function sendBatch() {
  const confirmed = await showConfirm('ส่งแจ้งเตือน LINE ให้ผู้เช่าทั้งหมด?', 'ยืนยันการส่ง', 'info')
  if (!confirmed) return
  
  const res = await $fetch('/api/line/send-monthly-batch', {
    method: 'POST',
    body: {
      year: filters.value.year,
      month: filters.value.month,
      propertyId: filters.value.propertyId || undefined
    }
  })
  
  await showAlert(`ส่งสำเร็จ ${res.sent} รายการ`, 'สำเร็จ', 'success')
}

function recordPayment(invoice: any) {
  selectedInvoice.value = invoice
  payment.value.amount = invoice.totalAmount - invoice.paidAmount
  showPaymentModal.value = true
}

async function submitPayment() {
  await $fetch(`/api/invoices/${selectedInvoice.value.id}/payments`, {
    method: 'POST',
    body: payment.value
  })
  
  showPaymentModal.value = false
  await showAlert('บันทึกการชำระเงินเรียบร้อย', 'สำเร็จ', 'success')
  loadInvoices()
}

async function sendReminder(invoice: any) {
  await $fetch('/api/line/send-reminder', {
    method: 'POST',
    body: { invoiceIds: [invoice.id] }
  })
  
  await showAlert('ส่งแจ้งเตือนเรียบร้อย', 'สำเร็จ', 'success')
}

function getStatusClass(status: string) {
  const classes: any = {
    PENDING: 'px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800',
    PARTIALLY_PAID: 'px-2 py-1 text-xs rounded bg-orange-100 text-orange-800',
    PAID: 'px-2 py-1 text-xs rounded bg-green-100 text-green-800',
    OVERDUE: 'px-2 py-1 text-xs rounded bg-red-100 text-red-800'
  }
  return classes[status] || ''
}

function getStatusText(status: string) {
  const texts: any = {
    PENDING: 'รอชำระ',
    PARTIALLY_PAID: 'ชำระบางส่วน',
    PAID: 'ชำระแล้ว',
    OVERDUE: 'เกินกำหนด'
  }
  return texts[status] || status
}

onMounted(async () => {
  const res = await $fetch('/api/properties')
  properties.value = res.properties
  loadInvoices()
})
</script>
