import { retext } from "retext"
import keywords from "retext-keywords"
import pos from "retext-pos"

export default function parse(text = "", options = {}) {
  const processor = createProcessor(options)

  return processor.parse(text)
}

export function process(text = "", options = {}) {
  const processor = createProcessor(options)

  return processor.process(text)
}

function createProcessor(options) {
  return retext().use(pos, options).use(keywords, options)
}
