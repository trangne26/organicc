import { ref, computed } from 'vue'
import { listCategories } from '@/api/categories'

const categories = ref([])
const loading = ref(false)
const error = ref(null)

export const useCategories = () => {
  const fetchCategories = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      const response = await listCategories(params)
      categories.value = response.data || []
      return response.data
    } catch (err) {
      error.value = err.message || 'Có lỗi xảy ra khi tải danh mục'
      console.error('Error fetching categories:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCategoryBySlug = (slug) => {
    return computed(() => categories.value.find(cat => cat.slug === slug))
  }

  const getCategoriesByParent = (parentId = null) => {
    return computed(() => categories.value.filter(cat => cat.parent_id === parentId))
  }

  return {
    categories: computed(() => categories.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchCategories,
    getCategoryBySlug,
    getCategoriesByParent
  }
}
