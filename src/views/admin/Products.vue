<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Sản phẩm</h1>
      <button class="px-3 py-2 bg-green-600 text-white rounded" @click="startCreate">Thêm sản phẩm</button>
    </div>

    <div class="bg-white border rounded p-4 mb-4 grid gap-4 md:grid-cols-3">
      <label class="block">
        <span class="text-sm text-gray-600">Tìm kiếm theo tên</span>
        <input 
          v-model="searchTerm" 
          type="text"
          placeholder="Nhập tên sản phẩm..."
          class="mt-1 w-full border rounded px-3 py-2"
        />
      </label>
      <label class="block">
        <span class="text-sm text-gray-600">Lọc theo danh mục</span>
        <select 
          v-model="selectedCategory"
          class="mt-1 w-full border rounded px-3 py-2"
        >
          <option value="">Tất cả</option>
          <option 
            v-for="category in categories" 
            :key="category.id" 
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </label>
      <div class="flex items-end">
        <button 
          type="button" 
          class="px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          @click="resetFilters"
          :disabled="!searchTerm && !selectedCategory"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>

    <div class="overflow-x-auto bg-white border rounded">
      <template v-if="isLoadingProducts">
        <div class="p-6 text-center text-sm text-gray-500">Đang tải sản phẩm...</div>
      </template>
      <template v-else-if="items.length">
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
                <button class="px-2 py-1 border rounded text-red-600" @click="requestDelete(p)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <div v-else class="p-6 text-center text-sm text-gray-500">
        Không tìm thấy sản phẩm phù hợp.
      </div>
    </div>

    <div 
      v-if="showForm" 
      ref="formSectionRef" 
      class="mt-4 p-4 border rounded bg-white"
    >
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
          
          <div class="block md:col-span-2">
            <span class="text-sm text-gray-600">Hình ảnh</span>
            <div class="mt-1">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                @change="handleImageUpload" 
                class="w-full border rounded px-3 py-2"
              />
            </div>

            <div 
              v-if="(editingId && existingImages.length) || uploadedFilesCount > 0" 
              class="mt-3"
            >
              <div class="flex flex-wrap gap-2">
                <div 
                  v-for="(img, index) in existingImages" 
                  :key="`existing-${img.id ?? index}`" 
                  class="relative"
                >
                  <img 
                    :src="getImageUrl(img.url)" 
                    :alt="form.name || 'Product image'" 
                    class="w-20 h-20 object-cover rounded border" 
                    @error="handleImageError"
                  />
                  <button 
                    type="button" 
                    @click="removeExistingImage(index)"
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
                    <span class="text-xs">
                      {{ 'Ảnh chính' }}
                    </span>
                  </div>
                </div>

                <div 
                  v-for="(image, index) in uploadedFiles" 
                  :key="`new-${index}`" 
                  class="relative"
                >
                  <img 
                    :src="getImagePreview(image)" 
                    alt="Preview" 
                    class="w-20 h-20 object-cover rounded border" 
                  />
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
                      :value="existingImages.length + index" 
                      v-model="form.primary_image_index"
                      class="mr-1"
                    />
                    <span class="text-xs">
                      {{ 'Ảnh chính' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <button type="submit" class="px-3 py-2 bg-green-600 text-white rounded">Lưu</button>
          <button type="button" class="px-3 py-2 border rounded" @click="cancel">Hủy</button>
        </div>
      </form>
    </div>
    <div 
      v-if="pendingDeleteProduct" 
      class="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <div>
          <h3 class="text-lg font-semibold mb-1">Xóa sản phẩm</h3>
          <p class="text-sm text-gray-600">
            Bạn chắc chắn muốn xóa 
            <span class="font-medium text-gray-900">{{ pendingDeleteProduct?.name }}</span>?
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <div class="flex justify-end gap-2">
          <button 
            type="button" 
            class="px-4 py-2 border rounded text-sm"
            @click="cancelDelete"
            :disabled="isDeleting"
          >
            Hủy
          </button>
          <button 
            type="button" 
            class="px-4 py-2 bg-red-600 text-white rounded text-sm"
            @click="confirmDelete"
            :disabled="isDeleting"
          >
            {{ isDeleting ? 'Đang xóa...' : 'Xóa' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { productsApi, categoriesApi } from '@/api'
import { useProductImage } from '@/composables/useProductImage'

const { getPrimaryImage, getImageUrl, formatPrice, handleImageError } = useProductImage()

const items = ref([])
const isLoadingProducts = ref(false)
const categories = ref([])
const showForm = ref(false)
const editingId = ref(null)
const editingProduct = ref(null)
const existingImages = ref([])
const removedExistingImageIds = ref([])
const pendingDeleteProduct = ref(null)
const isDeleting = ref(false)
const form = ref({ 
  category_id: '', 
  name: '', 
  price: 0, 
  description: '', 
  is_active: 1, 
  primary_image_index: 0 
})

const uploadedFiles = ref([])
const uploadedFilesCount = ref(0)
const formSectionRef = ref(null)
const searchTerm = ref('')
const selectedCategory = ref('')
const filtersInitialized = ref(false)
let searchDebounceTimeout

const load = async () => {
  const params = {}
  if (searchTerm.value.trim()) {
    params.search = searchTerm.value.trim()
  }
  if (selectedCategory.value) {
    params.category_id = selectedCategory.value
  }

  isLoadingProducts.value = true

  try {
    const res = await productsApi.listProducts(params)
    items.value = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) {
  } finally {
    isLoadingProducts.value = false
  }
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
  filtersInitialized.value = true
})

watch(searchTerm, () => {
  if (!filtersInitialized.value) return
  if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout)
  searchDebounceTimeout = setTimeout(() => {
    load()
  }, 400)
})

watch(selectedCategory, () => {
  if (!filtersInitialized.value) return
  load()
})

const startCreate = () => {
  editingId.value = null
  editingProduct.value = null
  existingImages.value = []
  removedExistingImageIds.value = []
  form.value = { 
    category_id: '', 
    name: '', 
    price: 0, 
    description: '', 
    is_active: 1, 
    primary_image_index: 0 
  }
  uploadedFiles.value = []
  uploadedFilesCount.value = 0
  showForm.value = true

  nextTick(() => {
    if (formSectionRef.value) {
      formSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const edit = (p) => {
  editingId.value = p.id
  editingProduct.value = p
  existingImages.value = Array.isArray(p.images) ? [...p.images] : []
  removedExistingImageIds.value = []

  const primaryExistingIndex = existingImages.value.findIndex(img => img.is_primary)

  form.value = { 
    category_id: p.category?.id || '', 
    name: p.name, 
    price: p.price, 
    description: p.description || '', 
    is_active: p.is_active ? 1 : 0, 
    primary_image_index: primaryExistingIndex >= 0 ? primaryExistingIndex : 0 
  }
  uploadedFiles.value = []
  uploadedFilesCount.value = 0
  showForm.value = true

  nextTick(() => {
    if (formSectionRef.value) {
      formSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  console.log('Uploaded files:', files)
  
  uploadedFiles.value = [...uploadedFiles.value, ...files]
  uploadedFilesCount.value = uploadedFiles.value.length
  
  if (form.value.primary_image_index === 0 && files.length > 0) {
    form.value.primary_image_index = 0
  }
  
  event.target.value = ''
}

const removeImage = (index) => {
  const combinedIndex = existingImages.value.length + index

  uploadedFiles.value.splice(index, 1)
  uploadedFilesCount.value = uploadedFiles.value.length
  
  if (form.value.primary_image_index === combinedIndex) {
    form.value.primary_image_index = 0
  } else if (form.value.primary_image_index > combinedIndex) {
    form.value.primary_image_index = form.value.primary_image_index - 1
  }
  
  if (existingImages.value.length === 0 && uploadedFiles.value.length === 0) {
    form.value.primary_image_index = 0
  }
}

const getImagePreview = (file) => {
  return URL.createObjectURL(file)
}

const removeExistingImage = (index) => {
  const img = existingImages.value[index]
  if (img?.id) {
    removedExistingImageIds.value.push(img.id)
  }

  if (form.value.primary_image_index === index) {
    form.value.primary_image_index = 0
  } else if (form.value.primary_image_index > index) {
    form.value.primary_image_index = form.value.primary_image_index - 1
  }

  existingImages.value.splice(index, 1)
}

const resetFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = ''
  if (searchDebounceTimeout) {
    clearTimeout(searchDebounceTimeout)
    searchDebounceTimeout = null
  }
  load()
}

const save = async () => {
  try {
    const formData = new FormData()
    
    formData.append('category_id', form.value.category_id)
    formData.append('name', form.value.name)
    formData.append('price', form.value.price)
    formData.append('description', form.value.description)
    formData.append('is_active', form.value.is_active)
    formData.append('primary_image_index', form.value.primary_image_index)

    if (removedExistingImageIds.value.length > 0) {
      removedExistingImageIds.value.forEach(id => {
        formData.append('removed_image_ids[]', id)
      })
    }
    
    console.log('uploadedFiles:', uploadedFiles.value)
    
    if (uploadedFiles.value && uploadedFiles.value.length > 0) {
      uploadedFiles.value.forEach((image, index) => {
        console.log(`Image ${index}:`, image, 'is File?', image instanceof File)
        if (image instanceof File) {
          formData.append('images[]', image)
        }
      })
    }
    
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
  editingProduct.value = null
  existingImages.value = []
  removedExistingImageIds.value = []
  form.value = { 
    category_id: '', 
    name: '', 
    price: 0, 
    description: '', 
    is_active: 1, 
    primary_image_index: 0 
  }
  uploadedFiles.value = []
  uploadedFilesCount.value = 0
}


const requestDelete = (product) => {
  pendingDeleteProduct.value = product
}

const cancelDelete = () => {
  pendingDeleteProduct.value = null
}

const confirmDelete = async () => {
  if (!pendingDeleteProduct.value) return
  try {
    isDeleting.value = true
    await productsApi.deleteProduct(pendingDeleteProduct.value.id)
    pendingDeleteProduct.value = null
    await load()
  } catch (e) {
  } finally {
    isDeleting.value = false
  }
}
</script>


