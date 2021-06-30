const { createSideBarConfig } = require('./util')
const CSS_PATH = '/views/CSS'
// const ENGiNEERING_PATH = '/docs/views/Engineering'
// const JAVASCRIPT_PATH = '/docs/views/JavaScript'
// const MOBILE_PATH = '/docs/views/Mobile'
// const PC_PATH = '/docs/views/PC'
// const TYPESCRIPT_PATH = '/docs/views/TypeScript'
// const VUE_PATH = '/views/Vue'


module.exports = {
  [CSS_PATH]: [createSideBarConfig('CSS', CSS_PATH)],
  // [ENGiNEERING_PATH]: [createSideBarConfig('ENGiNEERING', ENGiNEERING_PATH)],
  // [JAVASCRIPT_PATH]: [createSideBarConfig('JAVASCRIPT', JAVASCRIPT_PATH)],
  // [MOBILE_PATH]: [createSideBarConfig('MOBILE', MOBILE_PATH)],
  // [PC_PATH]: [createSideBarConfig('PC', PC_PATH)],
  // [TYPESCRIPT_PATH]: [createSideBarConfig('TYPESCRIPT', TYPESCRIPT_PATH)],
  // [VUE_PATH]: [createSideBarConfig('VUE', VUE_PATH)],
}
