import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaShoppingBag, FaRupeeSign, FaExclamationTriangle } from 'react-icons/fa';
import { giftAPI, authAPI, orderAPI } from '../services/api';

const SellerDashboard = () => {
    const navigate = useNavigate();
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalGifts: 0,
        lowStockGifts: 0,
        outOfStock: 0,
        totalValue: 0
    });
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });

    const user = authAPI.getCurrentUser();

    useEffect(() => {
        if (!authAPI.isAuthenticated() || user?.role !== 'seller') {
            navigate('/login');
            return;
        }
        Promise.all([fetchSellerGifts(), fetchOrderStats()]).finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchSellerGifts = async () => {
        try {
            const userId = user._id || user.id;
            const response = await giftAPI.getGifts({ seller: userId });
            if (response.success) {
                const sellerGifts = response.gifts || response.data?.gifts || [];
                setGifts(sellerGifts);

                const lowStock = sellerGifts.filter(item => item.stock && item.stock <= 5 && item.stock > 0).length;
                const outOfStock = sellerGifts.filter(item => !item.stock || item.stock === 0).length;
                const totalValue = sellerGifts.reduce((sum, item) => sum + (item.price * (item.stock || 0)), 0);

                setStats({
                    totalGifts: sellerGifts.length,
                    lowStockGifts: lowStock,
                    outOfStock,
                    totalValue
                });
            } else {
                setError(response.message || 'Unable to load gifts');
            }
        } catch (err) {
            setError(err.message || 'Unable to load gifts');
        }
    };

    const fetchOrderStats = async () => {
        try {
            const response = await orderAPI.getSellerOrderStats();
            if (response.success) {
                setOrderStats(response.stats || {
                    totalOrders: 0,
                    pendingOrders: 0,
                    totalRevenue: 0
                });
            }
        } catch (err) {
            console.error('Error fetching order stats:', err);
        }
    };

    const handleDeleteGift = async (giftId) => {
        const confirm = window.confirm('Remove this gift from your catalogue?');
        if (!confirm) return;
        try {
            const response = await giftAPI.deleteGift(giftId);
            if (response.success) {
                await fetchSellerGifts();
            } else {
                alert(response.message || 'Failed to delete gift');
            }
        } catch (err) {
            alert(err.message || 'Failed to delete gift');
        }
    };

    const getStockBadge = (stock) => {
        if (!stock || stock === 0) {
            return { label: 'Out of stock', className: 'bg-red-500/20 text-red-200 border border-red-500/40' };
        }
        if (stock <= 5) {
            return { label: `Low (${stock})`, className: 'bg-amber-500/20 text-amber-200 border border-amber-500/40' };
        }
        return { label: `In stock (${stock})`, className: 'bg-green-500/20 text-green-200 border border-green-500/40' };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black flex items-center justify-center text-red-100">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
                    <p className="text-lg">Preparing your seller studio…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black flex items-center justify-center text-red-100">
                <div className="text-center space-y-6 max-w-md">
                    <div className="text-5xl">⚠️</div>
                    <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
                    <p className="text-red-200/80">{error}</p>
                    <button
                        onClick={async () => {
                            setError('');
                            setLoading(true);
                            await fetchSellerGifts();
                            setLoading(false);
                        }}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black py-10 px-4 sm:px-6 lg:px-12 text-red-100">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="space-y-2">
                        <p className="text-xs tracking-[0.5em] uppercase text-red-400">Seller Hub</p>
                        <h1 className="text-3xl sm:text-4xl font-black text-white">Welcome back, {user?.name}</h1>
                        <p className="text-red-200/80">Track your curated gifts, manage stock, and stay ready for the next celebration.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/seller-orders')}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-red-900/40 text-red-200 hover:bg-red-600/20 transition-colors"
                        >
                            <FaShoppingBag />
                            <span>Orders ({orderStats.pendingOrders} pending)</span>
                        </button>
                        <button
                            onClick={() => navigate('/add-gift')}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all shadow-[0_20px_40px_rgba(220,38,38,0.35)]"
                        >
                            <FaPlus />
                            <span>Add New Gift</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/70 border border-red-900/40 rounded-2xl p-6 shadow-[0_25px_45px_rgba(220,38,38,0.25)]"
                    >
                        <p className="text-sm text-red-300 uppercase tracking-wide mb-2">Total gifts</p>
                        <p className="text-4xl font-bold text-white">{stats.totalGifts}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-black/70 border border-red-900/40 rounded-2xl p-6 shadow-[0_25px_45px_rgba(220,38,38,0.25)]"
                    >
                        <p className="text-sm text-red-300 uppercase tracking-wide mb-2">Low stock</p>
                        <p className="text-4xl font-bold text-amber-300">{stats.lowStockGifts}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-black/70 border border-red-900/40 rounded-2xl p-6 shadow-[0_25px_45px_rgba(220,38,38,0.25)]"
                    >
                        <p className="text-sm text-red-300 uppercase tracking-wide mb-2">Out of stock</p>
                        <p className="text-4xl font-bold text-red-300">{stats.outOfStock}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-black/70 border border-red-900/40 rounded-2xl p-6 shadow-[0_25px_45px_rgba(220,38,38,0.25)]"
                    >
                        <p className="text-sm text-red-300 uppercase tracking-wide mb-2">Inventory value</p>
                        <div className="flex items-center gap-2">
                            <FaRupeeSign className="text-red-300" />
                            <p className="text-3xl font-bold text-white">{stats.totalValue.toLocaleString()}</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-black/70 border border-red-900/40 rounded-2xl p-6 shadow-[0_25px_45px_rgba(220,38,38,0.25)]"
                    >
                        <p className="text-sm text-red-300 uppercase tracking-wide mb-2">Total orders</p>
                        <p className="text-4xl font-bold text-white">{orderStats.totalOrders}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-black/70 border border-red-900/40 rounded-2xl p-6 shadow-[0_25px_45px_rgba(220,38,38,0.25)]"
                    >
                        <p className="text-sm text-red-300 uppercase tracking-wide mb-2">Pending orders</p>
                        <p className="text-4xl font-bold text-amber-300">{orderStats.pendingOrders}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-black/70 border border-red-900/40 rounded-2xl p-6 shadow-[0_25px_45px_rgba(220,38,38,0.25)]"
                    >
                        <p className="text-sm text-red-300 uppercase tracking-wide mb-2">Revenue earned</p>
                        <div className="flex items-center gap-2">
                            <FaRupeeSign className="text-red-300" />
                            <p className="text-3xl font-bold text-white">{(orderStats.totalRevenue || 0).toLocaleString()}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-white">Gift Catalogue</h2>
                    <button
                        onClick={() => navigate('/add-gift')}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all shadow-[0_20px_40px_rgba(220,38,38,0.35)]"
                    >
                        <FaPlus />
                        <span>Add Gift</span>
                    </button>
                </div>

                {gifts.length === 0 ? (
                    <div className="bg-black/60 border border-red-900/40 rounded-3xl p-12 text-center space-y-4 shadow-[0_25px_45px_rgba(220,38,38,0.25)]">
                        <div className="text-5xl">🎁</div>
                        <h3 className="text-2xl font-bold text-white">No gifts listed yet</h3>
                        <p className="text-red-200/80">Create your first curated gift experience to get started.</p>
                        <button
                            onClick={() => navigate('/add-gift')}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all"
                        >
                            <FaPlus />
                            <span>Add first gift</span>
                        </button>
                    </div>
                ) : (
                    <div className="bg-black/60 border border-red-900/40 rounded-3xl shadow-[0_25px_45px_rgba(220,38,38,0.25)] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-red-900/30">
                                <thead className="bg-black/80">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-red-300">Gift</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-red-300">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-red-300">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-red-300">Stock</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-red-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-red-900/30">
                                    {gifts.map((gift) => {
                                        const badge = getStockBadge(gift.stock);
                                        return (
                                            <tr key={gift._id || gift.id} className="hover:bg-red-600/10 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-12 w-12 rounded-xl border border-red-900/40 bg-black/60 flex items-center justify-center overflow-hidden">
                                                            {gift.images?.[0] ? (
                                                                <img src={gift.images[0]} alt={gift.name} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <span className="text-xl">🎁</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-white">{gift.name}</p>
                                                            <p className="text-xs text-red-300">{gift.sizeWeight} {gift.sizeUnit}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-200 border border-red-500/40">
                                                        {gift.category || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-100 font-semibold">
                                                    ₹{gift.price.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${badge.className}`}>
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-3">
                                                    <button
                                                        onClick={() => navigate(`/gift/${gift._id || gift.id}`)}
                                                        className="text-red-200 hover:text-white transition-colors"
                                                        title="View gift"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/edit-gift/${gift._id || gift.id}`)}
                                                        className="text-red-200 hover:text-white transition-colors"
                                                        title="Edit gift"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteGift(gift._id || gift.id)}
                                                        className="text-red-400 hover:text-red-200 transition-colors"
                                                        title="Delete gift"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {stats.lowStockGifts > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-5 flex items-start gap-3"
                    >
                        <FaExclamationTriangle className="text-amber-300 mt-1" />
                        <div>
                            <p className="text-sm font-semibold text-white">Low stock alert</p>
                            <p className="text-sm text-amber-200">You have {stats.lowStockGifts} gift(s) running low. Restock soon to keep experiences live.</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;

