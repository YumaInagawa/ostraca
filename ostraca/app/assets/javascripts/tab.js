$(function() {
  'use strict';
  (function() {
    // 要素の削除
    var $root = $('.p-schedule__tabwrap');
    var $title = $root.find('.p-schedule__switch');
    var $content = $root.find('.p-schedule__tabcontents');
    var $tab = $title.find('a');
    // コンテントを表示
    function showTabContent() {
      var id = $('.active').find('a').attr('href');
      $content.find('>*').hide();
      $(id).show();
    }
    showTabContent();
    $tab.on('click', function(e) {
      var $self = $(this);
      e.preventDefault();
      $title.find('li').removeClass('active');
      $self.parent().addClass('active');
      showTabContent();
    });
  })();
});

$(function() {
  'use strict';
  (function() {
    // 要素の削除
    var $root = $('.p-admin__main');
    var $title = $root.find('.p-admin__switch');
    var $content = $root.find('.p-admin__contents');
    var $tab = $title.find('a');
    // コンテントを表示
    function showTabContent() {
      var id = $('.active').find('a').attr('href');
      $content.find('>*').hide();
      $(id).show();
    }
    showTabContent();
    $tab.on('click', function(e) {
      var $self = $(this);
      e.preventDefault();
      $title.find('li').removeClass('active');
      $self.parent().addClass('active');
      showTabContent();
    });
  })();
});
// 学生届出のタブ
$(function() {
  'use strict';
  (function() {
    // 要素の削除
    var $root = $('.js-document__tab');
    var $title = $root.find('.js-document__switch');
    var $content = $root.find('.js-document__box');
    var $tab = $title.find('a');
    // コンテントを表示
    function showTabContent() {
      var id = $('.active').find('a').attr('href');
      $content.find('>*').hide();
      $(id).show();
    }
    showTabContent();
    $tab.on('click', function(e) {
      var $self = $(this);
      e.preventDefault();
      $title.find('li').removeClass('active');
      $self.parent().addClass('active');
      showTabContent();
    });
  })();
});

//生徒情報のselectをhireselect化
$(function() {
  $('.js-hierSelect').on('change', function() {
    var selected = $(this).val();
    $($(this).data('child')).each(function(i, childSelect) {
      $(childSelect).find('option').each(function(j, childOption) {
        if ($(childOption).data('parent') == selected) {
          $(childOption).show();
        } else {
          $(childOption).hide();
        }
      });
    });
  });
  $('.js-hierSelect').trigger('change');
});
