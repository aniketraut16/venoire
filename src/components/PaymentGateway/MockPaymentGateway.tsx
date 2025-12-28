import React, { useState } from 'react';
import { CreditCard, Smartphone, Wallet, Building2, X } from 'lucide-react';

function MockPaymentGateway(props: {
  amount: number;
  onPaymentCompleted: (
    status: "success" | "failed",
    transactionId: string,
    amount: number,
    paymentMethod: "credit_card" | "debit_card" | "netbanking" | "wallet" | "upi",
    gatewayResponse: JSON | null
  ) => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState<"credit_card" | "debit_card" | "netbanking" | "wallet" | "upi" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [bankName, setBankName] = useState('');
  const [walletProvider, setWalletProvider] = useState('');
  const [upiId, setUpiId] = useState('');

  const paymentMethods = [
    { id: 'credit_card', name: 'Credit Card', icon: CreditCard },
    { id: 'debit_card', name: 'Debit Card', icon: CreditCard },
    { id: 'netbanking', name: 'Net Banking', icon: Building2 },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'upi', name: 'UPI', icon: Smartphone },
  ];

  const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `TXN${timestamp}${random}`;
  };

  const simulatePayment = () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      const transactionId = generateTransactionId();
      
      const gatewayResponse = {
        transactionId,
        timestamp: new Date().toISOString(),
        paymentMethod: selectedMethod,
        amount: props.amount,
        status: isSuccess ? 'success' : 'failed',
        message: isSuccess ? 'Payment processed successfully' : 'Payment failed. Please try again.',
        bankReference: isSuccess ? `BANK${Math.floor(Math.random() * 1000000)}` : null,
      };

      props.onPaymentCompleted(
        isSuccess ? 'success' : 'failed',
        transactionId,
        props.amount,
        selectedMethod,
        gatewayResponse as unknown as JSON
      );

      setIsProcessing(false);
    }, 2000);
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'credit_card':
      case 'debit_card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Your Bank</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a bank</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
            <p className="text-sm text-gray-600">You will be redirected to your bank's website to complete the payment.</p>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Wallet</label>
              <select
                value={walletProvider}
                onChange={(e) => setWalletProvider(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a wallet</option>
                <option value="paytm">Paytm</option>
                <option value="phonepe">PhonePe</option>
                <option value="googlepay">Google Pay</option>
                <option value="amazonpay">Amazon Pay</option>
                <option value="mobikwik">MobiKwik</option>
              </select>
            </div>
            <p className="text-sm text-gray-600">Payment will be processed through your selected wallet.</p>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">A payment request will be sent to your UPI app</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Payment Gateway</h2>
            <button
              onClick={() => props.onPaymentCompleted('failed', '', props.amount, 'credit_card', null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-6 text-white">
            <p className="text-sm opacity-90 mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold">₹{props.amount.toFixed(2)}</p>
          </div>

          {!selectedMethod ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</p>
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id as any)}
                    className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Icon className="text-blue-600" size={24} />
                    </div>
                    <span className="font-medium text-gray-800">{method.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedMethod(null)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Change Payment Method
              </button>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Selected: {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </p>
              </div>

              {renderPaymentForm()}

              <button
                onClick={simulatePayment}
                disabled={isProcessing}
                className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${props.amount.toFixed(2)}`
                )}
              </button>

              <p className="text-xs text-center text-gray-500">
                This is a mock payment gateway for testing purposes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MockPaymentGateway;