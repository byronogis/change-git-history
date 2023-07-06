import { $, cd, chalk, fetch } from 'zx'

/**
 * runReposRemote
 * @param {string} originName 
 * @param {string} originUrl 
 * @returns 
 */
export async function runReposRemote(originName, originUrl) {
  const isExist = (await $`git remote`).stdout.split('\n').filter(Boolean).includes(originName)
  originName = `${originName}_${isExist ? Date.now() : ''}`
  await $`git remote add ${originName} ${originUrl}`
  return originName
}
