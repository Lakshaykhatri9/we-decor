import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Return & refund policy", description: "Returns, damage reporting and refund eligibility for WE DECOR 4U products." };

export default function ReturnPolicyPage() {
  return <PolicyPage title="Return & refund policy" intro="We want you to receive the product described in your order. Return eligibility depends on whether an item is standard stock, custom-made or covered by an OEM policy." sections={[
    { title: "Standard stock products", paragraphs: ["Where applicable, standard stock products may be eligible for a return for damage or defect reported within 7 days of delivery. Contact us with the order reference, a description of the issue and clear photographs so eligibility and next steps can be reviewed.", "A return should be arranged only after WE DECOR 4U confirms the process. Keep the product and packaging available for inspection or collection where requested."] },
    { title: "Custom-made products", paragraphs: ["Custom-made products become non-refundable after production or wood cutting has started. Any applicable approval, specification and production start are recorded in the written quote or order confirmation."] },
    { title: "OEM products and remedies", paragraphs: ["Appliances, hardware and fittings follow the applicable original equipment manufacturer’s defect, replacement and warranty policy. The manufacturer’s terms apply to those components.", "A refund, replacement or other remedy is confirmed after the product and issue have been reviewed under the applicable policy. This page does not promise a remedy outside those terms."] },
    { title: "Interior and event projects", paragraphs: ["Interior project cancellation terms are set out in the signed project agreement. The 10% booking advance for site measurements and measurement-based designs is non-refundable.", "Event decor bookings require a 20% non-refundable deposit. Any further cancellation terms are stated in the event proposal or booking confirmation."] },
  ]} />;
}
