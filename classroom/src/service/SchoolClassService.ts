// TODO entityパッケージに移動する
export type SchoolClass = {
  subject: string
  lectures: {
    name: string
  }[]
}

export type CollectLectureFoldersResult = {
  subject: string
  lecture: string
}

export type CreateLectureFoldersResult = CollectLectureFoldersResult & {
  contentFolderId: string
  contentFolderUrl: string
}

export default interface SchoolClassService {
  getGradeTitle: () => string
  findSchoolClasses: () => SchoolClass[]
  createGradeFolder: (gradeTitle: string) => GoogleAppsScript.Drive.Folder
  createClassPackageRootFolder: (gradeFolder: GoogleAppsScript.Drive.Folder) => GoogleAppsScript.Drive.Folder
  createSubjectFolder: (classPackageFolder: GoogleAppsScript.Drive.Folder, schoolClass: SchoolClass) => GoogleAppsScript.Drive.Folder
  createLectureFolders: (subjectFolder: GoogleAppsScript.Drive.Folder, schoolClass: SchoolClass) => CreateLectureFoldersResult[]
  findStudentRootFolder: (grade: string) => GoogleAppsScript.Drive.Folder
  shareWith: (folder: GoogleAppsScript.Drive.Folder, mailAddresses: string[]) => void
}
