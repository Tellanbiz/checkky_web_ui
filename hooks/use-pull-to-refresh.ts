"use client";

import { useEffect, useRef, useState } from 'react';

interface UsePullToRefreshProps {
    onRefresh: () => Promise<void> | void;
    threshold?: number;
    disabled?: boolean;
}

export function usePullToRefresh({
    onRefresh,
    threshold = 80,
    disabled = false
}: UsePullToRefreshProps) {
    const [isPulling, setIsPulling] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const startY = useRef<number | null>(null);
    const currentY = useRef<number | null>(null);

    useEffect(() => {
        if (disabled) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                startY.current = e.touches[0].clientY;
                setIsPulling(true);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!startY.current || isRefreshing) return;

            currentY.current = e.touches[0].clientY;
            const distance = currentY.current - startY.current;

            if (distance > 0 && window.scrollY === 0) {
                e.preventDefault();
                const resistance = distance > threshold ? threshold + (distance - threshold) * 0.3 : distance;
                setPullDistance(resistance);
            }
        };

        const handleTouchEnd = async () => {
            if (!startY.current || !currentY.current) return;

            const distance = currentY.current - startY.current;

            if (distance > threshold && !isRefreshing) {
                setIsRefreshing(true);
                try {
                    await onRefresh();
                } finally {
                    setIsRefreshing(false);
                }
            }

            // Reset
            startY.current = null;
            currentY.current = null;
            setPullDistance(0);
            setIsPulling(false);
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (window.scrollY === 0) {
                startY.current = e.clientY;
                setIsPulling(true);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!startY.current || isRefreshing) return;

            currentY.current = e.clientY;
            const distance = currentY.current - startY.current;

            if (distance > 0 && window.scrollY === 0) {
                const resistance = distance > threshold ? threshold + (distance - threshold) * 0.3 : distance;
                setPullDistance(resistance);
            }
        };

        const handleMouseUp = async () => {
            if (!startY.current || !currentY.current) return;

            const distance = currentY.current - startY.current;

            if (distance > threshold && !isRefreshing) {
                setIsRefreshing(true);
                try {
                    await onRefresh();
                } finally {
                    setIsRefreshing(false);
                }
            }

            // Reset
            startY.current = null;
            currentY.current = null;
            setPullDistance(0);
            setIsPulling(false);
        };

        // Touch events for mobile
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);

        // Mouse events for desktop
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [onRefresh, threshold, isRefreshing, disabled]);

    const pullIndicatorStyle = {
        transform: `translateY(${isPulling ? Math.min(pullDistance, threshold * 1.5) : -100}px)`,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out',
    };

    const rotation = pullDistance > 0 ? Math.min((pullDistance / threshold) * 360, 360) : 0;

    return {
        isPulling,
        pullDistance,
        isRefreshing,
        pullIndicatorStyle,
        rotation,
        shouldShow: pullDistance > 10 || isRefreshing,
    };
}
