
var windowReady = false;
var voiceReady = false;
var editor;
var currentLine = 1;


function checkComando(event){
    console.log(event);
    output = '';
    
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

   
    $(this).trigger("focus");

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
    console.log(beautify);


    windowReady = true;
    $('#voicetestdiv').hide();
    $('#waitingdiv').show();

    responsiveVoice.AddEventListener("OnLoad",function(){
        console.log("ResponsiveVoice Loaded Callback") ;
    });

    $("#voicecode").click(function(){
        startVoiceText( parser(editor.getValue()) );
    });


    $(window).keydown(checkComando);

    $("textarea").keydown(checkComando);
    $("textarea").focusout(fomatCode);


});

responsiveVoice.OnVoiceReady = function() {
    voiceReady = true;
    CheckLoading();
    startVoiceText("Bem Vindo ao JAEB. Atividade um");
}

function CheckLoading() {
      if (voiceReady && windowReady) {
          $('#voicetestdiv').fadeIn(0.5);
          $('#waitingdiv').fadeOut(0.5);
      } 
  }


function startVoiceText(text){
    responsiveVoice.speak( text , "Brazilian Portuguese Female");
}


function stopVoiceText(){
    responsiveVoice.cancel();
}

function parser(text){
    text = text.replace("{"," sinal de chave abrindo. ");
    text = text.replace("}"," sinal de chave fechando. ");
    text =text.replace("("," sinal de parentese abrindo. ");
    text =text.replace(")"," sinal de parentese fechando. ");
    text =text.replace(";"," ponto e vírgula. ");
    text =text.replace(";"," ponto.  ");

    return text;
}

function readCurrentLine(){
    selectionRange = editor.getSelectionRange();
    var currentLine = selectionRange.start.row;
    codeArray = editor.getValue().split("\n");
    currentLineCode = codeArray[currentLine];
    console.log(currentLineCode);
    startVoiceText(parser(currentLineCode));
}

function gotoNextLine(){
    var n = editor.getSession().getValue().split("\n").length; 
    if(currentLine < n)
        currentLine++;
    editor.gotoLine(currentLine);
    editor.focus();
    startVoiceText("Linha "+currentLine);
}

function gotoPriorLine(){
    if(currentLine>1)
        currentLine--;
    editor.gotoLine(currentLine);
    editor.focus();
    startVoiceText("Linha "+currentLine);
}

function fomatCode(){
    beautify.beautify(editor.session);
}