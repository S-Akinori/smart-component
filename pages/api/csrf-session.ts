import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies';
import crypto from 'crypto'

type Data = {
  name: string
}
interface Request {
  pass: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {pass} = req.body as Request;
  if(pass !== process.env.NEXT_PUBLIC_CSRFToken) {
    res.status(401).json({error: {message: 'パスワードが必要です。'}});
  }

  const N = 24
  const token = crypto.randomBytes(N).toString('base64').substring(0, N)

  const options = {
    secure: true,
    path: "/",
  };
  setCookie({res}, "CSRFToken", token, options)


  res.status(200).json({status: 'success'})
}
