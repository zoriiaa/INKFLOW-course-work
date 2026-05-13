import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import manuscriptPhoto from '../assets/images/brands/ManuscriptPhoto.svg';
import sakuraPhoto from '../assets/images/brands/SakuraPhoto.svg';
import copicPhoto from '../assets/images/brands/CopicPhoto.svg';
import faberPhoto from '../assets/images/brands/FaberCastellPhoto.svg';
import poscaPhoto from '../assets/images/brands/PoscaPhoto.svg';
import './Brands.css';

const BRAND_CARDS = [
    { name: 'Manuscript', image: manuscriptPhoto, text: 'Британський бренд для каліграфії та графіки.' },
    { name: 'Sakura', image: sakuraPhoto, text: 'Японська точність і культові лінери Pigma.' },
    { name: 'COPIC', image: copicPhoto, text: 'Професійні спиртові маркери з величезною палітрою.' },
    { name: 'Faber-Castell', image: faberPhoto, text: 'Класичні олівці та інструменти для скетчингу.' },
    { name: 'POSCA', image: poscaPhoto, text: 'Яскраві акрилові маркери для різних поверхонь.' },
];

export default function Brands() {
    const navigate = useNavigate();

    const openBrand = (brandName) => {
        navigate(`/catalog?brand=${encodeURIComponent(brandName)}`);
    };

    return (
        <div className="brands-page">
            <SiteHeader />
            <main className="brands-container">
                <h1>БРЕНДИ</h1>
                <p>Наведи на картку, щоб переглянути опис. Натискання відкриває каталог з фільтром бренду.</p>
                <div className="brands-cards-grid">
                    {BRAND_CARDS.map(card => (
                        <button
                            key={card.name}
                            className="brands-card"
                            onClick={() => openBrand(card.name)}
                            type="button"
                        >
                            <img src={card.image} alt={card.name} />
                            <div className="brands-card__overlay">
                                <h3>{card.name}</h3>
                                <p>{card.text}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
