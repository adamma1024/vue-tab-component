const charWidthTable = {
  1: ['.', '!', '|', ','],
  2: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
    'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
    'W', 'X', 'Y', 'Z', '@', '~', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '+', '{', '}', '[', ']', '\\', '/', '<', '>',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
  ]
}
const getCharWidth = (char) => {
  for (let i = 0; i < charWidthTable[1].length; i += 1) {
    if (char === charWidthTable[1][i]) {
      return 1
    }
  }
  for (let i = 0; i < charWidthTable[2].length; i += 1) {
    if (char === charWidthTable[2][i]) {
      return 1.5
    }
  }
  return 3
}

export const shortText = (text, length) => {
  if (!text) return ''
  let showtextShort = text
  let short = true
  const strArr = text.split('')
  const strWidth = []
  let sum = 0
  for (let i = 0; i < strArr.length; i += 1) {
    sum += getCharWidth(strArr[i])
    strWidth.push(sum)
  }
  const lengthFlag = length * 3
  if (sum > lengthFlag) {
    short = false
    let splitPoint = 0
    for (let j = 0; j < strWidth.length; j += 1) {
      if (strWidth[j] > lengthFlag) {
        splitPoint = j
        break
      }
    }
    showtextShort = `${text.substring(0, splitPoint)}...`
  }
  return short ? false : showtextShort
}
