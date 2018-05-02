$('.js-switch').click(function() {
  $('.js-modal').toggleClass('is-show');
});
$('.js-btn').click(function() {
  $('.js-toggle').slideToggle('nomal');
});

//Teacher_pages
var cls = ['#situation', '#record']
var btn = ['.js-btn_situation', '.js-btn_record']
function fade(i) {
  //fade event
  $(cls[i]).fadeToggle('nomal');
  //scroll event
  $("html,body").animate({scrollTop:$(cls[i]).offset().top},500);

};

$('.js-btn').click(function() {
  $('.l-wrap__aside').toggleClass('is-active');
});
