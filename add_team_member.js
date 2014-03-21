var fs = require("fs");
var und = require("underscore");
var dsa14 = require("./utils.js");

var ghapi = require("github");
var gh = new ghapi({ version: "3.0.0" });

gh.authenticate({
  type: "oauth",
  token: fs.readFileSync("../my-oauth-token", { encoding: "utf-8" })
});

var names =
  JSON.parse(
    fs.readFileSync("../jsons/stugit.json"
                   , { encoding: "utf-8" })).map(function (stu) {
  return { stu_id: stu.stu_id.toLowerCase(), github_name: stu.github_name };
});

var teams =
  JSON.parse(
    fs.readFileSync("../jsons/team_data.json", { encoding: "utf-8" }));

var team_id = new Array();

und.each(teams, function (team) {
  team_id[team.team_data.name] = team.team_data.id;
});

var add_error = new Array(),
    add_ok = new Array();

dsa14.forM(names, function(usr, k) {
  console.log("Adding " + usr.github_name + " to " + team_id[usr.stu_id]);
  if (team_id[usr.stu_id] === undefined) {
    console.log("undefined ERROR");
    add_error.push({ "student": usr, "error": "undefined" });
    k(false);
  } else {
    gh.orgs.addTeamMember({ "id": team_id[usr.stu_id]
                          , "user": usr.github_name }
                          , function(err, data) {
      if (err !== null) {
        console.log("ERROR");
        add_error.push({ "student": usr, "error": err });
        k(false);
      } else {
        add_ok.push({ "student": usr, "data": data });
        k(data);
      }
    });
  }
}, function(res) {

fs.writeFileSync("team_add_ok.json", JSON.stringify(add_ok, null, 2));
fs.writeFileSync("team_add_error.json", JSON.stringify(add_error, null, 2));
console.log("finish: total " + add_error.length + " error(s).");
});
