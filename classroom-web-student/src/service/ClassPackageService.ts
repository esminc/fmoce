import type { Grade } from '@service/StudentService'

export type ClassPackage = {
  subject: string
  lecture: string
  classPackageFolderUrl: string
  minutesPaperFormUrl: string
}

export default interface ClassPackageService {
  getClassPackagesByGrades: (grades: Grade[]) => ClassPackage[]
}
