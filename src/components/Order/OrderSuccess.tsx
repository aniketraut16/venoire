import React from 'react';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderSuccessProps {
  orderId: string;
  transactionId: string;
  amount: number;
  onClose: () => void;
}

function OrderSuccess({ orderId, transactionId, amount, onClose }: OrderSuccessProps) {
  const router = useRouter();

  const handleViewOrders = () => {
    router.push('/orders');
    onClose();
  };

  const handleContinueShopping = () => {
    router.push('/');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h2>

            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed.
            </p>

            <div className="w-full bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Order ID</span>
                <span className="font-semibold text-gray-900">{orderId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-semibold text-gray-900">{transactionId}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t pt-3">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-semibold text-gray-900">₹ {amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={handleViewOrders}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                View My Orders
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full border border-gray-300 bg-white text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Continue Shopping
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;

