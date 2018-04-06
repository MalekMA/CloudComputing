
//dependencies
const mysql = require('mysql');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

//start server
server.listen(process.env.PORT || 3000);
console.log('Server running...')

var user = '';

//connect to AWS MySQL database
function connMySQL(){
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
  return con;
}


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/new', function(req, res){
  var con = connMySQL();
  var user = req.query.user;
  var month = req.query.month;
  var tot = req.query.tot;
  var date = req.query.date;
  var loc = req.query.loc;
  var method = req.query.method;
  var query = 'INSERT INTO transactions(iduser, translocation, transtotal, transdate, transmonth, transmethod) VALUES('+user+', "'+loc+'", '+tot+', "'+date+'", "'+month+'", "'+method+'")';
  console.log(query);
  con.query('INSERT INTO transactions(iduser, translocation, transtotal, transdate, transmonth, transmethod) VALUES('+user+', "'+loc+'", '+tot+', "'+date+'", "'+month+'", "'+method+'")', function(err, result, fields){
    if(err) throw err;
  });
});

app.get('/login', function(req, res){
  var id = "";
  var con = connMySQL();
  var username = req.query.user;
  var password = req.query.pass;

  con.query('SELECT idusers FROM users WHERE username="'+username+'" AND password="'+password+'"', function(err, result, fields){
    if(err) throw err;
    if(result.length>0){
      id = result[0]['idusers'];
      //jsonObj['id'].push(result[0]['idusers']);
      res.send(id.toString());
    }
    else{
      res.send("error");
    }
  });
});

app.get('/budgets', function(req, res){
  var con = connMySQL();
  var jsonObj = {"month":[], "budget":[], "spent":[]};
  var user = req.query.id;

  con.query('SELECT month, budget, spent FROM budgets WHERE iduser='+user, function(err, result, fields){
    if(err) throw err;
    if(result.length>0){
      for(i=0; i<result.length;i++){
        jsonObj['month'].push(result[i]['month']);
        jsonObj['budget'].push(result[i]['budget']);
        jsonObj['spent'].push(result[i]['spent']);
      }
    }
    else {
      res.send("error");
    }
    console.log("man javascript is weird");
    res.send(JSON.stringify(jsonObj));
  });
});

app.get('/transactions', function(req, res){
  var jsonObj = {"transtotal":[], "transdate":[], "translocation":[], "transitems":[], "transmethod":[]};
  var con = connMySQL();
  con.query('SELECT * FROM transactions WHERE iduser='+req.query.user+' AND transmonth="'+req.query.month+'"', function(err, result, fields){
    if(err) throw err;
    if(result.length>0){
      for(i=0;i<result.length;i++){
        jsonObj['transtotal'].push(result[i]['transtotal']);
        jsonObj['transdate'].push(result[i]['transdate']);
        jsonObj['translocation'].push(result[i]['translocation']);
        //jsonObj['transitems'].push(result[i]['transitems']);
        jsonObj['transmethod'].push(result[i]['transmethod']);
      }
    }
    res.send(JSON.stringify(jsonObj));
  });
});



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
          io.sockets.emit('new transaction', {total: result[i]['transtotal'], date: result[i]['transdate'], location: result[i]['translocation'], method: result[i]['transmethod']});
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
          var id = result[0]['idusers'];
          con.query('INSERT INTO budgets(iduser, budget, month, spent) VALUES('+id+', 0,"January", 0)', function(err, result, fields){});
          con.query('INSERT INTO budgets(iduser, budget, month, spent) VALUES('+id+', 0,"February", 0)', function(err, result, fields){});
          con.query('INSERT INTO budgets(iduser, budget, month, spent) VALUES('+id+', 0,"March", 0)', function(err, result, fields){});
          con.query('INSERT INTO budgets(iduser, budget, month, spent) VALUES('+id+', 0,"April", 0)', function(err, result, fields){});
          con.query('INSERT INTO budgets(iduser, budget, month, spent) VALUES('+id+', 0,"May", 0)', function(err, result, fields){});
          con.query('INSERT INTO budgets(iduser, budget, month, spent) VALUES('+id+', 0,"June", 0)', function(err, result, fields){});
          con.query('INSERT INTO budgets(iduser, budget, month, spent) VALUES('+id+', 0,"July", 0)', function(err, result, fields){});
          con.query('INSERT INTO budgets(iduser, budget, month, spent) VALUES('+id+', 0,"August", 0)', function(err, result, fields){});
          con.query('INSERT INTO budgets(iduser, budget, month, spent) VALUES('+id+', 0,"September", 0)', function(err, result, fields){});
          con.query('INSERT INTO budgets(iduser, budget, month, spent) VALUES('+id+', 0,"November", 0)', function(err, result, fields){});
          con.query('INSERT INTO budgets(iduser, budget, month, spent) VALUES('+id+', 0,"October", 0)', function(err, result, fields){});
          con.query('INSERT INTO budgets(iduser, budget, month, spent) VALUES('+id+', 0,"December", 0)', function(err, result, fields){});
          io.sockets.emit('user exists', {userid: id, username: user});
        }
      });


    });
  });

  socket.on('insert transaction', function(total, date, location, user, method){
    console.log(total, date, location);
    var tokens = date.split(" ");
    var month = tokens[0];
    con.query('INSERT INTO transactions(transtotal, transdate, translocation, iduser, transmonth, transmethod) VALUES ('+total+', "'+date+'", "'+location+'",'+user+', "'+month+'", "'+method+'")', function(err, result, fields){
      if(err) throw err;
    })
    io.sockets.emit('new transaction', {total: total, date: date, location: location, method:method, month:month});
  });

  socket.on('update budget', function(b, m, id){
    con.query('UPDATE budgets SET budget="'+b+'" WHERE month="'+m+'" AND iduser='+id, function(err, result, fields){
      if(err) throw err;
      io.sockets.emit('budget updated', {budget: b});
    });
  });

  socket.on('show monthly', function(month, user){
    con.query('SELECT budget FROM budgets WHERE iduser='+user+' AND month="'+month+'"', function(err, result, fields){
      if(err) throw err;
      if(result.length>0){
        console.log("Log something" + result[0]['budget']);
        io.sockets.emit('display budget', {budget: result[0]['budget'], month: month});
      }
    });
    con.query('SELECT * FROM transactions WHERE iduser='+user+' AND transmonth="'+month+'"', function(err, result, fields){
      if(err) throw err;
      if(result.length>0){
        for(i=0;i<result.length;i++){
          io.sockets.emit('monthly', {total: result[i]['transtotal'], date: result[i]['transdate'], location: result[i]['translocation'], method: result[i]['transmethod']});
        }
      }
    });
  });

});
