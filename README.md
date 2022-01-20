# ITSI-GITSI
ITSI-GITSI is a tool for generating and automatically managing GitHub repositories. The tool capabilities are the following:

1. Automatic generation of students' and teachers' repositories in a specific organization.
2. Bulk generation of repositories using a .csv file.
3. Generate issues and milestones related to course assignments, either when creating a repository or a posteriori.
4. Calculator of scores for the users of the repositories, taking into account the issues resolved, either simply counting one by one the issues or using possible score tags of the particular issue.
5. Automatic modification of a markdown file to capture the scores.
6. Fast deletion of multiple repositories.

# Consideration of use of the tool.
In the examples folder, you have a series of examples of the different operations that can be performed with the tool.

## Requirements and .env
The first thing you should have installed on your computer is the latest stable version of [Node.js](https://nodejs.org/en/). Once the installation of 'Node.js' has been verified, you must modify the '.env.test' file with your Github data and remove the '.test' extension from it. In that file you will need the following parameters:

* PERSONAL_ACCESS_TOKEN. A token that you can create in the interface of [github](https://github.com/settings/tokens), it is important that for the tool to work correctly you must be 'owner' of the organization in which you are going to create the repositories. When generating the token, generate it with all possible permissions to avoid possible errors and do not forget to save it since you will not be able to consult it again, and a loss of this would mean having to do the token generation again.

## Installing dependencies
For the correct functioning of the tool, the first thing to do is install the project's dependencies. To do this, you must execute in the root folder of the project the order: 
```
npm install .
```

## Run the tool
To run it, you have to launch the program with the configuration .yaml file you want to launch, for example:
```
npm start ./examples/01_CreateRepos.yaml
```

### Collaborators
* **Manel Mena** - [https://github.com/manelme](https://github.com/manelme).
* **Javier Criado** - [https://github.com/javicriado](https://github.com/javicriado).