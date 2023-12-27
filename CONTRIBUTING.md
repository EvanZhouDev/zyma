# Contributing

Hello! :wave: Thanks for taking the time to contribute.

There are many ways you can contribute :smile:

- [Pull Request](#pull-request-contributing-guide)
  - 🩹 Submit an obvious fix (e.g. typo)
  - :memo: Work on a bug
- [Submit an Issue](#creating-an-issue)
  - :sparkles: Request a feature
  - :bug: Report a bug

Remember to follow the [code of conduct](./CODE_OF_CONDUCT.md)

We use [Bun](https://bun.sh) as our package manager and JavaScript runtime. Additionally, we use [Supabase](https://supabase.com) as our database backend. Make sure you have [installed](https://supabase.com/docs/guides/cli/getting-started#installing-the-supabase-cli) the Supabase CLI.

```bash
$ bun --version
1.0.15
$ supabase --version
1.123.4
```

When you've cloned the repo (or your fork of this repo) and checked out to your branch (following the [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow#create-a-branch)), be sure to run `bun install`, `supabase start`, and `supabase db reset`.

## Pull Request contributing guide

Doing the following will *increase your chances* of your pull request to be accepted :+1:

- Describe other considered solutions
- Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) or [Gitmoji](https://gitmoji.dev) commit style
- For all code-related changes follow the [code style](#code-style).
- Link to the related issue. If there is none, please [make one](#creating-an-issue) *or* maybe [the issue is obvious](#fixing-an-obvious-issue).

## Fixing an obvious issue

If an issue's solution seems obvious or clear (like fixing a typo or link), you may directly create a PR. Remember to fill in the required forms.

### Major PR

If you're making somewhat bigger code changes please [write tests](#testing) if they don't exist already :test_tube:.

If you're fixing a bug :bug:, please remember link to the applicable issue describing the bug like this (if it exists):

```md
 - #issue-number
```

For example:

```md
 - #42
```

If you're changing/adding documentation, the above isn't required.

### Testing

First, make sure you have Playwright set up properly (this is a one-time thing):

```bash
$ bunx playwright install --with-deps
```

Before you run your tests, spin up the development server:

```bash
$ bun run dev
```

Then run the tests:

```bash
$ bun run test
```

If you have made any visual changes, remember to update the snapshots:

```bash
$ bun run test --update-snapshots
```

To update snapshots for other OSes, get the updated snapshots from the CI.

See [here](./tests/example.spec.ts) for an example test. We use [Playwright](https://playwright.dev) for end-to-end testing.

### Code style

We use [Biome](https://biomejs.dev) to lint and format our codebase. You can format the codebase by running `bun run format`, and lint using `bun run lint`.

## Creating an issue

Please remember to fill out all the forms when making an issue :+1:. This includes but is not limited to

- Describe the issue
- Reproduction steps
- System information (e.g. Bun version, OS version)

Or if it's a feature request :sparkles: (also not limited to)

- Describe the feature
- Why the feature cannot exist without changes to code
- What the new feature might be useful for
