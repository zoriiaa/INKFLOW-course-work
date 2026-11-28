import { useEffect, useRef } from 'react';
import './Toast.css';

export default function Toast({ message, type = 'info', onClose }) {
    const touchStartX = useRef(null);
    const closeRef = useRef(onClose);

    useEffect(() => {
        closeRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const timer = setTimeout(() => closeRef.current(), 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleTouchStart = event => {
        touchStartX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = event => {
        if (touchStartX.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(distance) > 40) onClose();
        touchStartX.current = null;
    };

    return (
        <div
            className={`app-toast app-toast--${type}`}
            role={type === 'error' ? 'alert' : 'status'}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <span>{message}</span>
            <button type="button" onClick={onClose} aria-label="Закрити повідомлення">×</button>
        </div>
    );
}
