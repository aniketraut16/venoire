import Link from 'next/link';

export default function SignatureScents() {
  return (
    <section className="py-7 md:py-9 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <div className="relative aspect-4/3 overflow-hidden rounded-lg">
            <img
              src="/perfume/perfume-personlize.png"
              alt="Create Your Signature Scent"
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-display text-[#121212]">
            Signature Scents 
            <span className="text-section text-[#121212]">                 </span>
            That Define You
            </h2>

            

            <p className="text-body leading-relaxed text-gray-700">
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

          
          </div>
        </div>
      </div>
    </section>
  );
}