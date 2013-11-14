<?php header('Access-Control-Allow-Origin: *'); ?>
<?php
//header('Access-Control-Allow-Origin: http://www.passatemponatalprize.com, http://passatemponatalprize.com');
//header('Access-Control-Allow-Origin: http://www.passatemponatalprize.com/');
//header('Access-Control-Allow-Origin: http://passatemponatalprize.com/');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
//header('Access-Control-Max-Age: 1000');
//header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Create connection
$con=mysqli_connect('hostingmysql50.amen.pt',"PM260_prize","prize_pixelkiller","pixelkiller_net_prize");
//$con=mysqli_connect('127.0.0.1:3306',"root","","prizesonea");

// Check connection
if (mysqli_connect_errno($con))
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
} else {
	//echo " connected to MySQL: ";
	/*mysql_select_db("pixelkiller_net_prize");*/
	$valueQuery = "SELECT * FROM  `recordpoints` ORDER BY  `recordpoints`.`pontos` DESC LIMIT 0 , 10";
	$return = mysqli_query($con,$valueQuery);
	//$row = mysqli_fetch_array($result, MYSQLI_NUM);
	//$row = mysqli_fetch_array($return, MYSQLI_NUM)
	 while($row = mysqli_fetch_array($return, MYSQLI_NUM))
    {
    	echo '<li><div class="name">'.$row[5].'</div><div class="pontos">'.$row[3].'</div></li>';
    }
}
?>