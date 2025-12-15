export default function WomensPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="space-y-6">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
            Coming Soon
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 font-light">
            Women's Collection
          </p>
          
          {/* Description */}
          <p className="text-base md:text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
            We're crafting something extraordinary for you. Our exclusive women's fragrance collection is arriving soon.
          </p>
          
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-2 py-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-pink-300"></div>
            <div className="h-2 w-2 rounded-full bg-pink-400"></div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-pink-300"></div>
          </div>
          
          {/* Back to home link */}
          <div>
            <a 
              href="/" 
              className="inline-block px-8 py-3 text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors duration-300 rounded-full"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
