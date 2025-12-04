<template>
  <div v-if="show" class="fixed inset-0 z-[80] overflow-x-hidden overflow-y-auto">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80" @click="handleBackdropClick"></div>
    <div class="min-h-full flex items-center justify-center p-4">
      <div class="relative bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 w-full max-w-lg">
        <!-- Header -->
        <div class="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
          <h3 class="font-bold text-gray-800 dark:text-white">
            {{ title }}
          </h3>
          <button
            v-if="showCloseButton"
            @click="close"
            type="button"
            class="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
          >
            <span class="sr-only">Close</span>
            <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m18 6-12 12"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 overflow-y-auto">
          <div v-if="type === 'alert'" class="flex items-start gap-x-3">
            <div class="flex-shrink-0">
              <svg v-if="variant === 'success'" class="size-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg v-else-if="variant === 'error'" class="size-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg v-else-if="variant === 'warning'" class="size-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <svg v-else class="size-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="grow">
              <p class="text-sm text-gray-800 dark:text-neutral-200">
                {{ message }}
              </p>
            </div>
          </div>
          
          <div v-else-if="type === 'confirm'" class="flex items-start gap-x-3">
            <div class="flex-shrink-0">
              <svg class="size-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="grow">
              <p class="text-sm text-gray-800 dark:text-neutral-200">
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
          <button
            v-if="type === 'confirm'"
            @click="cancel"
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
          >
            {{ cancelText }}
          </button>
          <button
            @click="confirm"
            type="button"
            :class="[
              'py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white disabled:opacity-50 disabled:pointer-events-none',
              variant === 'error' ? 'bg-red-600 hover:bg-red-700' : 
              variant === 'success' ? 'bg-green-600 hover:bg-green-700' :
              variant === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
              'bg-blue-600 hover:bg-blue-700'
            ]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  type: 'alert' | 'confirm'
  title: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  confirmText?: string
  cancelText?: string
  showCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  confirmText: 'ตกลง',
  cancelText: 'ยกเลิก',
  showCloseButton: true
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  close: []
}>()

function confirm() {
  emit('confirm')
}

function cancel() {
  emit('cancel')
}

function close() {
  emit('close')
}

function handleBackdropClick() {
  if (props.showCloseButton) {
    close()
  }
}
</script>