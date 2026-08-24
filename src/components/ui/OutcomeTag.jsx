// Shared pill used to mark a testimonial/case-study card with its one-line outcome (e.g.
// "Operational clarity"). Used identically on CaseStudiesPage.jsx and TestimonialsMarqueeSection
// so the homepage teaser and the full case-studies page read as the same real content, not two
// different designs pointing at the same client.
export default function OutcomeTag({ label, dark }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] ${
        dark
          ? 'border-white/15 bg-white/[0.06] text-white/55'
          : 'border-[#0B1F3A]/12 bg-[#0B1F3A]/[0.06] text-[#0B1F3A]/55'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-white/40' : 'bg-[#0B1F3A]/35'}`} />
      {label}
    </span>
  )
}
