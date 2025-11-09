import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { giftAPI, authAPI } from '../services/api';
import giftCollections from '../data/giftCollections';
import uploadFileToCloudinary from './uploadfunctionnew';

const defaultForm = {
    name: '',
    hindiName: '',
    planet: '',
    planetHindi: '',
    color: '',
    description: '',
    benefits: [],
    suitableFor: [],
    price: '',
    discount: 0,
    discountType: 'percentage',
    sizeWeight: '',
    sizeUnit: 'carat',
    stock: '',
    availability: true,
    certification: '',
    origin: '',
    deliveryDays: '',
    heroImage: '',
    additionalImages: []
};

const planets = [
    { english: 'Sun (Surya)', hindi: 'सूर्य ग्रह' },
    { english: 'Moon (Chandra)', hindi: 'चंद्र ग्रह' },
    { english: 'Mars (Mangal)', hindi: 'मंगल ग्रह' },
    { english: 'Mercury (Budh)', hindi: 'बुध ग्रह' },
    { english: 'Jupiter (Guru)', hindi: 'गुरु ग्रह' },
    { english: 'Venus (Shukra)', hindi: 'शुक्र ग्रह' },
    { english: 'Saturn (Shani)', hindi: 'शनि ग्रह' },
    { english: 'Rahu', hindi: 'राहु' },
    { english: 'Ketu', hindi: 'केतु' }
];

const benefitLibrary = [
    'Keepsake worthy packaging',
    'Custom message support',
    'Curated treats and snacks',
    'Same-day dispatch available',
    'Fully customisable experience',
    'Eco-conscious materials',
    'Perfect for midnight surprises',
    'Handwritten note included',
    'Corporate branding ready',
    'Photo-ready presentation',
];

const recipientLibrary = [
    'Partners', 'Spouses', 'Best friends', 'Parents', 'Colleagues',
    'Kids (4-6)', 'Kids (7-9)', 'Kids (10-12)', 'Clients', 'Team celebrations'
];

const AddGift = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(defaultForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!authAPI.isAuthenticated() || currentUser?.role !== 'seller') {
            navigate('/login');
        }
    }, [navigate]);

    const applyTemplate = (selected) => {
        const template = giftCollections.find(item => item.name === selected);
        if (!template) return;

        setFormData(prev => ({
            ...prev,
            name: template.name,
            hindiName: template.hindiName || '',
            planet: template.planet || '',
            planetHindi: template.planetHindi || '',
            color: template.color || '',
            description: template.description || '',
            benefits: template.benefits || [],
            suitableFor: template.suitableFor || template.bestFor || []
        }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
                    ? [...prev[name], value]
                    : prev[name].filter(item => item !== value)
            }));
        } else if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? '' : Number(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

            if (name === 'name') {
                applyTemplate(value);
            }

            if (name === 'planet') {
                const planet = planets.find(p => p.english === value);
                if (planet) {
                    setFormData(prev => ({
                        ...prev,
                        planetHindi: planet.hindi
                    }));
                }
            }
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageUpload = async (event, type = 'additional') => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;

        setIsSubmitting(true);
        try {
            for (const file of files) {
                const mockEvent = { target: { files: [file] } };
                const url = await uploadFileToCloudinary(mockEvent);
                if (!url) throw new Error('Upload failed');

                setFormData(prev => ({
                    ...prev,
                    heroImage: type === 'hero' ? url : prev.heroImage,
                    additionalImages: type === 'additional'
                        ? [...prev.additionalImages, url]
                        : prev.additionalImages
                }));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                imageUpload: error.message || 'Failed to upload image, please try again.'
            }));
        } finally {
            setIsSubmitting(false);
            event.target.value = '';
        }
    };

    const validate = () => {
        const nextErrors = {};
        if (!formData.name.trim()) nextErrors.name = 'Gift name is required';
        if (!formData.description.trim()) nextErrors.description = 'Description is required';
        if (!formData.price || formData.price <= 0) nextErrors.price = 'Price must be greater than zero';
        if (!formData.sizeWeight || formData.sizeWeight <= 0) nextErrors.sizeWeight = 'Provide weight/volume';
        if (!formData.deliveryDays || formData.deliveryDays <= 0) nextErrors.deliveryDays = 'Delivery days required';
        if (!formData.heroImage) nextErrors.heroImage = 'Highlight image required';

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setSuccessMessage('');

        try {
            const response = await giftAPI.addGift({
                ...formData,
                price: Number(formData.price),
                discount: Number(formData.discount) || 0,
                sizeWeight: Number(formData.sizeWeight),
                stock: formData.stock ? Number(formData.stock) : null,
                deliveryDays: Number(formData.deliveryDays)
            });

            if (response.success) {
                setSuccessMessage('Gift added successfully!');
                setFormData(defaultForm);
            }
        } catch (error) {
            setErrors({ submit: error.message || 'Failed to add gift. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black py-10 px-4 sm:px-6 lg:px-12 text-red-100">
            <div className="max-w-6xl mx-auto">
                <div className="bg-black/70 border border-red-900/40 shadow-[0_25px_45px_rgba(220,38,38,0.25)] rounded-3xl overflow-hidden">
                    <div className="bg-gradient-to-r from-red-900 via-black to-red-700 px-6 py-8 text-center space-y-3">
                        <p className="text-xs tracking-[0.5em] text-red-300 uppercase">Seller Studio</p>
                        <h1 className="text-3xl sm:text-4xl font-black text-white">Add a Signature Gift</h1>
                        <p className="text-red-200/80">
                            Build your listing with rich storytelling, premium pricing, and curated imagery.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-10">
                        {successMessage && (
                            <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg">
                                {successMessage}
                            </div>
                        )}
                        {errors.submit && (
                            <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg">
                                {errors.submit}
                            </div>
                        )}

                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-white uppercase tracking-wide">Basic Details</h2>
                                <span className="text-xs text-red-300">Fields marked * are mandatory</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Gift Template *
                                    </label>
                                    <select
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.name ? 'border-red-500' : 'border-red-900/50'}`}
                                    >
                                        <option value="">Select a template</option>
                                        {giftCollections.map((gift) => (
                                            <option key={gift.id} value={gift.name}>
                                                {gift.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Hindi Name (auto-filled)
                                    </label>
                                    <input
                                        name="hindiName"
                                        value={formData.hindiName}
                                        readOnly
                                        className="w-full px-3 py-2 border border-red-900/50 rounded-md bg-black/40 text-white"
                                        placeholder="Will auto-fill from template"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Theme Colour
                                    </label>
                                    <input
                                        name="color"
                                        value={formData.color}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-red-900/50 rounded-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="e.g. Black & Gold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Linked Planet (optional)
                                    </label>
                                    <select
                                        name="planet"
                                        value={formData.planet}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-red-900/50 rounded-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="">Not linked</option>
                                        {planets.map((planet) => (
                                            <option key={planet.english} value={planet.english}>
                                                {planet.english}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Planet (Hindi, auto-filled)
                                    </label>
                                    <input
                                        name="planetHindi"
                                        value={formData.planetHindi}
                                        readOnly
                                        className="w-full px-3 py-2 border border-red-900/50 rounded-md bg-black/40 text-white"
                                        placeholder="Auto-filled"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-red-200 mb-2">
                                    Story / Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={`w-full px-3 py-2 border rounded-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.description ? 'border-red-500' : 'border-red-900/50'}`}
                                    placeholder="Describe the experience, packaging and highlights buyers should expect."
                                />
                                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-semibold text-white uppercase tracking-wide">Benefits & Recipients</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <div>
                                    <p className="text-sm text-red-200 mb-2">Benefits *</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {benefitLibrary.map((benefit) => (
                                            <label key={benefit} className="flex items-center space-x-2 text-sm text-red-200">
                                                <input
                                                    type="checkbox"
                                                    name="benefits"
                                                    value={benefit}
                                                    checked={formData.benefits.includes(benefit)}
                                                    onChange={handleInputChange}
                                                    className="rounded border-red-900/50 bg-black text-red-500 focus:ring-red-500"
                                                />
                                                <span>{benefit}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.benefits && <p className="text-red-400 text-sm mt-1">{errors.benefits}</p>}
                                </div>
                                <div>
                                    <p className="text-sm text-red-200 mb-2">Perfect For</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {recipientLibrary.map((recipient) => (
                                            <label key={recipient} className="flex items-center space-x-2 text-sm text-red-200">
                                                <input
                                                    type="checkbox"
                                                    name="suitableFor"
                                                    value={recipient}
                                                    checked={formData.suitableFor.includes(recipient)}
                                                    onChange={handleInputChange}
                                                    className="rounded border-red-900/50 bg-black text-red-500 focus:ring-red-500"
                                                />
                                                <span>{recipient}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.suitableFor && <p className="text-red-400 text-sm mt-1">{errors.suitableFor}</p>}
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-semibold text-white uppercase tracking-wide">Pricing & Inventory</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.price ? 'border-red-500' : 'border-red-900/50'}`}
                                        placeholder="2500"
                                    />
                                    {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Weight / Volume (e.g., 1.5, 500g) *
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="number"
                                            name="sizeWeight"
                                            value={formData.sizeWeight}
                                            onChange={handleInputChange}
                                            className={`flex-1 px-3 py-2 border rounded-l-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.sizeWeight ? 'border-red-500' : 'border-red-900/50'}`}
                                            placeholder="e.g. 1.5"
                                        />
                                        <select
                                            name="sizeUnit"
                                            value={formData.sizeUnit}
                                            onChange={handleInputChange}
                                            className="px-3 py-2 border border-red-900/50 rounded-r-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <option value="carat">Carat</option>
                                            <option value="gram">Gram</option>
                                            <option value="ml">ml</option>
                                        </select>
                                    </div>
                                    {errors.sizeWeight && <p className="text-red-400 text-sm mt-1">{errors.sizeWeight}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Discount
                                    </label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-red-900/50 rounded-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Discount Type
                                    </label>
                                    <select
                                        name="discountType"
                                        value={formData.discountType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-red-900/50 rounded-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Flat Amount (₹)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Stock Count
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-red-900/50 rounded-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Dispatch/Delivery Window (days) *
                                    </label>
                                    <input
                                        type="number"
                                        name="deliveryDays"
                                        value={formData.deliveryDays}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.deliveryDays ? 'border-red-500' : 'border-red-900/50'}`}
                                        placeholder="3"
                                    />
                                    {errors.deliveryDays && <p className="text-red-400 text-sm mt-1">{errors.deliveryDays}</p>}
                                </div>
                            </div>

                            <label className="inline-flex items-center space-x-2 text-sm text-red-200">
                                <input
                                    type="checkbox"
                                    name="availability"
                                    checked={formData.availability}
                                    onChange={handleInputChange}
                                    className="rounded border-red-900/50 bg-black text-red-500 focus:ring-red-500"
                                />
                                <span>Gift is currently available</span>
                            </label>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-semibold text-white uppercase tracking-wide">Imagery</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <div>
                                    <p className="text-sm font-medium text-red-200 mb-2">Highlight Image *</p>
                                    <div className="border-2 border-dashed border-red-900/50 rounded-lg p-6 text-center bg-black/40">
                                        <input
                                            id="highlight-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'hero')}
                                            className="hidden"
                                            disabled={isSubmitting}
                                        />
                                        <label
                                            htmlFor="highlight-upload"
                                            className={`flex flex-col items-center space-y-2 text-red-200 cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5 5 5M12 5v12" />
                                            </svg>
                                            <span>Click to upload highlight image</span>
                                            <span className="text-xs text-red-300">PNG or JPG up to 5MB</span>
                                        </label>
                                    </div>
                                    {formData.heroImage && (
                                        <div className="mt-4">
                                            <img src={formData.heroImage} alt="Highlight" className="w-36 h-36 object-cover rounded-lg border border-red-900/50" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, heroImage: '' }))}
                                                className="mt-2 text-red-400 hover:text-red-200 text-sm"
                                            >
                                                Remove image
                                            </button>
                                        </div>
                                    )}
                                    {errors.heroImage && <p className="text-red-400 text-sm mt-1">{errors.heroImage}</p>}
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-red-200 mb-2">Lifestyle Shots (optional)</p>
                                    <div className="border-2 border-dashed border-red-900/50 rounded-lg p-6 text-center bg-black/40">
                                        <input
                                            id="gallery-upload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'additional')}
                                            className="hidden"
                                            disabled={isSubmitting}
                                        />
                                        <label
                                            htmlFor="gallery-upload"
                                            className={`flex flex-col items-center space-y-2 text-red-200 cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5 5 5M12 5v12" />
                                            </svg>
                                            <span>Upload additional gallery images</span>
                                            <span className="text-xs text-red-300">PNG or JPG up to 5MB each</span>
                                        </label>
                                    </div>
                                    {formData.additionalImages.length > 0 && (
                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            {formData.additionalImages.map((img, index) => (
                                                <div key={img} className="relative group">
                                                    <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-24 object-cover rounded-lg border border-red-900/50" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            additionalImages: prev.additionalImages.filter((_, idx) => idx !== index)
                                                        }))}
                                                        className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.imageUpload && <p className="text-red-400 text-sm mt-2">{errors.imageUpload}</p>}
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-semibold text-white uppercase tracking-wide">Proof & Origin</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Certification / Authenticity
                                    </label>
                                    <input
                                        name="certification"
                                        value={formData.certification}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.certification ? 'border-red-500' : 'border-red-900/50'}`}
                                        placeholder="e.g. Curated & quality checked"
                                    />
                                    {errors.certification && <p className="text-red-400 text-sm mt-1">{errors.certification}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Source / Origin
                                    </label>
                                    <input
                                        name="origin"
                                        value={formData.origin}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.origin ? 'border-red-500' : 'border-red-900/50'}`}
                                        placeholder="e.g. Mumbai studio"
                                    />
                                    {errors.origin && <p className="text-red-400 text-sm mt-1">{errors.origin}</p>}
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-8 py-3 rounded-full font-semibold text-white transition-all ${isSubmitting
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-500 shadow-[0_20px_40px_rgba(220,38,38,0.35)] focus:outline-none focus:ring-2 focus:ring-red-500'
                                    }`}
                            >
                                {isSubmitting ? 'Saving Gift...' : 'Save Gift'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddGift;

