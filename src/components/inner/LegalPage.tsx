import Link from 'next/link'

type Section = {
  title: string
  intro?: string | null
  body?: string | null
  items?: { text: string }[] | null
}

function linkedText(value: string) {
  const email = 'itusaha@itusaha.com'
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

export function LegalPage({ heading, sections }: { heading: string; sections: Section[] }) {
  return (
    <main id="main-content" className="inner-page legal-page section-shell">
      <p className="eyebrow">Company policies</p>
      <h1 className="section-heading">{heading}</h1>
      <div className="legal-grid">
        <aside aria-label="On this page">
          <p>On this page</p>
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
              {section.intro && <p>{linkedText(section.intro)}</p>}
              {section.body && <p>{linkedText(section.body)}</p>}
              {section.items?.length ? (
                <ul>
                  {section.items.map((item, i) => (
                    <li key={i}>{linkedText(item.text)}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
      <p className="legal-contact">
        Questions about these pages? <Link href="/contact-us">Contact us</Link>.
      </p>
    </main>
  )
}
