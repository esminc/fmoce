import SchoolClassService, { SchoolClass, CollectLectureFoldersResult, CreateLectureFoldersResult } from '@service/SchoolClassService'

export default class SchoolClassServiceImpl implements SchoolClassService {
  constructor(
    private readonly rootFolderId: string
  ) {}

  getGradeTitle(): string {
    // シートを取得
    const sheet = SpreadsheetApp.getActiveSheet()

    // タイトルを返却
    return sheet.getRange('B1').getValue()
  }

  findSchoolClasses(): SchoolClass[] {
    // シートを取得
    const sheet = SpreadsheetApp.getActiveSheet()

    // 講義の一覧を取得
    const classes = sheet.getDataRange().getValues()

    // 科目一覧を取得
    const subjectSet = new Set<string>()
    for(let i = 2; i < classes.length; i++) {
      subjectSet.add(classes[i][0])
    }

    // 科目ごとの講義を取得
    const schoolClasses: SchoolClass[] = []
    subjectSet.forEach((subject1, subject2, set) => {
       const classesBySubject: string[][] = classes.filter(_ => _[0] === subject1)
       const lectures = classesBySubject.map(_ => (
         {
           name: _[1]
         }
       ))

       schoolClasses.push({
         subject: subject1,
         lectures: lectures
       })
    })
    return schoolClasses
  }

  createGradeFolder(gradeTitle: string): GoogleAppsScript.Drive.Folder {
    const rootFolder = DriveApp.getFolderById(this.rootFolderId)
    const gradeFolderOptional = rootFolder.getFoldersByName(`${gradeTitle}年生`)
    if(gradeFolderOptional.hasNext()) {
      return gradeFolderOptional.next()
    }

    return rootFolder.createFolder(`${gradeTitle}年生`)
  }

  createClassPackageRootFolder(gradeFolder: GoogleAppsScript.Drive.Folder): GoogleAppsScript.Drive.Folder {
    const classPackageRootFolderOptional = gradeFolder.getFoldersByName('学生')
    if(classPackageRootFolderOptional.hasNext()) {
      return classPackageRootFolderOptional.next()
    }

    return gradeFolder.createFolder('学生')
  }

  createSubjectFolder(classPackageRootFolder: GoogleAppsScript.Drive.Folder, schoolClass: SchoolClass): GoogleAppsScript.Drive.Folder {
    const subjectFolderOptional = classPackageRootFolder.getFoldersByName(schoolClass.subject)
    if(subjectFolderOptional.hasNext()) {
      return subjectFolderOptional.next()
    }
    return classPackageRootFolder.createFolder(schoolClass.subject)
  }

  createLectureFolders(subjectFolder: GoogleAppsScript.Drive.Folder, schoolClass: SchoolClass): CreateLectureFoldersResult[] {
    const results: CreateLectureFoldersResult[] = []

    const syllabusFolder = this.createSyllabusFolder(subjectFolder)
    if(syllabusFolder) {
      results.push({
        subject: schoolClass.subject,
        lecture: syllabusFolder.lecture,
        contentFolderId: syllabusFolder.contentFolderId,
        contentFolderUrl: syllabusFolder.contentFolderUrl
      })
    }

    schoolClass.lectures.forEach(lecture => {
      const lectureFolderOptional = subjectFolder.getFoldersByName(lecture.name)
      if(lectureFolderOptional.hasNext()) return

      const lectureFolder = subjectFolder.createFolder(lecture.name)

      results.push({
        subject: schoolClass.subject,
        lecture: lecture.name,
        contentFolderId: lectureFolder.getId(),
        contentFolderUrl: lectureFolder.getUrl()
      })
    })

    return results
  }

  createSyllabusFolder(subjectFolder: GoogleAppsScript.Drive.Folder): Omit<CreateLectureFoldersResult, 'subject'> | undefined {
    const syllabus = '講義スケジュール・シラバス'
    const folderOptional = subjectFolder.getFoldersByName(syllabus)
    if(folderOptional.hasNext()) return undefined;

    const folder = subjectFolder.createFolder(syllabus)
    return {
      lecture: syllabus,
      contentFolderId: folder.getId(),
      contentFolderUrl: folder.getUrl()
    }
  }

  findStudentRootFolder(grade: string): GoogleAppsScript.Drive.Folder {
    return DriveApp
      .getFolderById(this.rootFolderId)
      .getFoldersByName(`${grade}年生`).next()
      .getFoldersByName('学生').next()
  }

  shareWith(folder: GoogleAppsScript.Drive.Folder, mailAddresses: string[]): void {
    if(!mailAddresses.length) return

    const folderId   = folder.getId()
    const folderName = folder.getName()

    mailAddresses.forEach(_ => {
      console.log(`shareWith: ${folderName} to ${_}`)
      try {
        Drive.Permissions.insert(
          {
            'role': 'reader',
            'type': 'user',
            'value': _.trim()
          }
          , folderId ,
          {
            'sendNotificationEmails': 'false'
          }
        )
      } catch(e) {
        console.log(`例外発生: ${folderName} を ${_} さんへ共有できません。 ${e}`)
      }
    })
  }
}
