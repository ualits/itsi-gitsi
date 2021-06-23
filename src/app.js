const GitHub = require('github-api');

require('dotenv').config()

var gh = new GitHub({
    token: process.env.PERSONAL_ACCESS_TOKEN
});

var org = gh.getOrganization(process.env.ORG_NAME);

var repoDef = {
    "name": "runeterradra20",
    "private": true
}

var args = process.argv;

if(args[2]=="create") createRepo(repoDef)
if(args[2]=="delete") deleteRepo(repoDef)
if(args[2]=="repo") repoCount(repoDef)

async function createRepo(repo){
    var resultado = await org.createRepo(repo, function(error,result,request){
        if(error) return error;
        return result;
    })
    console.log(resultado);
}

async function deleteRepo(repo){
    
   var repository = await gh.getRepo(process.env.ORG_NAME,repo.name);

   repository.deleteRepo((error,result,request)=>{
       console.log(result);
   })
}

async function repoCount(repo){

    var issues = await gh.getIssues(process.env.ORG_NAME, repo.name)

    var count = {};
    await issues.listIssues({state:"closed"},(error,result,request)=>{
        result.forEach(async element => {
            var pointFactor=0;
            await element.labels.forEach(label=>{
                if(label.name=="1") pointFactor+=1;
                if(label.name=="2") pointFactor+=2;
                if(label.name=="3") pointFactor+=3;
                if(label.name=="4") pointFactor+=4;
                if(label.name=="5") pointFactor+=5;
                if(label.name=="6") pointFactor+=6;
                if(label.name=="7") pointFactor+=7;
                if(label.name=="8") pointFactor+=8;
                if(label.name=="9") pointFactor+=9;
                if(label.name=="10") pointFactor+=10;
            })
            if(pointFactor==0) pointFactor=1;
            await element.assignees.forEach(assignee=>{
                if(!count[assignee["login"]]) count[assignee["login"]]=pointFactor
                else count[assignee["login"]]+=pointFactor
            })
        });
    })
    console.log(count)
}