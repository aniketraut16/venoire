"use client";
import React, { useState, useMemo } from "react";
import { Search, X, HelpCircle, Package, CreditCard, Truck, ShoppingBag, AlertCircle, FileText, ChevronDown } from "lucide-react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded">
      <button
        className="w-full text-left p-4 font-medium flex justify-between items-center bg-white text-black hover:bg-gray-50 transition-colors duration-200"
        onClick={onToggle}
      >
        <span className="text-sm tracking-wide pr-2">{title}</span>
        <ChevronDown 
          size={20} 
          className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed">{children}</p>
        </div>
      )}
    </div>
  );
};

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export default function HelpAndSupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketFormData, setTicketFormData] = useState({
    subject: "",
    description: ""
  });

  const faqData: FAQItem[] = [
    {
      id: "shipping-1",
      category: "Shipping & Delivery",
      question: "How long does shipping take?",
      answer: "All orders are typically processed and dispatched within 1 working day after confirmation. Once dispatched, your order will generally reach you within 3 to 5 working days, depending on your delivery location within India. We currently ship only within India and do not deliver internationally.",
      icon: <Truck size={20} />
    },
    {
      id: "shipping-2",
      category: "Shipping & Delivery",
      question: "Do you offer international shipping?",
      answer: "No, we currently ship only within India and do not deliver internationally. We offer free shipping on all orders above ₹999. For orders below ₹999, a standard shipping fee will be applied at checkout.",
      icon: <Truck size={20} />
    },
    {
      id: "shipping-3",
      category: "Shipping & Delivery",
      question: "How do I track my order?",
      answer: "Once your order has been dispatched, you will receive a tracking link via email sent to the address provided at checkout. This tracking link will allow you to monitor the movement and expected delivery date of your shipment. Orders are typically processed and dispatched within 1 working day after confirmation.",
      icon: <Truck size={20} />
    },
    {
      id: "shipping-4",
      category: "Shipping & Delivery",
      question: "Can I change my shipping address?",
      answer: "Shipping addresses can only be changed within 2 hours of order placement, before the order enters fulfillment. Once shipped, packages cannot be redirected. Please contact us immediately if you need to update your address.",
      icon: <Truck size={20} />
    },
    {
      id: "returns-1",
      category: "Returns & Refunds",
      question: "What is your return policy?",
      answer: "At Venoire, only clothing items are eligible for return. All other product categories are not eligible for return or exchange. Clothing items must be unused, unwashed, in original condition with all tags and packaging intact. You must inform us within 24 hours of delivery to initiate a return. Once approved and the item passes quality inspection, refunds are processed within 3-5 business days.",
      icon: <Package size={20} />
    },
    {
      id: "returns-2",
      category: "Returns & Refunds",
      question: "How long does it take to receive my refund?",
      answer: "Once your return is approved and the item passes quality inspection, refunds are processed within 3-5 business days. The refund will be credited to your original payment method. Please allow an additional 5-7 business days for the amount to reflect in your account.",
      icon: <Package size={20} />
    },
    {
      id: "returns-3",
      category: "Returns & Refunds",
      question: "Can I exchange an item instead of returning it?",
      answer: "Currently, we do not offer direct exchanges. If you'd like a different size or product, please return the original item for a refund and place a new order for the item you want.",
      icon: <Package size={20} />
    },
    {
      id: "orders-1",
      category: "Orders",
      question: "I need to cancel or modify my order",
      answer: "Orders can be cancelled or modified within 2 hours of placement. After this time, orders enter our fulfillment process and cannot be changed. Please contact us immediately if you need to make changes to your order.",
      icon: <ShoppingBag size={20} />
    },
    {
      id: "orders-2",
      category: "Orders",
      question: "My order arrived damaged or incorrect",
      answer: "We sincerely apologize for any issues with your order. You must contact us within 24 hours of delivery. To process your claim, please provide a mandatory unboxing video, clear photos of the product, and images of the outer packaging. Email all required proof to care.itsvenoire@gmail.com, and our team will assist you promptly.",
      icon: <ShoppingBag size={20} />
    },
    {
      id: "orders-3",
      category: "Orders",
      question: "I haven't received my order confirmation",
      answer: "Order confirmations are sent immediately after purchase. Please check your spam/junk folder first. If you still can't find it, contact us with your email address and we'll resend your confirmation and tracking information.",
      icon: <ShoppingBag size={20} />
    },
    {
      id: "orders-4",
      category: "Orders",
      question: "What if an item is out of stock after I ordered?",
      answer: "If an item becomes unavailable after your order, we'll contact you within 24 hours to discuss options: wait for restock, substitute with a similar item, or receive a full refund for that item.",
      icon: <ShoppingBag size={20} />
    },
    {
      id: "payment-1",
      category: "Payment",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are processed securely through our encrypted payment system.",
      icon: <CreditCard size={20} />
    },
    {
      id: "payment-2",
      category: "Payment",
      question: "Is it safe to use my credit card on your website?",
      answer: "Yes, absolutely. We use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers. All payment processing is handled securely through certified payment gateways.",
      icon: <CreditCard size={20} />
    },
    {
      id: "payment-3",
      category: "Payment",
      question: "Do you offer Cash on Delivery (COD)?",
      answer: "Cash on Delivery availability depends on your location and order value. This option will be displayed at checkout if available for your delivery address. Please note that a small COD fee may apply.",
      icon: <CreditCard size={20} />
    },
    {
      id: "account-1",
      category: "Account & Profile",
      question: "How do I reset my password?",
      answer: "Click on 'Sign In' at the top of the page, then click 'Forgot Password'. Enter your email address and we'll send you a link to reset your password. Make sure to check your spam folder if you don't see the email within a few minutes.",
      icon: <FileText size={20} />
    },
    {
      id: "account-2",
      category: "Account & Profile",
      question: "Can I update my account information?",
      answer: "Yes, you can update your account information by going to My Profile from your account dashboard. You can change your name, email, phone number, and saved addresses at any time.",
      icon: <FileText size={20} />
    },
    {
      id: "account-3",
      category: "Account & Profile",
      question: "How do I delete my account?",
      answer: "If you wish to delete your account, please contact our customer support team at care.itsvenoire@gmail.com. We'll process your request within 3-5 business days. Please note that this action is permanent and cannot be undone.",
      icon: <FileText size={20} />
    },
    {
      id: "products-1",
      category: "Products",
      question: "How do I know which perfume is right for me?",
      answer: "Each perfume on our website includes detailed descriptions of fragrance notes, concentration, and suitable occasions. You can also read customer reviews to understand how the scent performs. If you need personalized recommendations, feel free to contact our support team.",
      icon: <HelpCircle size={20} />
    },
    {
      id: "products-2",
      category: "Products",
      question: "Are your perfumes authentic?",
      answer: "Yes, all our perfumes are 100% authentic and sourced directly from authorized distributors. We stand behind the quality and authenticity of every product we sell.",
      icon: <HelpCircle size={20} />
    },
    {
      id: "products-3",
      category: "Products",
      question: "Do you offer gift wrapping services?",
      answer: "Yes, we offer complimentary gift wrapping for most products. You can select the gift wrap option during checkout. We'll include a beautiful presentation box and a gift message card if you provide one.",
      icon: <HelpCircle size={20} />
    }
  ];

  const categories = [
    { key: "all", label: "All Topics", icon: <HelpCircle size={18} /> },
    { key: "Shipping & Delivery", label: "Shipping & Delivery", icon: <Truck size={18} /> },
    { key: "Returns & Refunds", label: "Returns & Refunds", icon: <Package size={18} /> },
    { key: "Orders", label: "Orders", icon: <ShoppingBag size={18} /> },
    { key: "Payment", label: "Payment", icon: <CreditCard size={18} /> },
    { key: "Account & Profile", label: "Account & Profile", icon: <FileText size={18} /> },
    { key: "Products", label: "Products", icon: <AlertCircle size={18} /> }
  ];

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        faq =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          faq.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleTicketFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicketFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitTicket = () => {
    // TODO: Implement ticket submission logic
    console.log("Ticket submitted:", ticketFormData);
    // Reset form and close modal
    setTicketFormData({ subject: "", description: "" });
    setShowTicketForm(false);
    // Show success message (to be implemented with toast)
  };

  return (
    <div className="bg-white lg:border lg:border-gray-200">
      {/* Mobile Header */}
      <div className="flex md:hidden items-center gap-3 bg-[#142241] text-yellow-600 py-4 px-4 pt-8 w-full"
        style={{
          transform: window.innerWidth < 768 ? "translateY(-30px)" : "translateY(0%)",
        }}
      >
        <h2 className="text-xl md:text-2xl font-light tracking-wide uppercase">
          Help & Support
        </h2>
      </div>

      <div className="max-w-6xl mx-auto pt-0 md:p-8"
        style={{
          transform: window.innerWidth < 768 ? "translateY(-30px)" : "translateY(0%)",
        }}
      >
  

        {/* Search Bar */}
        <div className="p-4 md:p-0 md:mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded focus:border-black focus:outline-none text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Raise Ticket Button */}
       

        {/* Category Filters */}
        <div className="overflow-x-auto scrollbar-hide px-4 md:px-0 mb-6">
          <div className="flex gap-2 min-w-max md:flex-wrap">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded whitespace-nowrap text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="px-4 md:px-0 mb-4">
          <p className="text-sm text-gray-600">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? "result" : "results"} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* FAQ List */}
        <div className="px-4 md:px-0 space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 border border-gray-200 rounded">
              <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-2">No results found</p>
              <p className="text-sm text-gray-400">
                Try adjusting your search or browse by category
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <Accordion
                key={faq.id}
                title={faq.question}
                isOpen={openAccordions.has(faq.id)}
                onToggle={() => toggleAccordion(faq.id)}
              >
                {faq.answer}
              </Accordion>
            ))
          )}
        </div>

        {/* Still Need Help Section */}
        <div className="px-4 md:px-0 mt-8 p-6 bg-gray-50 border border-gray-200 rounded">
          <div className="text-center">
            <h3 className="text-lg font-medium uppercase mb-2">Still Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowTicketForm(true)}
                className="bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors text-sm font-medium tracking-wider uppercase"
              >
                Raise a Support Ticket
              </button>
              <a
                href="mailto:care.itsvenoire@gmail.com"
                className="border border-gray-300 text-gray-700 px-6 py-3 hover:bg-gray-100 transition-colors text-sm font-medium tracking-wider uppercase"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Form Modal */}
      {showTicketForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowTicketForm(false);
          }}
        >
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-light tracking-wide uppercase">
                  Raise a Support Ticket
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  We'll get back to you within 24-48 hours
                </p>
              </div>
              <button
                onClick={() => setShowTicketForm(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={ticketFormData.subject}
                  onChange={handleTicketFormChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded focus:border-black focus:outline-none transition-colors duration-200"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={ticketFormData.description}
                  onChange={handleTicketFormChange}
                  rows={8}
                  className="w-full border border-gray-300 px-4 py-3 rounded focus:border-black focus:outline-none transition-colors duration-200 resize-none"
                  placeholder="Provide detailed information about your issue..."
                ></textarea>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Please include your order number if this is related to a specific order.
                  This helps us assist you faster.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubmitTicket}
                  disabled={!ticketFormData.subject.trim() || !ticketFormData.description.trim()}
                  className="flex-1 bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors text-sm font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Ticket
                </button>
                <button
                  onClick={() => setShowTicketForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 hover:bg-gray-50 transition-colors text-sm font-medium tracking-wider uppercase"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
