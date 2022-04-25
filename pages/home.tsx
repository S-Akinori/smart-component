import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CSRFToken from "../src/components/atoms/CSRFToken";
import Layout from "../src/components/templates/Layout"
import { useAuth } from "../src/lib/auth/auth"
import PrivateRoute from "../src/lib/auth/PrivateRoute"
import { ComponentDoc } from "../src/lib/interface/ComponentDoc";

const HomePage = () => {
  const auth = useAuth();
  const router = useRouter();
  const [components, setComponents] = useState<ComponentDoc[]>([])
  console.log(auth?.user)
  const onClick = async () => {
    const isSuccessful = await auth?.signout();
    console.log(isSuccessful)
    if(isSuccessful) {
      router.push('/');
    } else {
      console.log('error')
    }
  }

  useEffect(() => {
    const fetchComponent = async () => {
      const postData = {
        uid: auth?.user?.uid,
      }
      const res = await fetch('/api/admin/component/', {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(postData)
      });
      const data = await res.json();
      setComponents(data.components)
    }
    if(auth?.user) {
      fetchComponent();
    }
  }, [auth])

  return (
    <PrivateRoute>
      <Layout>
        <div className="container px-4 mx-auto">
          <h1>ホーム</h1>
          {!components.length && <div>作成したコンポーネントはありません。</div>}
          {components.length && (
            <div className="flex flex-wrap">
              {components.map(component => (
                <div key={component.id} className="w-1/3 p-4">
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
          )}
          <Button variant="contained" onClick={onClick}>サインアウト</Button>
          <CSRFToken />
        </div>
      </Layout>
    </PrivateRoute>
  )
}
export default HomePage;