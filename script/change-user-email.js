import { $, cd, chalk, fetch } from 'zx'

/**
 * runChangeUserEmail
 * @param {string[]} oldEmails 
 * @param {string} newEmail 
 * @param {object} options
 * @param {boolean} options.force
 */
export async function runChangeUserEmail(oldEmails, newEmail, options = {}) {
  const currentRepoUserEmails = (await $`git log --pretty=format:"%ae" | sort | uniq`).stdout.split('\n').filter(Boolean)
  oldEmails = oldEmails.filter((email) => currentRepoUserEmails.includes(email))
  for (let i = 0; i < oldEmails.length; i++) {
    const oldEmail = oldEmails[i]
    await $`git-filter-repo \
      ${options.force ? '--force' : ''} \
      --email-callback 'return email.replace(b"${oldEmail}", b"${newEmail}")' \
      `
  }
}
