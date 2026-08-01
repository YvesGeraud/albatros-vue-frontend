import client from './client'

export const adminUploads = {
  upload(file, folder) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    return client.post('/api/v1/admin/uploads', formData).then((r) => r.data)
  },
}
