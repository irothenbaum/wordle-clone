import {useEffect, useState} from 'react'

function useKeyListener(handleKeyPress) {
  useEffect(() => {
    const handler = e => {
      handleKeyPress(e.key)
    }

    window.document.addEventListener('keydown', handler)

    return () => {
      window.document.removeEventListener('keydown', handler)
    }
  }, [handleKeyPress])

  return {}
}

export default useKeyListener
