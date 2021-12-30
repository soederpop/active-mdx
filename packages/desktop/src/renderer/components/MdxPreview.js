import React, { useEffect, useState } from "react"

export default function MdxPreview({ pathId, cwd, modulePath }) {
  const [output, setOutput] = useState([])

  useEffect(() => {
    API.renderMdxDocument({
      cwd,
      modulePath: modulePath || "content/index.mjs",
      pathId,
      styles: true
    }).then((result) => {
      setOutput(result)
    })
  }, [])

  if (!output.length) {
    return <div />
  } else {
    return <div dangerouslySetInnerHTML={{ __html: output.join("") }} />
  }
}
