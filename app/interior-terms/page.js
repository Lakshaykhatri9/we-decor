import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Interior design terms", description: "Project scope, payment stages, delivery, warranty and maintenance terms for interior work." };

export default function InteriorTermsPage() {
  return <PolicyPage eyebrow="INTERIOR PROJECT TERMS" title="A clear understanding for the whole project." intro="The signed design sign-off, works contract and project quote record the scope, schedule and payment terms. The points below describe the business rules supplied for interior projects." sections={[
    { title: "Minimum project value and booking", paragraphs: ["The minimum interior project value is ₹1,50,000. A 10% non-refundable booking advance starts site measurements and measurement-based designs."] },
    { title: "Design and woodwork milestones", items: ["10% at 3D design initiation.", "50% when the woodwork order is placed.", "30% when woodwork is delivered to site.", "10% at completion and handover."] },
    { title: "Civil work milestones", items: ["50% at civil work order.", "40% at material delivery.", "10% at completion and handover."] },
    { title: "Furniture, appliances and schedule", paragraphs: ["Loose furniture and appliances require 100% advance before order.", "The delivery timeline starts after signed design sign-off, execution of the works contract and receipt of the required second installment. The project quote records the expected schedule and any applicable delay compensation or exclusions."] },
    { title: "Warranty and maintenance", paragraphs: ["Applicable custom woodwork may carry up to 10 years of warranty for manufacturing or installation defects, as stated in the written warranty for the project. Hardware, fittings and appliances follow the OEM warranty.", "One complimentary maintenance visit is available within the applicable period stated in the project documents. Further maintenance is chargeable according to the business policy and project quote."] },
    { title: "Cancellation", paragraphs: ["The 10% booking advance is non-refundable. Any additional cancellation treatment and charges must be recorded in the signed project agreement before work begins."] },
  ]} />;
}
