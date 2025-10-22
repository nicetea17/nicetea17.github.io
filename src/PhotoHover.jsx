import React from "react";
import "./PhotoHover.css";

export default function PhotoHover({ images }) {
  return (
    <div className="ph-wrapper">
      <div className="ph-grid">
        {images.map((img, i) => (
          <div className="ph-card" key={i}>
            <img src={img.src} alt={img.alt || `photo-${i}`} className="ph-img" />
            <div
              className="ph-overlay"
              style={{ "--bg-url": `url(${img.src})` }}
            >
              <div className="ph-text">{img.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
