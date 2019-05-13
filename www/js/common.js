//Check Session starts here
   $(window).bind('load click',function(){
     if(localStorage.getItem('token')==null){
       window.location.href='login.html';
     }
   });
//Check Session ends here   

//Format number starts here
function formatNumber(amount){
    amount  = parseInt(amount).toFixed(2) + '';
    x       = amount.split('.');
    x1      = x[0];
    x2      = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
//Format number starts here
