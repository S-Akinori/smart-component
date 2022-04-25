import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}
interface Request {
  token: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {token} = req.body as Request;

  res.status(200).json({id: data.id})
}
