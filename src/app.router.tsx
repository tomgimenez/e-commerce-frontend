/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { /* createBrowserRouter, */ createHashRouter, Navigate } from "react-router";

import { ShopLayout } from "./shop/layouts/ShopLayout";
import { HomePage } from "./shop/pages/home/HomePage";
import { ProductPage } from "./shop/pages/product/ProductPage"
import { RegisterPage } from "./auth/pages/register/RegisterPage";
import { LoginPage } from "./auth/pages/login/LoginPage";
import { DashboardPage } from "./admin/pages/dashboard/DashboardPage";
import { AdminProductsPage } from "./admin/pages/products/AdminProductsPage";
import { AdminProductPage } from "./admin/pages/product/AdminProductPage";
import { AdminRoute, AuthenticatedRoute, NotAuthenticatedRoute } from "./components/routes/ProtectedRoutes";
import { CategoriesPage } from "./admin/pages/categories/CategoriesPage";
import { CartPage } from "./shop/pages/cart/CartPage";
import AnnouncementPage from "./shop/pages/announcement/AnnouncementPage";
import { ShippingPage } from "./shop/pages/shipping/ShippingPage";
import { PaymentPage } from "./shop/pages/payment/PaymentPage";
import { CheckoutSuccessPage } from "./shop/pages/checkout-status/SuccessPage";
import { CheckoutFailurePage } from "./shop/pages/checkout-status/FailurePage";
import { CheckoutPendingPage } from "./shop/pages/checkout-status/PendingPage";
import ProfilePage from "./shop/pages/user/profile/ProfilePage";
import { AddressPage } from "./shop/pages/user/address/AddressPage";
import FavoritesPage from "./shop/pages/user/favorites/FavoritesPage";
import AdminOrdersPage from "./admin/pages/orders/AdminOrdersPage";
import OrdersPage from "./shop/pages/user/orders/OrdersPage";
import AdminCustomersPage from "./admin/pages/customers/AdminCustomersPage";
import AnalyticsPage from "./admin/pages/analytics/AnalyticsPage";
import AdminSettingsPage from "./admin/pages/settings/AdminSettingsPage";
import AdminSubscriptionPage from "./admin/pages/subscription/AdminSubscriptionPage";
import { SearchPage } from "./shop/pages/search/SearchPage";
import ProductTypesPage from "./admin/pages/product-types/ProductTypesPage";
import ProductTypesFormPage from "./admin/pages/product-types/ProductTypeFormPage";
import CategoryFormPage from "./admin/pages/categories/CategoryFormPage";

const AuthLayout = lazy(() => import('./auth/layouts/AuthLayout'));
const AdminLayout = lazy(() => import("./admin/layouts/AdminLayout"));

export const appRouter = createHashRouter([
// export const appRouter = createBrowserRouter([
  // Main routes
  {
    path: '/',
    element: <ShopLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'search',
        element: <SearchPage />
      },
      {
        path: 'product/:id',
        element: <ProductPage />
      },
      {
        path: 'cart',
        element: <CartPage />
      }
    ]
  },
  
  // Announcement Routes
  {
    path: '/announcement/:type',
    element: <AnnouncementPage />
  },

  // Auth routes
  {
    path: '/auth',
    element: (
    <NotAuthenticatedRoute>
      <AuthLayout />
    </NotAuthenticatedRoute>),
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      }
    ]
  },

  // User routes
  {
    path: '/user',
    element: (
      <AuthenticatedRoute>
        <ShopLayout />
      </AuthenticatedRoute>
    ),
    children: [
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'address',
        element: <AddressPage />
      },
      {
        path: 'orders',
        element: <OrdersPage />
      },
      {
        path: 'favorites',
        element: <FavoritesPage />
      }
    ]
  },
  
  // Checkout Routes
  {
    path: '/checkout',
    element:(
      <AuthenticatedRoute>
        <ShopLayout />
      </AuthenticatedRoute>
    ),
    children: [
      {
        path: 'shipping',
        element: <ShippingPage />
      },
      {
        path: 'payment',
        element: <PaymentPage />
      },
      {
        path: 'success',
        element: <CheckoutSuccessPage />
      },
      {
        path: 'failure',
        element: <CheckoutFailurePage />
      },
      {
        path: 'pending',
        element: <CheckoutPendingPage />
      }
    ]
  },

  // Admin routes
  {
    path: '/admin',
    element: (
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'products',
        element: <AdminProductsPage />
      },
      {
        path: 'products/:id',
        element: <AdminProductPage />
      },
      {
        path: 'product-types',
        element: <ProductTypesPage />
      },
      {
        path: 'product-types/:id',
        element: <ProductTypesFormPage />
      },
      {
        path: 'categories',
        element: <CategoriesPage />
      },
      {
        path: 'categories/:id',
        element: <CategoryFormPage />
      },
      {
        path: 'orders',
        element: <AdminOrdersPage />
      },
      {
        path: 'customers',
        element: <AdminCustomersPage />
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />
      },
      {
        path: 'subscription',
        element: <AdminSubscriptionPage />
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" />
  }
]);
