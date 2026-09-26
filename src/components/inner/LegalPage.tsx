import Link from 'next/link'

type Section = {
  title: string
  intro?: string | null
  body?: string | null
  items?: { text: string }[] | null
}

function linkedText(value: string, email: string) {
  const index = value.indexOf(email)
  return index < 0 ? (
    value
  ) : (
    <>
      {value.slice(0, index)}
      <a href={`mailto:${email}`} className="text-accent underline underline-offset-4">
        {email}
      </a>
      {value.slice(index + email.length)}
    </>
  )
}

export function LegalPage({
  heading,
  sections,
  email,
  eyebrow,
  onThisPage,
  contactLine,
}: {
  heading: string
  sections: Section[]
  email: string
  eyebrow: string
  onThisPage: string
  contactLine: string
}) {
  return (
    <main id="main-content" className="inner-page legal-page">
      <div className="legal-content section-shell">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="section-heading">{heading}</h1>
        <div className="legal-grid">
          <aside aria-label={onThisPage}>
            <p>{onThisPage}</p>
            <ol>
              {sections.map((section, index) => (
                <li key={index}>
                  <a href={`#section-${index + 1}`}>
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>
          <div>
            {sections.map((section, index) => (
              <section id={`section-${index + 1}`} className="legal-section" key={index}>
                <h2>
                  {index + 1}. {section.title}
                </h2>
                {section.intro && <p>{linkedText(section.intro, email)}</p>}
                {section.body && <p>{linkedText(section.body, email)}</p>}
                {section.items?.length ? (
                  <ul>
                    {section.items.map((item, i) => (
                      <li key={i}>{linkedText(item.text, email)}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
        <p className="legal-contact">
          {contactLine} <Link href="/contact-us">Contact us</Link>
        </p>
      </div>
    </main>
  )
}
