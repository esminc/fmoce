import NumberUtil from '../../src/util/NumberUtil'

describe('toFloat', () => {
  test('has decimal', () => {
    // arrange
    const s = '36.1'

    // action
    const result = NumberUtil.toFloat(s)

    // assert
    expect(result).toEqual(36.1)
  })
  test('has no decimal', () => {
    // arrange
    const s = '36'

    // action
    const result = NumberUtil.toFloat(s)

    // assert
    expect(result).toEqual(36)
  })
})
