import { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function ScreenshotCarousel({ slides }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) {
      return
    }

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(11,31,58,0.08)]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-0 flex-[0_0_100%] p-2">
              <div className="relative">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="h-[230px] w-full rounded-xl border border-slate-100 object-cover sm:h-[320px]"
                />
                {slide.caption ? (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {slide.caption}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${selectedIndex === index ? 'bg-[#0B1F3A]' : 'bg-slate-300'}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous screenshot"
            onClick={() => emblaApi?.scrollPrev()}
            className="rounded-md border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#0B1F3A]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next screenshot"
            onClick={() => emblaApi?.scrollNext()}
            className="rounded-md border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#0B1F3A]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScreenshotCarousel
