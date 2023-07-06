import { $, cd, chalk, fetch } from 'zx'

/**
 * runReposClone
 * @param {object} reposMap 
 * @param {string} reposDirPath 
 * @returns 
 */
export async function runReposClone(reposMap, reposDirPath) {
  try {
    await $`rm -rf ${reposDirPath}`
    await $`mkdir ${reposDirPath}`
    cd(`${reposDirPath}`)
    return await Promise.all(Object.keys(reposMap).map((key) => $`git clone ${reposMap[key].ssh_url} ${key}`))
  } catch (err) {
    console.log(chalk.red('Error runReposClone ==> '), err)
  }
}
