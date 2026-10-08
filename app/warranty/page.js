import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Warranty policy", description: "Warranty information for custom woodwork, hardware, fittings and appliances." };

export default function WarrantyPage() {
  return <PolicyPage title="Warranty policy" intro="Warranty coverage depends on the product, installation and written project documents. Please keep the order confirmation and warranty information supplied at handover." sections={[
    { title: "Custom woodwork", paragraphs: ["Applicable custom woodwork may carry up to 10 years of warranty for manufacturing or installation defects. The actual coverage, start date, exclusions and claim process are those stated in the written warranty for the project."] },
    { title: "Hardware, fittings and appliances", paragraphs: ["Hardware, fittings and appliances are covered under the applicable original equipment manufacturer’s warranty. Keep the OEM warranty card, invoice and serial details where supplied."] },
    { title: "Maintenance", paragraphs: ["One complimentary maintenance visit is available within the applicable period stated in the project documents. Additional maintenance visits are chargeable according to the business policy."] },
    { title: "How to request help", paragraphs: ["Contact the business with your order reference, product or project details, a description of the issue and supporting photos. The team will review the issue against the applicable warranty before confirming next steps."] },
  ]} />;
}
