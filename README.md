# Contribution Streak Maintainer

**Contribution Streak Maintainer** is a GitHub Action that automatically maintain your GitHub contribution streak.
This GitHub Actions workflow generates and pushes commits to your repository, ensuring your activity stays active even on days when you're not able to make manual contributions.

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
        run: npx contribution-streak-maintainer ${{github.repository}}
        env:
          DEVFUL_GITHUB_TOKEN: ${{ secrets.YOUR_GITHUB_TOKEN }}
```

- Manually start **contribution-streak-maintainer** workflow, or wait for it to run automatically.

Alternatively, you can perform these steps manually:

- Go to your newly created local repo.
- Run `npx contribution-streak-maintainer <username>/<repository_name> --token=<token> --condition=<condition>`
  - Example: `npx contribution-streak-maintainer eliasafara --token=gph_nJkKQKJKFb7YxqkLtFf3wvXyU6X --condition=6`
- Verify changes in `AUTOMATED_CONTRIBUTIONS.md`.

## Configuration

| Param        | ENV alias             | Type   | Description                                                       | Default |
| ------------ | --------------------- | ------ | ----------------------------------------------------------------- | ------- |
| `repository` | `GITHUB_REPO`         | String | The owner and repository name. For example, `octocat/Hello-World` |         |
| `token`      | `DEVFUL_GITHUB_TOKEN` | String | Github Auth token                                                 |         |
| `condition`  |                       | String | Condition for contribution to be made                             | 0       |

By default, this action runs daily, checks if the user has made any contribution, and generates a random number of commits between 1-3. If the user sets the condition to, for example, 5, the action will only make commits if the user has made 0-5 commits that day.

## License

[MIT](LICENSE)
