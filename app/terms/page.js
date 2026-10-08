import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Terms & conditions", description: "General terms for the WE DECOR 4U website, catalog and orders." };

export default function TermsPage() {
  return <PolicyPage title="Terms & conditions" intro="These terms explain how the website, catalog and order process work. A written quote, order confirmation or signed project agreement may include additional terms for the relevant purchase or service." sections={[
    { title: "Product information and prices", paragraphs: ["Product details, images, stock and prices are published from the store catalog. Availability can change before an order is confirmed. The server checks the current product price and stock when preparing checkout.", "Catalog prices are displayed in INR as the base currency. Checkout displays the configured destination currency, tax and shipping when those settings are available. A custom quote is governed by its stated scope and validity, if any."] },
    { title: "Orders and payment", paragraphs: ["Submitting an order request does not by itself confirm successful payment. An online order is marked paid only after the payment gateway has verified and captured payment. Orders may be reviewed before dispatch or project scheduling.", "Payment methods are shown only when enabled for the store. Payment availability may depend on the customer’s country and the payment provider."] },
    { title: "Services and project documents", paragraphs: ["Interior design, event decor and corporate work are governed by the relevant written proposal, scope, milestone schedule and applicable service terms. Work begins only after the required sign-off and payment milestones described in those documents."] },
    { title: "Website use", paragraphs: ["Please provide accurate contact and delivery details and use the website lawfully. Website content and product imagery should not be reused without permission."] },
    { title: "Questions", paragraphs: ["For help with a product, order or service, use the contact page and include the relevant order or proposal reference."] },
  ]} />;
}
