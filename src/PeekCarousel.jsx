import React, { useRef, useState, useEffect } from "react";
import "./PeekCarousel.css";

export default function PeekCarousel({ images = [], aspect = "3/2", peek = 80 }) {
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);

  // Update active index on scroll (closest snap)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cards = Array.from(el.querySelectorAll(".pc-card"));
        if (!cards.length) return;
        const center = el.scrollLeft + el.clientWidth / 2;
        const distances = cards.map((card) => {
          const rectLeft = card.offsetLeft + card.offsetWidth / 2;
          return Math.abs(rectLeft - center);
        });
        const idx = distances.indexOf(Math.min(...distances));
        setActive(idx);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToIndex = (idx) => {
    const el = scrollerRef.current;
    const card = el?.querySelectorAll(".pc-card")?.[idx];
    if (el && card) {
      el.scrollTo({
        left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  const prev = () => scrollToIndex(Math.max(0, active - 1));
  const next = () => scrollToIndex(Math.min(images.length - 1, active + 1));

  return (
    <div className="pc-wrap" style={{ "--peek": `${peek}px`, "--aspect": aspect }}>
      <button className="pc-arrow pc-left" onClick={prev} aria-label="Previous" disabled={active === 0}>
        ‹
      </button>

      <div className="pc-scroller" ref={scrollerRef}>
        <div className="pc-track">
          {images.map((src, i) => (
            <figure className={`pc-card ${i === active ? "is-active" : ""}`} key={i}>
              <img src={src} alt={`Slide ${i + 1}`} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>

      <button className="pc-arrow pc-right" onClick={next} aria-label="Next" disabled={active === images.length - 1}>
        ›
      </button>

      <div className="pc-dots" role="tablist" aria-label="Carousel Pagination">
        {images.map((_, i) => (
          <button
            key={i}
            className={`pc-dot ${i === active ? "is-active" : ""}`}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === active}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}
