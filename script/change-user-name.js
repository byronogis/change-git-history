import { $, cd, chalk, fetch } from 'zx'

/**
 * runChangeUserName
 * @param {string[]} oldNames 
 * @param {string} newName 
 * @param {object} options 
 * @param {boolean} options.force
 */
export async function runChangeUserName(oldNames, newName, options = {}) {
  const currentRepoUserNames = (await $`git log --pretty=format:"%an" | sort | uniq`).stdout.split('\n').filter(Boolean)
  oldNames = oldNames.filter((name) => currentRepoUserNames.includes(name))
  for (let i = 0; i < oldNames.length; i++) {
    const oldName = oldNames[i]
    await $`git-filter-repo \
      ${options.force ? '--force' : ''} \
      --name-callback 'return name.replace(b"${oldName}", b"${newName}")' \
      `
  }
}
