import './WordLengthOptions.css'
import PropTypes from 'prop-types'

const MAX_NUMBER = 8
const MIN_NUMBER = 5

function WordLengthOptions(props) {
  return (
    <div onChange={e => props.onChange(parseInt(e.target.value))}>
      {[...new Array(MAX_NUMBER - MIN_NUMBER + 1)].map((e, i) => {
        const number = i + MIN_NUMBER
        return (
          <div key={number} className="WordCountOptions">
            <label>
              <input name="word-length" type="radio" value={number} defaultChecked={props.value === number} />
              {number}
            </label>
          </div>
        )
      })}
    </div>
  )
}

WordLengthOptions.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
}

export default WordLengthOptions
