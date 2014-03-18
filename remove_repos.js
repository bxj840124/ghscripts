// forM :: [a] -> (a -> Cont r b) -> Cont r [b]
function forM(arr, fn, k) {
  res = new Array();
  (function rec(i) {
    if (i < arr.length) {
      fn(arr[i], function(data) {
        res.push(data);
        rec(i+1);
      });
    } else {
      k(res);
    }
  })(0);
}

var fs = require("fs");
var und = require("underscore");

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

var query_err = new Array(),
    remove_err = new Array();

forM(teams, function(team, k) {
  gh.orgs.getTeamRepos({ "id": team.team_data.id }, function(err, repos) {
    if (err !== null) {
      console.log("querying team " + team.team_data.name + "/" + team.student.stu_id + ": ERROR");
      query_err.push({ "student": team.student, "error": err });
      k(false);
    } else {
      console.log("querying team " + team.team_data.name + ": " + repos.length + " repo(s)");
      k({ "student": team.student, "team_data": team.team_data, "repos": repos});
    }
  });
}, function(team_repos) {

fs.writeFileSync("query_repo_error.json", JSON.stringify(query_err, null, 2));
fs.writeFileSync("query_repo.json", JSON.stringify(team_repos, null, 2));
console.log("Query finished. Removing repos...");

forM(team_repos, function(team, k) {
  if (team!==false && team.repos.length !== 10) {
    var cnt = 0;
    forM(team.repos, function(repo, k) {
      if (repo.owner.login.toLowerCase() != "ntudsa2014"
        && repo.owner.login.toLowerCase() != github_name[team.student.stu_id].toLowerCase())
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
      console.log("Team " + team.team_data.name + ": removed " + cnt + " repos");
      k(true);
    });
  } else {
    k(false);
  }
}, function(res) {

fs.writeFileSync("remove_repo_error.json", JSON.stringify(remove_err, null, 2));
console.log("Remove finished.");
});});
