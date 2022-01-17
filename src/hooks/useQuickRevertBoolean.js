import {useState} from 'react'

function useQuickRevertBoolean() {
  const [status, setStatus] = useState(false)
  const [timeout, markTimeout] = useState(null)
  return {
    status,
    toggleOn: duration => {
      if (timeout) {
        return
      }

      setStatus(true)
      markTimeout(
        setTimeout(() => {
          setStatus(false)
          markTimeout(null)
        }, duration || 500),
      )
    },
  }
}

export default useQuickRevertBoolean
