import { RouterProvider } from "react-router-dom"

import { router } from "@/core/routes/router"

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
