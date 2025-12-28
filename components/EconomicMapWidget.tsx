'use client';

import React, { memo, useEffect } from 'react';

interface EconomicMapWidgetProps {
    title?: string;
}

const EconomicMapWidget = ({ title = 'Economic Map' }: EconomicMapWidgetProps) => {
    useEffect(() => {
        // Load the TradingView economic map widget script
        const script = document.createElement('script');
        script.src = 'https://widgets.tradingview-widget.com/w/en/tv-economic-map.js';
        script.type = 'module';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="w-full !text-black">
            {title && <h3 className="font-semibold text-2xl text-black mb-5">{title}</h3>}
            <tv-economic-map></tv-economic-map>
        </div>
    );
}

export default memo(EconomicMapWidget);
