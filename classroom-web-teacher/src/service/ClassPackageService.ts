import type { Facility } from '@/constant'
import { Subject } from '@service/SubjectService'

export type ClassPackage = {
  subject: string
  lecture: string
  classPackageFolderUrl: string
  minutesPaperFormUrl: string
  isAttendance: boolean
  published: 0 | 1
}

export default interface ClassPackageService {
  getClassPackageSheet: (facility: Facility) => GoogleAppsScript.Spreadsheet.Sheet
  getClassPackages: (facility: Facility, subjects: Subject[]) => ClassPackage[]
  setReady: (facility: Facility, classPackageUrl: string) => void
  setPrivate: (facility: Facility, classPackageUrl: string) => void
}
