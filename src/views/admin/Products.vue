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
            <th class="text-left px-3 py-2">Ảnh</th>
            <th class="text-left px-3 py-2">Tên</th>
            <th class="text-left px-3 py-2">Giá</th>
            <th class="text-left px-3 py-2">Danh mục</th>
            <th class="text-left px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in items" :key="p.id" class="border-t">
            <td class="px-3 py-2">{{ p.id }}</td>
            <td class="px-3 py-2">
              <img 
                :src="getPrimaryImage(p)" 
                :alt="p.name"
                class="w-12 h-12 object-cover rounded"
                @error="handleImageError"
              />
            </td>
            <td class="px-3 py-2">{{ p.name }}</td>
            <td class="px-3 py-2">{{ formatPrice(p.price) }}</td>
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
            <span class="text-sm text-gray-600">Tên *</span>
            <input v-model="form.name" class="mt-1 w-full border rounded px-3 py-2" required />
          </label>
          <label class="block">
            <span class="text-sm text-gray-600">Giá *</span>
            <input type="number" v-model.number="form.price" class="mt-1 w-full border rounded px-3 py-2" required />
          </label>
          <label class="block">
            <span class="text-sm text-gray-600">Danh mục *</span>
            <select v-model="form.category_id" class="mt-1 w-full border rounded px-3 py-2" required>
              <option value="">Chọn danh mục</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </label>
          <label class="block">
            <span class="text-sm text-gray-600">Trạng thái</span>
            <select v-model="form.is_active" class="mt-1 w-full border rounded px-3 py-2">
              <option :value="1">Kích hoạt</option>
              <option :value="0">Tạm dừng</option>
            </select>
          </label>
          <label class="block md:col-span-2">
            <span class="text-sm text-gray-600">Mô tả</span>
            <textarea v-model="form.description" class="mt-1 w-full border rounded px-3 py-2" rows="3"></textarea>
          </label>
          
          <!-- Image Upload Section -->
          <label class="block md:col-span-2">
            <span class="text-sm text-gray-600">Hình ảnh</span>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              @change="handleImageUpload" 
              class="mt-1 w-full border rounded px-3 py-2"
            />
            <div v-if="uploadedFilesCount > 0" class="mt-2">
              <div class="flex flex-wrap gap-2">
                <div v-for="(image, index) in uploadedFiles" :key="index" class="relative">
                  <img :src="getImagePreview(image)" alt="Preview" class="w-20 h-20 object-cover rounded border" />
                  <button 
                    type="button" 
                    @click="removeImage(index)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                  <div class="text-center mt-1">
                    <input 
                      type="radio" 
                      :value="index" 
                      v-model="form.primary_image_index"
                      class="mr-1"
                    />
                    <span class="text-xs">{{ index === form.primary_image_index ? 'Ảnh chính' : 'Đặt làm ảnh chính' }}</span>
                  </div>
                </div>
              </div>
            </div>
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
import { productsApi, categoriesApi } from '@/api'
import { useProductImage } from '@/composables/useProductImage'

const { getPrimaryImage, formatPrice, handleImageError } = useProductImage()

const items = ref([])
const categories = ref([])
const showForm = ref(false)
const editingId = ref(null)
const form = ref({ 
  category_id: '', 
  name: '', 
  price: 0, 
  description: '', 
  is_active: 1, 
  primary_image_index: 0 
})

// Store files separately to avoid proxy issues - use non-reactive array
let uploadedFiles = []
const uploadedFilesCount = ref(0)

const load = async () => {
  try {
    const res = await productsApi.listProducts()
    items.value = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) {}
}

const loadCategories = async () => {
  try {
    const res = await categoriesApi.listCategories()
    categories.value = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) {}
}

onMounted(() => {
  load()
  loadCategories()
})

const startCreate = () => {
  editingId.value = null
  form.value = { 
    category_id: '', 
    name: '', 
    price: 0, 
    description: '', 
    is_active: 1, 
    primary_image_index: 0 
  }
  uploadedFiles = []
  uploadedFilesCount.value = 0
  showForm.value = true
}

const edit = (p) => {
  editingId.value = p.id
  form.value = { 
    category_id: p.category?.id || '', 
    name: p.name, 
    price: p.price, 
    description: p.description || '', 
    is_active: p.is_active ? 1 : 0, 
    primary_image_index: 0 
  }
  uploadedFiles = []
  uploadedFilesCount.value = 0
  showForm.value = true
}

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  console.log('Uploaded files:', files) // Debug log
  
  // Store files in non-reactive array to avoid proxy issues
  uploadedFiles = files
  uploadedFilesCount.value = files.length
  
  // Auto-set primary image if none selected
  if (form.value.primary_image_index === 0 && files.length > 0) {
    form.value.primary_image_index = 0
  }
  
  // Clear the input so same files can be selected again
  event.target.value = ''
}

const removeImage = (index) => {
  uploadedFiles.splice(index, 1)
  uploadedFilesCount.value = uploadedFiles.length
  
  // Adjust primary image index if needed
  if (form.value.primary_image_index >= index) {
    form.value.primary_image_index = Math.max(0, form.value.primary_image_index - 1)
  }
  
  // If no images left, reset primary index
  if (uploadedFiles.length === 0) {
    form.value.primary_image_index = 0
  }
}

const getImagePreview = (file) => {
  return URL.createObjectURL(file)
}

const save = async () => {
  try {
    const formData = new FormData()
    
    // Add form fields
    formData.append('category_id', form.value.category_id)
    formData.append('name', form.value.name)
    formData.append('price', form.value.price)
    formData.append('description', form.value.description)
    formData.append('is_active', form.value.is_active)
    formData.append('primary_image_index', form.value.primary_image_index)
    
    // Add images - only if there are actual files
    console.log('uploadedFiles (non-reactive):', uploadedFiles)
    
    if (uploadedFiles && uploadedFiles.length > 0) {
      uploadedFiles.forEach((image, index) => {
        console.log(`Image ${index}:`, image, 'is File?', image instanceof File)
        // Check if it's a File object
        if (image instanceof File) {
          formData.append('images[]', image)
        }
      })
    }
    
    // Debug: Log the FormData contents
    console.log('FormData contents:')
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1])
    }
    
    if (editingId.value) {
      await productsApi.updateProduct(editingId.value, formData)
    } else {
      await productsApi.createProduct(formData)
    }
    
    showForm.value = false
    await load()
  } catch (e) {
    console.error('Error saving product:', e)
  }
}

const cancel = () => {
  showForm.value = false
  form.value = { 
    category_id: '', 
    name: '', 
    price: 0, 
    description: '', 
    is_active: 1, 
    primary_image_index: 0 
  }
  uploadedFiles = []
  uploadedFilesCount.value = 0
}


const remove = async (p) => {
  if (!confirm('Xóa sản phẩm này?')) return
  try {
    await productsApi.deleteProduct(p.id)
    await load()
  } catch (e) {}
}
</script>


