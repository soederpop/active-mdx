import { transformSync } from "esbuild"

export function compile(code, options = {}) {
  const result = transformSync(code, {
    format: "cjs",
    loader: "jsx",
    ...options
  })

  return result.code
}
