export const getSquareSize = (boardDimensions) => {
  switch (true) {
    case boardDimensions < 4:
      return 'l'
    case boardDimensions < 6:
      return 'm'
    case boardDimensions < 8:
      return 's'
    default:
      return 'xs'
  }
}
