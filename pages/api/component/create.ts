import type { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from 'nookies'
import { db, firebaseAdmin } from '../../../src/lib/firebase/firebaseAdmin'
import checkCSRFToken from '../../../src/lib/functions/checkCSRFToken'

type Data = {
  name: string
}
interface Request {
  uid: string
  name: string
  html: string
  css: string
  js: string
  status: 'public' | 'readOnly' | 'private'
  CSRFToken: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {uid, name, html, css, js, status, CSRFToken} = req.body as Request;
  if(!checkCSRFToken(req, CSRFToken)) {
    res.status(403).json({error: {message: '不正なアクセスです'}});
    return
  }
  const data = await db.collection('components').add({
    uid: uid,
    name: name,
    html: html,
    css: css,
    status: status,
    js: js
  })

  res.status(200).json({id: data.id})
}
