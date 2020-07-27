import SubjectServiceImpl from '@service/SubjectServiceImpl'
import ClassPackageServiceImpl from '@service/ClassPackageServiceImpl'

export type { Subject } from '@service/SubjectService'
export const SubjectService = SubjectServiceImpl
export type { ClassPackage } from '@service/ClassPackageService'
export const ClassPackageService = ClassPackageServiceImpl
