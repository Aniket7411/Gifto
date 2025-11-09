// Test script to verify password reset endpoints
// Run with: node test-password-reset.js

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testPasswordReset() {
    console.log('🧪 Testing Password Reset Endpoints...\n');

    try {
        // Test 1: Forgot Password
        console.log('1️⃣ Testing Forgot Password...');
        const forgotResponse = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
            email: 'test@example.com'
        });
        console.log('✅ Forgot Password Response:', forgotResponse.data);
        console.log('');

        // Test 2: Reset Password (this will fail until backend is fixed)
        console.log('2️⃣ Testing Reset Password...');
        try {
            const resetResponse = await axios.put(`${API_BASE_URL}/auth/reset-password/test-token-123`, {
                password: 'newpassword123'
            });
            console.log('✅ Reset Password Response:', resetResponse.data);
        } catch (error) {
            console.log('❌ Reset Password Error:', error.response?.data || error.message);
            console.log('   This is expected until backend route is added!');
        }

    } catch (error) {
        console.error('❌ Test Error:', error.response?.data || error.message);
    }
}

// Run the test
testPasswordReset();
