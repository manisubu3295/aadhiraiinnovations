function PatternBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,31,58,0.06),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(11,31,58,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,31,58,0.04)_1px,transparent_1px)] bg-[size:34px_34px] opacity-35" />
    </>
  )
}

export default PatternBackground
