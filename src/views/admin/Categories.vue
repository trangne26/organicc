<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Danh mục</h1>
      <button class="px-3 py-2 bg-green-600 text-white rounded" @click="startCreate">Thêm danh mục</button>
    </div>

    <div class="overflow-x-auto bg-white border rounded">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-3 py-2">ID</th>
            <th class="text-left px-3 py-2">Tên</th>
            <th class="text-left px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in items" :key="c.id" class="border-t">
            <td class="px-3 py-2">{{ c.id }}</td>
            <td class="px-3 py-2">{{ c.name }}</td>
            <td class="px-3 py-2 text-right space-x-2">
              <button class="px-2 py-1 border rounded" @click="edit(c)">Sửa</button>
              <button class="px-2 py-1 border rounded text-red-600" @click="remove(c)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="mt-4 p-4 border rounded bg-white">
      <h2 class="font-medium mb-2">{{ editingId ? 'Cập nhật' : 'Tạo mới' }} danh mục</h2>
      <form @submit.prevent="save">
        <label class="block">
          <span class="text-sm text-gray-600">Tên</span>
          <input v-model="form.name" class="mt-1 w-full border rounded px-3 py-2" required />
        </label>
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
import { categoriesApi } from '@/api'

const items = ref([])
const showForm = ref(false)
const editingId = ref(null)
const form = ref({ name: '' })

const load = async () => {
  try {
    const res = await categoriesApi.listCategories()
    items.value = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) {}
}

onMounted(load)

const startCreate = () => {
  editingId.value = null
  form.value = { name: '' }
  showForm.value = true
}

const edit = (c) => {
  editingId.value = c.id
  form.value = { name: c.name }
  showForm.value = true
}

const save = async () => {
  try {
    if (editingId.value) await categoriesApi.updateCategory(editingId.value, form.value)
    else await categoriesApi.createCategory(form.value)
    showForm.value = false
    await load()
  } catch (e) {}
}

const remove = async (c) => {
  if (!confirm('Xóa danh mục này?')) return
  try {
    await categoriesApi.deleteCategory(c.id)
    await load()
  } catch (e) {}
}
</script>


