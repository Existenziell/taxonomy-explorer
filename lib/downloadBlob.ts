/**
 * Triggers a download of a Blob as a file with the given filename and MIME type.
 */
function downloadBlob (blob: Blob, filename: string, _mimeType: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export default downloadBlob
