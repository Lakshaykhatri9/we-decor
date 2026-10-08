import Link from "next/link";
import ServicePageHero from "@/components/ServicePageHero";
import BookingForm from "@/components/BookingForm";

export const metadata = { title: "Interior design", description: "Thoughtful modular kitchens and complete home interiors designed around the way you live." };

const services = ["Modular kitchens", "Wardrobes", "Living rooms", "Bedrooms", "Complete home interiors"];
const steps = [
  ["Listen", "We understand your routines, needs, site and budget before shaping the brief."],
  ["Design", "Layouts, material directions and 3D views are prepared for your review and sign-off."],
  ["Build", "Work begins after the design, contract and applicable payment milestone are in place."],
  ["Handover", "We review completed work together and share applicable care and warranty information."],
];

export default function InteriorDesignPage() {
  return <>
    <ServicePageHero eyebrow="INTERIORS, MADE PERSONAL" title="A home that feels like yours." description="Premium modular kitchens and complete-home interiors, thoughtfully planned around your life." image="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=90" ctaHref="#consultation" ctaLabel="Book interior consultation" />
    <section className="section page-width"><div className="section-heading"><div><span className="eyebrow">THE INTERIOR STUDIO</span><h2>Rooms that work hard<br />and feel easy.</h2></div><p>From the first measurement to the final fitting, each decision is made with your home, habits and priorities in mind.</p></div><div className="service-list">{services.map((service, index) => <article key={service}><span>0{index + 1}</span><h3>{service}</h3><p>Designed and detailed to suit the way you use the space.</p></article>)}</div></section>
    <section className="interior-process"><div className="page-width"><span className="eyebrow eyebrow-light">HOW IT WORKS</span><h2>Clear steps.<br />Considered decisions.</h2><div className="process-grid">{steps.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className="section page-width interior-business"><div><span className="eyebrow">PROJECT DETAILS</span><h2>A clear plan from day one.</h2><p>Interior projects start at ₹1,50,000. The quote and signed works contract set the scope, delivery schedule and applicable terms for your project.</p><p>The delivery timeline starts after signed design sign-off, an executed works contract and receipt of the required second installment.</p><Link href="/interior-terms" className="text-link">Read interior terms →</Link></div><div className="milestone-card"><h3>Payment milestones</h3><p><strong>Design &amp; woodwork</strong><br />10% design initiation · 50% woodwork order · 30% site delivery · 10% completion / handover</p><p><strong>Civil works</strong><br />50% work order · 40% material delivery · 10% completion / handover</p><p><strong>Loose furniture &amp; appliances</strong><br />100% advance before order</p><p><strong>Warranty &amp; care</strong><br />Applicable woodwork warranty up to 10 years · OEM warranty for hardware/appliances · one complimentary maintenance visit within the applicable period</p><p><strong>Cancellation</strong><br />10% booking advance is non-refundable; further terms are recorded in the signed project agreement.</p><small>Applicable taxes and project-specific terms are shown in the written quote.</small></div></section>
    <section className="booking-section" id="consultation"><div className="page-width booking-layout"><div><span className="eyebrow eyebrow-light">LET’S BEGIN</span><h2>Bring us your ideas.</h2><p>Share a few details and we’ll follow up about your interior consultation or site survey.</p><p className="booking-note">A 10% non-refundable booking advance starts site measurements and measurement-based designs.</p><Link href="/interior-terms" className="text-link text-link-light">View project terms →</Link></div><BookingForm kind="interior" /></div></section>
  </>;
}
