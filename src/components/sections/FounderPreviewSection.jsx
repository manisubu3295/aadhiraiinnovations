import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { RoughSVG } from 'roughjs/bin/svg'

const team = [
  {
    photo: '/media/founder.PNG',
    name: 'Manikandan Subramaniyan',
    role: 'Founder & Architect',
    note: 'Leads business problem framing, system shape, and release accountability from the first architecture review.',
    credentials: [
      'Enterprise & banking-grade engineering background',
      'AI-integrated systems design & implementation',
    ],
    accent: '#3B82F6',
  },
  {
    photo: '/media/Mathavan.jpg',
    name: 'Mathavan Ramachandran',
    role: 'Chief Technology Officer',
    note: 'Owns production architecture, delivery guardrails, and the engineering systems that keep launches stable.',
    credentials: [
      'System architecture & cloud-native infrastructure',
      'Core architect of the Medora+ SaaS platform',
    ],
    accent: '#8B5CF6',
  },
]

const deliverySignals = [
  'Founder-led discovery and architecture reviews',
  'CTO oversight on scale, security, and release flow',
  'Direct accountability from whiteboard to deployment',
]

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] },
  }),
}

function createText(svg, { x, y, text, fill, fontSize, fontFamily, fontWeight = '500', anchor = 'start', opacity = '1' }) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  node.setAttribute('x', String(x))
  node.setAttribute('y', String(y))
  node.setAttribute('fill', fill)
  node.setAttribute('font-size', String(fontSize))
  node.setAttribute('font-family', fontFamily)
  node.setAttribute('font-weight', fontWeight)
  node.setAttribute('text-anchor', anchor)
  node.setAttribute('opacity', opacity)
  node.textContent = text
  svg.append(node)
}

function createMultiLineText(svg, { x, y, lines, fill, fontSize, fontFamily, fontWeight = '500', anchor = 'start', lineHeight = 18, opacity = '1' }) {
  lines.forEach((line, index) => {
    createText(svg, {
      x,
      y: y + index * lineHeight,
      text: line,
      fill,
      fontSize,
      fontFamily,
      fontWeight,
      anchor,
      opacity,
    })
  })
}

function SketchArchitectureBoard() {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) {
      return undefined
    }

    let animationFrame = 0

    const drawBoard = () => {
      const canvasWidth = 720
      const canvasHeight = 490
      svg.replaceChildren()
      svg.setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`)

      const rc = new RoughSVG(svg)
      const colors = {
        ink: '#10233e',
        muted: '#40536f',
        frame: '#28466d',
        warm: '#f7f0dd',
        warmAlt: '#f3e5be',
        blue: '#d9e7ff',
        violet: '#eadcff',
        green: '#dcefe5',
        red: '#fde0d9',
      }

      const paper = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      paper.setAttribute('x', '12')
      paper.setAttribute('y', '12')
      paper.setAttribute('width', '696')
      paper.setAttribute('height', '466')
      paper.setAttribute('rx', '26')
      paper.setAttribute('fill', '#fff8ea')
      svg.append(paper)

      svg.append(
        rc.rectangle(16, 16, 688, 458, {
          stroke: colors.frame,
          strokeWidth: 2.1,
          roughness: 1.6,
          bowing: 1.3,
        }),
      )

      const grid = document.createElementNS('http://www.w3.org/2000/svg', 'pattern')
      grid.setAttribute('id', 'founder-board-grid')
      grid.setAttribute('width', '28')
      grid.setAttribute('height', '28')
      grid.setAttribute('patternUnits', 'userSpaceOnUse')
      const gridPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      gridPath.setAttribute('d', 'M 28 0 L 0 0 0 28')
      gridPath.setAttribute('fill', 'none')
      gridPath.setAttribute('stroke', '#eadfbe')
      gridPath.setAttribute('stroke-width', '1')
      gridPath.setAttribute('opacity', '0.45')
      grid.append(gridPath)
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
      defs.append(grid)
      svg.append(defs)
      const gridFill = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      gridFill.setAttribute('x', '24')
      gridFill.setAttribute('y', '24')
      gridFill.setAttribute('width', '672')
      gridFill.setAttribute('height', '442')
      gridFill.setAttribute('rx', '22')
      gridFill.setAttribute('fill', 'url(#founder-board-grid)')
      gridFill.setAttribute('opacity', '0.55')
      svg.append(gridFill)

      createText(svg, {
        x: 42,
        y: 56,
        text: 'Founders still sketch the architecture first',
        fill: colors.ink,
        fontSize: 28,
        fontFamily: 'Caveat, cursive',
        fontWeight: '700',
      })

      createText(svg, {
        x: 42,
        y: 84,
        text: 'Business rules before code. Release decisions before velocity.',
        fill: colors.muted,
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        opacity: '0.88',
      })

      const nodes = [
        {
          x: 52,
          y: 126,
          width: 176,
          height: 92,
          fill: colors.red,
          title: 'Client Ops Pain',
          lines: ['workflow gaps', 'manual billing', 'stock risk'],
          titleFont: 'Caveat, cursive',
          titleSize: 25,
        },
        {
          x: 272,
          y: 112,
          width: 182,
          height: 114,
          fill: colors.warmAlt,
          title: 'Founder Review',
          lines: ['map real process', 'find bottlenecks', 'shape the product'],
          titleFont: 'Caveat, cursive',
          titleSize: 29,
        },
        {
          x: 494,
          y: 128,
          width: 172,
          height: 88,
          fill: colors.blue,
          title: 'AI Workflow Layer',
          lines: ['routing', 'alerts', 'decision support'],
          titleFont: 'Inter, sans-serif',
          titleSize: 17,
        },
        {
          x: 88,
          y: 280,
          width: 176,
          height: 86,
          fill: colors.green,
          title: 'Security + Scale Checks',
          lines: ['roles', 'audit trail', 'multi-site readiness'],
          titleFont: 'Inter, sans-serif',
          titleSize: 16,
        },
        {
          x: 304,
          y: 276,
          width: 198,
          height: 98,
          fill: colors.violet,
          title: 'Build Blueprint',
          lines: ['platform modules', 'deployment flow', 'handoff plan'],
          titleFont: 'Caveat, cursive',
          titleSize: 28,
        },
        {
          x: 548,
          y: 292,
          width: 122,
          height: 74,
          fill: colors.warm,
          title: 'Live Support',
          lines: ['review usage', 'ship fixes'],
          titleFont: 'Inter, sans-serif',
          titleSize: 16,
        },
      ]

      nodes.forEach((node) => {
        svg.append(
          rc.rectangle(node.x, node.y, node.width, node.height, {
            stroke: colors.ink,
            strokeWidth: 1.8,
            roughness: 2.1,
            bowing: 1.7,
            fill: node.fill,
            fillStyle: 'solid',
            fillWeight: 1.1,
          }),
        )
        createText(svg, {
          x: node.x + 16,
          y: node.y + 28,
          text: node.title,
          fill: colors.ink,
          fontSize: node.titleSize,
          fontFamily: node.titleFont,
          fontWeight: node.titleFont.includes('Caveat') ? '700' : '700',
        })
        createMultiLineText(svg, {
          x: node.x + 16,
          y: node.y + 50,
          lines: node.lines,
          fill: colors.muted,
          fontSize: 12,
          fontFamily: 'Inter, sans-serif',
          fontWeight: '600',
          lineHeight: 16,
          opacity: '0.95',
        })
      })

      const connectors = [
        { x1: 228, y1: 172, x2: 272, y2: 168 },
        { x1: 454, y1: 168, x2: 494, y2: 172 },
        { x1: 366, y1: 226, x2: 398, y2: 276 },
        { x1: 212, y1: 280, x2: 304, y2: 324 },
        { x1: 502, y1: 324, x2: 548, y2: 328 },
      ]

      connectors.forEach(({ x1, y1, x2, y2 }) => {
        svg.append(
          rc.line(x1, y1, x2, y2, {
            stroke: colors.ink,
            strokeWidth: 2.1,
            roughness: 1.9,
            bowing: 1.2,
          }),
        )
        svg.append(
          rc.line(x2 - 9, y2 - 6, x2, y2, {
            stroke: colors.ink,
            strokeWidth: 2.1,
            roughness: 1.5,
          }),
        )
        svg.append(
          rc.line(x2 - 8, y2 + 6, x2, y2, {
            stroke: colors.ink,
            strokeWidth: 2.1,
            roughness: 1.5,
          }),
        )
      })

      svg.append(
        rc.path('M 130 376 Q 248 430 362 404 T 612 396', {
          stroke: colors.frame,
          strokeWidth: 1.8,
          roughness: 2.2,
          bowing: 1.3,
        }),
      )

      createText(svg, {
        x: 222,
        y: 438,
        text: 'founder review on every release',
        fill: colors.frame,
        fontSize: 24,
        fontFamily: 'Caveat, cursive',
        fontWeight: '700',
      })

      svg.append(
        rc.circle(600, 160, 98, {
          stroke: '#cc6d4a',
          strokeWidth: 2,
          roughness: 2.4,
          bowing: 1.8,
        }),
      )
      createText(svg, {
        x: 612,
        y: 112,
        text: 'automation',
        fill: '#cc6d4a',
        fontSize: 22,
        fontFamily: 'Caveat, cursive',
        fontWeight: '700',
        anchor: 'middle',
      })

      svg.append(
        rc.rectangle(522, 56, 140, 38, {
          stroke: colors.ink,
          strokeWidth: 1.5,
          roughness: 2,
          fill: '#fff1c7',
          fillStyle: 'solid',
        }),
      )
      createText(svg, {
        x: 592,
        y: 80,
        text: 'whiteboard before sprint',
        fill: colors.ink,
        fontSize: 20,
        fontFamily: 'Caveat, cursive',
        fontWeight: '700',
        anchor: 'middle',
      })
    }

    const redraw = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(drawBoard)
    }

    redraw()

    const resizeObserver = new ResizeObserver(redraw)
    resizeObserver.observe(svg)

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#16345c]/60 bg-[#f6e8c8] p-4 shadow-[0_30px_80px_rgba(5,10,20,0.35)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.22),transparent_28%)]" />
      <svg
        ref={svgRef}
        className="relative z-10 w-full"
        role="img"
        aria-label="Hand-drawn founder-led architecture diagram showing discovery, founder review, AI workflow, build blueprint, and live support."
      />
    </div>
  )
}

function FounderPreviewSection() {
  return (
    <section id="leadership" className="scroll-mt-24 overflow-hidden bg-[#06101f] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-white/15" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">
                Leadership
              </span>
            </div>

            <h2 className="max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[3.15rem] lg:leading-[1.05]">
              The whiteboard still starts with the founders.
            </h2>

            <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/58">
              Aadhirai is not structured like a typical agency handoff. Discovery, system shape,
              risk review, and release decisions stay close to the founding team, which is why the
              final product feels engineered instead of merely delivered.
            </p>

            <div className="mt-8 space-y-3">
              {deliverySignals.map((signal) => (
                <div key={signal} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5 backdrop-blur-sm">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#f2c572]" />
                  <p className="text-sm leading-6 text-white/62">{signal}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-[#f2c572]/20 bg-[#0b1a2d] px-5 py-4 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
              <p className="font-hand text-[1.9rem] leading-none text-[#f6dfae] md:text-[2.15rem]">
                “Every release should have a name behind it, not a helpdesk queue.”
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white/28">
                Founder Note
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <SketchArchitectureBoard />
          </motion.div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {team.map((member, i) => (
            <motion.article
              key={member.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(15,31,57,0.96),rgba(7,15,27,0.96))] p-5"
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-14 blur-3xl"
                style={{ background: member.accent }}
              />

              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-[#091321]">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>

                <div>
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]"
                    style={{
                      color: member.accent,
                      background: member.accent + '14',
                      border: `1px solid ${member.accent}32`,
                    }}
                  >
                    {member.role}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-white">{member.name}</h3>
                  <p className="mt-1 max-w-md text-sm leading-6 text-white/52">{member.note}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {member.credentials.map((credential) => (
                  <span
                    key={credential}
                    className="rounded-full border border-white/9 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-white/48"
                  >
                    {credential}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FounderPreviewSection
