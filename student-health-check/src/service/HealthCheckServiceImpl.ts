import NumberUtil from '@util/NumberUtil'
import DateTimeUtil from '@util/DateTimeUtil'
import { HealthCheck, HealthCheckService } from '@service/HealthCheckService'

export class HealthCheckServiceImpl implements HealthCheckService {
  constructor(
    private spreadSheetId: string
  ) {}

  findByMailAddress(mailAddress: string): HealthCheck[] {
    const sheet = SpreadsheetApp.openById(this.spreadSheetId).getSheetByName('健康管理')
    const rows = sheet.getDataRange().getValues()
      .filter(_ => _[1] === mailAddress)
      .filter(_ => DateTimeUtil.isLessThanTwoWeeks(_[0]))

    return rows
      .sort((row1, row2) => DateTimeUtil.isBigger(row1[0], row2[0]) ? 1 : -1)
      .map(_ => {
        return {
          timestamp: DateTimeUtil.toDateString(_[0]),
          temp: NumberUtil.toFloat(_[2])
        }
      })
  }
}
