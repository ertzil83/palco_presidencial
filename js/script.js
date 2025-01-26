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

				// auto close 
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
			if(selected_language==="es")
				sub_header.textContent="Partido";
			else
			sub_header.textContent="Partidua";
			page="Match";
			gastro_div.style.display = "none";
			gastro_div.style.visibility= "hidden";
			match_div.style.display = "block";
			match_div.style.visibility= "visible";
			
			loadMatchInfoOnline();
			
			break;
		case 2: 
			if(selected_language==="es")
				sub_header.textContent="Gastronomía";
			else
			sub_header.textContent="Gastronomia";
			page="Gastro";
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
		opta=match_info.record.opta;
		opta_match_id=match_info.record.match_id;
		result=match_info.record.result;
		period_es=match_info.record.period_es;
		period_eu=match_info.record.period_eu;
		home_lineup=match_info.record.home_team_lineup;
		away_lineup=match_info.record.away_team_lineup;
		home_sustitutions=match_info.record.home_team_substitution;
		away_sustitutions=match_info.record.away_team_substitution;
		substitutions=match_info.record.substitutions;
		home_subs=match_info.record.home_subs;
		away_subs=match_info.record.away_subs;
		if(is_data)
		{
			if(!opta)
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
				updateMatchInfoFromOpta();
			}
				
			
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

var stats;
var home_playerlist;
var home_teamInfo;
var away_playerlist;
var away_teamInfo;
var teamInfo;
var playerlist;
var opta_match_id;
var sub_array;


function updateMatchInfoFromOpta()
{
	var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      stats= JSON.parse(this.responseText);
      
      home_playerlist=stats.SoccerFeed.SoccerDocument.Team[0].Player;
      home_teamInfo=stats.SoccerFeed.SoccerDocument.MatchData.TeamData[0];
      away_playerlist=stats.SoccerFeed.SoccerDocument.Team[1].Player;
      away_teamInfo=stats.SoccerFeed.SoccerDocument.MatchData.TeamData[1];
      teamInfo=home_teamInfo;
      playerlist=home_playerlist;
	  sub_array=new Array();

	  console.log(stats.SoccerFeed.SoccerDocument.MatchData);
      paintPlayerList();
      document.getElementById("Match").style.display = "block";
	  document.getElementById("Match").style.visibility= "visible";
	  document.getElementById("loading_div").style.display = "none";
	  document.getElementById("loading_div").style.visibility= "hidden";
	  document.getElementById("no_info_div").style.display = "none";
	  document.getElementById("no_info_div").style.visibility= "hidden";
    }
  });
  
 

  
  xhr.open("GET", "https://proxy.cors.sh/https://secure.omo.akamai.opta.net/?game_id="+opta_match_id+"&feed_type=f9&user=RealSociedad&psw=zcgmFn8QFd&json=%22%22");
 xhr.setRequestHeader("x-cors-api-key", "temp_0f6f1cb644c0fa2a982dba14bf025b38");
 xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
  
xhr.send()
}

function paintPlayerList()
{

	var LineUpArray = home_teamInfo.PlayerLineUp.MatchPlayer.slice(1, 11);
	var SubsArray=home_teamInfo.PlayerLineUp.MatchPlayer.slice(11);
	//var sortedLineUpArray = LineUpArray.sort(({age:a}, {age:b}) => b-a);
	let sortedLineUpArray = LineUpArray.sort((a,b) => (parseInt(a["@attributes"].ShirtNumber) < parseInt(b["@attributes"].ShirtNumber)) ? -1 : ((parseInt(b["@attributes"].ShirtNumber) > parseInt(a["@attributes"].ShirtNumber)) ? 1 : 0))
	let sortedSubsArray = SubsArray.sort((a,b) => (parseInt(a["@attributes"].ShirtNumber) < parseInt(b["@attributes"].ShirtNumber)) ? -1 : ((parseInt(b["@attributes"].ShirtNumber) > parseInt(a["@attributes"].ShirtNumber)) ? 1 : 0))
	
	

	//Update Result
	document.getElementById("result_span").textContent = home_teamInfo["@attributes"]["Score"] +" - "+away_teamInfo["@attributes"]["Score"];
	document.getElementById("period_span").textContent = period_es;
	document.getElementById("rs_lin_num_1").textContent = home_teamInfo.PlayerLineUp.MatchPlayer[0]["@attributes"].ShirtNumber;
	document.getElementById("rs_lin_name_1").textContent = getName(home_teamInfo,home_teamInfo.PlayerLineUp.MatchPlayer[0]["@attributes"].PlayerRef);
	document.getElementById("rs_lin_num_2").textContent = sortedLineUpArray[0]["@attributes"].ShirtNumber;
	document.getElementById("rs_lin_name_2").textContent = getName(home_teamInfo,sortedLineUpArray[0]["@attributes"].PlayerRef);
	document.getElementById("rs_lin_num_3").textContent = sortedLineUpArray[1]["@attributes"].ShirtNumber;
	document.getElementById("rs_lin_name_3").textContent = getName(home_teamInfo,sortedLineUpArray[1]["@attributes"].PlayerRef);
	document.getElementById("rs_lin_num_4").textContent = sortedLineUpArray[2]["@attributes"].ShirtNumber;
	document.getElementById("rs_lin_name_4").textContent = getName(home_teamInfo,sortedLineUpArray[2]["@attributes"].PlayerRef);
	document.getElementById("rs_lin_num_5").textContent = sortedLineUpArray[3]["@attributes"].ShirtNumber;
	document.getElementById("rs_lin_name_5").textContent = getName(home_teamInfo,sortedLineUpArray[3]["@attributes"].PlayerRef);
	document.getElementById("rs_lin_num_6").textContent = sortedLineUpArray[4]["@attributes"].ShirtNumber;
	document.getElementById("rs_lin_name_6").textContent = getName(home_teamInfo,sortedLineUpArray[4]["@attributes"].PlayerRef);
	document.getElementById("rs_lin_num_7").textContent = sortedLineUpArray[5]["@attributes"].ShirtNumber;
	document.getElementById("rs_lin_name_7").textContent = getName(home_teamInfo,sortedLineUpArray[5]["@attributes"].PlayerRef);
	document.getElementById("rs_lin_num_8").textContent = sortedLineUpArray[6]["@attributes"].ShirtNumber;
	document.getElementById("rs_lin_name_8").textContent = getName(home_teamInfo,sortedLineUpArray[6]["@attributes"].PlayerRef);
	document.getElementById("rs_lin_num_9").textContent = sortedLineUpArray[7]["@attributes"].ShirtNumber;
	document.getElementById("rs_lin_name_9").textContent = getName(home_teamInfo,sortedLineUpArray[7]["@attributes"].PlayerRef);
	document.getElementById("rs_lin_num_10").textContent = sortedLineUpArray[8]["@attributes"].ShirtNumber;
	document.getElementById("rs_lin_name_10").textContent = getName(home_teamInfo,sortedLineUpArray[8]["@attributes"].PlayerRef);
	document.getElementById("rs_lin_num_11").textContent = sortedLineUpArray[9]["@attributes"].ShirtNumber;
	document.getElementById("rs_lin_name_11").textContent = getName(home_teamInfo,sortedLineUpArray[9]["@attributes"].PlayerRef);
	populateSubHtml("rs_subs_div",sortedSubsArray);

	playerlist=away_playerlist;
	teamInfo=away_teamInfo;
	LineUpArray = away_teamInfo.PlayerLineUp.MatchPlayer.slice(1, 11);
	SubsArray=away_teamInfo.PlayerLineUp.MatchPlayer.slice(11);
	//var sortedLineUpArray = LineUpArray.sort(({age:a}, {age:b}) => b-a);
	let sortedAwayLineUpArray = LineUpArray.sort((a,b) => (parseInt(a["@attributes"].ShirtNumber) < parseInt(b["@attributes"].ShirtNumber)) ? -1 : ((parseInt(b["@attributes"].ShirtNumber) > parseInt(a["@attributes"].ShirtNumber)) ? 1 : 0))
	let sortedAwaySubsArray = SubsArray.sort((a,b) => (parseInt(a["@attributes"].ShirtNumber) < parseInt(b["@attributes"].ShirtNumber)) ? -1 : ((parseInt(b["@attributes"].ShirtNumber) > parseInt(a["@attributes"].ShirtNumber)) ? 1 : 0))
	
	document.getElementById("away_lin_num_1").textContent = away_teamInfo.PlayerLineUp.MatchPlayer[0]["@attributes"].ShirtNumber;
	document.getElementById("away_lin_name_1").textContent = getName(away_teamInfo,away_teamInfo.PlayerLineUp.MatchPlayer[0]["@attributes"].PlayerRef);
	document.getElementById("away_lin_num_2").textContent = sortedAwayLineUpArray[0]["@attributes"].ShirtNumber;
	document.getElementById("away_lin_name_2").textContent = getName(away_teamInfo,sortedAwayLineUpArray[0]["@attributes"].PlayerRef);
	document.getElementById("away_lin_num_3").textContent = sortedAwayLineUpArray[1]["@attributes"].ShirtNumber;
	document.getElementById("away_lin_name_3").textContent = getName(away_teamInfo,sortedAwayLineUpArray[1]["@attributes"].PlayerRef);
	document.getElementById("away_lin_num_4").textContent = sortedAwayLineUpArray[2]["@attributes"].ShirtNumber;
	document.getElementById("away_lin_name_4").textContent = getName(away_teamInfo,sortedAwayLineUpArray[2]["@attributes"].PlayerRef);
	document.getElementById("away_lin_num_5").textContent = sortedAwayLineUpArray[3]["@attributes"].ShirtNumber;
	document.getElementById("away_lin_name_5").textContent = getName(away_teamInfo,sortedAwayLineUpArray[3]["@attributes"].PlayerRef);
	document.getElementById("away_lin_num_6").textContent = sortedAwayLineUpArray[4]["@attributes"].ShirtNumber;
	document.getElementById("away_lin_name_6").textContent = getName(away_teamInfo,sortedAwayLineUpArray[4]["@attributes"].PlayerRef);
	document.getElementById("away_lin_num_7").textContent = sortedAwayLineUpArray[5]["@attributes"].ShirtNumber;
	document.getElementById("away_lin_name_7").textContent = getName(away_teamInfo,sortedAwayLineUpArray[5]["@attributes"].PlayerRef);
	document.getElementById("away_lin_num_8").textContent = sortedAwayLineUpArray[6]["@attributes"].ShirtNumber;
	document.getElementById("away_lin_name_8").textContent = getName(away_teamInfo,sortedAwayLineUpArray[6]["@attributes"].PlayerRef);
	document.getElementById("away_lin_num_9").textContent = sortedAwayLineUpArray[7]["@attributes"].ShirtNumber;
	document.getElementById("away_lin_name_9").textContent = getName(away_teamInfo,sortedAwayLineUpArray[7]["@attributes"].PlayerRef);
	document.getElementById("away_lin_num_10").textContent = sortedAwayLineUpArray[8]["@attributes"].ShirtNumber;
	document.getElementById("away_lin_name_10").textContent = getName(away_teamInfo,sortedAwayLineUpArray[8]["@attributes"].PlayerRef);
	document.getElementById("away_lin_num_11").textContent = sortedAwayLineUpArray[9]["@attributes"].ShirtNumber;
	document.getElementById("away_lin_name_11").textContent = getName(away_teamInfo,sortedAwayLineUpArray[9]["@attributes"].PlayerRef);
	populateSubHtml("away_subs_div",sortedAwaySubsArray);
	
}

function populateSubHtml(name, sortedList)
{
	var result="";
	var line;
  for(var i=0; i< sortedList.length;i++)
  {
	line='<div class="player_div">'+
	'<div class="number_div">'+
		'<span class="number_span" id="away_sust_number1">'+sortedList[i]["@attributes"].ShirtNumber+'</span>'+
	'</div>'+
	'<div class="name_div">'+
		'<span class="name_span" id="away_sust_name1">'+getName(teamInfo,sortedList[i]["@attributes"].PlayerRef)+'</span>'+
	'</div>'+
	'</div>';
	result=result+line;
	
  }
  var div = document.getElementById(name);
 div.innerHTML ="";
 div.innerHTML = result;
}

function getName(selectedTeamInfo,player_id)
{
	
	//var lineup=list.PlayerLineUp.MatchPlayer;
	var result="";
	//var player=selectedTeamInfo.PlayerLineUp.MatchPlayer[id];
	//var player_id=player["@attributes"].PlayerRef;
	var name=getPlayerName(playerlist,player_id);
	result=name+checkSubstitutionsIn(player_id) +checkCards(player_id)+checkGoals(player_id)+checkSubstitutions(player_id);
	return result;
  
}



function getPlayerName(p_list,id)
{
  var name="";
  for (var i = 0; i < p_list.length; i++)
  {
    var player=p_list[i];
    if(id==player["@attributes"].uID)
    {
		
      if(player.PersonName.hasOwnProperty('Known'))
        name=player.PersonName.Known;
      else
        name=(player.PersonName.First).substring(0, 1)+"."+player.PersonName.Last;
      break;
    }
  }
  return name;
}

function checkSubstitutions(id)
{
  var result="";
  var subOnID;
  if(teamInfo.hasOwnProperty('Substitution'))
  {
    var sub_list=teamInfo.Substitution;
    if(Array.isArray(sub_list))
      for (var i = 0; i < sub_list.length; i++)
      {
        if(sub_list[i]["@attributes"].SubOff==id)
        {
          subOnID=sub_list[i]["@attributes"].SubOn;
		  result="🔽";
		  sub_array.push(subOnID);
          //result=" ⇆ "+"<button  class='player_button' onclick='loadPlayerInfo(\"" + subOnID + "\")'>"+getPlayerNumber(subOnID) + " "+ getPlayerName(subOnID) + " "+checkCards(subOnID) +" "+checkGoals(subOnID)+"</button>";
          break;
        }
      }
    else
    {
      if(sub_list["@attributes"].SubOff==id)
        {
          subOnID=sub_list["@attributes"].SubOn;
		  result="🔽";
		  sub_array.push(subOnID);
          //result=" ⇆ "+"<button  class='player_button' onclick='loadPlayerInfo(\"" + subOnID + "\")'>"+getPlayerNumber(subOnID) + " "+ getPlayerName(subOnID) + " "+checkCards(subOnID) +" "+checkGoals(subOnID)+"</button>";
          
        }
    }
    
  }
  return result;
}

function checkSubstitutionsIn(id)
{
	var result="";
	for(var i=0; i<sub_array.length;i++)
	{
		if(id==sub_array[i])
		{
			result="🔼";
			break;
		}
	}
	return result;
}

function checkCards(id)
{
  var result="";
  if(teamInfo.hasOwnProperty('Booking'))
  {
    var book_list=teamInfo.Booking;
    if(Array.isArray(book_list))
    {
      for (var i = 0; i < book_list.length; i++)
      {
        if(book_list[i]["@attributes"].PlayerRef==id)
        {
          if(book_list[i]["@attributes"].Card=="Yellow")
            result=result+"🟨";
          if(book_list[i]["@attributes"].Card=="Red")
            result=result+"🟥";
        }
      }
    }
    else
    {
      if(book_list["@attributes"].PlayerRef==id)
        {
          if(book_list["@attributes"].Card=="Yellow")
            result=result+"🟨";
          if(book_list["@attributes"].Card=="Red")
            result=result+"🟥";
        }
    }
    
    
    
  }
  return result;
}

function checkGoals(id)
{
  var result="";
  if(teamInfo.hasOwnProperty('Goal'))
  {
    
    var goal_list=teamInfo.Goal;
    
    if(Array.isArray(goal_list))
    {
      for (var i = 0; i < goal_list.length; i++)
      {
        if(goal_list[i]["@attributes"].PlayerRef==id)
        {
          result=result+"⚽";
        }
      }
    }
    else
    {
     
      if(goal_list["@attributes"].PlayerRef==id)
        {
          
          result=result+"⚽";
        }
    }
    
  }
  return result;
}


function updateMatchInfo()
{
	//Update Result
	document.getElementById("result_span").textContent = result;
	document.getElementById("period_span").textContent = period_es;
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
//Itzulpenak
function transEus(value)
{
	document.getElementById("menu_match").innerHTML="Partidua";
	match_title="Partidua";
	document.getElementById("menu_gastro").innerHTML="Gastronomia";
	gastro_title="Gastronomia"
	document.getElementById("menu_idioma").innerHTML="Hizkuntza";
	document.getElementById("menu_boletin").innerHTML="Aldizkaria";
	document.getElementById("menu_info").innerHTML="Informazioa";
	document.getElementById("menu_contact").innerHTML="Kontaktua";
	if(page==="Gastro")
		document.getElementById("sub_header").textContent="Gastronomia";
	else
		document.getElementById("sub_header").textContent="Partidua";
	document.getElementById("meal1").textContent="Urdaiazpiko kukusoa ";
	document.getElementById("meal2").textContent="Txahalki miniburgerrak";
	document.getElementById("meal3").textContent="Donostiako delizia";
	document.getElementById("meal4").textContent="Izokin nigiria";
	document.getElementById("meal5").textContent="Antxoa nigiria";
	document.getElementById("meal6").textContent="Legatza eta pikillodun makia";
	document.getElementById("meal7").textContent="Bieira makia Idiazabal gaztarekin";
	document.getElementById("meal8").textContent="Joselito erreserba handiko urdaiazpikoa";
	document.getElementById("meal9").textContent="Joselito solomoa, saltxitxoia eta txorizoa";
	document.getElementById("meal10").textContent="Orburuak, muina eta Lumagorri";
	document.getElementById("meal11").textContent="Txangurro pistoa";
	document.getElementById("meal12").textContent="Legatz arrautzaztatua eta piper erre zukua";
	document.getElementById("meal13").textContent="Topinanbu azpizuna kafearekin";
	document.getElementById("meal14").textContent="Albondigak foie saltsarekin";
	document.getElementById("meal15").textContent="Bost motatako gazta";
	document.getElementById("meal16").textContent="Laranja eta laranja-lore zopa";
	document.getElementById("meal17").textContent="Hostopila";
	//document.getElementById("meal18").textContent="Txokolate eta kafe-moussea";
	document.getElementById("period_span").textContent = period_eu;
	document.getElementById("alin_title").textContent="Hamaikakoak";
	document.getElementById("subitute_title").textContent="Aldaketak";
	document.getElementById("sub_title").textContent="Ordezkoak";
	document.getElementById("no_info_text1").textContent="Informazioa oraindik ez dago eskuragarri.";
	document.getElementById("no_info_text2").textContent="Mesedez, saiatu beranduago.";
	document.getElementById("refresh_button").textContent="Eguneratu";
	localStorage.setItem('lang', "eu");
	selected_language="eu"
	if(value)
		showHideMenu();
}

function transCas()
{
	document.getElementById("menu_match").innerHTML="Partido";
	match_title="Partido";
	document.getElementById("menu_gastro").innerHTML="Gastronomía";
	gastro_title="Gastronomía"
	document.getElementById("menu_idioma").innerHTML="Idioma";
	document.getElementById("menu_boletin").innerHTML="Boletín";
	document.getElementById("menu_info").innerHTML="Información";
	document.getElementById("menu_contact").innerHTML="Contacto";
	if(page==="Gastro")
		document.getElementById("sub_header").textContent="Gastronomía";
	else
		document.getElementById("sub_header").textContent="Partido";
	document.getElementById("meal1").textContent="Pulga de jamón";
	document.getElementById("meal2").textContent="Miniburguer de ternera";
	document.getElementById("meal3").textContent="Delicia Donostiarra";
	document.getElementById("meal4").textContent="Nigiri salmón";
	document.getElementById("meal5").textContent="Nigiri antxoa";
	document.getElementById("meal6").textContent="Maki de merluza frita y pikillo";
	document.getElementById("meal7").textContent="Maki de vieira con Idiazabal";
	document.getElementById("meal8").textContent="Jamón gran reserva Joselito";
	document.getElementById("meal9").textContent="Lomo, salchichón y chorizo Joselito";
	document.getElementById("meal10").textContent="Alcachofa, tuétano y Lumagorri";
	document.getElementById("meal11").textContent="Pisto de txangurro";
	document.getElementById("meal12").textContent="Merluza rebozada y jugo de pimiento asado";
	document.getElementById("meal13").textContent="Solomillo topinambour y café";
	document.getElementById("meal14").textContent="Albóndigas con salsa de foie";
	document.getElementById("meal15").textContent="Queso 5 variedades";
	document.getElementById("meal16").textContent="Sopa de naranja y azahar";
	document.getElementById("meal17").textContent="Milhojas de hojaldre";
	//document.getElementById("meal18").textContent="Mousse de chocolate y café";
	document.getElementById("period_span").textContent = period_es;
	document.getElementById("alin_title").textContent="Alineaciones";
	document.getElementById("subitute_title").textContent="Sustituciones";
	document.getElementById("sub_title").textContent="Suplentes";
	document.getElementById("no_info_text1").textContent="La información no está disponible todavía.";
	document.getElementById("no_info_text2").textContent="Por favor, inténtelo más tarde.";
	document.getElementById("refresh_button").textContent="Actualizar";
	localStorage.setItem('lang', "es");
	selected_language="es"
	showHideMenu();
}

function checkLanguage()
{
	var value=localStorage.getItem("lang")
	if(selected_language===null)
		selected_language="es"
	else
		selected_language=value;
}

//Testing

var match_title="Partido";
var page="Match";
var selected_language;
var gastro_title="Gastronomia";
var match_info;
var result;
var period_es;
var period_eu;
var home_lineup;
var home_sustitutions;
var home_subs=[];
var away_lineup;
var away_sustitutions;
var away_subs=[];
var is_data;
var substitutions;
var opta;
var match_id;

loadMatchInfoOnline();
checkLanguage();
if(selected_language==="eu")
	transEus(false);
