  $("#hideandexpand").click(function() {
    if ($('#hideandseek').css('display')!='none')
    {
      $('#hideandseek').hide();
      $('#map').removeClass('col-xs-9');
      $('#map').addClass('col-xs-11');
    }
    else
    {
      $('#hideandseek').show();
      $('#map').removeClass('col-xs-11');
      $('#map').addClass('col-xs-9');
    }
  });
