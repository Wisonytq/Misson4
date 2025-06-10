import { useState } from 'react'
import Header from './Components/Header'
import Chatbox from './Components/Chatbox'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='AI-Interviewer'>
        <Header></Header>
        <Chatbox></Chatbox>
      </div>
    </>
  )
}

export default App
