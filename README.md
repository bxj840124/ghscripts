ghscripts
=========

Scripts for the TAs

## Script List

- `csv2json.hs`

    * Convert `.csv` files to `.json` format

    * Usage: `runhaskell csv2json.hs < input.csv > output.json`

## GitHub API wrapper for Node
- [node-githb](https://github.com/mikedeboer/node-github)

- documents:

    * [of the module's](http://mikedeboer.github.io/node-github/#orgs)

    * [of GitHub API's](http://developer.github.com/v3/orgs/)

- installation: `npm install github`

- authentication for the scripts:

    * By username+passwd: not recommended

    * Using oauth2 token: You can manage your personal token [here](https://github.com/settings/applications)

        Then in (some) scripts we have

        ```javascript
        gh.authenticate({
          type: "oauth",
          token: fs.readFileSync("../my-oauth-token", { encoding: "utf-8" })
        });
        ```

## Other possible dependencies

- Underscore.js: `npm install underscore`
