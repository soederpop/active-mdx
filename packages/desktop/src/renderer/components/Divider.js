import React from "react"

// tailwind divider with title
export default function Divider(props = {}) {
  return (
    <div className="relative my-3">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-slate-300" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-2 bg-slate-900 text-sm text-slate-500">
          {props.title}
        </span>
      </div>
    </div>
  )
}
