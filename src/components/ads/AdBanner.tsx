
'use client'

import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

interface AdBannerProps {
    slot: string;
    format?: 'auto' | 'horizontal' | 'vertical';
}

export const AdBanner = ({ slot, format = 'auto' }: AdBannerProps) => {
    const isAdsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';

    useEffect(() => {
        if (isAdsEnabled && window.adsbygoogle) {
            try {
                window.adsbygoogle.push({});
            } catch (e) {
                console.error('Error loading ad:', e);
            }
        }
    }, [isAdsEnabled]);

    if (!isAdsEnabled) return null;

    return (
        <div className="w-full my-4 flex justify-center">
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
                data-ad-slot={slot}
                data-ad-format={format}
            />
        </div>
    );
};
