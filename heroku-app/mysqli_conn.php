<?php

// $dsn = 'mysql:host=us-cdbr-iron-east-05.cleardb.net;dbname=heroku_da6e4dde43b536d';
// $dbuser = 'b5af8d544f5b73';
// $pass = '6fcf143f';

DEFINE ('DBDSN', 'mysql:host=us-cdbr-iron-east-05.cleardb.net;dbname=heroku_da6e4dde43b536d');
DEFINE ('DBUSER', 'b5af8d544f5b73');
DEFINE ('DBPASS', '6fcf143f');

$db = new PDO(DBDSN, DBUSER, DBPASS);

?>
