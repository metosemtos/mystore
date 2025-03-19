'use client';

import { useState, useEffect } from 'react';
import { supabase, Product, fetchProducts, deleteProduct } from '../lib/supabase';
import AdminProductForm from '../components/AdminProductForm';
import AdminLogin from '../components/AdminLogin';
import AdminDashboardCharts from '../components/AdminDashboardCharts';
import Link from 'next/link';

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalStock: number;
  averagePrice: number;
}

export default function AdminClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    totalStock: 0,
    averagePrice: 0,
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        loadProducts();
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('خطأ في التحقق من المستخدم:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);

      const categories = Array.from(new Set(productsData.map(p => p.category)));
      const totalStock = productsData.reduce((sum, p) => sum + (p.stock || 0), 0);
      const totalPrice = productsData.reduce((sum, p) => sum + p.price, 0);
      const avgPrice = productsData.length > 0 ? totalPrice / productsData.length : 0;

      setStats({
        totalProducts: productsData.length,
        totalCategories: categories.length,
        totalStock,
        averagePrice: avgPrice,
      });

      setError(null);
    } catch (err) {
      console.error('خطأ في تحميل المنتجات:', err);
      setError('حدث خطأ أثناء تحميل المنتجات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsAuthenticated(true);
    loadProducts();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setProducts([]);
    setSelectedProduct(null);
    setIsAddingNew(false);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsAddingNew(false);
  };

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setIsAddingNew(true);
  };

  const handleProductSaved = () => {
    setSelectedProduct(null);
    setIsAddingNew(false);
    loadProducts();
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const success = await deleteProduct(id);
      if (success) {
        loadProducts();
      } else {
        setError('حدث خطأ أثناء حذف المنتج');
      }
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <button 
          onClick={handleLogout}
          className="btn btn-secondary"
        >
          تسجيل الخروج
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/products" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <h2 className="text-xl font-bold mb-2">إدارة المنتجات</h2>
            <p className="text-gray-600">إضافة وتحرير وحذف المنتجات</p>
          </Link>
          <Link href="/admin/categories" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <h2 className="text-xl font-bold mb-2">إدارة التصنيفات</h2>
            <p className="text-gray-600">إدارة تصنيفات المنتجات</p>
          </Link>
          <Link href="/admin/advertisements" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <h2 className="text-xl font-bold mb-2">إدارة الإعلانات</h2>
            <p className="text-gray-600">إدارة إعلانات الموقع</p>
          </Link>
        </div>
      )}
    </div>
  );
}