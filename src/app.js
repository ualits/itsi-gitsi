const GitHub = require('github-api');
const yaml = require('js-yaml');
const fs   = require('fs');
const Issue = require('github-api/dist/components/Issue');

require('dotenv').config()

var gh = new GitHub({
    token: process.env.PERSONAL_ACCESS_TOKEN
});

var args = process.argv;

if(args[2]){
// Get document, or throw exception on error
    try {
        console.log(args[2])
        const doc = yaml.load(fs.readFileSync(args[2], 'utf8'));
        console.log(doc);
        if(doc.apiVersion==1){
            switch(doc.op.toLowerCase()){
                case 'delete':
                    doc.metadata.repos.forEach(repo=>{
                        deleteRepoV1(doc.org, repo);
                    });
                    break;
                case 'create':
                    doc.metadata.repos.forEach(async repo=>{
                        await createRepoV1(doc.org, repo);
                        await createLabelsV1(doc.org, repo, doc.metadata.labels)
                    });
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

//var org = gh.getOrganization(process.env.ORG_NAME);

/* var repoDef = {
    "name": "artifactdra19",
    "private": true
} */

async function createRepoV1(org,repo){
    var organization = gh.getOrganization(org);
    var resultado = await organization.createRepo({name:repo,private:true}, function(error,result,request){
        if(error) return error;
        return result;
    })
    console.log(resultado);
}

async function deleteRepoV1(org,repo){
   
   var repository = await gh.getRepo(org,repo);
   var resultado=await repository.deleteRepo(function(error,result,request){
    if(error) return error;
    return result;
   })
   console.log(resultado)
}

async function evaluarRepoV1(org,repo){

    var issues = await gh.getIssues(org, repo)

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
    await modificarListadoNotas(repo, count)
}

async function modificarListadoNotasV1(repo, count){
    var repository = await gh.getRepo(process.env.ORG_NAME, repo.name);

    var documentToWrite = "# Notas acumuladas \n"+ "Nombre de Usuario | Notas\n"+"----------------- | -----\n";

    await Object.entries(count).forEach(element=>{
        documentToWrite+=element[0]+"|"+element[1]+"\n"
    })
    repository.writeFile("master", "NOTAS.md", documentToWrite, "Actualizadas Notas");
}

async function createLabelsV1(org, repo, labels){
    
    var issue = gh.getIssues(org,repo);
    labels.forEach(async label=>{
        await issue.createLabel(({name:label.name, description:label.description, color:label.color}),(error,result,request)=>{
            if(error){
                console.log(error)
                process.exit(1);
            }
            console.log(result);
        })
    })
    
}
async function generarIssues(repo, issues){
    
}