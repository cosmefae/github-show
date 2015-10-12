/*
    Cosme Faé
    cosmefae.com / cosme@cosmefae.com

    Linkedin: http://linkedin.com/in/cosmefae
    Github: http://github.com/cosmefae
    Behance: http://be.net/cosmefae
*/


// Github Config
var access_token = 'a8e1007e82c97ab8764d9d2c99d0893b11484dc0'; // Token to increase the requests from Github API
var commitResults = '20'; // Total of the commit results

jQuery.githubUser = function(username, callback) {
  jQuery.getJSON('https://api.github.com/users/' + username + '/repos?access_token=' + access_token + '&callback=?',callback);
};

jQuery.fn.loadRepositories = function(username) {
  this.html('<span>Loading the repositories from <strong>' + username + '<\/strong>.</span>');

  var target = this;
  $.githubUser(username, function(data) {
    $('h1 strong').text(username);

    var repos = data.data; // JSON Parsing


    // Sorting the repositories by Stars
    function sortByStars(repos) {
      repos.sort(function(a,b) {
        return b.stargazers_count - a.stargazers_count;
      });
    }
    sortByStars(repos);


    // Listing the repositories
    var list = $('<ol></ol>');
    target.empty().append(list);
    $(repos).each(function() {
      list.append('<li data-repo="' + this.name +'"><a href="'+ this.html_url +'">' + this.name + '</a></li>');
    });


    // When to click in the repository, it will fill the content with the name of the project and the list of the commits
    $('#list-projects a').click(function(e) {
      $('#list-projects li').removeClass('current');
      $(this).parent().addClass('current');

      var getNameProject = $(this).text();

      window.location.hash = getNameProject;

      $('#content').fadeOut('fast');
      $("html, body").animate({ scrollTop: 0 }, "slow");

      $.ajax({
        url: 'https://api.github.com/repos/' + username + '/' + getNameProject + '?access_token=' + access_token,
        dataType: 'json',
        success: function (data) {
          $('#content').empty();
          $('#content').html('<article class="post"><header></header></article>');
          $('#content .post').append('<ol class="list-commits"></ol>');
          $('#content header').append('<h2>' + getNameProject + '</h2>');
          $('#content header').append('<small><strong>' + data.stargazers_count + '</strong> Stars • <strong>'+ data.forks + '</strong> forks</small>');

          $('#content').fadeIn('slow');
          equalHeight();
          loadCommits(getNameProject);
        },
        error: function() {
          $('#content').html('Não foi possível carregar o projeto. Aguarde uns minutos e tente novamente.');
        }
      });
      e.preventDefault();
    });


    // Load the commits from the current repository
    function loadCommits(project) {
      $('.list-commits').attr('data-page','1');
      equalHeight();

      $.ajax({
        url: 'https://api.github.com/repos/' + username + '/' + project + '/commits?page=1&per_page=' + commitResults + '&access_token=' + access_token,
        dataType: 'json',
        success: function (data) {
          for(var i in data) {
            var commitResultsShown = $('.list-commits li').length;
            if(commitResultsShown < commitResults) {
              $('#content .list-commits').append('<li data-id="' + i + '">' + data[i].commit.message + '</li>');
            }
          }
          $('.list-commits').slideDown();
          $('.loader').fadeOut();

          equalHeight();
        },
        error: function() {
          $('.btn-more-commits').fadeOut('fast');
        }
      });

      $('#content .post').append('<footer><button class="btn btn-more-commits">Load more commits</button></footer>');

      $('.btn-more-commits').click(function() {
        moreCommits(project);
      });
    }


    // Load more commits from the current repository
    function moreCommits(project) {
      var page = $('.list-commits').attr('data-page');
          page = parseInt(page);

      $('.list-commits').attr('data-page',page++);

      $.ajax({
        url: 'https://api.github.com/repos/' + username + '/' + project + '/commits?page=' + page + '&per_page=' + commitResults + '&?access_token=' + access_token,
        dataType: 'json',
        success: function (data) {
          for(var i in data) {
            $('#content .list-commits').append('<li data-id="' + i + '">' + data[i].commit.message + '</li>');
          }
          if (data == undefined || data == null || data.length == 0) {
            $('.btn-more-commits').fadeOut('fast');
          }

          equalHeight();
        },
        error: function() {
          $('.btn-more-commits').fadeOut('fast');
        }
      });
    }
  });
};

// Equal height from content and sidebar
function equalHeight() {
  setTimeout(function(){
    $('#grid-list-projects, #content').removeAttr('style');

    var getHeight = $(window).height();
    var getListHeight = $('#grid-list-projects').outerHeight();
    var getContentHeight = $('#content').outerHeight();
    var biggestHeight = Math.max(getListHeight, getContentHeight);

    $('#grid-list-projects, #content').css({
      'min-height': getHeight,
      'height': biggestHeight
    });
  }, 1000);
}

// Handle the URL to show the current repository
function requestURL() {
  var currentRepo = window.location.hash;
      currentRepo = currentRepo.split('#');
  $('#list-projects li[data-repo="' + currentRepo[1] +'"]').children('a').click();
}

$(document).ready(function() {
  $(window).resize(function() {
    // equalHeight();
  });

  // Call the event with the username from Github
  $('#list-projects').loadRepositories('google');
});

// And when the page is really loaded...
$(window).load(function() {
  requestURL();
  equalHeight();
  $('.loader').fadeOut(); // Hidden the spin loader
});
