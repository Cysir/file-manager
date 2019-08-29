/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */
import user from './user'
const files = require.context('.', false, /\.js$/)
const modules = {
  user,
}

files.keys().forEach(key => {
  if (key === './index.js') return;
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})
export default modules
