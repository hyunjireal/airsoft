interface SectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function Section({ title, description, children }: SectionProps) {
  return (
    <section className="section">
      <div className="section__header">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  )
}
