<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Đơn hàng</h1>
    <div class="overflow-x-auto bg-white border rounded">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-3 py-2">ID</th>
            <th class="text-left px-3 py-2">Khách hàng</th>
            <th class="text-left px-3 py-2">Tổng tiền</th>
            <th class="text-left px-3 py-2">Trạng thái</th>
            <th class="text-left px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in items" :key="o.id" class="border-t">
            <td class="px-3 py-2">{{ o.id }}</td>
            <td class="px-3 py-2">{{ o.customer_name || o.user?.name }}</td>
            <td class="px-3 py-2">{{ o.total?.toLocaleString('vi-VN') }}₫</td>
            <td class="px-3 py-2">{{ o.status }}</td>
            <td class="px-3 py-2 text-right space-x-2">
              <select v-model="o.status" class="border rounded px-2 py-1" @change="updateStatus(o)">
                <option value="pending">pending</option>
                <option value="processing">processing</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ordersApi } from '@/api'

const items = ref([])

const load = async () => {
  try {
    const res = await ordersApi.listOrders()
    items.value = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) {}
}

onMounted(load)

const updateStatus = async (o) => {
  try {
    await ordersApi.updateOrderStatus(o.id, { status: o.status })
  } catch (e) {}
}
</script>


