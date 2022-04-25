import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../../src/components/templates/Layout'
import Editor, { Monaco } from "@monaco-editor/react";
import { useEffect, useRef, useState } from 'react'
import { monaco } from 'react-monaco-editor'
import { db } from '../../src/lib/firebase/firebase'
import { addDoc, collection, doc, DocumentData, getDoc } from 'firebase/firestore'
import PrivateRoute from '../../src/lib/auth/PrivateRoute'
import { auth } from 'firebase-admin'
import { useAuth } from '../../src/lib/auth/auth'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Button from '../../src/components/atoms/Button';
import {Spinner} from '../../src/components/atoms/LoadingIcons/';
import LoadingButton from '../../src/components/atoms/LoadingButton';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import {default as ErrorMessage} from '../../src/components/atoms/Error';
import CSRFToken from '../../src/components/atoms/CSRFToken';

interface Errors {
  name?: string
  post?: string
}

const ComponentPage: NextPage = () => {
  const auth = useAuth()
  const router = useRouter()
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('private')
  const [component, setComponent] = useState<DocumentData | null>(null);
  const htmlEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const cssEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const javascriptEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco, language: string) {
    if(editor && language == 'html') htmlEditorRef.current = editor;
    if(editor && language == 'css') cssEditorRef.current = editor;
    if(editor && language == 'javascript') javascriptEditorRef.current = editor;
  }

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const previewCode = () => {
    const codes = {
      html: htmlEditorRef.current?.getValue(),
      css: cssEditorRef.current?.getValue(),
      js: javascriptEditorRef.current?.getValue(), 
    }
    const previewHTML = `
    <!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>${codes.css}</style>
      </head>
      <body>
        ${codes.html}
        <script>${codes.js}</script>
      </body>
    </html>
    `
    document.querySelector('iframe')?.setAttribute('srcDoc', previewHTML)
  }

  const saveAllCodes = async () => {
    setErrors({})
    const name = (document.getElementById('componentName') as HTMLInputElement).value;
    if(!name) {
      setErrors({
        name: '入力してください'
      })
      return;
    }
    try {
      const token = (document.querySelector('input[name="CSRFToken"]') as HTMLInputElement).value
      const postData = {
        uid: auth?.user?.uid,
        name: name,
        html: htmlEditorRef.current?.getValue(),
        css: cssEditorRef.current?.getValue(),
        js: javascriptEditorRef.current?.getValue(), 
        status: status,
        CSRFToken: token
      }
      const res = await fetch('/api/component/create', {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(postData)
      });
      const data = await res.json();
      if(!res.ok) {
        setErrors({
          post: '不正なアクセスです'
        })
        throw new Error(data.error.message)
      }
      router.push(`/component/edit/${data.id}`)
    } catch (e) {
      console.error("Error adding document: ", e);
      setErrors({
        post: 'エラーが発生しました'
      })
    }
  }

  const previewHTML = `
        <!DOCTYPE html>
        <html lang="ja">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body>
            <div>ここにコードプレビューが表示されます</div>    
          </body>
        </html>
  `

  return (
    <Layout>
      <Head>
        <link rel="stylesheet" type="text/css" data-name="vs/editor/editor.main" href="https://cdn.jsdelivr.net/npm/monaco-editor@0.28.1/min/vs/editor/editor.main.css" />
      </Head>
      <PrivateRoute>
        <style jsx>{`
          .editor {
            width: calc(50% - 1rem);
            margin-bottom: 1rem;
          }  
        `}</style>
        <div className='px-4'>
            <TextField id='componentName' label="コンポーネント名" variant="standard" className='w-1/2' />
            <div className='mt-4'>{errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}</div>
            <FormControl>
              <InputLabel id="component-status-label">公開設定</InputLabel>
              <Select
                labelId="component-status-label"
                id="component-status"
                value={status}
                label="公開設定"
                defaultValue={'非公開'}
                onChange={handleChange}
                sx={{minWidth: '120px'}}
              >
                <MenuItem value={'public'}>公開（編集可能）</MenuItem>
                <MenuItem value={'readOnly'}>公開（編集不可）</MenuItem>
                <MenuItem value={'private'}>非公開</MenuItem>
              </Select>
            </FormControl>
        </div>
        <div className="m-4 p-4 border">
          <iframe srcDoc={previewHTML} />
        </div>
        <div className='flex justify-between flex-wrap px-4'>
          <div className='editor'>
            <div>HTML</div>
            <Editor
              height="70vh"
              defaultLanguage="html"
              value={component?.html}
              theme="vs-dark"
              onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, 'html')}
            />
          </div>
          <div className='editor'>
            <div>CSS</div>
            <Editor
              height="70vh"
              width="100%"
              defaultLanguage="css"
              value={component?.css}
              theme="vs-dark"
              onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, 'css')}
            />
          </div>
          <div className='editor'>
            <div>Javascript</div>
            <Editor
              height="70vh"
              defaultLanguage="javascript"
              value={component?.javascript}
              theme="vs-dark"
              onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, 'javascript')}
            />
          </div>
        </div>
        <CSRFToken />
        <div className='fixed bottom-20 right-8'>
          <div className='mb-4'>
            <Button onClick={previewCode} className="bg-sky-300">プレビュー</Button>
          </div>
          <div className=''>
            <LoadingButton loading={saving} onClick={saveAllCodes}>保存</LoadingButton>
          </div>
          {errors.post && <div><ErrorMessage>{errors.post}</ErrorMessage></div>}
        </div>
      </PrivateRoute>
    </Layout>
  )
}

export default ComponentPage