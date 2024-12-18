import useScript from '@/hooks/useScript';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { toast } from 'sonner';

declare global {
  interface Window {
    CollectCheckout?: {
      redirectToCheckout: (options: {
        type: string;
        lineItems: { lineItemType: string; description: string; currency: string }[];
        successUrl: string;
        cancelUrl: string;
        receipt: { showReceipt: boolean; sendToCustomer: boolean };
        collectShippingInfo: boolean;
        useKount: boolean;
        paymentMethods: { type: string; use3DSecure?: boolean }[];
        fields: unknown[];
      }) => Promise<void>;
    };
  }
}

const DepositButton: React.FC = () => {
  useScript('https://www.midpaygateway.com/token/CollectCheckout.js', 'checkout_public_MB8FX7VpN6V22Z78umh6WFeWP7hr7638');

  useEffect(() => {
    const handleCheckout = async () => {
      toast.loading("Redirecting you to MID Payment...");
      if (window.CollectCheckout) {
        try {
          await window.CollectCheckout.redirectToCheckout({
            type: "sale",
            lineItems: [
              {
                lineItemType: "customPayment",
                description: "Enter the amount of chips you wish to purchase",
                currency: "USD",
              },
            ],
            successUrl: "https://purepoker.world/mid/success?id=(TRANSACTION_ID)",
            cancelUrl: "https://purepoker.world/home",
            receipt: {
              showReceipt: true,
              sendToCustomer: true,
            },
            collectShippingInfo: false,
            useKount: false,
            paymentMethods: [
              { type: "creditCard", use3DSecure: false },
              { type: "check" },
            ],
            fields: [],
          });
        } catch (error) {
          console.error('Checkout error:', error);
        }
      }
    };

    const button = document.getElementById('checkout_button');
    const handleClick = () => {
      void handleCheckout();
    };

    if (button) {
      button.addEventListener('click', handleClick);
    }

    return () => {
      if (button) {
        button.removeEventListener('click', handleClick);
      }
    };
  }, []);

  return (
    <View>
      {/* Checkout button */}
      <View
        id="checkout_button"
        style={{
          flexDirection: 'row', // Equivalent to 'flex' and 'items-center'
          justifyContent: 'center', // Equivalent to 'justify-center'
          alignItems: 'center', // Equivalent to 'items-center'
          width: '100%', // Equivalent to 'w-full'
          borderWidth: 2, // Equivalent to 'border-2'
          borderColor: '#37DD4A', // Equivalent to 'border-[#37DD4A]'
          backgroundColor: 'transparent', // Default background
          borderRadius: 8, // Equivalent to 'rounded-lg'
          paddingVertical: 10, // Equivalent to 'py-2'
        }}
      >
        <Text style={{fontSize: 18, lineHeight: 27, color: '#37DD4A'}}>↑</Text>
        <Text style={{marginLeft: 8}}>Deposit</Text>
      </View>
    </View>
  );
};

export default DepositButton;
