import ClassPackageService, { ClassPackage } from '@service/ClassPackageService'
import { Subject } from '@service/SubjectService'
import type { Facility } from '@/constant'

export default class ClassPackageServiceImpl implements ClassPackageService {
  constructor(
    private readonly rootFolderId: string
  ) {}

  getClassPackageSheet(facility: Facility): GoogleAppsScript.Spreadsheet.Sheet {
    const ssId = DriveApp
      .getFolderById(this.rootFolderId)
      .getFilesByName(`${facility.grade}年生`).next()
      .getId()

    return SpreadsheetApp.openById(ssId).getSheetByName('授業パッケージ一覧')
  }

  getClassPackages(facility: Facility, subjects: Subject[]): ClassPackage[] {
    const sheet = this.getClassPackageSheet(facility)
    const contentsBySubject = sheet.getDataRange().getValues()

    return contentsBySubject
      .filter(_ => subjects.find(s => s.name === _[0]))
      .map(_ => {
        return {
          subject: _[0],
          lecture: _[1],
          classPackageFolderUrl: _[3],
          minutesPaperFormUrl: _[4],
          isAttendance: !_[5], // ミニッツペーパーの公開URLがない場合は、出席管理のリンクとみなす
          published: _[6] === 1 ? 1 : 0
        }
      })
  }

  setReady(facility: Facility, classPackageUrl: string): void {
    const sheet = this.getClassPackageSheet(facility)
    const classPackages = sheet.getDataRange().getValues()

    // 公開フラグを「公開」に設定
    const idx = classPackages.findIndex(_ => _[3] === classPackageUrl)
    sheet.getRange(idx + 1, 7, 1, 1).setValue('1')

    // フォルダのリンク共有をONにする
    const row = classPackages.find(_ => _[3] === classPackageUrl)
    const folderId = row[2]
    DriveApp.getFolderById(folderId).setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.VIEW)
  }

  setPrivate(facility: Facility, classPackageUrl: string): void {
    const sheet = this.getClassPackageSheet(facility)
    const classPackages = sheet.getDataRange().getValues()

    // 公開フラグを「非公開」に設定
    const idx = classPackages.findIndex(_ => _[3] === classPackageUrl)
    sheet.getRange(idx + 1, 7, 1, 1).clear()

    // フォルダのリンク共有をONにする
    const row = classPackages.find(_ => _[3] === classPackageUrl)
    const folderId = row[2]
    DriveApp.getFolderById(folderId).setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE)
  }
}
