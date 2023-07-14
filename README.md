# Change Git History

> A tool to change git history

## Why

When I changed the user information, I found that the information in the git commit history was still the original information, so I thought of the method of modifying the git commit history, so I had this tool.

## Need

- [git-filter-repo](https://github.com/newren/git-filter-repo.git)

## Usage

### Clone

```bash
git clone git@github.com:byronogis/change-git-history.git
```

### Install Dependencies

```bash
cd change-git-history
pnpm i
```

### Adjust Config

update `config.js` to your needs

### Run

```bash
pnpm start
```

## Config

> `congif.js`

### ACCESS_TOKEN

> Recommended, resolve the problem of limit  
> [Generate new token](https://github.com/settings/personal-access-tokens/new)

- Repository access --> All repositories
- Permissions / Repository permissions / Metadata --> Access: Read-only

### USERNAME

When you set options.request to true(default), you need to set this

### NEW_NAME & NEW_EMAIL

You can set them to change the user information.
If you don't want to change the user name or email, you can leave it blank.

### OLD_NAMES & OLD_EMAILS

This is used to match the old user information, and the corresponding index is the same.

### REPOS_DIR

The directory where the repositories are located, the default is `{USERNAME}_repos`.
You can also set it to an relative path of `change-git-history.js` file.

## Options

> you can also use command line options  
> `--option` means true, `--no-option` means false

| option | description | default |
| --- | --- | --- |
| request | whether to request repositories info | true |
| clone | whether to git clone repositories | true |
| fork | whether to include forked repositories | false |
| force | whether to force change | false |
| push | whether to git push | false |

### force

When you see the following error: 

```
Aborting: Refusing to destructively overwrite repo history since
this does not look like a fresh clone.
  (expected freshly packed repo)
Please operate on a fresh clone instead.  If you want to proceed
anyway, use --force.
```

you can use `--force` to force change.
**But please note that this will clear your target repository git working directory, please back up in advance.**

```bash
pnpm start --force
```

## Example

```bash
# contain forked repositories and force change, and git push
pnpm start --fork --force --push

# no clone repositories, maybe you have cloned before
pnpm start --no-clone
```

## Change Fields

at present:
- user.name
- user.email
