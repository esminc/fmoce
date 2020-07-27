import type { Grade } from '@service/StudentService'
import type { ClassPackage } from '@service/ClassPackageService'
import ClassPackageService from '@service/ClassPackageService'

export default class ClassPackageServiceImpl implements ClassPackageService {
  constructor(
    private readonly rootFolderId: string
  ) {}

  getClassPackagesByGrades(grades: Grade[]): ClassPackage[] {
    let result: ClassPackage[] = []
    const rootFolder = DriveApp.getFolderById(this.rootFolderId)

    grades.forEach(grade => {
      const spreadSheetId = rootFolder.getFilesByName(`${grade}年生`).next().getId()
      const sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName('授業パッケージ一覧')
      const classPackages = sheet.getDataRange().getValues()

      const cps = classPackages
        .map(_ => {
        return {
          subject: _[0],
          lecture: _[1],
          classPackageFolderUrl: _[6]? _[3] : '', // 未公開なら空文字を設定
          minutesPaperFormUrl: _[6]? _[5] : '', // 未公開なら空文字を設定. 公開済みなら、フォームの回答URLを設定
        }
      })

      result = result.concat(cps)
    })

    return result
  }
}
