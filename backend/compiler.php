<?php

$namefile = "Teste";//$_POST["namefile"];

$cmd = "javac ".$namefile.".java";
$result = "";
$error = "";
$r = [];
exec($cmd, $result, $error);

if($error){
    $r["status"] = "error";
    $r["message"] = $error; 
    $r["result"] = implode($result);
    echo  json_encode($r);
    return;
}else{
   	$r["status"] = "compiled";
    $result2 = "";
    $error2 = "";
    //$cmd2 = "java ".$namefile . "< input.txt";
    $cmd2 = "java ".$namefile;

    exec($cmd2, $result2, $error2);

    if($error){
       	$r["status"] = "error";
        echo  json_encode($r);
        return;
    }else{
        $r["output"] = implode($result2);
        echo  json_encode($r);
        return; 
    }


}