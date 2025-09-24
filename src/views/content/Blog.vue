<template>
  <div class="blog">
    <section class="page-header bg-green-50 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">Blog</h1>
          <p class="text-gray-600">
            Chia sẻ kiến thức về ăn uống lành mạnh và lợi ích của thực phẩm hữu cơ
          </p>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <main class="lg:col-span-3">
          <div v-if="baiNoiBat" class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div class="relative">
              <img
                  :src="baiNoiBat.image"
                  :alt="baiNoiBat.title"
                  class="w-full h-64 object-cover"
              />
              <div class="absolute top-4 left-4">
                <span class="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Nổi bật
                </span>
              </div>
            </div>
            <div class="p-6">
              <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">

              </div>
              <router-link :to="`/blog/${baiNoiBat.slug}`">
                <h2 class="text-2xl font-bold text-gray-800 mb-3 hover:text-green-600 transition-colors">
                  {{ baiNoiBat.title }}
                </h2>
              </router-link>
              <p class="text-gray-600 mb-4">{{ baiNoiBat.excerpt }}</p>
              <router-link
                  :to="`/blog/${baiNoiBat.slug}`"
                  class="text-green-600 hover:text-green-700 font-semibold"
              >
                Đọc tiếp →
              </router-link>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <article
                v-for="post in posts"
                :key="post.id"
                class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div class="relative">
                <router-link :to="`/blog/${post.slug}`">
                  <img
                      :src="post.image"
                      :alt="post.title"
                      class="w-full h-48 object-cover"
                  />
                </router-link>
                <div class="absolute top-4 left-4">
                </div>
              </div>
              <div class="p-4">
                <div class="flex items-center space-x-3 text-xs text-gray-600 mb-2">


                </div>
                <router-link :to="`/blog/${post.slug}`">
                  <h3 class="text-lg font-semibold text-gray-800 mb-2 hover:text-green-600 transition-colors">
                    {{ post.title }}
                  </h3>
                </router-link>
                <p class="text-gray-600 text-sm mb-3">{{ post.excerpt }}</p>
                <div class="flex items-center justify-between">
                  <router-link
                      :to="`/blog/${post.slug}`"
                      class="text-green-600 hover:text-green-700 font-semibold text-sm"
                  >
                    Đọc tiếp →
                  </router-link>
                  <span class="text-xs text-gray-500">{{ post.readTime }} phút đọc</span>
                </div>
              </div>
            </article>
          </div>
        </main>

        <aside class="lg:col-span-1">

          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Tìm kiếm</h3>
            <div class="relative">
              <input
                  v-model="tuKhoa"
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
              >
                🔍
              </button>
            </div>
          </div>


          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Bài viết gần đây</h3>
            <div class="space-y-4">
              <div
                  v-for="post in recentPosts"
                  :key="post.id"
                  class="flex space-x-3"
              >
                <router-link :to="`/blog/${post.slug}`" class="flex-shrink-0">
                  <img
                      :src="post.image"
                      :alt="post.title"
                      class="w-16 h-16 object-cover rounded-lg"
                  />
                </router-link>
                <div class="flex-1 min-w-0">
                  <router-link :to="`/blog/${post.slug}`">
                    <h4 class="text-sm font-semibold text-gray-800 hover:text-green-600 transition-colors line-clamp-2">
                      {{ post.title }}
                    </h4>
                  </router-link>
                  <p class="text-xs text-gray-600 mt-1">
                    {{ formatDate(post.publishedAt) }}
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
                  v-model="email"
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const tuKhoa = ref('')
const danhMuc = ref('')
const email = ref('')
const subscribing = ref(false)

const baiNoiBat = ref({
  id: 1,
  title: '10 Lợi ích tuyệt vời của việc ăn thực phẩm hữu cơ',
  slug: '10-loi-ich-tuyet-voi-cua-viec-an-thuc-pham-huu-co',
  excerpt: 'Khám phá những lợi ích đáng kinh ngạc mà thực phẩm hữu cơ mang lại cho sức khỏe và môi trường...',
  content: '',
  image: 'https://tse4.mm.bing.net/th/id/OIP.Fxe6ZX5jbiyYovuZNiK0CgAAAA?rs=1&pid=ImgDetMain&o=7&rm=3',
    categoryID: 1,
  publishedAt: new Date('2024-01-15'),
  readTime: 5,
  isFeatured: true
})

const allPosts = ref([
  {
    id: 2,
    title: 'Cách bảo quản rau củ hữu cơ để giữ được lâu nhất',
    slug: 'cach-bao-quan-rau-cu-huu-co-de-giu-duoc-lau-nhat',
    excerpt: 'Học cách bảo quản rau củ hữu cơ đúng cách để duy trì độ tươi ngon và dinh dưỡng...',
    image: 'https://wallpapers.com/images/hd/vegetables-pictures-221e1hkfwbxt3jno.jpg',

    categoryID: 2,
    publishedAt: new Date('2024-01-12'),
    readTime: 4
  },
  {
    id: 3,
    title: 'Công thức salad rau củ hữu cơ ngon miệng và bổ dưỡng',
    slug: 'cong-thuc-salad-rau-cu-huu-co-ngon-mieng-va-bo-duong',
    excerpt: 'Những công thức salad đơn giản nhưng vô cùng ngon miệng từ rau củ hữu cơ...',
    image: 'https://4.bp.blogspot.com/-uo9FaZ_QjcM/VgCCSKsXBQI/AAAAAAAAA34/LfQfQgMsqNQ/s1600/FOOD.jpg',

    categoryID: 3,
    publishedAt: new Date('2024-01-10'),
    readTime: 6
  },
  {
    id: 4,
    title: 'Tại sao nên chọn thực phẩm hữu cơ cho trẻ em?',
    slug: 'tai-sao-nen-chon-thuc-pham-huu-co-cho-tre-em',
    excerpt: 'Tầm quan trọng của thực phẩm hữu cơ trong việc phát triển sức khỏe của trẻ...',
    image: 'https://tse2.mm.bing.net/th/id/OIP.kJd8CdEMi7q6ZBVthPz7zgHaE8?w=5616&h=3744&rs=1&pid=ImgDetMain&o=7&rm=3',

    categoryID: 1,
    publishedAt: new Date('2024-01-08'),
    readTime: 5
  },
  {
    id: 5,
    title: 'Cách nhận biết thực phẩm hữu cơ thật và giả',
    slug: 'cach-nhan-biet-thuc-pham-huu-co-that-va-gia',
    excerpt: 'Những dấu hiệu giúp bạn phân biệt thực phẩm hữu cơ thật và giả một cách chính xác...',
    image: 'https://as1.ftcdn.net/jpg/01/87/51/70/1000_F_187517097_jGOpsrBp0mS5LIvRf1b9Sko2A75I5cqf.jpg',


    publishedAt: new Date('2024-01-05'),
    readTime: 7
  },
  {
    id: 6,
    title: 'Xu hướng ăn uống lành mạnh năm 2024',
    slug: 'xu-huong-an-uong-lanh-manh-nam-2024',
    excerpt: 'Cập nhật những xu hướng ăn uống lành mạnh mới nhất trong năm 2024...',
    image: 'https://tse1.mm.bing.net/th/id/OIP.g3nQ6nDJLemGb-BNwtKL-gHaEK?w=2560&h=1439&rs=1&pid=ImgDetMain&o=7&rm=3',

    categoryID: 5,
    publishedAt: new Date('2024-01-03'),
    readTime: 8
  }
])

const posts = computed(() => {
  let filtered = allPosts.value

  if (danhMuc.value) {
    filtered = filtered.filter(post => post.categoryID === danhMuc.value)
  }

  if (tuKhoa.value) {
    const query = tuKhoa.value.toLowerCase()
    filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query)
    )
  }

  return filtered.slice(0, 6)
})

const recentPosts = computed(() => {
  return [...allPosts.value]
      .slice(0, 4)
})

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
const filterByCategory = (id) => {
  danhMuc.value = id
}

const dangkyEmail = async () => {
  subscribing.value = true

  setTimeout(() => {
    alert('Đăng ký thành công! Cảm ơn bạn đã quan tâm.')
    email.value = ''
    subscribing.value = false
  }, 1500)
}

</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
