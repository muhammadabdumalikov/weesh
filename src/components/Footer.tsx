import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full px-4 sm:px-8 md:px-16 lg:px-32 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 bg-white/80">
      <div className="text-sm text-black font-geologica order-2 sm:order-1">
        © Weesh, 2026
      </div>
      <div className="flex gap-4 sm:gap-6 order-1 sm:order-2">
        <Link 
          href="https://vk.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-black hover:text-gray-600 transition-colors font-geologica"
        >
          VK
        </Link>
        <Link 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-black hover:text-gray-600 transition-colors font-geologica"
        >
          Instagram
        </Link>
        <Link 
          href="https://facebook.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-black hover:text-gray-600 transition-colors font-geologica"
        >
          Facebook
        </Link>
      </div>
    </footer>
  );
}
