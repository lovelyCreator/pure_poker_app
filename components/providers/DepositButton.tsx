import useScript from '@/hooks/useScript';
import React, { useEffect } from 'react';
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