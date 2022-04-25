import { parseCookies, setCookie } from "nookies"
import { useEffect, useState } from "react"

const CSRFToken = () => {
  const [token, setToken] = useState('')
  const setCSRFToken = async () => {
    let cookies = parseCookies()
    if(!cookies.CSRFToken) {
      const res = await fetch('/api/csrf-session', {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({pass: process.env.NEXT_PUBLIC_CSRFToken})
      })
      const data = await res.json()
      cookies = parseCookies()
    }
    setToken(cookies.CSRFToken)
  }
  useEffect(() => {
    setCSRFToken();
  }, [])
  return <input name="CSRFToken" type="hidden" value={token} />
}

export default CSRFToken