import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../../src/lib/firebase/firebaseAdmin'
import { ComponentDoc } from '../../../../src/lib/interface/ComponentDoc'

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
  const {id} = req.query as {id: string};
  const {uid} = req.body;
  if(!uid) {
    res.status(400).json({error: {message: '認証が必要です'}});
  }
  const doc = await db.collection('components').doc(id).get()
  if(doc?.data()?.uid == uid) {
    let component = doc.data() as ComponentDoc;
    component.id = doc.id
    res.status(200).json({doc: component})
  } else {
    res.status(404).json({error: {message: 'データがありません'}});
  }
}
