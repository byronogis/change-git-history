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

/**
 * options
 * containFork: whether to include forked repositories
 * forceChange: whether to force change
 * noClone: whether to git clone repositories
 * noFetch: whether to git fetch repositories info
 * push: whether to git push
 * originName: the name of the remote repository
 */
const options = {
 containFork: false,
 forceChange:  true,
 noClone: false,
 noFetch: false,
 push: true,
 originName:  'origin',
}

/**
 * request repos info
 */
let reposInfo = options.noFetch ? [] : (await runRequestRepos(USERNAME, ACCESS_TOKEN))
!options.containFork && (reposInfo = reposInfo.filter((repo) => !repo.fork))
const reposNameMap = reposInfo.reduce((acc, cur) => (acc[cur.name] = cur, acc), {})

/**
 * clone repos
 */
!options.noClone && (await runReposClone(reposNameMap, resolve(cwd, REPOS_DIR)))

/**
 * get repos name
 */
const reposName = options.noFetch 
  ? (await $`ls ${resolve(cwd, REPOS_DIR)}`).stdout.split('\n').filter(Boolean) 
  : Object.keys(reposNameMap)

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
for (const name of Object.keys(reposNameMap)) {
  try {
    cd(`${resolve(cwd, REPOS_DIR, name)}`)
    const originName = await runReposRemote(options.originName, reposNameMap[name].ssh_url)
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

    await runChangeUserName(OLD_NAMES, NEW_NAME, { force: options.forceChange })
    await runChangeUserEmail(OLD_EMAILS, NEW_EMAIL, { force: options.forceChange })

    options.push && (await runReposPush(reposNameMap[name]._originName))
    options.push && (await $`rm -rf ${resolve(cwd, REPOS_DIR, name)}`)
  } catch (err) {
    console.log(chalk.red('Error change-git-history ==> '), err)
  }
}
