const restify = require('restify');
const errors = require('restify-errors');

const server =  restify.createServer({
    name : "Lojinha",
    version : "1.0.0"
})

const corsMiddleware = require("restify-cors-middleware2");
const cors = corsMiddleware({
    origins : ['*']
})

server.use( restify.plugins.acceptParser( server.acceptable ))
server.use( restify.plugins.queryParser() )
server.use( restify.plugins.bodyParser() )

server.pre(cors.preflight)
server.use(cors.actual)

server.listen(8001, function(){//servidor no ar
    console.log( "%s executando em: %s" , server.name, server.url )
}) 

var knex = require("knex")({ //faz uma conexão para o banco de dados
    client : "mysql" , 
    connection : {
        host : "localhost" , 
        user : "root" , 
        password : "" ,
        database : "loja" 
    }
})
//endpoint
server.get( "/" , (req, res, next) => {
    res.send("Seja bem-vindo à nossa Loja! ")
})

server.get( "/produto" /*definindo um endpoint*/ , (req, res, next) => {
    knex("produto").then((dados) => {
            res.send( dados )
    }, next)
})

server.get( "/produto/:idProd" , (req, res, next) => {
    id = req.params.idProd
    knex("produto")
        .where("id" , id)
        .first()
        .then((dados) => {
            if(!dados){
                return res.send(new errors.BadRequestError("Nenhum produto encontrado"))
            }
            res.send( dados )
        }, next)
})

server.post( "/produto" , (req, res, next) => {
    knex("produto")
        .insert( req.body )
        .then((dados) => {
            if(!dados){
               return res.send(new errors.BadRequestError("Não foi possivel inserir o produto"))
            }
            res.send( dados )
        }, next)
})

server.put( "/produto/:idProd" , (req, res, next) => {
    id = req.params.idProd
    knex("produto")
        .where("id" , id)
        .update( req.body )
        .then((dados) => {
            if(!dados){
               return res.send(new errors.BadRequestError("Não foi possivel editar o produto!"))
            }
           
            res.send( "Produto editado com sucesso" )
                
        }, next)
})

server.del( "/produto/:idProd" , (req, res, next) => {
    id = req.params.idProd
    knex("produto")
        .where("id" , id)
        .delete()
        .then((dados) => {
            if(!dados){
               return res.send(new errors.BadRequestError("Não foi possivel excluir o produto!"))
            }
           
            res.send( "Produto excluido com sucesso" )
                
        }, next)
})