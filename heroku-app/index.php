<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <title>TODO</title>
  </head>
  <body>
<?php
session_start();

if(empty($_SESSION)){
  echo '
  <div class="container">
    <div class="page-header">
      <h1>Welcome to TODO</h1>
    </div>
    <div class="jumbotron">
    <form role="form" method="post" action="plogin.php">
<div class="form-group">
<label for="emailIn">Email address</label>
<input type="email" name="emailIn" class="form-control" id="emailIn" aria-describedby="emailHelp" placeholder="Enter email">
</div>
<div class="form-group">
<label for="passIn">Password</label>
<input type="password" name="passIn" class="form-control" id="passIn" placeholder="Password">
</div>
<div class="g-recaptcha" data-sitekey="6LfUOkUUAAAAAOkQoLt6GXkoeo2nPxmqTuf5jyed"></div>
<button type="submit" class="btn btn-primary">Submit</button>
</form>
<br>
<p><a href="register.php" class="btn btn-secondary" role="button">Register</a></p>

    </div>
  </div>

  ';
}
else {
  $user = $_SESSION['user'];
  $dsn = 'mysql:host=us-cdbr-iron-east-05.cleardb.net;dbname=heroku_da6e4dde43b536d';
  $dbuser = 'b5af8d544f5b73';
  $pass = '6fcf143f';
  $db = new PDO($dsn, $dbuser, $pass);
  $statement = $db->prepare("SELECT user_id FROM users WHERE username='".$user."';");
  $statement->execute();
  $notEmpty = $statement->fetchAll();
  //echo $user;
  $userid = $notEmpty[0]['user_id'];
  //echo $userid;
  $_SESSION['userid'] = $userid;
  $statement = $db->prepare("SELECT idtodo, todo_text, due_date FROM todo WHERE user_id=$userid");
  $statement->execute();
  $todos = $statement->fetchAll();

  echo '
  <div class="container">
      <div class="float-sm-right">
        <small>Logged in as '.$user.'</small>
        </div>
        </div>
        <br>
  <div class="container">
        <div class="float-sm-right">
        <p><a href="logout.php" class="btn btn-sm" role="button">Logout</a></p>
      </div>
    </div>
    <br>
  <div class="container">
    <div class="jumbotron">
    <form action="delete.php" method="post">
    <table class="table table-hover">
      <thead>
        <tr>
          <th> </th>
          <th>ToDo</th>
          <th>Due</th>
      </thead>
      <tbody>

    ';
    foreach($todos as $t){
      echo
      '
      <tr>
        <td><input type="checkbox" aria-label="Completed" name="todoid" value="'.$t['idtodo'].'">
        <td>'.$t['todo_text'].'</td>
        <td>'.$t['due_date'].'</td>
        </tr>
      ';
    }
    echo '
        </tbody>
        </table>
        <button type="submit" class="btn btn-success">Completed</button>
        </form>
    </div>
  </div>

  <div class="container">
    <div class="jumbotron">
    <form role="form" method="post" action="padd.php">
      <div class="form-group">
      <label for="todoIn">Add new ToDo</label>
      <input type="text" name="todoIn" class="form-control" id="todoIn" aria-describedby="todoIn" placeholder="...">
      <label for="due_date">Due Date</label>
      <br>
      <input type="date" name="dueDate">
      <br>
      <button type="submit" class="btn btn-default">Add</button>
      </div>
      </form>
    </div>
  </div>


  ';
}
?>





    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src='https://www.google.com/recaptcha/api.js'></script>
  </body>
</html>
