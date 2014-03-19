var fs = require("fs");
var und = require("underscore");
var dsa14 = require("./utils.js");

var ghapi = require("github");
var gh = new ghapi({ version: "3.0.0" });

gh.authenticate({
  type: "oauth",
  token: fs.readFileSync("../my-oauth-token", { encoding: "utf-8" })
});

var teams = JSON.parse(fs.readFileSync("../jsons/team_data.json", { encoding: "utf-8" })),
    stugit = JSON.parse(fs.readFileSync("../jsons/stugit.json", { encoding: "utf-8" })),
    github_name = new Array();

und.each(stugit, function(stu) {
  github_name[stu.stu_id.toLowerCase()] = stu.github_name;
});

var team_repos = JSON.parse(fs.readFileSync("query_repo.json", { encoding: "utf-8" }));
var remove_err = new Array();

var pos = 0;
dsa14.forM(team_repos, function(team, k) {
  pos = pos + 1;
  if (team!==false) {
    var cnt = 0;
    dsa14.forM(team.repos, function(repo, k) {
      if (repo.owner.login.toLowerCase() != "ntudsa2014"
        && (!github_name[team.student.stu_id]
          || repo.owner.login.toLowerCase() != github_name[team.student.stu_id].toLowerCase()))
      {
        gh.orgs.deleteTeamRepo({ "id": team.team_data.id // team id
                               , "user": repo.owner.login
                               , "repo": repo.name }
                               , function(err, data) {
          if (err !== null) {
            console.log("Remove " + repo.full_name + " from " + team.team_data.name + " error");
            remove_err.push({ "student": team.student, "repo": repo, "error": err });
            k(err);
          } else {
            console.log("    remove " + repo.full_name);
            ++cnt;
            k(true);
          }
        });
      } else {
        k(false);
      }
    }, function(res) {
      console.log(pos + "/" + team_repos.length + "; Team " + team.team_data.name + ": removed " + cnt + " repos");
      k(true);
    });
  } else {
    k(false);
  }
}, function(res) {

fs.writeFileSync("remove_repo_error.json", JSON.stringify(remove_err, null, 2));
console.log("Remove finished.");
});
