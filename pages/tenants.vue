<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold">ผู้เช่า</h1>
      <button
        @click="showModal = true"
        type="button"
        class="w-full sm:w-auto py-2.5 sm:py-3 px-3 sm:px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span class="hidden sm:inline">เพิ่มผู้เช่า</span>
        <span class="sm:hidden">เพิ่ม</span>
      </button>
    </div>
    
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
      <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">รายการผู้เช่า</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">ทั้งหมด {{ tenants.length }} คน</p>
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
      <div v-else-if="!tenants.length" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มีรายการผู้เช่า</h3>
        <p class="mt-1 text-sm text-gray-500">เริ่มต้นโดยการเพิ่มผู้เช่าใหม่</p>
        <div class="mt-6">
          <button @click="showModal = true" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            เพิ่มผู้เช่า
          </button>
        </div>
      </div>

      <!-- Mobile Card View -->
      <div v-else class="lg:hidden divide-y divide-gray-200">
        <div v-for="tenant in tenants" :key="tenant.id" class="p-4 hover:bg-gray-50">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-800 text-sm">{{ tenant.fullName }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">{{ tenant.phone }}</p>
            </div>
            <div class="relative ml-2">
              <button @click="toggleDropdown(tenant.id)" class="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>
              </button>
              <div v-show="openDropdown === tenant.id" class="absolute right-0 mt-1 w-36 bg-white shadow-lg rounded-lg p-1.5 z-10 border">
                <button @click="editTenant(tenant); openDropdown = null" class="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-md">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  แก้ไข
                </button>
                <button @click="deleteTenant(tenant); openDropdown = null" class="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-red-600 hover:bg-gray-100 rounded-md">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  ลบ
                </button>
              </div>
            </div>
          </div>
          <div class="text-xs text-gray-600 space-y-1 mb-2">
            <div v-if="tenant.email">อีเมล: {{ tenant.email }}</div>
            <div v-if="tenant.leases.length">
              <span class="text-gray-500">ห้อง:</span>
              <span v-for="(lease, idx) in tenant.leases" :key="lease.id">
                {{ lease.unit.property.name }} - {{ lease.unit.unitCode }}<span v-if="idx < tenant.leases.length - 1">, </span>
              </span>
            </div>
          </div>
          <span v-if="tenant.lineUserId" class="inline-flex items-center gap-1 text-xs text-green-600">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            LINE เชื่อมต่อแล้ว
          </span>
          <span v-else class="text-xs text-gray-400">ยังไม่เชื่อม LINE</span>
        </div>
      </div>

      <!-- Desktop Table View -->
      <table v-if="!loading && tenants.length" class="hidden lg:table w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เบอร์โทร</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">อีเมล</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ห้องที่พัก</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">LINE</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="tenant in tenants" :key="tenant.id">
            <td class="px-6 py-4 font-medium">{{ tenant.fullName }}</td>
            <td class="px-6 py-4">{{ tenant.phone }}</td>
            <td class="px-6 py-4">{{ tenant.email || '-' }}</td>
            <td class="px-6 py-4">
              <div v-for="lease in tenant.leases" :key="lease.id">
                {{ lease.unit.property.name }} - {{ lease.unit.unitCode }}
              </div>
              <span v-if="!tenant.leases.length">-</span>
            </td>
            <td class="px-6 py-4">
              <span v-if="tenant.lineUserId" class="text-green-600">✓ เชื่อมต่อแล้ว</span>
              <span v-else class="text-gray-400">ยังไม่เชื่อมต่อ</span>
            </td>
            <td class="px-6 py-4">
              <div class="relative inline-block">
                <button
                  @click="toggleDropdown(tenant.id)"
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
                  v-show="openDropdown === tenant.id"
                  class="absolute right-0 mt-2 divide-y divide-gray-200 min-w-40 z-10 bg-white shadow-2xl rounded-lg p-2 dark:divide-gray-700 dark:bg-gray-800 dark:border dark:border-gray-700"
                >
                  <div class="py-2 first:pt-0 last:pb-0">
                    <button
                      @click="editTenant(tenant); openDropdown = null"
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
                      @click="deleteTenant(tenant); openDropdown = null"
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
          <h3 class="font-bold text-gray-800 dark:text-white">{{ editingTenant ? 'แก้ไขผู้เช่า' : 'เพิ่มผู้เช่า' }}</h3>
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
            <label class="block text-sm font-medium mb-1">ชื่อ-นามสกุล</label>
            <input v-model="form.fullName" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">เบอร์โทร</label>
            <input v-model="form.phone" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">อีเมล</label>
            <input v-model="form.email" type="email" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">LINE User ID</label>
            <input v-model="form.lineUserId" class="w-full px-3 py-2 border rounded-lg" />
            <p class="text-xs text-gray-500 mt-1">ใช้สำหรับส่งข้อความแจ้งเตือนผ่าน LINE</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">หมายเหตุ</label>
            <textarea v-model="form.note" class="w-full px-3 py-2 border rounded-lg" rows="2"></textarea>
          </div>
            </div>
          </form>
        </div>
        <div class="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200 dark:border-gray-700">
          <button @click="showModal = false" type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            ยกเลิก
          </button>
          <button @click="submit" type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            {{ editingTenant ? 'บันทึกการแก้ไข' : 'บันทึก' }}
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
const tenants = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingTenant = ref(null)
const openDropdown = ref(null)
const form = ref({
  fullName: '',
  phone: '',
  email: '',
  lineUserId: '',
  note: ''
})

async function loadTenants() {
  loading.value = true
  try {
    const res = await $fetch('/api/tenants')
    tenants.value = res.tenants
  } finally {
    loading.value = false
  }
}

async function submit() {
  try {
    if (editingTenant.value) {
      await $fetch(`/api/tenants/${editingTenant.value.id}`, {
        method: 'PATCH',
        body: form.value
      })
    } else {
      await $fetch('/api/tenants', {
        method: 'POST',
        body: form.value
      })
    }
    
    showModal.value = false
    editingTenant.value = null
    form.value = { fullName: '', phone: '', email: '', lineUserId: '', note: '' }
    loadTenants()
  } catch (error) {
    await showAlert(error.data?.message || 'เกิดข้อผิดพลาด', 'ข้อผิดพลาด', 'error')
  }
}

function editTenant(tenant) {
  editingTenant.value = tenant
  form.value = {
    fullName: tenant.fullName,
    phone: tenant.phone,
    email: tenant.email || '',
    lineUserId: tenant.lineUserId || '',
    note: tenant.note || ''
  }
  showModal.value = true
}

async function deleteTenant(tenant) {
  // ป้องกันการลบชั่วคราว
  await showAlert("ฟังก์ชันการลบถูกปิดใช้งานชั่วคราว เนื่องจากเป็นเวอร์ชั่น Demo", "แจ้งเตือน", "info");
  return;
  
  // const confirmed = await showConfirm(`ต้องการลบผู้เช่า "${tenant.fullName}" หรือไม่?`, 'ยืนยันการลบ', 'error')
  // if (!confirmed) return
  
  // try {
  //   await $fetch(`/api/tenants/${tenant.id}`, { method: 'DELETE' })
  //   await showAlert('ลบผู้เช่าเรียบร้อยแล้ว', 'สำเร็จ', 'success')
  //   loadTenants()
  // } catch (error) {
  //   await showAlert(error.data?.message || 'เกิดข้อผิดพลาดในการลบข้อมูล', 'ข้อผิดพลาด', 'error')
  // }
}

function toggleDropdown(tenantId) {
  openDropdown.value = openDropdown.value === tenantId ? null : tenantId
}

function handleClickOutside(event) {
  if (!event.target.closest('.relative')) {
    openDropdown.value = null
  }
}

onMounted(() => {
  loadTenants()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
