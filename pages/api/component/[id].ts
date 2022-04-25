import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../src/lib/firebase/firebaseAdmin'

type Data = {
  name: string
}
interface Request {
  uid: string
  name: string
  html: string
  css: string
  js: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {uid, name, html, css, js} = req.body as Request;
  const data = await db.collection('components').add({
    uid: uid,
    name: name,
    html: html,
    css: css,
    js: js
  })

  res.status(200).json({id: data.id})
}
