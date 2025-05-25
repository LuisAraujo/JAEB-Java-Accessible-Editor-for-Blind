<?php
$namefile = "Teste";
$code = $_POST['code'];
$temp = fopen($namefile.".java", "w");
$r = [];
if(!$temp) {
    $r['status'] = 'error';
   
}else{
    fwrite($temp, $code);
    fclose($temp);
    $r['status'] = 'ok';
    $r['name'] = $namefile;
}

 echo  json_encode($r);