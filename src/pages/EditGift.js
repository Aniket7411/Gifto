import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { giftAPI, authAPI } from '../services/api';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

const recipientCategories = [
    'Birthday', 'First Meeting', 'Romance', 'Best Friend', 'Office Triumph',
    'Wedding', 'Return Favour', 'After Marriage', 'Kids - Boys', 'Kids - Girls', 'Custom Story'
];

const EditGift = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [gift, setGift] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        discount: 0,
        discountType: 'percentage',
        sizeWeight: '',
        sizeUnit: 'carat',
        stock: '',
        origin: '',
        certification: '',
        availability: true
    });

    useEffect(() => {
        if (!authAPI.isAuthenticated()) {
            navigate('/login');
            return;
        }
        const currentUser = authAPI.getCurrentUser();
        if (currentUser?.role !== 'seller') {
            navigate('/');
            return;
        }
        loadGift();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadGift = async () => {
        try {
            setLoading(true);
            const response = await giftAPI.getGiftById(id);
            if (response.success) {
                const payload = response.data || response.gift;
                setGift({
                    name: payload.name || '',
                    category: payload.category || '',
                    description: payload.description || '',
                    price: payload.price || '',
                    discount: payload.discount || 0,
                    discountType: payload.discountType || 'percentage',
                    sizeWeight: payload.sizeWeight || '',
                    sizeUnit: payload.sizeUnit || 'carat',
                    stock: payload.stock ?? '',
                    origin: payload.origin || '',
                    certification: payload.certification || '',
                    availability: payload.availability ?? true
                });
            } else {
                setError(response.message || 'Unable to load gift details');
            }
        } catch (err) {
            setError(err.message || 'Failed to load gift details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === 'checkbox') {
            setGift(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setGift(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
        } else {
            setGift(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!gift.name.trim() || !gift.category || !gift.price) {
            setError('Please fill all required fields.');
            return;
        }

        setSaving(true);
        setError('');
        try {
            const response = await giftAPI.updateGift(id, {
                ...gift,
                price: Number(gift.price),
                discount: Number(gift.discount) || 0,
                sizeWeight: gift.sizeWeight === '' ? '' : Number(gift.sizeWeight),
                stock: gift.stock === '' ? null : Number(gift.stock)
            });

            if (response.success) {
                navigate('/seller-dashboard');
            } else {
                setError(response.message || 'Unable to save changes');
            }
        } catch (err) {
            setError(err.message || 'Unable to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black flex items-center justify-center text-red-100">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
                    <p className="text-lg">Fetching gift details…</p>
                </div>
            </div>
        );
    }

    if (error && !saving && !gift.name) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black flex items-center justify-center text-red-100">
                <div className="text-center space-y-6 max-w-md">
                    <div className="text-5xl">⚠️</div>
                    <h2 className="text-2xl font-bold text-white">Unable to load gift</h2>
                    <p className="text-red-200/80">{error}</p>
                    <button
                        onClick={() => navigate('/seller-dashboard')}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
                    >
                        Back to dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black py-10 px-4 sm:px-6 lg:px-12 text-red-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/seller-dashboard')}
                        className="inline-flex items-center gap-2 text-red-300 hover:text-white transition-colors"
                    >
                        <FaArrowLeft />
                        <span>Back to seller dashboard</span>
                    </button>
                    <span className="text-xs tracking-[0.3em] uppercase text-red-400">Gift Editor</span>
                </div>

                <div className="bg-black/70 border border-red-900/40 rounded-3xl shadow-[0_25px_45px_rgba(220,38,38,0.25)] p-8">
                    <h1 className="text-3xl font-bold text-white mb-6">Edit Gift Experience</h1>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-red-200 mb-2">
                                    Gift Name *
                                </label>
                                <input
                                    name="name"
                                    value={gift.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-red-900/50 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Midnight Birthday Spark Box"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-red-200 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={gift.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-red-900/50 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="">Select category</option>
                                    {recipientCategories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-red-200 mb-2">
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={gift.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-red-900/50 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-red-200 mb-2">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={gift.stock}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-red-900/50 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    min="0"
                                    step="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-red-200 mb-2">
                                    Discount
                                </label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={gift.discount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-red-900/50 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-red-200 mb-2">
                                    Discount Type
                                </label>
                                <select
                                    name="discountType"
                                    value={gift.discountType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-red-900/50 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Flat amount (₹)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-red-200 mb-2">
                                    Weight / Volume
                                </label>
                                <input
                                    type="number"
                                    name="sizeWeight"
                                    value={gift.sizeWeight}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-red-900/50 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-red-200 mb-2">
                                    Unit
                                </label>
                                <select
                                    name="sizeUnit"
                                    value={gift.sizeUnit}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-red-900/50 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="carat">Carat</option>
                                    <option value="gram">Gram</option>
                                    <option value="ml">ml</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-red-200 mb-2">
                                    Origin / Source
                                </label>
                                <input
                                    name="origin"
                                    value={gift.origin}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-red-900/50 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Mumbai studio, Jaipur artisans…"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-red-200 mb-2">
                                    Certification / Guarantee
                                </label>
                                <input
                                    name="certification"
                                    value={gift.certification}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-red-900/50 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Curated & quality checked"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-red-200 mb-2">
                                Experience Description
                            </label>
                            <textarea
                                name="description"
                                value={gift.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-red-900/50 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Share what the recipient can expect when unboxing this gift."
                            />
                        </div>

                        <label className="inline-flex items-center gap-2 text-sm text-red-200">
                            <input
                                type="checkbox"
                                name="availability"
                                checked={gift.availability}
                                onChange={handleChange}
                                className="rounded border-red-900/50 bg-black text-red-500 focus:ring-red-500"
                            />
                            <span>Gift listing is active</span>
                        </label>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/seller-dashboard')}
                                className="px-6 py-3 rounded-full border border-red-900/50 text-red-200 hover:bg-red-600/20 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_40px_rgba(220,38,38,0.35)]"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Saving…</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditGift;

