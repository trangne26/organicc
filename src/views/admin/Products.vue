<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Sản phẩm</h1>
      <button class="px-3 py-2 bg-green-600 text-white rounded" @click="startCreate">Thêm sản phẩm</button>
    </div>

    <div class="overflow-x-auto bg-white border rounded">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-3 py-2">ID</th>
            <th class="text-left px-3 py-2">Tên</th>
            <th class="text-left px-3 py-2">Giá</th>
            <th class="text-left px-3 py-2">Danh mục</th>
            <th class="text-left px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in items" :key="p.id" class="border-t">
            <td class="px-3 py-2">{{ p.id }}</td>
            <td class="px-3 py-2">{{ p.name }}</td>
            <td class="px-3 py-2">{{ p.price?.toLocaleString('vi-VN') }}₫</td>
            <td class="px-3 py-2">{{ p.category?.name }}</td>
            <td class="px-3 py-2 text-right space-x-2">
              <button class="px-2 py-1 border rounded" @click="edit(p)">Sửa</button>
              <button class="px-2 py-1 border rounded text-red-600" @click="remove(p)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="mt-4 p-4 border rounded bg-white">
      <h2 class="font-medium mb-2">{{ editingId ? 'Cập nhật' : 'Tạo mới' }} sản phẩm</h2>
      <form @submit.prevent="save">
        <div class="grid md:grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm text-gray-600">Tên</span>
            <input v-model="form.name" class="mt-1 w-full border rounded px-3 py-2" required />
          </label>
          <label class="block">
            <span class="text-sm text-gray-600">Giá</span>
            <input type="number" v-model.number="form.price" class="mt-1 w-full border rounded px-3 py-2" required />
          </label>
          <label class="block md:col-span-2">
            <span class="text-sm text-gray-600">Mô tả</span>
            <textarea v-model="form.description" class="mt-1 w-full border rounded px-3 py-2" rows="3"></textarea>
          </label>
        </div>
        <div class="mt-3 flex gap-2">
          <button type="submit" class="px-3 py-2 bg-green-600 text-white rounded">Lưu</button>
          <button type="button" class="px-3 py-2 border rounded" @click="cancel">Hủy</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productsApi } from '@/api'

const items = ref([])
const showForm = ref(false)
const editingId = ref(null)
const form = ref({ name: '', price: 0, description: '' })

const load = async () => {
  try {
    const res = await productsApi.listProducts()
    items.value = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) {}
}

onMounted(load)

const startCreate = () => {
  editingId.value = null
  form.value = { name: '', price: 0, description: '' }
  showForm.value = true
}

const edit = (p) => {
  editingId.value = p.id
  form.value = { name: p.name, price: p.price, description: p.description }
  showForm.value = true
}

const save = async () => {
  try {
    if (editingId.value) await productsApi.updateProduct(editingId.value, form.value)
    else await productsApi.createProduct(form.value)
    showForm.value = false
    await load()
  } catch (e) {}
}

const remove = async (p) => {
  if (!confirm('Xóa sản phẩm này?')) return
  try {
    await productsApi.deleteProduct(p.id)
    await load()
  } catch (e) {}
}
</script>


