/**
 * Script
 */



var accessTokeb = 'CAACEdEose0cBAC1n8ZC9XS4DJtNU79CZBsMFURg66aBhO4vHb71pJpUM6T901lSDcMe5A9xTTj027Pz8dd3Ixarqrx3w116LCH5lAPQ3kW8mTO8qALqO9uAyZCyDmZAfNlBC9E5uMg2sLYX8JpydzY8sWrBIs7IOeFO8ZC8YDxiyGaxslqizL8T6JT8D4kPPGNHrNZA25FKQZDZD';
// Only works after `FB.init` is called
function myFacebookLogin() {
  FB.login(function(){
       getMueller(); 
  }, {scope: 'publish_actions'});
 
}
        
        

function getMueller() {   // calls the first batch of records
	   FB.api("/es.muellert.wieder/feed",{},function(response) { procBatch(response) } );
}
	
function procBatch(dat) { // handle this batch, request the next batch
	   for ( i = 0; i < dat.data.length; i++ ) {
	      procRow(dat.data[i]);  // process this row
	      }
	   if ( typeof(dat.paging) != 'undefined' ) {
	      FB.api(dat.paging.next, {}, function(response){ procBatch(dat); } );
	      } else {
	      alert("No more records expected");
	      }
	   }

function procRow(dat)
{
	consoloe.log(dat);
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

