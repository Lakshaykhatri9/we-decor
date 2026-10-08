export default function ServicePageHero({ eyebrow, title, description, image, ctaHref, ctaLabel }) {
  return <section className="service-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(12,30,26,.78), rgba(12,30,26,.25)), url('${image}')` }}>
    <div className="service-hero-copy"><span className="eyebrow eyebrow-light">{eyebrow}</span><h1>{title}</h1><p>{description}</p><a className="button button-cream" href={ctaHref}>{ctaLabel}</a></div>
  </section>;
}
