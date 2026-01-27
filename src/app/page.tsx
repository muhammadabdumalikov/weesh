'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'react-feather';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleCreateWishlist = () => {
    router.push('/wishlist');
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Top Striped Border */}
      <div className="absolute top-0 left-0 right-0 h-1 striped-border"></div>

      {/* Left Yellow Stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>

      {/* Right Yellow Stripe */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-yellow-400"></div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-geologica">
          Wish
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link 
            href="#about" 
            className="text-black hover:text-gray-600 transition-colors text-base font-geologica"
          >
            О сервисе
          </Link>
          <Link 
            href="/wishlist"
            className="px-5 py-2 border border-black rounded-full text-black hover:bg-gray-50 transition-colors text-base font-geologica"
          >
            Войти
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-8 py-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-4 min-h-[70vh]">
          {/* Left: Headline */}
          <div className="flex-1 space-y-4 lg:space-y-6 relative z-10">
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] font-geologica">
              <span className="block ml-8 lg:ml-12 text-[#222222]">получайте</span>
              <span className="block text-[#222222]">только</span>
              <span className="block ml-12 lg:ml-24 bg-gradient-to-r from-[#E6007A] to-[#FF6600] bg-clip-text text-transparent">
                желанные
              </span>
              <span className="block ml-24 lg:ml-32 text-[#222222]">подарки</span>
            </h1>

            {/* CTA Button */}
            <div className="mt-6 inline-block">
              <div className="button-gradient-border">
                <button
                  onClick={handleCreateWishlist}
                  className="flex items-center gap-3 px-10 py-6 rounded-full font-medium hover:opacity-90 transition-opacity text-lg w-full font-geologica"
                >
                  <div className="gradient-border-button flex-shrink-0 p-2">
                    <div className="gradient-border-button-inner">
                      <Plus className="w-6 h-6 text-[#FF0000]" />
                    </div>
                  </div>
                  <span className="text-[#222222] text-xl">Создать вишлист</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Illustration - Overlapping with text */}
              <div className="gradient-border mb-24">
                <div className="gradient-border-inner relative">
                  <Image
                    src="/pux.jpeg"
                    alt="Wishlist illustration"
                    width={600}
                    height={600}
                    className="rounded-full object-cover w-full h-auto"
                    priority
                  />
                </div>
              </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-6 max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-sm text-black font-geologica">
          © Weesh, 2026
        </div>
        <div className="flex gap-6">
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
    </div>
  );
}
