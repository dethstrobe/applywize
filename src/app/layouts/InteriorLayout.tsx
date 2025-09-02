import type { FC, PropsWithChildren } from "react"
import { Header } from "../components/Header"
import { Toaster } from "../components/ui/sonner"

export const InteriorLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="page-wrapper">
    <main className="page bg-white">
      <Header />
      {children}
      <Toaster position="top-right" />
    </main>
  </div>
)
