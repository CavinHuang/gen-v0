import Link from "next/link"

import { Button } from "@/components/buttons/Button"

import { signOut } from "@/app/(auth)/auth"

export function SignIn({
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Button {...props}>
      <Link href="/signin">
        Sign In
      </Link>
    </Button>
  )
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
      className="w-full"
    >
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  )
}