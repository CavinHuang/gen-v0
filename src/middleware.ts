
import { auth } from "@/app/(auth)/auth"
// Or like this if you need to do something here.
// export default auth((req) => {
//   console.log(req.auth) //  { session: { user: { ... } } }
// })

// export async function middleware(request: NextRequest) {
//   // 获取session
//   const session = await auth()

//   console.log('哈哈就是我=', session)
//   return NextResponse.redirect(new URL('/', request.url))
// }

export const middleware = auth

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}