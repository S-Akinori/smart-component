import { Button } from '@mui/material'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../../src/components/templates/Layout'

const ComponentPage: NextPage = () => {
  return (
    <Layout>
      <h1 className="text-4xl font-bold text-center">
        コンポーネント一覧
      </h1>
      <div>ここに一覧表</div>
      <div className='text-center'>
        <Link href='/#'><Button>さっそく始める</Button></Link>
      </div>
    </Layout>
  )
}

export default ComponentPage
