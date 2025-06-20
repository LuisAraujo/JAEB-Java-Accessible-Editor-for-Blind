
var windowReady = false;
var voiceReady = false;
var editor;
var currentLine = 1;
var alt = false;
var ctrl = false;
var  autocomplete;
var autocomplete_list = [];
//usando o speech nativo
const synth = window.speechSynthesis;
let msg = new SpeechSynthesisUtterance();
let voices = synth.getVoices();
msg.voice = voices[124];
msg.rate = 1;
msg.pitch = 1;
msg.lang = "pt-BR";
var codecash = '';
var capslook = false;
var menuopcao = [
    {lable: 'execute o código', func: startRunCode }, 
    {lable: 'ler a mensagem de erro', func: readCurrentMessage },
];
var menuactive = false;
var currentOptionMenu = -1;

//array to use in parse for up cases recognition
let arrayCharUpCase = [];
    for (let i = 65; i <= 90; i++) {  // Códigos ASCII de A (65) a Z (90)
        arrayCharUpCase.push(String.fromCharCode(i));
}

//array to use in parse for special characteres recognition
arrayCharSpecials = [];    
arrayCharSpecials.push([" "," espaço. "]);
arrayCharSpecials.push([":"," dois pontos. "]);
arrayCharSpecials.push(["{"," sinal de chave abrindo. "]);
arrayCharSpecials.push(["}"," sinal de chave fechando. "]);
arrayCharSpecials.push(["("," sinal de parentese abrindo. "]);
arrayCharSpecials.push([")"," sinal de parentese fechando. "]);
arrayCharSpecials.push([";"," ponto e vírgula. "]);
arrayCharSpecials.push([";"," ponto.  "]);
arrayCharSpecials.push(["\""," aspas.  "]);
arrayCharSpecials.push(["'"," aspas.  "]);
arrayCharSpecials.push(["é"," e com acento agudo.  "]);
arrayCharSpecials.push(["ó"," o com acento agudo.  "]);


/* event key up*/
function keyupEvent(event){
    if(event.keyCode == 18){
        alt = false;
        editor.setReadOnly(false);
        $("#command-container").hide();
    }else if((event.keyCode == 17) || (event.keyCode == 91)){
        ctrl = false;
        editor.setReadOnly(false);
    }
    if(event.keyCode == 20){
         capslook = event.originalEvent.getModifierState("CapsLock");
        if(!capslook){
            startVoiceText("capslook desativado ");
        }
    }
    codecash = editor.getValue();
}

editorIsFocus = false;

/* event to get key command
https://stackoverflow.com/questions/36693491/multiple-autocomplete-in-ace-js
*/
function checkComando(event){

    const focusedElement = document.activeElement;

    if (focusedElement) {
      if (focusedElement.className == 'ace_text-input') {
            editorIsFocus = true;
            console.log(editorIsFocus);
       }else{
            editorIsFocus = false;
       }
    } 

    if( autocomplete ){
         editor.setReadOnly(true);
         if((event.keyCode == 49) || (event.keyCode == 50) || (event.keyCode == 51)) {
            var word = autocomplete_list[event.keyCode-49];
            replaceLineCode(word);
            setTimeout(function(){editor.setReadOnly(false)}, 1000);
            autocomplete = false;
        }
    }

    showButton(event);
    
    if(event.keyCode == 20){
         capslook = event.originalEvent.getModifierState("CapsLock");
        if(capslook){
           startVoiceText("capslook ativado. ");
        }
    }
    //Alt
    if(event.keyCode == 18){
        alt = true;
        editor.setReadOnly(true);
        $("#command-container").show();
    }else if((event.keyCode == 17) || (event.keyCode == 91)){
        ctrl = true;
    }else{

        //Alt + 1 (ler todo o texto)
        if(( alt ) && (event.keyCode == 49)){
            activeMenu() ;
        }
        //Alt + 2 (ler todo o texto)
        if(( alt ) && (event.keyCode == 50)){
            var code = editor.getValue();
            if(code == "")
                startVoiceText("Código vazio! ");
            else
                startVoiceText( parser(code)  );
        }
        //Alt + 3 (ler o texto da linha atual)
        if(( alt ) && (event.keyCode == 51)){
            var code = editor.getValue();
            if(code == "")
                startVoiceText("Linha vazia! ");
            else
                readCurrentLine();
        }

         //Alt + 4 (ler o texto da linha atual)
        if((event.keyCode == 13) && (editorIsFocus)){
            startVoiceText("nova linha ");
        }

        if((event.keyCode == 13) && (menuactive)){
            console.log("executando");
            menuopcao[currentOptionMenu].func();
        }

        //Alt + 4 (ler o texto da linha atual)
        if(( alt ) && (event.keyCode == 52)){
            startRunCode();
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
        //Ctrl + F
        if((ctrl) && (event.keyCode == 70)){
            //console.log("Ctrl F");
            //busca
            startVoiceText("Procurando ");
            $(".ace_search_field").off("keyup");
            $(".ace_search_field").on("keyup", function(e){
                 //console.log( e )
                if(e.keyCode == 13){
                    var text  = $(".ace_search_counter").text() ;
                    text = text.split(" ");
                    textout = "Econtrados " + text[2] + " elementos. ";
                    if( parseInt( text[2].trim() ) > 0){
                        textout += "Está no elemento "+text[0]+", na  "+ getTextCurrentLine() + ". ";
                    }
                    //console.log( textout )
                    startVoiceText(textout);
                }
            });
        }
        
        if((ctrl) && (event.keyCode == 32)){
            list_autocomplete = [];
            editor.setReadOnly(false);
            var list = $(".ace_autocomplete .ace_line");
            //apenas os 3 primeiros
            for( var i = 0; i < 3; i++){
                children = $(list[i]).children();
                //console.log( children );
                textout = "";
                for(var j = 0 ; j < children.length; j++){
                    if( !$(children[j]).hasClass('ace_rightAlignedText')  )
                       textout+= $(children[j]).text();
                }
                list_autocomplete.push(textout);
            };

            autoComplete( list_autocomplete);
         }

        //End
        if((event.keyCode == 35)){
            startVoiceText("Fim da linha "+ (getCurrentLine() + 1) )
        }

        //home
        if((ctrl) && (event.keyCode == 36)){
            startVoiceText("Inicio o código, linha "+ (getCurrentLine() + 1) )
        }else if((event.keyCode == 36)){
            startVoiceText("Inicio da linha "+ (getCurrentLine() + 1) )
        }
        //del
        if((event.keyCode == 8)){
            readDeletedChar(codecash);
            //readDeletedChar();
        }

        //esc
        if(event.keyCode == 27){
            stopVoiceText();
            autocomplete = false;
            autocomplete_list = [];
            editor.setReadOnly(false);
            menuactive = false;
        }

        //arrow down
        if(event.keyCode == 40){
            if(menuactive){
                 if(currentOptionMenu<menuopcao.length-1)
                    currentOptionMenu++;
                startVoiceText((currentOptionMenu+1) + " " + menuopcao[currentOptionMenu].lable);
            }else{
              gotoNextLine();
            }
        }
           

        //arrow up
        if(event.keyCode == 38){
            if(menuactive){
                if(currentOptionMenu>=0)
                    currentOptionMenu--;
                startVoiceText((currentOptionMenu+1) + " " + menuopcao[currentOptionMenu].lable);
            }else{
             gotoPriorLine();
            }
        }
        
        //arrow right
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

        //arrow left
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
    editor.session.setMode("ace/mode/java");
    document.getElementById('editor').style.color='#000';
    editor.session.on('change', function(delta) {
        var lineno = delta.start.row
        readCurrentChar2();
    });
    beautify = ace.require("ace/ext/beautify"); // get reference to extension
    //remove auto complete
    editor.setBehavioursEnabled(false);
    //editor.enableEstimationTimeout = false
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: false,
        enableLiveAutocompletion: false
    });

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
function startVoiceText(text, rate){
    rate = rate==undefined?1:rate;
    //console.log(rate);
    responsiveVoice.speak( text + " ", "Brazilian Portuguese Female", {rate: rate});
}
/*function startVoiceText(text){

    synth.cancel();
    msg.text = text;
    synth.speak(msg);
}*/

/* stop current voice */
function stopVoiceText(){
    responsiveVoice.cancel();
}

/* translating symbol to text representation */
function parser(text){

    
    for (let i = 0; i < arrayCharSpecials.length; i++) {
        let letra = arrayCharSpecials[i];
        text = text.replaceAll(letra[0], letra[1]);
    }
    
    
    for (let i = 0; i < arrayCharUpCase.length; i++) {
        let letra = arrayCharUpCase[i];
        text = text.replaceAll(letra, letra + " maiusculo. ");
    }


    /*text =text.replaceAll(" "," espaço. ");
    text = text.replaceAll(":"," dois pontos. ");
    text = text.replaceAll("{"," sinal de chave abrindo. ");
    text = text.replaceAll("}"," sinal de chave fechando. ");
    text =text.replaceAll("("," sinal de parentese abrindo. ");
    text =text.replaceAll(")"," sinal de parentese fechando. ");
    text =text.replaceAll(";"," ponto e vírgula. ");
    text =text.replaceAll(";"," ponto.  ");
    text =text.replaceAll("\""," aspas.  ");
    text =text.replaceAll("'"," aspas.  ");*/

  
    return text;
}

/*voice read current line*/
function readCurrentLine(){
    var lineCode = getNumberAndTextOfCurrentLine();
    startVoiceText("Linha "+ (lineCode[0]+1) + " " +parser(lineCode[1]));
}

/*voice read current line*/
function getTextCurrentLine(){
    var lineCode = getNumberAndTextOfCurrentLine();
    return "Linha "+ (lineCode[0]+1) + " " +parser(lineCode[1]);
}

/* get code of current line */
function getTextOfCurrentLine(){
    selectionRange = editor.getSelectionRange();
    var currentLine = selectionRange.start.row;
    codeArray = editor.getValue().split("\n");
    currentLineCode = codeArray[currentLine];
    return currentLineCode;
}

/* get code of current line */
function getNumberAndTextOfCurrentLine(){
    selectionRange = editor.getSelectionRange();
    var currentLine = selectionRange.start.row;
    codeArray = editor.getValue().split("\n");
    currentLineCode = codeArray[currentLine];
    return [currentLine , currentLineCode];
}


/* get code of current line */
function getCurrentLine(){
    selectionRange = editor.getSelectionRange();
    var currentLine = selectionRange.start.row;
    return currentLine;
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

     var lineCode = getTextOfCurrentLine();
    if(isEmptyLine(lineCode))
        startVoiceText("Linha "+ (currentLine+1) +". Aviso: está linha esta vazia! ");
    else
        readCurrentLine();//startVoiceText("Linha "+(currentLine+1));

   
}
/*go to prior line in ace editor*/
function gotoPriorLine(){
    //if(currentLine>1)
      //  currentLine--;
    currentLine =  editor.getCursorPosition().row;
    editor.gotoLine(currentLine+1);
    editor.focus();

    var lineCode = getTextOfCurrentLine();
    if(isEmptyLine(lineCode))
        startVoiceText("Linha "+(currentLine+1) +". Aviso está linha esta vazia!");
    else
        readCurrentLine();//startVoiceText("Linha "+(currentLine+1));
}
/* call beautify funcion of ace*/
function fomatCode(){
    beautify.beautify(editor.session);
}

function activeMenu(){
    startVoiceText("Menu ativo ");
    menuactive = true;
}
/* get text menu OLD */
function getMenu(){
    
    text = "Lista de comandos. ";
    text = "Pressione Esc para cancelar ";
    text += "Pressione Alt e 2 para ler todo o código. ";
    text += "Pressione Alt e 3 para ler o código da linha atual. ";
    text += "Pressione Alt 4 para executar pelo código. ";
    text += "Pressione Alt e 5 para ler a mensagem de erro. ";
    text += "Pressione Alt e 6 para ler a descrição d atividade.  ";
    text += "Pressione Alt e 7 para obter a próxima dica.  ";
    text += "Pressione seta para cima e para baixo para navegar pelo código. ";
    text += "Pressione Control e F para pesquisar um nome ";
    text += "Pressione Control e Esppaço para ter sugestões de autocompletar ";

    return text;
}

/* running code */
function run(name){

    startVoiceText("Executando. ");
    var code = editor.getValue();
    if(code.trim() == ""){
        startVoiceText("Não pode executar sem código! ");
        return;
    }

    createFile(name, code, 
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

    $("#console").html("Executado com Sucesso! Saida "+msg.output);
    startVoiceText("Executado com Sucesso!  Saida "+msg.output+". ");
  
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


/* read char when type */
function readDeletedChar(codecash){
   
    var currentCol = editor.getCursorPosition().column;
    var selectionRange = editor.getSelectionRange();
    var currentLine = selectionRange.start.row;
    var codeArray = codecash.split("\n");
    var currentChar = codeArray[currentLine][currentCol];
    //console.log(codeArray[currentLine][currentCol] )
    if(currentChar != undefined)
        startVoiceText("Apagado " + parser(currentChar));
    else
        startVoiceText("Apagado espaço");
}

/* read char when delete */
function readCurrentChar2(){
   // editor.getCursorPosition().row;
    var currentCol = editor.getCursorPosition().column;
    if(currentCol < 0)
        return;
    currentChar = getCurrentChar(currentCol);
    if(currentChar.includes("espaço"))
        readLastWordTyped();
    else if( (currentChar != "") && (currentChar != undefined)){
        startVoiceText(currentChar);
    }
}

/* getting char at current cursor */
function getCurrentChar(currentCol){

        var selectionRange = editor.getSelectionRange();
        var currentLine = selectionRange.start.row;
        var codeArray = editor.getValue().split("\n");
        var currentChar = codeArray[currentLine][currentCol];
        ////console.log(currentChar)
        if((currentChar != "") && (currentChar != undefined))
            return parser(currentChar);
        return "";
}
/* reading deleted char 
function readDeletedChar(){
    startVoiceText("Apagado ");
}
*/
/* getting name of classe by public class token */
function getNameClasse(){
   var n = editor.getSession().getValue().split("\n");
   for(let i = 0; i < n.length; i++){
        if(n[i].includes("class")){
            m = n[i].split(" ");
            for(let j = 0; j < m.length; j++){
                if(m[j] == "class"){    
                    classname = m[j+1];
                    if( classname != undefined){
                        classname = classname.replaceAll("{","");
                        return classname;
                    }else{
                        return "Main";
                    }
                    
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
       // //console.log(id);
        if(id != NaN)
            startVoiceText("A dica é " +  steps[id-1]);
        else
            startVoiceText("Erro ao gerar dica ");
    });
}


function autoComplete(list){ 
    autocomplete = true;
    autocomplete_list = list;
    text = "Sugestões: ";
    for(var i = 0; i < list.length; i++){
        text += (i+1) +" - "+list[i]+". ";
    };
    text += " ";
    
    startVoiceText(text,0.5);
}

function replaceLineCode(word){

    var currentLine = getTextOfCurrentLine();
    var replaceWords = '';
    var currentCol = editor.getCursorPosition().column-1;

    for(var i = currentCol; i >= 0; i--){
        if(currentLine[i] == " ")
            break;
        replaceWords = currentLine[i]+replaceWords;
    }
    currentLine = currentLine.replace(replaceWords, word);
    var Range = require("ace/range").Range
    var row = editor.selection.lead.row;
    editor.session.replace(new Range(row, 0, row, Number.MAX_VALUE), currentLine);

}

function readLastWordTyped(){
    var number = getCurrentLine();
    var lines = editor.getValue().split("\n");
    var line = lines[number].split(" ");
    var lastWord = line[line.length-2];
    startVoiceText(lastWord + " espaço ");
    console.log(line);
}


function startRunCode(){
    classname = getNameClasse();
    run(  classname );
    $("#name-file").text(classname+".java");
}