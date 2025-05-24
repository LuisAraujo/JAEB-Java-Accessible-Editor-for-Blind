
var windowReady = false;
var voiceReady = false;
var editor;
var currentLine = 1;

/* event to get key command*/
function checkComando(event){
    console.log(event);
    output = '';

    //show representation button pressed
    if( event.shiftKey)
        output+="<span class='btn'>Shift </span> +";
    if( event.ctrlKey)
        output+="<span class='btn'>Ctrl </span> +";
    
    output+=" <span class='btn'>"+event.key+" </span>";
    $("#comando").html( output );

    //Ctrl + 1 (ler todo o texto)
    if(( event.ctrlKey) && (event.keyCode == 49)){
        startVoiceText( parser(editor.getValue()) );
    }
    //Ctrl + 2 (ler o texto da linha atual)
    if(( event.ctrlKey) && (event.keyCode == 50)){
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
    //key down textarea to call check command
    $("textarea").keydown(checkComando);
    //on focus out fomat code in ace
    $("textarea").focusout(fomatCode);


});

responsiveVoice.OnVoiceReady = function() {
    voiceReady = true;
    CheckLoading();
    startVoiceText("Bem Vindo ao JAEB. Atividade um");
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
    responsiveVoice.speak( text , "Brazilian Portuguese Female");
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

//voice read current line
function readCurrentLine(){
    selectionRange = editor.getSelectionRange();
    var currentLine = selectionRange.start.row;
    codeArray = editor.getValue().split("\n");
    currentLineCode = codeArray[currentLine];
    console.log(currentLineCode);
    startVoiceText(parser(currentLineCode));
}

//go to next line in ace editor
function gotoNextLine(){
    var n = editor.getSession().getValue().split("\n").length; 
    if(currentLine < n)
        currentLine++;
    editor.gotoLine(currentLine);
    editor.focus();
    startVoiceText("Linha "+currentLine);
}
//go to prior line in ace editor
function gotoPriorLine(){
    if(currentLine>1)
        currentLine--;
    editor.gotoLine(currentLine);
    editor.focus();
    startVoiceText("Linha "+currentLine);
}
//call beautify funcion of ace
function fomatCode(){
    beautify.beautify(editor.session);
}