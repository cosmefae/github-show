function equalHeight(){setTimeout(function(){$("#grid-list-projects, #content").removeAttr("style");var t=$(window).height(),e=$("#grid-list-projects").outerHeight(),o=$("#content").outerHeight(),s=Math.max(e,o);$("#grid-list-projects, #content").css({"min-height":t,height:s})},1e3)}function requestURL(){var t=window.location.hash;t=t.split("#"),$('#list-projects li[data-repo="'+t[1]+'"]').children("a").click()}var access_token="a8e1007e82c97ab8764d9d2c99d0893b11484dc0",commitResults="20";jQuery.githubUser=function(t,e){jQuery.getJSON("https://api.github.com/users/"+t+"/repos?access_token="+access_token+"&callback=?",e)},jQuery.fn.loadRepositories=function(t){this.html("<span>Loading the repositories from <strong>"+t+"</strong>.</span>");var e=this;$.githubUser(t,function(o){function s(t){t.sort(function(t,e){return e.stargazers_count-t.stargazers_count})}function a(e){$(".list-commits").attr("data-page","1"),equalHeight(),$.ajax({url:"https://api.github.com/repos/"+t+"/"+e+"/commits?page=1&per_page="+commitResults+"&access_token="+access_token,dataType:"json",success:function(t){for(var e in t){var o=$(".list-commits li").length;commitResults>o&&$("#content .list-commits").append('<li data-id="'+e+'">'+t[e].commit.message+"</li>")}$(".list-commits").slideDown(),$(".loader").fadeOut(),equalHeight()},error:function(){$(".btn-more-commits").fadeOut("fast")}}),$("#content .post").append('<footer><button class="btn btn-more-commits">Load more commits</button></footer>'),$(".btn-more-commits").click(function(){n(e)})}function n(e){var o=$(".list-commits").attr("data-page");o=parseInt(o),$(".list-commits").attr("data-page",o++),$.ajax({url:"https://api.github.com/repos/"+t+"/"+e+"/commits?page="+o+"&per_page="+commitResults+"&?access_token="+access_token,dataType:"json",success:function(t){for(var e in t)$("#content .list-commits").append('<li data-id="'+e+'">'+t[e].commit.message+"</li>");(void 0==t||null==t||0==t.length)&&$(".btn-more-commits").fadeOut("fast"),equalHeight()},error:function(){$(".btn-more-commits").fadeOut("fast")}})}$("h1 strong").text(t);var i=o.data;s(i);var c=$("<ol></ol>");e.empty().append(c),$(i).each(function(){c.append('<li data-repo="'+this.name+'"><a href="'+this.html_url+'">'+this.name+"</a></li>")}),$("#list-projects a").click(function(e){$("#list-projects li").removeClass("current"),$(this).parent().addClass("current");var o=$(this).text();window.location.hash=o,$("#content").fadeOut("fast"),$("html, body").animate({scrollTop:0},"slow"),$.ajax({url:"https://api.github.com/repos/"+t+"/"+o+"?access_token="+access_token,dataType:"json",success:function(t){$("#content").empty(),$("#content").html('<article class="post"><header></header></article>'),$("#content .post").append('<ol class="list-commits"></ol>'),$("#content header").append("<h2>"+o+"</h2>"),$("#content header").append("<small><strong>"+t.stargazers_count+"</strong> Stars • <strong>"+t.forks+"</strong> forks</small>"),$("#content").fadeIn("slow"),equalHeight(),a(o)},error:function(){$("#content").html("Não foi possível carregar o projeto. Aguarde uns minutos e tente novamente.")}}),e.preventDefault()})})},$(document).ready(function(){$(window).resize(function(){}),$("#list-projects").loadRepositories("google")}),$(window).load(function(){requestURL(),equalHeight(),$(".loader").fadeOut()});