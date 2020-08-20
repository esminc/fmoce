export type Facility = {
  grade: 1 | 2 | 3 | 4 | 5 | 6
}

const facilityOf = (identifier: string): Facility => {
  switch(identifier) {
    case '1':  return {grade: 1}
    case '2':  return {grade: 2}
    case '3':  return {grade: 3}
    case '4':  return {grade: 4}
    case '5':  return {grade: 5}
    case '6':  return {grade: 6}
  }
}

export default facilityOf
