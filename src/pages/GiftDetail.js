import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaCertificate, FaCheck, FaHeart, FaShare, FaShoppingCart, FaStar, FaTruck } from 'react-icons/fa';

import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import GiftCard from '../components/gifts/GiftCard';
import { giftAPI, reviewAPI, wishlistAPI } from '../services/api';

const getGiftBadge = (category = '') => {
    const key = category.toLowerCase();
    if (key.includes('birthday')) return '🎂';
    if (key.includes('first')) return '✨';
    if (key.includes('love')) return '❤️';
    if (key.includes('friend')) return '🤝';
    if (key.includes('office')) return '💼';
    if (key.includes('wedding') || key.includes('marriage')) return '💍';
    if (key.includes('return')) return '🎁';
    if (key.includes('after')) return '🏠';
    if (key.includes('boy')) return '🧢';
    if (key.includes('girl')) return '🎀';
    if (key.includes('custom')) return '🛠️';
    return '🎁';
};

const getGiftGradient = (category = '') => {
    const key = category.toLowerCase();
    if (key.includes('birthday')) return 'from-red-500/40 via-red-600/20 to-black';
    if (key.includes('first')) return 'from-rose-500/40 via-red-500/20 to-black';
    if (key.includes('love')) return 'from-pink-500/40 via-red-500/20 to-black';
    if (key.includes('friend')) return 'from-orange-500/40 via-red-500/20 to-black';
    if (key.includes('office')) return 'from-red-500/30 via-slate-800/60 to-black';
    if (key.includes('wedding') || key.includes('marriage')) return 'from-amber-500/40 via-red-500/20 to-black';
    if (key.includes('return')) return 'from-purple-500/40 via-red-500/20 to-black';
    if (key.includes('boy')) return 'from-blue-500/40 via-red-500/20 to-black';
    if (key.includes('girl')) return 'from-rose-500/40 via-red-500/20 to-black';
    if (key.includes('custom')) return 'from-red-500/40 via-slate-900/60 to-black';
    return 'from-red-500/20 via-slate-900/60 to-black';
};

const GiftDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [gift, setGift] = useState(null);
    const [relatedGifts, setRelatedGifts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistBusy, setWishlistBusy] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    const [selectedImage, setSelectedImage] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const [showAllBenefits, setShowAllBenefits] = useState(false);
    const [showAllSuitableFor, setShowAllSuitableFor] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const fetchGift = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await giftAPI.getGiftById(id, { signal: controller.signal });
                if (!response?.success) {
                    setError(response?.message || 'Gift not found');
                    setGift(null);
                    return;
                }

                const giftPayload = response.data || response.gift || null;
                if (!giftPayload) {
                    setError('Gift not found');
                    setGift(null);
                    return;
                }

                const combinedImages = [];
                if (giftPayload.heroImage) combinedImages.push(giftPayload.heroImage);
                if (giftPayload.additionalImages?.length) combinedImages.push(...giftPayload.additionalImages);

                setGift({ ...giftPayload, allImages: combinedImages });

                if (Array.isArray(response.relatedProducts)) {
                    setRelatedGifts(response.relatedProducts);
                } else {
                    setRelatedGifts([]);
                }
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error('Error fetching gift details:', err);
                setError(err.message || 'Failed to fetch gift details');
                setGift(null);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();

        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        if (!isAuthenticated) {
            setIsWishlisted(false);
            return;
        }

        let mounted = true;

        const checkWishlist = async () => {
            try {
                const response = await wishlistAPI.isInWishlist(id);
                if (!mounted) return;
                if (response?.success) {
                    setIsWishlisted(Boolean(response.isInWishlist));
                }
            } catch (err) {
                console.error('Error while checking wishlist status:', err);
                if (mounted) setIsWishlisted(false);
            }
        };

        checkWishlist();

        return () => {
            mounted = false;
        };
    }, [id, isAuthenticated]);

    useEffect(() => {
        const loadReviews = async () => {
            setLoadingReviews(true);
            try {
                const response = await reviewAPI.getGiftReviews(id);
                if (response?.success) {
                    setReviews(response.reviews || response.data || []);
                } else {
                    setReviews([]);
                }
            } catch (err) {
                console.error('Failed to fetch gift reviews:', err);
                setReviews([]);
            } finally {
                setLoadingReviews(false);
            }
        };

        loadReviews();
    }, [id]);

    const galleryImages = useMemo(() => {
        if (!gift) return [];
        if (gift.allImages?.length) return gift.allImages;
        if (gift.images?.length) return gift.images;
        if (gift.heroImage) return [gift.heroImage];
        return [];
    }, [gift]);

    const formattedPrice = useMemo(() => {
        if (!gift) return '₹0';
        const { price = 0, discount = 0, discountType = 'percentage' } = gift;
        const finalPrice =
            discount > 0
                ? discountType === 'percentage'
                    ? price - (price * discount) / 100
                    : price - discount
                : price;

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(finalPrice);
    }, [gift]);

    const originalPrice = useMemo(() => {
        if (!gift) return null;
        if (!gift.discount || gift.discount <= 0) return null;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(gift.price || 0);
    }, [gift]);

    const handleQuantityChange = (nextQuantity) => {
        if (!gift) return;
        if (nextQuantity < 1) return;
        if (gift.stock && nextQuantity > gift.stock) return;
        setQuantity(nextQuantity);
    };

    const handleAddToCart = async () => {
        if (!gift) return;
        setAddingToCart(true);
        try {
            addToCart({
                id: gift._id || gift.id,
                name: gift.name,
                price: gift.price,
                discount: gift.discount,
                discountType: gift.discountType,
                image: galleryImages[0] || null,
                category: gift.category,
                sizeWeight: gift.sizeWeight,
                sizeUnit: gift.sizeUnit,
                quantity
            });
            alert(`${gift.name} added to cart!`);
            setQuantity(1);
        } catch (err) {
            console.error('Unable to add gift to cart', err);
            alert('Failed to add gift to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleToggleWishlist = async () => {
        if (!gift) return;
        if (!isAuthenticated) {
            alert('Please login to manage your wishlist.');
            navigate('/login');
            return;
        }
        if (wishlistBusy) return;

        setWishlistBusy(true);
        try {
            if (isWishlisted) {
                const response = await wishlistAPI.removeFromWishlist(id);
                if (!response?.success) throw new Error(response?.message || 'Unable to remove gift from wishlist');
                setIsWishlisted(false);
                alert('Removed from wishlist');
            } else {
                const response = await wishlistAPI.addToWishlist(id);
                if (!response?.success) throw new Error(response?.message || 'Unable to add gift to wishlist');
                setIsWishlisted(true);
                alert('Added to wishlist');
            }
        } catch (err) {
            console.error('Wishlist update error:', err);
            alert(err.message || 'Failed to update wishlist. Please try again.');
        } finally {
            setWishlistBusy(false);
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        navigate('/checkout');
    };

    const handleRelatedGiftAddToCart = (relatedGift) => {
        addToCart({
            id: relatedGift._id || relatedGift.id,
            name: relatedGift.name,
            price: relatedGift.price,
            discount: relatedGift.discount,
            discountType: relatedGift.discountType,
            image: relatedGift.heroImage || relatedGift.images?.[0] || null,
            category: relatedGift.category,
            sizeWeight: relatedGift.sizeWeight,
            sizeUnit: relatedGift.sizeUnit,
            quantity: 1
        });
    };

    const handleRelatedGiftWishlist = async (relatedGift) => {
        if (!isAuthenticated) {
            alert('Please login to manage your wishlist.');
            navigate('/login');
            return;
        }
        const giftId = relatedGift._id || relatedGift.id;
        if (!giftId) {
            alert('Invalid gift reference');
            return;
        }
        try {
            const response = await wishlistAPI.addToWishlist(giftId);
            if (response?.success) {
                alert('Added to wishlist!');
            } else {
                throw new Error(response?.message || 'Unable to add gift to wishlist');
            }
        } catch (err) {
            console.error('Related gift wishlist error:', err);
            alert(err.message || 'Failed to update wishlist.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black flex items-center justify-center text-red-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
                    <p className="text-xl text-red-200">Loading gift details...</p>
                </div>
            </div>
        );
    }

    if (error || !gift) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black flex items-center justify-center text-red-100">
                <div className="text-center max-w-md bg-black/70 border border-red-900/40 px-8 py-10 rounded-3xl shadow-[0_25px_45px_rgba(220,38,38,0.35)]">
                    <div className="text-6xl mb-4">🎁</div>
                    <h2 className="text-3xl font-bold text-white mb-3">We can’t find that gift</h2>
                    <p className="text-red-200/80 mb-6">{error || 'The gift you’re looking for doesn’t exist or has been archived.'}</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-500 transition-colors shadow-lg"
                    >
                        Browse all gifts
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black text-red-100">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-red-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wide"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="lg:sticky lg:top-6 space-y-4">
                        <motion.div
                            key={selectedImage}
                            className="aspect-square rounded-3xl bg-black/60 border border-red-900/40 overflow-hidden shadow-[0_35px_60px_rgba(220,38,38,0.25)] relative"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {galleryImages.length ? (
                                <img
                                    src={galleryImages[selectedImage]}
                                    alt={`${gift.name} - ${selectedImage + 1}`}
                                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 hover:scale-105"
                                    onClick={() => {
                                        setModalImageIndex(selectedImage);
                                        setShowImageModal(true);
                                    }}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getGiftGradient(gift.category || gift.name)}`}>
                                    <span className="text-7xl drop-shadow-lg">{getGiftBadge(gift.category || gift.name)}</span>
                                </div>
                            )}
                        </motion.div>

                        {galleryImages.length > 1 && (
                            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-3">
                                {galleryImages.map((image, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-xl overflow-hidden border transition-all duration-200 ${selectedImage === index
                                            ? 'border-red-500 ring-2 ring-red-300 scale-105 shadow-lg'
                                            : 'border-red-900/40 hover:border-red-500 hover:shadow-sm'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <img src={image} alt={`${gift.name} preview ${index + 1}`} className="w-full h-full object-cover" />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-5">
                        <section className="bg-black/60 border border-red-900/40 rounded-3xl p-6 sm:p-7 shadow-[0_35px_60px_rgba(220,38,38,0.25)]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{gift.name}</h1>
                                    {gift.hindiName && <p className="text-lg font-semibold text-red-300 mb-3">{gift.hindiName}</p>}
                                    <div className="flex items-center flex-wrap gap-3 text-sm">
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/30 text-red-200 uppercase tracking-widest border border-red-900/40">
                                            {gift.category || 'Gift Collection'}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <FaStar className="w-4 h-4 text-yellow-400" />
                                            <span className="font-semibold text-white">{gift.averageRating || gift.rating || 0}</span>
                                            <span className="text-red-200/70 text-xs">
                                                ({gift.totalReviews || gift.reviews?.length || 0} reviews)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleToggleWishlist}
                                        disabled={wishlistBusy}
                                        className={`p-2 rounded-lg transition-all duration-200 ${isWishlisted
                                            ? 'bg-red-600 text-white hover:bg-red-500'
                                            : 'bg-black/70 text-red-100 hover:bg-red-600/20 hover:text-white border border-red-900/40'
                                            } ${wishlistBusy ? 'opacity-70 cursor-wait' : 'hover:scale-105'}`}
                                        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                    >
                                        {wishlistBusy ? (
                                            <div className="w-5 h-5 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <FaHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                        )}
                                    </button>
                                    <button
                                        className="p-2 rounded-lg bg-black/70 text-red-100 border border-red-900/40 hover:bg-red-600/20 hover:text-white transition"
                                        title="Share"
                                    >
                                        <FaShare className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-5 border-t border-red-900/40 pt-4 flex items-center flex-wrap gap-3">
                                <span className="text-3xl sm:text-4xl font-bold text-white">{formattedPrice}</span>
                                {originalPrice && (
                                    <>
                                        <span className="text-lg sm:text-xl text-red-300 line-through">{originalPrice}</span>
                                        <span className="bg-red-600/30 text-red-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-red-900/40">
                                            {gift.discountType === 'percentage' ? `${gift.discount}% Off` : `₹${gift.discount} Off`}
                                        </span>
                                    </>
                                )}
                                {gift.deliveryDays && (
                                    <span className="ml-auto inline-flex items-center gap-2 text-xs uppercase tracking-wide text-red-200">
                                        <FaTruck className="w-4 h-4 text-red-400" />
                                        Dispatch in {gift.deliveryDays} days
                                    </span>
                                )}
                            </div>
                        </section>

                        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="bg-black/60 border border-red-900/40 rounded-2xl p-4">
                                <p className="text-xs uppercase tracking-wide text-red-300 mb-1">Curation Size</p>
                                <p className="text-sm font-semibold text-white">{gift.sizeWeight || 'Curated experience'} {gift.sizeUnit || ''}</p>
                            </div>
                            <div className="bg-black/60 border border-red-900/40 rounded-2xl p-4">
                                <p className="text-xs uppercase tracking-wide text-red-300 mb-1">Colour Story</p>
                                <p className="text-sm font-semibold text-white">{gift.color || 'Themed to your brief'}</p>
                            </div>
                            <div className="bg-black/60 border border-red-900/40 rounded-2xl p-4">
                                <p className="text-xs uppercase tracking-wide text-red-300 mb-1">Availability</p>
                                <p className="text-sm font-semibold text-white">{gift.stock ? `${gift.stock} ready` : 'Made-to-order'}</p>
                            </div>
                            {gift.origin && (
                                <div className="bg-black/60 border border-red-900/40 rounded-2xl p-4">
                                    <p className="text-xs uppercase tracking-wide text-red-300 mb-1">Sourced From</p>
                                    <p className="text-sm font-semibold text-white">{gift.origin}</p>
                                </div>
                            )}
                            {gift.certification && (
                                <div className="bg-black/60 border border-red-900/40 rounded-2xl p-4">
                                    <p className="text-xs uppercase tracking-wide text-red-300 mb-1">Certification</p>
                                    <p className="text-sm font-semibold text-white">{gift.certification}</p>
                                </div>
                            )}
                        </section>

                        {gift.description && (
                            <section className="bg-black/60 border border-red-900/40 rounded-3xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-3">About this gift</h3>
                                <p className="text-sm text-red-200/80 leading-relaxed">{gift.description}</p>
                            </section>
                        )}

                        {gift.benefits?.length > 0 && (
                            <section className="bg-black/60 border border-red-900/40 rounded-3xl p-6">
                                <button
                                    onClick={() => setShowAllBenefits(prev => !prev)}
                                    className="w-full flex items-center justify-between text-left"
                                >
                                    <h3 className="text-lg font-semibold text-white">Inside the story</h3>
                                    <span className="text-red-400 text-sm font-medium">
                                        {showAllBenefits ? 'Show less' : `Show all (${gift.benefits.length})`}
                                    </span>
                                </button>
                                <ul className="mt-4 space-y-2">
                                    {(showAllBenefits ? gift.benefits : gift.benefits.slice(0, 5)).map((benefit, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-red-200/85">
                                            <FaCheck className="w-4 h-4 text-red-500 mt-0.5" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {(gift.suitableFor?.length || gift.whomToUse?.length) && (
                            <section className="bg-black/60 border border-red-900/40 rounded-3xl p-6">
                                <button
                                    onClick={() => setShowAllSuitableFor(prev => !prev)}
                                    className="w-full flex items-center justify-between text-left"
                                >
                                    <h3 className="text-lg font-semibold text-white">Perfect for</h3>
                                    <span className="text-red-400 text-sm font-medium">
                                        {showAllSuitableFor ? 'Show less' : `Show all (${(gift.suitableFor || gift.whomToUse || []).length})`}
                                    </span>
                                </button>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {(showAllSuitableFor ? (gift.suitableFor || gift.whomToUse || []) : (gift.suitableFor || gift.whomToUse || []).slice(0, 6)).map((item, index) => (
                                        <span
                                            key={index}
                                            className="bg-red-600/25 border border-red-900/40 text-red-200 px-3 py-1.5 rounded-full text-xs uppercase tracking-wide"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {gift.seller && (
                            <section className="bg-gradient-to-r from-red-900/40 via-black to-red-900/40 border border-red-900/40 rounded-3xl p-6 shadow-[0_30px_55px_rgba(220,38,38,0.2)]">
                                <h3 className="text-lg font-semibold text-white mb-4">Curated by</h3>
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-white text-xl font-semibold">{gift.seller.shopName || gift.seller.fullName}</p>
                                        {gift.seller.shopName && <p className="text-sm text-red-200/80 mt-1">{gift.seller.fullName}</p>}
                                        {gift.seller.rating && (
                                            <div className="flex items-center gap-1 mt-2 text-sm text-red-200/80">
                                                <FaStar className="w-4 h-4 text-yellow-400" />
                                                <span className="font-semibold text-white">{gift.seller.rating}</span>
                                                <span className="text-xs">Seller rating</span>
                                            </div>
                                        )}
                                    </div>
                                    {gift.seller.isVerified && (
                                        <div className="bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                                            <FaCheck className="w-4 h-4" />
                                            Verified
                                        </div>
                                    )}
                                </div>
                                {gift.certification && (
                                    <div className="mt-4 pt-3 border-t border-red-900/40 text-sm text-red-200/80 flex items-center gap-2">
                                        <FaCertificate className="w-4 h-4 text-red-400" />
                                        <span>Certified: {gift.certification}</span>
                                    </div>
                                )}
                            </section>
                        )}

                        <section className="bg-black/60 border border-red-900/40 rounded-3xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-white uppercase tracking-wide">Quantity</span>
                                <div className="flex items-center bg-black/40 border-2 border-red-900/40 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="px-4 py-2 text-red-200 hover:text-white hover:bg-red-600/20 transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        –
                                    </button>
                                    <span className="px-5 py-2 border-x border-red-900/40 min-w-[3.1rem] text-center text-lg font-bold text-white">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="px-4 py-2 text-red-200 hover:text-white hover:bg-red-600/20 transition-colors"
                                        disabled={gift.stock && quantity >= gift.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!gift.availability || addingToCart}
                                    className={`flex-1 py-3.5 px-6 rounded-full font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${gift.availability && !addingToCart
                                        ? 'bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_25px_45px_rgba(220,38,38,0.35)] transform hover:scale-[1.02]'
                                        : 'bg-gray-700/60 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <FaShoppingCart className="w-5 h-5" />
                                    <span>{addingToCart ? 'Adding...' : gift.availability ? 'Add to cart' : 'Out of stock'}</span>
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={!gift.availability || addingToCart}
                                    className={`flex-1 sm:flex-none py-3.5 px-6 rounded-full font-semibold text-base transition-all duration-200 shadow-lg ${gift.availability && !addingToCart
                                        ? 'bg-white text-gray-900 hover:bg-gray-200 hover:shadow-[0_25px_45px_rgba(255,255,255,0.35)] transform hover:scale-[1.02]'
                                        : 'bg-gray-700/60 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Buy now
                                </button>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/60 border border-red-900/40 rounded-3xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-600/25 p-2 rounded-lg">
                                    <FaTruck className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-white">Express dispatch</h4>
                                    <p className="text-xs text-red-200/80">Priority delivery options across metros</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-red-600/25 p-2 rounded-lg">
                                    <FaCheck className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-white">Hand-curated</h4>
                                    <p className="text-xs text-red-200/80">Sourced from trusted stylists & artisans</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-red-600/25 p-2 rounded-lg">
                                    <FaCertificate className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-white">Quality assured</h4>
                                    <p className="text-xs text-red-200/80">Every box is inspected before dispatch</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {reviews.length > 0 && (
                    <section className="mt-12 bg-black/60 border border-red-900/40 rounded-3xl p-6 shadow-[0_35px_60px_rgba(220,38,38,0.2)]">
                        <h3 className="text-2xl font-bold text-white mb-6">Loved by our gifting community</h3>
                        <div className="space-y-5">
                            {reviews.slice(0, 5).map((review, index) => (
                                <motion.div
                                    key={review._id || review.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="pb-5 border-b border-red-900/40 last:pb-0 last:border-none"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 bg-red-600/30 border border-red-900/40 rounded-full flex items-center justify-center text-red-200 font-semibold">
                                            {(review.user?.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-white">{review.user?.name || 'Anonymous'}</p>
                                            <p className="text-xs text-red-200/70">
                                                {new Date(review.createdAt || review.date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={`w-4 h-4 ${star <= (review.rating || 5) ? 'text-yellow-400' : 'text-gray-700'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-red-200/85 leading-relaxed">{review.comment || review.review}</p>
                                </motion.div>
                            ))}
                        </div>
                        {reviews.length > 5 && (
                            <button
                                onClick={() => navigate(`/gift/${id}/reviews`)}
                                className="mt-4 text-red-400 hover:text-red-300 font-medium text-sm"
                            >
                                View all {reviews.length} stories →
                            </button>
                        )}
                    </section>
                )}

                {loadingReviews && reviews.length === 0 && (
                    <div className="mt-10 bg-black/60 border border-red-900/40 rounded-3xl p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4" />
                        <p className="text-red-200/80 text-sm">Loading community stories…</p>
                    </div>
                )}

                {relatedGifts.length > 0 && (
                    <section className="mt-14">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">Pairs beautifully with</h2>
                            <button
                                onClick={() => navigate('/shop')}
                                className="text-red-400 hover:text-red-300 font-medium text-sm flex items-center gap-2"
                            >
                                Explore more
                                <FaArrowLeft className="w-4 h-4 rotate-180" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {relatedGifts.map((relatedGift) => (
                                <GiftCard
                                    key={relatedGift._id || relatedGift.id}
                                    gift={relatedGift}
                                    onAddToCart={handleRelatedGiftAddToCart}
                                    onToggleWishlist={handleRelatedGiftWishlist}
                                    isWishlisted={false}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <AnimatePresence>
                {showImageModal && galleryImages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowImageModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/70 rounded-full p-3 backdrop-blur-sm shadow-lg"
                                aria-label="Close"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <motion.div
                                key={modalImageIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-full h-[65vh] flex items-center justify-center mb-4"
                            >
                                <img
                                    src={galleryImages[modalImageIndex]}
                                    alt={`${gift.name} - Image ${modalImageIndex + 1}`}
                                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                                />
                            </motion.div>

                            {galleryImages.length > 1 && (
                                <>
                                    <div className="flex gap-2 overflow-x-auto pb-2 max-w-full px-2">
                                        {galleryImages.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setModalImageIndex(index)}
                                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${modalImageIndex === index
                                                    ? 'border-red-500 ring-2 ring-red-300 scale-110'
                                                    : 'border-gray-600 hover:border-gray-400'
                                                    }`}
                                            >
                                                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setModalImageIndex(modalImageIndex === 0 ? galleryImages.length - 1 : modalImageIndex - 1)}
                                        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all"
                                        aria-label="Previous image"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setModalImageIndex((modalImageIndex + 1) % galleryImages.length)}
                                        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all"
                                        aria-label="Next image"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-1.5 rounded-full text-xs">
                                        {modalImageIndex + 1} / {galleryImages.length}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GiftDetail;

