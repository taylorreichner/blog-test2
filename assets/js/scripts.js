// ================================
// Theme Options
// ================================
if (typeof themeConfig == "undefined") {
  themeConfig = {};
}

var ghosthunter_key = themeConfig.ghostSearchKey;
var ghost_root_url = (typeof themeConfig.ghostSearchUrl === 'undefined') ? "/ghost/api/v2" : themeConfig.ghostSearchUrl;

// ================================
// JavaScript Check
// ================================
document.body.classList.add('js-loading');

function showPage() {
  document.body.classList.remove('js-loading');
}
window.addEventListener('load', showPage);

// ================================
// Parse the URL parameter
// ================================
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Give the parameter a variable name
var action = getParameterByName('action');
var stripe = getParameterByName('stripe');

$(document).ready(function() {

  // ================================
  // Set Body Class
  // ================================
  if (action == 'subscribe') {
    $('body').addClass("subscribe-success");
  }
  if (action == 'signup') {
      window.location = '{{@site.url}}/signup/?action=checkout';
  }
  if (action == 'checkout') {
      $('body').addClass("signup-success");
  }
  if (action == 'signin') {
      $('body').addClass("signin-success");
  }
  if (stripe == 'success') {
      $('body').addClass("checkout-success");
  }
  if (stripe == 'billing-update-success') {
      $('body').addClass("billing-success");
  }
  if (stripe == 'billing-update-cancel') {
      $('body').addClass("billing-cancel");
  }

  // ================================
  // Theme Options
  // ================================
  if (typeof themeConfig.showMembershipNavLinks !== 'undefined' && themeConfig.showMembershipNavLinks == false) {
    $('.nav-membership').remove();
  } else {
    $('.nav-membership').css('display', 'inline-block');
  }

  if (typeof themeConfig.postVisibility !== 'undefined' && themeConfig.postVisibility.constructor === Array) {
    if(themeConfig.postVisibility.length === 0) {
      return false;
    }

    var postAccessLevels = ['public', 'members', 'paid'];
    postAccessLevels.forEach(function(postAccess) {
      if (themeConfig.postVisibility.indexOf(postAccess) === -1) {
        $('.post-access-'+postAccess).remove();
      }
    });
  }

  if (typeof themeConfig.planFeatures !== 'undefined' && themeConfig.planFeatures.constructor === Object) {
    for (var plan in themeConfig.planFeatures) {
      if (themeConfig.planFeatures[plan].constructor === Array) {
        $('.membership-plan-'+plan).find('.membership-plan-content ul li').remove();
        themeConfig.planFeatures[plan].forEach(function(feature) {
          $('.membership-plan-'+plan).find('.membership-plan-content ul')
            .append('<li>' + feature + '</li>');
        });
      }
    }
  }

  // ================================
  // Mobile Nav
  // ================================
  $('.nav-toggle').click(function() {
    if (!$(this).hasClass('active')) {
      $(this).addClass('active');

      $('.nav').addClass('active').fadeIn();
    } else {
      $(this).removeClass('active');

      $('.nav').fadeOut("normal", function() {
        $(this).removeClass('active')
      });
    }
  });

  // ================================
  // Post Comments
  // ================================
  function disqusComments(username) {
    var d = document, s = d.createElement('script');
    s.src = 'https://' + username + '.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    $('.post-full-comments').show();
  }

  if (typeof themeConfig.disqusUsername !== 'undefined' && themeConfig.disqusUsername != '' && $('body').hasClass('post-template')) {
    disqusComments(themeConfig.disqusUsername);
  }

  // ================================
  // Search
  // ================================
  var searchHint = '';
  if (typeof themeConfig.searchHint !== 'undefined' && themeConfig.searchHint != '') {
    $('.search-input').attr('placeholder', themeConfig.searchHint);
  }

  var includeBodyInSearch = true;
  if (typeof themeConfig.includeBodyInSearch !== 'undefined' && themeConfig.includeBodyInSearch != '' && typeof themeConfig.includeBodyInSearch === "boolean") {
    includeBodyInSearch = themeConfig.includeBodyInSearch;
  }

  var searchField = $('.search-input').ghostHunter({
    results: '.search-results',
    onKeyUp: true,
    displaySearchInfo: false,
    includebodysearch: includeBodyInSearch,
    result_template: "<a id='gh-{{ref}}' class='gh-search-item' href='{{link}}'><h2>{{title}}</h2><p>{{description}}</p></a>",
    onComplete: function(results) {
      $('.search-results').fadeIn();

      if (results.length > 0) {
        $('.search-close').show();
      }
    }
  });

  function clearSearch() {
    searchField.clear();
    $('.search-results').empty();
    $('.search-input').val('');
    $('.search-close').hide();
  }

  $(document).keydown(function(e) {
    if (e.keyCode === 27) {
      clearSearch();
    }
  });

  $('.search-close').on("click", function() {
    clearSearch();
  });

  // ================================
  // Image zooms
  // ================================
  $('.post-content img').attr('data-zoomable', 'true');

  // If the image is inside a link, remove zoom
  $('.post-content a img').removeAttr('data-zoomable');

  var background = '#ffffff';
  if ($('body').hasClass('dark-theme')) {
    background = '#222327';
  }

  mediumZoom('[data-zoomable]', {
    background: background
  });

  // ================================
  // Responsive video embeds
  // ================================
  var postContent = $(".post-content");
  postContent.fitVids({
    'customSelector': [
      'iframe[src*="ted.com"]',
      'iframe[src*="player.twitch.tv"]',
      'iframe[src*="dailymotion.com"]',
      'iframe[src*="facebook.com"]'
    ]
  });

  // ================================
  // Image gallery
  // ================================
  var images = document.querySelectorAll('.kg-gallery-image img');
  images.forEach(function (image) {
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  });

  // ================================
  // Clipboard URL Copy
  // ================================
  var clipboard = new ClipboardJS('.js-share__link--clipboard');

  clipboard.on('success', function(e) {
    var element = $(e.trigger);

    element.addClass('tooltipped tooltipped-s');
    element.attr('aria-label', clipboard_copied_text);

    element.mouseleave(function() {
      $(this).removeAttr('aria-label');
      $(this).removeClass('tooltipped tooltipped-s');
    });
  });

  $('.print-page').click(function() {
    window.print();
  });

  // ================================
  // Account navigation menu
  // ================================
  $('.account-menu-avatar').click(function(event) {
    $(this).toggleClass('active');
    event.stopPropagation();
  });

  $('.account-menu-dropdown').click(function(event) {
    event.stopPropagation();
  });

  $('body').click(function () {
    $('.account-menu-avatar').removeClass('active');
  });

  // ================================
  // Notifications
  // ================================
  $('.notification-close').click(function () {
    $(this).parent().addClass('closed');
    var uri = window.location.toString();
    if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
    }
  });

  // ================================
  // Tooltips
  // ================================
  tippy('.tippy', {
    arrow: true
  });

});
