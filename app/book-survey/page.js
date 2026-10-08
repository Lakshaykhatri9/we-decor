import BookingForm from "@/components/BookingForm";

export const metadata = { title: "Book a site survey", description: "Request a site survey and interior consultation with WE DECOR 4U." };

export default function BookSurveyPage() {
  return <main className="booking-page page-width"><div className="page-intro"><span className="eyebrow">START WITH THE SPACE</span><h1>Let’s see what’s possible.</h1><p>Tell us a little about your home and project. We’ll follow up to discuss timing and the next step.</p></div><div className="booking-form-wrap"><BookingForm kind="interior" /></div></main>;
}
