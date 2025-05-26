function createFile(name,code, callback, callback2){
    console.log("",name,code,)  ;
    $.post( "backend/newfile.php", {name:name, code: code}, 
    function( data ) {
        console.log(data);
        var json = JSON.parse(data);
        if(json.status == "ok")
            callback(json);
        else{
            callback2();
        }
    });
}


function executeCode(namefile, callback, callback2){
     $.post( "backend/compiler.php", {namefile: namefile}, 
    function( data ) {
        var json = JSON.parse(data);
        if(json.status == "compiled")
           callback(json);
        else{
            callback2(json);
        }
    });
}