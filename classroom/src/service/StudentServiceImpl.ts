import StudentService from '@service/StudentService'

export default class StudentServiceImpl implements StudentService {
  constructor(private readonly spreadSheetId: string) {}

  findMailAddresses(grade: string): string[] {
    const students: string[][] = SpreadsheetApp
      .openById(this.spreadSheetId)
      .getSheetByName('学生一覧')
      .getDataRange()
      .getValues()

    return students
      .filter(_ => _[0] === grade)
      .map(_ => _[1])
      .filter(_ => _) // 空文字を除去
      .filter(_ => _.includes('@g.u-fukui.ac.jp'))
  }
}
