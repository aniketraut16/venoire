"use client";
import React from "react";
import { Shield, Truck, RefreshCw, Heart, Award, Users } from "lucide-react";
import { config } from "@/variables/config";

export default function AboutUsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src="/aboutus/hero.png"
          alt="Venoire Brand"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wider uppercase mb-4">
              About Venoire
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-light tracking-wide max-w-3xl mx-auto">
              Designed to dress the world in quiet confidence and curated luxury
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-xs md:text-sm font-medium tracking-wider uppercase text-gray-500 mb-3">
              Our Story
            </h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide mb-6">
              Where Luxury Meets Authenticity
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Venoire was born from a simple yet profound desire: to redefine luxury for the modern individual. 
                In a world where fashion often screams, we chose to whisper.
              </p>
              <p>
                We started Venoire to bridge the gap between timeless elegance and contemporary style, 
                believing that true luxury isn't just about the price tag—it's about the feeling of quiet 
                confidence that comes from wearing something truly exceptional.
              </p>
              <p>
                From our humble beginnings to becoming a destination for fashion enthusiasts across India, 
                our story is one of passion for quality, an eye for detail, and an unwavering dedication to our customers.
              </p>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px]">
            <img
              src="/aboutus/brand.png"
              alt="Venoire Story"
              className="w-full h-full object-cover border border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs md:text-sm font-medium tracking-wider uppercase text-gray-500 mb-3">
              What Drives Us
            </h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide">
              Mission, Vision & Values
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Mission */}
            <div className="bg-white p-6 md:p-8 border border-gray-200">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-black flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h4 className="text-lg md:text-xl font-medium tracking-wide uppercase mb-4">
                Our Mission
              </h4>
              <p className="text-gray-700 leading-relaxed">
                To dress the world in quiet confidence and curated luxury, providing an accessible yet 
                premium fashion experience that empowers individuals to express their unique style.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-6 md:p-8 border border-gray-200">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-black flex items-center justify-center mb-4">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h4 className="text-lg md:text-xl font-medium tracking-wide uppercase mb-4">
                Our Vision
              </h4>
              <p className="text-gray-700 leading-relaxed">
                To be the premier online destination for curated luxury fashion in India, known for our 
                exceptional quality, personalized service, and a collection that transcends trends.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white p-6 md:p-8 border border-gray-200">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-black flex items-center justify-center mb-4">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h4 className="text-lg md:text-xl font-medium tracking-wide uppercase mb-4">
                Core Values
              </h4>
              <ul className="text-gray-700 leading-relaxed space-y-2">
                <li>• Quality First</li>
                <li>• Customer Centricity</li>
                <li>• Curated Excellence</li>
                <li>• Integrity & Trust</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-xs md:text-sm font-medium tracking-wider uppercase text-gray-500 mb-3">
            Why Choose Venoire
          </h2>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide">
            The Venoire Promise
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h4 className="text-lg font-medium tracking-wide uppercase mb-3">
              Quality Material
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Every piece in our collection is selected for its superior craftsmanship and premium fabric quality.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h4 className="text-lg font-medium tracking-wide uppercase mb-3">
              Fast Delivery
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Orders processed within 1 working day and delivered to your doorstep within 3-5 business days.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h4 className="text-lg font-medium tracking-wide uppercase mb-3">
              Easy Return
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Hassle-free returns on clothing items within 24 hours of delivery with our simple return process.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-xs md:text-sm font-medium tracking-wider uppercase text-gray-500 mb-3">
            Customer Love
          </h2>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide">
            What Our Customers Say
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-gray-50 p-6 md:p-8 border-l-2 border-black">
            <p className="text-gray-700 leading-relaxed mb-4 italic">
              "I love the quality of the fabric! It feels so premium and the fit is perfect. 
              Venoire has become my go-to for office wear."
            </p>
            <p className="text-sm font-medium tracking-wider uppercase">- Aditi R.</p>
          </div>

          <div className="bg-gray-50 p-6 md:p-8 border-l-2 border-black">
            <p className="text-gray-700 leading-relaxed mb-4 italic">
              "Fast delivery and the packaging was beautiful. It felt like opening a gift. 
              Highly recommend!"
            </p>
            <p className="text-sm font-medium tracking-wider uppercase">- Rahul S.</p>
          </div>

          <div className="bg-gray-50 p-6 md:p-8 border-l-2 border-black">
            <p className="text-gray-700 leading-relaxed mb-4 italic">
              "Finally, a store that understands 'quiet luxury'. The designs are subtle yet classy."
            </p>
            <p className="text-sm font-medium tracking-wider uppercase">- Priya M.</p>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="bg-black text-white py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide mb-6">
            Join the Venoire Family
          </h2>
          <p className="text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            Ready to elevate your style? Explore our latest collections and discover the luxury of quiet confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/collection"
              className="bg-white text-black px-8 py-4 hover:bg-gray-200 transition-colors text-sm font-medium tracking-wider uppercase"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="border border-white text-white px-8 py-4 hover:bg-white hover:text-black transition-colors text-sm font-medium tracking-wider uppercase"
            >
              Contact Us
            </a>
          </div>

          <div className="mt-12 pt-12 border-t border-gray-700">
            <h3 className="text-sm font-medium tracking-wider uppercase mb-4">Get In Touch</h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="font-medium">Email:</span> {config.EMAIL}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {config.PHONE}
              </p>
              <p>
                <span className="font-medium">Location:</span> Shipping across India
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
