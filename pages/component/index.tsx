import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../../src/components/atoms/Button'
import Container from '../../src/components/molecules/Container'
import Layout from '../../src/components/templates/Layout'
import { db } from '../../src/lib/firebase/firebaseAdmin'
import { ComponentDoc } from '../../src/lib/interface/ComponentDoc'

interface Props {
  components: ComponentDoc[]
}

const ComponentPage = () => {
  const components: ComponentDoc[] = []
  return (
    <Layout>
      <Container>
        <h1 className="text-4xl font-bold text-center">
          コンポーネント一覧
        </h1>
        <div className='flex flex-wrap'>
          {components.length && components.map(component => (
            <div key={component.id} className='w-1/3 p-4'>
              <Link href={`/component/edit/${component.id}`}>{component.name}</Link>
              <div className='border'>
                <iframe srcDoc={`
                  <!DOCTYPE html>
                  <html lang="ja">
                    <head>
                      <meta charset="UTF-8" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <style>${component.css}</style>
                    </head>
                    <body>
                      ${component.html}
                      <script>${component.js}</script>
                    </body>
                  </html>
                  `}/>
              </div>
            </div>
          ))}
        </div>
        <div className='text-center'>
          <Button href='/component/create'>作成する</Button>
        </div>
      </Container>
    </Layout>
  )
}

// export const getStaticProps: GetStaticProps = async () => {
//   const componentsRef = db.collection('components') ;
//   const componentsDocs = await componentsRef.where('status', 'in', ['public', 'readOnly']).limit(20).get();
//   let components : ComponentDoc[] = []
//   componentsDocs.forEach(doc => {
//     const componentDoc = doc.data() as ComponentDoc
//     componentDoc.id = doc.id
//     components.push(componentDoc)
//   })
//   return {
//     props: {
//       components
//     }
//   }
// }

export default ComponentPage
