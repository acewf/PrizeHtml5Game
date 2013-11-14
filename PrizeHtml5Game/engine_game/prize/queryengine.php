<?php header('Access-Control-Allow-Origin: *'); ?>
<?php
include('class.base32.php5');
//header('Access-Control-Allow-Origin: http://www.passatemponatalprize.com/');
//header('Access-Control-Allow-Origin: http://passatemponatalprize.com/');
header('Access-Control-Allow-Methods: POST');
// Create connection
$con=mysqli_connect('hostingmysql50.amen.pt',"PM260_prize","prize_pixelkiller","pixelkiller_net_prize");
//$con=mysqli_connect('127.0.0.1:3306',"root","","prizesonea");
$nome=$_POST["nome"];
$email=$_POST["email"];
$empresa=$_POST["empresa"];
$pontos=$_POST["pontos"];
$b = new Base32;
$b->setCharset(Base32::csSafe);
// Check connection
if (mysqli_connect_errno($con))
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
} else {
	$pontos = str_replace('=', '', $pontos);
	$pontos = $b->toString($pontos);
	$pontos = floatval($pontos);

	/*mysql_select_db("pixelkiller_net_prize");*/
	$valueQuery = "INSERT INTO recordpoints (  email, empresa, pontos, timeregisto,nome) VALUES (  '$email','nda', $pontos, CURRENT_TIMESTAMP,'$nome')";
	$return = mysqli_query($con,$valueQuery);


	if ($return==0) {
		$selectQuery = "SELECT * FROM  `recordpoints` WHERE  `email` =  '$email'";
		$result = mysqli_query($con,$selectQuery);
		$row = mysqli_fetch_array($result, MYSQLI_NUM);
		/*
		print_r($pontos) ;
		$outstr = $b->fromString($pontos);
		print_r($outstr) ;
		*/
		if ($pontos>$row[3]) {
			# code...
			$UpdateQuery = "UPDATE `recordpoints` SET  `pontos` =  '$pontos' WHERE  `recordpoints`.`id` =$row[0];";//"UPDATE 'recordpoints' SET pontos=$pontos WHERE 'email'= '$email'";
			$nresult = mysqli_query($con,$UpdateQuery);
			echo "Pontos Actualizados";
		} else {

			echo "Pontos Inferiores a ultima jogada";
			$instr = $pontos;
			$bstr = $b->fromString($instr);
			$outstr = $b->toString($bstr);
		}
	} else {
		echo "Pontos Registados";
	}

}

?>