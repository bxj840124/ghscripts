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
var add_err = new Array();

var pos = 0;
dsa14.forM(team_repos, function(team, k) {
  pos = pos + 1;
  if (team!==false && github_name[team.student.stu_id]!==undefined) {
    var forks = 0;
    und.each(team.repos, function(repo) {
      if (repo.owner.login.toLowerCase() === github_name[team.student.stu_id].toLowerCase()) {
        forks = forks + 1;
      }
    });
    console.log(pos + "/" + team_repos.length + "; " + team.student.stu_id + ": " + forks + " fork(s).");
    if (0<forks && forks!=5) {
      dsa14.forM([3,4,5,6,7], function(n, k) {
        gh.orgs.addTeamRepo({ "id": team.team_data.id
                            , "user": github_name[team.student.stu_id].toLowerCase()
                            , "repo": "dsa14hw" + n }
                            , function(err, data) {
          if (err !== null) {
            console.log("    ERROR add dsa14hw" + n);
            add_err.push({ "student": team.student
                         , "user": github_name[team.student.stu_id].toLowerCase()
                         , "repo": "dsa14hw" + n
                         , "error": err });
          } else {
            console.log("    add " + github_name[team.student.stu_id].toLowerCase() + "/dsa14hw" + n);
          }
          k(true);
        });
      }, function(res) {

      k(forks);
      });
    } else {
      k(forks);
    }
  } else {
    k(false);
  }
}, function(res) {

fs.writeFileSync("add_repo_error.json", JSON.stringify(add_err, null, 2));
console.log("Add finished.");
});
