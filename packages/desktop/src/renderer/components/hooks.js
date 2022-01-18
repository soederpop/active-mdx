import { useState, useEffect } from "react"

export function useClientCall(method, ...args) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState()

  if (typeof method === "string") {
    method = () => API[method](...args)
  }

  const doLoad = () => {
    setLoading(true)
    Promise.resolve(method())
      .then((response) => {
        setResponse(response)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => doLoad(), [])

  return {
    ...response,
    loading,
    response,
    reload: () => doLoad()
  }
}
