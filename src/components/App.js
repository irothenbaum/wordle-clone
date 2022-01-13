import './App.css'
import {useEffect, useState} from 'react'
import {getWordOfLength} from '../lib/utilities'
import GameBoard from './GameBoard'

function App() {
  const [wordLength, setWordLength] = useState(5)
  const [secretWord, setSecretWord] = useState()

  console.log(secretWord)

  useEffect(() => {
    setSecretWord(getWordOfLength(wordLength))
  }, [wordLength])

  return <div className="App">{!!secretWord && <GameBoard word={secretWord} />}</div>
}

export default App
