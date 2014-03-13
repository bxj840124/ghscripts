/*
https://github.com/ajaxorg/node-github
https://github.com/ajaxorg/node-github/blob/master/api/v3.0.0/authorizationTest.js
https://github.com/ajaxorg/node-github/blob/master/api/v3.0.0/orgsTest.js

??? https://github.com/darvin/github
??? https://www.npmjs.org/package/github-api 
*/

var fs = require("fs");

var _ = require("underscore");

var ghapi = require("github");
var gh = new ghapi({ version: "3.0.0" });

gh.authenticate({
  type: "oauth",
  token: fs.readFileSync("../my-oauth-token", { encoding: "utf-8" })
});

/*
gh.orgs.getMembers({ org: "NTUDSA2014"}, function(err, data) {
  console.log(data);
});
*/

/*
console.log("getting teams..");
gh.orgs.getTeams({ "org": "NTUDSA2014" }, function(err, data) {
  console.log("err: " + err);
  console.log(data);
});
*/

/*
console.log("getting repos..");
gh.orgs.getTeamRepos({ "id": 717222 }, function(err, data) {
  console.log("err: " + err);
  _.each(data, function(datum) {
    console.log({ "id": datum.id
                , "name": datum.name,
                "owner": datum.owner,
                "pushed_at": datum.pushed_at });
  });
});
*/

/*
gh.orgs.addTeamRepo({ "id": 717204 // team id
                    , "user": "suhorng"
                    , "repo": "private-repo2" }
                    , function(err, data) {
  console.log("err: " + err);
  console.log(data);
});
*/

/*
gh.orgs.deleteTeamRepo({ "id": 717204 // team id
                       , "user": "suhorng"
                       , "repo": "private-repo2" }
                       , function(err, data) {
  console.log("err: " + err);
  console.log(data);
});
*/

/*
gh.orgs.createTeam({ "org": "NTUDSA2014"
                   , "name": "nodetest2"
                   , "repo_names": ["NTUDSA2014/private-repo2"]
                   , "permission": "pull" }
                   , function(err, data) {
  console.log("err: " + err);
  console.log(data); // data.id: team id; 730680 for `nodetest2`
});
*/

/*
gh.orgs.addTeamMember({ "id": 730693 // team id, e.g. `nodetest2`
                      , "user": "suhorng-" }
                      , function(err, data) {
  console.log("err: " + err);
  console.log(data);
});
*/
