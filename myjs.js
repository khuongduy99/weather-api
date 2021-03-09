		$(document).ready(function(){
		  $("#input-search").val("saigon");
		  searchByYourCity('not use enter key');

		  
		});

		$("#input-search").on('keypress', function (e) {
			searchByYourCity(e);
		});

		$("#submit-search").click(function () {
			searchByYourCity('not use enter key');
		});

		function searchByYourCity(e) {
			var yourCity = $("#input-search").val();

			if(e === 'not use enter key') {
				getCurrenWeather(yourCity);
			} else {
				if(e.which === 13){
					getCurrenWeather(yourCity);
	        	}
			}
			
		}

		function getCurrenWeather(yourCity) {
			var url = "https://api.openweathermap.org/data/2.5/weather?q="+yourCity+"&lang=vi&appid=04e7cab8aad69342c877a74f5efaef68&units=metric";
			$.ajax({
			    url: url,
			    type: "get",
			    dataType: "json",
   				 complete: function(xhr, textStatus) {
        			if(xhr.status == 404) {
        				alert('Không tìm thấy tên thành phố bạn cần.');
        			}
    			}
			}).done(function(res) {
				var temp = Math.ceil(parseFloat(res.main.temp));
				var temp_max = Math.ceil(parseFloat(res.main.temp_max));
				var temp_min = Math.ceil(parseFloat(res.main.temp_min));
				var feel_like = Math.ceil(parseFloat(res.main.feels_like));
				var humidity = res.main.humidity;
				var wind = Math.ceil(parseFloat(res.wind.speed));
				var city = res.name;
				var country = res.sys.country;
				var icon = res.weather[0].icon;
				var urlBgImg = '';
				if(icon == '09d' || icon == '09n' || icon == '10d' || icon == '10n' || icon == '11d' || icon == '11n') {
					urlBgImg = "rain.jpg";
				} else if(icon == '01d' || icon == '01n' || icon == '02d' || icon == '02n' || icon == '03d' || icon == '03n' || icon == '04d' || icon == '04n') {
					urlBgImg = "normal.jpg";
				} else {
					urlBgImg = "snow.jpg";
				}
				

				var d = new Date();
				var days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
				
				if(icon.includes("d")) {
					$(".switch").prop('checked', true);
					checkMode();
					$("body").css("background-image", "url('bg/" + urlBgImg +"')");
				} else if(icon.includes("n")){
					$(".switch").prop('checked', false);
					$("body").css("background-image", "linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url('bg/" + urlBgImg +"')")
					checkMode();
				}
				
				$("#label-temperature").text(temp + "°C");
				$("#temp_max").text(temp_max + "°C");
				$("#temp_min").text(temp_min + "°C");
				$("#feel_like").text(feel_like + "°C");
				$("#humidity").text(humidity + "%");
				$("#wind").text(wind + " km/h");
				$("#label-city").text(city);
				$("#label-date").text(days[d.getDay()] + ", " + d.getDate() + "-" +( d.getMonth() + 1) + "-" + d.getFullYear() + " " + formatHours(d.getHours(), d.getMinutes()));
				$("#icon-curren-weather").attr("src", "icon-weather/" + icon + ".svg");

				var des = capitalizeFirstLetter(res.weather[0].description);
				$("#label-description").text(des);
				getNextWeather(res.name);
			});
		}

		function getNextWeather(yourCity) {
			var url = "https://api.openweathermap.org/data/2.5/forecast?q="+yourCity+"&lang=vi&appid=04e7cab8aad69342c877a74f5efaef68&units=metric";
			$.ajax({
			    url: url,
			    type: "get",
			    dataType: "json",
   				 complete: function(xhr, textStatus) {
        			if(xhr.status == 404) {
        				alert('Không tìm thấy tên thành phố bạn cần.');
        			}
    			}
			}).done(function(res) {
				var nowdate = new Date();
				var limit = 1;

				
				for(var i = 0; i < 40; i++) {
					if(limit == 7)  break;
					var txt_dt = res.list[i].dt_txt;
					var dt_inWeather = new Date(txt_dt.split(" ")[0]);
					dt_inWeather.setHours(parseInt(txt_dt.split(" ")[1].split(":")[0]));
					if(nowdate.getTime() <= dt_inWeather.getTime()) {
						$("#next_time_" + limit + " .next_time").text(formatHours(dt_inWeather.getHours(),0));
						$("#next_time_" + limit + " .next_time_icon img").attr("src", "icon-weather/" + res.list[i].weather[0].icon + ".svg");
						$("#next_time_" + limit + " .next_time_hum").text(res.list[i].main.humidity + "%");
						$("#next_time_" + limit + " .next_time_temp").text(Math.ceil(parseFloat(res.list[i].main.temp)) + "°C");
						limit++;
					}
					

				}
				limit = 1;
				var days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
				
				for(var i = 0; i < 40; i++) {
					if(limit == 5)  break;
					var txt_dt = res.list[i].dt_txt;
					var dt_inWeather = new Date();
					dt_inWeather.setDate(new Date(txt_dt.split(" ")[0]).getDate()-limit);
					dt_inWeather.setHours(parseInt(txt_dt.split(" ")[1].split(":")[0]));
					if(dt_inWeather.getDate() == nowdate.getDate()) {

						if(parseInt(txt_dt.split(" ")[1].split(":")[0]) == 9) {
							$("#next_day_" + limit + " .next_time").text(days[new Date(txt_dt.split(" ")[0]).getDay()]);
							$("#next_day_" + limit + " .next_time_icon img").attr("src", "icon-weather/" + res.list[i].weather[0].icon + ".svg");
							$("#next_day_" + limit + " .next_time_hum").text(res.list[i].main.humidity + "%");
							$("#next_day_" + limit + " .next_time_temp").text(Math.ceil(parseFloat(res.list[i].main.temp)) + "°C");
						} 
						if(parseInt(txt_dt.split(" ")[1].split(":")[0]) == 21) {
							$("#next_day_" + limit + " .night .next_time_icon img").attr("src", "icon-weather/" + res.list[i].weather[0].icon + ".svg");
							$("#next_day_" + limit + " .night .next_time_hum").text(res.list[i].main.humidity + "%");
							$("#next_day_" + limit + " .night .next_time_temp").text(Math.ceil(parseFloat(res.list[i].main.temp)) + "°C");
							limit++;
						}
					}
					

				}
				
			});
		}

		function removeVietnameseTones(str) {
			    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
			    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
			    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
			    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
			    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
			    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
			    str = str.replace(/đ/g,"d");
			    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
			    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
			    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
			    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
			    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
			    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
			    str = str.replace(/Đ/g, "D");
			    // Some system encode vietnamese combining accent as individual utf-8 characters
			    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
			    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
			    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
			    // Remove extra spaces
			    // Bỏ các khoảng trắng liền nhau
			    str = str.replace(/ + /g," ");
			    str = str.trim();
			    // Remove punctuations
			    // Bỏ dấu câu, kí tự đặc biệt
			    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
			return str;
		}

		function formatHours(hours, minute) {
			if(minute == 0) minute = "00";
			if(minute < 10 && minute > 0) minute = "0" + minute;
			if(hours > 0 && hours < 13) {
				return hours + ":" + minute + " AM"; 
			} else {
				return Math.abs(hours - 12) + ":" + minute + " PM";
			}
		}

		function translateUseApiGG(text, language) {
		    var xhttp = new XMLHttpRequest();
		    xhttp.open("GET", "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" + language + "&dt=t&q=" + text, false);
		    xhttp.send();
		    var response = JSON.parse(xhttp.responseText);
		    return response[0][0][0];
		}

		function capitalizeFirstLetter(string) {
		  return string.charAt(0).toUpperCase() + string.slice(1);
		}

		function checkMode() {
			var bg = $("body").css("background-image");
			bg = bg.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
			if($('.switch').is(":checked")) {
	            $('.card').css("color","#323544");
	            $('.table').css("color","#323544");
	            $('.card').css("background-color","#fcefef");
	            $('.two').css("background","linear-gradient(-45deg,#fcefef calc(50% - 1px), #aaa, #fcefef calc(50% + 1px))");
	        	$('#label-temperature').css("color","#6f707d");
	        	$('body').css("background-image","url('" + bg + "')");
	        	$('#input-search').css("background-color","#fcefef");
	        	$('#input-search').css("color","#07051a");
	        	$('.s-icon').css("color","#07051a");

	        } else {
	        	$('.card').css("color","white");
	        	$('.table').css("color","white");
	        	$('.card').css("background-color","#323544");
	        	$('.two').css("background","linear-gradient(-45deg,#323544 calc(50% - 1px), #aaa, #323544 calc(50% + 1px))");
	        	$('#label-temperature').css("color","#ffc107");
	        	$('body').css("background-image","linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url('" + bg + "')");
	        	$('#input-search').css("background-color","#323544");
	        	$('#input-search').css("color","#ffc107");
	        	$('.s-icon').css("color","white");
	        } 
		}

 	$('.switch').change(function() {
        checkMode();
    });