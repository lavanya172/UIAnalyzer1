$("body").css("cssText", "margin-left: 400px !important; width: calc(100% - 400px) !important; position:absolute !important; overflow:scroll !important; cursor: pointer !important;");
   
 
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // listen for messages sent from background.js
    if (request.message === 'tabsUpdated!') {
      console.log(request.url); // new url that is navigated to
	  var url1 = chrome.runtime.getURL('config.json');
	  fetch(url1)
			.then((response) => response.json())
			.then((json) => {evaluateItems(json);});
    }
});
 
var trayUrl = chrome.runtime.getURL('tray.html');
console.log(chrome.runtime.getURL('config.json'));
var url = chrome.runtime.getURL('config.json');
fetch(url)
  .then((response) => response.json()) //assuming file contains json
  .then((json) => {evaluateItems(json);});
	
	
	function evaluateButtons(json){
		var buttons = document.getElementsByTagName('button');
		
		var delite_compliant_count = 0;
		var visible_buttons_count = 0;
		var tray_content = "";
		
		for (let i = 0; i < buttons.length; i++) {
		
			let button = buttons[i];
		    if ($(button).is(":visible")){
				var id = button.id;
				if(!id){
					button.id = "button_" + i;
					id = button.id;
				}
				visible_buttons_count++;
				var font_size = window.getComputedStyle(button, null).getPropertyValue('font-size');
				var color = window.getComputedStyle(button, null).getPropertyValue('color');
				var font_weight = window.getComputedStyle(button, null).getPropertyValue('font-weight');
				var backgroundColor = window.getComputedStyle(button, null).getPropertyValue('background-color');
				var height = window.getComputedStyle(button, null).getPropertyValue('height');
				var width = window.getComputedStyle(button, null).getPropertyValue('width');
				
				if(json.button.color.indexOf(color) != -1 && 
				json.button.fontSize.indexOf(font_size) != -1 && 
				json.button.backgroundColor.indexOf(backgroundColor) != -1 && 
				json.button.fontWeight.indexOf(font_weight) != -1 ) {
					var focuselement = "focusElement('"+id+"')";
					var construct_span = '<span style="cursor: pointer; text-decoration: underline;" onclick='+focuselement+'>';
					var delite_compliant = '<p class="he_reset he_card_title">'+ construct_span + button.innerText +' Button</span> is Delite Compliant</p>'
					//tray_content = tray_content + delite_compliant; //Don't add Delite compliant elements
					delite_compliant_count++;
				}else{
					var focuselement = "focusElement('"+id+"')";
					var construct_span = '<span style="cursor: pointer; text-decoration: underline;" onclick='+focuselement+'>';
					var not_delite_compliant = '<p class="he_reset he_card_title">'+ construct_span + button.innerText +' Button</span> is not Delite Compliant</p>'
					tray_content = tray_content + not_delite_compliant;
					var reason = [];
					var recommend = [];
					if(json.button.color.indexOf(color) === -1){
						reason.push("Color is not as per Delite");
						recommend.push("Recommended color is " + color);
					}
					if(json.button.fontSize.indexOf(font_size) === -1){
						reason.push("Font size is not as per Delite");
						recommend.push("Recommended size is " + font_size);
					}
					if(json.button.backgroundColor.indexOf(backgroundColor) === -1){
						reason.push("Background color is not as per Delite");
						recommend.push("Recommended Background color is " + backgroundColor);
					}
					if(json.button.fontWeight.indexOf(font_weight) === -1){
						reason.push("Font weight is not as per Delite");
						recommend.push("Recommended font weight is " + font_weight);
					}
					
					for(var kt=0; kt<reason.length; kt++){
						var message = '<p class="he_reset he_card_text">' + reason[kt] + '</p>' + '<p class="he_reset he_card_text">' +recommend[kt]+'</p>';
						tray_content = tray_content + message;
					}
					
					//helper .class to focus all non delite compliant buttons
					$(button).addClass("ua-focus");
				}
				
				tray_content = tray_content + '<div style="display:block; margin-bottom:24px"></div>';
		    }
		}
		
		takeScreenshot();
		var percent = (delite_compliant_count / visible_buttons_count) * 100;
		var delite_compliant_percent = "<div class='he_card he_reset'><h2 class='he_reset he_card_title'>This UI is " + percent +"% Delite Compliant</h2> </div>"
		$('#he_card_container').append(delite_compliant_percent);	
		$('#he_card_container').append(tray_content);		

	}
	
	function enableFocus(){
		$('.ua-focus').css({'border' : '3px solid red'});
	}
	
	function removeFocus() {
			$('.ua-focus').css({'border' : ''});
	}

	$("body").prepend("<div id='add' class='he_reset' data-omglol='yo' style='width:100%;position:fixed;left:0;top:0;z-index:2000000050;'></div>");
	$("body").append("<div id='ui_analyser_overlay' class='he_overlay'></div>");
						
	$("#add").load(trayUrl, function(){
		// Add the close button
		var he_tray_close = "<div id='he_tray_close' class='he_close_button'>"+
							"<div class='he_close_left'></div>"+
							"<div class='he_close_right'></div>"+
							"</div>";
		$('#he_tray').append(he_tray_close);
	});
	
	$(document).on('click', '#he_tray_close', function(e){ 
		// Close the tray, remove all DOM elements and function handlers
		$('#add').remove();
		$('#he_callout').remove();
		$('.he_overlay').remove();
		$("body").css("cssText", "margin-left: 0 !important; width: 100% !important; position:absolute !important; overflow:scroll !important; cursor: auto !important;");
	});
	
	$(document).on('click','#focus-errors', function(e){	
		enableFocus();
	});
	
	$(document).on('click','#remove-focus', function(e){	
		removeFocus();
	});
	
	$(document).on('click','#word-export', function(e){
		$("#he_card_container").wordExport();
	});
	
	function focusElement(id){
		document.getElementById(id).style.border = "3px solid red";
	}
	
	function takeScreenshot(){
		enableFocus();
		setTimeout(function(){
									chrome.runtime.sendMessage({greeting: "take_screenshot"}, function(response) {
										// console.log('chrome runtime send message called and returned');

										// Show save notification
										//$('#add').append('<div class="he_notification_container"><div class="he_notification">Screenshot saved</div></div>');
										//window.setTimeout(function(){
										//	$('.he_notification_container').fadeOut(1000, function(){
										//		$(this).remove();
										//	});
										//},2000);

									  	window.screenshot = response.farewell;

										// === Crop screenshot ===

										// generate canvas
										$('body').append('<canvas id="crop_canvas" style="display:none; position:fixed; z-index:2147483648;left:0;top:0;"></canvas>');
										var canvas = document.getElementById('crop_canvas');
										var context = canvas.getContext('2d');
										var imageObj = new Image();
										imageObj.src = window.screenshot;
										
										

										// Once image is loaded, then we can get dimensions and use it
										imageObj.onload = function() {
										    // draw cropped image to canvas
											var sourceX = 400 * window.devicePixelRatio;
											var sourceY = 0;
											var sourceWidth = imageObj.width - sourceX;
											var sourceHeight = imageObj.height;
											var destX = 0;
											var destY = 0;
											canvas.width = sourceWidth;
											canvas.height = sourceHeight;
											context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, sourceWidth, sourceHeight); //, destWidth, destHeight
											
											// save image & remove canvas
											var cropped_screenshot = canvas.toDataURL("image/jpg");

											$('#crop_canvas').remove();
											
											var imgtag = "<img class='nonedisplay' src = '"+cropped_screenshot+"' width='500' ></img>";
											$('#he_card_container').append(imgtag);
										}
									});
								}, 50); // timeout time
								
								window.setTimeout(function(){
								removeFocus();
								}, 60); // timeout time
	}

function evaluateItems(json){	
		var keys = [];
		
		for(var k in json) keys.push(k);
		
		var delite_compliant_count = 0;
		var visible_items_count = 0;
		var url = window.location.href;
				
		var tray_content = "";
		
		for(var key in keys){
			
			var ele = document.getElementsByTagName(keys[key]);

		
			var item = keys[key];
			
			for (let i = 0; i < ele.length; i++) {
				if ($(ele[i]).is(":visible")){
					
					var reason = [];
					var recommend = [];
					
					visible_items_count++;
					
					var id = ele[i].id;
					if(!id){
						ele[i].id = item + '_' + i;
						id = ele[i].id;
					}
					
					var label = json[item]["label"];
				
					for(var prop in json[item]){
						
						if(prop === "label") continue;
						
						var config_val = json[item][prop];
						var actual_val = window.getComputedStyle(ele[i], null).getPropertyValue(prop.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase());
						
						if(config_val.indexOf(actual_val) != -1){
							console.log(prop + ' true ' + config_val  + ' - ' + actual_val);
						}else{
							if(reason.length === 0){
								var focuselement = "focusElement('"+id+"')";
								var construct_span = '<span style="cursor: pointer; text-decoration: underline;" onclick='+focuselement+'>';
								var not_delite_compliant = '<p class="he_reset he_card_title">'+ construct_span + ele[i].innerText + ' ' +label+' </span> &nbsp; is not Delite Compliant</p>'
								tray_content = tray_content + not_delite_compliant;
							}
							console.log(prop + ' false ' + config_val + ' - '  + actual_val);
							reason.push(prop + " is not as per Delite");
							recommend.push("Recommended " + prop + " is " + config_val);
							//helper class to focus all non delite compliant elements
							$(ele[i]).addClass("ua-focus");
						}
						
					}
					
					for(var kt=0; kt<reason.length; kt++){
						var message = '<p class="he_reset he_card_text">' + reason[kt] + '</p>' + '<p class="he_reset he_card_text">' +recommend[kt]+'</p>';
						tray_content = tray_content + message;
						tray_content = tray_content + '<div style="display:block; margin-bottom:24px"></div>';
					}
					
					if(reason.length == 0){
						delite_compliant_count++;
					}
					
				}
			}	
		}
		var percent = (delite_compliant_count / visible_items_count) * 100;
		var delite_compliant_percent = "<div class='he_card he_reset'  style='display:block; margin-bottom:24px !important;'><h2 class='he_reset he_card_title'>This UI is " + percent.toFixed(2) +"% Delite Compliant</h2> </div>"
		var page = '<p class="he_reset he_card_text" style="margin-bottom:24px !important; word-break: break-all; color: #5c85c8 !important;">' + 'Page: ' + url + '</p>';
		$('#he_card_container').append(page);	
		$('#he_card_container').append(delite_compliant_percent);	
		$('#he_card_container').append(tray_content);
		
		takeScreenshot();
	}	