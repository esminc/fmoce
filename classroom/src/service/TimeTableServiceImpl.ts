import TimeTableService from '@service/TimeTableService'
import type { CreateMinutesPaperResult } from '@service/MinutesPaperService'
import { CreateLectureFoldersResult } from '@service/SchoolClassService'
import type * as Constant from '@/constant'

export default class TimeTableServiceImpl implements TimeTableService {
  private readonly sheetName = '授業パッケージ一覧'
  constructor(
    private readonly rootFolderId: string
  ) {}

  createTimeTable(grade: string): GoogleAppsScript.Spreadsheet.Spreadsheet {
    const timeTableOptional = this.findTimeTable(grade)
    if(timeTableOptional) return timeTableOptional

    const rootFolder = DriveApp.getFolderById(this.rootFolderId)
    const ssName = `${grade}年生`
    const ssId = SpreadsheetApp.create(ssName).getId()
    const file = DriveApp.getFileById(ssId)

    rootFolder.addFile(file)
    DriveApp.getRootFolder().removeFile(file)
    const copied = SpreadsheetApp.openById(rootFolder.getFilesByName(ssName).next().getId())
    copied.getSheets()[0].setName(this.sheetName)

    return copied
  }

  // TODO 引数の型をGradeだけにする
  findTimeTable(grade: Constant.Grade | string): GoogleAppsScript.Spreadsheet.Spreadsheet | undefined {
    const rootFolder = DriveApp.getFolderById(this.rootFolderId)
    const file = rootFolder.getFilesByName(`${grade}年生`)

    if(!file.hasNext()) return undefined

    return SpreadsheetApp.openById(file.next().getId())
  }

  registerContentsLinkRow(
    ss: GoogleAppsScript.Spreadsheet.Spreadsheet
    , createLectureFoldersResults: CreateLectureFoldersResult[]
  ): void {
    const sheet = ss.getSheetByName(this.sheetName)
    const _results = createLectureFoldersResults.reduce((acc, current) => {
      acc.push([
        current.subject,
        current.lecture,
        current.contentFolderId,
        current.contentFolderUrl
      ])
      return acc
    }, [])
    const existRows = sheet.getDataRange().getValues().length
    const rowIndexFrom = existRows === 1 ? 1 : existRows + 1
    const nextRange = sheet.getRange(rowIndexFrom, 1, _results.length, 4)
    nextRange.setValues(_results)
  }

  syncLectureName(grade: Constant.Grade): void {
    const timeTableSs = this.findTimeTable(grade)
    if(!timeTableSs) return

    const sheet = timeTableSs!.getSheetByName(this.sheetName)
    const folderIds = sheet.getDataRange().getValues().map(_ => _[2])

    folderIds.forEach(folderId => {
      const lectureFolder = DriveApp.getFolderById(folderId)
      if(this.isDeleted(lectureFolder)) {
        const idx = sheet.getDataRange().getValues().findIndex(row => row[2] === folderId)
        sheet.deleteRow(idx + 1)

        console.log(`folderId=${folderId} was deleted.`)
        return
      }

      try {
        const subjectFolder = lectureFolder.getParents().next()

        const subject = subjectFolder.getName()
        const lecture = lectureFolder.getName()

        const idx = sheet.getDataRange().getValues().findIndex(row => row[2] === folderId)
        sheet.getRange(idx + 1, 1, 1, 2).setValues([[subject, lecture]])
        console.log(`${idx}: folderId=${folderId} was updated. ${grade} >  ${subject} > ${lecture}`)
      } catch(e) {
       console.error(`例外発生: folderId=${folderId} ${e}`)
      }
    })
  }

  isDeleted(folder: GoogleAppsScript.Drive.Folder): boolean {
    if(folder.isTrashed()) return true

    const subjectFolderOptional = folder.getParents()
    if(!subjectFolderOptional.hasNext()) return true
    return false
  }

  registerMinutesPaperLinkRow(
    timeTable: GoogleAppsScript.Spreadsheet.Spreadsheet
    , subject: string
    , lecture: string
    , createMinutesPaperResult: CreateMinutesPaperResult
  ): void {
    const sheet = timeTable.getSheetByName(this.sheetName)
    const values = sheet.getDataRange().getValues()
    const rowIndex = values
      .findIndex(_ => _[0] === subject && _[1] === lecture)
    if(rowIndex === -1) return

    const range = sheet.getRange(rowIndex + 1, 5, 1, 2)
    range.setValues([[createMinutesPaperResult.folderUrl, createMinutesPaperResult.publishUrl]])
  }
}
