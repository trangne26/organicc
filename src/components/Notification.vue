<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="notification && notification.show"
      :class="[
        'fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
        notification.type === 'success' ? 'border-l-4 border-green-400' : '',
        notification.type === 'error' ? 'border-l-4 border-red-400' : '',
        notification.type === 'warning' ? 'border-l-4 border-yellow-400' : '',
        notification.type === 'info' ? 'border-l-4 border-blue-400' : ''
      ]"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <span
              v-if="notification.type === 'success'"
              class="text-green-400 text-xl"
            >
              ✅
            </span>
            <span
              v-else-if="notification.type === 'error'"
              class="text-red-400 text-xl"
            >
              ❌
            </span>
            <span
              v-else-if="notification.type === 'warning'"
              class="text-yellow-400 text-xl"
            >
              ⚠️
            </span>
            <span
              v-else
              class="text-blue-400 text-xl"
            >
              ℹ️
            </span>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">
              {{ notification.message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="hideNotification"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Đóng</span>
              <span class="text-lg">✕</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification'

const { notification, hideNotification } = useNotification()
</script>
