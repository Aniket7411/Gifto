import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const SellerDetails = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSellerDetails = async () => {
            if (!sellerId) {
                setError('No seller ID provided');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                // Call API to get seller details
                const response = await adminAPI.getSellerById(sellerId);

                if (response.success && response.seller) {
                    setSeller(response.seller);

                    // Gifts are inside the seller object
                    if (response.seller.gifts && Array.isArray(response.seller.gifts)) {
                        setGifts(response.seller.gifts);
                    } else if (response.gifts && Array.isArray(response.gifts)) {
                        setGifts(response.gifts);
                    } else if (response.data?.gifts && Array.isArray(response.data.gifts)) {
                        setGifts(response.data.gifts);
                    } else {
                        setGifts([]);
                    }
                } else {
                    setError(response.message || 'Failed to fetch seller details');
                    setSeller(null);
                    setGifts([]);
                }
            } catch (error) {
                console.error('Error fetching seller details:', error);
                setError(error.message || 'Error loading seller details');
                setSeller(null);
                setGifts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerDetails();
    }, [sellerId]);

    const handleApprove = async () => {
        if (!window.confirm('Are you sure you want to approve this seller?')) return;

        try {
            const response = await adminAPI.updateSellerStatus(sellerId, 'approved');
            if (response.success) {
                alert('Seller approved successfully!');
                setSeller({ ...seller, status: 'approved', isVerified: true });
            }
        } catch (error) {
            alert(error.message || 'Failed to approve seller');
        }
    };

    const handleSuspend = async () => {
        if (!window.confirm('Are you sure you want to suspend this seller?')) return;

        try {
            const response = await adminAPI.updateSellerStatus(sellerId, 'suspended');
            if (response.success) {
                alert('Seller suspended successfully!');
                setSeller({ ...seller, status: 'suspended' });
            }
        } catch (error) {
            alert(error.message || 'Failed to suspend seller');
        }
    };

    const handleReject = async () => {
        if (!window.confirm('Are you sure you want to reject this seller?')) return;

        try {
            const response = await adminAPI.updateSellerStatus(sellerId, 'rejected');
            if (response.success) {
                alert('Seller rejected successfully!');
                setSeller({ ...seller, status: 'rejected' });
            }
        } catch (error) {
            alert(error.message || 'Failed to reject seller');
        }
    };

    const handleReactivate = async () => {
        if (!window.confirm('Are you sure you want to reactivate this seller?')) return;

        try {
            const response = await adminAPI.updateSellerStatus(sellerId, 'approved');
            if (response.success) {
                alert('Seller reactivated successfully!');
                setSeller({ ...seller, status: 'approved', isVerified: true, suspendedAt: null });
            }
        } catch (error) {
            alert(error.message || 'Failed to reactivate seller');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('⚠️ WARNING: Are you sure you want to DELETE this seller?\n\nThis will:\n- Delete the seller account\n- Delete all their gifts\n- This action CANNOT be undone!\n\nType YES to confirm.')) return;

        const confirmation = prompt('Please type "DELETE" to confirm deletion:');
        if (confirmation !== 'DELETE') {
            alert('Deletion cancelled');
            return;
        }

        try {
            const response = await adminAPI.deleteSeller(sellerId);
            if (response.success) {
                alert('Seller deleted successfully!');
                navigate('/admin/sellers');
            }
        } catch (error) {
            alert(error.message || 'Failed to delete seller');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading seller details...</p>
                </div>
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {error || 'Seller not found'}
                    </h2>
                    <p className="text-gray-600 mb-4">Unable to load seller details</p>
                    <button
                        onClick={() => navigate('/admin/sellers')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Back to Sellers
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/admin/sellers')}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 mb-4"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Sellers
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{seller.fullName || seller.name || 'N/A'}</h1>
                            <p className="text-gray-600 mt-2">{seller.shopName || 'N/A'}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {seller.shopType && <span className="mr-3">🏪 {seller.shopType}</span>}
                                {seller.yearEstablished && <span>📅 Est. {seller.yearEstablished}</span>}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${seller.status === 'approved' ? 'bg-green-100 text-green-800' :
                                seller.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                    seller.status === 'rejected' ? 'bg-gray-100 text-gray-800' :
                                        'bg-yellow-100 text-yellow-800'
                                }`}>
                                {seller.status
                                    ? seller.status.charAt(0).toUpperCase() + seller.status.slice(1)
                                    : seller.isVerified ? 'Verified' : 'Pending'}
                            </span>
                            {seller.suspendedAt && (
                                <span className="text-xs text-red-600">
                                    Suspended on {new Date(seller.suspendedAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Seller Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <p className="mt-1 text-sm text-gray-900">{seller.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <p className="mt-1 text-sm text-gray-900">{seller.phone || 'N/A'}</p>
                                </div>
                                {seller.alternatePhone && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Alternate Phone</label>
                                        <p className="mt-1 text-sm text-gray-900">{seller.alternatePhone}</p>
                                    </div>
                                )}
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Address</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {seller.address
                                            ? (typeof seller.address === 'string'
                                                ? seller.address
                                                : `${seller.address.street || ''}, ${seller.address.city || ''}, ${seller.address.state || ''} - ${seller.address.pincode || ''}`.trim()
                                            )
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Business Details */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {seller.businessType && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Business Type</label>
                                        <p className="mt-1 text-sm text-gray-900">{seller.businessType}</p>
                                    </div>
                                )}
                                {seller.gstNumber && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">GST Number</label>
                                        <p className="mt-1 text-sm text-gray-900 font-mono">{seller.gstNumber}</p>
                                    </div>
                                )}
                                {seller.panNumber && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">PAN Number</label>
                                        <p className="mt-1 text-sm text-gray-900 font-mono">{seller.panNumber}</p>
                                    </div>
                                )}
                                {seller.aadharNumber && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Aadhar Number</label>
                                        <p className="mt-1 text-sm text-gray-900 font-mono">{seller.aadharNumber}</p>
                                    </div>
                                )}
                                {(seller.giftTypes && seller.giftTypes.length > 0) || (seller.gemTypes && seller.gemTypes.length > 0) ? (
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-500">Gift Specialities</label>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {(seller.giftTypes || seller.gemTypes).map((type, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                                {seller.specialization && seller.specialization.length > 0 && (
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-500">Specialization</label>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {seller.specialization.map((spec, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bank Details */}
                        {seller.accountNumber && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Account Holder</label>
                                        <p className="mt-1 text-sm text-gray-900">{seller.accountHolderName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Bank Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{seller.bankName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Account Number</label>
                                        <p className="mt-1 text-sm text-gray-900 font-mono">{seller.accountNumber}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">IFSC Code</label>
                                        <p className="mt-1 text-sm text-gray-900 font-mono">{seller.ifscCode || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Gifts List */}
                        <div className="bg-black/60 border border-red-900/40 rounded-2xl shadow-[0_20px_35px_rgba(220,38,38,0.2)] p-6 text-red-100">
                            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">
                                Listed Gifts ({gifts.length})
                            </h3>
                            {gifts.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No gifts listed yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {gifts.map((gift) => (
                                        <div key={gift._id || gift.id} className="flex items-center justify-between p-4 border border-red-900/40 rounded-xl bg-black/40 hover:bg-red-600/10 hover:shadow-[0_15px_30px_rgba(220,38,38,0.2)] transition-all group cursor-pointer"
                                            onClick={() => navigate(`/gift/${gift._id || gift.id}`)}>
                                            <div className="flex items-center flex-1 gap-4">
                                                {gift.images && gift.images[0] ? (
                                                    <img
                                                        src={gift.images[0]}
                                                        alt={gift.name}
                                                        className="w-16 h-16 rounded-lg object-cover border border-red-900/40 group-hover:ring-2 group-hover:ring-red-500 transition-all"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-red-600/30 border border-red-900/40 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                                        {(gift.name || 'NA').split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-semibold text-white group-hover:text-red-200 transition-colors">
                                                        {gift.name || 'N/A'}
                                                    </h4>
                                                    <p className="text-xs uppercase tracking-wide text-red-300 font-medium">{gift.category || 'N/A'}</p>
                                                    <p className="text-xs text-red-200/80">
                                                        {gift.sizeWeight} {gift.sizeUnit} • Stock: {gift.stock || 0}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-white">₹{(gift.price || 0).toLocaleString()}</p>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gift.stock > 5 ? 'bg-green-500/20 text-green-200' :
                                                        gift.stock > 0 ? 'bg-amber-500/20 text-amber-200' :
                                                            'bg-red-500/20 text-red-200'
                                                        }`}>
                                                        {gift.stock > 5 ? `In Stock (${gift.stock})` :
                                                            gift.stock > 0 ? `Low (${gift.stock})` :
                                                                'Out of Stock'}
                                                    </span>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-500 shadow-lg">
                                                        View →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Seller Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Rating</span>
                                    <span className="text-sm font-medium text-gray-900">{seller.rating || 'N/A'}/5.0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Total Sales</span>
                                    <span className="text-sm font-medium text-gray-900">{seller.totalSales || seller.totalOrders || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Member Since</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {seller.joinDate || seller.createdAt
                                            ? new Date(seller.joinDate || seller.createdAt).toLocaleDateString()
                                            : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Gifts Listed</span>
                                    <span className="text-sm font-medium text-gray-900">{seller.stats?.totalGifts || gifts.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Total Orders</span>
                                    <span className="text-sm font-medium text-gray-900">{seller.stats?.totalOrders || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Total Revenue</span>
                                    <span className="text-sm font-medium text-gray-900">₹{(seller.stats?.totalRevenue || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                            <div className="space-y-3">
                                {seller.status !== 'approved' && (
                                    <button
                                        onClick={() => handleApprove()}
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-150 font-medium"
                                    >
                                        ✓ Approve Seller
                                    </button>
                                )}

                                {seller.status === 'suspended' ? (
                                    <button
                                        onClick={() => handleReactivate()}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium"
                                    >
                                        🔄 Reactivate Account
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleSuspend()}
                                        disabled={seller.status === 'rejected'}
                                        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ⏸️ Suspend Account
                                    </button>
                                )}

                                {seller.status === 'pending' && (
                                    <button
                                        onClick={() => handleReject()}
                                        className="w-full border border-red-300 text-red-700 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors duration-150 font-medium"
                                    >
                                        ✕ Reject Application
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete()}
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-150 font-medium"
                                >
                                    🗑️ Delete Seller
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDetails;