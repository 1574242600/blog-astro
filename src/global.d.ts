import type DisqusJS from 'disqusjs'

declare global {
  interface Window {
    disqusjs?: DisqusJS;
  }
}