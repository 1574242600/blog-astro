import type DisqusJS from 'disqusjs'

declare global {
  interface Window {
    disqusjs?: DisqusJS;
    temp?: Record<string, unknown>
  }
}