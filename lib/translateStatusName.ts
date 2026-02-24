const translateStatusName = (name: string): string => {
  switch (name.toLowerCase()) {
    case 'amenazada':
      return 'Threatened'
    case 'sujeta a protección especial':
      return 'Subject to special protection'
    case 'en peligro de extinción':
      return 'In danger of extinction'
    default:
      return name
  }
}

export default translateStatusName
