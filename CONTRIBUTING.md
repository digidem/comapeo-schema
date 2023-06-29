## Publishing to [npm](https://www.npmjs.com)

Please publish to npm via Github using the release workflow, rather than publishing from your local machine. This ensures that the artifacts are built and release notes are generated.

### 1. Prepare a release

- Navigate to the [release action workflow](https://github.com/digidem/mapeo-schema/actions/workflows/release.yml) and click the "Run workflow" dropdown.
- Select the semver release, e.g. "patch" for bug fixes, "minor" for new features, and "major" for breaking changes. For pre-release see below
- Click "Run workflow" button.

This will open a new Pull Request with a draft release

### 2. Review and publish the release

- Look for the new PR created by step 1 (above)
- Review the changes — check the version number is correct and the npm tag is correct — and merge the PR
- Release will be automatically published to npm when you merge the PR
- If something is incorrect just close the PR and the release will be cancelled

### Prereleases

Prereleases are useful for testing new versions of this package without affecting existing dependent packages. Ideally work on a pre-release should be on a separate branch, e.g. create a `next` branch from `master`.

To prepare the release, select "Run workflow" on the [release action workflow](https://github.com/digidem/mapeo-schema/actions/workflows/release.yml) as above, but select the branch `next` (or whatever branch you are using for prerelease development) for "Use workflow from", and for the "`semver` to use" option, select:

- `prepatch` to create a new patch prerelease, e.g. if the current version is `v3.0.0`, then this will generate a new release `v3.0.1-next.0`.
- `preminor` to create a new minor prerelease, e.g. if the current version is `v3.0.0` then this will generate a new release `v3.1.0-next.0`.
- `premajor` to create a new major prerelease, e.g. if the current version is `v3.0.0` then this will generate a new release `v4.0.0-next.0`.
- `prelease` to bump the prerelease version if the current version on the branch that you target is already a prerelease and you want to create a new prerelease, e.g. if the current version on the target branch is `v3.0.1-next.0` then this will generate a new release `v3.0.1-next.1`.

The pre-releases will be published to npm with the `next` [dist-tag](https://docs.npmjs.com/adding-dist-tags-to-packages). Publishing a pre-release will not change the `latest` tag, so that normal installs of `npm install @mapeo/schema` will not get the pre-release. To install the pre-release for testing, use `npm install @mapeo/schema@latest`.

To publish a `latest` release from a pre-release, first merge the pre-release branch to master, then follow the usual "Prepare a release" steps from above, but select `auto` for the "`semver` to use" option. If you have a prerelease version `v3.0.1-next.3` then this will publish a release called `v3.0.1`.
