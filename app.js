const mysql = require('mysql');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);
console.log('Server running...')

var user = '';


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
})




io.sockets.on('connection', function(socket){

  var con = mysql.createConnection({
    host: "budgtrdb.ch2trwlj2ypl.us-west-2.rds.amazonaws.com",
    user: "root",
    password: "mypassword",
  });

  con.connect(function(err){
    if(err) throw err;
    console.log("connected");
  });

  con.query('USE budgtrdb');

  socket.on('load transactions', function(userid){
    con.query('SELECT * FROM transactions WHERE iduser='+userid, function(err, result, fields){
      if(err) throw err;
      if(result.length>0){
        for(i=0;i<result.length;i++){
          io.sockets.emit('new transaction', {total: result[i]['transtotal'], date: result[i]['transdate'], location: result[i]['translocation']});
        }
      }
    });
  });

  socket.on('check login', function(user, pass){
    con.query('SELECT * FROM users WHERE username ="'+user+'" AND password = "'+pass+'"', function(err, result, fields){
      if(err) throw err;
      if(result.length>0){
        console.log(">0");
        io.sockets.emit('user exists', {userid: result[0]['idusers'], username: result[0]['username']});
      }
      else{
        console.log("less");
        io.sockets.emit('user does not exist');
      }
    });

  });

  socket.on('register user', function(user, pass){
    con.query('INSERT INTO users(username, password) VALUES ("'+user+'", "'+pass+'")', function(err, result, fields){
      if(err) throw err;
      con.query('SELECT idusers FROM users WHERE username="'+user+'"', function(err, result, fields){
        if(err) throw err;
        if(result.length>0){
          io.sockets.emit('user exists', {userid: result[0]['idusers'], username: user});
        }
      });


    });
  });

  socket.on('insert transaction', function(total, date, location, user){
    console.log(total, date, location);
    con.query('INSERT INTO transactions(transtotal, transdate, translocation, iduser) VALUES ("'+total+'", "'+date+'", "'+location+'",'+user+')', function(err, result, fields){
      if(err) throw err;
    })
    io.sockets.emit('new transaction', {total: total, date: date, location: location});
  });

});
