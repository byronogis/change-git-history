import { $, cd, chalk, fetch } from 'zx'

/**
 * runGithubReposRequest
 * @desc List repositories for a user https://docs.github.com/zh/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user
 * @desc List repositories for the authenticated user https://docs.github.com/zh/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-the-authenticated-user
 * @param {string} username 
 * @param {string} token 
 * @returns 
 */
export async function runGithubReposRequest(username, token, { per_page = 100, page = 1 } = {}) {
  try {
    const url = token 
      ? `https://api.github.com/user/repos?per_page=${per_page}&page=${page}`
      : `https://api.github.com/users/${username}/repos?per_page=${per_page}&page=${page}`
    const data = await fetch(url, {
      method: 'GET',
      headers: { Authorization: token ? `Bearer ${token}` : null }
    })

    if (data.status !== 200) throw new Error(data.status)

    const repos = await data.json()

    if (repos.length === per_page) {
      const nextRepos = await runGithubReposRequest(username, token, { per_page, page: page + 1 })
      repos.push(...nextRepos)
    }

    return repos
  } catch (err) {
    console.log(chalk.red('Error runRequestRepos ==> '), err)
    return []
  }
}
