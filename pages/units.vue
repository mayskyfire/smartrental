<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold">ห้องเช่า</h1>
      <button
        @click="showModal = true"
        type="button"
        class="w-full sm:w-auto py-2.5 sm:py-3 px-3 sm:px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span class="hidden sm:inline">เพิ่มห้องเช่า</span>
        <span class="sm:hidden">เพิ่ม</span>
      </button>
    </div>
    
    <div class="mb-3 sm:mb-4">
      <label class="block text-sm font-medium mb-2">กรองตามโครงการ</label>
      <select v-model="selectedPropertyId" @change="loadUnits" class="w-full sm:w-auto px-3 sm:px-4 py-2 border rounded-lg text-sm">
        <option value="">ทั้งหมด</option>
        <option v-for="prop in properties" :key="prop.id" :value="prop.id">
          {{ prop.name }}
        </option>
      </select>
    </div>
    
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
      <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">รายการห้องเช่า</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">ทั้งหมด {{ units.length }} ห้อง</p>
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
      <div v-else-if="!units.length" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มีรายการห้องเช่า</h3>
        <p class="mt-1 text-sm text-gray-500">เริ่มต้นโดยการเพิ่มห้องเช่าใหม่</p>
        <div class="mt-6">
          <button @click="showModal = true" type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            เพิ่มห้องเช่า
          </button>
        </div>
      </div>

      <!-- Mobile Card View -->
      <div v-else class="lg:hidden divide-y divide-gray-200">
        <div v-for="unit in units" :key="unit.id" class="p-4 hover:bg-gray-50">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-800 text-sm">{{ unit.unitCode }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">{{ unit.property.name }}</p>
            </div>
            <div class="relative ml-2">
              <button @click="toggleDropdown(unit.id)" class="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>
              </button>
              <div v-show="openDropdown === unit.id" class="absolute right-0 mt-1 w-36 bg-white shadow-lg rounded-lg p-1.5 z-10 border">
                <button @click="editUnit(unit); openDropdown = null" class="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-md">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  แก้ไข
                </button>
                <button @click="deleteUnit(unit); openDropdown = null" class="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-red-600 hover:bg-gray-100 rounded-md">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  ลบ
                </button>
              </div>
            </div>
          </div>
          <div class="space-y-1 text-xs mb-2">
            <div><span class="text-gray-500">ชั้น:</span> {{ unit.floor || '-' }}</div>
            <div><span class="text-gray-500">ค่าเช่า:</span> ฿{{ unit.baseRentAmount.toLocaleString() }}</div>
            <div><span class="text-gray-500">สถานะ:</span> <span :class="unit.status === 'VACANT' ? 'text-green-600' : 'text-blue-600'" class="font-medium">{{ unit.status === 'VACANT' ? 'ว่าง' : 'มีผู้เช่า' }}</span></div>
            <div><span class="text-gray-500">ผู้เช่า:</span> {{ unit.leases[0]?.tenant.fullName || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <table v-if="!loading && units.length" class="hidden lg:table w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">โครงการ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">หมายเลขห้อง</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชั้น</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ค่าเช่าพื้นฐาน</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้เช่าปัจจุบัน</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="unit in units" :key="unit.id">
            <td class="px-6 py-4">{{ unit.property.name }}</td>
            <td class="px-6 py-4 font-medium">{{ unit.unitCode }}</td>
            <td class="px-6 py-4">{{ unit.floor || '-' }}</td>
            <td class="px-6 py-4">{{ unit.baseRentAmount.toLocaleString() }}</td>
            <td class="px-6 py-4">
              <span :class="unit.status === 'VACANT' ? 'text-green-600' : 'text-blue-600'">
                {{ unit.status === 'VACANT' ? 'ว่าง' : 'มีผู้เช่า' }}
              </span>
            </td>
            <td class="px-6 py-4">
              {{ unit.leases[0]?.tenant.fullName || '-' }}
            </td>
            <td class="px-6 py-4">
              <div class="relative inline-block">
                <button
                  @click="toggleDropdown(unit.id)"
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
                  v-show="openDropdown === unit.id"
                  class="absolute right-0 mt-2 divide-y divide-gray-200 min-w-40 z-10 bg-white shadow-2xl rounded-lg p-2 dark:divide-gray-700 dark:bg-gray-800 dark:border dark:border-gray-700"
                >
                  <div class="py-2 first:pt-0 last:pb-0">
                    <button
                      @click="editUnit(unit); openDropdown = null"
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
                      @click="deleteUnit(unit); openDropdown = null"
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
    
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showModal = false"></div>
      <div class="relative bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7] w-full max-w-lg mx-auto my-8">
        <div class="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="font-bold text-gray-800 dark:text-white">{{ editingUnit ? 'แก้ไขห้องเช่า' : 'เพิ่มห้องเช่า' }}</h3>
          <button @click="showModal = false" type="button" class="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <span class="sr-only">Close</span>
            <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m18 6-12 12" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4 overflow-y-auto">
          <form>
            <div class="grid gap-4 lg:gap-6">
              <div>
                <label for="unit-property" class="block text-sm text-gray-700 font-medium dark:text-white">โครงการ</label>
                <select id="unit-property" v-model="form.propertyId" class="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-gray-600">
                  <option value="">เลือกโครงการ</option>
                  <option v-for="prop in properties" :key="prop.id" :value="prop.id">
                    {{ prop.name }}
                  </option>
                </select>
              </div>
              <div>
                <label for="unit-code" class="block text-sm text-gray-700 font-medium dark:text-white">หมายเลขห้อง</label>
                <input id="unit-code" v-model="form.unitCode" type="text" class="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="เช่น A101" />
              </div>
              <div>
                <label for="unit-floor" class="block text-sm text-gray-700 font-medium dark:text-white">ชั้น</label>
                <input id="unit-floor" v-model.number="form.floor" type="number" class="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="1" />
              </div>
              <div>
                <label for="unit-area" class="block text-sm text-gray-700 font-medium dark:text-white">พื้นที่ (ตร.ม.)</label>
                <input id="unit-area" v-model.number="form.areaSqm" type="number" class="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="35" />
              </div>
              <div>
                <label for="unit-rent" class="block text-sm text-gray-700 font-medium dark:text-white">ค่าเช่าพื้นฐาน</label>
                <input id="unit-rent" v-model.number="form.baseRentAmount" type="number" class="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="15000" />
              </div>
              <div v-if="editingUnit">
                <label for="unit-status" class="block text-sm text-gray-700 font-medium dark:text-white">สถานะ</label>
                <select id="unit-status" v-model="form.status" class="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-gray-600">
                  <option value="VACANT">ว่าง</option>
                  <option value="OCCUPIED">มีผู้เช่า</option>
                  <option value="INACTIVE">ไม่ใช้งาน</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200 dark:border-gray-700">
          <button @click="showModal = false" type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            ยกเลิก
          </button>
          <button @click="submit" type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            {{ editingUnit ? 'บันทึกการแก้ไข' : 'บันทึก' }}
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
const units = ref([])
const loading = ref(true)
const selectedPropertyId = ref('')
const showModal = ref(false)
const editingUnit = ref(null)
const openDropdown = ref(null)
const form = ref({
  propertyId: '',
  unitCode: '',
  floor: null,
  areaSqm: null,
  baseRentAmount: 0,
  status: 'VACANT'
})

async function loadUnits() {
  loading.value = true
  try {
    const query = selectedPropertyId.value ? { propertyId: selectedPropertyId.value } : {}
    const res = await $fetch('/api/units', { query })
    units.value = res.units
  } finally {
    loading.value = false
  }
}

async function submit() {
  try {
    if (editingUnit.value) {
      await $fetch(`/api/units/${editingUnit.value.id}`, {
        method: 'PATCH',
        body: form.value
      })
    } else {
      await $fetch('/api/units', {
        method: 'POST',
        body: form.value
      })
    }
    
    showModal.value = false
    editingUnit.value = null
    form.value = { propertyId: '', unitCode: '', floor: null, areaSqm: null, baseRentAmount: 0, status: 'VACANT' }
    loadUnits()
  } catch (error) {
    await showAlert(error.data?.message || 'เกิดข้อผิดพลาด', 'ข้อผิดพลาด', 'error')
  }
}

function editUnit(unit) {
  editingUnit.value = unit
  form.value = {
    propertyId: unit.propertyId,
    unitCode: unit.unitCode,
    floor: unit.floor,
    areaSqm: unit.areaSqm,
    baseRentAmount: unit.baseRentAmount,
    status: unit.status
  }
  showModal.value = true
}

async function deleteUnit(unit) {
  // ป้องกันการลบชั่วคราว
  await showAlert("ฟังก์ชันการลบถูกปิดใช้งานชั่วคราว เนื่องจากเป็นเวอร์ชั่น Demo", "แจ้งเตือน", "info");
  return;
  
  // const confirmed = await showConfirm(`ต้องการลบห้อง "${unit.unitCode}" หรือไม่?`, 'ยืนยันการลบ', 'error')
  // if (!confirmed) return
  
  // try {
  //   await $fetch(`/api/units/${unit.id}`, { method: 'DELETE' })
  //   await showAlert('ลบห้องเช่าเรียบร้อยแล้ว', 'สำเร็จ', 'success')
  //   loadUnits()
  // } catch (error) {
  //   await showAlert(error.data?.message || 'เกิดข้อผิดพลาดในการลบข้อมูล', 'ข้อผิดพลาด', 'error')
  // }
}

function toggleDropdown(unitId) {
  openDropdown.value = openDropdown.value === unitId ? null : unitId
}

function handleClickOutside(event) {
  if (!event.target.closest('.relative')) {
    openDropdown.value = null
  }
}

onMounted(async () => {
  const res = await $fetch('/api/properties')
  properties.value = res.properties
  loadUnits()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
