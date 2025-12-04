<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">แดชบอร์ด</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400">ภาพรวมข้อมูลระบบจัดการค่าเช่า</p>
    </div>
    
    <!-- Filter -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2 dark:text-white">กรองตามโครงการ</label>
      <select v-model="selectedPropertyId" class="py-3 px-4 pe-9 block w-full sm:w-auto border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
        <option value="">ทั้งหมด</option>
        <option v-for="prop in properties" :key="prop.id" :value="prop.id">
          {{ prop.name }}
        </option>
      </select>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <div class="flex flex-col bg-white border border-primary-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-4 md:p-5">
          <div class="flex items-center gap-x-2">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <p class="text-xs uppercase tracking-wide text-gray-500">จำนวนผู้เช่าปัจจุบัน</p>
          </div>
          <div class="mt-3">
            <h3 class="text-2xl sm:text-3xl font-bold text-primary-600">{{ stats.activeLeases }}</h3>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col bg-white border border-success-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-4 md:p-5">
          <div class="flex items-center gap-x-2">
            <div class="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-xs uppercase tracking-wide text-gray-500">ห้องว่าง</p>
          </div>
          <div class="mt-3">
            <h3 class="text-2xl sm:text-3xl font-bold text-success-600">{{ stats.vacantUnits }}</h3>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col bg-white border border-danger-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-4 md:p-5">
          <div class="flex items-center gap-x-2">
            <div class="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-xs uppercase tracking-wide text-gray-500">ยอดค้างชำระ</p>
          </div>
          <div class="mt-3">
            <h3 class="text-2xl sm:text-3xl font-bold text-danger-600">฿{{ stats.outstanding.toLocaleString() }}</h3>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col bg-white border border-warning-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-4 md:p-5">
          <div class="flex items-center gap-x-2">
            <div class="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-xs uppercase tracking-wide text-gray-500">เกินกำหนด</p>
          </div>
          <div class="mt-3">
            <h3 class="text-2xl sm:text-3xl font-bold text-warning-600">{{ stats.overdueInvoices }}</h3>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Upcoming Invoices Table -->
    <div class="flex flex-col">
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
            <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">ใบแจ้งหนี้ใกล้ครบกำหนด</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">รายการใบแจ้งหนี้ที่ยังไม่ได้ชำระ</p>
              </div>
            </div>

            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th scope="col" class="ps-6 py-3 text-start">
                    <span class="text-xs font-medium text-gray-500 uppercase">ผู้เช่า</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-start">
                    <span class="text-xs font-medium text-gray-500 uppercase">โครงการ</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-start">
                    <span class="text-xs font-medium text-gray-500 uppercase">ห้อง</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-start">
                    <span class="text-xs font-medium text-gray-500 uppercase">วันครบกำหนด</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-start">
                    <span class="text-xs font-medium text-gray-500 uppercase">ยอดค้าง</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-end">สถานะ</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="invoice in upcomingInvoices" :key="invoice.id" class="hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td class="h-px w-px whitespace-nowrap">
                    <div class="ps-6 py-3">
                      <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">{{ invoice.lease.tenant.fullName }}</span>
                    </div>
                  </td>
                  <td class="h-px w-px whitespace-nowrap">
                    <div class="px-6 py-3">
                      <span class="block text-sm text-gray-500">{{ invoice.property.name }}</span>
                    </div>
                  </td>
                  <td class="h-px w-px whitespace-nowrap">
                    <div class="px-6 py-3">
                      <span class="block text-sm text-gray-500">{{ invoice.unit.unitCode }}</span>
                    </div>
                  </td>
                  <td class="h-px w-px whitespace-nowrap">
                    <div class="px-6 py-3">
                      <span class="block text-sm text-gray-500">{{ new Date(invoice.dueDate).toLocaleDateString('th-TH') }}</span>
                    </div>
                  </td>
                  <td class="h-px w-px whitespace-nowrap">
                    <div class="px-6 py-3">
                      <span class="block text-sm font-medium text-gray-800 dark:text-gray-200">฿{{ (invoice.totalAmount - invoice.paidAmount).toLocaleString() }}</span>
                    </div>
                  </td>
                  <td class="h-px w-px whitespace-nowrap">
                    <div class="px-6 py-1.5">
                      <span :class="getStatusClass(invoice.status)" class="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium">
                        {{ getStatusText(invoice.status) }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedPropertyId = ref('')
const properties = ref([])
const stats = ref({
  activeLeases: 0,
  vacantUnits: 0,
  outstanding: 0,
  overdueInvoices: 0
})
const upcomingInvoices = ref([])

async function loadData() {
  const [propsRes, unitsRes, leasesRes, invoicesRes] = await Promise.all([
    $fetch('/api/properties'),
    $fetch('/api/units', { query: { propertyId: selectedPropertyId.value || undefined } }),
    $fetch('/api/leases', { query: { propertyId: selectedPropertyId.value || undefined } }),
    $fetch('/api/invoices', { 
      query: { 
        propertyId: selectedPropertyId.value || undefined,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      } 
    })
  ])
  
  properties.value = propsRes.properties
  
  stats.value.activeLeases = leasesRes.leases.filter((l: any) => l.status === 'ACTIVE').length
  stats.value.vacantUnits = unitsRes.units.filter((u: any) => u.status === 'VACANT').length
  stats.value.outstanding = invoicesRes.invoices
    .filter((i: any) => i.status !== 'PAID')
    .reduce((sum: number, i: any) => sum + (i.totalAmount - i.paidAmount), 0)
  stats.value.overdueInvoices = invoicesRes.invoices
    .filter((i: any) => i.status === 'OVERDUE' || (i.status !== 'PAID' && new Date(i.dueDate) < new Date())).length
  
  upcomingInvoices.value = invoicesRes.invoices
    .filter((i: any) => i.status !== 'PAID')
    .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 10)
}

function getStatusClass(status: string) {
  const classes: any = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    PARTIALLY_PAID: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    PAID: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
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

watch(selectedPropertyId, loadData)
onMounted(loadData)
</script>
