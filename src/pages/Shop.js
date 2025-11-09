import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { giftAPI, wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import GiftCard from '../components/gifts/GiftCard';
import Pagination from '../components/gifts/Pagination';
import { FaSpinner, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const defaultGiftCategories = [
    'Birthday Gift',
    'First Meeting Gift',
    'For Love',
    'For Best Friend',
    'Office Gifts',
    'Marriage Gifts',
    'Return Gift',
    'After Marriage',
    'Kids - Boys',
    'Kids - Girls',
    'Customisable Gifts'
];

const kidsAgeRanges = [
    { value: '', label: 'Any age' },
    { value: '0-3', label: '0 - 3 years' },
    { value: '4-6', label: '4 - 6 years' },
    { value: '7-9', label: '7 - 9 years' },
    { value: '10-12', label: '10 - 12 years' },
    { value: '13-15', label: '13 - 15 years' }
];

const recipientOptions = [
    { value: '', label: 'Any recipient' },
    { value: 'boy', label: 'For Boys' },
    { value: 'girl', label: 'For Girls' },
    { value: 'unisex', label: 'Unisex / Anyone' }
];

const Shop = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({});
    const [categories, setCategories] = useState(defaultGiftCategories);
    const [wishlist, setWishlist] = useState(new Set());
    const [loadingWishlist, setLoadingWishlist] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: searchParams.get('query') || '',
        category: [],
        minPrice: '',
        maxPrice: '',
        sort: 'newest',
        ageRange: '',
        recipient: '',
        customizable: ''
    });

    // Temporary filter inputs (before apply)
    const [tempFilters, setTempFilters] = useState({
        search: searchParams.get('query') || '',
        category: [],
        minPrice: '',
        maxPrice: '',
        sort: 'newest',
        ageRange: '',
        recipient: '',
        customizable: ''
    });

    // Fetch gifts
    const fetchGifts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query params
            const params = {};
            if (filters.page) params.page = filters.page;
            if (filters.limit) params.limit = filters.limit;
            if (filters.search) params.search = filters.search;
            if (filters.category && filters.category.length > 0) {
                params.category = filters.category.join(','); // Convert array to comma-separated string
            }
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.sort) params.sort = filters.sort;
            if (filters.ageRange) params.ageRange = filters.ageRange;
            if (filters.recipient) params.recipient = filters.recipient;
            if (filters.customizable !== '') params.customizable = filters.customizable;

            const response = await giftAPI.getGifts(params);

            console.log("response", response);

            if (response.success) {
                setGifts(response.data?.gifts || response.data?.items || response.gifts || []);
                setPagination(response.data?.pagination || response.pagination || {});
            } else {
                setError('Failed to fetch gifts');
            }
        } catch (err) {
            console.error('Error fetching gifts:', err);
            setError(err.message || 'Failed to fetch gifts');
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await giftAPI.getGiftCategories();
            if (response.success && Array.isArray(response.data)) {
                const merged = Array.from(new Set([...defaultGiftCategories, ...response.data]));
                setCategories(merged);
            } else {
                setCategories(defaultGiftCategories);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setCategories(defaultGiftCategories);
        }
    };

    // Fetch wishlist
    const fetchWishlist = async () => {
        if (!isAuthenticated) return;
        
        try {
            setLoadingWishlist(true);
            const response = await wishlistAPI.getWishlist();
            if (response.success && response.items) {
                const wishlistIds = new Set(
                    response.items.map(item => item.gift?._id || item.gift?.id || item.gift || item.gem?._id || item.gem?.id || item.gem)
                );
                setWishlist(wishlistIds);
            }
        } catch (err) {
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoadingWishlist(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchGifts();
        fetchCategories();
        fetchWishlist();
    }, [filters, isAuthenticated]);

    // Handle apply filters
    const handleApplyFilters = () => {
        setFilters(prev => ({
            ...prev,
            search: tempFilters.search,
            category: tempFilters.category,
            minPrice: tempFilters.minPrice,
            maxPrice: tempFilters.maxPrice,
            sort: tempFilters.sort,
            ageRange: tempFilters.ageRange,
            recipient: tempFilters.recipient,
            customizable: tempFilters.customizable,
            page: 1 // Reset to first page when filters change
        }));
    };

    // Handle search input
    const handleSearchChange = (e) => {
        setTempFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    // Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setFilters(prev => ({
            ...prev,
            search: tempFilters.search,
            page: 1
        }));
    };

    // Handle category toggle
    const handleCategoryToggle = (category) => {
        setTempFilters(prev => {
            const isSelected = prev.category.includes(category);
            return {
                ...prev,
                category: isSelected
                    ? prev.category.filter(c => c !== category)
                    : [...prev.category, category]
            };
        });
    };

    // Handle price change
    const handlePriceChange = (type, value) => {
        setTempFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handleAgeRangeChange = (value) => {
        setTempFilters(prev => ({
            ...prev,
            ageRange: value
        }));
    };

    const handleRecipientChange = (value) => {
        setTempFilters(prev => ({
            ...prev,
            recipient: value
        }));
    };

    const handleCustomizableChange = (value) => {
        setTempFilters(prev => ({
            ...prev,
            customizable: value
        }));
    };

    // Handle sort change
    const handleSortChange = (value) => {
        setTempFilters(prev => ({
            ...prev,
            sort: value
        }));
        // Apply sort immediately
        setFilters(prev => ({
            ...prev,
            sort: value,
            page: 1
        }));
    };

    // Handle pagination
    const handlePageChange = (page, newLimit = null) => {
        setFilters(prev => ({
            ...prev,
            page,
            limit: newLimit || prev.limit
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        const resetFilters = {
            page: 1,
            limit: 12,
            search: '',
            category: [],
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
            ageRange: '',
            recipient: '',
            customizable: ''
        };
        setFilters(resetFilters);
        setTempFilters({
            search: '',
            category: [],
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
            ageRange: '',
            recipient: '',
            customizable: ''
        });
    };

    // Handle add to cart
    const handleAddToCart = (gift) => {
        addToCart({
            id: gift._id || gift.id, // Use _id from MongoDB or id
            name: gift.name,
            price: gift.price,
            discount: gift.discount,
            discountType: gift.discountType,
            image: gift.images?.[0] || null,
            category: gift.category,
            sizeWeight: gift.sizeWeight,
            sizeUnit: gift.sizeUnit
        });

        // Show success message
        alert(`${gift.name} added to cart!`);
    };

    // Handle wishlist toggle
    const handleToggleWishlist = async (gift) => {
        const giftId = gift._id || gift.id;
        
        if (!isAuthenticated) {
            alert('Please login to add items to wishlist');
            navigate('/login');
            return;
        }

        try {
            const isCurrentlyWishlisted = wishlist.has(giftId);
            
            // Optimistic update
            setWishlist(prev => {
                const newWishlist = new Set(prev);
                if (isCurrentlyWishlisted) {
                    newWishlist.delete(giftId);
                } else {
                    newWishlist.add(giftId);
                }
                return newWishlist;
            });

            // Make API call
            if (isCurrentlyWishlisted) {
                const response = await wishlistAPI.removeFromWishlist(giftId);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to remove from wishlist');
                }
            } else {
                const response = await wishlistAPI.addToWishlist(giftId);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to add to wishlist');
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            // Revert optimistic update on error
            setWishlist(prev => {
                const newWishlist = new Set(prev);
                if (wishlist.has(giftId)) {
                    newWishlist.delete(giftId);
                } else {
                    newWishlist.add(giftId);
                }
                return newWishlist;
            });
            alert(error.message || 'Failed to update wishlist');
        }
    };

    // Loading state
    if (loading && gifts.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#160003] to-black flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
                    <p className="text-xl text-red-200">Loading gifts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-black/60 backdrop-blur-md border border-red-900/40 rounded-2xl shadow-2xl p-6 sticky top-6 text-red-100">
                            <h2 className="text-xl font-bold text-white mb-6 tracking-widest uppercase">Filters</h2>

                            {/* Search */}
                            <form onSubmit={handleSearchSubmit} className="mb-6">
                                <label className="block text-sm font-semibold text-red-200 mb-2 tracking-wide uppercase">
                                    Search Gifts
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={tempFilters.search}
                                        onChange={handleSearchChange}
                                        placeholder="Search by theme..."
                                        className="w-full px-4 py-2 border border-red-900/40 rounded-lg bg-black/60 text-white placeholder-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-500 transition-colors"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-red-200 mb-3 uppercase tracking-wide">
                                    Category (Multiple)
                                </label>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                    {categories.map((category) => (
                                        <label key={category} className="flex items-center space-x-2 cursor-pointer text-sm">
                                            <input
                                                type="checkbox"
                                                checked={tempFilters.category.includes(category)}
                                                onChange={() => handleCategoryToggle(category)}
                                                className="rounded border-red-900/40 bg-black text-red-500 focus:ring-red-400"
                                            />
                                            <span>{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-red-200 mb-3 uppercase tracking-wide">
                                    Price Range (₹)
                                </label>
                                <div className="space-y-3">
                                    <input
                                        type="number"
                                        value={tempFilters.minPrice}
                                        onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                                        placeholder="Min Price"
                                        min="0"
                                        className="w-full px-4 py-2 border border-red-900/40 rounded-lg bg-black/60 text-white placeholder-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                    />
                                    <input
                                        type="number"
                                        value={tempFilters.maxPrice}
                                        onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                                        placeholder="Max Price"
                                        min="0"
                                        className="w-full px-4 py-2 border border-red-900/40 rounded-lg bg-black/60 text-white placeholder-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Age Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-red-200 mb-3 uppercase tracking-wide">
                                    Kids Age Filter
                                </label>
                                <select
                                    value={tempFilters.ageRange}
                                    onChange={(e) => handleAgeRangeChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-red-900/40 rounded-lg bg-black/60 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                >
                                    {kidsAgeRanges.map((range) => (
                                        <option key={range.value} value={range.value} className="bg-black text-white">
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Recipient */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-red-200 mb-3 uppercase tracking-wide">
                                    Recipient
                                </label>
                                <select
                                    value={tempFilters.recipient}
                                    onChange={(e) => handleRecipientChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-red-900/40 rounded-lg bg-black/60 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                >
                                    {recipientOptions.map((option) => (
                                        <option key={option.value} value={option.value} className="bg-black text-white">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Customisation */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-red-200 mb-3 uppercase tracking-wide">
                                    Customisation
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleCustomizableChange('yes')}
                                        className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${tempFilters.customizable === 'yes'
                                            ? 'border-red-500 bg-red-600 text-white shadow-lg'
                                            : 'border-red-900/40 text-red-200 hover:border-red-500 hover:text-white'
                                            }`}
                                    >
                                        Customisable
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCustomizableChange('no')}
                                        className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${tempFilters.customizable === 'no'
                                            ? 'border-red-500 bg-red-600 text-white shadow-lg'
                                            : 'border-red-900/40 text-red-200 hover:border-red-500 hover:text-white'
                                            }`}
                                    >
                                        Ready-to-Ship
                                    </button>
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-red-200 mb-2 uppercase tracking-wide">
                                    Sort By
                                </label>
                                <select
                                    value={tempFilters.sort}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-red-900/40 rounded-lg bg-black/60 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>

                            {/* Apply Filters Button */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleApplyFilters}
                                    className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors shadow-lg"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="w-full px-4 py-2 border border-red-900/40 text-red-200 font-medium rounded-lg hover:border-red-500 hover:text-white transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Active Filters Count */}
                            <div className="mt-4 text-sm text-red-200 text-center">
                                {pagination.totalItems || 0} curated gifts found
                            </div>
                        </div>
                    </div>

                    {/* Gifts Grid */}
                    <div className="lg:col-span-3">
                        {/* Results Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-4">
                                {pagination.totalItems || 0} Gifts Found
                            </h2>

                            {/* Active Filters */}
                            <div className="flex flex-wrap items-center gap-2">
                                {filters.search && (
                                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                        Search: "{filters.search}"
                                        <button
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, search: '' }));
                                                setTempFilters(prev => ({ ...prev, search: '' }));
                                            }}
                                            className="hover:bg-emerald-200 rounded-full p-0.5"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {filters.category.map((cat) => (
                                    <span key={cat} className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                        {cat}
                                        <button
                                            onClick={() => {
                                                const newCategories = filters.category.filter(c => c !== cat);
                                                setFilters(prev => ({ ...prev, category: newCategories }));
                                                setTempFilters(prev => ({ ...prev, category: newCategories }));
                                            }}
                                            className="hover:bg-blue-200 rounded-full p-0.5"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                                {(filters.minPrice || filters.maxPrice) && (
                                    <span className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                        Price: ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}
                                        <button
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
                                                setTempFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
                                            }}
                                            className="hover:bg-purple-200 rounded-full p-0.5"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {filters.ageRange && (
                                    <span className="bg-rose-100 text-rose-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                        Age: {kidsAgeRanges.find(range => range.value === filters.ageRange)?.label || filters.ageRange}
                                        <button
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, ageRange: '' }));
                                                setTempFilters(prev => ({ ...prev, ageRange: '' }));
                                            }}
                                            className="hover:bg-rose-200 rounded-full p-0.5"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {filters.recipient && (
                                    <span className="bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                        Recipient: {recipientOptions.find(opt => opt.value === filters.recipient)?.label || filters.recipient}
                                        <button
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, recipient: '' }));
                                                setTempFilters(prev => ({ ...prev, recipient: '' }));
                                            }}
                                            className="hover:bg-red-200 rounded-full p-0.5"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {filters.customizable !== '' && (
                                    <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                        {filters.customizable === 'yes' ? 'Customisable' : 'Ready-to-Ship'}
                                        <button
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, customizable: '' }));
                                                setTempFilters(prev => ({ ...prev, customizable: '' }));
                                            }}
                                            className="hover:bg-gray-200 rounded-full p-0.5"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {filters.sort !== 'newest' && (
                                    <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                        Sort: {filters.sort === 'oldest' ? 'Oldest' : filters.sort === 'price-low' ? 'Price Low-High' : 'Price High-Low'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Error State */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-900/40 rounded-2xl p-6 mb-8 text-red-100"
                            >
                                <div className="flex items-center space-x-3">
                                    <FaExclamationTriangle className="w-6 h-6 text-red-400" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Error Loading Gifts</h3>
                                        <p className="text-red-200">{error}</p>
                                        <button
                                            onClick={fetchGifts}
                                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Gifts Grid */}
                        {!error && (
                            <>
                                {gifts.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-20 bg-black/60 border border-red-900/40 rounded-2xl shadow-2xl"
                                    >
                                        <FaSearch className="w-20 h-20 text-red-500 mx-auto mb-6" />
                                        <h3 className="text-2xl font-bold text-white mb-3">
                                            No matching gifts found
                                        </h3>
                                        <p className="text-red-200 mb-8 max-w-md mx-auto">
                                            Try different filters or search terms to explore our personalised gift curation.
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors shadow-lg"
                                        >
                                            Clear All Filters
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        layout
                                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
                                    >
                                        <AnimatePresence>
                                            {gifts.map((gift) => (
                                                <motion.div
                                                    key={gift._id || gift.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <GiftCard
                                                        gift={gift}
                                                        onAddToCart={handleAddToCart}
                                                        onToggleWishlist={handleToggleWishlist}
                                                        isWishlisted={wishlist.has(gift._id || gift.id)}
                                                    />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )}

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <Pagination
                                        currentPage={pagination.currentPage}
                                        totalPages={pagination.totalPages}
                                        onPageChange={handlePageChange}
                                        hasNext={pagination.hasNext}
                                        hasPrev={pagination.hasPrev}
                                        totalItems={pagination.totalItems}
                                        itemsPerPage={filters.limit}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
