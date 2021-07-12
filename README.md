# ITSI-GITSI
ITSI-GITSI es una herramienta para la generación y gestión automática de repos de GIT Hub, en principio tenemos como objetivos de la herramienta que sea capaz de hacer las siguientes cosas.

1. Generación automática de repos con una plantilla generada a partir de una propuesta de metamodelo.
  * Esta plantilla deberá ser capaz de definir etiquetas para issues, crear milestones en el proyecto e intentar realizar invitaciones automáticas de usuarios a los proyectos generados.
2. Calculador de notas de usuarios de los repos, teniendo en cuenta que issues han resuelto en la cada milestone, bien simplemente medianta la contabilizzación unitaria de esos issues (de uno en uno) o utilizando posibles tags de puntuación del issue.
3. Modificar automáticamente un Markdown en el repo para de manera automática plasmar las notas en el mismo.

## Posible Metamodelo de plantilla de repo
Para modifical el metamodelo utilizar la extensión `drawio` en visual studio code. OLD!!!
![model](resources/model.svg)

# Consideraciónes de uso de la herramienta.
En esta primera versión el nombre de los repos generados debe coincidir con el nombre de los usuarios en GitHub. En la carpeta examples teneis una serie de ejemplos de las distintas operaciones que podreís realizar con la herramienta.

## Requisitos y .env
Lo primero que debeis tener instalado en el ordenador es la última versión estable de [Node.js](https://nodejs.org/en/) en vuestro ordenador. Una vez comprobada la instalación de `Node.js` debeis modificar el archivo `.env.test` con vuestros datos de Github y eliminar la extensión `.test` del mismo. En principio necesitareis los siguientes paramentros.

* PERSONAL_ACCESS_TOKEN. Un token que podeis crear en la interfaz de [github](https://github.com/settings/tokens), es importante que para que la herramienta funcione correctamente debeis ser `owners` de la organización en la que vais a crear los repos. Al generar el token, generarlo con todos los permisos posibles para evitar posibles errores y no os olvideis de guardar el mismo dado que no podreís volver a consultarlo, y una pérdida de este supondría tener que volver a hacer la generación de token.

## Instalación de dependencias
Para el correcto funcionamiento de la herramienta lo primero que hay que hacer es instalar las dependencias del proyecto. Para ello debeis ejecutar en la carpeta raiz del proyecto la orden: 
```
npm install .
```

## Ejecutar la herramienta
...

### TODO
- [-] Analisis y documentación
  - [x] Generación de README.md para documentar el proceso
  - [x] Creación de un metamodelo básico para la definición de repos.
  - [ ] Mejorar el metamodelo para acompasar todos los campos necesarios en el mismo.
  - [ ] Escribir guia para la utilización de la herramienta.
- [-] Desarrollo
  - [x] Crear repositioro de manera automática con GitHub API v3.
  - [ ] Creación bulk de repositorios a partir de una lista de nombres (.xls, .csv,.tsv?)
  - [ ] Crear etiquetas asociadas a un proyecto de GitHub.
  - [ ] Crear milestones asociados a un proyecto de GitHub.
  - [ ] Crear issues de manera automática en un proyecto de GitHub.
  - [ ] Asociar etiquetas a issues.
  - [ ] Asociar milestones a issues.
  - [ ] Recuento de issues completados por usuario en un repositorio.
  - [ ] Recuento de puntuación de issues completados por usuario en un repositorio si fuese necesario.
  - [ ] Recuento de issues por usuario de un proyecto en un milestone.
  - [ ] Modificación de archivo dentro de mismo repo para el establecimiento automático de puntuaciones para un usuario.
