"use strict"

//Create a Home object.
function Home( path, layContent )
{
		var self = this;
		var db = null;
		var address = "https://vintage-soft.com/datasync/version.txt";
		var survey = "https://vintage-soft.com/datasync/survey.sqlite";
		var versionChecked = false;
		var version = app.LoadText( "ver", "1.01", "ver" );
		
    //Get page states.
    this.IsVisible = function() { return lay.IsVisible() }
    this.IsChanged = function() { return false }
    
    //Show or hide this page.
    this.Show = function( show )
    {
        if( show ){
        	 lay.Animate("FadeIn");
        	 if(versionChecked == false){
        	 	self.CheckVersion();
        	 }
        } else {
        	 lay.Animate( "FadeOut" );
        }
    }
    
    this.OnResult = function( results )   
{  
    var s = "";  
    var len = results.rows.length;  
    for(var i = 0; i < len; i++ )   
    {  
        var item = results.rows.item(i)  
        s += item.questionnaire;
        //item.id + ", " + item.data + ", " + item.data_num + "\n";   
    }  
    alert(s);
}
    this.CheckVersion = function() {
    app.DeleteFile( "version.txt" )
    	app.DownloadFile( address, app.GetAppPath()+"/version.txt", "Checking version","" );
    	setTimeout(()=>{
    	var v = app.ReadFile( "version.txt" );
    	versionChecked = true;
    	if(v==version){
    		alert("You have the current (" + v +  ") version.");
    	}else{
    		var c = confirm("You have version " + version + " installed. \r\n\r\n" + "The current version is: "+ v + ", do you want to update to this version?");
    		if(c) {
    		app.DownloadFile( survey, app.GetAppPath()+"/survey.sqlite.txt", "Downloading","Survey Database" );
    		app.SaveText( "ver", v, "ver" );
    		setTimeout(()=>{
    		db = app.OpenDatabase(  app.GetAppPath()+"/survey.sqlite.txt" );
    		db.ExecuteSql("SELECT * FROM Questionnaires",[], self.OnResult);
    		}, 3500);
    		 }
    	}
    	}, 3400);
    	
    }
    
    //Create layout for app controls.
    var lay = app.CreateLayout( "Linear", "Top,FillXY,HCenter" );
    lay.Hide();
    layContent.AddChild( lay );
    
    //Add a logo.
	var img = app.CreateImage( "Img/Hello.png", 0.25 );
	lay.AddChild( img );
	
	//Create a text with formatting.
    var text = "<p><font color=#4285F4><big>Welcome</big></font></p>" + 
    "Todo: Put your home page controls here! </p>" + 
    "<p>You can add links too - <a href=https://play.google.com/store>Play Store</a></p>" +
    "<br><br><p><font color=#4285F4><big><big><b>&larr;</b></big></big> Try swiping from the " + 
    "left and choosing the <b>'New File'</b> option</font></p>";
    var txt = app.CreateText( text, 1, -1, "Html,Link" );
    txt.SetPadding( 0.03, 0.03, 0.03, 0.03 );
    txt.SetTextSize( 18 );
    txt.SetTextColor( "#444444" );
    lay.AddChild( txt );
}