import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "B2B terms", description: "Corporate quote, purchase order, inspection, delivery and payment terms." };

export default function B2BTermsPage() {
  return <PolicyPage eyebrow="BUSINESS TERMS" title="Clear scope for business projects." intro="Each corporate or bulk order is governed by its written quotation, purchase order acceptance and project confirmation." sections={[
    { title: "Quote and purchase order", paragraphs: ["The quote records product specifications, quantity, price, applicable taxes, quote validity and payment milestones. A formal purchase order should identify the company, billing details, GSTIN where applicable and delivery locations.", "Tax invoices and e-way bills are provided where applicable to the transaction and required business details are supplied."] },
    { title: "Inspection and sign-off", paragraphs: ["Factory or site inspections, sample approvals and sign-off stages are included only when listed in the written quote. The project confirmation records any inspection acceptance criteria."] },
    { title: "Payment, freight and installation", paragraphs: ["Payment milestones, freight and transit terms, delivery, installation and warranty scope are confirmed in the approved quote. Do not rely on a verbal estimate in place of written project terms."] },
    { title: "Warranty", paragraphs: ["Product and installation warranty coverage is limited to the terms stated for the relevant product or project. OEM components follow the applicable OEM policy."] },
  ]} />;
}
