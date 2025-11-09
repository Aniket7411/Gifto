import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <Header />
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-16 pb-20">
                {children}
            </main>

            {/* Fixed Footer */}
            <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">
                            © 2025 Aurelane. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AuthLayout;

