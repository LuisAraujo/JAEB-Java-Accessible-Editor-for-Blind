<?php

$namefile = $_POST["namefile"];

$cmd = "javac ".$namefile.".java 2>&1";
$result = "";
$error = "";
$r = [];
exec($cmd, $result, $error);

if($error){
    $r["status"] = "error";
    if( is_array($result) )
            $r["message"] = implode("\n", $result); 
        else
            $r["message"] =  $result; 

        if( is_array($error) )
            $r["error"] = implode("\n", $error); 
        else 
            $r["error"] = $error; 
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
        if( is_array($result) )
            $r["message"] = implode("\n", $result); 
        else
            $r["message"] =  $result; 

        if( is_array($error2) )
            $r["error"] = implode("\n", $error2); 
        else 
            $r["error"] = $error2; 

        echo  json_encode($r);
        return;
    }else{
        $r["output"] = implode($result2);
        echo  json_encode($r);
        return; 
    }


}