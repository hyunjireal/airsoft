import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

function App() {
 console.log(import.meta.env.VITE_CHAT_API_URL)

  return <RouterProvider router={router} />
}

export default App
