const yaml = require('js-yaml');
const fs   = require('fs');
const csv=require("csvtojson");
const { Octokit } = require("@octokit/rest");
var base64 = require('base-64');

require('dotenv').config()

const octokit = new Octokit({
  auth: process.env.PERSONAL_ACCESS_TOKEN,
  userAgent: "ITSI-GITSI"
});

var args = process.argv;

async function main(){
    if(args[2]){
        // Get document, or throw exception on error
            try {
                const doc = await yaml.load(fs.readFileSync(args[2], 'utf8'));
                if(doc.apiVersion==1){
                    switch(doc.op.toLowerCase()){
                        case 'delete':
                            for(var repo of doc.metadata.repos){
                                deleteRepoV1(doc.org, repo);
                            }
                            break;
                        case 'create':
                            for(var repo of doc.metadata.repos){
                                await createRepoV1(doc.org, repo);
                                if(doc.metadata.labels) await createLabelsV1(doc.org, repo, doc.metadata.labels);
                                if(doc.metadata.milestones) await createMilestonesV1(doc.org, repo, doc.metadata.milestones);
                                if(doc.metadata.issues) await createIssuesV1(doc.org,repo,doc.metadata.issues);
                            }
                            break;
                        case 'evaluate':
                            for(var repo of doc.metadata.repos){
                                await evaluateRepoV1(doc.org, repo, doc.metadata.evalFile);
                            }
                            break;
                        case 'assign':
                            for(var repo of doc.metadata.repos){
                                if(doc.metadata.issues) await createIssuesV1(doc.org,repo,doc.metadata.issues);
                            }
                            break;
                        case 'bulkload':
                            await createBulkRepos(doc, doc.metadata.repos)
                            break;
                        default:
                            throw new Error("Op no controlada")
                    }
                }
                else{
                    throw new Error("Versión no controlada");
                }
            } catch (e) {
                console.log(e);
            }
        }else{
            process.exit(0);
        }
}

async function createRepoV1(org,repo){
    
    var resultado = await octokit.request('POST /orgs/'+org+'/repos', {
        org: org,
        name: repo.name,
        private: repo.private
    })
    if(repo.users){
        for(user of repo.users){
            await octokit.request('PUT /repos/'+org+'/'+repo.name+'/collaborators/'+user, {
                owner: org,
                repo: repo.name,
                username: user,
                permission: 'admin'
              })
        }
    }
    console.log(resultado);
}

async function deleteRepoV1(org,repo){

   var resultado = await octokit.request('DELETE /repos/'+org+'/'+repo, {
    owner: org,
    repo: repo
   })
   console.log(resultado)
}

async function createLabelsV1(org, repo, labels){

    for(label of labels){
        var resultado = await octokit.request('POST /repos/'+org+'/'+repo.name+'/labels', {
            name: label.name,
            description: label.description,
            color: label.color
        })
        console.log(resultado)
    }
}

async function createMilestonesV1(org, repo, milestones){

    for(milestone of milestones){
        var resultado = await octokit.request('POST /repos/'+org+'/'+repo.name+'/milestones', {
            title: milestone.title,
            description: milestone.description,
        })
        console.log(resultado)
    }
}

async function createIssuesV1(org, repo, issues){
    
    for(issue of issues){
        var resultado = await octokit.request('POST /repos/'+org+'/'+repo.name+'/issues', {
            title: issue.title,
            body: issue.description,
            labels: issue.labels
        })
        console.log(resultado)
    }   
}

async function evaluateRepoV1(org, repo, file){

    var count = {};

    var issues = await octokit.request('GET /repos/'+org+'/'+repo+'/issues', {
        state: "closed"
    })
    console.log(issues);
    for(issue of issues.data){
            var pointFactor=0;
            for(label of issue.labels){
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
            }
            if(pointFactor==0) pointFactor=1;
            for(assignee of issue.assignees){
                if(!count[assignee["login"]]) count[assignee["login"]]=pointFactor
                else count[assignee["login"]]+=pointFactor
            }
    }
    await modifyEvaluationListV1(org, repo, count, file)
}

async function modifyEvaluationListV1(org, repo, count, file){
    
    var documentToWrite = "# Notas acumuladas \n"+ "Nombre de Usuario | Notas\n"+"----------------- | -----\n";

    await Object.entries(count).forEach(element=>{
        documentToWrite+=element[0]+"|"+element[1]+"\n"
    })
    await octokit.request('PUT /repos/'+org+'/'+repo+'/contents/{path}', {
        path: file,
        message: 'Grades updated',
        content: base64.encode(documentToWrite)
    })
}

async function createBulkRepos(doc, repos){
    var data = await csv().fromFile(repos.file);
    for(element of data){
        var resultado = await octokit.request('POST /orgs/'+doc.org+'/repos', {
            name: element['Nombre de usuario'],
            private: repos.private
        })
        if(element.GitHubUser!=""){
            var users=element.GitHubUser.split(";");
            for(user of users){
                await octokit.request('PUT /repos/'+doc.org+'/'+element['Nombre de usuario']+'/collaborators/'+user, {
                        username: user,
                        permission: 'admin'
                })
            }   
        }else{
            //TODO Cuando GithubCampus vivo 😁
        }
        //if(doc.metadata.labels) await createLabelsV1(doc.org, {name:element['Nombre de usuario']}, doc.metadata.labels);
        //if(doc.metadata.milestones) await createMilestonesV1(doc.org, {name:element['Nombre de usuario']}, doc.metadata.milestones);
        //if(doc.metadata.issues) await createIssuesV1(doc.org,{name:element['Nombre de usuario']},doc.metadata.issues);
    }
}

main()