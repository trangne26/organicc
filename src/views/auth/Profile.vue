<template>
  <div class="profile">
    <section class="page-header bg-green-50 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">Tài khoản của tôi</h1>
          <p class="text-gray-600">
            Quản lý thông tin cá nhân và lịch sử mua hàng
          </p>
        </div>
      </div>
    </section>
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="text-center mb-6">
              <div v-if="loadingUser" class="text-gray-500">Đang tải...</div>
              <div v-else-if="userError" class="text-red-500 text-sm">{{ userError }}</div>
              <div v-else>
                <h3 class="font-semibold text-gray-800">{{ user.fullName || 'Chưa có tên' }}</h3>
                <p class="text-sm text-gray-600">{{ user.email || 'Chưa có email' }}</p>
              </div>
            </div>
            <nav class="space-y-2">
              <button v-for="tab in tabs" :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3',
                  activeTab === tab.id
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                <span class="text-lg">{{ tab.icon }}</span>
                <span>{{ tab.name }}</span>
              </button>
            </nav>
            <div class="mt-6 pt-6 border-t border-gray-200">
              <button
                @click="logout"
                class="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3"
              >
                <span class="text-lg">🚪</span>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </aside>
        <main class="lg:col-span-3">
          <div v-if="activeTab === 'info'" class="bg-white rounded-lg shadow-md p-6">
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-gray-800">Thông tin cá nhân</h2>
            </div>
            
            <div v-if="loadingUser" class="text-center py-8">
              <div class="text-4xl text-gray-400 mb-4">⏳</div>
              <h3 class="text-lg font-semibold text-gray-600 mb-2">Đang tải thông tin...</h3>
              <p class="text-gray-500">Vui lòng chờ trong giây lát</p>
            </div>
            
            <div v-else-if="userError" class="text-center py-8">
              <div class="text-4xl text-red-400 mb-4">❌</div>
              <h3 class="text-lg font-semibold text-red-600 mb-2">Lỗi tải dữ liệu</h3>
              <p class="text-red-500 mb-4">{{ userError }}</p>
              <button 
                @click="fetchUser"
                class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Thử lại
              </button>
            </div>
            
            <form v-else @submit.prevent="updateProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    v-model="profileForm.fullName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại
                  </label>
                  <input
                    v-model="profileForm.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <textarea
                    v-model="profileForm.address"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                  ></textarea>
                </div>
              </div>
              <div class="flex space-x-4">
                <button
                  type="submit"
                  :disabled="updating"
                  class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {{ updating ? 'Đang cập nhật...' : 'Cập nhật' }}
                </button>
              </div>
            </form>
          </div>
          <div v-if="activeTab === 'orders'" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">Lịch sử đơn hàng</h2>
            
            <div v-if="loadingOrders" class="text-center py-8">
              <div class="text-4xl text-gray-400 mb-4">⏳</div>
              <h3 class="text-lg font-semibold text-gray-600 mb-2">Đang tải...</h3>
              <p class="text-gray-500">Vui lòng chờ trong giây lát</p>
            </div>
            
            <div v-else-if="ordersError" class="text-center py-8">
              <div class="text-4xl text-red-400 mb-4">❌</div>
              <h3 class="text-lg font-semibold text-red-600 mb-2">Lỗi tải dữ liệu</h3>
              <p class="text-red-500 mb-4">{{ ordersError }}</p>
              <button 
                @click="fetchOrders"
                class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Thử lại
              </button>
            </div>
            
            <div v-else-if="orders.length === 0" class="text-center py-8">
              <div class="text-4xl text-gray-400 mb-4">📦</div>
              <h3 class="text-lg font-semibold text-gray-600 mb-2">Chưa có đơn hàng nào</h3>
              <p class="text-gray-500 mb-4">Bạn chưa thực hiện đơn hàng nào</p>
              <router-link to="/products" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Mua sắm ngay
              </router-link>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="order in orders"
                :key="order.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="font-semibold text-gray-800">Đơn hàng #{{ order.id }}</h3>
                    <p class="text-sm text-gray-600">{{ formatDate(new Date(order.created_at)) }}</p>
                  </div>
                  <div class="text-right">
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-semibold',
                        getOrderStatusClass(order.status)
                      ]"
                    >
                      {{ getOrderStatusText(order.status) }}
                    </span>
                    <div class="text-lg font-bold text-orange-500 mt-1">
                      {{ formatPrice(parseFloat(order.total)) }}
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-gray-700">Sản phẩm:</span>
                    <span class="text-gray-600 ml-1">{{ order.items.length }} sản phẩm</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Thanh toán:</span>
                    <span class="text-gray-600 ml-1">{{ getPaymentMethodText(order) }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Giao hàng:</span>
                    <span class="text-gray-600 ml-1">{{ getDeliveryMethodText(order) }}</span>
                  </div>
                </div>
                <div class="flex justify-end mt-4 space-x-2">
                  <button
                    @click="viewOrderDetail(order.id)"
                    class="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    v-if="order.status === 'delivered' || order.status === 'shipped'"
                    @click="reorder(order.id)"
                    class="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Mua lại
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="activeTab === 'password'" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">Đổi mật khẩu</h2>
            <form @submit.prevent="changePassword" class="max-w-md space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div v-if="passwordError" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {{ passwordError }}
              </div>
              <div v-if="passwordSuccess" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                {{ passwordSuccess }}
              </div>
              <button
                type="submit"
                :disabled="changingPassword"
                class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {{ changingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu' }}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
    <div
      v-if="showOrderDetail"
      class="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 py-10 overflow-y-auto"
      @click.self="closeOrderDetail"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative">
        <div class="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <p class="text-sm text-gray-500">Đơn hàng</p>
            <h3 class="text-2xl font-semibold text-gray-900">
              #{{ selectedOrderId }}
            </h3>
          </div>
          <div class="flex items-center gap-3">
            <span
              v-if="orderDetail"
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                getOrderStatusClass(orderDetail.status)
              ]"
            >
              {{ getOrderStatusText(orderDetail.status) }}
            </span>
            <button
              type="button"
              class="text-gray-500 hover:text-gray-700 transition-colors"
              @click="closeOrderDetail"
            >
              ✕
            </button>
          </div>
        </div>
        <div class="px-6 py-6">
          <div v-if="loadingOrderDetail" class="text-center py-16 text-gray-500">
            <div class="text-5xl mb-4">⏳</div>
            Đang tải chi tiết đơn hàng...
          </div>
          <div v-else-if="orderDetailError" class="text-center py-16">
            <div class="text-5xl text-red-400 mb-4">❌</div>
            <p class="text-red-600 font-semibold mb-2">{{ orderDetailError }}</p>
            <p class="text-gray-500 mb-6">Vui lòng thử lại sau ít phút.</p>
            <button
              type="button"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              @click="viewOrderDetail(selectedOrderId)"
            >
              Thử lại
            </button>
          </div>
          <div v-else-if="orderDetail" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="rounded-xl border border-gray-100 p-4">
                <p class="text-sm text-gray-500 mb-1">Ngày đặt</p>
                <p class="font-semibold text-gray-900">
                  {{
                    orderDetail.created_at
                      ? formatDate(new Date(orderDetail.created_at))
                      : 'Không xác định'
                  }}
                </p>
              </div>
              <div class="rounded-xl border border-gray-100 p-4">
                <p class="text-sm text-gray-500 mb-1">Tổng tiền</p>
                <p class="font-semibold text-gray-900">
                  {{ formatPrice(parseFloat(orderDetail.total) || 0) }}
                </p>
              </div>
              <div class="rounded-xl border border-gray-100 p-4">
                <p class="text-sm text-gray-500 mb-1">Thanh toán</p>
                <p class="font-semibold text-gray-900">
                  {{ getPaymentMethodText(orderDetail) }}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="rounded-2xl bg-gray-50 p-5">
                <h4 class="text-base font-semibold text-gray-900 mb-3">Giao hàng</h4>
                <dl class="space-y-2 text-sm text-gray-600">
                  <div class="flex justify-between">
                    <dt class="text-gray-500">Người nhận</dt>
                    <dd class="font-medium text-gray-900">
                      {{ orderDetail.shipping_name || 'Không có' }}
                    </dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-500">Số điện thoại</dt>
                    <dd class="font-medium text-gray-900">
                      {{ orderDetail.shipping_phone || 'Không có' }}
                    </dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-500">Địa chỉ</dt>
                    <dd class="text-right font-medium text-gray-900 md:text-left">
                      {{ orderDetail.shipping_address || 'Không có' }}
                    </dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-500">Đơn vị vận chuyển</dt>
                    <dd class="font-medium text-gray-900">
                      {{ getDeliveryMethodText(orderDetail) }}
                    </dd>
                  </div>
                </dl>
              </div>
              <div class="rounded-2xl bg-gray-50 p-5">
                <h4 class="text-base font-semibold text-gray-900 mb-3">Ghi chú</h4>
                <p class="text-sm text-gray-600 whitespace-pre-line">
                  {{ orderDetail.notes || 'Không có ghi chú cho đơn hàng này.' }}
                </p>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold text-gray-900">
                  Sản phẩm ({{ orderDetail.items?.length || 0 }})
                </h4>
                <span class="text-sm text-gray-500">
                  Tổng cộng {{ formatPrice(parseFloat(orderDetail.total) || 0) }}
                </span>
              </div>
              <div class="rounded-2xl border border-gray-100 divide-y divide-gray-100">
                <div
                  v-for="item in orderDetail.items || []"
                  :key="item.id"
                  class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p class="font-medium text-gray-900">
                      {{ item.product?.name || 'Sản phẩm' }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ item.qty }} × {{ formatPrice(parseFloat(item.unit_price) || 0) }}
                    </p>
                  </div>
                  <div class="text-right font-semibold text-gray-900">
                    {{ formatPrice(parseFloat(item.line_total) || (parseFloat(item.unit_price) || 0) * (item.qty || 0)) }}
                  </div>
                </div>
                <div v-if="!orderDetail.items || orderDetail.items.length === 0" class="p-6 text-center text-gray-500">
                  Không có sản phẩm trong đơn hàng.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            class="px-5 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            @click="closeOrderDetail"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listOrders, getOrder } from '@/api/orders'
import { me, updateProfile as updateProfileApi, changePassword as changePasswordApi } from '@/api/auth'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const { user: authUser, logout: logoutAuth } = useAuth()
const { showSuccess, showError } = useNotification()

const activeTab = ref('info')
const updating = ref(false)
const changingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')
const orders = ref([])
const loadingOrders = ref(false)
const ordersError = ref('')
const loadingUser = ref(false)
const userError = ref('')
const showOrderDetail = ref(false)
const loadingOrderDetail = ref(false)
const orderDetailError = ref('')
const selectedOrderId = ref(null)
const orderDetail = ref(null)

const tabs = [
  { id: 'info', name: 'Thông tin cá nhân', icon: '👤' },
  { id: 'orders', name: 'Lịch sử đơn hàng', icon: '📦' },
  { id: 'password', name: 'Đổi mật khẩu', icon: '🔒' }
]

const user = ref({
  id: null,
  fullName: '',
  email: '',
  phone: '',
  address: ''
})

const profileForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  address: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const fetchUser = async () => {
  loadingUser.value = true
  userError.value = ''
  
  try {
    const response = await me()
    if (response.success && response.data) {
      const userData = response.data
      user.value = {
        id: userData.id,
        fullName: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || ''
      }
      
      Object.assign(profileForm, {
        fullName: user.value.fullName,
        email: user.value.email,
        phone: user.value.phone,
        address: user.value.address
      })
    } else {
      userError.value = 'Không thể tải thông tin tài khoản'
      showError('Không thể tải thông tin tài khoản')
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    userError.value = error.message || 'Có lỗi xảy ra khi tải thông tin tài khoản'
    showError(userError.value)
  } finally {
    loadingUser.value = false
  }
}

const fetchOrders = async () => {
  loadingOrders.value = true
  ordersError.value = ''
  
  try {
    const response = await listOrders()
    if (response.success) {
      orders.value = response.data
    } else {
      ordersError.value = 'Không thể tải danh sách đơn hàng'
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    ordersError.value = 'Có lỗi xảy ra khi tải danh sách đơn hàng'
  } finally {
    loadingOrders.value = false
  }
}

onMounted(() => {
  fetchUser()
  fetchOrders()
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const getOrderStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    paid: 'bg-blue-100 text-blue-800',
    shipping: 'bg-purple-100 text-purple-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getOrderStatusText = (status) => {
  const texts = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    paid: 'Đã thanh toán',
    shipping: 'Đang giao hàng',
    shipped: 'Đã gửi hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy'
  }
  return texts[status] || 'Không xác định'
}

const getPaymentMethodText = (order) => {
  if (order.payments && order.payments.length > 0) {
    const method = order.payments[0].method
    const texts = {
      COD: 'Tiền mặt',
      VNPAY: 'VNPay',
      MOMO: 'MoMo',
      ZALOPAY: 'ZaloPay',
      BANK_TRANSFER: 'Chuyển khoản'
    }
    return texts[method] || method
  }
  return 'Chưa thanh toán'
}

const getDeliveryMethodText = (order) => {
  if (order.shipments && order.shipments.length > 0) {
    const shipment = order.shipments[0]
    if (shipment.provider) {
      return shipment.provider
    }
    return shipment.status === 'delivered' ? 'Đã giao hàng' : 'Chưa giao hàng'
  }
  return 'Chưa giao hàng'
}

const updateProfile = async () => {
  updating.value = true
  
  try {
    const payload = {
      name: profileForm.fullName,
      phone: profileForm.phone,
      address: profileForm.address
    }
    
    const response = await updateProfileApi(payload)
    
    if (response.success) {
      const userData = response.data || {}
      user.value = {
        ...user.value,
        fullName: userData.name || profileForm.fullName,
        phone: userData.phone || profileForm.phone,
        address: userData.address || profileForm.address
      }
      
      showSuccess('Cập nhật thông tin thành công')
    } else {
      showError(response.message || 'Có lỗi xảy ra khi cập nhật thông tin')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    const errorMessage = error.message || error.payload?.message || 'Có lỗi xảy ra khi cập nhật thông tin'
    showError(errorMessage)
  } finally {
    updating.value = false
  }
}

const changePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = ''
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Mật khẩu mới và xác nhận mật khẩu không khớp'
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    return
  }
  
  changingPassword.value = true
  
  try {
    const payload = {
      current_password: passwordForm.value.currentPassword,
      password: passwordForm.value.newPassword,
      password_confirmation: passwordForm.value.confirmPassword
    }
    
    const response = await changePasswordApi(payload)
    
    if (response.success) {
      passwordSuccess.value = 'Mật khẩu đã được cập nhật thành công'
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      showSuccess('Đổi mật khẩu thành công')
    } else {
      passwordError.value = response.message || 'Có lỗi xảy ra khi đổi mật khẩu'
      showError(passwordError.value)
    }
  } catch (error) {
    console.error('Error changing password:', error)
    const errorMessage = error.message || error.payload?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
    passwordError.value = errorMessage
    showError(errorMessage)
  } finally {
    changingPassword.value = false
  }
}

const viewOrderDetail = async (orderId) => {
  if (!orderId) return
  selectedOrderId.value = orderId
  showOrderDetail.value = true
  orderDetail.value = null
  orderDetailError.value = ''
  loadingOrderDetail.value = true

  try {
    const response = await getOrder(orderId)
    if (response.success && response.data) {
      orderDetail.value = response.data
    } else {
      orderDetailError.value = response.message || 'Không thể tải chi tiết đơn hàng'
      showError(orderDetailError.value)
    }
  } catch (error) {
    console.error('Error fetching order detail:', error)
    const errorMessage = error.message || error.payload?.message || 'Có lỗi xảy ra khi tải chi tiết đơn hàng'
    orderDetailError.value = errorMessage
    showError(errorMessage)
  } finally {
    loadingOrderDetail.value = false
  }
}

const closeOrderDetail = () => {
  showOrderDetail.value = false
  orderDetail.value = null
  orderDetailError.value = ''
  selectedOrderId.value = null
}

const reorder = (orderId) => {
}

const addToCart = (item) => {
}

const logout = async () => {
  await logoutAuth()
  router.push('/')
}
</script>
