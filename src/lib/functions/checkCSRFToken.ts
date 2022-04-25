import { NextApiRequest } from "next"
import { parseCookies } from "nookies"

const checkCSRFToken = (req: NextApiRequest, token: string) => {
  const cookies = parseCookies({req})

  if(cookies.CSRFToken && token && cookies.CSRFToken === token) {
    return true
  } else {
    return false
  }
}

export default checkCSRFToken