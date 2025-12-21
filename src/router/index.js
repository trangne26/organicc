import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

import ClientLayout from '@/components/layout/ClientLayout.vue'
import AdminLayout from '@/views/admin/AdminLayout.vue'

import Home from '@/views/Home.vue'
import ProductList from '@/views/products/ProductList.vue'
import ProductDetail from '@/views/products/ProductDetail.vue'
import Cart from '@/views/Cart.vue'
import Checkout from '@/views/Checkout.vue'
import OrderSuccess from '@/views/OrderSuccess.vue'

import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import Profile from '@/views/auth/Profile.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'

import Blog from '@/views/content/Blog.vue'
import BlogPost from '@/views/content/BlogPost.vue'
import About from '@/views/content/About.vue'
import Contact from '@/views/content/Contact.vue'

import AdminDashboard from '@/views/admin/Dashboard.vue'
import AdminProducts from '@/views/admin/Products.vue'
import AdminCategories from '@/views/admin/Categories.vue'
import AdminOrders from '@/views/admin/Orders.vue'

const routes = [
  {
    path: '/',
    component: ClientLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: {
          title: 'Trang chủ - Thực phẩm hữu cơ'
        }
      },
      {
        path: 'products',
        name: 'ProductList',
        component: ProductList,
        meta: {
          title: 'Sản phẩm - Thực phẩm hữu cơ'
        }
      },
      {
        path: 'products/category/:category',
        name: 'ProductsByCategory',
        component: ProductList,
        props: true,
        meta: {
          title: 'Danh mục sản phẩm - Thực phẩm hữu cơ'
        }
      },
      {
        path: 'product/:id',
        name: 'ProductDetail',
        component: ProductDetail,
        props: true,
        meta: {
          title: 'Chi tiết sản phẩm - Thực phẩm hữu cơ'
        }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: Cart,
        meta: {
          title: 'Giỏ hàng - Thực phẩm hữu cơ'
        }
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: Checkout,
        meta: {
          title: 'Thanh toán - Thực phẩm hữu cơ',
          requiresAuth: true
        }
      },
      {
        path: 'order-success',
        name: 'OrderSuccess',
        component: OrderSuccess,
        meta: {
          title: 'Đặt hàng thành công - Thực phẩm hữu cơ'
        }
      },
      {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: {
          title: 'Đăng nhập - Thực phẩm hữu cơ',
          hideForAuth: true
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: Register,
        meta: {
          title: 'Đăng ký - Thực phẩm hữu cơ',
          hideForAuth: true
        }
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: {
          title: 'Quên mật khẩu - Thực phẩm hữu cơ'
        }
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: ResetPassword,
        meta: {
          title: 'Đặt lại mật khẩu - Thực phẩm hữu cơ'
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: {
          title: 'Tài khoản - Thực phẩm hữu cơ',
          requiresAuth: true
        }
      },
      {
        path: 'blog',
        name: 'Blog',
        component: Blog,
        meta: {
          title: 'Blog - Thực phẩm hữu cơ'
        }
      },
      {
        path: 'blog/:slug',
        name: 'BlogPost',
        component: BlogPost,
        props: true,
        meta: {
          title: 'Bài viết - Thực phẩm hữu cơ'
        }
      },
      {
        path: 'about',
        name: 'About',
        component: About,
        meta: {
          title: 'Giới thiệu - Thực phẩm hữu cơ'
        }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: Contact,
        meta: {
          title: 'Liên hệ - Thực phẩm hữu cơ'
        }
      }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { title: 'Quản trị - Thực phẩm hữu cơ', requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { title: 'Admin - Bảng điều khiển', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: AdminProducts,
        meta: { title: 'Admin - Sản phẩm', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: AdminCategories,
        meta: { title: 'Admin - Danh mục', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: AdminOrders,
        meta: { title: 'Admin - Đơn hàng', requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: 'Không tìm thấy trang - Thực phẩm hữu cơ'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  const { isLoggedIn, isAdmin } = useAuth()
  
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  if (to.meta.requiresAdmin && !isAdmin.value) {
    if (isLoggedIn.value) {
      next({ name: 'Home' })
    } else {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    }
    return
  }
  
  if (to.meta.hideForAuth && isLoggedIn.value) {
    next({ name: 'Home' })
    return
  }
  
  next()
})

export default router
