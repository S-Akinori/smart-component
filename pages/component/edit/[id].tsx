import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../../../src/components/templates/Layout'
import Editor, { Monaco } from "@monaco-editor/react";
import { useEffect, useRef, useState } from 'react'
import { monaco } from 'react-monaco-editor'
import { db } from '../../../src/lib/firebase/firebase'
import { addDoc, collection, doc, DocumentData, getDoc } from 'firebase/firestore'
import PrivateRoute from '../../../src/lib/auth/PrivateRoute'
import { auth } from 'firebase-admin'
import { useAuth } from '../../../src/lib/auth/auth'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Button from '../../../src/components/atoms/Button';
import {Spinner} from '../../../src/components/atoms/LoadingIcons';
import LoadingButton from '../../../src/components/atoms/LoadingButton';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import {default as ErrorMessage} from '../../../src/components/atoms/Error';
import { ComponentDoc } from '../../../src/lib/interface/ComponentDoc';
import CSRFToken from '../../../src/components/atoms/CSRFToken';

interface Errors {
  name?: string
  post?: string
}

const ComponentCreatePage: NextPage = () => {
  const auth = useAuth()
  const router = useRouter()
  const {id} = router.query
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('private')
  const [savedMessage, setSavedMessage] = useState('保存')
  const [component, setComponent] = useState<ComponentDoc | null>(null);
  const htmlEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const cssEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const javascriptEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco, language: string) {
    if(editor && language == 'html') htmlEditorRef.current = editor;
    if(editor && language == 'css') cssEditorRef.current = editor;
    if(editor && language == 'javascript') javascriptEditorRef.current = editor;
  }

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

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const saveAllCodes = async () => {
    if(component?.status == 'readOnly') {
      setErrors({
        post: '読み込みのみなので保存できません'
      })
      return
    }
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
        id: component?.id,
        uid: auth?.user?.uid,
        name: name,
        html: htmlEditorRef.current?.getValue(),
        css: cssEditorRef.current?.getValue(),
        js: javascriptEditorRef.current?.getValue(),
        status: status,
        CSRFToken: token
      }
      const res = await fetch('/api/component/update', {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(postData)
      });
      const data = await res.json();
      setSavedMessage('保存しました')
      setTimeout(() => {
        setSavedMessage('保存')
      }, 1000)
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  useEffect(() => {
    const fetchComponent = async () => {
      const postData = {
        uid: auth?.user?.uid
      }
      const res = await fetch('/api/admin/component/' + id, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(postData)
      });
      const data = await res.json();
      setComponent(data.doc)
      setStatus(data.doc.status)
      console.log(data.doc)
    }
    if(id && auth?.user) {
      fetchComponent();
      setTimeout(previewCode, 1000)
    }
  }, [id, auth])
  
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
        {component?.status === 'readOnly' && (
          <div className='px-4 mb-4'>こちらのコンポーネントは「読み込みのみ」の設定になっています。編集はできません。
          </div>
        )}
        <div className='px-4 flex'>
          {component && <TextField id='componentName' label="コンポーネント名" variant="standard" className='w-1/2' defaultValue={component.name} disabled={component?.status === 'readOnly'} />}
          <div className='mt-4'>{errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}</div>
          <FormControl className='ml-4'>
            <InputLabel id="component-status-label">公開設定</InputLabel>
            <Select
              labelId="component-status-label"
              id="component-status"
              value={status}
              label="公開設定"
              defaultValue={'非公開'}
              onChange={handleChange}
              sx={{minWidth: '120px'}}
              disabled={component?.status === 'readOnly'}
            >
              <MenuItem value={'public'}>公開（編集可能）</MenuItem>
              <MenuItem value={'readOnly'}>公開（編集不可）</MenuItem>
              <MenuItem value={'private'}>非公開</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="m-4 p-4 border">
          <iframe srcDoc='' />
        </div>
        <div className='flex justify-between flex-wrap px-4'>
          <div className='editor'>
            <div>HTML</div>
            <Editor
              height="70vh"
              defaultLanguage="html"
              value={component?.html}
              theme="vs-dark"
              className={component?.status === 'readOnly' ? 'pointer-events-none' : ''}
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
              className={component?.status === 'readOnly' ? 'pointer-events-none' : ''}
              onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, 'css')}
            />
          </div>
          <div className='editor'>
            <div>Javascript</div>
            <Editor
              height="70vh"
              defaultLanguage="javascript"
              value={component?.js}
              theme="vs-dark"
              className={component?.status === 'readOnly' ? 'pointer-events-none' : ''}
              onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, 'javascript')}
            />
          </div>
        </div>
        <CSRFToken />
        {component?.status !== 'readOnly' && (
        <div className='fixed bottom-20 right-8'>
          <div className='mb-4'>
            <Button onClick={previewCode} className="bg-sky-300">プレビュー</Button>
          </div>
          <div className=''>
            <LoadingButton loading={saving} onClick={saveAllCodes}>{savedMessage}</LoadingButton>
          </div>
          {errors.post && <div><ErrorMessage>{errors.post}</ErrorMessage></div>}
        </div>
        )}
      </PrivateRoute>
    </Layout>
  )
}

export default ComponentCreatePage