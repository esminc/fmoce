export default interface StudentService {
  findMailAddresses: (grade: string) => string[]
}
