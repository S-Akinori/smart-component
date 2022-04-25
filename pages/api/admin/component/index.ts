import type { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from 'nookies'
import { db, firebaseAdmin } from '../../../../src/lib/firebase/firebaseAdmin'
import checkCSRFToken from '../../../../src/lib/functions/checkCSRFToken'
import { ComponentDoc } from '../../../../src/lib/interface/ComponentDoc'

type Data = {
  name: string
}
interface Request {
  id: string
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
  const {uid, CSRFToken} = req.body as Request;
  // if(!checkCSRFToken(req, CSRFToken)) {
  //   res.status(403).json({error: {message: '不正なアクセスです'}});
  //   return
  // }
  const componentsRef = db.collection('components') ;
  const componentsDocs = await componentsRef.where('uid', '==', uid).limit(20).get();
  let components : ComponentDoc[] = []
  componentsDocs.forEach(doc => {
    const componentDoc = doc.data() as ComponentDoc
    componentDoc.id = doc.id
    components.push(componentDoc)
  })

  res.status(200).json({components: components})
}
