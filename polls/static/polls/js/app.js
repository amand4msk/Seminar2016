$(document).ready(function() {
    // show sidebar and overlay
    function showSidebar() {
        sidebar.css('margin-left', '0');

        overlay.show(0, function() {
            overlay.fadeTo('500', 0.5);
        });   
    }

    // hide sidebar and overlay
    function hideSidebar() {
        sidebar.css('margin-left', sidebar.width() * -1+20 + 'px');

        overlay.fadeTo('500', 0, function() {
            overlay.hide();
        });;
    }

    // selectors
    var sidebar = $('[data-sidebar]');
    var button = $('[data-sidebar-button]');
    var overlay = $('[data-sidebar-overlay]');
  

    // add height to content area
    overlay.parent().css('min-height', 'inherit');

    // hide sidebar on load
    sidebar.css('margin-left', '0');

    sidebar.show(0, function() {
        sidebar.css('transition', 'all 0.5s ease');
    });

    

    sidebar.mouseover(function() {
            showSidebar();

    });
    
    sidebar.mouseout(function(){
    	
    	var selectedPersonText = document.getElementById('selectPerson').options[document.getElementById('selectPerson').selectedIndex].text;
    	
    	if(selectedPersonText == '')
    		{
    		return false;
    		}
    	
    	hideSidebar();
    });
    

    
    // toggle sidebar on click
   /* button.click(function() {
        if (overlay.is(':visible')) {
            hideSidebar();
        } else {
            showSidebar();
        }

        return false;
    });
*/

});