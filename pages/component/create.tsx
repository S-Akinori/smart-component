import { Button } from '@mui/material'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../../src/components/templates/Layout'
import Editor from "@monaco-editor/react";
import { useRef } from 'react'

const ComponentPage: NextPage = () => {
  const htmlEditorRef = useRef(null);
  const cssEditorRef = useRef(null);
  const javascriptEditorRef = useRef(null);

  return (
    <Layout>
      <style jsx>{`
        .editor {
          width: calc(50% - 1rem);
          margin-bottom: 1rem;
        }  
      `}</style>
      <h1 className="text-2xl font-bold text-center mb-12">
        コンポーネント作成画面
      </h1>
      <div className='flex justify-between flex-wrap'>
        <div className='editor'>
          <Editor
            height="70vh"
            defaultLanguage="html"
            defaultValue="<!-- HTML -->"
            theme="vs-dark"
          />
        </div>
        <div className='editor'>
          <Editor
            height="70vh"
            defaultLanguage="css"
            defaultValue="/* CSS */"
            theme="vs-dark"
          />
        </div>
        <div className='editor'>
          <Editor
            height="70vh"
            defaultLanguage="javascript"
            defaultValue="// javascript"
            theme="vs-dark"
          />
        </div>
      </div>
      <div className='fixed bottom-4 right-4'>
        <Button>保存</Button>
      </div>
    </Layout>
  )
}

export default ComponentPage