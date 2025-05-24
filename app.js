window.addEventListener("keypress", checkComando);
function checkComando(event){
    console.log(event)
    output = '';
    if( event.shiftKey)
        output+="<span class='btn'>Shift </span> +";
    if( event.ctrlKey)
        output+="<span class='btn'>Ctrl </span> +";
    output+=" <span class='btn'>"+event.key+" </span>";
    $("#comando").html( output );

    //Exemplo: comando Shift + 1 (ler o texto)
    if(( event.shiftKey) && (event.keyCode == 33)){
        startVoiceText();
    }

     if(event.keyCode == 27){
        stopVoiceText();
     }
}


 var windowReady = false;
  var voiceReady = false;
 var editor;
  $(window).load( function() {

    editor = ace.edit("editor");
    editor.setTheme("ace/theme/clouds");
    editor.setShowPrintMargin(false);
    editor.session.setMode("ace/mode/python");
    document.getElementById('editor').style.color='#000';

      windowReady = true;
      $('#voicetestdiv').hide();
      $('#waitingdiv').show();

     

      responsiveVoice.AddEventListener("OnLoad",function(){
          console.log("ResponsiveVoice Loaded Callback") ;
      });

      $("#voicecode").click(function(){
        startVoiceText();
      });

  });

  responsiveVoice.OnVoiceReady = function() {
      voiceReady = true;
      CheckLoading();
  }


function CheckLoading() {
      if (voiceReady && windowReady) {
          $('#voicetestdiv').fadeIn(0.5);
          $('#waitingdiv').fadeOut(0.5);
      } 
  }


  function startVoiceText(){
    responsiveVoice.speak( parser( editor.getValue() ) , "Brazilian Portuguese Female");
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