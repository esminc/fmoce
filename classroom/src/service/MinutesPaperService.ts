import { SchoolClass } from '@service/SchoolClassService'

export type CreateMinutesPaperResult = {
  folderUrl: string
  publishUrl: string
}

export default interface MinutesPaperService {
  createGradeFolder: (grade: string) => GoogleAppsScript.Drive.Folder
  createMinutesPaperRootFolder: (gradeFolder: GoogleAppsScript.Drive.Folder) => GoogleAppsScript.Drive.Folder
  createSubjectFolder: (minutesPaperRootFolder: GoogleAppsScript.Drive.Folder, schoolClass: SchoolClass) => GoogleAppsScript.Drive.Folder
  createMinutesPapers: (
    subjectFolder: GoogleAppsScript.Drive.Folder,
    lecture: string
  ) => CreateMinutesPaperResult | undefined
}
