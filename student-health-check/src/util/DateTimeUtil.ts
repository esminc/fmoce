import { DateTime, Duration } from 'luxon'

const TZ = 'Asia/Tokyo'

export default {
  isBigger(date1: string, date2: string): boolean {
    const dt1 = DateTime.fromJSDate(new Date(date1), {zone: TZ})
    const dt2 = DateTime.fromJSDate(new Date(date2), {zone: TZ})

    return dt1 >= dt2
  },
  toDateString(date: string): string {
    const dt = DateTime.fromJSDate(new Date(date), {zone: TZ})
    return dt.toFormat('yyyy/MM/dd HH:mm')
  },
  isLessThanTwoWeeks(date: string, today?: DateTime): boolean {
    const _today: DateTime = today || DateTime.local().setZone(TZ)
    const duration = Duration.fromObject({ weeks: 2 })
    const twoWeeksAgo = _today.minus(duration)

    const dt = DateTime.fromJSDate(new Date(date), {zone: TZ})
    return twoWeeksAgo <= dt
  }
}
