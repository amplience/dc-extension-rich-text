# Hosting the Rich Text Extension

As mentioned in the readme, the lastest released version of the Rich Text Extension is hosted at [](https://amplience.github.io/dc-extension-rich-text/index.html), hosted using GitHub Pages from the `gh-pages` branch. While our hosted version is useful for testing the extension, we don't recommend using this URL for using the extension in the long term for the following reasons:

- The extension can be updated to a newer version without warning. This could suddenly change the user experience or break your configuration.
- Only the latest release is available; unmerged PRs and custom modifications will require hosting elsewhere.

If you're alright with the extension being hosted on GitHub Pages, but you want full control over your target version and features, you can easily fork this repository and host your own version of the Rich Text Extension with a few simple commands.

## Forking the repository

On GitHub, you can fork the repository by clicking the "Fork" button at the top right. This will create a copy of the repository that you have write access to, hosted under your GitHub account.

You will then need to clone the repository onto your computer using Git. You can get a clone url from the "Code" dropdown on your fork, or you can open with GitHub Desktop. Make sure you have Node installed too, as it is used to build the extension.

## Building the repository

To build the extension, you will need both `lerna` and `yarn`. Install both with `npm install -g lerna`, `npm install -g yarn`.

You'll need to initialize the project first. `lerna run bootstrap` should set up dependancies for all projects. From then on, you can run `lerna run build` to build all of the projects. If you want to test the extension in storybook, change directory to `packages/extension/` and then run storybook with `yarn run storybook`.

## Publishing GitHub Pages on your fork

After you've built your version of the rich text extension, you can publish it with the following command:

`yarn run publish`

Note: if you're on a remote, you'll want to publish with this command:

`yarn run publish -o remote-name`

This will create or update the `gh-pages` branch on your repository for you. You may be asked for GitHub authentication, depending on how you configured Git in the first place.

### Setting up GitHub Pages for the first time
After you've published the `gh-pages` branch, you'll want to enable GitHub Pages hosting on your repository. Head over to the "Settings" tab on your fork, then near the bottom of "Options" you'll see a "GitHub Pages" section. Make sure that you set the branch to `gh-pages`, and save to publish the site. 

It may take some time for the site to actually publish, but when it does you should be shown a URL for your version of the rich text extension.

It will typically result in a URL like this: `https://<username>.github.io/dc-extension-rich-text/index.html`

You can use this URL directly as an extension from DC. You will only have to do this once - all future publishes should update the version at this URL automatically!

## Keeping your fork updated with remotes

When you fork a GitHub project, you actually create a copy of the repository at the time it is forked. You won't get any updates to the base repository automatically, you need to pull them in yourself.

Remotes allow you to use multiple remote git repositories and move commits between them. If you want to use new commits in our base repository, you'll want to add it as a remote as follows:

`git remote add <remote-name> https://github.com/amplience/dc-extension-rich-text.git`

Branches will then be accessible via Git. For example, you can get the master branch of a remote using the following: `<remote-name>/master`. This will let you view and use commits from our base repository to update your own.

A good example remote name is `upstream`.

### Resetting a branch to match ours

If you're using your fork as a version snapshot of our repository and want to update, then you can easily reset your master branch to match the one in our repo. Checkout _your_ master branch with `git checkout master`, then reset it to the state of ours with `git reset --hard <remote-name>/master`.

### Rebasing changes on top of the latest master

If you've made your own changes to the editor, but want to pull in changes that we've made on the master branch or recently released, then you can also rebase your modified branch on top of our master branch. Simply make sure that your remote is configured, and run the following command:

`git rebase <remote-name>/master`

You may run into merge conflicts along the way if you've changed the same files as the source. If this happens, look at the files listed, resolve the conflicts, and continue with `git rebase --continue` until all of your commits have been applied.
