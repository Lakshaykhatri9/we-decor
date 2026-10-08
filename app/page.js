import Link from "next/link";

const services = [
  { no: "01", title: "Interior design", copy: "Warm, considered homes shaped around your routines, light and lifestyle.", href: "/interior-design", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85" },
  { no: "02", title: "Event decor", copy: "An atmosphere that feels unmistakably yours, from first detail to last light.", href: "/event-decor", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85" },
  { no: "03", title: "The collection", copy: "Furniture and finishing touches selected to live beautifully every day.", href: "/shop", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85" },
];

export default function HomePage() {
  return <>
    <section className="home-hero">
      <div className="hero-image" role="img" aria-label="Sunlit modern living room with warm neutral finishes" />
      <div className="hero-content"><span className="eyebrow eyebrow-light">SPACES THAT FEEL LIKE YOU</span><h1>Luxury Interior<br />&amp; Modular Living</h1><p>Premium modular kitchens and interior solutions for your home.</p><div className="hero-actions"><Link href="/shop" className="button button-cream">Explore catalog <span>↗</span></Link><Link href="/book-survey" className="button button-ghost">Book site survey</Link></div></div>
      <div className="hero-caption"><span>01 / 03</span><span>Thoughtfully designed. Made to belong.</span></div>
    </section>
    <section className="intro-band page-width"><span className="eyebrow">A HOME, MORE YOU</span><p>Good design gives everyday moments a little more room to breathe. We bring interiors, meaningful objects and gatherings together with care.</p><Link href="/interior-design" className="text-link">Discover our approach →</Link></section>
    <section className="section page-width"><div className="section-heading"><div><span className="eyebrow">WHAT WE DO</span><h2>Make space for living.</h2></div><p>From the first sketch to the finishing details, we bring thoughtful design into the places and moments that matter.</p></div>
      <div className="service-cards">{services.map((service) => <article className="service-card" key={service.no}><Link href={service.href} className="service-card-image"><img src={service.image} alt="" loading="lazy" /><span>{service.no}</span></Link><div><h3><Link href={service.href}>{service.title}</Link></h3><p>{service.copy}</p><Link href={service.href} className="text-link">Explore <span>↗</span></Link></div></article>)}</div>
    </section>
    <section className="home-quote"><div className="quote-mark">“</div><p>Rooms should feel like they have always known you.</p><span>WE DECOR 4U · INTERIOR DESIGN</span></section>
    <section className="home-cta page-width"><div><span className="eyebrow">START WITH A CONVERSATION</span><h2>Every good space begins with a good question.</h2><p>Tell us what you’re imagining. We’ll help you find a considered way forward.</p></div><Link href="/book-survey" className="button button-dark">Book a consultation <span>↗</span></Link></section>
  </>;
}
