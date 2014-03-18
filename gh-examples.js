var fs = require("fs");
var _ = require("underscore");

var ghapi = require("github");
var gh = new ghapi({ version: "3.0.0" });

gh.authenticate({
  type: "oauth",
  token: fs.readFileSync("../my-oauth-token", { encoding: "utf-8" })
});

======== SYNTAX ERROR HERE =======
NOTE: THIS CODE IS NOT FOR RUNNING
==================================

// list all members
gh.orgs.getMembers({ org: "NTUDSA2014"}, function(err, data) {
  console.log(data);
});


// list all teams
gh.orgs.getTeams({ "org": "NTUDSA2014" }, function(err, data) {
  console.log("err: " + err);
  console.log(data);
});


// given a team, list its repositories
console.log("getting repos..");
gh.orgs.getTeamRepos({ "id": 717222 }, // team id, e.g. `test-team2`
  function(err, data) {
    console.log("err: " + err);
    _.each(data, function(repo) {
      console.log({ "id": repo.id
                  , "name": repo.name
                  , "owner": repo.owner
                  , "pushed_at": repo.pushed_at }); // last-pushed-at, GMT time
    });
});


// add a repository to a team
gh.orgs.addTeamRepo({ "id": 717204 // team id, e.g. `test-team`
                    , "user": "suhorng"
                    , "repo": "private-repo2" }
                    , function(err, data) {
  console.log("err: " + err);
  console.log(data);
});


// remove a repository from a team
gh.orgs.deleteTeamRepo({ "id": 717204 // team id, e.g. `test-team`
                       , "user": "suhorng"
                       , "repo": "private-repo2" }
                       , function(err, data) {
  console.log("err: " + err);
  console.log(data);
});


// create a new team
gh.orgs.createTeam({ "org": "NTUDSA2014"
                   , "name": "nodetest2"
                   , "repo_names": ["NTUDSA2014/private-repo2"]
                   , "permission": "pull" }
                   , function(err, data) {
  console.log("err: " + err);
  console.log(data); // data.id: team id;
});


// add someone to a team
gh.orgs.addTeamMember({ "id": 730693 // team id, e.g. `nodetest2`
                      , "user": "suhorng-" }
                      , function(err, data) {
  console.log("err: " + err);
  console.log(data);
});
