const globalModalState = ref({
  show: false,
  type: 'alert' as 'alert' | 'confirm',
  title: '',
  message: '',
  variant: 'info' as 'info' | 'success' | 'warning' | 'error',
  confirmText: 'ตกลง',
  cancelText: 'ยกเลิก',
  showCloseButton: true,
  resolve: null as ((value: any) => void) | null
})

export const useModal = () => {
  const showAlert = (message: string, title = 'แจ้งเตือน', variant: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    return new Promise<void>((resolve) => {
      globalModalState.value = {
        show: true,
        type: 'alert',
        title,
        message,
        variant,
        confirmText: 'ตกลง',
        cancelText: 'ยกเลิก',
        showCloseButton: true,
        resolve: () => resolve()
      }
    })
  }

  const showConfirm = (message: string, title = 'ยืนยัน', variant: 'info' | 'success' | 'warning' | 'error' = 'warning') => {
    return new Promise<boolean>((resolve) => {
      globalModalState.value = {
        show: true,
        type: 'confirm',
        title,
        message,
        variant,
        confirmText: 'ตกลง',
        cancelText: 'ยกเลิก',
        showCloseButton: true,
        resolve
      }
    })
  }

  const handleConfirm = () => {
    globalModalState.value.show = false
    if (globalModalState.value.resolve) {
      globalModalState.value.resolve(true)
    }
  }

  const handleCancel = () => {
    globalModalState.value.show = false
    if (globalModalState.value.resolve) {
      globalModalState.value.resolve(false)
    }
  }

  const handleClose = () => {
    globalModalState.value.show = false
    if (globalModalState.value.resolve) {
      globalModalState.value.resolve(globalModalState.value.type === 'alert' ? undefined : false)
    }
  }

  return {
    modalState: globalModalState,
    showAlert,
    showConfirm,
    handleConfirm,
    handleCancel,
    handleClose
  }
}