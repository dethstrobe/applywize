import type { FC, PropsWithChildren } from "react";
import { Header } from "../components/Header";

export const InteriorLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="page-wrapper">
    <main className="page bg-white">
      <Header />
      {children}
    </main>
  </div>
)