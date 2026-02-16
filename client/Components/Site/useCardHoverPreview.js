import { useState } from 'react';

const clampPosition = (event, panelWidth, panelHeight) => {
    const margin = 12;
    const viewportWidth = window.innerWidth || 0;
    const viewportHeight = window.innerHeight || 0;
    const startX = (event?.clientX || 0) + 12;
    const startY = (event?.clientY || 0) + 12;
    const maxX = Math.max(margin, viewportWidth - panelWidth - margin);
    const maxY = Math.max(margin, viewportHeight - panelHeight - margin);

    return {
        x: Math.min(startX, maxX),
        y: Math.min(startY, maxY)
    };
};

const useCardHoverPreview = () => {
    const [previewCard, setPreviewCard] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const showCardPreview = (card, event) => {
        if (!card) {
            return;
        }

        setPosition(clampPosition(event, 290, 420));
        setPreviewCard(card);
    };

    const moveCardPreview = (event) => {
        if (!previewCard) {
            return;
        }

        setPosition(clampPosition(event, 290, 420));
    };

    const hideCardPreview = () => setPreviewCard(null);

    return {
        hideCardPreview,
        moveCardPreview,
        position,
        previewCard,
        showCardPreview
    };
};

export default useCardHoverPreview;
