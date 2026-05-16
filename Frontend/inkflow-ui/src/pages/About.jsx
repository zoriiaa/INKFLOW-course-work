import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import '../styles/About.css';

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
                <div className="about-mission__text">
                    <div className="about-mission__eyebrow">НАША МІСІЯ</div>
                    <p className="about-mission__body">
                        Прибрати все зайве між вашою ідеєю та папером.
                        Тільки ідеальна подача чорнил, ергономіка
                        та стійкість.
                    </p>
                    <p className="about-mission__body about-mission__body--light">
                        Кожен інструмент, що потрапляє на полицю INKFLOW,
                        проходить ретельний відбір. Ми не продаємо «достатньо хороше».
                        Ми продаємо те, чим ілюстратори та дизайнери
                        користуються самі.
                    </p>
                    <div className="about-mission__line" />
                    <div className="about-mission__stat">
                        <span className="about-mission__num">5+</span>
                        <span className="about-mission__stat-label">преміальних брендів</span>
                    </div>
                </div>
                <div className="about-mission__photo-wrap">
                    <img
                        src="/about_collage.jpg"
                        alt="INKFLOW — скетчинг та каліграфія"
                        className="about-mission__photo"
                    />
                    <div className="about-mission__photo-caption">by @zoroo.art</div>
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
                            Серед тих, кого ми поважаємо — <strong>@zoroo.art</strong>.
                        </p>
                    </div>
                </div>
            </section>

            <section className="about-quote">
                <div className="about-quote__inner">
                    <div className="about-quote__mark" aria-hidden="true">"</div>
                    <blockquote className="about-quote__text">
                        Чорнила течуть — мистецтво залишається.
                    </blockquote>
                    <div className="about-quote__source">— INKFLOW, KYIV 2026</div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}