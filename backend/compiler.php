<?php

$namefile = $_POST["namefile"];

$cmd = "javac ".$namefile.".java 2>&1";
$result = "";
$error = "";
$r = [];
exec($cmd, $result, $error);

if($error){
    $r["status"] = "error";
    $r["message"] = implode("\n", $result); 
    $r["result"] = implode($result);
    echo  json_encode($r);
    return;
}else{
   	$r["status"] = "compiled";
    $result2 = "";
    $error2 = "";
    //$cmd2 = "java ".$namefile . "< input.txt";
    $cmd2 = "java ".$namefile. " 2>&1";

    exec($cmd2, $result2, $error2);

    if($error2){
       	$r["status"] = "error";
         $r["message"] = implode("\n", $result); 
        echo  json_encode($r);
        return;
    }else{
        $r["output"] = implode($result2);
        echo  json_encode($r);
        return; 
    }


}