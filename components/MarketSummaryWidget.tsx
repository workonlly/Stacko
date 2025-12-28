'use client';

import React, { memo, useEffect } from 'react';

interface MarketSummaryWidgetProps {
    direction?: 'horizontal' | 'vertical';
}

const MarketSummaryWidget = ({ direction = 'horizontal' }: MarketSummaryWidgetProps) => {
    useEffect(() => {
        // Load the TradingView market summary widget script
        const script = document.createElement('script');
        script.src = 'https://widgets.tradingview-widget.com/w/en/tv-market-summary.js';
        script.type = 'module';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="w-full !text-black mb-8">
            <tv-market-summary direction={direction}></tv-market-summary>
        </div>
    );
}

export default memo(MarketSummaryWidget);
