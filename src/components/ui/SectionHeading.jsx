function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 md:mt-4 text-base text-slate-600 md:text-lg">{description}</p> : null}
    </div>
  )
}

export default SectionHeading
