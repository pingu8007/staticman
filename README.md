<img src="logo.png" width="300">

# Staticman [![coverage](https://img.shields.io/badge/coverage-73%25-yellow.svg?style=flat)](https://github.com/pingu8007/staticman) [![Build Status](https://travis-ci.org/pingu8007/staticman.svg?branch=master)](https://travis-ci.org/pingu8007/staticman) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Static sites with superpowers

## Introduction

Staticman is a Node.js application that receives user-generated content and uploads it as data files to a GitHub and/or GitLab repository. In practice, this allows you to have dynamic content (e.g. blog post comments) as part of a fully static website, as long as your site automatically deploys on every push to GitHub and/or GitLab, as seen on [GitHub Pages](https://pages.github.com/), [GitLab Pages](https://about.gitlab.com/product/pages/), [Netlify](http://netlify.com/) and others.

It consists of a small web service that handles the `POST` requests from your forms, runs various forms of validation and manipulation defined by you and finally pushes them to your repository as data files. You can choose to enable moderation, which means files will be pushed to a separate branch and a pull request will be created for your approval, or disable it completely, meaning that files will be pushed to the main branch automatically.

You can download and run the Staticman API on your own infrastructure, build to Docker image, deploy on Heroku or Google Cloud Functions.

## About this fork

This is a fork of [eduardoboucas/staticman](https://github.com/eduardoboucas/staticman) aiming to meet the requirement to deploy on Google Cloud Functions. Runtimes likes Heroku or Docker may still be supported, but they won't get much caring.

## Requirements

- Node.js 10+
- npm
- A [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) for the GitHub and/or GitLab account you want to run Staticman with, or a GitHub App ID and private key to run as GitHub App.
- An RSA key in PEM format

## Setting up the server

### Bare metal

- Clone the repository and install the dependencies via npm.

  ```shell
  git clone git@github.com:pingu8007/staticman.git
  cd staticman
  npm install
  ```

- Create a development config file from the sample file.

  ```shell
  cp config.sample.json config.development.json
  ```

- Edit the newly-created config file with your GitHub and/or GitLab credential, RSA private key and the port to run the server. Click [here](https://staticman.net/docs/api) for the list of available configuration parameters.

- Start the server.

  ```shell
  npm start
  ```

Each environment, determined by the `NODE_ENV` environment variable, requires its own configuration file. When you're ready to push your Staticman API live, create a `config.production.json` file before deploying.

### Docker

Check [this guide](docs/docker.md) if you're using Docker.

### Heroku

To deploy on heroku, click the following button than fill in the App name and region you want.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

In order to configure credentials for GitHub and/or GitLab as well as RSA private key, go to `Config Vars` section under App's setting page and fill-in those variables. Reference to [`config.js`](config.js) for variable name.

### Google Cloud Function

- Create project and enable billing on Google Cloud. You should get your trial credits if you are first time.

- Enable [Cloud Functions API](https://console.cloud.google.com/apis/api/cloudfunctions.googleapis.com/overview) for your project.

- Follow the [Bare metal](#bare-metal) section to clone project and create production config file (`config.production.json`). You don't need to install (`npm install`) or start (`npm start`) it, Google will install for you.

- Deploy to your Google Cloud project.

  ```shell
  gcloud functions deploy <FUNCTION_NAME> \
  --allow-unauthenticated \
  --runtime=nodejs10 \
  --trigger-http \
  --source=./
  ```

  You need to auth yourself if you are first time to the `gcloud` command. You may need to specify your project, region, memory or other arguments for better cost/performance balance. Check the [document](https://cloud.google.com/sdk/gcloud/reference/functions/deploy) for details.

## Setting up a repository

Staticman runs as a bot using a GitHub and/or GitLab account, as opposed to accessing your account using the traditional OAuth flow. This means that you can give it access to just the repositories you're planning on using it on, instead of exposing all your repositories.

To add Staticman to a repository, you need to add the bot as a collaborator with write access to the repository and ask the bot to accept the invite by firing a `GET` request to this URL:

```text
http://your-staticman-url/v2/connect/GITHUB-USERNAME/GITHUB-REPOSITORY
```

## Site configuration

Staticman will look for a config file. For the deprecated `v1` endpoints, this is a  `_config.yml` with a `staticman` property inside; for `v2` endpoints, Staticman looks for a `staticman.yml` file at the root of the repository.

For a list of available configuration parameters, please refer to the [documentation page](https://staticman.net/docs/configuration).

## Development

Would you like to contribute to Staticman? That's great! Here's how:

1. Read the [contributing guidelines](CONTRIBUTING.md)
1. Pull the repository and start hacking
1. Make sure tests are passing by running `npm test`
1. Send a pull request and celebrate

## Useful links

- [Detailed Site and API Setup Guide](https://travisdowns.github.io/blog/2020/02/05/now-with-comments.html)
- [Improving Static Comments with Jekyll & Staticman](https://mademistakes.com/articles/improving-jekyll-static-comments/)
- [Hugo + Staticman: Nested Replies and E-mail Notifications](https://networkhobo.com/2017/12/30/hugo-staticman-nested-replies-and-e-mail-notifications/)
- [Guide on How to Setup Staticman with Gatsby](https://github.com/jovil/gatsby-staticman-example)
