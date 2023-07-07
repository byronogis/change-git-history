# Change Git History

> A tool to change git history

## Why

When I changed the user information, I found that the information in the git commit history was still the original information, so I thought of the method of modifying the git commit history, so I had this tool.

## Need

- [git-filter-repo](https://github.com/newren/git-filter-repo.git)

## Usage

### Install Dependencies

```bash
pnpm i
```

### Adjust Config

update `config.js` to your needs

### Run

```bash
pnpm start
```

## Config

### ACCESS_TOKEN

> Recommended, resolve the problem of limit  
> [Generate new token](https://github.com/settings/personal-access-tokens/new)

- Repository access --> All repositories
- Permissions / Repository permissions / Metadata --> Access: Read-only

## Options

## Change Fields

at present:
- user.name
- user.email
