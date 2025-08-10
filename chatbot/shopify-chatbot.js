/* כפתור גלילה למעלה - עיצוב חדש תואם לצ'אטבוט */

#scroll__top {
    position: fixed;
    bottom: 120px; /* מעל הצ'אטבוט */
    right: 25px;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #000000 0%, #333333 100%);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.15),
        0 0 20px rgba(0, 0, 0, 0.1);
    z-index: 97; /* מתחת לצ'אטבוט */
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
}

#scroll__top.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

#scroll__top:hover {
    background: linear-gradient(135deg, #333333 0%, #555555 100%);
    transform: translateY(-2px);
    box-shadow: 
        0 6px 20px rgba(0, 0, 0, 0.2),
        0 0 30px rgba(0, 0, 0, 0.15);
}

#scroll__top svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    transition: transform 0.2s ease;
}

#scroll__top:hover svg {
    transform: translateY(-1px);
}

/* התאמה למכשירים ניידים */
@media (max-width: 480px) {
    #scroll__top {
        right: 20px;
        bottom: 90px; /* מותאם למיקום הצ'אטבוט במובייל */
        width: 44px;
        height: 44px;
    }
    
    #scroll__top svg {
        width: 18px;
        height: 18px;
    }
}

@media (max-width: 360px) {
    #scroll__top {
        right: 15px;
        bottom: 85px;
    }
}

/* אנימציית הופעה רכה */
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

#scroll__top.active {
    animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* אפקט ריפל בלחיצה */
#scroll__top:active {
    transform: scale(0.95);
}

/* אפקט פעימת לב עדין */
@keyframes gentlePulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.02);
    }
}

#scroll__top.active:not(:hover) {
    animation: gentlePulse 3s ease-in-out infinite;
}
