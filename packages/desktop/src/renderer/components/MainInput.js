import React from "react"

export default function MainInput({
  className = "",
  placeholder = "",
  value = "",
  onChange = () => {},
  onKeyDown = () => {},
  onKeyUp = () => {},
  onFocus = () => {},
  onBlur = () => {}
}) {
  return (
    <input
      className={`
        ${className}
        focus:outline-none focus:shadow-outline
        w-full p-3
        rounded
        bg-slate-900
        text-slate-100
      `}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Type something..."
      autoFocus
    />
  )
}
