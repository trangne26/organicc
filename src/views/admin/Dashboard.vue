<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Bảng điều khiển</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 bg-white border rounded">
        <div class="text-sm text-gray-500">Tổng sản phẩm</div>
        <div class="text-2xl font-bold">{{ metrics.totalProducts }}</div>
      </div>
      <div class="p-4 bg-white border rounded">
        <div class="text-sm text-gray-500">Tổng đơn hàng</div>
        <div class="text-2xl font-bold">{{ metrics.totalOrders }}</div>
      </div>
      <div class="p-4 bg-white border rounded">
        <div class="text-sm text-gray-500">Doanh thu (tháng)</div>
        <div class="text-2xl font-bold">{{ metrics.monthRevenue.toLocaleString('vi-VN') }}₫</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productsApi, ordersApi } from '@/api'

const metrics = ref({ totalProducts: 0, totalOrders: 0, monthRevenue: 0 })

onMounted(async () => {
  try {
    const [products, orders] = await Promise.all([
      productsApi.listProducts({ limit: 1 }),
      ordersApi.listOrders({ limit: 1 }),
    ])
    metrics.value.totalProducts = products?.meta?.total ?? (products?.length ?? 0)
    metrics.value.totalOrders = orders?.meta?.total ?? (orders?.length ?? 0)
    metrics.value.monthRevenue = 0
  } catch (err) {
  }
})
</script>


