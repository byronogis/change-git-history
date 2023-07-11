#! /usr/bin/env node

import { $, cd, chalk, fetch } from 'zx'
import { resolve } from 'node:path'
import { runGithubReposRequest as runRequestRepos } from './script/repos-request.js'
import { runReposClone } from './script/repos-clone.js'
import { runReposRemote } from './script/repos-remote.js'
import { runReposPush } from './script/repos-push.js'
import { runChangeUserName } from './script/change-user-name.js'
import { runChangeUserEmail } from './script/change-user-email.js'
import { 
  ACCESS_TOKEN,
  USERNAME,
  NEW_NAME, NEW_EMAIL,
  OLD_NAMES, OLD_EMAILS,
  REPOS_DIR,
} from './config.js'

const cwd = process.cwd()
const argv = process.argv.slice(2)

/**
 * options
 * request: whether to request repositories info
 * clone: whether to git clone repositories
 * fork: whether to include forked repositories
 * force: whether to force change
 * push: whether to git push
 * origin: the name of the remote repository
 */
const options = {
  request: true,
  clone: true,
  fork: false,
  force:  false,
  push: false,
  origin: 'origin',
}
Object.keys(options).forEach((key) => {
  if (argv.includes(`--${key}`)) {
    options[key] = true
  } else if (argv.includes(`--no-${key}`)) {
    options[key] = false
  }
})

// no request, no clone
options.request || (options.clone = false)

/**
 * request repos info
 */
let reposInfo = options.request ? (await runRequestRepos(USERNAME, ACCESS_TOKEN)) : []
!options.fork && (reposInfo = reposInfo.filter((repo) => !repo.fork))
const reposNameMap = reposInfo.reduce((acc, cur) => (acc[cur.name] = cur, acc), {})

/**
 * clone repos
 */
options.clone && (await runReposClone(reposNameMap, resolve(cwd, REPOS_DIR)))

/**
 * get repos name
 */
const reposName = (options.fetch && options.clone)
  ? Object.keys(reposNameMap)
  : (await $`ls ${resolve(cwd, REPOS_DIR)}`).stdout.split('\n').filter(Boolean) 

/**
 * console old name and email
 */
// const oldNameAndEmails = []
// for (const name of reposName) {
//   try {
//     cd(`${resolve(cwd, REPOS_DIR, name)}`)
//     oldNameAndEmails.push(...(await $`git log --pretty=format:"%an >> %ae" | sort | uniq`).stdout.split('\n').map(i =>i.split(' >> ')).filter(i => i.some(Boolean)))
//   } catch (err) {
//     console.log(chalk.red('Error console old name and email ==> '), err)
//   }
  
// }
// console.log(chalk.green('oldNameAndEmails ==> '), oldNameAndEmails)
// process.exit(1)

/**
 * add remote
 */
for (const name of reposName) {
  if (!reposNameMap[name]) break

  try {
    cd(`${resolve(cwd, REPOS_DIR, name)}`)
    const originName = await runReposRemote(options.origin, reposNameMap[name].ssh_url)
    reposNameMap[name]._originName = originName
  } catch (err) {
    console.log(chalk.red('Error add-remote ==> '), err)
  }
}

/**
 * change git history
 */
for (const name of reposName) {
  try {
    cd(`${resolve(cwd, REPOS_DIR, name)}`)

    NEW_NAME && await runChangeUserName(OLD_NAMES, NEW_NAME, { force: options.force })
    NEW_EMAIL && await runChangeUserEmail(OLD_EMAILS, NEW_EMAIL, { force: options.force })

    options.push && (await runReposPush(reposNameMap[name]?._originName ?? ''))
    options.push && (await $`rm -rf ${resolve(cwd, REPOS_DIR, name)}`)
  } catch (err) {
    console.log(chalk.red('Error change-git-history ==> '), err)
  }
}
