#! /usr/bin/env node

import { $, cd, chalk, fetch } from 'zx'
import { 
  ACCESS_TOKEN,
  USERNAME,
  NEW_NAME, NEW_EMAIL,
  OLD_NAMES, OLD_EMAILS,
  ARG_CONTAIN_FORK, ARG_FORCE_CHANGE,
  ARG_NO_CLONE, ARG_NO_FETCH,
  ARG_PUSH, ARG_ORiGIN_NAME,
} from './config.js'

const cwd = process.cwd()

let reposInfo = ARG_NO_FETCH ? [] : await runRequestRepos()
reposInfo = ARG_CONTAIN_FORK ? reposInfo : reposInfo.filter((repo) => !repo.fork)

const reposDir = `${USERNAME}_repos`
!ARG_NO_CLONE && await $`rm -rf ${reposDir}`
!ARG_NO_CLONE && await $`mkdir ${reposDir}`
cd(`${cwd}/${reposDir}`)

const reposUrls = reposInfo.map((repo) => repo.ssh_url)
!ARG_NO_CLONE && (await runCloneRepos(reposUrls))

const reposName = (await $`ls`).stdout.split('\n').filter(Boolean)
for (const name of reposName) {
  try {
    cd(`${cwd}/${reposDir}/${name}`)
    const oldNameAndEmails = (await $`git log --pretty=format:"%an >> %ae" | sort | uniq`).stdout.split('\n').map(i =>i.split(' >> ')).filter(i => i.some(Boolean))
    const oldNames = oldNameAndEmails.map(i => i[0])
    const oldEmails = oldNameAndEmails.map(i => i[1])

    await runChangeUserName(OLD_NAMES.filter(name => oldNames.includes(name)), NEW_NAME)
    await runChangeUserEmail(OLD_EMAILS.filter(email => oldEmails.includes(email)), NEW_EMAIL)
    
    
    ARG_PUSH && (await runAddOrigin(ARG_ORiGIN_NAME, name)) && (await runPush(ARG_ORiGIN_NAME))
    ARG_PUSH && (await $`rm -rf ${cwd}/${reposDir}/${name}`)
  } catch (err) {
    console.log(chalk.red('Error change-git-history ==> '), err)
  }
}


/**
 * request repos
 * @return {Promise<array>}
 */
async function runRequestRepos() {
  try {
    const data = await fetch(`https://api.github.com/users/${USERNAME}/repos`,{
      headers: { Authorization: ACCESS_TOKEN }
    })
    return data.json()
  } catch (err) {
    console.log(chalk.red('Error runRequestRepos ==> '), err)
    return []
  }
}

/**
 * clone repos
 */
async function runCloneRepos(urls) {
  try {
    return await Promise.all(urls.map((url) => $`git clone ${url}`))
  } catch (err) {
    console.log(chalk.red('Error runCloneRepos ==> '), err)
  }
}

/**
 * change git history user name
 */
async function runChangeUserName(oldNames, newName) {
  for (let i = 0; i < oldNames.length; i++) {
    const oldName = oldNames[i]
    await $`git-filter-repo \
      ${ARG_FORCE_CHANGE ? '--force' : ''} \
      --name-callback 'return name.replace(b"${oldName}", b"${newName}")' \
      `
  }
}

/**
 * change git history user email
 */
async function runChangeUserEmail(oldEmails, newEmail) {
  for (let i = 0; i < oldEmails.length; i++) {
    const oldEmail = oldEmails[i]
    await $`git-filter-repo \
      ${ARG_FORCE_CHANGE ? '--force' : ''} \
      --email-callback 'return email.replace(b"${oldEmail}", b"${newEmail}")' \
      `
  }
}

/**
 * push to remote
 */
async function runPush(originName) {
  await $`git push ${originName} --force`
  return true
}

/**
 * git remote add origin
 */
async function runAddOrigin(originName, repoName) {
  const isExist = (await $`git remote`).stdout.split('\n').filter(Boolean).includes(originName)
  originName = `${originName}${isExist ? Date.now() : ''}`
  await $`git remote add ${originName} ${reposInfo.find(repo => repo.name === repoName).ssh_url}`
  return true
}
