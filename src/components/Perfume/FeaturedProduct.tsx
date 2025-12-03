import Link from 'next/link';

export default function FeaturedProduct() {
  return (
    <section className="py-7 md:py-9 bg-gradient-to-b from-[#fcf9ee] to-[#fcf9ee]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <img
              src="/perfume/perfume-personlize.png"
              alt="Create Your Signature Scent"
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-heading text-[#121212]">
            Signature Scents That Define You
            </h2>

            

            <p className="text-base leading-relaxed text-gray-700">
            Each Venoire perfume captures a moment — the warmth of twilight, the calm of rain, the spark of desire.
Crafted for those who see fragrance as an expression, not an accessory — a quiet reflection of the self.
            </p>

            <div className="flex gap-4">
              <Link
                href="/perfume/collection"
                className="inline-flex items-center px-6 py-3 bg-[#121212] text-white rounded hover:bg-[#0f182c] transition-colors"
              >
                Find Your Scent
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Share Button */}
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#121212]">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}