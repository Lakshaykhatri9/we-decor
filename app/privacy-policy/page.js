import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Privacy policy", description: "How WE DECOR 4U handles information submitted through the website." };

export default function PrivacyPolicyPage() {
  return <PolicyPage title="Privacy policy" intro="This page describes the information this website receives and how it is used to operate the catalog, respond to enquiries and fulfil orders. Business contact details and jurisdiction-specific notices should be added before launch." sections={[
    { title: "Information you provide", paragraphs: ["When you send a booking or contact form, the site collects the details you enter, such as your name, email, phone number, location, dates and project requirements. Checkout collects customer, delivery and order information needed to prepare and fulfil the order.", "The application stores enquiry, booking and order records in the configured MongoDB database. Do not submit sensitive information that is not requested by the form."] },
    { title: "Payments", paragraphs: ["When configured, Razorpay processes online payments. The site stores order and payment references and verification status; it does not store card numbers or UPI credentials. Payment processing is subject to the provider’s own terms and privacy practices."] },
    { title: "Cookies and analytics", paragraphs: ["Essential browser storage remembers the shopping bag and chosen delivery country. Optional analytics are enabled only after consent when the relevant Google Analytics or Meta Pixel IDs are configured. Purchase tracking is sent only after backend payment verification."] },
    { title: "External media and services", paragraphs: ["Product and editorial images may be loaded from their configured image hosts, which can receive standard request information such as your IP address. When enabled, payments and analytics are handled by their respective providers under their own terms."] },
    { title: "Sharing and retention", paragraphs: ["Information may be processed by the configured database, hosting, payment and analytics providers to provide the requested service. Order and enquiry records are retained as needed to handle the enquiry, fulfil the order and meet applicable business record requirements. Specific retention periods and legal bases should be set by the business before launch."] },
    { title: "Your choices", paragraphs: ["You can decline optional analytics using the cookie banner. To ask about or correct information submitted through the website, contact the business using its published contact details. Those details must be configured before launch."] },
  ]} />;
}
