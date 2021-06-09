const GitHub = require('github-api');

require('dotenv').config()

var gh = new GitHub({
    token: process.env.PERSONAL_ACCESS_TOKEN
});

var org = gh.getOrganization(process.env.ORG_NAME);

var repoDef = {
    "name": "prueba1",
    "private": true
}

var args = process.argv;

if(args[2]=="create") createRepo(repoDef)
if(args[2]=="delete") deleteRepo(repoDef)

async function createRepo(repo){
    var resultado = await org.createRepo(repo, function(error,result,request){
        if(error) return error;
        return result;
    })
    console.log(resultado);
}

async function deleteRepo(repo){
    
   var repository = await gh.getRepo("ualdra","prueba1");

   repository.deleteRepo((error,result,request)=>{
       console.log(result);
   })
}


