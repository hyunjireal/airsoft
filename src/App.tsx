import { RouterProvider } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { router } from './routes'

function App() {
  return (
    <>
      <ThemeToggle />
      <RouterProvider router={router} />
    </>
  )
}

export default App
