'use strict';

const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows()
		);
	},
};

if (isMobile.any()) {
	document.body.classList.add('_touch');

	let menuArrows = document.querySelectorAll('.menu__arrow');
	if (menuArrows.length > 0) {
		for (let index = 0; index < menuArrows.length; index++) {
			const menuArrow = menuArrows[index];
			menuArrow.addEventListener('click', function (e) {
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}
} else {
	document.body.classList.add('_pc');
}

// burger menu
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
	iconMenu.addEventListener('click', function (e) {
		
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}

// scroll on click
const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach((menuLink) => {
		menuLink.addEventListener('click', onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (
			menuLink.dataset.goto &&
			document.querySelector(menuLink.dataset.goto)
		) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue =
				gotoBlock.getBoundingClientRect().top +
				pageYOffset -
				document.querySelector('.header').offsetHeight;

			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');

				// auto close sub-menu
				if (
					menuBody.dataset.sub_menu_auto_close &&
					document.body.classList.contains('_touch')
				) {
					let menuArrows = document.querySelectorAll('.menu__arrow');
					for (let index = 0; index < menuArrows.length; index++) {
						menuArrows[index].parentElement.classList.remove('_active');
					}
				}
			}

			window.scrollTo({
				top: gotoBlockValue,
				behavior: 'smooth',
			});
			e.preventDefault();
		}
	}
}

function showHideMenu()
{
	document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
}

function selectOption(number)
{
	console.log("selected: "+number);
	selectPageToShow(number);
	showHideMenu();
}

function selectPageToShow(option)
{
	var gastro_div = document.getElementById("Gastro");
	var match_div = document.getElementById("Match");
	var sub_header=document.getElementById("sub_header");
	
	switch(option)
	{
		case 1: 
			sub_header.textContent="Partido";
			gastro_div.style.display = "none";
			gastro_div.style.visibility= "hidden";
			match_div.style.display = "block";
			match_div.style.visibility= "visible";
			
			loadMatchInfoOnline();
			
			break;
		case 2: 
			sub_header.textContent="Gastronomía";
			document.getElementById("Match").style.display = "none";
			document.getElementById("Match").style.visibility= "hidden";
			document.getElementById("loading_div").style.display = "none";
			document.getElementById("loading_div").style.visibility= "hidden";
			document.getElementById("no_info_div").style.display = "none";
			document.getElementById("no_info_div").style.visibility= "hidden";
			gastro_div.style.display = "block";
			gastro_div.style.visibility= "visible";
			break;
	}
}
//var match_footer=document.getElementById("match_footer");

function refreshInfo()
{
	console.log("refreshInfor barruan");
	document.getElementById("no_info_div").style.display = "none";
	document.getElementById("no_info_div").style.visibility= "hidden";
	loadMatchInfoOnline();
}

function loadMatchInfoOnline()
{

  let req = new XMLHttpRequest();

	req.onreadystatechange = () => {
	if (req.readyState == XMLHttpRequest.DONE) {
		match_info= JSON.parse(req.responseText);
		
		is_data=match_info.record.info;
		result=match_info.record.result;
		home_lineup=match_info.record.home_team_lineup;
		away_lineup=match_info.record.away_team_lineup;
		home_sustitutions=match_info.record.home_team_substitution;
		away_sustitutions=match_info.record.away_team_substitution;
		substitutions=match_info.record.substitutions;
		home_subs=match_info.record.home_subs;
		away_subs=match_info.record.away_subs;
		if(is_data)
		{
			updateMatchInfo();
			document.getElementById("Match").style.display = "block";
			document.getElementById("Match").style.visibility= "visible";
			document.getElementById("loading_div").style.display = "none";
			document.getElementById("loading_div").style.visibility= "hidden";
			document.getElementById("no_info_div").style.display = "none";
			document.getElementById("no_info_div").style.visibility= "hidden";
		}
			
		else
		{
			console.log("no hay datos buenos");
			document.getElementById("Match").style.display = "none";
			document.getElementById("Match").style.visibility= "hidden";
			document.getElementById("loading_div").style.display = "none";
			document.getElementById("loading_div").style.visibility= "hidden";
			document.getElementById("no_info_div").style.display = "block";
			document.getElementById("no_info_div").style.visibility= "visible";
			
			
		}
	}
	};

	req.open("GET", "https://api.jsonbin.io/v3/b/65e5e98e266cfc3fde932cbe/latest", true);
	req.setRequestHeader("X-Master-Key", "$2b$10$aqLoNM2SWW0od0YY6OM/8efN9M6q3Y6FYMtoRw/XAgpi0tsqAqDcS");
	req.setRequestHeader("X-Access-Key", "$2b$10$w1mfmBTC4zY7j6OHY0R8d.3nMCS6kEfSTqqoEPPAdoS3yqcGqzmWu");
	req.send(); 

	document.getElementById("no_info_div").style.display = "none";
	document.getElementById("no_info_div").style.visibility= "hidden";
	document.getElementById("Match").style.display = "none";
	document.getElementById("Match").style.visibility= "hidden";
	document.getElementById("loading_div").style.display = "block";
	document.getElementById("loading_div").style.visibility= "visible";

}

function updateMatchInfo()
{
	//Update Result
	document.getElementById("result_span").textContent = result;
	//Update HomeLineup
	document.getElementById("rs_lin_num_1").textContent = home_lineup[0].dorsal;
	document.getElementById("rs_lin_name_1").textContent = home_lineup[0].name;
	document.getElementById("rs_lin_num_2").textContent = home_lineup[1].dorsal;
	document.getElementById("rs_lin_name_2").textContent = home_lineup[1].name;
	document.getElementById("rs_lin_num_3").textContent = home_lineup[2].dorsal;
	document.getElementById("rs_lin_name_3").textContent = home_lineup[2].name;
	document.getElementById("rs_lin_num_4").textContent = home_lineup[3].dorsal;
	document.getElementById("rs_lin_name_4").textContent = home_lineup[3].name;
	document.getElementById("rs_lin_num_5").textContent = home_lineup[4].dorsal;
	document.getElementById("rs_lin_name_5").textContent = home_lineup[4].name;
	document.getElementById("rs_lin_num_6").textContent = home_lineup[5].dorsal;
	document.getElementById("rs_lin_name_6").textContent = home_lineup[5].name;
	document.getElementById("rs_lin_num_7").textContent = home_lineup[6].dorsal;
	document.getElementById("rs_lin_name_7").textContent = home_lineup[6].name;
	document.getElementById("rs_lin_num_8").textContent = home_lineup[7].dorsal;
	document.getElementById("rs_lin_name_8").textContent = home_lineup[7].name;
	document.getElementById("rs_lin_num_9").textContent = home_lineup[8].dorsal;
	document.getElementById("rs_lin_name_9").textContent = home_lineup[8].name;
	document.getElementById("rs_lin_num_10").textContent = home_lineup[9].dorsal;
	document.getElementById("rs_lin_name_10").textContent = home_lineup[9].name;
	document.getElementById("rs_lin_num_11").textContent = home_lineup[10].dorsal;
	document.getElementById("rs_lin_name_11").textContent = home_lineup[10].name;
	//Update AwayLineup
	document.getElementById("away_lin_num_1").textContent = away_lineup[0].dorsal;
	document.getElementById("away_lin_name_1").textContent = away_lineup[0].name;
	document.getElementById("away_lin_num_2").textContent = away_lineup[1].dorsal;
	document.getElementById("away_lin_name_2").textContent = away_lineup[1].name;
	document.getElementById("away_lin_num_3").textContent = away_lineup[2].dorsal;
	document.getElementById("away_lin_name_3").textContent = away_lineup[2].name;
	document.getElementById("away_lin_num_4").textContent = away_lineup[3].dorsal;
	document.getElementById("away_lin_name_4").textContent = away_lineup[3].name;
	document.getElementById("away_lin_num_5").textContent = away_lineup[4].dorsal;
	document.getElementById("away_lin_name_5").textContent = away_lineup[4].name;
	document.getElementById("away_lin_num_6").textContent = away_lineup[5].dorsal;
	document.getElementById("away_lin_name_6").textContent = away_lineup[5].name;
	document.getElementById("away_lin_num_7").textContent = away_lineup[6].dorsal;
	document.getElementById("away_lin_name_7").textContent = away_lineup[6].name;
	document.getElementById("away_lin_num_8").textContent = away_lineup[7].dorsal;
	document.getElementById("away_lin_name_8").textContent = away_lineup[7].name;
	document.getElementById("away_lin_num_9").textContent = away_lineup[8].dorsal;
	document.getElementById("away_lin_name_9").textContent = away_lineup[8].name;
	document.getElementById("away_lin_num_10").textContent = away_lineup[9].dorsal;
	document.getElementById("away_lin_name_10").textContent = away_lineup[9].name;
	document.getElementById("away_lin_num_11").textContent = away_lineup[10].dorsal;
	document.getElementById("away_lin_name_11").textContent = away_lineup[10].name;
	//Update HomeSubs
	document.getElementById("rs_sust_number1").textContent = home_sustitutions[0].dorsal;
	document.getElementById("rs_sust_name1").textContent = home_sustitutions[0].name;
	document.getElementById("rs_sust_number2").textContent = home_sustitutions[1].dorsal;
	document.getElementById("rs_sust_name2").textContent = home_sustitutions[1].name;
	document.getElementById("rs_sust_number3").textContent = home_sustitutions[2].dorsal;
	document.getElementById("rs_sust_name3").textContent = home_sustitutions[2].name;
	document.getElementById("rs_sust_number4").textContent = home_sustitutions[3].dorsal;
	document.getElementById("rs_sust_name4").textContent = home_sustitutions[3].name;
	document.getElementById("rs_sust_number5").textContent = home_sustitutions[4].dorsal;
	document.getElementById("rs_sust_name5").textContent = home_sustitutions[4].name;
	document.getElementById("rs_sust_number6").textContent = home_sustitutions[5].dorsal;
	document.getElementById("rs_sust_name6").textContent = home_sustitutions[5].name;
	document.getElementById("rs_sust_number7").textContent = home_sustitutions[6].dorsal;
	document.getElementById("rs_sust_name7").textContent = home_sustitutions[6].name;
	document.getElementById("rs_sust_number8").textContent = home_sustitutions[7].dorsal;
	document.getElementById("rs_sust_name8").textContent = home_sustitutions[7].name;
	document.getElementById("rs_sust_number9").textContent = home_sustitutions[8].dorsal;
	document.getElementById("rs_sust_name9").textContent = home_sustitutions[8].name;
	document.getElementById("rs_sust_number10").textContent = home_sustitutions[9].dorsal;
	document.getElementById("rs_sust_name10").textContent = home_sustitutions[9].name;
	document.getElementById("rs_sust_number11").textContent = home_sustitutions[10].dorsal;
	document.getElementById("rs_sust_name11").textContent = home_sustitutions[10].name;
	document.getElementById("rs_sust_number12").textContent = home_sustitutions[11].dorsal;
	document.getElementById("rs_sust_name12").textContent = home_sustitutions[11].name;
	//Update AwaySubs
	document.getElementById("away_sust_number1").textContent = away_sustitutions[0].dorsal;
	document.getElementById("away_sust_name1").textContent = away_sustitutions[0].name;
	document.getElementById("away_sust_number2").textContent = away_sustitutions[1].dorsal;
	document.getElementById("away_sust_name2").textContent = away_sustitutions[1].name;
	document.getElementById("away_sust_number3").textContent = away_sustitutions[2].dorsal;
	document.getElementById("away_sust_name3").textContent = away_sustitutions[2].name;
	document.getElementById("away_sust_number4").textContent = away_sustitutions[3].dorsal;
	document.getElementById("away_sust_name4").textContent = away_sustitutions[3].name;
	document.getElementById("away_sust_number5").textContent = away_sustitutions[4].dorsal;
	document.getElementById("away_sust_name5").textContent = away_sustitutions[4].name;
	document.getElementById("away_sust_number6").textContent = away_sustitutions[5].dorsal;
	document.getElementById("away_sust_name6").textContent = away_sustitutions[5].name;
	document.getElementById("away_sust_number7").textContent = away_sustitutions[6].dorsal;
	document.getElementById("away_sust_name7").textContent = away_sustitutions[6].name;
	document.getElementById("away_sust_number8").textContent = away_sustitutions[7].dorsal;
	document.getElementById("away_sust_name8").textContent = away_sustitutions[7].name;
	document.getElementById("away_sust_number9").textContent = away_sustitutions[8].dorsal;
	document.getElementById("away_sust_name9").textContent = away_sustitutions[8].name;
	document.getElementById("away_sust_number10").textContent = away_sustitutions[9].dorsal;
	document.getElementById("away_sust_name10").textContent = away_sustitutions[9].name;
	document.getElementById("away_sust_number11").textContent = away_sustitutions[10].dorsal;
	document.getElementById("away_sust_name11").textContent = away_sustitutions[10].name;
	document.getElementById("away_sust_number12").textContent = away_sustitutions[11].dorsal;
	document.getElementById("away_sust_name12").textContent = away_sustitutions[11].name;
	//CheckSubstitutions
	if(substitutions)
		loadSubstitutionsInfo();


}
function loadSubstitutionsInfo()
{
	
	document.getElementById("sus_Info_Div").style.display = "block";
	document.getElementById("sus_Info_Div").style.visibility= "visible";
	document.getElementById("sus_Bot_Sep").style.display = "block";
	document.getElementById("sus_Bot_Sep").style.visibility= "visible";
	document.getElementById("sus_Play_Div").style.display = "block";
	document.getElementById("sus_Play_Div").style.visibility= "visible";
	if(home_subs.length>0)
		populateSubs("home_sub_list",home_subs);
	if (away_subs.length>0)
		populateSubs("away_sub_list",away_subs);

}
function populateSubs(html_item,list)
{
	var html="";
	for(var i=0; i<list.length;i++)
	{
		html="";
		var elem=list[i];
		html="<div class='player_div'>"+
				"<div class='sub_minute_div'>"+
					"<span class='number_span'>"+elem.minute+"</span>"+
				"</div>"+
				"<div class='sub_info_div'>"+
					"<div>"+
						"<div class='number_sub_div'>"+
							"<span class='number_span'>"+ elem.player1nu+"</span>"+
					"</div>"+
					"<div class='name_sub_div'>"+
						"<span class='name_span' >"+elem.player1na+"</span>"+
					"</div>"+
				"</div>"+
				"<div>"+
				"<div class='number_sub_div'>"+
					"<span class='number_span'>"+elem.player2nu+"</span>"+
				"</div>"+
				"<div class='name_sub_div'>"+
					"<span class='name_span'>"+elem.player2na+"</span>"+
				"</div>"+
			"</div>"+
		"</div>"+
		"</div>";
		document.getElementById(html_item).innerHTML += html;
	}
}

var match_info;
var result;
var home_lineup;
var home_sustitutions;
var home_subs=[];
var away_lineup;
var away_sustitutions;
var away_subs=[];
var is_data;
var substitutions;
