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

$s = "INSERT INTO users(username, password) VALUES ('".$username."', '".$password."');";
echo $s;
$statement = $db->prepare($s);
$statement->execute();
$count = $statement->rowCount();

if($count==1){
  $_SESSION['user'] = $username;
  header('Location:index.php');
}
else{
  echo $s . $count;
}
