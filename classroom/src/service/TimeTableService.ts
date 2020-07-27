import type { CreateMinutesPaperResult } from '@service/MinutesPaperService'
import type { CreateLectureFoldersResult } from '@service/SchoolClassService'
import type * as Constant from '@/constant'

export default interface TimeTableService {

  createTimeTable: (grade: string) => GoogleAppsScript.Spreadsheet.Spreadsheet

  findTimeTable: (grade: Constant.Grade | string) => GoogleAppsScript.Spreadsheet.Spreadsheet | undefined

  registerContentsLinkRow: (
    ss: GoogleAppsScript.Spreadsheet.Spreadsheet
    , createLectureFoldersResults: CreateLectureFoldersResult[]
  ) => void
  
  syncLectureName: (grade: Constant.Grade) => void

  registerMinutesPaperLinkRow: (
    timeTable: GoogleAppsScript.Spreadsheet.Spreadsheet
    , subject: string
    , lecture: string
    , createMinutesPaperResult: CreateMinutesPaperResult
  ) => void
}
