import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteSettings } from '../api/settings';

export const Footer = () => {
    const { data: settings } = useSiteSettings();

    // Default values if settings fail to load or are empty
    const brandName = settings?.brand?.name || 'LuxStay';
    const brandDesc = settings?.brand?.description || 'Experience luxury and comfort in the heart of the city. Your perfect getaway awaits.';
    const address = settings?.contact?.address || '123 Luxury Avenue, Paradise City, PC 12345';
    const phone = settings?.contact?.phone || '+1 (555) 123-4567';
    const email = settings?.contact?.email || 'info@luxstay.com';
    const fbLink = settings?.socials?.facebook || '#';
    const twLink = settings?.socials?.twitter || '#';
    const instaLink = settings?.socials?.instagram || '#';

    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif font-bold text-amber-500">{brandName}</h3>
                        <p className="text-gray-400 text-sm">
                            {brandDesc}
                        </p>
                        <div className="flex space-x-4">
                            <a href={fbLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-500 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href={twLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-500 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href={instaLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-500 transition-colors">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/rooms" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    Our Rooms
                                </Link>
                            </li>
                            <li>
                                <Link to="/dining" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    Dining
                                </Link>
                            </li>
                            <li>
                                <Link to="/cars" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    Car Rental
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-gray-400">
                                <MapPin size={20} className="mt-1 flex-shrink-0" />
                                <span>{address}</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Phone size={20} className="flex-shrink-0" />
                                <span>{phone}</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Mail size={20} className="flex-shrink-0" />
                                <span>{email}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to receive special offers and updates.
                        </p>
                        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-amber-500 text-white"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
