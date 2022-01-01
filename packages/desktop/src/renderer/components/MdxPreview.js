import React, { useEffect, useState } from "react"

export default function MdxPreview({ pathId, cwd }) {
  const [output, setOutput] = useState([])

  useEffect(() => {
    API.renderMdxDocument({
      cwd,
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
