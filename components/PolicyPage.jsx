export default function PolicyPage({ eyebrow = "THE DETAILS", title, intro, sections = [] }) {
  return <main className="policy-page page-width">
    <div className="policy-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div>
    <div className="policy-content">{sections.map((section) => <section className="policy-section" key={section.title}><h2>{section.title}</h2>{section.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}</div>
    <p className="policy-contact">Questions about this page? Visit <a href="/contact">Contact</a> or <a href="/book-survey">send a project enquiry</a>.</p>
  </main>;
}
