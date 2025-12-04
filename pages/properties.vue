<template>
  <div>
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8 gap-3"
    >
      <div>
        <h1
          class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white"
        >
          อาคาร / โครงการ
        </h1>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          จัดการข้อมูลอาคารและโครงการทั้งหมด
        </p>
      </div>
      <div class="flex-shrink-0">
        <button
          @click="showModal = true"
          type="button"
          class="w-full sm:w-auto py-2.5 sm:py-3 px-3 sm:px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <span class="hidden sm:inline">เพิ่มโครงการใหม่</span>
          <span class="sm:hidden">เพิ่ม</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="flex flex-col">
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div
            class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700"
          >
            <div
              class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700"
            >
              <div>
                <h2
                  class="text-xl font-semibold text-gray-800 dark:text-gray-200"
                >
                  รายการโครงการ
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  ทั้งหมด {{ properties.length }} โครงการ
                </p>
              </div>
            </div>

            <!-- Loading State -->
            <div
              v-if="loading"
              class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]"
            >
              <div
                class="flex flex-auto flex-col justify-center items-center p-4 md:p-5"
              >
                <div class="flex justify-center">
                  <div
                    class="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                    role="status"
                    aria-label="loading"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!properties.length" class="p-8 text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                ไม่มีรายการโครงการ
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                เริ่มต้นโดยการเพิ่มโครงการใหม่
              </p>
              <div class="mt-6">
                <button
                  @click="showModal = true"
                  type="button"
                  class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  <svg
                    class="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  เพิ่มโครงการใหม่
                </button>
              </div>
            </div>

            <!-- Mobile Card View -->
            <div v-else class="lg:hidden divide-y divide-gray-200">
              <div
                v-for="property in properties"
                :key="property.id"
                class="p-4 hover:bg-gray-50"
              >
                <div class="flex justify-between items-start mb-2">
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-800 text-sm truncate">
                      {{ property.name }}
                    </h3>
                    <p class="text-xs text-gray-500 mt-0.5">
                      รหัส: {{ property.code }}
                    </p>
                  </div>
                  <div class="relative ml-2">
                    <button
                      @click="toggleDropdown(property.id)"
                      class="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                        />
                      </svg>
                    </button>
                    <div
                      v-show="openDropdown === property.id"
                      class="absolute right-0 mt-1 w-36 bg-white shadow-lg rounded-lg p-1.5 z-10 border"
                    >
                      <button
                        @click="
                          editProperty(property);
                          openDropdown = null;
                        "
                        class="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <svg
                          class="w-3.5 h-3.5"
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
                        @click="
                          deleteProperty(property);
                          openDropdown = null;
                        "
                        class="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-red-600 hover:bg-gray-100 rounded-md"
                      >
                        <svg
                          class="w-3.5 h-3.5"
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
                <p class="text-xs text-gray-600 mb-2 line-clamp-1">
                  {{ property.address }}
                </p>
                <span
                  class="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ property._count.units }} ห้อง
                </span>
              </div>
            </div>

            <!-- Desktop Table View -->
            <table
              v-if="!loading && properties.length"
              class="hidden lg:table min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead class="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th scope="col" class="ps-6 py-3 text-start">
                    <span class="text-xs font-medium text-gray-500 uppercase"
                      >ชื่อโครงการ</span
                    >
                  </th>
                  <th scope="col" class="px-6 py-3 text-start">
                    <span class="text-xs font-medium text-gray-500 uppercase"
                      >รหัส</span
                    >
                  </th>
                  <th scope="col" class="px-6 py-3 text-start">
                    <span class="text-xs font-medium text-gray-500 uppercase"
                      >ที่อยู่</span
                    >
                  </th>
                  <th scope="col" class="px-6 py-3 text-start">
                    <span class="text-xs font-medium text-gray-500 uppercase"
                      >จำนวนห้อง</span
                    >
                  </th>
                  <th scope="col" class="px-6 py-3 text-start">
                    <span class="text-xs font-medium text-gray-500 uppercase"
                      >จัดการ</span
                    >
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="property in properties"
                  :key="property.id"
                  class="hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <td class="h-px w-px whitespace-nowrap">
                    <div class="ps-6 py-3">
                      <div class="flex items-center gap-x-3">
                        <div class="grow">
                          <span
                            class="block text-sm font-semibold text-gray-800 dark:text-gray-200"
                            >{{ property.name }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="h-px w-px whitespace-nowrap">
                    <div class="px-6 py-3">
                      <span class="block text-sm text-gray-500">{{
                        property.code
                      }}</span>
                    </div>
                  </td>
                  <td class="h-px w-px whitespace-nowrap">
                    <div class="px-6 py-3">
                      <span class="block text-sm text-gray-500">{{
                        property.address
                      }}</span>
                    </div>
                  </td>
                  <td class="h-px w-px whitespace-nowrap">
                    <div class="px-6 py-3">
                      <span
                        class="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {{ property._count.units }} ห้อง
                      </span>
                    </div>
                  </td>
                  <td class="h-px w-px whitespace-nowrap">
                    <div class="px-6 py-1.5 text-center">
                      <div class="relative inline-block">
                        <button
                          @click="toggleDropdown(property.id)"
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
                          v-show="openDropdown === property.id"
                          class="absolute right-0 mt-2 divide-y divide-gray-200 min-w-40 z-10 bg-white shadow-2xl rounded-lg p-2 dark:divide-gray-700 dark:bg-gray-800 dark:border dark:border-gray-700"
                        >
                          <div class="py-2 first:pt-0 last:pb-0">
                            <button
                              @click="
                                editProperty(property);
                                openDropdown = null;
                              "
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
                              @click="
                                deleteProperty(property);
                                openDropdown = null;
                              "
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
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-black bg-opacity-50"
        @click="showModal = false"
      ></div>
      <div
        class="relative bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7] w-full max-w-lg mx-auto my-8"
      >
        <div
          class="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-gray-700"
        >
          <h3 class="font-bold text-gray-800 dark:text-white">
            {{ editingProperty ? "แก้ไขโครงการ" : "เพิ่มโครงการใหม่" }}
          </h3>
          <button
            @click="showModal = false"
            type="button"
            class="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            <span class="sr-only">Close</span>
            <svg
              class="flex-shrink-0 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m18 6-12 12" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4 overflow-y-auto">
          <form>
            <div class="grid gap-4 lg:gap-6">
              <div>
                <label
                  for="property-name"
                  class="block text-sm text-gray-700 font-medium dark:text-white"
                  >ชื่อโครงการ</label
                >
                <input
                  id="property-name"
                  v-model="form.name"
                  type="text"
                  class="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-gray-600"
                  placeholder="กรอกชื่อโครงการ"
                />
              </div>
              <div>
                <label
                  for="property-code"
                  class="block text-sm text-gray-700 font-medium dark:text-white"
                  >รหัสโครงการ</label
                >
                <input
                  id="property-code"
                  v-model="form.code"
                  type="text"
                  class="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-gray-600"
                  placeholder="เช่น C-001"
                />
              </div>
              <div>
                <label
                  for="property-address"
                  class="block text-sm text-gray-700 font-medium dark:text-white"
                  >ที่อยู่</label
                >
                <textarea
                  id="property-address"
                  v-model="form.address"
                  class="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-gray-600"
                  rows="3"
                  placeholder="ที่อยู่โครงการ"
                ></textarea>
              </div>
              <div>
                <label
                  for="property-description"
                  class="block text-sm text-gray-700 font-medium dark:text-white"
                  >รายละเอียด</label
                >
                <textarea
                  id="property-description"
                  v-model="form.description"
                  class="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-gray-600"
                  rows="2"
                  placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div
          class="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200 dark:border-gray-700"
        >
          <button
            @click="showModal = false"
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            ยกเลิก
          </button>
          <button
            @click="submit"
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            {{ editingProperty ? "บันทึกการแก้ไข" : "บันทึก" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
const properties = ref([]);
const loading = ref(true);
const showModal = ref(false);
const editingProperty = ref(null);
const openDropdown = ref(null);
const form = ref({
  name: "",
  code: "",
  address: "",
  description: "",
});

const { showAlert, showConfirm } = useModal();

async function loadProperties() {
  loading.value = true;
  try {
    const res = await $fetch("/api/properties");
    properties.value = res.properties;
  } finally {
    loading.value = false;
  }
}

async function submit() {
  try {
    if (editingProperty.value) {
      await $fetch(`/api/properties/${editingProperty.value.id}`, {
        method: "PATCH",
        body: form.value,
      });
    } else {
      await $fetch("/api/properties", {
        method: "POST",
        body: form.value,
      });
    }

    showModal.value = false;
    editingProperty.value = null;
    form.value = { name: "", code: "", address: "", description: "" };
    loadProperties();
  } catch (error) {
    await showAlert(
      error.data?.message || "เกิดข้อผิดพลาด",
      "ข้อผิดพลาด",
      "error"
    );
  }
}

function editProperty(property) {
  editingProperty.value = property;
  form.value = {
    name: property.name,
    code: property.code,
    address: property.address,
    description: property.description || "",
  };
  showModal.value = true;
}

async function deleteProperty(property) {
  // ป้องกันการลบชั่วคราว
  await showAlert("ฟังก์ชันการลบถูกปิดใช้งานชั่วคราว เนื่องจากเป็นเวอร์ชั่น Demo", "แจ้งเตือน", "info");
  return;
  
  // const confirmed = await showConfirm(
  //   `ต้องการลบโครงการ "${property.name}" หรือไม่?`,
  //   "ยืนยันการลบ",
  //   "error"
  // );
  // if (!confirmed) return;

  // try {
  //   await $fetch(`/api/properties/${property.id}`, { method: "DELETE" });
  //   await showAlert("ลบโครงการเรียบร้อยแล้ว", "สำเร็จ", "success");
  //   loadProperties();
  // } catch (error) {
  //   await showAlert(
  //     error.data?.message || "เกิดข้อผิดพลาดในการลบข้อมูล",
  //     "ข้อผิดพลาด",
  //     "error"
  //   );
  // }
}

function toggleDropdown(propertyId) {
  openDropdown.value = openDropdown.value === propertyId ? null : propertyId;
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest(".relative")) {
    openDropdown.value = null;
  }
}

onMounted(() => {
  loadProperties();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
