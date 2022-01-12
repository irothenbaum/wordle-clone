import './App.css'
import {useEffect, useState} from 'react'
import {getWordOfLength} from '../lib/utilities'
import GameBoard from './GameBoard'

function App() {
  const [wordLength, setWordLength] = useState(5)
  const [secretWord, setSecretWord] = useState()

  useEffect(() => {
    setSecretWord(getWordOfLength(wordLength))
  }, [wordLength, getWordOfLength])

  return (
    <div className="App">
      <GameBoard word={secretWord} />
    </div>
  )
}

export default App
