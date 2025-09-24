<template>
  <div class="blog-post">
    <div v-if="loading" class="container mx-auto px-4 py-8">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
        <div class="h-64 bg-gray-300 rounded mb-8"></div>
        <div class="space-y-4">
          <div class="h-4 bg-gray-300 rounded"></div>
          <div class="h-4 bg-gray-300 rounded w-5/6"></div>
          <div class="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>
    </div>

    <div v-else-if="!post" class="container mx-auto px-4 py-16 text-center">
      <div class="text-6xl text-gray-400 mb-4">📄</div>
      <h2 class="text-2xl font-bold text-gray-600 mb-4">Không tìm thấy bài viết</h2>
      <router-link
        to="/blog"
        class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Quay lại blog
      </router-link>
    </div>

    <article v-else class="container mx-auto px-4 py-8">

      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <router-link to="/" class="text-gray-500 hover:text-green-600">Trang chủ</router-link>
          </li>
          <li class="text-gray-400">/</li>
          <li>
            <router-link to="/blog" class="text-gray-500 hover:text-green-600">Blog</router-link>
          </li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-700 font-medium">{{ post.title }}</li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <main class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-64 md:h-96 object-cover"
              />
              <div class="absolute top-4 left-4">
                <span class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {{ post.category }}
                </span>
              </div>
            </div>

            <header class="p-6 md:p-8 border-b border-gray-200">
              <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {{ post.title }}
              </h1>
              
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div class="flex items-center space-x-2">
                  <span>👤</span>
                  <span>{{ post.author }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span>📅</span>
                  <span>{{ formatDate(post.publishedAt) }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span>⏱️</span>
                  <span>{{ post.readTime }} phút đọc</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span>👁️</span>
                  <span>{{ post.views || 0 }} lượt xem</span>
                </div>
              </div>

              <p class="text-lg text-gray-600 leading-relaxed">
                {{ post.excerpt }}
              </p>
            </header>

            <div class="p-6 md:p-8">
              <div class="prose prose-lg max-w-none" v-html="post.content"></div>
            </div>
          </div>
        </main>

        <aside class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Bài viết liên quan</h3>
            <div class="space-y-4">
              <div
                v-for="relatedPost in relatedPosts"
                :key="relatedPost.id"
                class="flex space-x-3"
              >
                <router-link :to="`/blog/${relatedPost.slug}`" class="flex-shrink-0">
                  <img
                    :src="relatedPost.image"
                    :alt="relatedPost.title"
                    class="w-16 h-16 object-cover rounded-lg"
                  />
                </router-link>
                <div class="flex-1 min-w-0">
                  <router-link :to="`/blog/${relatedPost.slug}`">
                    <h4 class="text-sm font-semibold text-gray-800 hover:text-green-600 transition-colors line-clamp-2">
                      {{ relatedPost.title }}
                    </h4>
                  </router-link>
                  <p class="text-xs text-gray-600 mt-1">
                    {{ formatDate(relatedPost.publishedAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-green-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Nhận tin tức mới nhất</h3>
            <p class="text-sm text-gray-600 mb-4">
              Đăng ký để nhận những bài viết hay và ưu đãi đặc biệt
            </p>
            <form @submit.prevent="dangkyEmail" class="space-y-3">
              <input
                v-model="newsletterEmail"
                type="email"
                placeholder="Email của bạn"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                :disabled="subscribing"
                class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition-colors disabled:opacity-50"
              >
                {{ subscribing ? 'Đang đăng ký...' : 'Đăng ký' }}
              </button>
            </form>
          </div>
        </aside>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = computed(() => route.params.slug)

const loading = ref(true)
const post = ref(null)
const submittingComment = ref(false)
const subscribing = ref(false)
const newsletterEmail = ref('')

const commentForm = ref({
  name: '',
  email: '',
  message: ''
})

const authorInfo = ref({
  bio: 'Chuyên gia dinh dưỡng và thực phẩm hữu cơ với nhiều năm kinh nghiệm trong lĩnh vực sức khỏe và dinh dưỡng.'
})

const comments = ref([
  {
    id: 1,
    name: 'Nguyễn Thị Lan',
    email: 'lan@example.com',
    message: 'Bài viết rất hay và bổ ích! Cảm ơn tác giả đã chia sẻ những kiến thức quý báu.',
    createdAt: new Date('2024-01-16')
  },
  {
    id: 2,
    name: 'Trần Văn Nam',
    email: 'nam@example.com',
    message: 'Tôi đã áp dụng những lời khuyên trong bài viết và thấy rất hiệu quả.',
    createdAt: new Date('2024-01-17')
  }
])

const relatedPosts = ref([
  {
    id: 2,
    title: 'Cách bảo quản rau củ hữu cơ để giữ được lâu nhất',
    slug: 'cach-bao-quan-rau-cu-huu-co-de-giu-duoc-lau-nhat',
    image: '/images/blog/vegetable-storage.jpg',
    publishedAt: new Date('2024-01-12')
  },
  {
    id: 3,
    title: 'Công thức salad rau củ hữu cơ ngon miệng và bổ dưỡng',
    slug: 'cong-thuc-salad-rau-cu-huu-co-ngon-mieng-va-bo-duong',
    image: '/images/blog/organic-salad.jpg',
    publishedAt: new Date('2024-01-10')
  }
])

const mockPosts = {
  '10-loi-ich-tuyet-voi-cua-viec-an-thuc-pham-huu-co': {
    id: 1,
    title: '10 Lợi ích tuyệt vời của việc ăn thực phẩm hữu cơ',
    slug: '10-loi-ich-tuyet-voi-cua-viec-an-thuc-pham-huu-co',
    excerpt: 'Khám phá những lợi ích đáng kinh ngạc mà thực phẩm hữu cơ mang lại cho sức khỏe và môi trường của chúng ta.',
    content: `
      <p>Thực phẩm hữu cơ đang ngày càng trở nên phổ biến và được nhiều người tiêu dùng lựa chọn. Nhưng tại sao chúng ta nên chọn thực phẩm hữu cơ thay vì thực phẩm thông thường? Hãy cùng khám phá 10 lợi ích tuyệt vời mà thực phẩm hữu cơ mang lại.</p>

      <h2>1. Không chứa hóa chất độc hại</h2>
      <p>Thực phẩm hữu cơ được trồng và chế biến mà không sử dụng thuốc trừ sâu, phân bón hóa học hay các chất bảo quản nhân tạo. Điều này giúp giảm thiểu nguy cơ tiếp xúc với các hóa chất có thể gây hại cho sức khỏe.</p>

      <h2>2. Giàu chất dinh dưỡng hơn</h2>
      <p>Nhiều nghiên cứu cho thấy thực phẩm hữu cơ có hàm lượng vitamin, khoáng chất và chất chống oxi hóa cao hơn so với thực phẩm thông thường.</p>

      <h2>3. Tốt hơn cho môi trường</h2>
      <p>Canh tác hữu cơ giúp bảo vệ đất, nước và không khí khỏi ô nhiễm hóa chất, đồng thời duy trì đa dạng sinh học.</p>

      <h2>4. Hương vị tự nhiên và ngon hơn</h2>
      <p>Thực phẩm hữu cơ thường có hương vị đậm đà và tự nhiên hơn vì được trồng trong điều kiện tự nhiên và thu hoạch đúng thời điểm.</p>

      <h2>5. Không biến đổi gen</h2>
      <p>Thực phẩm hữu cơ được đảm bảo không sử dụng các thành phần biến đổi gen (GMO).</p>

      <h2>6. Tốt cho sức khỏe tim mạch</h2>
      <p>Thực phẩm hữu cơ, đặc biệt là sữa và thịt hữu cơ, chứa nhiều axit béo omega-3 có lợi cho tim mạch.</p>

      <h2>7. Giảm nguy cơ dị ứng</h2>
      <p>Việc không sử dụng hóa chất và phụ gia nhân tạo giúp giảm nguy cơ gây dị ứng và các phản ứng không mong muốn.</p>

      <h2>8. Hỗ trợ nông dân địa phương</h2>
      <p>Chọn thực phẩm hữu cơ từ các nông trại địa phương giúp hỗ trợ kinh tế cộng đồng và giảm carbon footprint.</p>

      <h2>9. An toàn cho trẻ em</h2>
      <p>Trẻ em đặc biệt nhạy cảm với hóa chất, vì vậy thực phẩm hữu cơ là lựa chọn an toàn hơn cho sự phát triển của trẻ.</p>

      <h2>10. Bền vững lâu dài</h2>
      <p>Canh tác hữu cơ góp phần tạo ra một hệ thống thực phẩm bền vững cho các thế hệ tương lai.</p>

      <h2>Kết luận</h2>
      <p>Mặc dù thực phẩm hữu cơ có thể có giá cao hơn, nhưng những lợi ích về sức khỏe, môi trường và xã hội mà chúng mang lại là vô cùng to lớn. Hãy cân nhắc việc chuyển sang sử dụng thực phẩm hữu cơ để bảo vệ sức khỏe bản thân và gia đình.</p>
    `,
    image: '/images/blog/organic-benefits.jpg',
    author: 'Nguyễn Thị Lan',
    category: 'Sức khỏe',
    publishedAt: new Date('2024-01-15'),
    readTime: 5,
    views: 1250,
    tags: ['thực phẩm hữu cơ', 'sức khỏe', 'dinh dưỡng', 'môi trường']
  }
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const shareOnFacebook = () => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(post.value.title)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank')
}

const shareOnTwitter = () => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(post.value.title)
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert('Đã sao chép link vào clipboard!')
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}

const dangkyEmail = async () => {
  subscribing.value = true

  setTimeout(() => {
    alert('Đăng ký thành công! Cảm ơn bạn đã quan tâm.')
    newsletterEmail.value = ''
    subscribing.value = false
  }, 1500)
}

onMounted(async () => {
  setTimeout(() => {
    post.value = mockPosts[slug.value] || null
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  color: #1f2937;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.7;
  color: #4b5563;
}
</style>
