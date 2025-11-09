import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { otpAPI } from '../services/api';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, clearCart, getCartSummary } = useCart();
    const { isAuthenticated } = useAuth();

    const [showOTPModal, setShowOTPModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const cartSummary = getCartSummary();

    const handleQuantityChange = (giftId, newQuantity) => {
        updateQuantity(giftId, newQuantity);
    };

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            setShowOTPModal(true);
        }
    };

    const handleSendOTP = async () => {
        if (!phoneNumber.trim() || phoneNumber.length < 10) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        setOtpLoading(true);
        try {
            const response = await otpAPI.sendOTP(phoneNumber);
            if (response.success) {
                setOtpSent(true);
                alert('OTP sent to your phone number');
            } else {
                alert(response.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert(error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp.trim() || otp.length !== 6) {
            alert('Please enter the 6-digit OTP');
            return;
        }

        setOtpLoading(true);
        try {
            const response = await otpAPI.verifyOTP(phoneNumber, otp);
            if (response.success) {
                // Store temporary guest session
                localStorage.setItem('guestPhone', phoneNumber);
                setShowOTPModal(false);
                setPhoneNumber('');
                setOtp('');
                setOtpSent(false);
                navigate('/checkout');
            } else {
                alert(response.message || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert(error.message || 'Invalid OTP. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black py-16 text-red-100">
                <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
                    <div className="text-6xl mb-2">🛍️</div>
                    <h2 className="text-3xl font-bold text-white">Your cart is waiting for a story</h2>
                    <p className="text-red-200/80">
                        You haven’t added any gifts yet. Explore curated collections to craft the perfect surprise.
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-semibold tracking-wide transition-all shadow-[0_20px_40px_rgba(220,38,38,0.3)]"
                    >
                        Browse Gifts
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black py-12 text-red-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs tracking-[0.4em] uppercase text-red-400 mb-2">Your curation</p>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">Gifting Cart</h1>
                        <p className="text-red-200/80 mt-2">{cartSummary.itemCount} item(s) ready to surprise</p>
                    </div>
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="inline-flex items-center justify-center gap-2 border border-red-900/40 text-red-200 px-5 py-3 rounded-full hover:bg-red-600/20 transition-colors font-medium"
                    >
                        View Orders
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-black/60 border border-red-900/40 rounded-2xl p-6 shadow-[0_25px_45px_rgba(220,38,38,0.15)]">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Image */}
                                    <div className="w-full sm:w-32 h-32 bg-black/40 border border-red-900/40 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image || '/placeholder-gem.jpg'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-white mb-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-red-300 font-medium mb-1">
                                                    {item.category}
                                                </p>
                                                <p className="text-sm text-red-200/70">
                                                    {item.sizeWeight || 'N/A'} {item.sizeUnit || ''}
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-400 hover:text-red-200 p-1"
                                                title="Remove from cart"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Price and Quantity */}
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-lg font-semibold text-white">
                                                    ₹{item.price.toLocaleString()}
                                                </span>
                                                {item.discount > 0 && (
                                                    <span className="text-sm text-red-300 line-through">
                                                        ₹{item.price.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center border border-red-900/40 rounded-lg">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="px-3 py-2 text-red-200 hover:text-white hover:bg-red-600/20"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-2 border-x border-red-900/40 min-w-[3rem] text-center text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="px-3 py-2 text-red-200 hover:text-white hover:bg-red-600/20"
                                                    disabled={item.stock && item.quantity >= item.stock}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="mt-2 text-right">
                                            <span className="text-lg font-semibold text-white">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Clear Cart Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={clearCart}
                                className="text-red-300 hover:text-red-100 text-sm font-medium"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-black/60 border border-red-900/40 rounded-2xl p-6 sticky top-8 shadow-[0_25px_45px_rgba(220,38,38,0.15)]">
                            <h2 className="text-lg font-semibold text-white mb-6 uppercase tracking-wide">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-red-200/80">Subtotal</span>
                                    <span className="font-semibold text-white">₹{cartSummary.subtotal.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-red-200/80">Shipping</span>
                                    <span className="font-semibold text-white">
                                        {cartSummary.shipping === 0 ? 'Free' : `₹${cartSummary.shipping.toLocaleString()}`}
                                    </span>
                                </div>

                                {!cartSummary.isEligibleForFreeShipping && (
                                    <div className="text-sm text-red-300">
                                        Add ₹{(cartSummary.freeShippingThreshold - cartSummary.subtotal).toLocaleString()} more for express perks
                                    </div>
                                )}

                                <div className="border-t border-red-900/40 pt-3">
                                    <div className="flex justify-between text-lg font-bold text-white">
                                        <span>Total</span>
                                        <span>₹{cartSummary.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-red-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-red-500 transition-colors shadow-[0_20px_40px_rgba(220,38,38,0.3)]"
                            >
                                {isAuthenticated ? 'Proceed to Checkout' : 'Checkout with OTP'}
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full mt-3 border border-red-900/40 text-red-200 py-3 px-4 rounded-full font-semibold hover:bg-red-600/20 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOTPModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-black border border-red-900/40 rounded-2xl p-6 w-full max-w-md shadow-[0_30px_60px_rgba(220,38,38,0.25)]">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            {otpSent ? 'Verify One-Time Passcode' : 'Almost there—verify your number'}
                        </h3>

                        {!otpSent ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="Enter 10-digit phone number"
                                        maxLength="10"
                                        className="w-full px-3 py-2 border border-red-900/40 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowOTPModal(false)}
                                        className="flex-1 py-2 px-4 border border-red-900/40 text-red-200 rounded-lg hover:bg-red-600/20"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSendOTP}
                                        disabled={otpLoading}
                                        className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50"
                                    >
                                        {otpLoading ? 'Sending...' : 'Send OTP'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-red-200 mb-2">
                                        Enter OTP
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                        maxLength="6"
                                        className="w-full px-3 py-2 border border-red-900/40 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setOtpSent(false);
                                            setOtp('');
                                        }}
                                        className="flex-1 py-2 px-4 border border-red-900/40 text-red-200 rounded-lg hover:bg-red-600/20"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleVerifyOTP}
                                        disabled={otpLoading}
                                        className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50"
                                    >
                                        {otpLoading ? 'Verifying...' : 'Verify & Checkout'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;

