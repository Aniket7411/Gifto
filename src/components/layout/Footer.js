import React from 'react';

const Footer = () => {
    return (
        <div className="bg-black text-red-100 mx-auto py-10 px-4 sm:px-6 lg:px-12 border-t border-red-900/40">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center mb-4">
                        <div className="h-20 w-20 rounded-lg flex items-center justify-center bg-white/5 border border-red-900/40 p-2">
                                <img src="/images/aurelane.png" alt="Aurelane Gifts Logo" />
                        </div>

                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3 tracking-wide uppercase">Aurelane Gifts</h3>
                    <p className="text-sm mb-4 text-red-200 leading-relaxed">
                        We design keepsake-worthy gifts for birthdays, first meetings, weddings, office wins, and every heartfelt moment in between. Curated by stylists, delivered with a black-and-red signature finish.
                    </p>
                    <p className="text-xs text-red-400">
                        © {new Date().getFullYear()} Aurelane Gifts. Crafted with care in India.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">
                        Quick Links
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="/" className="text-sm text-red-200 hover:text-white transition-colors duration-200">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/shop" className="text-sm text-red-200 hover:text-white transition-colors duration-200">
                                Shop Gifts
                            </a>
                        </li>
                        <li>
                            <a href="/gifts" className="text-sm text-red-200 hover:text-white transition-colors duration-200">
                                Gift Playbooks
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">
                        Need Help?
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="/aboutus" className="text-sm text-red-200 hover:text-white transition-colors duration-200">
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="mailto:hello@aurelanegifts.com" className="text-sm text-red-200 hover:text-white transition-colors duration-200">
                                hello@aurelanegifts.com
                            </a>
                        </li>
                        <li>
                            <a href="tel:+919999999999" className="text-sm text-red-200 hover:text-white transition-colors duration-200">
                                +91 99999 99999
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-red-500">
                <span>Express delivery available in all metros · Corporate concierge ready for bulk gifting</span>
                <span>GST included · Secure payments · Story-first packaging</span>
            </div>
        </div>
    );
};

export default Footer;

