import { $, cd, chalk, fetch } from 'zx'

/**
 * runReposPush
 * @param {string} origin
 */
export async function runReposPush(origin = '') {
  await $`git config --local push.autoSetupRemote true`
  await $`git push ${origin} --force`
}
