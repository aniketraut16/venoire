// components/FeaturedCollection.tsx
import Image from 'next/image';
import Link from 'next/link';

const products = [
  {
    name: "OP 110 BD CHANEL",
    price: "Rs. 650.00",
    originalPrice: "Rs. 1,050.00",
    image1: "https://ooakperfumes.com/cdn/shop/files/1542.webp?v=1744439006&width=810",
    image2: "https://ooakperfumes.com/cdn/shop/files/Untitled_design_19.png?v=1749977239&width=810",
    save: "38%"
  },
  {
    name: "OP 43 DR Sauage",
    price: "Rs. 650.00",
    originalPrice: "Rs. 1,050.00",
    image1: "https://ooakperfumes.com/cdn/shop/files/1542.webp?v=1744439006&width=810",
    image2: "https://ooakperfumes.com/cdn/shop/files/Untitled_design_19.png?v=1749977239&width=810",
    save: "38%"
  },
  {
    name: "OP 123 Imperial Valley",
    price: "Rs. 650.00",
    originalPrice: "Rs. 1,050.00",
    image1: "https://ooakperfumes.com/cdn/shop/files/8_ad6e1a75-ebcc-40cd-8e0a-19d40495941d.png?v=1744439423&width=810",
    image2: "https://ooakperfumes.com/cdn/shop/files/DSC09042-Pacdora.png?v=1744439423&width=810",
    save: "38%"
  },
  {
    name: "OP 124 Oud Wood",
    price: "Rs. 650.00",
    originalPrice: "Rs. 1,050.00",
    image1: "https://ooakperfumes.com/cdn/shop/files/5_68844710-7deb-43ab-82ca-544eaf989b39.png?v=1744439460&width=810",
    image2: "https://ooakperfumes.com/cdn/shop/files/DSC09036-Pacdora.png?v=1744439460&width=810",
    save: "38%"
  }
];


export default function FeaturedCollection() {
  return (
    <section className="py-12 bg-[#fcf9ee]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#ff5900]">BEST SELLERS</h2>
          <p className="text-md text-gray-700">Inspired Versions</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.name} className="group relative">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 h-[350px] md:h-[450px]">
                 <div className="relative w-full h-full">
                   <img
                      src={product.image1}
                      alt={product.name}
                      className="w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                  />
                  <img
                      src={product.image2}
                      alt={product.name}
                      className="w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  />
                </div>
                 <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                   Save {product.save}
                 </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{product.price}</p>
                  <p className="text-sm line-through text-red-500">{product.originalPrice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
