import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import { Button } from "@/components/buttons/Button";

import { signIn } from "@/app/(auth)/auth";

const Signin = () => {

  return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Sign In</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email and password to sign in!
        </p>
      </div>
      <div className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm -space-y-px">
          {/* Google */}
          <form action={async () => {
            "use server";
            // 登录完回到首页
            await signIn('google',{ redirectTo: '/' })
          }}>
            <Button className="bg-gray-100 w-full rounded-3xl h-12 cursor-pointer hover:bg-gray-200">
              <FcGoogle className="text-3xl pr-2" />
              Sign in with Google
            </Button>
          </form>
          {/* Github */}
          <form action={async () => {
            "use server";
            // 登录完回到首页
            await signIn('github',{ redirectTo: '/' })
          }}>
            <Button className="bg-gray-100 w-full rounded-3xl h-12 cursor-pointer hover:bg-gray-200 mt-5">
              <FaGithub className="text-3xl pr-2" />
              Sign in with GitHub
            </Button>
          </form>

          {/* divide */}
          <div className="relative py-10 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">or</span>
            </div>
          </div>

          {/* email */}
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" value="true" />
            {/* <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Email address" />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Password" />
          </div> */}
            {/* <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded" />
            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">Keep me logged in</label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-primary-foreground">Forgot password?</a>
          </div>
        </div> */}

            <div>
              <Button type="submit" variant="destructive" className="w-full bg-primary-600 text-white rounded-xl h-12 hover:bg-primary-700">
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
}

export default Signin