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

  $(window).load( function() {

      windowReady = true;
      $('#voicetestdiv').hide();
      $('#waitingdiv').show();

      playbutton.onclick = function() {
          voiceText();
      };

      stopbutton.onclick = function() {
          responsiveVoice.cancel();
      };

      responsiveVoice.AddEventListener("OnLoad",function(){
          console.log("ResponsiveVoice Loaded Callback") ;
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
    responsiveVoice.speak($('#text').val(), "Brazilian Portuguese Female");
  }


  function stopVoiceText(){
     responsiveVoice.cancel();
  }