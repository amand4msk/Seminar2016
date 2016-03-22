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
	   FB.api("/es.muellert.wieder/posts",{},function(response) { procBatch(response) } );
}
	
function procBatch(dat) { // handle this batch, request the next batch
	   for ( i = 0; i < dat.data.length; i++ ) {
	      procRow(dat.data[i]);  // process this row
	      }
	  /* if ( typeof(dat.paging) != 'undefined' ) {
	      FB.api(dat.paging.next, {}, function(response){ procBatch(dat); } );
	      } else {
	      alert("No more records expected");
	      }*/
	   }

function procRow(dat)
{
	console.log(dat)
    $.post('/polls/like_category/', dat, function(response){
        if(response == 'success') { alert('Yay!');}
        else{alert('dump');}
    });
   
}
	
function test()
{
  /*var catid;
    catid = $(this).attr("data-catid");
     $.get('/polls/like_category/', {category_id: catid}, function(data){
               $('#like_count').html(data);
               $('#likes').hide();
           });
    */
    
    $.post('/polls/like_category/', dat, function(response){
        if(response == 'success') { alert('Yay!');}
        else{alert('dump');}
    });
    
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

