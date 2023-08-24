Toolbox suite Portal

On merge, the action will:
    - Get latest tag
    - Bump tag with minor version unless the merge commit message contains #major or #patch
    - Pushes tag to github
    - If triggered on your repo's default branch (master or main if unchanged), the bump version will be a release tag.
    - If triggered on any other branch, a prerelease will be generated, depending on the bump, starting with *-<PRERELEASE_SUFFIX>.1, *-<PRERELEASE_SUFFIX>.2