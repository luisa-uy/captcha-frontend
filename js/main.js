var luisaintentos = 0;
var luisamaxintentos = 3;
var luisadialogo = 0;
idimg1 = 0;
idimg2 = 0;
token = '';
function luisaexito(){
	luisadialogo.dialog("destroy");
}
function luisaerror(){
	luisaintentos++;
	$('#p1').val('');
	$('#p2').val('');
	if(luisaintentos == luisamaxintentos){
		luisaexito();
	}
}

function luisagetimagenes(){
	$.ajax({
		url: "http://localhost:5000/api/captcha/",
		type: "GET",
		crossDomain: true,
		async : true,
		dataType: "jsonp",
		jsonpCallback: "captcha",
		error: function (error){
			alert(JSON.stringify(error));
		}
	})
	.done(function(json){
		console.log(json)
		$("#luisaimg1").html('<img src="data:image/png;base64,' + json.captcha.bloques[0].imagen + '"/>');
		$("#luisaimg2").html('<img src="data:image/png;base64,' + json.captcha.bloques[1].imagen + '"/>');
		idimg1 = json.captcha.bloques[0].id;
		idimg2 = json.captcha.bloques[1].id;
		token = json.captcha.token;
	})
	.fail(function(jqXHR, textStatus, errorThrown){
		luisaexito();
	});
}
function luisaenviar(){
	$.ajax({
		url: "http://localhost:5000/api/captcha/",
		type: "POST",
		headers : {
			"Content-Type": "application/json"
		},
		crossDomain: true,
		async : true,
		dataType: "JSON",
		data: JSON.stringify({
			token : token,
			bloques : [
				$('#luisap1').val(),
				$('#luisap2').val()
			]
		})
	})
	.done(function(json){
		if(json.status == 200){
			luisaexito();
		} else{
			luisaerror();
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown){
		luisaexito();
	});
}
function luisaform(logo,url){
	html = '<div id="divluisacaptcha" class="luisamodal">' +
		'<form>';
	
	if(logo == 1){
		html += '<img src="https://mh.udelar.edu.uy/luisa/luisa-theme/luisa_dibujo_mediano.png" />';
	}

	html += '	<table>'+
		'		<tr>'+
		'			<td id="luisaimg1">'+
		'			</td>'+
		'			<td id="luisaimg2">'+
		'			</td>'+
		'		</tr>'+
		'		<tr>'+
		'			<td>'+
		'				<input id="luisap1">'+
		'			</td>'+
		'			<td>'+
		'				<input id="luisap2">'+
		'			</td>'+
		'		</tr>'+
		'		<tr>'+
		'			<td colspan="2">'+
		'				<a href="#" onclick="luisaenviar();return false;">Ok</a>'+
		'			</td>'+
		'		</tr>'+
		'	</table>'+
		'</form>';

	if(url == 1) {
		html += '<a href="https://mh.udelar.edu.uy/luisa/" target="_blank">LUISA Udelar</a>';
	}

	html += '</div>';
	return html;
}
function luisacaptcha(maxintentos, logo, url){
	luisadialogo = $(luisaform(logo, url)).dialog({modal: true, width: 600});
	luisagetimagenes();
}