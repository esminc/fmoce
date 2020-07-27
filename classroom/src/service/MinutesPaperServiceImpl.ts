import type { CreateMinutesPaperResult } from '@service/MinutesPaperService'
import MinutesPaperService from '@service/MinutesPaperService'
import { SchoolClass } from '@service/SchoolClassService'

export default class MinutesPaperServiceImpl implements MinutesPaperService {
  constructor(
    private readonly rootFolderId: string,
    private readonly minutesPaperFormId: string
  ) {}

  createGradeFolder(grade: string): GoogleAppsScript.Drive.Folder {
    const rootFolder = DriveApp.getFolderById(this.rootFolderId)
    const gradeFolderOptional = rootFolder.getFoldersByName(`${grade}年生`)
    if(gradeFolderOptional.hasNext()) {
      return gradeFolderOptional.next()
    }

    return rootFolder.createFolder(`${grade}年生`)
  }

  createMinutesPaperRootFolder(gradeFolder: GoogleAppsScript.Drive.Folder): GoogleAppsScript.Drive.Folder {
    const minutesPaperRootFolderOptional = gradeFolder.getFoldersByName('教員') 
    if(minutesPaperRootFolderOptional.hasNext()) {
      return minutesPaperRootFolderOptional.next()
    }

    return gradeFolder.createFolder('教員')
  }

  createSubjectFolder(classPackageFolder: GoogleAppsScript.Drive.Folder, schoolClass: SchoolClass): GoogleAppsScript.Drive.Folder {
    const subject = schoolClass.subject
    const subjectFolderOptional = classPackageFolder.getFoldersByName(subject)
    if(subjectFolderOptional.hasNext()) {
      return subjectFolderOptional.next()
    }

    return classPackageFolder.createFolder(subject)
  }

  createMinutesPapers(
    subjectFolder: GoogleAppsScript.Drive.Folder,
    lecture: string
  ): CreateMinutesPaperResult | undefined {
    const minutesPaperTemplate = DriveApp.getFileById(this.minutesPaperFormId)
    const lectureFolderOptional = subjectFolder.getFoldersByName(lecture)
    if(lectureFolderOptional.hasNext()) return undefined
    
    const lectureFolder = subjectFolder.createFolder(lecture)

    const copied = minutesPaperTemplate.makeCopy(lectureFolder)
    copied.setName('ミニッツペーパー')
    const form = FormApp.openById(copied.getId())
    form.setTitle('ミニッツペーパー')

    return {
      folderUrl: lectureFolder.getUrl(),
      publishUrl: form.getPublishedUrl()
    }
  }

}
