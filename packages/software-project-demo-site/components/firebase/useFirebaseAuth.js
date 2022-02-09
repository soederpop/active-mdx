import { useState, useEffect } from "react"
import firebase from "./app"

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email
})

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const authStateChanged = async (authState) => {
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return
    }

    setLoading(true)
    var formattedUser = formatAuthUser(authState)
    setAuthUser(formattedUser)
    setLoading(false)
  }

  // listen for firebase state change
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(authStateChanged)
    return () => unsubscribe()
  }, [])

  return {
    authUser,
    loading
  }
}
