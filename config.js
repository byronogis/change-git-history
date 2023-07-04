/**
 * Generate new token
 * https://github.com/settings/personal-access-tokens/new
 */
export const ACCESS_TOKEN = `replace with your token`

/**
 * Your github username
 */
export const USERNAME = 'replace with your username'


/**
 * Your git user name & email
 * If you don't want to change the user name or email, you can leave it blank
 */
export const NEW_NAME = 'replace with your name'
export const NEW_EMAIL = 'replace with your email'

/**
 * Old usernames & emails
 * write any number of usernames and emails for replacement
 * you can log old usernames and emails by git log `git log --pretty=format:"%an %ae" | sort | uniq` first
 */
export const OLD_NAMES = [
  'replace with your old name',
]
export const OLD_EMAILS = [
  'replace with your old email',
]

/**
 * Behavior control (Arguments)
 * CONTAIN_FORK: whether to include forked repositories
 * FORCE_CHANGE: whether to force change
 * NO_CLONE: whether to git clone repositories
 * NO_FETCH: whether to git fetch repositories info
 * PUSH: whether to git push
 * ORiGIN_NAME: the name of the remote repository
 */
export const ARG_CONTAIN_FORK = false
export const ARG_FORCE_CHANGE = false
export const ARG_NO_CLONE = false
export const ARG_NO_FETCH = false
export const ARG_PUSH = false
export const ARG_ORiGIN_NAME = 'origin'
