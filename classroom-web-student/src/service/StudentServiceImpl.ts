import type { Grade } from '@service/StudentService'
import StudentService from '@service/StudentService'

export default class StudentServiceImpl implements StudentService {
  constructor(
    private readonly spreadSheetId: string
  ) {}

  getGradesByMailAddress(mailAddress: string): Grade[] {
    const sheet = SpreadsheetApp.openById(this.spreadSheetId).getSheetByName('学生一覧')
    const students = sheet.getDataRange().getValues()
    
    return students
      .filter(_ => _[1] === mailAddress)
      .map(_ => _[0])
  }
}
