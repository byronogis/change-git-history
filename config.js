/**
 * Generate new token
 * https://github.com/settings/personal-access-tokens/new
 */
export const ACCESS_TOKEN = ``

/**
 * Your github username
 */
export const USERNAME = ''


/**
 * Your git user name & email
 * If you don't want to change the user name or email, you can leave it blank
 */
export const NEW_NAME = ''
export const NEW_EMAIL = ''

/**
 * The date (hour) you want to change to
 */
export const NEW_DATE_HOUR = null // eg: 23

/**
 * Old usernames & emails
 * write any number of usernames and emails for replacement
 * you can log old usernames and emails by git log `git log --pretty=format:"%an %ae" | sort | uniq` first
 */
export const OLD_NAMES = [
  '',
]
export const OLD_EMAILS = [
  '',
]

/**
 * The directory where the repositories are stored
 * The default is `${USERNAME}_repos`
 * Also can be set to an relative path, such as `foo/repos`, `./foo/repos`
 */
export const REPOS_DIR = `${USERNAME}_repos`

/**
 * Filter out repositories that do not match the regular
 * The default is null, which means no filtering
 * eg: /^foo/  =>  match foo*
 * eg: /foo$/  =>  match *foo
 */
export const REPOS_NAME_REG = null
