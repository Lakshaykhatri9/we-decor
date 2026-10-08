import Link from "next/link";
import ServicePageHero from "@/components/ServicePageHero";
import BookingForm from "@/components/BookingForm";

export const metadata = { title: "Event decor", description: "Personal event decoration for weddings, birthdays, corporate gatherings and custom celebrations." };

const offerings = ["Wedding decoration", "Birthday celebrations", "Corporate events", "Stage decoration", "Floral styling", "Lighting", "Custom events", "Event packages"];

export default function EventDecorPage() {
  return <>
    <ServicePageHero eyebrow="GATHER BEAUTIFULLY" title="A setting for your story." description="Personal event decor for the occasions you’ll remember long after the last light goes out." image="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=90" ctaHref="#event-booking" ctaLabel="Book event decor" />
    <section className="section page-width"><div className="section-heading"><div><span className="eyebrow">OUR EVENT STUDIO</span><h2>Little details.<br />Lasting memories.</h2></div><p>Thoughtful styling across the setting, from florals and stage details to lighting and guest spaces.</p></div><div className="service-list event-offerings">{offerings.map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3><p>Customised to your event brief, venue and approved proposal.</p></article>)}</div></section>
    <section className="event-info"><div className="page-width event-info-grid"><div><span className="eyebrow eyebrow-light">A SMOOTH CELEBRATION</span><h2>Thought through,<br />before the day.</h2><p>We plan around venue access and event timing, then walk through the setup before your guests arrive.</p></div><div className="event-info-card"><h3>Planning notes</h3><p><strong>Setup:</strong> Usually 12–48 hours before the event, depending on venue access.</p><p><strong>Final walkthrough:</strong> At least 2 hours before the event where applicable.</p><p><strong>Booking:</strong> 20% non-refundable deposit to reserve the date.</p><p><strong>Custom work:</strong> 50% is due 15 days before the event for applicable custom props, floral and fabrication. 30% is due on-site before final lighting and execution.</p><Link href="/event-terms" className="text-link text-link-light">Read event terms →</Link></div></div></section>
    <section className="booking-section" id="event-booking"><div className="page-width booking-layout"><div><span className="eyebrow eyebrow-light">MAKE IT A MOMENT</span><h2>Tell us what you’re celebrating.</h2><p>Share your event date, venue and vision to start a conversation.</p></div><BookingForm kind="event" /></div></section>
  </>;
}
