# Change Git History

> A tool to change git history

## Background

When I changed the user information, I found that the information in the git commit history was still the original information, so I thought of the method of modifying the git commit history, so I had this tool.

## Prerequisites

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
node change-git-history.js
```

## Change Fields

at present:
- user.name
- user.email
