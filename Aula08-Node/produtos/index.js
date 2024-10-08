const http = require("http");
const mysql = require('mysql');


const hostname = "127.0.0.1";
const port = 3000;

const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root', // usuario defaut
    password : '',
    database : 'loja'
})

const server = http.createServer((req, res) =>{
    res.statusCode =  200;
    res.setHeader("Content-Type","text/plain");
    conn.connect(function(erro) {
        if (!erro){ //se nao der erro
            sql = "SELECT * FROM produto ORDER BY nome";
            conn.query(sql , function(err, result, fields ){ //consula no banco  / funcao de callback
                if( err ){ // se der erro na consulta
                    res.end( '{ "resposta" : "Erro na Consulta"}');
                } else {
                    req.end( JSON.stringify(result) );
                }
            }); 
        } else {
            res.end('{ "resposta" : "Erro na conexão" }');
        }
    })

});

server.listen( port, hostname, () => {
    console.log(`Servidor no ar em: http://${hostname}:${port}`);
});

