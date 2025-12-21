<template>
  <div class="min-h-screen flex flex-col">
    <AdminHeader />
    
    <div class="flex flex-1">
      <aside class="w-64 bg-gray-50 border-r border-gray-200 hidden md:block">
        <nav class="p-4 space-y-2">
          <RouterLink 
            to="/admin" 
            class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-green-100 text-green-700': $route.path === '/admin' }"
          >
            <span class="text-lg">📊</span>
            <span>Tổng quan</span>
          </RouterLink>
          
          <RouterLink 
            to="/admin/products" 
            class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-green-100 text-green-700': $route.path.startsWith('/admin/products') }"
          >
            <span class="text-lg">📦</span>
            <span>Sản phẩm</span>
          </RouterLink>
          
          <RouterLink 
            to="/admin/categories" 
            class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-green-100 text-green-700': $route.path.startsWith('/admin/categories') }"
          >
            <span class="text-lg">📂</span>
            <span>Danh mục</span>
          </RouterLink>
          
          <RouterLink 
            to="/admin/orders" 
            class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-green-100 text-green-700': $route.path.startsWith('/admin/orders') }"
          >
            <span class="text-lg">📋</span>
            <span>Đơn hàng</span>
          </RouterLink>
        </nav>
      </aside>
      
      <main class="flex-1 bg-gray-50">
        <div class="p-6">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminHeader from '@/components/layout/AdminHeader.vue'
</script>

<style scoped>

</style>


