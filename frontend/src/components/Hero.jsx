import React from 'react'
import '../styles/hero.css'

const Hero = ({ title, image, buttonText, onButtonClick }) => {
  return (
    <section className="hero" style={{ backgroundImage: `url('${image}')` }}>
      <div className="hero-content">
        <h2 className="highlighted">{title}</h2>
        <button onClick={onButtonClick}>{buttonText}</button>
      </div>
    </section>
  )
}

export default Hero
