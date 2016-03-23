/**
 * Script
 */

function getCookie(name) {
var cookieValue = null;
if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
}
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
console.log(csrftoken);

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
 
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var accessTokeb = 'CAACEdEose0cBAC1n8ZC9XS4DJtNU79CZBsMFURg66aBhO4vHb71pJpUM6T901lSDcMe5A9xTTj027Pz8dd3Ixarqrx3w116LCH5lAPQ3kW8mTO8qALqO9uAyZCyDmZAfNlBC9E5uMg2sLYX8JpydzY8sWrBIs7IOeFO8ZC8YDxiyGaxslqizL8T6JT8D4kPPGNHrNZA25FKQZDZD';
// Only works after `FB.init` is called
function myFacebookLogin() {
  FB.login(function(){
       getMueller(); 
  }, {scope: 'publish_actions'});
 
}
        
        

function getMueller() {   // calls the first batch of records
	   FB.api("/es.muellert.wieder/feeed",{},function(response) { procBatch(response) } );
}
	
function procBatch(dat) { // handle this batch, request the next batch
     
	   for ( i = 0; i < dat.data.length; i++ ) {
	      procRow(dat.data[i]);  // process this row
	      }
	   if ( typeof(dat.paging) != 'undefined' ) {
	      FB.api(dat.paging.next, {}, function(response){ test2(dat); } );
	      } else {
	      alert("No more records expected");
	      }
	   }

function test2(dat)
{
    for ( i = 0; i < dat.data.length; i++ ) {
	      procRow(dat.data[i]);  // process this row
	      }
}

function procRow(dat)
{
      
        var post={
            FB: 'es.muellert.wieder',
            message: dat['message'],
            created_time: dat['created_time'],
            id: dat['id'],
        }
    
	console.log(dat)
    $.post('/polls/saveFB/', post, function(response){
       /* if(response == 'success') { //alert('Yay!');}
        else{//alert('dump');}*/
    });
   
}
	
function test()
{
    
    
    var person={
        FB: 'es.muellert.wieder',
        Twitter: 'empty',
        Instagram: 'empty',
        forname: 'Thomas',
        surname: 'Mueller',
    }
    
    var post={
        message: 'test',
        id: 11234,
    }
    
    var data={
        FB: 'es.muellert.wieder',
        message: 'test', 
    }
    
    $.post('/polls/savePerson/', person, function(response){
        if(response == 'success') { alert('Yay!');}
        else{alert('dump');}
    });
    
    /*$.post('/polls/saveFB/', data, function(response){
        if(response == 'success') { alert('Yay!');}
        else{alert('dump');}
    });*/
    
  /*  var t={
        message: "This is a test message",
        name: "Maria"
    }
    var x="test"
  console.log("test")
    $.post('/polls/like_category/', t, function(response){
        if(response == 'success') { alert('Yay!');}
        else{alert('dump');}
    });*/
    
}




function initFB(){
	
	
	    FB.init({
	      appId      : '1029051753826790',
	      xfbml      : true,
	      version    : 'v2.5'
	        
	    });
	      
	      
	    FB.ui({
	  method: 'share_open_graph',
	  action_type: 'og.likes',
	  action_properties: JSON.stringify({
	    object:'https://developers.facebook.com/docs/',
	  })
	}, function(response){
	  // Debug response (optional)
	  console.log(response);
	});
  
	  
}

	  (function(d, s, id){
	     var js, fjs = d.getElementsByTagName(s)[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement(s); js.id = id;
	     js.src = "//connect.facebook.net/en_US/sdk.js";
	     fjs.parentNode.insertBefore(js, fjs);
	   }(document, 'script', 'facebook-jssdk'));

