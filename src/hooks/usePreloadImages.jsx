import { useEffect } from 'react';

export function usePreloadImages(imageSources) {
    useEffect(() => {
        const images = [];

        // Handle both direct URLs and sprite objects
        const sources = Array.isArray(imageSources)
            ? imageSources
            : Object.values(imageSources).flatMap((value) =>
                typeof value === 'object' && value?.src ? [value.src] : [value]
            );

        sources.forEach((src) => {
            if (src && typeof src === 'string') {
                const img = new Image();
                img.src = src;
                images.push(img);
            }
        });

        // Cleanup (optional, images are cached by browser)
        return () => {
            images.forEach((img) => {
                img.src = ''; // Prevent memory leaks in some cases
            });
        };
    }, [imageSources]);
}