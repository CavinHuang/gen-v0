"use client"

import { useState } from "react"

import { Login } from "@/app/(auth)/signin/login"
import { Register } from "@/app/(auth)/signin/register"

export const LoginOrRegister = () => {
  const [isLogin,setLogin] = useState(true)

  return isLogin ? <Login /> : <Register />
}