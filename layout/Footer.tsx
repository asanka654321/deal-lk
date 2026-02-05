import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-surface border-t border-gray-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tight text-white">Deal.lk</span>
                        </Link>
                        <p className="text-sm text-gray-400">
                            Sri Lanka's most premium classifieds marketplace. Buy and sell everything from cars to mobile phones.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Marketplace</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/ads" className="hover:text-primary">All Ads</Link></li>
                            <li><Link href="#" className="hover:text-primary">Electronics</Link></li>
                            <li><Link href="#" className="hover:text-primary">Vehicles</Link></li>
                            <li><Link href="#" className="hover:text-primary">Property</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-primary">Safety Tips</Link></li>
                            <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Social / Contact */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Connect</h3>
                        <p className="text-sm text-gray-400 mb-4">Follow us on social media for updates.</p>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Site Admin</p>
                            <p className="text-sm text-white">Asanka Anurudda</p>
                            <a href="tel:0771318400" className="text-sm text-primary hover:underline flex items-center gap-2">
                                0771318400
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Deal.lk. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
