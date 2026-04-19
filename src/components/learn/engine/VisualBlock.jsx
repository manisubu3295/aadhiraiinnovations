import ArrayVisual from '../visuals/ArrayVisual'
import StackVisual from '../visuals/StackVisual'
import PointerVisual from '../visuals/PointerVisual'

const visualComponents = {
  ArrayVisual,
  StackVisual,
  PointerVisual,
}

export default function VisualBlock({ component, props = {}, caption }) {
  const Component = visualComponents[component]

  if (!Component) {
    return <div className="text-red-500">Visual component "{component}" not found</div>
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex justify-center mb-6">
        <Component {...props} />
      </div>

      {caption && (
        <p className="text-center text-sm text-slate-500 italic leading-relaxed">
          {caption}
        </p>
      )}
    </div>
  )
}
