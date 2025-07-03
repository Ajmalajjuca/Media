import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import NewsWebsite from './components/LocationTracker'

function App() {
  const [count, setCount] = useState(0)

  return (
    <NewsWebsite/>
  )
}

export default App
