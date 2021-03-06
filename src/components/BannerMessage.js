import './BannerMessage.css'
import PropTypes from 'prop-types'
import {useEffect} from 'react'
import useQuickRevertBoolean from '../hooks/useQuickRevertBoolean'

function BannerMessage({message, duration}) {
  const {status, toggleOn, toggleOff} = useQuickRevertBoolean()

  useEffect(() => {
    toggleOn(duration)
  }, [])

  return (
    <div className={`BannerMessage ${status ? 'show' : ''}`}>
      <p>{message}</p>
      <div className={'BannerMessageTimer'} style={{transition: `width ${duration / 1000}s`}} />
    </div>
  )
}

BannerMessage.propTypes = {
  message: PropTypes.string,
  duration: PropTypes.number,
}

export default BannerMessage
