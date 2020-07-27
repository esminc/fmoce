import type { Facility } from '@/constant'

export type Subject = {
  name: string
}

export default interface SubjectService {
  getSubjectsByGrade: (facility: Facility, teacherMailAddress: string) => Subject[]
}
