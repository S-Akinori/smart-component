export interface ComponentDoc {
  id: string
  uid: string
  name: string
  html: string
  css: string
  status: 'public' | 'readOnly' | 'private'
  js: string
}