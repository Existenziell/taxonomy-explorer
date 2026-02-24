const capitalize = (string: string | null | undefined): string | undefined => {
  const cap = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  if (!string) return undefined
  return string.split(' ').map(cap).join(' ')
}

export default capitalize
