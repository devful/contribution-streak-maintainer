<a href="https://www.npmjs.com/package/contribution-streak-maintainer">
  <img src=".github/csm-logo-560-transparent.png" alt="Contribution Streak Maintainer Logo" width="150" align="right" />
</a>

https://codecov.io/github/devful/contribution-streak-maintainer/settings/badge

# 📅 Contribution Streak Maintainer

[![npm](https://img.shields.io/npm/v/contribution-streak-maintainer)](https://www.npmjs.com/package/contribution-streak-maintainer)
[![npm](https://img.shields.io/npm/dm/contribution-streak-maintainer)](https://www.npmjs.com/package/contribution-streak-maintainer)
[![GitHub License](https://img.shields.io/github/license/devful/contribution-streak-maintainer)](https://github.com/devful/contribution-streak-maintainer/blob/main/LICENSE)
[![GitHub Repo stars](https://img.shields.io/github/stars/devful/contribution-streak-maintainer)](https://github.com/devful/contribution-streak-maintainer/stargazers)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/devful/contribution-streak-maintainer/test.yml)](https://github.com/devful/contribution-streak-maintainer/actions)
[![GitHub issues](https://img.shields.io/github/issues/devful/contribution-streak-maintainer)](https://github.com/devful/contribution-streak-maintainer/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/devful/contribution-streak-maintainer)](https://github.com/devful/contribution-streak-maintainer/pulls)
[![GitHub contributors](https://img.shields.io/github/contributors/devful/contribution-streak-maintainer)](https://github.com/devful/contribution-streak-maintainer/graphs/contributors)
[![GitHub last commit](https://img.shields.io/github/last-commit/devful/contribution-streak-maintainer)](https://github.com/devful/contribution-streak-maintainer/commits/main)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/devful/contribution-streak-maintainer)](https://github.com/devful/contribution-streak-maintainer)

<!-- ![Codecov](https://img.shields.io/codecov/c/github/devful/contribution-streak-maintainer) -->

- _Have you ever wanted to keep your contribution streak going but never been able to?_
- _Do you find it challenging to make manual contributions every single day?_
- _Worry no more!_

**Contribution Streak Maintainer** is a tool, available as an [npm package](https://www.npmjs.com/package/contribution-streak-maintainer), designed to be used inside a GitHub Actions workflow. This npm package is utilized within your workflow, automatically maintaining your GitHub contribution streak. The GitHub Actions workflow, configured through YAML files, generates and pushes commits to your repository, ensuring your activity stays active even on days when you're not able to make manual contributions.

Now you can focus on your work, knowing that your GitHub contributions are being taken care of automatically. Keep your streak alive effortlessly by integrating the Contribution Streak Maintainer npm package into your GitHub Actions workflow!

## Installation

Here is how to add my badges to your profile:

1. Star this repository.
2. Create a private repository `your-username/name-of-your-choice`
3. Add the following workflow to your repository at `.github/workflows/contribution-streak-maintainer.yml`

```yaml
name: contribution-streak-maintainer

on:
  workflow_dispatch:
  schedule:
    # For more information on the cron scheduler,
    # see https://crontab.guru/ or https://crontab.cronhub.io/.
    # This cron schedule means the action runs every day at midnight UTC.
    - cron: "0 0 * * *"

permissions:
  contents: write

jobs:
  contribution-streak-maintainer:
    runs-on: ubuntu-latest
    steps:
      - name: Make a contribution
        run: npx contribution-streak-maintainer ${{github.repository}} --email=primary-github-email@email.com
        env:
          DEVFUL_GITHUB_TOKEN: ${{ secrets.YOUR_GITHUB_TOKEN }}
```

- Manually start **contribution-streak-maintainer** workflow, or wait for it to run automatically.

Alternatively, you can perform these steps manually:

- Go to your newly created local repo.
- Run `npx contribution-streak-maintainer <username>/<repository_name> --email=<email> --token=<token> --condition=<condition>`
  - Example: `npx contribution-streak-maintainer my-username --email=my-primary-github-email@email.com --token=gph_nJkKQKJKFb7YxqkLtFf3wvXyU6X --condition=6`
- Verify changes in `AUTOMATED_CONTRIBUTIONS.md`.

## Configuration

| Param        | ENV alias             | Type   | Description                                                       | Default | Required |
| ------------ | --------------------- | ------ | ----------------------------------------------------------------- | ------- | -------- |
| `repository` | `DEVFUL_GITHUB_REPO`  | String | The owner and repository name. For example, `octocat/Hello-World` |         | Yes      |
| `email`      |                       | String | Primary email address associated with your GitHub account         |         | Yes      |
| `token`      | `DEVFUL_GITHUB_TOKEN` | String | Github Auth token                                                 |         | Yes      |
| `condition`  |                       | String | Condition for contribution to be made                             | 0       | No       |

By default, this action runs daily, checks if the user has made any contribution, and generates a random number of commits between 1-3. If the user sets the condition to, for example, 5, the action will only make commits if the user has made 0-5 commits that day.

## License

[MIT](LICENSE)
