import { Button } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../src/components/templates/Layout'
import { auth } from '../src/lib/firebase/firebase'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <Layout>
      <h1 className="text-4xl font-bold text-center">
        コンポーネントとコンテンツを作成しよう
      </h1>
      <div className='text-center'>
        <Link href='/component'><Button>さっそく始める</Button></Link>
      </div>
    </Layout>
  )
}

export default Home
