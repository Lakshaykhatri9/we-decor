import Link from "next/link";

const groups = [
  { title: "Explore", links: [["Shop", "/shop"], ["Interior Design", "/interior-design"], ["Event Decor", "/event-decor"], ["Corporate", "/b2b"]] },
  { title: "Help & policies", links: [["Contact", "/contact"], ["Shipping", "/shipping-policy"], ["Returns & refunds", "/return-policy"], ["Warranty", "/warranty"]] },
  { title: "Information", links: [["Terms", "/terms"], ["Privacy", "/privacy-policy"], ["Interior terms", "/interior-terms"], ["Event terms", "/event-terms"], ["B2B terms", "/b2b-terms"]] },
];

export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top"><div className="footer-brand"><Link href="/" className="brand-lockup"><span className="brand-mark">W</span><span><strong>WE DECOR 4U</strong><small>INTERIORS · CELEBRATIONS</small></span></Link><p>Considered interiors and memorable celebrations, made personal.</p></div>
      {groups.map((group) => <div className="footer-group" key={group.title}><h3>{group.title}</h3>{group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>)}
      <div className="footer-group"><h3>Stay connected</h3>{process.env.INSTAGRAM_URL && <a href={process.env.INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram ↗</a>}{process.env.PINTEREST_URL && <a href={process.env.PINTEREST_URL} target="_blank" rel="noreferrer">Pinterest ↗</a>}{process.env.FACEBOOK_URL && <a href={process.env.FACEBOOK_URL} target="_blank" rel="noreferrer">Facebook ↗</a>}</div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} WE DECOR 4U</span><span>Made for the moments and spaces that matter.</span><Link href="/b2b-terms">Business enquiries</Link></div>
  </footer>;
}
