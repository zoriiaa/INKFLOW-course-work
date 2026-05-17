import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import '../styles/About.css';
import SakuraLogo from '../assets/images/brands/SakuraLogo.svg';
import PoscaLogo from '../assets/images/brands/PoscaLogo.svg';
import ManuscriptLogo from '../assets/images/brands/ManuscriptLogo.svg';
import KohINoorLogo from '../assets/images/brands/KohINoorLogo.svg';
import FaberCastellLogo from '../assets/images/brands/FaberCastellLogo.svg';
import CopicLogo from '../assets/images/brands/CopicLogo.svg';
import CarandacheLogo from '../assets/images/brands/CarandacheLogo.svg';
import DerwentLogo from '../assets/images/brands/DerwentLogo.svg';
import FabrianoLogo from '../assets/images/brands/FabrianoLogo.svg';
import RotringLogo from '../assets/images/brands/RotringLogo.svg';

const partnerLogos = [
    { name: 'Sakura', src: SakuraLogo, forceBlack: false },
    { name: 'Posca', src: PoscaLogo, forceBlack: false },
    { name: 'Manuscript', src: ManuscriptLogo, forceBlack: true },
    { name: 'Koh-I-Noor', src: KohINoorLogo, forceBlack: false },
    { name: 'Faber-Castell', src: FaberCastellLogo, forceBlack: true },
    { name: 'Copic', src: CopicLogo, forceBlack: false },
    { name: 'Carandache', src: CarandacheLogo, forceBlack: false },
    { name: 'Derwent', src: DerwentLogo, forceBlack: false },
    { name: 'Fabriano', src: FabrianoLogo, forceBlack: false },
    { name: 'Rotring', src: RotringLogo, forceBlack: false },
];

export default function About() {
    return (
        <div className="about-page">
            <SiteHeader />

            <section className="about-hero">
                <div className="about-hero__inner">
                    <div className="about-hero__label">KYIV — 2026</div>
                    <h1 className="about-hero__title">
                        INKFLOW.<br />
                        СТВОРЕНО ДЛЯ ТИХ,<br />
                        ХТО МИСЛИТЬ<br />
                        ЛІНІЯМИ.
                    </h1>
                    <p className="about-hero__sub">
                        Бренд засновано в Києві у 2026 році — для архітекторів, каліграфістів
                        та ілюстраторів, які вимагають від інструментів абсолютної
                        безкомпромісної якості.
                    </p>
                </div>
                <div className="about-hero__deco" aria-hidden="true">
                    <span className="about-hero__deco-word">INK</span>
                    <span className="about-hero__deco-word">FLOW</span>
                </div>
            </section>

            <section className="about-mission">
                <div className="about-mission__label">НАША МІСІЯ</div>
                <div className="about-mission__layout">
                    <div className="about-mission__left">
                        <p className="about-mission__headline">
                            Прибрати все зайве між вашою ідеєю та папером.
                        </p>
                    </div>
                    <div className="about-mission__right">
                        <p className="about-mission__body">
                            Кожен інструмент, що потрапляє на полицю INKFLOW,
                            проходить ретельний відбір. Ми не продаємо «достатньо хороше».
                            Ми продаємо те, чим ілюстратори та дизайнери
                            користуються самі.
                        </p>
                        <p className="about-mission__body">
                            Тільки ідеальна подача чорнил, ергономіка та стійкість —
                            інструменти, яким можна довіряти найважливіші роботи.
                        </p>
                        <div className="about-mission__stat">
                            <span className="about-mission__num">5+</span>
                            <span className="about-mission__stat-label">преміальних брендів у каталозі</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-partners" aria-label="Наші партнери">
                <div className="about-partners__header">
                    <span>НАШІ ПАРТНЕРИ</span>
                    <span>БРЕНДИ, ЯКІ МИ ОБИРАЄМО</span>
                </div>
                <div className="about-partners__marquee">
                    <div className="about-partners__track">
                        {[...partnerLogos, ...partnerLogos].map((brand, index) => (
                            <div className="about-partners__item" key={`${brand.name}-${index}`}>
                                <img
                                    src={brand.src}
                                    alt={brand.name}
                                    className="about-partners__logo"
                                    style={brand.forceBlack ? { filter: 'brightness(0)' } : undefined}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="about-values">
                <div className="about-values__eyebrow">ЩО НАС ВИЗНАЧАЄ</div>
                <div className="about-values__grid">
                    <div className="about-values__card">
                        <span className="about-values__num">01</span>
                        <h3 className="about-values__heading">ЯКІСТЬ</h3>
                        <p className="about-values__desc">
                            Архівна стійкість чорнил — не вицвітає роками.
                            Матеріали, яким можна довіряти найважливіші роботи.
                        </p>
                    </div>
                    <div className="about-values__card">
                        <span className="about-values__num">02</span>
                        <h3 className="about-values__heading">СУВОРІСТЬ</h3>
                        <p className="about-values__desc">
                            Мінімалістичні корпуси, що не відволікають від творчості.
                            Дизайн інструменту служить руці, а не навпаки.
                        </p>
                    </div>
                    <div className="about-values__card">
                        <span className="about-values__num">03</span>
                        <h3 className="about-values__heading">СПІЛЬНОТА</h3>
                        <p className="about-values__desc">
                            Підтримка локальних українських художників та авторів.
                        </p>
                    </div>
                </div>
            </section>

            <section className="about-quote">
                <div className="about-quote__inner">
                    <div className="about-quote__mark" aria-hidden="true">"</div>
                    <blockquote className="about-quote__text">
                        Життя коротке, мистецтво — вічне
                    </blockquote>
                    <div className="about-quote__source">— Гіппократ</div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}