<?php
$toDel = $_POST['todoid'];

$dsn = 'mysql:host=us-cdbr-iron-east-05.cleardb.net;dbname=heroku_da6e4dde43b536d';
$dbuser = 'b5af8d544f5b73';
$pass = '6fcf143f';
$db = new PDO($dsn, $dbuser, $pass);

$s = "DELETE FROM todo WHERE idtodo=".$toDel.";";
echo $s;
$statement = $db->prepare($s);
$statement->execute();
$count = $statement->rowCount();

if($count==1){
  header('Location:index.php');
}
else{
  echo $s . $count;
}
