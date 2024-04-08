import { $, cd, chalk, fetch } from 'zx'
import dayjs from 'dayjs'

function getNewGitDate(rawGitDateStr, newHour) {
  const tz = rawGitDateStr.split(' ').pop()
  const newDateStr = dayjs(rawGitDateStr)
    .hour(newHour)
    .unix()

  return `${newDateStr} ${tz}`
}

/**
 * runChangeCommitDate
 * @param {string[]} newHour 
 * @param {object} options 
 * @param {boolean} options.force
 */
export async function runChangeCommitDate(newHour, options = {}) {
  const currentRepoInfo = (await $`git log --pretty=format:"%H - %ad - %cd"`).stdout.split('\n').filter(Boolean)
  
  const hashMap = currentRepoInfo.reduce((acc, cur) => {
    const hash = cur.split(' - ')[0]
    
    const raw_author_date = cur.split(' - ')[1]
    const raw_committer_date = cur.split(' - ')[2]

    acc[hash] = {
      author_date: getNewGitDate(raw_author_date, newHour),
      committer_date: getNewGitDate(raw_committer_date, newHour)
    }

    return acc
  }, {})

  // console.log(hashMap)
  
  for (const hash in hashMap) {
    const { author_date, committer_date } = hashMap[hash]

    const arg = []

    options.force && arg.push('--force')

    arg.push(`--commit-callback`)
    arg.push(`if commit.original_id == b"${hash}": commit.author_date = b"${author_date}"; commit.committer_date = b"${committer_date}";`)
    
    await $`git-filter-repo ${arg}`
  }
}
