import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from 'react-icons/fa';
import {FaEye} from "react-icons/fa6"

const Wishlist = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWishlist = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await wishlistAPI.getWishlist();
            console.log('Wishlist response:', response);

            if (response.success) {
                // API currently returns items with a legacy 'gem' property (treated as gift data)
                const items = response.items || response.data || response.wishlist || [];
                console.log('Wishlist items:', items);
                setWishlistItems(items);
            } else {
                setError('Failed to load wishlist');
            }
        } catch (err) {
            console.error('Error fetching wishlist:', err);
            setError(err.message || 'Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [isAuthenticated, navigate, fetchWishlist]);

    const handleRemoveFromWishlist = async (item) => {
        const giftId = item.gem?._id || item.gem?.id || item._id || item.id;

        console.log('Removing from wishlist:', { item, giftId });

        if (!giftId) {
            console.error('No gift ID found for item:', item);
            alert('Cannot remove item - invalid ID');
            return;
        }

        try {
            const response = await wishlistAPI.removeFromWishlist(giftId);
            if (response.success) {
                // Remove item from local state
                setWishlistItems(wishlistItems.filter(wishlistItem => {
                    const itemGiftId = wishlistItem.gem?._id || wishlistItem.gem?.id || wishlistItem._id || wishlistItem.id;
                    return itemGiftId !== giftId;
                }));
                alert('Removed from wishlist');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            alert(error.message || 'Failed to remove from wishlist');
        }
    };

    const handleAddToCart = (item) => {
        // Extract gift data (API returns { gem: {...}, addedAt: ... })
        const gift = item.gem || item;

        addToCart({
            id: gift._id || gift.id,
            name: gift.name,
            price: gift.price,
            discount: gift.discount,
            discountType: gift.discountType,
            image: gift.heroImage || gift.images?.[0] || null,
            category: gift.category,
            sizeWeight: gift.sizeWeight,
            sizeUnit: gift.sizeUnit
        });
        alert(`${gift.name} added to cart!`);
    };

    const handleClearWishlist = async () => {
        if (!window.confirm('Are you sure you want to clear your entire wishlist?')) {
            return;
        }

        try {
            const response = await wishlistAPI.clearWishlist();
            if (response.success) {
                setWishlistItems([]);
            }
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            alert('Failed to clear wishlist');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
                    <p className="text-red-200 text-lg">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black flex items-center justify-center text-red-100">
                <div className="text-center bg-black/70 border border-red-900/40 px-8 py-10 rounded-3xl shadow-[0_25px_45px_rgba(220,38,38,0.25)]">
                    <FaHeart className="w-16 h-16 text-red-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-3">Error loading wishlist</h2>
                    <p className="text-red-200/80 mb-6">{error}</p>
                    <button
                        onClick={fetchWishlist}
                        className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-500 transition-colors shadow-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black text-red-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-red-300 hover:text-white mb-6 transition-colors"
                    >
                        <FaArrowLeft />
                        <span className="font-medium uppercase tracking-wide text-sm">Back</span>
                    </button>

                    <div className="text-center py-20 bg-black/60 border border-red-900/40 rounded-3xl shadow-[0_25px_45px_rgba(220,38,38,0.25)]">
                        <FaHeart className="w-24 h-24 text-red-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-3">Your wishlist is empty</h2>
                        <p className="text-red-200/80 mb-8 max-w-md mx-auto">
                            Start adding gifts you love to your wishlist and never lose track of them!
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-500 transition-colors shadow-lg hover:shadow-[0_25px_40px_rgba(220,38,38,0.35)] font-semibold uppercase tracking-wide text-sm"
                        >
                            Explore Gifts
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black text-red-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-red-300 hover:text-white mb-4 transition-colors"
                    >
                        <FaArrowLeft />
                        <span className="font-medium uppercase tracking-wide text-sm">Back</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                                <FaHeart className="text-red-500" />
                                My Wishlist
                            </h1>
                            <p className="text-red-200/80">
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                            </p>
                        </div>
                        {wishlistItems.length > 0 && (
                            <button
                                onClick={handleClearWishlist}
                                className="text-red-300 hover:text-white font-medium transition-colors uppercase tracking-wide text-sm"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Wishlist Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {wishlistItems.map((item) => {
                            // Extract gift data (API returns { gem: {...}, addedAt: ... })
                            const gift = item.gem || item;
                            const giftId = gift._id || gift.id;

                            return (
                                <motion.div
                                    key={giftId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-black/60 border border-red-900/40 rounded-3xl shadow-[0_20px_35px_rgba(220,38,38,0.2)] overflow-hidden hover:shadow-[0_30px_50px_rgba(220,38,38,0.3)] transition-all duration-300 group backdrop-blur-lg"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square bg-black/60 overflow-hidden">
                                        <img
                                            src={gift.heroImage || gift.images?.[0] || '/placeholder-gift.jpg'}
                                            alt={gift.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                                            onClick={() => navigate(`/gift/${giftId}`)}
                                        />
                                        <button
                                            onClick={() => handleRemoveFromWishlist(item)}
                                            className="absolute top-3 right-3 p-2 bg-black/60 border border-red-900/40 rounded-full shadow-lg text-red-400 hover:bg-red-600/30 hover:text-white transition-colors"
                                            title="Remove from wishlist"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                        {gift.discount > 0 && (
                                            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                                {gift.discountType === 'percentage' ? `${gift.discount}% OFF` : `₹${gift.discount} OFF`}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3
                                            className="font-bold text-lg text-white mb-1 line-clamp-1 cursor-pointer hover:text-red-200 transition-colors"
                                            onClick={() => navigate(`/gift/${giftId}`)}
                                        >
                                            {gift.name}
                                        </h3>
                                        <p className="text-xs uppercase tracking-wide text-red-300 mb-2">{gift.category}</p>

                                        {/* Price */}
                                        <div className="flex items-center space-x-2 mb-4">
                                            <span className="text-2xl font-bold text-white">
                                                ₹{(gift.discount > 0
                                                    ? gift.discountType === 'percentage'
                                                        ? gift.price - (gift.price * gift.discount) / 100
                                                        : gift.price - gift.discount
                                                    : gift.price
                                                ).toLocaleString()}
                                            </span>
                                            {gift.discount > 0 && (
                                                <span className="text-sm text-red-300/80 line-through">
                                                    ₹{gift.price.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        {/* Specifications */}
                                        {gift.sizeWeight && (
                                            <p className="text-sm text-red-200/80 mb-4">
                                                {gift.sizeWeight} {gift.sizeUnit}
                                            </p>
                                        )}

                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="w-full bg-red-600 text-white py-2.5 px-4 rounded-full hover:bg-red-500 transition-colors font-semibold flex items-center justify-center space-x-2 shadow-lg"
                                        >
                                            <FaShoppingCart className="w-4 h-4" />
                                            <span>Add to Cart</span>
                                        </button>
                                        <button
                                            onClick={() => navigate(`/gift/${giftId}`)}
                                            className="mt-3 w-full bg-black/50 border border-red-900/40 text-red-200 py-2.5 px-4 rounded-full hover:bg-red-600/20 hover:text-white transition-colors font-semibold flex items-center justify-center space-x-2"
                                        >
                                            <FaEye className="w-4 h-4" />
                                            <span>View Details</span>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Wishlist;

