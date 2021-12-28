import { useState, useEffect } from "react"

export function useClientCall(method) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState()

  useEffect(() => {
    setLoading(true)
    Promise.resolve(method())
      .then((response) => {
        setResponse(response)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return {
    loading,
    response
  }
}
