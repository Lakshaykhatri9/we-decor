import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Event decor terms", description: "Booking, setup, venue access and cancellation terms for event decor." };

export default function EventTermsPage() {
  return <PolicyPage eyebrow="EVENT BOOKING TERMS" title="A celebration with clear details." intro="The approved event proposal records the selected decor, venue, date, scope and any project-specific terms." sections={[
    { title: "Booking and payment", paragraphs: ["A 20% non-refundable deposit reserves the booking.", "For applicable custom props, florals and fabrication, 50% is due 15 days before the event. The remaining 30% is due on-site before final lighting and execution. The proposal confirms the amounts and due dates for the booking."] },
    { title: "Setup and walkthrough", paragraphs: ["Setup usually takes place 12–48 hours before the event depending on venue access. A final walkthrough is planned at least 2 hours before the event where applicable. The confirmed schedule depends on venue access and the agreed scope."] },
    { title: "Venue responsibilities", items: ["The client arranges required venue permissions and sound permits.", "The client provides loading access, continuous power and venue access at agreed times.", "Any venue restrictions that affect setup or teardown should be shared before the event."] },
    { title: "Cancellation and decor items", paragraphs: ["The 20% booking deposit is non-refundable. Any additional cancellation terms are stated in the event proposal or booking confirmation.", "The client is responsible for decor items that are damaged or missing while under the client’s or venue’s control, as described in the approved proposal and handover record."] },
  ]} />;
}
