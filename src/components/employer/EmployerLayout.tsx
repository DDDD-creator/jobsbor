"use client"

import { ReactNode } from "react"
import { EmployerSidebar } from "./EmployerSidebar"
import { Header } from "@/components/layout/Header"

interface EmployerLayoutProps {
  children: ReactNode
}

export function EmployerLayout({ children }: EmployerLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
      <Header />
      <div className="pt-16 flex">
        <EmployerSidebar className="fixed left-0 top-16 bottom-0 z-40 hidden lg:block" />
        <main className="flex-1 lg:ml-64 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}