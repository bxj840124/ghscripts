var fs = require("fs");
var und = require("underscore");
var dsa14 = require("./utils.js");

var ghapi = require("github");
var gh = new ghapi({ version: "3.0.0" });

gh.authenticate({
  type: "oauth",
  token: fs.readFileSync("../my-oauth-token", { encoding: "utf-8" })
});

var stus = JSON.parse(fs.readFileSync("../jsons/stulist.json"));

var repos = ["NTUDSA2014/dsa14hw3", "NTUDSA2014/dsa14hw4", "NTUDSA2014/dsa14hw5",
             "NTUDSA2014/dsa14hw6", "NTUDSA2014/dsa14hw7"]

var create_errors = new Array(),
    ret_data = new Array();

dsa14.forM(stus, function(stu, k) {
  if (stu.identity == "校內生") {
    console.log("Creating team " + stu.stu_id);
    gh.orgs.createTeam({ "org": "NTUDSA2014"
                       , "name": stu.stu_id
                       , "repo_names": repos
                       , "permission": "pull" }
                       , function(err, data) {
      if (err !== null) {
        console.log("ERROR");
        create_errors.push({ "student": stu, "error": err});
      } else {
        ret_data.push({ "student": stu, "team_data": data });
      }
      k(data);
    });
  } else {
    k(false);
  }
}, function(res) {

fs.writeFileSync("create_error.json", JSON.stringify(create_errors, null, 2));
fs.writeFileSync("team_data.json", JSON.stringify(ret_data, null, 2));
console.log("done: total " + create_errors.length + " error(s).");
});
