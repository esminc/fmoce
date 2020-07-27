import SubjectService, { Subject } from '@service/SubjectService'
import type { Facility } from '@/constant'

export default class SubjectServiceImpl implements SubjectService {
  constructor(
    private readonly spreadSheetId: string
  ) {}

  getSubjectsByGrade(facility: Facility, teacherMailAddress: string): Subject[] {
    const sheet = SpreadsheetApp.openById(this.spreadSheetId).getSheetByName('担当教員一覧')
    const subjectsByTeacher = sheet.getDataRange().getValues()

    return subjectsByTeacher
      .filter(_ => _[0] === facility.grade && _[2] === teacherMailAddress)
      .map(_ => {
        return { name: _[1] }
      })
  }
}
