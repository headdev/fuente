$(document).ready(function(){
  /*let SITE_URL  = 'http://localhost/sourcepaymoney/api/';
  let IMAGE_URL = 'http://localhost/sourcepaymoney/';*/
  let SITE_URL  = 'http://apppaymoney.techvill.net/api/';
  let IMAGE_URL = 'http://apppaymoney.techvill.net/';
  localStorage.setItem('image_url',IMAGE_URL);
  localStorage.setItem('site_url',SITE_URL);
  //alert(SITE_URL);
//let SITE_URL = 'http://apppaymoney.techvill.net/api/';
/*
App-o-Mat jQuery Mobile Cordova starter template
https://github.com/app-o-mat/jqm-cordova-template-project
http://app-o-mat.com

MIT License
https://github.com/app-o-mat/jqm-cordova-template-project/LICENSE.md
*/
/*
	let appomat = {};
	appomat.app = {
	    initialize: function() {
			document.addEventListener('deviceready', this.onDeviceReady, false);
	    },
	    onDeviceReady: function() {
			checkConnection();
	    }
	};

	function checkConnection() {
		let networkState =  navigator.connection.type;
		let states = {};
		
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';
		states[Connection.UNKNOWN]  = 'Unknown connection';
		alert(states[networkState]);
		localStorage.setItem('internet_conn', JSON.stringify(states[networkState]));
	}*/

    $('.birthday-change').on('change', function(){
        let day = $('#day').val();
        let month = $('#month').val();
        let year = $('#year').val();

        if(day != '' && month != '' && year != ''){
            $('#date_of_birth').val(year+'-'+month+'-'+day);
        }
    });

    $('.date-change').on('change', function(){
        let day = $('#day').val();
        let month = $('#month').val();
        let year = $('#year').val();
        let id_name = $(this).attr('data-rel');
        if(day != '' && month != '' && year != ''){
            $('#'+id_name).val(year+'-'+month+'-'+day);
        }
    });

    $('.form-submit-jquery').on('submit', function(e){
        e.preventDefault();
        let formdata = new FormData(this);
        let url = $(this).attr('action');
        let data = ajax_request_formdata(url, formdata);
        let redirect = $(this).attr('data-redirect');
        if(data.success == 1){
            if(data.message){
                show_success_message(data.message);
            }
            if(redirect != '') window.location.replace(redirect);
        }else if(data.success == 0){
            if(data.message) show_error_message(data.message);
            let field_name, message;
            // errors must contain two parameter for each field 'field_name' and 'message'
            $.each(data.errors, function(key, value){
                field_name = key;
                message = value[0];
                set_error_message_below_field(field_name, message);
            })
        
        }
    });

    //ajax request with formdata parameter
    function ajax_request_formdata(post_url, post_data){
        let result;
        $.ajax({
            url : post_url,
            type : "post",
            async : false,
            data : post_data,
            processData: false,
            contentType: false,
            dataType : 'json',
            //data may contain three part status of 'success', 'message', 'errors' if success is 0 
            success:function(data, textStatus, jqXHR){
                remove_all_error_message();
                result = data;
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('Network problem.');
                result = [];
            }
        });
        //alert('result='+result);
        return result;
    };

    function set_error_message_below_field(field_name, message){
        remove_error_message_below_field(field_name);
        $('input[name='+field_name+']').after('<span class="aj-error" id="aj-'+field_name+'" style="color:red">'+message+'</span>');
    }

    function remove_error_message_below_field(field_name){
        $('#aj-'+field_name).remove();
    }

    //ajax request
    function ajax_request(post_url, post_data){
        let result; 
        $.ajax({
            url : post_url,
            type : "post",
            async : false,
            data : post_data,
            dataType : 'json',
            //data must contain two part status of 'success' and 'message'
            success:function(data, textStatus, jqXHR){
                remove_all_error_message();
                result = data;
            },
            error: function(jqXHR, textStatus, errorThrown){
                show_error_message('Network problem.');
                result = [];
            }
        });

        return result;
    };

    function remove_all_error_message(){
        $('.aj-error').remove();
    }

    function remove_individual_error_message(id){
        $('#'+id).remove();
    }

    $('.validate_field').on('keyup change', function(){
        let field_name = '', message = '';
         field_name = $(this).attr('name');  
        if($(this).val() == ''){
            message = 'This field is empty';
            set_error_message_below_field(field_name, message);
        }else{
            remove_error_message_below_field(field_name);
        }
    })

    function show_success_message(message){
        $('#success_message_div').show();
        $('#success_message').html(message);
        $('html, body').animate({scrollTop : 0},800);
        $('#success_message_div').delay(5000).fadeOut('slow');
    };

    function show_error_message(message){
        $('#error_message_div').show();
        $('#error_message').html(message);
        $('html, body').animate({scrollTop : 0},800);
        $('#error_message_div').delay(5000).fadeOut('slow');
    };

    $(document).on('click', '.delete-warning', function(e){
        e.preventDefault();
        let url = $(this).attr('href');
        $('#delete-modal-yes').attr('href', url)
        $('#delete-warning-modal').modal('show');
    });

    function request_url(val){
        return SITE_URL+val;
    }

    function j_encode(val){
        return JSON.stringify(val);
    }

    function j_decode(val){
        return JSON.parse(val);
    }

    //Login Api requests
    //$('#LoginForm').on('submit',function(e){
    $(window).on('load',function(e){
            e.preventDefault();
            //let formdata = new FormData(this);
            //let url      = request_url($(this).attr('action'));
            let url      = SITE_URL+'login';
            //let redirect = $(this).attr('data-redirect');
            let redirect = 'profile.html';
            let email    = $('#email').val();
            let password = $('#password').val();
            /*alert('formdata '+formdata);
            alert('url '+url);
            alert('redirect '+redirect);
            alert('email '+email);
            alert('password '+password);*/
            //if(email && password) {
                 $.ajax({
                    url : url,
                    type : "post",
                    //async : false,
                    data : {
                        'email':'aminul.techvill@gmail.com',
                        'password':'123456'
                    },
                    //processData: false,
                    //contentType: false,
                    dataType : 'json',
                    //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                    success:function(data){
                        if(data.success.status==200){
                            window.localStorage.setItem('available_balance',data.success.available_balance);
                            window.localStorage.setItem('user_id',data.success.user_id);
                            window.localStorage.setItem('token',data.success.token);
                            window.localStorage.setItem('first_name',data.success.first_name);
                            window.localStorage.setItem('last_name',data.success.last_name);
                            window.localStorage.setItem('username',data.success.first_name+' '+data.success.last_name);
                            window.localStorage.setItem('email',data.success.email);
                            window.localStorage.setItem('phone',data.success.email);
                            if(redirect != '')
                            window.location.replace('profile.html');
                        }
                    },
                    error: function(error){
                        //alert('error');return false;
                        //console.log('dssdf');return false;
                        window.localStorage.setItem('errorMessage',"Invalid email & credentials ");
                        window.location.replace('login.html');
                    }
                });
            /*}else{
                return false;
            }*/
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
                //alert('ok');
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
                        	//return false;
                        	if(redirect != '')
                            window.location.replace(redirect);
                            //window.location.href = redirect;
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
        let  redirect        = $(this).attr('data-redirect');
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
            let  redirect = $(this).attr('data-redirect');
            let  url      = request_url($(this).attr('action'));
            let email     = $('#email').val();
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
                            if(redirect != '')
                            localStorage.setItem('hiddenEmail',email);
                            window.location.replace(redirect);
                        }else{
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
            var amount    = $('#display').val();
            var currency  = $('#currency-button span').html();
            if(currency!='Choose one'){
                currency         = $('#currency').val(); 
                var currencyCode = $('#currency-button span').html();
                localStorage.setItem('currency',currency);
                localStorage.setItem('currencyCode',currencyCode);
                localStorage.setItem('amount',amount);
                window.location.href=redirect;
            }else{
                $('#currencyValidate').html('This field is required');
                return false;
            }
      });


     //Request Money Pay Api Requests
     $(document).on('click','.requestMoneyPay',function(){
            let email      = localStorage.getItem('hiddenEmail');
            let amount     = localStorage.getItem('amount');
            let currencyId = localStorage.getItem('currency');
            let user_id    = localStorage.getItem('user_id');
            let note       = $('#notes').val();
            let token      = localStorage.getItem('token');
            let  redirect  = $(this).attr('data-redirect');
            let  url       = request_url($(this).attr('action'));
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
      });

     /**Request Money block Api Ends here**/

     /**Send Money Block Api Starts here**/

     
     //Send Money Profile List Click
     $(document).on('click','.SendMoneyProfile',function(){
        window.location.href = 'send-money-email.html';
     });

      //Send Email validation check Api Requests
     $(document).on('click','.sendNext',function(){
            let  redirect = $(this).attr('data-redirect');
            let  url      = request_url($(this).attr('action'));
            let email     = $('#email').val();
            if(email==''){
                $('.emailValidationMsg').text('This field is required');
                return false;
            }else if(validateEmail(email)==false){
                $('.emailValidationMsg').text('Please enter a valid email');
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
                            if(redirect != '')
                            localStorage.setItem('hiddenEmail',email);
                            window.location.replace(redirect);
                        }else{
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

     //Send Money to Api Requests
     $(document).on('click','.sendMoney',function(){
            let  redirect = $(this).attr('data-redirect');
            let token     = localStorage.getItem('token');
            let user_id   = localStorage.getItem('user_id');
            var amount    = $('#sendDisplay').val();
            var currency  = $('#sendCurrency-button span').html();
            var url       = SITE_URL+'amount-limit-check';
            //alert(url);return false;
            if(currency!='Choose one'){
                currency         = $('#sendCurrency').val(); 
                var currencyCode = $('#sendCurrency-button span').html();
                localStorage.setItem('currency',currency);
                localStorage.setItem('currencyCode',currencyCode);
                localStorage.setItem('amount',amount);
                if(localStorage.getItem('amount')){
                        //alert('test');return false;
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

                //alert('jklfsdksd');return false;
            }else{
                $('#currencyValidate').html('This field is required');
                return false;
            }
      });

     //Send Money Pay Api Requests
     $(document).on('click','.sendMoneyPay',function(){
            let  redirect = $(this).attr('data-redirect');
            let  url      = request_url($(this).attr('action'));
            let note      = $('#notes').val();
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
            let  redirect   = $(this).attr('data-redirect');
            let  url        = request_url($(this).attr('action'));
            let first_name  = $('.first_name').val();
            let last_name   = $('.last_name').val();
            let phone       = $('.phone').val();
            let email       = $('.email').val();
            let phrase      = $('.phrase').val();
            let country_id  = $('#country').val();
            if(email){
                        $.ajax({
                            url : url,
                            type : "post",
                            async : false,
                            data : {
                                '_token'     :localStorage.getItem('token'),
                                'first_name' :first_name,
                                'last_name'  :last_name,
                                'phone'      :phone,
                                'user_id'    :localStorage.getItem('user_id'),
                                'email'      :email,
                                'phrase'     :phrase,
                                'country_id' :country_id

                            },
                            dataType : 'json',
                            //data may contain three part status of 'success', 'message', 'errors' if success is 0 
                            success:function(data){
                                if(data.success.status==200){
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
            //alert(url);return false;
            if(currency!='Choose one'){
                currency         = $('#sendCurrency').val(); 
                var currencyCode = $('#sendCurrency-button span').html();
                localStorage.setItem('currency',currency);
                localStorage.setItem('currencyCode',currencyCode);
                localStorage.setItem('amount',amount);
                if(localStorage.getItem('amount')){
                        //alert('test');return false;
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

                //alert('jklfsdksd');return false;
            }else{
                $('#currencyValidate').html('This field is required');
                return false;
            }
     });


     $(document).on('click','.exchangeMoneyPay',function(){
        let  redirect = $(this).attr('data-redirect');
        let  url      = request_url($(this).attr('action'));
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
            //alert("ok");
            let  redirect = $(this).attr('data-redirect');
            let token     = localStorage.getItem('token');
            let user_id   = localStorage.getItem('user_id');
            let amount    = $('#sendDisplay').val();
            let currency  = $('#sendCurrency-button span').html();
            //alert(currency);
            let url       = SITE_URL+'amount-limit-check-exchange-to-base';
            //alert(url);return false;
            if(currency!='Choose one'){
                currency         = $('#sendCurrency').val(); 
                let currencyCode = $('#sendCurrency-button span').html();
                localStorage.setItem('currency',currency);
                localStorage.setItem('currencyCode',currencyCode);
                localStorage.setItem('amount',amount);
                if(localStorage.getItem('amount')){
                        //alert('test');return false;
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

                //alert('jklfsdksd');return false;
            }else{
                $('#currencyValidate').html('This field is required');
                return false;
            }
     });


     $(document).on('click','.exchangeMoneyBasePay',function(){
        let  redirect = $(this).attr('data-redirect');
        let  url      = request_url($(this).attr('action'));
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
            if(pm!='Choose one'){
                if(currency!='Choose one'){
                    currency         = $('#sendCurrency').val(); 
                    var payoutSetId  = $('#paymentmethod').val();
                    var currencyCode = $('#sendCurrency-button span').html();
                    localStorage.setItem('payout_setting_id',payoutSetId);
                    localStorage.setItem('paymentmethodinfo',pm);
                    localStorage.setItem('currency',currency);
                    localStorage.setItem('currencyCode',currencyCode);
                    localStorage.setItem('amount',amount);
                    if(localStorage.getItem('amount')){
                            //alert('test');return false;
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

                    //alert('jklfsdksd');return false;
                }else{
                    $('#currencyValidate').html('This field is required');
                    return false;
                }
            }else{
                    $('#paymentValidate').html('This field is required');
                    return false;
            }
     });

    $(document).on('click','.withdrawMoneyPay',function(){
        let  redirect = $(this).attr('data-redirect');
        let  url      = request_url($(this).attr('action'));
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
            $('.av_blance').text(localStorage.getItem('available_balance'));
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
                            let src       = localStorage.getItem('image_url')+'public/user_dashboard/profile/'+data.success.user.picture;
                            $('.image_src').attr('src',src);
                        }
                    }
                },
                error: function(error){
                    console.log(error);
                }
            });
    });
    $('html').on('click',function(){
    	let token = localStorage.getItem('token');
    	if(token){
    		if(token!=null){
	    		return true;
	    	}else{
	    		window.location.href='login.html';
	    	}
    	}
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
   
   //alert('In app js');
  
});

