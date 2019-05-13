$(document).ready(function(){
      
      //Url for api connection.
      let SITE_URL  = 'http://paymoney.techvill.net/api/';
      localStorage.setItem('site_url',SITE_URL);      
      //For Inernet Connection Checking in Mobile Device starts here

      let route        = window.location.pathname.split( '/' );
      let routeParam   = route[3];
      let internetConn = navigator.onLine;
      let token        = localStorage.getItem('token');
      if(internetConn==false && routeParam=='login.html'){
        alert('No Internet Connection!');
        localStorage.removeItem('token');
        return false;
        window.location.href='login.html';
      }else if(internetConn==true && routeParam=='login.html' && token!=null){
        $('#login').css('display','none');
        window.location.href='profile.html';
      }

     //For InernetConnection Checking in Mobile Device ends here
     
    //Login Api requests
    $('#LoginForm').on('submit',function(e){
            e.preventDefault();
            $('.loader').css('display','block');
            $('#login').css('display','none');
            $('.profileDiv').css('display','none');
            let formdata    = new FormData(this);
            let url         = request_url($(this).attr('action'));
            let redirect    = $(this).attr('data-redirect');
            let email       = $('#email').val();
            let password    = $('#password').val();
            if(internetConn==true){
                if(email && password) {
                     $.ajax({
                        url : url,
                        type : "POST",
                        async : false,
                        data : {'email':email,'password':password},
                        dataType : "json",
                        //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                        success:function(data){
                            if(data.success.status==200){
                                //$('.loader').css('display','block');
                                //window.localStorage.setItem('available_balance',data.success.available_balance);
                                window.localStorage.setItem('user_id',data.success.user_id);
                                window.localStorage.setItem('token',data.success.token);
                                window.localStorage.setItem('first_name',data.success.first_name);
                                window.localStorage.setItem('last_name',data.success.last_name);
                                window.localStorage.setItem('username',data.success.first_name+' '+data.success.last_name);
                                window.localStorage.setItem('email',data.success.email);
                                window.localStorage.setItem('phone',data.success.email);
                                if(redirect != '')
                                window.location.replace(redirect);
                            }else if(data.success.status==401){
                                window.localStorage.setItem('errorMessage',"Invalid email & credentials ");
                                window.location.replace('login.html');
                            }
                        },
                        error: function(xhr, status, error) {
                            window.localStorage.setItem('errorMessage',"Invalid email & credentials ");
                            window.location.replace('login.html');
                     }
                    });
                }else{
                    //For Loader Show/Hide Starts here
                    $('.loader').css('display','none');
                    $('#login').css('display','block');
                    $('.profileDiv').css('display','block');
                    //For Loader Show/Hide Ends here
                    return false;
                }
            }else{
                alert('No Internet Connection!');
                return false;
            }
     });

     //All Activity Api requests
    $(document).on('click','.all_activity',function(e){
            e.preventDefault();
            localStorage.setItem('url',request_url($(this).attr('action')));
            let  redirect        = $(this).attr('data-redirect');
            window.location.href = redirect;
     });


    //Logout Api requests

    $(document).on('click','.logout',function(e){
             	let url      = request_url($(this).attr('action'));
                let redirect = $(this).attr('data-redirect');
             	 $.ajax({
                    url : url,
                    type : "post",
                    async : false,
                    data : {},
                    processData: false,
                    contentType: false,
                    dataType : 'json',
                    //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                    success:function(data){
                        if(data.success.status==200){
                        	localStorage.removeItem('token');
        		            localStorage.removeItem('first_name');
        		            localStorage.removeItem('last_name');
        		            localStorage.removeItem('username');
        		            localStorage.removeItem('email');
        		            localStorage.removeItem('phone');
        		            localStorage.setItem('successMessage',data.success.message);
                        	if(redirect != '')
                            window.location.replace(redirect);
                        }
                    },
                    error: function(error){
                        console.log(error);
                    }
                });
        
     });

    //Individual Transaction details Api Requests
    $(document).on('click','.transaction_row',function(){
        localStorage.setItem('tr_id',$(this).attr('data-rel'));
        localStorage.setItem('url',request_url($(this).attr('data-redirect')));
        let redirect         = $(this).attr('data-redirect');
        window.location.href = redirect;
    });


     //Available Balance Api Requests

     $(document).on('click','.all_avb',function(){
        let  redirect        = $(this).attr('data-redirect');
        window.location.href = redirect;
    });


     /**Request Money Api block Starts here**/
    
    //Request Money Profile List Click
     $(document).on('click','.RequestMoneyProfile',function(){
        window.location.href = 'request-money-email.html';
     });

     //Request Email validation check Api Requests

     $(document).on('click','.requestNext',function(){
            //For Loader Show/Hide Starts here
            $('.loader').css('display','block !important');
            $('.myDiv').css('display','none');
            //For Loader Show/Hide Ends here
            let  redirect = $(this).attr('data-redirect');
            let  url      = request_url($(this).attr('action'));
            let email     = $('#email').val();
            if(email==''){
                $('.emailValidationMsg').text('This field is required');
                $('.loader').css('display','none');
                $('.myDiv').css('display','block');
                return false;
            }else if(validateEmail(email)==false){
                $('.emailValidationMsg').text('Please enter a valid email');
                $('.loader').css('display','none');
                $('.myDiv').css('display','block');
                return false;
            }
            let token     = localStorage.getItem('token');
            let user_id   = localStorage.getItem('user_id');
            $.ajax({
                    url : url,
                    type : "post",
                    async : false,
                    data : {'email':email,'_token':token,'user_id':user_id},
                    dataType : 'json',
                    //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                    success:function(data){
                        if(data.success.status==200){
                            $('.myDiv').css('display','none');
                            $('.loader').css('display','block');
                            if(redirect != '')
                            localStorage.setItem('hiddenEmail',email);
                            window.location.replace(redirect);
                        }else{
                            $('.loader').css('display','block !important');
                            $('.myDiv').css('display','block');
                            $('.Divs').hide();
                            $('.errorDiv').show();
                            $('.showError').text(data.success.message);
                        }
                    },
                    error: function(error){
                        console.log(error);
                    }
            });
        //window.location.href = redirect;
     });

    //Request Money to Api Requests
     $(document).on('click','.nextMoney',function(){
            let  redirect = $(this).attr('data-redirect');
            let  url      = request_url($(this).attr('action'));
            let email     = $('#hiddenEmail').val();
            let token     = localStorage.getItem('token');
            let user_id   = localStorage.getItem('user_id');
            let amount    = $('#display').val();
            let currency  = $('#currency-button span').html();
            if(amount!='' && (currency!='Choose one' && currency!='&nbsp;')){
                $('#requestAmountCon').html('');
                $('#currencyValidate').html('');
                currency         = $('#currency').val(); 
                var currencyCode = $('#currency-button span').html();
                localStorage.setItem('currency',currency);
                localStorage.setItem('currencyCode',currencyCode);
                localStorage.setItem('amount',amount);
                window.location.href=redirect;
            }else{
                if(amount=='' || amount!=''){
                    if(amount==''){
                        $('#requestAmountCon').html('This field is required');
                    }else{
                        $('#requestAmountCon').html('');
                    }
                }
                if((currency=='Choose one' || currency=='&nbsp;' || currency!='')){
                    if((currency=='Choose one' || currency=='&nbsp;')){
                        $('#currencyValidate').html('This field is required');
                    }else{
                        $('#currencyValidate').html('');
                    }
                }
                return false;
            }
     });


     //Request Money Pay Api Requests
     $(document).on('click','.requestMoneyPay',function(){
            //console.log("ok");return false;
            let email      = localStorage.getItem('hiddenEmail');
            let amount     = localStorage.getItem('amount');
            let currencyId = localStorage.getItem('currency');
            let user_id    = localStorage.getItem('user_id');
            let note       = $('#notes').val();
            let token      = localStorage.getItem('token');
            let redirect   = $(this).attr('data-redirect');
            let url        = request_url($(this).attr('action'));
            if(note!=''){
                $.ajax({
                        url : url,
                        type : "post",
                        async : false,
                        data : {'email':email,'_token':token,'user_id':user_id,'amount':amount,'currencyId':currencyId,'note':note},
                        dataType : 'json',
                        //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                        success:function(data){
                            if(data.success.status==200){
                               window.location.replace(redirect);
                            }
                        },
                        error: function(error){
                            console.log(error);
                        }
                });
            }else{
                $('#requestNote').html('This field is required!');
                return false;
            }
      });

     /**Request Money block Api Ends here**/

     /**Send Money Block Api Starts here**/

     
     //Send Money Profile List Click
     $(document).on('click','.SendMoneyProfile',function(){
        window.location.href = 'send-money-email.html';
     });

      //Send Email validation check Api Requests
     $(document).on('click','.sendNext',function(){
            //For Loader Show/Hide Starts here
            $('.loader').css('display','block !important');
            $('.myDiv').css('display','none');
            //For Loader Show/Hide Ends here
            let  redirect = $(this).attr('data-redirect');
            let  url      = request_url($(this).attr('action'));
            let email     = $('#email').val();
            if(email==''){
                $('.emailValidationMsg').text('This field is required');
                $('.loader').css('display','none');
                $('.myDiv').css('display','block');
                return false;
            }else if(validateEmail(email)==false){
                $('.emailValidationMsg').text('Please enter a valid email');
                $('.loader').css('display','none');
                $('.myDiv').css('display','block');
                return false;
            }
            let token     = localStorage.getItem('token');
            let user_id   = localStorage.getItem('user_id');
            $.ajax({
                    url : url,
                    type : "post",
                    async : false,
                    data : {'email':email,'_token':token,'user_id':user_id},
                    dataType : 'json',
                    //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                    success:function(data){
                        $('.loader').css('display','block !important');
                        if(data.success.status==200){
                            $('.myDiv').css('display','none');
                            $('.loader').css('display','block');
                            if(redirect != '')
                            localStorage.setItem('hiddenEmail',email);
                            window.location.replace(redirect);
                        }else{
                            $('.loader').css('display','block !important');
                            $('.myDiv').css('display','block');
                            $('.Divs').hide();
                            $('.errorDiv').show();
                            $('.showError').text(data.success.message);
                        }
                    },
                    error: function(error){
                        console.log(error);
                    }
            });
     });

     //Send Money to Api Requests
     $(document).on('click','.sendMoney',function(){
            let  redirect = $(this).attr('data-redirect');
            let token     = localStorage.getItem('token');
            let user_id   = localStorage.getItem('user_id');
            var amount    = $('#sendDisplay').val();
            var currency  = $('#sendCurrency-button span').html();
            var url       = SITE_URL+'amount-limit-check';
            if(amount!='' && (currency!='Choose one' && currency!='&nbsp;')){
                $('#amountValidate').html('');
                $('#currencyValidate').html('');
                currency         = $('#sendCurrency').val();
                var currencyCode = $('#sendCurrency-button span').html();
                localStorage.setItem('currency',currency);
                localStorage.setItem('currencyCode',currencyCode);
                localStorage.setItem('amount',amount);
                if(localStorage.getItem('amount')){
                        $.ajax({
                            url : url,
                            type : "post",
                            async : false,
                            data : {'_token':token,'amount':amount,'currency_id':currency,'user_id':user_id},
                            dataType : 'json',
                            //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                            success:function(data){
                                if(data.success.status==200){
                                   window.location.href=redirect;
                                }else{
                                   alert(data.success.message); return false;
                                }
                            },
                            error: function(error){
                                console.log(error);
                            }
                        });
                }
            }else{
                if(amount=='' || amount!=''){
                    if(amount==''){
                        $('#amountValidate').html('This field is required');
                    }else{
                        $('#amountValidate').html('');
                    }
                }
                if((currency=='Choose one' || currency=='&nbsp;' || currency!='')){
                    if((currency=='Choose one' || currency=='&nbsp;')){
                        $('#currencyValidate').html('This field is required');
                    }else{
                        $('#currencyValidate').html('');
                    }
                }
                return false;
            }
      });

     //Send Money Pay Api Requests
     $(document).on('click','.sendMoneyPay',function(){
            let  redirect = $(this).attr('data-redirect');
            let  url      = request_url($(this).attr('action'));
            let note      = $('#notes').val();
            if(note!=''){
                if(localStorage.getItem('amount')){
                            $.ajax({
                                url : url,
                                type : "post",
                                async : false,
                                data : {
                                    '_token':localStorage.getItem('token'),
                                    'amount':localStorage.getItem('amount'),
                                    'currency_id':localStorage.getItem('currency'),
                                    'totalFees'  :localStorage.getItem('totalFees'),
                                    'user_id'    :localStorage.getItem('user_id'),
                                    'email'      :localStorage.getItem('hiddenEmail')
                                },
                                dataType : 'json',
                                //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                                success:function(data){
                                    if(data.success.status==200){
                                       window.location.href=redirect;
                                       //return true; 
                                    }else{
                                       alert(data.success.message); return false;
                                    }
                                },
                                error: function(error){
                                    console.log(error);
                                }
                            });
                }
            }else{
                $('#sendNote').html('This field is required!');
                return false;
            }

            
      });

     //Back to Profile page after Successful Money Send/Request/Withdraw
     $(document).on('click','.success',function(){
            let  redirect = $(this).attr('data-redirect');
            if(redirect!=''){
                window.location.href=redirect;
            }
            
      });

     /**Send Money Block Api Ends here**/

       
    //Get Profile data api requests

    $(document).on('click','.editProfile',function(){
        window.location.href='edit-profile.html';
    });

    //Submit Profile data for user profile update api requests

    //Send Money Pay Api Requests
     $(document).on('click','.updateProfile',function(){
            //Loader Show/Hide
            $('.loader').css('display','block');
            $('.profileDiv').css('display','none');
            let redirect   = $(this).attr('data-redirect');
            let url        = request_url($(this).attr('action'));
            let first_name = $('.first_name').val();
            let last_name  = $('.last_name').val();
            /*let phone      = $('.phone').val();*/
            let email      = $('.email').val();
            let address    = $('.address').val();
            let city       = $('.city').val();
            let state      = $('.state').val();
            let country_id = $('#country').val();
            let timezone   = $('#timezone').val();
            if(email){
                $.ajax({
                    url : url,
                    type : "post",
                    async : false,
                    data : {
                        '_token'     :localStorage.getItem('token'),
                        'first_name' :first_name,
                        'last_name'  :last_name,
                        'address'    :address,
                        'city'       :city,
                        'state'      :state,
                        'user_id'    :localStorage.getItem('user_id'),
                        'email'      :email,
                        'country_id' :country_id,
                        'timezone'   :timezone
                    },
                    dataType : 'json',
                    //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                    success:function(data){
                        if(data.success.status==200){
                           $('.loader').css('display','none');
                           $('.profileDiv').css('display','block');
                           $('.successDiv').show();
                           $('.showSuccess').text('Profile Information Successfully Updated');
                           $(".alert-success").fadeTo(2000, 500).slideUp(500, function(){
                                $(".alert-success").slideUp(500);
                         });
                        }
                    },
                    error: function(error){
                        console.log(error);
                    }
                });
            }

            
      });

     //Dashboard Menu Redirect
     $(document).on('click','.dashboard',function(){
        window.location.replace('profile.html');
     });

     //Exchange Money  to other currency Starts 
    
     $(document).on('click','.exchangeMoney',function(){
        window.location.href = 'exchange-money.html';
     });

    $(document).on('click','.to_other_currency',function(){
        let  redirect        = $(this).attr('data-redirect');
        window.location.href = redirect;
    });


    $(document).on('click','.exchangeMoneyToOther',function(){
            let  redirect = $(this).attr('data-redirect');
            let token     = localStorage.getItem('token');
            let user_id   = localStorage.getItem('user_id');
            var amount    = $('#sendDisplay').val();
            var currency  = $('#sendCurrency-button span').html();
            var url       = SITE_URL+'amount-limit-check-exchange-to-other';
            if(amount!='' && (currency!='Choose one' && currency!='&nbsp;')){
                $('#amountExchangeValidate').html('');
                $('#currencyValidate').html('');
                currency         = $('#sendCurrency').val(); 
                var currencyCode = $('#sendCurrency-button span').html();
                localStorage.setItem('currency',currency);
                localStorage.setItem('currencyCode',currencyCode);
                localStorage.setItem('amount',amount);
                if(localStorage.getItem('amount')){
                        $.ajax({
                            url : url,
                            type : "post",
                            async : false,
                            data : {'_token':token,'amount':amount,'currency_id':currency,'user_id':user_id},
                            dataType : 'json',
                            //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                            success:function(data){
                                if(data.success.status==200){
                                   window.location.href=redirect;
                                }else{
                                   alert(data.success.message); return false;
                                }
                            },
                            error: function(error){
                                console.log(error);
                            }
                        });
                }
            }else{
                if(amount=='' || amount!=''){
                    if(amount==''){
                        $('#amountExchangeValidate').html('This field is required');
                    }else{
                        $('#amountExchangeValidate').html('');
                    }
                }
                if((currency=='Choose one' || currency=='&nbsp;' || currency!='')){
                    if((currency=='Choose one' || currency=='&nbsp;')){
                        $('#currencyValidate').html('This field is required');
                    }else{
                        $('#currencyValidate').html('');
                    }
                }
                return false;
            }
    });


    $(document).on('click','.exchangeMoneyPay',function(){
        let redirect = $(this).attr('data-redirect');
        let url      = request_url($(this).attr('action'));
        $.ajax({
            url : url,
            type : "post",
            async : false,
            data : {'_token':localStorage.getItem('token'),'amount':localStorage.getItem('amount'),'currency_id':localStorage.getItem('currency'),'user_id':localStorage.getItem('user_id'),'totalFees':localStorage.getItem('totalFees')},
            dataType : 'json',
            //data may contain three part status of 'success', 'message', 'errors' if success is 0 
            success:function(data){
                if(data.success.status==200){
                   window.location.href=redirect;
                   //return true; 
                }else{
                   alert(data.success.message); return false;
                }
            },
            error: function(error){
                console.log(error);
            }
        });
    });

    //Exchange Money to other currency Ends

    //Exchange Money to Base Currency Starts here
    $(document).on('click','.to_base_currency',function(){
        let  redirect        = $(this).attr('data-redirect');
        window.location.href = redirect;
    });

    $(document).on('click','.exchangeMoneyToBase',function(){
            let  redirect = $(this).attr('data-redirect');
            let token     = localStorage.getItem('token');
            let user_id   = localStorage.getItem('user_id');
            let amount    = $('#sendDisplay').val();
            let currency  = $('#sendCurrency-button span').html();
            let url       = SITE_URL+'amount-limit-check-exchange-to-base';
            if(amount!='' && (currency!='Choose one' && currency!='&nbsp;')){
                $('#amountExchangeBase').html('');
                $('#currencyValidate').html('');
                currency         = $('#sendCurrency').val(); 
                let currencyCode = $('#sendCurrency-button span').html();
                localStorage.setItem('currency',currency);
                localStorage.setItem('currencyCode',currencyCode);
                localStorage.setItem('amount',amount);
                if(localStorage.getItem('amount')){
                        $.ajax({
                            url : url,
                            type : "post",
                            async : false,
                            data : {'_token':token,'amount':amount,'currency_id':currency,'user_id':user_id},
                            dataType : 'json',
                            //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                            success:function(data){
                                if(data.success.status==200){
                                   window.location.href=redirect;
                                }else{
                                   alert(data.success.message); return false;
                                }
                            },
                            error: function(error){
                                console.log(error);
                            }
                        });
                }
            }else{
                if(amount=='' || amount!=''){
                    if(amount==''){
                        $('#amountExchangeBase').html('This field is required');
                    }else{
                        $('#amountExchangeBase').html('');
                    }
                }
                if((currency=='Choose one' || currency=='&nbsp;' || currency!='')){
                    if((currency=='Choose one' || currency=='&nbsp;')){
                        $('#currencyValidate').html('This field is required');
                    }else{
                        $('#currencyValidate').html('');
                    }
                }
                return false;
            }
    });


    $(document).on('click','.exchangeMoneyBasePay',function(){
        let redirect = $(this).attr('data-redirect');
        let url      = request_url($(this).attr('action'));
        $.ajax({
            url : url,
            type : "post",
            async : false,
            data : {'_token':localStorage.getItem('token'),'amount':localStorage.getItem('amount'),'currency_id':localStorage.getItem('currency'),'user_id':localStorage.getItem('user_id'),'totalFees':localStorage.getItem('totalFees')},
            dataType : 'json',
            //data may contain three part status of 'success', 'message', 'errors' if success is 0 
            success:function(data){
                if(data.success.status==200){
                   window.location.href=redirect;
                   //return true; 
                }else{
                   alert(data.success.message); return false;
                }
            },
            error: function(error){
                console.log(error);
            }
        });
    });

    //Exchange Money to other currency ends here

    //Withdraw Money Api Request Starts here
    $(document).on('click','.withdrawMoney',function(){
        window.location.href = 'withdraw-money.html';
    });

    $(document).on('click','.withdrawMoneyConfirm',function(){
            let  redirect = $(this).attr('data-redirect');
            let token     = localStorage.getItem('token');
            let user_id   = localStorage.getItem('user_id');
            var amount    = $('#sendDisplay').val();
            var currency  = $('#sendCurrency-button span').html();
            var pm        = $('#paymentmethod-button span').html();
            var url       = SITE_URL+'amount-limit-check-withdraw-money';
            if(amount!='' && (pm!='Choose one' && pm!='&nbsp;') && (currency!='Choose one' && currency!='&nbsp;')){
                $('#payoutAmntValidate').html('');
                $('#paymentValidate').html('');
                $('#currencyValidate').html('');
                currency         = $('#sendCurrency').val(); 
                var payoutSetId  = $('#paymentmethod').val();
                var currencyCode = $('#sendCurrency-button span').html();
                localStorage.setItem('payout_setting_id',payoutSetId);
                localStorage.setItem('paymentmethodinfo',pm);
                localStorage.setItem('currency',currency);
                localStorage.setItem('currencyCode',currencyCode);
                localStorage.setItem('amount',amount);
                if(localStorage.getItem('amount')){
                        $.ajax({
                            url : url,
                            type : "post",
                            async : false,
                            data : {'_token':token,'amount':amount,'currency_id':currency,'user_id':user_id},
                            dataType : 'json',
                            //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                            success:function(data){
                                if(data.success.status==200){
                                   window.location.href=redirect;
                                }else{
                                   alert(data.success.message); return false;
                                }
                            },
                            error: function(error){
                                console.log(error);
                            }
                        });
                }
            }else{
                if(amount==''|| amount!=''){
                    if(amount==''){
                      $('#payoutAmntValidate').html('This field is required');
                    }else{
                      $('#payoutAmntValidate').html('');
                    }
                }
                if(pm=='Choose one' || pm=='&nbsp;' || pm!=''){
                    if(pm=='Choose one' || pm=='&nbsp;'){
                        $('#paymentValidate').html('This field is required');
                    }else{
                        $('#paymentValidate').html('');
                    }
                }
                if(currency=='Choose one' || currency=='&nbsp;' || currency!=''){
                    if(currency=='Choose one' || currency=='&nbsp;'){
                        $('#currencyValidate').html('This field is required');
                    }else{
                         $('#currencyValidate').html('');
                    }
                }
                return false;
            }
    });

    $(document).on('click','.withdrawMoneyPay',function(){
        let redirect = $(this).attr('data-redirect');
        let url      = request_url($(this).attr('action'));
        //alert(localStorage.getItem('paymentmethodinfo'));
        $.ajax({
            url : url,
            type : "post",
            async : false,
            data : {'_token':localStorage.getItem('token'),'paymentmethodinfo':localStorage.getItem('paymentmethodinfo'),'payout_setting_id':localStorage.getItem('payout_setting_id'),'amount':localStorage.getItem('amount'),'currency_id':localStorage.getItem('currency'),'user_id':localStorage.getItem('user_id'),'totalFees':localStorage.getItem('totalFees')},
            dataType : 'json',
            //data may contain three part status of 'success', 'message', 'errors' if success is 0 
            success:function(data){
                if(data.success.status==200){
                   window.location.href=redirect;
                   //return true; 
                }else{
                   alert(data.success.message); return false;
                }
            },
            error: function(error){
                console.log(error);
            }
        });
     });
    //Withdraw Money Api request Ends here

    //Accept Request Payment Starts here
    
    $(document).on('click','.acceptrequest',function(){
        let tr_ref_id        = $('.accept').attr('data-id');
        let action           = $('.accept').attr('action');
        localStorage.setItem('tr_ref_id',tr_ref_id);
        localStorage.setItem('action',action);
        window.location.href = 'accept-money-email.html';
    });
    $(document).on('click','.requestPaymentNext',function(){
        window.location.href = 'request-payment-confirm.html';
    });

    $(document).on('click','.requestPaymentReview',function(){
        let  redirect   = $(this).attr('data-redirect');
        let amount      = $('#display').val();
        let currency_id = $('#currency_id').val();
        let currency    = $('#currency').val();
        let url         = SITE_URL+'request-accept-amount-limit-check';
        localStorage.setItem('currency_id',currency_id);
        localStorage.setItem('currencyCode',currency);
        localStorage.setItem('amount',amount);
        if(amount){
                //alert('test');return false;
                $.ajax({
                    url : url,
                    type : "post",
                    async : false,
                    data : {'_token':localStorage.getItem('token'),'amount':amount,'currency_id':currency_id,'user_id':localStorage.getItem('user_id')},
                    dataType : 'json',
                    //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                    success:function(data){
                        //alert(data.success.message);
                        if(data.success.status==200){
                           window.location.href=redirect;
                           //return true; 
                        }else{
                           alert(data.success.message); return false;
                        }
                    },
                    error: function(error){
                        console.log(error);
                    }
                });
        }
    });

    $(document).on('click','.acceptRequestPaymentPay',function(){
            let  redirect    = $(this).attr('data-redirect');
            let token        = localStorage.getItem('token');
            let user_id      = localStorage.getItem('user_id');
            let amount       = localStorage.getItem('amount');
            let currency_id  = localStorage.getItem('currency_id');
            let totalFees    = localStorage.getItem('totalFees');
            let  url         = request_url($(this).attr('action'));;
                if(amount){
                        //alert('test');return false;
                        $.ajax({
                            url : url,
                            type : "post",
                            async : false,
                            data : {'_token':token,'tr_ref_id':localStorage.getItem('tr_ref_id'),'amount':amount,'currency_id':currency_id,'user_id':user_id,'totalFees':totalFees},
                            dataType : 'json',
                            //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                            success:function(data){
                                if(data.success.status==200){
                                   window.location.href=redirect;
                                   //return true; 
                                }else{
                                   alert(data.success.message); return false;
                                }
                            },
                            error: function(error){
                                console.log(error);
                            }
                        });
                }
    });

    $(document).on('click','.cancelrequest',function(){
        let  redirect   = $(this).attr('data-redirect');
        let  url        = request_url($(this).attr('action'));
        let  tr_id      = $(this).attr('data-id');
        $.ajax({
            url : url,
            type : "post",
            async : false,
            data : {'_token':localStorage.getItem('token'),'tr_id':tr_id},
            dataType : 'json',
            //data may contain three part status of 'success', 'message', 'errors' if success is 0 
            success:function(data){
                if(data.success.status==200){
                   window.location.href=redirect;
                }else{
                   alert(data.success.message); return false;
                }
            },
            error: function(error){
                console.log(error);
            }
        });
    });
    //Accept Request Payment Ends here
    //Get Specific User details
    $(window).on('load',function(){
            let user_id   = localStorage.getItem('user_id');
            let email     = localStorage.getItem('email');
            $('.username').text(localStorage.getItem('username'));
            $('.userphone').text(localStorage.getItem('phone'));
            //$('.av_blance').text(localStorage.getItem('available_balance'));
            $.ajax({
                url : localStorage.getItem('site_url')+'get-user-specific-details',
                type : "get",
                async : false,
                data : {'email':email,'_token':localStorage.getItem('token')},
                dataType : 'json',
                //data may contain three part status of 'success', 'message', 'errors' 
                success:function(data){
                    if(data.success.status==200){
                        if(data.success.user==null || data.success.user.picture==''){
                            let src       = 'images/author.png';
                            $('.image_src').attr('src',src);
                        }else{
                            let src       = SITE_URL.replace('api/','')+'public/user_dashboard/profile/'+data.success.user.picture;
                            $('.image_src').attr('src',src);
                        }
                    }
                },
                error: function(error){
                    console.log(error);
                }
            });
    });

    //Custom Email Validation
    function validateEmail(email){
       var re    = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       if(re.test(String(email).toLowerCase())){
            return true;        
        }else{
           return false; 
        } 
    } 
    //Request url making using action parameter
    function request_url(val){
        return SITE_URL+val;
    }

    //Menu Item dynamically loaded from html file
    $('#menuItem').load('menu.html');      
});

