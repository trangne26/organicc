import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import ProductList from '@/views/products/ProductList.vue'
import ProductDetail from '@/views/products/ProductDetail.vue'
import Cart from '@/views/Cart.vue'
import Checkout from '@/views/Checkout.vue'

import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import Profile from '@/views/auth/Profile.vue'

import Blog from '@/views/content/Blog.vue'
import BlogPost from '@/views/content/BlogPost.vue'
import About from '@/views/content/About.vue'
import Contact from '@/views/content/Contact.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Trang chủ - Thực phẩm hữu cơ'
    }
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList,
    meta: {
      title: 'Sản phẩm - Thực phẩm hữu cơ'
    }
  },
  {
    path: '/products/category/:category',
    name: 'ProductsByCategory',
    component: ProductList,
    props: true,
    meta: {
      title: 'Danh mục sản phẩm - Thực phẩm hữu cơ'
    }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
    meta: {
      title: 'Chi tiết sản phẩm - Thực phẩm hữu cơ'
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: {
      title: 'Giỏ hàng - Thực phẩm hữu cơ'
    }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: {
      title: 'Thanh toán - Thực phẩm hữu cơ',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Đăng nhập - Thực phẩm hữu cơ',
      hideForAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Đăng ký - Thực phẩm hữu cơ',
      hideForAuth: true
    }


  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Tài khoản - Thực phẩm hữu cơ',
      requiresAuth: true
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog,
    meta: {
      title: 'Blog - Thực phẩm hữu cơ'
    }
  },
  {
    path: '/blog/:slug',
    name: 'BlogPost',
    component: BlogPost,
    props: true,
    meta: {
      title: 'Bài viết - Thực phẩm hữu cơ'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'Giới thiệu - Thực phẩm hữu cơ'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      title: 'Liên hệ - Thực phẩm hữu cơ'
    }
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

  const isAuthenticated = localStorage.getItem('authToken') !== null
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.hideForAuth && isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
