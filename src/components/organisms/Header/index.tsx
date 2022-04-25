import Link from "next/link"
import { useAuth } from "../../../lib/auth/auth";

const Header = () => {
  const auth = useAuth();
  return(
    <header className="flex items-center justify-between w-full h-20 px-4 border-b">
      <div className="text-xl"><Link href='/'>Smart Component</Link></div>
      <div className="flex items-center">
        {!auth?.user && (
          <>
            <div className="px-4"><Link href="/register">登録</Link></div>
            <div className="px-4"><Link href="/login">ログイン</Link></div>
          </>
        )}
        {auth?.user && (
          <div className="px-4"><Link href="/home">ホーム</Link></div>
        )}
      </div>
    </header>
  )
}
export default Header