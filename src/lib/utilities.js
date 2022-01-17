import {WRONG, CORRECT, ALMOST} from './constants'

class InvalidGuess extends Error {
  constructor(guess, word) {
    super(`"${guess}" is not a valid solution for word "${word}"`)
  }
}

const words5 = require('./dictionaries/words5.json')
const words6 = require('./dictionaries/words6.json')
const words7 = require('./dictionaries/words7.json')
const words8 = require('./dictionaries/words8.json')

const dictionary = {
  words5,
  words6,
  words7,
  words8,
}

/**
 * @param {number} length
 * @return {string}
 */
export const getWordOfLength = length => {
  let words = dictionary[`words${length}`]
  return words[Math.floor(Math.random() * words.length)]
}

/**
 * @param {string} guessedWord
 * @param {string} secretWord
 * @return {*[]}
 */
export const determineGuessResults = (guessedWord, secretWord) => {
  let retVal = []

  // we want to count how many times each character appears this way for a word like "TEAL", if they guess "TEST"
  // it won't suggest the second 2 is "almost" because it will know there's only 1 T
  // we only count characters that are NOT correct so that a guess like "EERR" for word "TEST" won't show the first E as correct
  let memo = {}
  for (let i = 0; i < secretWord.length; i++) {
    let char = secretWord[i]
    if (typeof memo[char] !== 'number') {
      memo[char] = 0
    }

    if (char !== guessedWord[i]) {
      memo[char]++
    }
  }

  // now we loop through the guess and determine what's right
  for (let i = 0; i < guessedWord.length; i++) {
    let thisChar = guessedWord[i]
    let charExists = memo[thisChar] && memo[thisChar] > 0
    if (thisChar === secretWord[i]) {
      retVal.push(CORRECT)
    } else if (charExists) {
      // deduct this character from the count so we don't count it twice
      retVal.push(ALMOST)
      memo[thisChar]--
    } else {
      retVal.push(WRONG)
    }
  }

  return retVal
}

/**
 * @returns {string}
 */
export const randomCharacters = () => {
  Math.random().toString(36).substr(2)
}

/**
 * @param {string} char
 * @return {number}
 */
export const getLetterPointValue = char => {
  // TODO: we want some letters to be worth more (scrabble style)
  return 1
}

const POINTS_TO_CONST = [null, WRONG, ALMOST, CORRECT]
const CONST_TO_POINTS = {
  [WRONG]: 1,
  [ALMOST]: 2,
  [CORRECT]: 3,
}

/**
 * @param {string} guess
 * @param {string} word
 * @param {Array<string>} pattern
 */
export function getPointsForGuessReverse(guess, word, pattern) {
  if (guess.length !== word.length || word.length !== pattern.length) {
    throw new InvalidGuess(guess, word)
  }

  let resultingPattern = determineGuessResults(guess, word)
  // if any of the resulting letter statuses do not match the canonical pattern, it means the word does not satisfy the criteria
  let isMismatch = resultingPattern.some((guessP, index) => pattern[index] !== guessP)

  if (isMismatch) {
    throw new InvalidGuess(guess, word)
  }

  return pattern.map((letterStatus, index) => CONST_TO_POINTS[letterStatus] * getLetterPointValue(guess.charAt(index)))
}

/**
 * @param {string} w
 * @param {number} numberOfRows
 * @param {boolean} lastRowIsCorrect
 */
export function getRandomPatternsFromWord(w, numberOfRows, lastRowIsCorrect) {
  // rather than just guessing 6 words at random, we want the board to feel like a believable result with more action towards the bottom
  // so we allocate more points to the bottom (later) rows
  // I guess it's "possible" that a pattern combination exists without ~any~ viable words to fill it, but I doubt it
  let retVal = []

  // cut the loop short by 1 if lastRowIsCorrect. It's handled below
  const numIterations = lastRowIsCorrect ? numberOfRows - 1 : numberOfRows
  for (let i = 0; i < numIterations; i++) {
    let pointsToDistribute = Math.floor(Math.pow(i, 2) * Math.random())

    // in an effort to reduce the number of unsolvable answers, we restrict the number of CORRECT squares to 1
    let hasUsedCorrect = false
    let rowVal = []
    for (let j = 0; j < w.length; j++) {
      if (pointsToDistribute <= 0) {
        rowVal.push(WRONG)
        continue
      }

      // this will give us a value between 0 and 2 and inclusive
      let pointsForThisLetter = Math.floor(Math.random() * CONST_TO_POINTS[hasUsedCorrect ? ALMOST : CORRECT])

      hasUsedCorrect = hasUsedCorrect || pointsForThisLetter + 1 === CONST_TO_POINTS[CORRECT]

      rowVal.push(POINTS_TO_CONST[pointsForThisLetter + 1])

      pointsToDistribute -= pointsForThisLetter
    }
    retVal.push(rowVal)
  }

  // if the last row is correct, then we push a full array of Correct statuses
  if (lastRowIsCorrect) {
    retVal.push([...new Array(w.length)].map(e => CORRECT))
  }

  return retVal
}
