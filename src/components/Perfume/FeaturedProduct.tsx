// components/FeaturedProduct.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedProduct() {
  return (
    <section className="py-7 md:py-9 bg-gradient-to-b from-[#fcf9ee] to-[#fcf9ee]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <img
              src="/perfume/perfume-personlize.png"
              alt="Create Your Signature Scent"
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading text-[#121212]">
              Create Your Signature Scent
            </h2>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-[#121212]">
                  Rs. 1,599.00
                </span>
                <span className="px-3 py-1 text-sm bg-[#ff5900] text-white rounded">
                  Sale
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Taxes included.{' '}
                <Link href="/policies/shipping" className="underline">
                  Shipping
                </Link>{' '}
                calculated at checkout.
              </p>
            </div>

            <p className="text-base leading-relaxed text-gray-700">
              Design your own luxury perfume with a personalized touch! Choose
              your fragrance notes and give it a name that's as unique as you
              are. Craft a scent that tells your story and carry it with you
              wherever you go.
            </p>

            <div className="flex gap-4">
              <Link
                href="/products/create-your-signature-scent"
                className="inline-flex items-center px-6 py-3 bg-[#121212] text-white rounded hover:bg-[#ff5900] transition-colors"
              >
                View full details
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