import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaShoppingCart, FaEye, FaStar } from 'react-icons/fa';

const GiftCard = ({ gift, onAddToCart, onToggleWishlist, isWishlisted = false }) => {
    const calculatePrice = () => {
        if (gift.discount && gift.discount > 0) {
            const discountAmount = gift.discountType === 'percentage'
                ? (gift.price * gift.discount) / 100
                : gift.discount;
            return gift.price - discountAmount;
        }
        return gift.price;
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);

    const getGiftBadge = (category = '') => {
        const key = category.toLowerCase();
        if (key.includes('birthday')) return '🎂';
        if (key.includes('first')) return '✨';
        if (key.includes('love')) return '❤️';
        if (key.includes('friend')) return '🤝';
        if (key.includes('office')) return '💼';
        if (key.includes('marriage') || key.includes('wedding')) return '💍';
        if (key.includes('return')) return '🎁';
        if (key.includes('after marriage')) return '🏠';
        if (key.includes('boy')) return '🧢';
        if (key.includes('girl')) return '🎀';
        if (key.includes('custom')) return '🛠️';
        return '🎁';
    };

    const getCardGradient = (category = '') => {
        const key = category.toLowerCase();
        if (key.includes('birthday')) return 'from-red-500/40 via-red-600/20 to-black';
        if (key.includes('first')) return 'from-rose-500/40 via-red-500/20 to-black';
        if (key.includes('love')) return 'from-pink-500/40 via-red-500/20 to-black';
        if (key.includes('friend')) return 'from-orange-500/40 via-red-500/20 to-black';
        if (key.includes('office')) return 'from-red-500/30 via-slate-800/60 to-black';
        if (key.includes('marriage') || key.includes('wedding')) return 'from-amber-500/40 via-red-500/20 to-black';
        if (key.includes('return')) return 'from-purple-500/40 via-red-500/20 to-black';
        if (key.includes('boy')) return 'from-blue-500/40 via-red-500/20 to-black';
        if (key.includes('girl')) return 'from-rose-500/40 via-red-500/20 to-black';
        if (key.includes('custom')) return 'from-red-500/40 via-slate-900/60 to-black';
        return 'from-red-500/20 via-slate-900/60 to-black';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-black/60 border border-red-900/40 rounded-2xl shadow-2xl hover:shadow-[0_25px_45px_rgba(220,38,38,0.35)] transition-all duration-300 overflow-hidden group text-red-100"
        >
            <div className="relative h-64 overflow-hidden">
                {(gift.images?.length || gift.heroImage || gift.allImages?.[0]) ? (
                    <img
                        src={gift.images?.[0] || gift.heroImage || gift.allImages?.[0]}
                        alt={gift.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCardGradient(gift.category)} flex items-center justify-center`}>
                        <span className="text-6xl drop-shadow-lg">{getGiftBadge(gift.category)}</span>
                    </div>
                )}

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {gift.discount > 0 && (
                        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                            {gift.discountType === 'percentage' ? `${gift.discount}% OFF` : `₹${gift.discount} OFF`}
                        </span>
                    )}
                    {!gift.availability && (
                        <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Out of Stock
                        </span>
                    )}
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => onToggleWishlist?.(gift)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg ${isWishlisted
                            ? 'bg-red-600 text-white'
                            : 'bg-black/70 text-red-100 hover:bg-red-600 hover:text-white border border-red-900/40'
                            }`}
                    >
                        <FaHeart className="w-4 h-4" />
                    </button>
                    <Link
                        to={`/gift/${gift._id || gift.id}`}
                        className="w-10 h-10 bg-black/70 text-red-100 border border-red-900/40 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-200 shadow-lg"
                    >
                        <FaEye className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold tracking-widest text-white bg-red-600/30 border border-red-900/40 px-3 py-1 rounded-full uppercase">
                        {gift.category || 'Gift Collection'}
                    </span>
                    <div className="flex items-center space-x-1">
                        <FaStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-red-200">{gift.averageRating || gift.rating || 0}</span>
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {gift.name}
                </h3>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-white">
                            {formatPrice(calculatePrice())}
                        </span>
                        {gift.discount > 0 && (
                            <span className="text-lg text-red-300 line-through">
                                {formatPrice(gift.price)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={() => onAddToCart?.(gift)}
                        disabled={!gift.availability}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${gift.availability
                            ? 'bg-red-600 text-white hover:bg-red-500 transform hover:scale-105 shadow-lg'
                            : 'bg-gray-700/60 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <FaShoppingCart className="w-4 h-4" />
                        <span>{gift.availability ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                </div>

                <div className="mt-4 pt-4 border-top border-red-900/40 text-sm text-red-200 flex items-center justify-between">
                    <span className="truncate mr-2">
                        {gift.sizeWeight && gift.sizeUnit ? `${gift.sizeWeight} ${gift.sizeUnit}` : 'Curated Experience'}
                    </span>
                    <span className="flex items-center space-x-1">
                        <span className={`w-2 h-2 rounded-full ${gift.availability ? 'bg-green-400' : 'bg-red-500'}`} />
                        <span>{gift.availability ? 'In Stock' : 'Unavailable'}</span>
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default GiftCard;

