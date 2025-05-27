
var windowReady = false;
var voiceReady = false;
var editor;
var currentLine = 1;
var alt = false;


/* event key up*/
function keyupEvent(event){
    if(event.keyCode == 18){
        alt = false;
        editor.setReadOnly(false);
        $("#command-container").hide();
    }
}

/* event to get key command*/
function checkComando(event){
    console.log(event);
    showButton(event);
    
    //Alt
    if(event.keyCode == 18){
        alt = true;
        editor.setReadOnly(true);
        $("#command-container").show();
    }else{

        //Alt + 1 (ler todo o texto)
        if(( alt ) && (event.keyCode == 49)){
            startVoiceText( getMenu() );
        }
        //Alt + 2 (ler todo o texto)
        if(( alt ) && (event.keyCode == 50)){
            startVoiceText( parser(editor.getValue()) );
        }
        //Alt + 3 (ler o texto da linha atual)
        if(( alt ) && (event.keyCode == 51)){
            readCurrentLine();
        }

        //Alt + 4 (ler o texto da linha atual)
        if(( alt ) && (event.keyCode == 52)){
            run( getNameClasse() );
        }

        //Alt + 5 (ler mensagem atual)
        if(( alt ) && (event.keyCode == 53)){
            readCurrentMessage();
        }

        //Alt + 6 (ler descrição da atividade)
        if(( alt ) && (event.keyCode == 54)){
            readActivityDescription();
        }

        //Alt + 7 (ler próxima dica)
        if(( alt ) && (event.keyCode == 55)){
            readNextStepHint();
        }

     
        //del
        if((event.keyCode == 8)){
            readDeletedChar();
        }

        //esc
        if(event.keyCode == 27){
            stopVoiceText();
        }

        //arrow down
        if(event.keyCode == 40)
            gotoNextLine();

            //arrow up
        if(event.keyCode == 38)
            gotoPriorLine();

        if(event.keyCode == 39){
           readCurrentChar( function(){
                if(checkEndLine()){
                    startVoiceText("Fim da linha. ");
                }
                if(checkStartLine()){
                    startVoiceText("Início da linha seguinte. ");
                     currentLine =  editor.getCursorPosition().row;
                }
           });

        }

        if(event.keyCode == 37){
            readCurrentChar(function(){
                if(checkStartLine()){
                    startVoiceText("Início da linha. ");
                }
                if(checkEndLine()){
                    startVoiceText("Fim da linha anterior. ");
                     currentLine =  editor.getCursorPosition().row;
                }
            });
        
        }

    }
}

/* Show pressed button in screen */
function showButton(event){
    output ="";
    //show representation button pressed
    if( alt )
        output+="<span class='btn'>Alt </span> +";

    output+=" <span class='btn'>"+event.key+" </span>";
    $("#comando").html( output );

}

$(window).load( function() {
    //focus on window
    $(this).trigger("focus");

    //ace setting
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/clouds");
    editor.setShowPrintMargin(false);
    editor.session.setMode("ace/mode/python");
    document.getElementById('editor').style.color='#000';
    editor.session.on('change', function(delta) {
        var lineno = delta.start.row
        readCurrentChar2();
    });
    beautify = ace.require("ace/ext/beautify"); // get reference to extension
    //remove auto complete
    editor.setBehavioursEnabled(false);

    windowReady = true;
    $('#voicetestdiv').hide();
    $('#waitingdiv').show();

    responsiveVoice.setDefaultVoice("Brazilian Portuguese Female");



    //click in voice button
    $("#voicecode").click(function(){
        startVoiceText( parser(editor.getValue()) );
    });

    //key down window to call check command
    $(window).keydown(checkComando);
    $(window).keyup( keyupEvent );

    //key down textarea to call check command
    $("textarea").keydown(checkComando);
    //on focus out fomat code in ace
    //$("textarea").focusout(fomatCode);


});

/* */
responsiveVoice.OnVoiceReady = function() {
    voiceReady = true;
    CheckLoading();
    startVoiceText("Bem Vindo ao JAEB. Pressione Alt e 1 para conhecer os comandos.");
}

/* check loading of voice */
function CheckLoading() {
      if (voiceReady && windowReady) {
          $('#voicetestdiv').fadeIn(0.5);
          $('#waitingdiv').fadeOut(0.5);
      } 
  }

/* start voic reading the text */
function startVoiceText(text){
    responsiveVoice.speak( text);
}

/* stop current voice */
function stopVoiceText(){
    responsiveVoice.cancel();
}

/* translating symbol to text representation */
function parser(text){
    text =text.replaceAll(" "," espaço. ");
    text = text.replaceAll(":"," dois pontos. ");
    text = text.replaceAll("{"," sinal de chave abrindo. ");
    text = text.replaceAll("}"," sinal de chave fechando. ");
    text =text.replaceAll("("," sinal de parentese abrindo. ");
    text =text.replaceAll(")"," sinal de parentese fechando. ");
    text =text.replaceAll(";"," ponto e vírgula. ");
    text =text.replaceAll(";"," ponto.  ");
    text =text.replaceAll("\""," aspas.  ");
    text =text.replaceAll("'"," aspas.  ");
   
    return text;
}

/*voice read current line*/
function readCurrentLine(){
    var lineCode = getCurrentLine();
    startVoiceText(parser(lineCode));
}

/* get code of current line */
function getCurrentLine(){
    selectionRange = editor.getSelectionRange();
    var currentLine = selectionRange.start.row;
    codeArray = editor.getValue().split("\n");
    currentLineCode = codeArray[currentLine];
    return currentLineCode;
}
/* */
function isEmptyLine(line){
    return line.trim() == ""?1:0;
}

/*Go to next line in ace editor*/
function gotoNextLine(){
    var n = editor.getSession().getValue().split("\n").length; 
    //if(currentLine < n)
    //    currentLine++;
    currentLine =  editor.getCursorPosition().row;
    editor.gotoLine(currentLine+1);
    editor.focus();

     var lineCode = getCurrentLine();
    if(isEmptyLine(lineCode))
        startVoiceText("Linha "+ (currentLine+1) +". Aviso: está linha esta vazia! ");
    else
        startVoiceText("Linha "+(currentLine+1));

   
}
/*go to prior line in ace editor*/
function gotoPriorLine(){
    //if(currentLine>1)
      //  currentLine--;
    currentLine =  editor.getCursorPosition().row;
    editor.gotoLine(currentLine+1);
    editor.focus();

    var lineCode = getCurrentLine();
    if(isEmptyLine(lineCode))
        startVoiceText("Linha "+(currentLine+1) +". Aviso está linha esta vazia!");
    else
        startVoiceText("Linha "+(currentLine+1));
}
/* call beautify funcion of ace*/
function fomatCode(){
    beautify.beautify(editor.session);
}

/* get text menu */
function getMenu(){
    text = "Lista de comandos. ";
    text += "Pressione Alt e 2 para ler todo o código. ";
    text += "Pressione Alt e 3 para ler o código da linha atual. ";
    text += "Pressione Alt 4 para executar pelo código. ";
    text += "Pressione Alt e 5 para ler a mensagem de erro. ";
    text += "Pressione Alt e 6 para criar uma nova linha em branco abaixo da linha atual.  ";
    text += "Pressione seta para cima e para baixo para navegar pelo código. ";
 
    return text;
}

/* running code */
function run(name){
    console.log(""+name);
    startVoiceText("Executando. ");
    createFile(name, editor.getValue(), 
    function(json){
        executeCode(json.name, showOutput, showError);
    },
    function(){
        showError("Ocorreu um erro inesperado. Tente novamente! ");
    });
}

/* Showing error message */
function showError(msg){
     mesg = getEnhancedMessageLLM(msg.message, function(msg){
        $("#console").html("Mensagem de erro: "+msg);
        startVoiceText("Mensagem de erro: "+msg+". ");
     });
}

/* reading current message show to the user */
function readCurrentMessage(){
    var msg =  $("#console").text();
    if(msg.trim() != "")
      startVoiceText( $("#console").text() + "  ");
    else
        startVoiceText( "Nenhuma mensagem de erro. ");

}

/* Showing output */
function showOutput(msg){
    $("#console").html("Saida "+msg.output);
    startVoiceText("Saida "+msg.output+". ");
  
}

/* checking which cursor is at end line */
function checkEndLine(msg){
    if(msg == undefined)
        msg = "";
    if( editor.getCursorPosition().column ==  editor.session.getLine(currentLine-1).length)
        return true;
    return false;
}
/* checking which cursor is at start line */
function checkStartLine(){

    if( editor.getCursorPosition().column ==  0)
        return true;
    return false;
}
/*setting start file when to focus on editor*/
function focusEditor(){
    editor.gotoLine(currentLine, 0);
}

/* read char when type */
function readCurrentChar(callback){

    var currentCol = editor.getCursorPosition().column-1;
    currentChar = getCurrentChar(currentCol);
    if(currentCol >= 0){
        startVoiceText(currentChar);
    }
   
    callback();
}

/* read char when delete */
function readCurrentChar2(){
   // editor.getCursorPosition().row;
    var currentCol = editor.getCursorPosition().column;
    if(currentCol < 0)
        return;
    currentChar = getCurrentChar(currentCol);
    console.log(currentChar);
    if( (currentChar != "") && (currentChar != undefined)){
        startVoiceText(currentChar);
    }
}

/* getting char at current cursor */
function getCurrentChar(currentCol){

        var selectionRange = editor.getSelectionRange();
        var currentLine = selectionRange.start.row;
        var codeArray = editor.getValue().split("\n");
        var currentChar = codeArray[currentLine][currentCol];
        console.log(currentChar)
        if((currentChar != "") && (currentChar != undefined))
            return parser(currentChar);
        return "";
}
/* reading deleted char */
function readDeletedChar(){
    startVoiceText("Apagado ");
}

/* getting name of classe by public class token */
function getNameClasse(){
   var n = editor.getSession().getValue().split("\n");
   for(let i = 0; i < n.length; i++){
        if(n[i].includes("class")){
            m = n[i].split(" ");
            for(let j = 0; j < m.length; j++){
                if(m[j] == "class"){
                    return m[j+1]!=undefined?m[j+1]:"Main";
                }
            }

        }
   };

   return "Main";
}


function readActivityDescription(){
    startVoiceText("Descrição da atividade " + getOverviewDescription() );
}

function readNextStepHint(){
    getNextStep(steps, editor.getValue(), function(id){
        
        id = parseInt(id);
        console.log(id);
        if(id != NaN)
            startVoiceText("A dica é " +  steps[id-1]);
        else
            startVoiceText("Erro ao gerar dica ");
    });
}