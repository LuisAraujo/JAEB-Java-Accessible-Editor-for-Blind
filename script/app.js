
var windowReady = false;
var voiceReady = false;
var editor;
var currentLine = 1;
var alt = false;


/* event key up*/
function keyupEvent(event){
    console.log("up", event.keyCode)
    if(event.keyCode == 18){
        alt = false;
          editor.setReadOnly(false);
    }
}

/* event to get key command*/
function checkComando(event){

    showButton(event);
    
    //Alt
    if(event.keyCode == 18){
        alt = true;
        console.log("focus...")
        editor.setReadOnly(true);
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
        console.log("", lineno)
    });
    beautify = ace.require("ace/ext/beautify"); // get reference to extension

    windowReady = true;
    $('#voicetestdiv').hide();
    $('#waitingdiv').show();

    responsiveVoice.setDefaultVoice("Brazilian Portuguese Female");

    //adding event onloand to responsive voice
    responsiveVoice.AddEventListener("OnLoad",function(){
        console.log("ResponsiveVoice Loaded Callback") ;
    });

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
    $("textarea").focusout(fomatCode);


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
    console.log("called");
    responsiveVoice.speak( text);
}

/* stop current voice */
function stopVoiceText(){
    responsiveVoice.cancel();
}

/* translating symbol to text representation */
function parser(text){
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

/* */
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
    if(currentLine < n)
        currentLine++;
    editor.gotoLine(currentLine);
    editor.focus();

     var lineCode = getCurrentLine();
    if(isEmptyLine(lineCode))
        startVoiceText("Linha "+currentLine +". Aviso: está linha esta vazia! ");
    else
        startVoiceText("Linha "+currentLine);

   
}
/*go to prior line in ace editor*/
function gotoPriorLine(){
    if(currentLine>1)
        currentLine--;
    editor.gotoLine(currentLine);
    editor.focus();

    var lineCode = getCurrentLine();
    if(isEmptyLine(lineCode))
        startVoiceText("Linha "+currentLine +". Aviso está linha esta vazia!");
    else
        startVoiceText("Linha "+currentLine);
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


function run(){
    startVoiceText("Executando. ");
    createFile(editor.getValue(), 
    function( json){
        executeCode(json.name, showOutput, showError);
    },
    function(){
        showErro("Ocorreu um erro inesperado. Tente novamente! ");
    });
}

function showError(msg){
    console.log(msg);
    startVoiceText("Mensagem de erro: "+msg.message+". ");
   
}


function showOutput(msg){
    console.log(msg);
    startVoiceText("Saida: "+msg.output+". ");
  
}