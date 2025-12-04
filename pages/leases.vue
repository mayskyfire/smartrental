<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold">สัญญาเช่า</h1>
      <button @click="showModal = true" class="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span class="hidden sm:inline">สร้างสัญญาเช่าใหม่</span>
        <span class="sm:hidden">สร้าง</span>
      </button>
    </div>
    
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
      <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">รายการสัญญาเช่า</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">ทั้งหมด {{ leases.length }} สัญญา</p>
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
      <div v-else-if="!leases.length" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มีรายการสัญญาเช่า</h3>
        <p class="mt-1 text-sm text-gray-500">เริ่มต้นโดยการสร้างสัญญาเช่าใหม่</p>
        <div class="mt-6">
          <button @click="showModal = true" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            สร้างสัญญาเช่าใหม่
          </button>
        </div>
      </div>

      <!-- Mobile Card View -->
      <div v-else class="lg:hidden divide-y divide-gray-200">
        <div v-for="lease in leases" :key="lease.id" class="p-4 hover:bg-gray-50">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-800 text-sm">{{ lease.tenant.fullName }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">{{ lease.unit.property.name }} - {{ lease.unit.unitCode }}</p>
            </div>
            <div class="relative ml-2">
              <button @click="toggleDropdown(lease.id)" class="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>
              </button>
              <div v-show="openDropdown === lease.id" class="absolute right-0 mt-1 w-36 bg-white shadow-lg rounded-lg p-1.5 z-10 border">
                <button @click="editLease(lease); openDropdown = null" class="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-md">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  แก้ไข
                </button>
                <button @click="deleteLease(lease); openDropdown = null" class="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-red-600 hover:bg-gray-100 rounded-md">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  ลบ
                </button>
              </div>
            </div>
          </div>
          <div class="space-y-1 text-xs mb-2">
            <div><span class="text-gray-500">ค่าเช่า:</span> ฿{{ lease.monthlyRentAmount.toLocaleString() }}</div>
            <div><span class="text-gray-500">ครบกำหนด:</span> ทุกวันที่ {{ lease.dueDayOfMonth }}</div>
            <div><span class="text-gray-500">เริ่ม:</span> {{ new Date(lease.startDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) }}</div>
            <div><span class="text-gray-500">สถานะ:</span> <span :class="lease.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'" class="font-medium">{{ lease.status === 'ACTIVE' ? 'ใช้งาน' : 'สิ้นสุด' }}</span></div>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <table v-if="!loading && leases.length" class="hidden lg:table w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้เช่า</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">โครงการ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ห้อง</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ค่าเช่า/เดือน</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันเริ่มสัญญา</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันครบกำหนด</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="lease in leases" :key="lease.id">
            <td class="px-6 py-4 font-medium">{{ lease.tenant.fullName }}</td>
            <td class="px-6 py-4">{{ lease.unit.property.name }}</td>
            <td class="px-6 py-4">{{ lease.unit.unitCode }}</td>
            <td class="px-6 py-4">{{ lease.monthlyRentAmount.toLocaleString() }}</td>
            <td class="px-6 py-4">{{ new Date(lease.startDate).toLocaleDateString('th-TH') }}</td>
            <td class="px-6 py-4">ทุกวันที่ {{ lease.dueDayOfMonth }}</td>
            <td class="px-6 py-4">
              <span :class="lease.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'">
                {{ lease.status === 'ACTIVE' ? 'ใช้งาน' : 'สิ้นสุด' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="relative inline-block">
                <button
                  @click="toggleDropdown(lease.id)"
                  type="button"
                  class="py-1.5 px-2 inline-flex justify-center items-center gap-2 rounded-lg text-gray-700 align-middle disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                >
                  <svg
                    class="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                    />
                  </svg>
                </button>
                <div
                  v-show="openDropdown === lease.id"
                  class="absolute right-0 mt-2 divide-y divide-gray-200 min-w-40 z-10 bg-white shadow-2xl rounded-lg p-2 dark:divide-gray-700 dark:bg-gray-800 dark:border dark:border-gray-700"
                >
                  <div class="py-2 first:pt-0 last:pb-0">
                    <button
                      @click="editLease(lease); openDropdown = null"
                      class="w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                      แก้ไข
                    </button>
                    <button
                      @click="deleteLease(lease); openDropdown = null"
                      class="w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-red-500 dark:hover:bg-gray-700"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center min-h-screen px-4 py-6 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-xl font-bold mb-4">{{ editingLease ? 'แก้ไขสัญญาเช่า' : 'สร้างสัญญาเช่าใหม่' }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">โครงการ</label>
            <select v-model="selectedPropertyId" @change="loadUnits" class="w-full px-3 py-2 border rounded-lg">
              <option value="">เลือกโครงการ</option>
              <option v-for="prop in properties" :key="prop.id" :value="prop.id">
                {{ prop.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">ห้อง</label>
            <select v-model="form.unitId" class="w-full px-3 py-2 border rounded-lg">
              <option value="">เลือกห้อง</option>
              <option v-for="unit in availableUnits" :key="unit.id" :value="unit.id">
                {{ unit.unitCode }} ({{ unit.baseRentAmount.toLocaleString() }} บาท)
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">ผู้เช่า</label>
            <select v-model="form.tenantId" class="w-full px-3 py-2 border rounded-lg">
              <option value="">เลือกผู้เช่า</option>
              <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                {{ tenant.fullName }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">ค่าเช่ารายเดือน</label>
            <input v-model.number="form.monthlyRentAmount" type="number" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">วันเริ่มสัญญา</label>
            <input v-model="form.startDate" type="date" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">วันครบกำหนดชำระ (1-31)</label>
            <input v-model.number="form.dueDayOfMonth" type="number" min="1" max="31" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">เงินประกัน</label>
            <input v-model.number="form.depositAmount" type="number" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">เริ่มปรับหลัง (วัน)</label>
              <input v-model.number="form.lateFeeStartDay" type="number" min="1" class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">ค่าปรับ/วัน</label>
              <input v-model.number="form.dailyLateFee" type="number" class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">ยกเลิกหลัง (วัน)</label>
              <input v-model.number="form.terminationDay" type="number" min="1" class="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div v-if="editingLease" class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">วันสิ้นสุดสัญญา</label>
              <input v-model="form.endDate" type="date" class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">สถานะ</label>
              <select v-model="form.status" class="w-full px-3 py-2 border rounded-lg">
                <option value="ACTIVE">ใช้งาน</option>
                <option value="ENDED">สิ้นสุด</option>
                <option value="PAUSED">พักชั่วคราว</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button @click="showModal = false" class="px-4 py-2 border rounded-lg">ยกเลิก</button>
          <button @click="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
const leases = ref([])
const loading = ref(true)
const properties = ref([])
const tenants = ref([])
const units = ref([])
const availableUnits = ref([])
const selectedPropertyId = ref('')
const showModal = ref(false)
const editingLease = ref(null)
const openDropdown = ref(null)
const form = ref({
  tenantId: '',
  unitId: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  monthlyRentAmount: 0,
  dueDayOfMonth: 5,
  depositAmount: 0,
  lateFeeStartDay: 3,
  dailyLateFee: 100,
  terminationDay: 30,
  status: 'ACTIVE'
})

async function loadLeases() {
  loading.value = true
  try {
    const res = await $fetch('/api/leases')
    leases.value = res.leases
  } finally {
    loading.value = false
  }
}

async function loadUnits() {
  if (!selectedPropertyId.value) return
  const res = await $fetch('/api/units', { query: { propertyId: selectedPropertyId.value } })
  availableUnits.value = res.units.filter((u: any) => u.status === 'VACANT')
}

async function submit() {
  try {
    if (editingLease.value) {
      await $fetch(`/api/leases/${editingLease.value.id}`, {
        method: 'PATCH',
        body: form.value
      })
    } else {
      await $fetch('/api/leases', {
        method: 'POST',
        body: form.value
      })
    }
    
    showModal.value = false
    editingLease.value = null
    form.value = {
      tenantId: '',
      unitId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      monthlyRentAmount: 0,
      dueDayOfMonth: 5,
      depositAmount: 0,
      lateFeeStartDay: 3,
      dailyLateFee: 100,
      terminationDay: 30,
      status: 'ACTIVE'
    }
    selectedPropertyId.value = ''
    loadLeases()
  } catch (error) {
    await showAlert(error.data?.message || 'เกิดข้อผิดพลาด', 'ข้อผิดพลาด', 'error')
  }
}

function editLease(lease) {
  editingLease.value = lease
  selectedPropertyId.value = lease.unit.propertyId
  form.value = {
    tenantId: lease.tenantId,
    unitId: lease.unitId,
    startDate: lease.startDate.split('T')[0],
    endDate: lease.endDate ? lease.endDate.split('T')[0] : '',
    monthlyRentAmount: lease.monthlyRentAmount,
    dueDayOfMonth: lease.dueDayOfMonth,
    depositAmount: lease.depositAmount,
    lateFeeStartDay: lease.lateFeeStartDay,
    dailyLateFee: lease.dailyLateFee,
    terminationDay: lease.terminationDay,
    status: lease.status
  }
  loadUnits()
  showModal.value = true
}

async function deleteLease(lease) {
  // ป้องกันการลบชั่วคราว
  await showAlert("ฟังก์ชันการลบถูกปิดใช้งานชั่วคราว", "แจ้งเตือน", "info");
  return;
  
  // const confirmed = await showConfirm(`ต้องการลบสัญญาเช่าของ "${lease.tenant.fullName}" หรือไม่?`, 'ยืนยันการลบ', 'error')
  // if (!confirmed) return
  
  // try {
  //   await $fetch(`/api/leases/${lease.id}`, { method: 'DELETE' })
  //   await showAlert('ลบสัญญาเช่าเรียบร้อยแล้ว', 'สำเร็จ', 'success')
  //   loadLeases()
  // } catch (error) {
  //   await showAlert(error.data?.message || 'เกิดข้อผิดพลาดในการลบข้อมูล', 'ข้อผิดพลาด', 'error')
  // }
}

function toggleDropdown(leaseId) {
  openDropdown.value = openDropdown.value === leaseId ? null : leaseId
}

function handleClickOutside(event) {
  if (!event.target.closest('.relative')) {
    openDropdown.value = null
  }
}

onMounted(async () => {
  const [propsRes, tenantsRes] = await Promise.all([
    $fetch('/api/properties'),
    $fetch('/api/tenants')
  ])
  properties.value = propsRes.properties
  tenants.value = tenantsRes.tenants
  loadLeases()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
