<?php

$namefile = "Teste";

$cmd = "javac ".$namefile.".java";
$result = "";
$error = "";

exec($cmd, $result, $error);

if($error){
		
    echo '{"status": "error"}';
    return;
}else{
   	echo '{"status": "compiled"}<br>';
    $result2 = "";
    $error2 = "";
    $cmd2 = "java ".$namefile . "< input.txt";
   

    exec($cmd2, $result2, $error2);


    if($error){
        echo '{"status": "error"}<br>';
        return;
    }else{
        echo '{"status": "finish with sucess!", "output": "'.implode($result2).'"}<br>';
        return; 
    }

	return; 
}