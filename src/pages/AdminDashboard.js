import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI } from '../services/api';
import { authAPI } from '../services/api';
import { FaUsers, FaStore, FaGift, FaShoppingBag, FaChartLine, FaBan, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBuyers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    blockedBuyers: 0,
    blockedSellers: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const user = authAPI.getCurrentUser();
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      
      if (response.success) {
        setStats(response.stats || {
          totalBuyers: response.data?.totalBuyers || 0,
          totalSellers: response.data?.totalSellers || 0,
          totalProducts: response.data?.totalProducts || 0,
          totalOrders: response.data?.totalOrders || 0,
          blockedBuyers: response.data?.blockedBuyers || 0,
          blockedSellers: response.data?.blockedSellers || 0,
          pendingOrders: response.data?.pendingOrders || 0,
          totalRevenue: response.data?.totalRevenue || 0
        });
      } else {
        // Fallback: fetch individual data
        await fetchIndividualStats();
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      await fetchIndividualStats();
    } finally {
      setLoading(false);
    }
  };

  const fetchIndividualStats = async () => {
    try {
      const [buyersRes, sellersRes, productsRes, ordersRes] = await Promise.all([
        adminAPI.getBuyers().catch(() => ({ success: false, buyers: [] })),
        adminAPI.getSellers().catch(() => ({ success: false, sellers: [] })),
        adminAPI.getAllProducts().catch(() => ({ success: false, products: [] })),
        adminAPI.getAllOrders().catch(() => ({ success: false, orders: [] }))
      ]);

      const buyers = buyersRes.buyers || buyersRes.data?.buyers || [];
      const sellers = sellersRes.sellers || sellersRes.data?.sellers || [];
      const products = productsRes.products || productsRes.data?.products || [];
      const orders = ordersRes.orders || ordersRes.data?.orders || [];

      setStats({
        totalBuyers: buyers.length,
        totalSellers: sellers.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        blockedBuyers: buyers.filter(b => b.isBlocked || b.status === 'blocked').length,
        blockedSellers: sellers.filter(s => s.isBlocked || s.status === 'blocked' || s.status === 'suspended').length,
        pendingOrders: orders.filter(o => o.status?.toLowerCase() === 'pending').length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
      });
    } catch (error) {
      console.error('Error fetching individual stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage buyers, sellers, products, and orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate('/admin/buyers')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Buyers</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalBuyers}</p>
                {stats.blockedBuyers > 0 && (
                  <p className="text-xs text-red-600 mt-1">{stats.blockedBuyers} blocked</p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate('/admin/sellers')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sellers</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalSellers}</p>
                {stats.blockedSellers > 0 && (
                  <p className="text-xs text-red-600 mt-1">{stats.blockedSellers} blocked</p>
                )}
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FaStore className="text-purple-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate('/admin/products')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <FaGift className="text-red-500 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate('/admin/orders')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalOrders}</p>
                {stats.pendingOrders > 0 && (
                  <p className="text-xs text-yellow-600 mt-1">{stats.pendingOrders} pending</p>
                )}
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FaShoppingBag className="text-orange-600 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl shadow-lg p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaChartLine className="text-3xl" />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/buyers"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Buyers</h3>
                <p className="text-sm text-gray-600">View and manage all buyers</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/sellers"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <FaStore className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Sellers</h3>
                <p className="text-sm text-gray-600">View and manage all sellers</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/products"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <FaGift className="text-red-500 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-600">View all products</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <FaShoppingBag className="text-orange-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Orders</h3>
                <p className="text-sm text-gray-600">View all orders</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

