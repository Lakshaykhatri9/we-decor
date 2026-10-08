import LeadForm from "@/components/LeadForm";

export const metadata = { title: "Contact us", description: "Contact WE DECOR 4U about interiors, event decor, products and corporate projects." };

function Detail({ label, value, href }) {
  if (!value) return null;
  return <div className="contact-detail"><span>{label}</span>{href ? <a href={href}>{value}</a> : <strong>{value}</strong>}</div>;
}

export default function ContactPage() {
  return <main className="contact-page page-width"><div className="page-intro"><span className="eyebrow">WE’RE HERE TO HELP</span><h1>Good things start with a conversation.</h1><p>Tell us about your space, celebration, order or business requirement.</p></div>
    <div className="contact-layout"><section className="contact-info"><h2>Talk to our team</h2><p>For projects and product enquiries, share a note and the team can follow up.</p><Detail label="Phone" value={process.env.BUSINESS_PHONE} href={process.env.BUSINESS_PHONE ? `tel:${process.env.BUSINESS_PHONE}` : undefined} /><Detail label="Email" value={process.env.BUSINESS_EMAIL} href={process.env.BUSINESS_EMAIL ? `mailto:${process.env.BUSINESS_EMAIL}` : undefined} /><Detail label="Address" value={process.env.BUSINESS_ADDRESS} /><Detail label="Support hours" value={process.env.SUPPORT_HOURS} />{!process.env.BUSINESS_PHONE && !process.env.BUSINESS_EMAIL && <div className="notice notice-info">Business phone, email and address have not been configured yet. Your enquiry form is available when the database is connected.</div>}</section><LeadForm kind="contact" submitLabel="Send message" /></div>
  </main>;
}
