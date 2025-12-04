<template>
  <div class="bg-gray-50 dark:bg-slate-900">
    <!-- Header -->
    <header class="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white border-b border-gray-200 text-sm py-3 sm:py-4 lg:ps-64 shadow-sm">
      <nav class="flex basis-full items-center w-full mx-auto px-4 sm:px-6 md:px-8" aria-label="Global">
        <div class="me-5 lg:me-0 lg:hidden">
          <button @click="toggleMobileMenu" type="button" class="text-gray-600 hover:text-gray-800">
            <span class="sr-only">Toggle Navigation</span>
            <svg class="w-5 h-5" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </button>
        </div>

        <div class="w-full flex items-center justify-between ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
          <div class="sm:hidden">
            <h1 class="text-lg font-semibold text-gray-800">ระบบจัดการค่าเช่า</h1>
          </div>

          <div class="hidden sm:block">
            <h1 class="text-xl font-semibold text-gray-800">ระบบจัดการค่าเช่ารายเดือน & แจ้งเตือน LINE</h1>
          </div>

          <div class="flex flex-row items-center justify-end gap-2">
            <button @click="logout" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>
    </header>

    <!-- Sidebar -->
    <div id="application-sidebar" :class="['transition-all duration-300 transform fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 shadow-sm', mobileMenuOpen ? 'translate-x-0' : '-translate-x-full hidden lg:block']">
      <div class="px-6 mb-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-lg flex items-center justify-center shadow-md">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-800">Smart Rental</h2>
            <p class="text-xs text-gray-500">ระบบจัดการ</p>
          </div>
        </div>
      </div>

      <nav class="hs-accordion-group p-6 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
        <ul class="space-y-1.5" @click="mobileMenuOpen = false">
          <li>
            <NuxtLink to="/dashboard" class="flex items-center gap-x-3.5 py-2.5 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
              </svg>
              แดชบอร์ด
            </NuxtLink>
          </li>

          <li>
            <NuxtLink to="/properties" class="flex items-center gap-x-3.5 py-2.5 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              อาคาร / โครงการ
            </NuxtLink>
          </li>

          <li>
            <NuxtLink to="/units" class="flex items-center gap-x-3.5 py-2.5 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11"></path>
              </svg>
              ห้องเช่า
            </NuxtLink>
          </li>

          <li>
            <NuxtLink to="/tenants" class="flex items-center gap-x-3.5 py-2.5 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              ผู้เช่า
            </NuxtLink>
          </li>

          <li>
            <NuxtLink to="/leases" class="flex items-center gap-x-3.5 py-2.5 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              สัญญาเช่า
            </NuxtLink>
          </li>

          <li>
            <NuxtLink to="/invoices" class="flex items-center gap-x-3.5 py-2.5 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              ใบแจ้งหนี้รายเดือน
            </NuxtLink>
          </li>

          <li>
            <NuxtLink to="/auto-invoices" class="flex items-center gap-x-3.5 py-2.5 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              ระบบอัตโนมัติ
            </NuxtLink>
          </li>

          <li>
            <NuxtLink to="/line" class="flex items-center gap-x-3.5 py-2.5 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              การแจ้งเตือน LINE
            </NuxtLink>
          </li>

          <li>
            <NuxtLink to="/settings" class="flex items-center gap-x-3.5 py-2.5 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              ตั้งค่าระบบ
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Overlay -->
    <div v-if="mobileMenuOpen" @click="mobileMenuOpen = false" class="fixed inset-0 bg-black bg-opacity-50 z-[50] lg:hidden"></div>

    <!-- Content -->
    <div class="w-full lg:ps-64">
      <div class="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
        <slot />
      </div>
    </div>

    <!-- Global Modal -->
    <AppModal
      :show="modalState.show"
      :type="modalState.type"
      :title="modalState.title"
      :message="modalState.message"
      :variant="modalState.variant"
      :confirm-text="modalState.confirmText"
      :cancel-text="modalState.cancelText"
      :show-close-button="modalState.showCloseButton"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @close="handleClose"
    />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { modalState, handleConfirm, handleCancel, handleClose } = useModal()
const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  router.push('/login')
}
</script>

<style>
.router-link-active {
  @apply bg-primary-50 text-primary-700 font-semibold border-l-4 border-primary-500;
}
</style>
