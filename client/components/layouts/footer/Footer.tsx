import { Home, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Home size={28} className="text-blue-400" />
              <span className="text-2xl font-bold">RealEstate</span>
            </div>
            <p className="text-gray-400 mb-6">
              Your trusted partner in finding the perfect home in Sri Lanka since 2010.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/properties" className="text-gray-400 hover:text-white transition-colors">
                  Properties
                </a>
              </li>
              <li>
                <a href="/agents" className="text-gray-400 hover:text-white transition-colors">
                  Agents
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-xl font-bold mb-6">Property Types</h3>
            <ul className="space-y-3">
              <li>
                <a href="/properties/houses" className="text-gray-400 hover:text-white transition-colors">
                  Houses
                </a>
              </li>
              <li>
                <a href="/properties/apartments" className="text-gray-400 hover:text-white transition-colors">
                  Apartments
                </a>
              </li>
              <li>
                <a href="/properties/villas" className="text-gray-400 hover:text-white transition-colors">
                  Villas
                </a>
              </li>
              <li>
                <a href="/properties/land" className="text-gray-400 hover:text-white transition-colors">
                  Land
                </a>
              </li>
              <li>
                <a href="/properties/commercial" className="text-gray-400 hover:text-white transition-colors">
                  Commercial
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-blue-400" />
                <span className="text-gray-400">+94 11 234 5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-blue-400" />
                <span className="text-gray-400">info@realestate.lk</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-blue-400 mt-1" />
                <span className="text-gray-400">
                  123 Galle Road, Colombo 3<br />
                  Sri Lanka
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} RealEstate. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center space-x-6 mt-4 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
            <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}