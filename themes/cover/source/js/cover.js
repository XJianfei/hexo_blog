(function($){

  // move cover
  var ele_cover = $("#cover");
  ele_cover.appendTo($("#header"));
  // set height of the cover  
  var ele_profile = $("#profile");
  var h_win = $(window).height(), h_nav = $("#main-nav").height(), h_cover = h_win - h_nav, 
  h_profile = ele_profile.height(), padTop_profile = (h_win - h_profile) * 0.4;
  ele_cover.height(h_cover);
  // set margin-top of profile
  ele_profile.css("padding-top", padTop_profile);
  // anystretch
  var cover_url = ele_profile.attr("alt");
  if (cover_url.length)
    ele_cover.anystretch(cover_url);

  var timeout = false;
  var lastTop = document.body.scrollTop;

  var timeout4resize = false;
  $(window).on('resize', function() {
    if (timeout4resize){clearTimeout(timeout4resize);}
    timeout4resize = setTimeout(function(){
      h_win = $(window).height(), h_cover = h_win - h_nav,
                padTop_profile = (h_win - h_profile) * 0.4;
      ele_cover.height(h_cover);
      ele_profile.css("padding-top", padTop_profile);
    });
  });

  var anitime = 500;
  var animating = false;
  var clearAnimating = function() {
      animating = false;
  };
  $(window).on('scroll', function() {
    if (animating) return;

    st = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop
    var down = 1;
    if (st < lastTop)
      down = 0;
    if (timeout){clearTimeout(timeout);}
        timeout = setTimeout(function(){
            var sh = ele_cover.height() - $('#main-nav').height();
            if (down == 1) {
                if (sh / 4 < st && st < sh) {
                    animating = true;
                    $('html, body').animate({scrollTop: sh}, anitime, clearAnimating)
                } else if (sh > st) {
                    animating = true;
                    $('html, body').animate({scrollTop: 0}, anitime, clearAnimating)
                }
            } else {
                if (sh / 4 * 3 > st) {
                    animating = true;
                    $('html, body').animate({scrollTop: 0}, anitime, clearAnimating)
                } else if (sh > st) {
                    animating = true;
                    $('html, body').animate({scrollTop: sh}, anitime, clearAnimating)
                }
            }
        
        },200);
    lastTop = st;
  });
})(jQuery);
