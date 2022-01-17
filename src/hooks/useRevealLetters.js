import {useEffect, useState} from 'react'

function useRevealLetters(charCount) {
  const [revealPosition, setRevealPosition] = useState(0)
  const [onComplete, setOnComplete] = useState(null)

  useEffect(() => {
    if (typeof onComplete !== 'function' || !charCount) {
      return
    }

    if (revealPosition < charCount) {
      setTimeout(() => {
        setRevealPosition(revealPosition + 1)
      }, 500)
    } else {
      setTimeout(() => {
        onComplete()
      }, 500)
    }
  }, [revealPosition, onComplete])

  return {
    revealPosition,
    animate: callback => {
      setOnComplete(() => callback)
    },
  }
}

export default useRevealLetters
