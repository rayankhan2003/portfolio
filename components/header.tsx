import Link from 'next/link';
export default function Header() {
  return (
    <header className="bg-transparent">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            rayankhan.dev
          </Link>

          <nav className="hidden md:flex font-semibold text-[16px] items-center space-x-8">
            <Link href="#" className="text-gray-900 ">
              Home
            </Link>
            <Link href="#" className="text-gray-900 ">
              About
            </Link>
            <Link href="#" className="text-gray-900 ">
              Projects
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
