import { DateTime } from 'luxon'
import DateTimeUtil from '../../src/util/DateTimeUtil'

describe('isBigger', () => {
  test('if first arg is bigger, return true', () => {
    // arrange
    const dt1 = '2020/04/01 12:00:01'
    const dt2 = '2020/04/01 12:00:00'

    // action
    const result = DateTimeUtil.isBigger(dt1, dt2)

    // assert
    expect(result).toEqual(true)
  })
  test('if second arg is bigger, return false', () => {
    // arrange
    const dt1 = '2020/04/01 12:00:00'
    const dt2 = '2020/04/01 12:00:01'

    // action
    const result = DateTimeUtil.isBigger(dt1, dt2)

    // assert
    expect(result).toEqual(false)
  })
  test('if two args are same, return true', () => {
    // arrange
    const dt1 = '2020/04/01 12:00:00'
    const dt2 = '2020/04/01 12:00:00'

    // action
    const result = DateTimeUtil.isBigger(dt1, dt2)

    // assert
    expect(result).toEqual(true)
  })
})

describe('toDateString', () => {
  test('DateTime to yyyy/MM/dd string. month and date are 01~09', () => {
    // arrange
    const date = '2020/04/01 06:00:59'

    // action
    const result = DateTimeUtil.toDateString(date)

    // assert
    expect(result).toEqual('2020/04/01 06:00')
  })

  test('DateTime to yyyy/MM/dd string. month and date are 10~31', () => {
    // arrange
    const date = '2020/10/21 23:59:04'

    // action
    const result = DateTimeUtil.toDateString(date)

    // assert
    expect(result).toEqual('2020/10/21 23:59')
  })
})

describe('isLessThanTwoWeeks', () => {
  const mockToday = DateTime.fromFormat('2020/04/05 23:59:59', 'yyyy/MM/dd hh:mm:ss', {zone: 'Asia/Tokyo'}) 

  test('if date is less than two weeks, return true', () => {
    // arrange
    const date = '2020/03/31 12:00:00'

    // action
    const result = DateTimeUtil.isLessThanTwoWeeks(date, mockToday)
    
    // assert
    expect(result).toEqual(true)
  })

  test('if date is not less than two weeks, return false', () => {
    // arrange
    const date = '2020/03/21 23:59:59'

    // action
    const result = DateTimeUtil.isLessThanTwoWeeks(date, mockToday)
    
    // assert
    expect(result).toEqual(false)
  })

  test('if date just two weeks ago, return true', () => {
    // arrange
    const date = '2020/03/29 20:00:00'

    // action
    const result = DateTimeUtil.isLessThanTwoWeeks(date, mockToday)
    
    // assert
    expect(result).toEqual(true)
  })
})
