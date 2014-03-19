var fs = require("fs");
var und = require("underscore");
var dsa14 = require("./utils.js");

var ghapi = require("github");
var gh = new ghapi({ version: "3.0.0" });

gh.authenticate({
  type: "oauth",
  token: fs.readFileSync("../my-oauth-token", { encoding: "utf-8" })
});

var teams = JSON.parse(fs.readFileSync("../jsons/team_data.json", { encoding: "utf-8" }));

var query_err = new Array()

var pos = 0;
dsa14.forM(teams, function(team, k) {
  pos = pos + 1;
  gh.orgs.getTeamRepos({ "id": team.team_data.id }, function(err, repos) {
    if (err !== null) {
      console.log("querying team " + team.team_data.name + "/" + team.student.stu_id + ": ERROR");
      query_err.push({ "student": team.student, "error": err });
      k(false);
    } else {
      console.log(pos + "/" + teams.length + "; querying team " + team.team_data.name + ": " + repos.length + " repo(s)");
      k({ "student": team.student, "team_data": team.team_data, "repos": repos});
    }
  });
}, function(team_repos) {

fs.writeFileSync("query_repo_error.json", JSON.stringify(query_err, null, 2));
fs.writeFileSync("query_repo.json", JSON.stringify(team_repos, null, 1));
console.log("Query finished. Removing repos...");
});
