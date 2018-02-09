<?php

session_start();
//require_once('mysqli_conn.php');

$username = $_POST['emailIn'];
echo $username ." ";
$password = $_POST['passIn'];
echo $password."<br>";

$dsn = 'mysql:host=us-cdbr-iron-east-05.cleardb.net;dbname=heroku_da6e4dde43b536d';
$dbuser = 'b5af8d544f5b73';
$pass = '6fcf143f';
$db = new PDO($dsn, $dbuser, $pass);

$s = "SELECT username, password FROM users WHERE username ='".$username."' AND password = '".$password."';";
echo $s;
$statement = $db->prepare($s);
$statement->execute();
$notEmpty = $statement->fetchAll();

if(sizeof($notEmpty)>0){
  $_SESSION['user'] = $username;
  header('Location:index.php');
}
else{
  echo 'username or password is incorrect.';
}
