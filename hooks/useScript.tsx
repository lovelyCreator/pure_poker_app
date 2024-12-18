import { useEffect } from 'react';

const useScript = (url: string, key: string) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.setAttribute('data-checkout-key', key);  // Set the data-checkout-key

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, key]);
};

export default useScript;