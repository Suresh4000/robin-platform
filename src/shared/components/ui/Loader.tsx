'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import loaderData from './Loader.json';

const Lottie = dynamic(() => import('lottie-react').then(m => m.Lottie as React.ComponentType<any>), { ssr: false });

interface LoaderProps {
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
}

export const Loader: React.FC<LoaderProps> = ({
    width = 60,
    height = 60,
    className,
    style
}) => {
    return (
        <div
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                width,
                height,
                ...style
            }}
        >
            <Lottie
                src={loaderData}
                autoplay
                loop
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default Loader;
