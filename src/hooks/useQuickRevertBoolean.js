import {useEffect, useState} from 'react'

function useQuickRevertBoolean() {
  const [status, setStatus] = useState(false)
  const [timeout, markTimeout] = useState(null)

  useEffect(() => {
    return () => {
      if (markTimeout) {
        clearTimeout(markTimeout)
      }
    }
  }, [])

  const toggleOn = duration => {
    if (timeout) {
      return
    }

    setStatus(true)
    markTimeout(setTimeout(toggleOff, duration || 500))
  }

  const toggleOff = () => {
    setStatus(false)
    markTimeout(null)
  }

  return {
    status,
    toggleOn,
    toggleOff,
  }
}

export default useQuickRevertBoolean
