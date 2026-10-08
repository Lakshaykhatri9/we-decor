import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export const metadata = { title: "Corporate & B2B", description: "Furniture, interiors and custom sourcing for offices, hotels, restaurants and corporate teams." };

const services = ["Bulk orders", "Corporate furniture", "Office interiors", "Hotel furniture", "Restaurant requirements"];
const process = ["Share your requirement and quantity", "Review specifications, finish and site needs", "Confirm a written quote, PO and milestones", "Inspect, deliver and install to the agreed scope"];

export default function B2BPage() {
  return <>
    <section className="b2b-hero"><div className="page-width b2b-hero-copy"><span className="eyebrow eyebrow-light">WE DECOR 4U · BUSINESS</span><h1>Spaces at work,<br />made to work.</h1><p>Furniture and interior solutions for teams, hospitality spaces and businesses.</p><a href="#quote" className="button button-cream">Request corporate quote ↗</a></div></section>
    <section className="section page-width"><div className="section-heading"><div><span className="eyebrow">BUSINESS SOLUTIONS</span><h2>Built around your brief.</h2></div><p>From one location to a multi-site requirement, we work from approved specifications and project terms.</p></div><div className="service-list">{services.map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3><p>Scope, delivery and installation are confirmed in the project quote.</p></article>)}</div></section>
    <section className="b2b-process"><div className="page-width"><span className="eyebrow eyebrow-light">A CLEAR PROCESS</span><h2>From first brief to handover.</h2><div className="process-grid">{process.map((item, index) => <article key={item}><span>0{index + 1}</span><p>{item}</p></article>)}</div><p className="b2b-capabilities">Project scope can include formal PO, GSTIN and tax invoice, e-way bills where applicable, factory or site inspection, freight, delivery, installation, warranty and agreed payment milestones.</p></div></section>
    <section className="booking-section" id="quote"><div className="page-width booking-layout"><div><span className="eyebrow eyebrow-light">CORPORATE ENQUIRIES</span><h2>Let’s talk requirements.</h2><p>Send your company details and a short brief. The quote will confirm specifications, applicable taxes, delivery and payment terms.</p><Link href="/b2b-terms" className="text-link text-link-light">Read B2B terms →</Link></div><LeadForm kind="b2b" submitLabel="Request corporate quote" /></div></section>
  </>;
}
