/***
    学生管理：クラス編集でクラス選択したときの処理
***/
var REST_API_URI = '//api.network.hsc.ac.jp:9090';
var OSTRACA_URI = 'http://ostraca.network.hsc.ac.jp'; // httpsで置き換えおねしゃす

var ACCESSTOKEN = '?accessToken=fda';
var URL_RET_HOME = REST_API_URI + '/teachers/management/students' + ACCESSTOKEN
var URL_CSV_DOWNLOAD = REST_API_URI + '/teachers/management/csvdownload?'

function readCsvFile() {
  'use strict'

  console.log('call admin_page->readCsvFile()');
}
//*** 新規登録 ***//
var result = document.getElementById('result');
var csv_file = document.getElementById('csv_file');
var student_list = [];


// TODO: この処理をイベントリスナーではなく、なにか違う方法を模索したら、ajaxのエラーなくなる？
// ファイルが選択されたとき
// csv_file.addEventListener('change', function(e) {
// 	'use strict'

// 	console.log('call admin_page->csv_file');
// 	// 選択されたファイルの情報を取得
// 	var fileData = e.target.files[0];
// 	var reader = new FileReader();
// 	// ファイル読み取りに失敗したとき
// 	reader.onerror = function() {
// 		alert('ファイルの読み取りに失敗しました')
// 	}
// 	// ファイル読み取りに成功したとき
// 	reader.onload = function() {
// 		// 行単位で配列にする
// 		var line = reader.result.split("\n");
// 		// 行と列の二次元配列にする
// 		var item = [];
// 		for (var i = 0; i < line.length; i++) {
// 			// 「,」で分割する
// 			item[i] = line[i].split(",");
// 		}
// 		// JSON形式に変換する
// 		// getCsv.js:28 [["5151018","内田　武","ウチダ　タケル","5151018@st.hsc.ac.jp","0"],["5151010","太田　勇人","オオタ　ユウト","5151010@st.hsc.ac.jp","0"],["5151005","尾土井　優典","オドイ　マサノリ","5151005@st.hsc.ac.jp","0"],["5151039","黒田　哲史","クロダ　サトシ","5151039@st.hsc.ac.jp","0"],["5151042","後藤　聖登","ゴトウ　キヨト","5151042@st.hsc.ac.jp","0"],["5151008","築尾　憲典","チクオ　ケンスケ","5151008@st.hsc.ac.jp","0"],["5151024","早川　翔","ハヤカワ　シst.hsc.ac.jp","0"],["5151021","大場　祐一","オオバ　ユウイチ","51510021@st.hsc.ac.jp","0"],["5151013","国貞　仁貴　明良","クロノツボ　アキ
// 		// var items = JSON.stringify(item);

// 		// 取得データをテーブルで表示する
// 		var div = document.getElementById('table');
// 		var str = '';
// 		str += '<table id="student-edit" class="c-table" border="1">';
// 		str += '<tr><th class="c-table__text">学籍番号</th><th class="c-table__text">氏名</th><th class="c-table__text">ルビ</th><th class="c-table__text">メールアドレス</th></tr>'
// 		for (var i = 0; i < item.length - 1; i++) {
// 			// console.log(item[i]);
// 			var name = item[i][1];
// 			// console.log(name);
// 			var arr = {
// 				stu_id: item[i][0],
// 				stu_name: item[i][1],
// 				stu_rubi: item[i][2],
// 				stu_mailaddr: item[i][3]
// 				// stu_line_id: 	item[i][4]       // この段階では不要なため、コメアウト
// 			}
// 			student_list[i] = arr;
// 			str += '<tr>'
// 			str += '<td>' + arr['stu_id'] + '</td>'
// 			str += '<td>' + arr['stu_name'] + '</td>'
// 			str += '<td>' + arr['stu_rubi'] + '</td>'
// 			str += '<td>' + arr['stu_mailaddr'] + '</td>'
// 			// str += '<td>' + arr['stu_line_id'] + '</td>' // この段階では不要なため、コメアウト
// 			str += '</tr>'
// 			// request.send(null);
// 			// htmlへ埋め込み
// 			// console.log(arr);
// 		}
// 		str += '</table>'
// 		div.innerHTML = str;
// 	}
// 	// ファイルの読み取りを実行
// 	reader.readAsText(fileData);
// }, false);

//### _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ ###//
//### クラス編集関連 ここから ###//
//### _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ ###//
//***	Admin：クラス編集	***//
function admin_select_class() {
  'use strict'
  console.log('call admin_select_class()');

  // 選択された項目を取得
  var years = $('[name=edit_years] option:selected').text();
  var classes = $('[name=edit_classes] option:selected').text();
  var class_name = years + classes //### 選択されたクラス名 ###//
  // console.log("class_name : " + class_name);

  // 選択されたクラスIDでRESTへリクエストする
  console.log(URL_RET_HOME + '&class_name=' + class_name);
  var request = new XMLHttpRequest();
  //### ManagementController.retBelongStudent() 使用 ###//
  request.open('GET', URL_RET_HOME + '&class_name=' + class_name);
  request.onreadystatechange = function() {
    if (request.readyState != 4) {
      // リクエスト中
    } else if (request.status != 200) {
      // request failed
      console.log('request failed');
    } else {
      // 取得成功 -- > ＪＳＯＮをオブジェクト化する
      var json = JSON.parse(request.responseText);
      // console.log(json);

      //### テーブルの生成 ###//
      var div = document.getElementById('admin_select_class');
      var str = '';
      str += '<table id="student-edit" class="p-classtable"><tbody class="p-classtable__box">';
      // str += '<tr class="c-table__header"><th class="p-classtable__text">選択</th><th class="p-classtable__text">学籍番号</th><th class="p-classtable__text">氏名</th><th class="p-classtable__text">クラス</th><th class="p-classtable__text">クラス</th><th class="p-classtable__text">クラス</th></tr>'
      // str += '<tr class="p-classtable__header"><th class="p-classtable__text">選択</th><th class="p-classtable__text">学籍番号</th><th class="p-classtable__text">氏名</th><th class="p-classtable__text">priクラス</th><th class="p-classtable__text">secクラス</th><th class="p-classtable__text">3rdクラス</th><th class="p-classtable__text">4thクラス</th></tr>'
      str += '<tr class="p-classtable__line p-classtable__line--header"><th class="p-classtable__item"><label for="allCheck">一括</label><input type="checkbox" id="allCheck" onclick="allChecked()"></th><th class="p-classtable__text">学籍番号</th><th class="p-classtable__text">氏名</th><th class="p-classtable__text">priクラス</th><th class="p-classtable__text">secクラス</th><th class="p-classtable__text">3rdクラス</th></tr>'

      for (var i = 0; i < json.length; i++) {
        var data = json[i.toString()];
        console.log(data);
        str += '<tr class="p-classtable__line">'
        str += '<td class="p-classtable__item"><input type="checkbox" name="st01" value="" class="p-classtable__check" onclick="disChecked(this)"></td>';
        str += '<td class="p-classtable__text">' + data['stu_id'] + '</td>';
        str += '<td class="p-classtable__text">' + data['stu_name'] + '</td>';
        str += '<td class="p-classtable__text">' + data['pri_class_name'] + '</td>';
        // str += '<td class=""p-classtable__text">' + return_pri_classes() + '</td>';
        // str += '<td class=""p-classtable__text">' + return_pri_classes(data[pri_class_name].length, data[pri_class_name]) + '</td>';
        //### 選択した年次によって処理を分ける ###//
        if (years == 1) { //### 1年生 ###//
          // document.second_classes.selectedIndex = select_second_classes(data['sec_class_name'])
          // var idx = select_second_classes(data['sec_class_name']);
          // second_classes[idx].selected = true;
          str += '<td class="p-classtable__text">' + return_second_classes(years, data['sec_class_name']) + '</td>'; //### 2次クラス 1年の場合 X Y Z ###//
          str += '<td class="p-classtable__text">';
          str += '<select class="p-dropdown" name="_3rd_classes">';
          str += '<option class="p-dropdown__item" value="0000">無し</option>';
          str += '</select>';
          str += '</td>';
          // str += '<td class="p-classtable__text">' + return_3rd_classes() + '</td>'; //### 3次クラス 選択 OSとか表計算とか ###//
          // str += '<td class="p-classtable__text">' + return_4rd_classes(data['sec_class_name']) + '</td>'; //### 4次クラス データが入り次第実装せよ ###//
        } else if (years == 2){
          str += '<td class="p-classtable__text">' + return_second_classes(years, data['sec_class_name']) + '</td>'; //### 2次クラス 2,3年の場合  高度、応用、基本あり、基本なし ###//
          str += '<td class="p-classtable__text">' + return_3rd_classes(data['3th_class_name']) + '</td>'; //### 2年選択１とか選択2とか ###//
        }
        else { //### 3年生 ###//
          str += '<td class="p-classtable__text">' + return_second_classes(years, data['sec_class_name']) + '</td>'; //### 2次クラス 2,3年の場合  高度、応用、基本あり、基本なし ###//
          str += '<td class="p-classtable__text">'; //### 3次クラス 選択 OSとか表計算とか ###//
          str += '<select class="p-dropdown" name="_3rd_classes">';
          str += '<option class="p-dropdown__item" value="0000">無し</option>';
          str += '</select>';
          str += '</td>'
          // str += '<td class="p-classtable__text">' + return_3rd_classes(data['3th_class_name']) + '</td>'; //### 3次クラス 選択 OSとか表計算とか ###//
          // str += '<td class="c-table__text">' + return_4rd_classes(data['sec_class_name']) + '</td>'; //### 4次クラス データが入り次第実装せよ ###//
        }
        // str += '<td class="c-table__text">' + '0000' + '</td>'; //### 4次クラス 現状全部'0000' ###//
        str += '</tr>'
      }
      str += '</tbody></table>';
      div.innerHTML = str;
    }
  }
  request.send(null);

  // return json;
}

// 編集ボタンの処理
function studentUpdate() {
  console.log('----- call studentUpdate() ----- ')
  'use strict'
  // 連想配列化したデータを取得
  var arr = edit_submit();
  console.log(arr);

  // JSON化
  var json = JSON.stringify(arr);
  console.log(json);

  $.ajax({
    url: OSTRACA_URI +  '/student',
    type: "POST",
    // dataType: 'json',
    scriptCharset: 'utf-8',
    // data: json,
    data: arr,
    success: function() {
      console.log('success');
    },
    error: function() {
      console.log('error');
    }
  });
}

function admin_select_delete() {

  'use strict'
  console.log('call admin_delete_class()');

  // 選択された項目を取得
  var years = $('[name=del_years] option:selected').text();
  var classes = $('[name=del_classes] option:selected').text();
  var class_name = years + classes //### 選択されたクラス名 ###//
  console.log("class_name : " + class_name);

  // 選択されたクラスIDでRESTへリクエストする
  console.log(URL_RET_HOME + '&class_name=' + class_name);
  var request = new XMLHttpRequest();
  //### ManagementController.retBelongStudent() 使用 ###//
  request.open('GET', URL_RET_HOME + '&class_name=' + class_name);
  request.onreadystatechange = function() {
    if (request.readyState != 4) {
      // リクエスト中
    } else if (request.status != 200) {
      // request failed
      console.log('request failed');
    } else {
      // 取得成功 -- > ＪＳＯＮをオブジェクト化する
      var json = JSON.parse(request.responseText);
      console.log(json);

      //### テーブルの生成 ###//
      var div = document.getElementById('admin_delete_class');
      var str = '';
      for (var i = 0; i < json.length; i++) {
        var r = json[i.toString()];
        console.log(r);
        str += '<div class="p-deltable__line">';
        str += '<div class="p-deltable__box">';
        str += '<p class="p-deltable__item"><input type="checkbox" class="p-deltable__check" name="' + r['stu_id'] + '" id="' + r['stu_id'] + '"></p>';
        str += '<dl class="p-deltable__block" id="student">';
        str += '<dt class="p-deltable__text" value="' + r['stu_id'] + '">' + r['stu_id'] + '</dt>';
        str += '<dd class="p-deltable__text" >' + r['stu_name'] + '</dd>';
        str += '</dl>';
        str += '</div>';
        str += '</div>';
      }
      div.innerHTML = str;
    }
  }
  request.send(null);

  return json;
}

// function return_pri_classes(priLen, priClassName) {
// function return_pri_classes() {
//   // for(var i = 0; i < priLen; i++) {
//   //   console.log(i);
//   // }
//   var str = '';
//   str += '<select class="p-dropdown" name="second_classes" id="second_classes">';
//   str += '<option class="p-dropdown__item" value="1" selected="selected">1A</option>';
//   str += '<option class="p-dropdown__item" value="2">1B</option>';
//   str += '<option class="p-dropdown__item" value="3">1C</option>';
//   str += '</select>';
//
//   return str;
// }

//### 1年生用 ###//
//####################################################//
//### "2"次クラスのセレクトボックスを生成するメソッド ###//
//### admin_select_class() にて使用		            ###//
//### X Y Z 高度対策 応用対策 基本2 基本1 用			   	###//
//################################################//
function return_second_classes(years, secClassName) {
  var str = '';
  // 後でXとか正規表現する
  // 1年生の場合
  if (years == 1) {
    if (secClassName == '対策X') {
      str += '<select class="p-dropdown" name="second_classes" id="second_classes">';
      str += '<option class="p-dropdown__item" value="0000">無し</option>';
      str += '<option class="p-dropdown__item" value="1" selected="selected">X</option>'; // 初期値
      str += '<option class="p-dropdown__item" value="1">Y</option>';
      str += '<option class="p-dropdown__item" value="1">Z</option>';
      str += '</select>';
    } else if (secClassName == '対策Y') {
      str += '<select class="p-dropdown" name="second_classes" id="second_classes">';
      str += '<option class="p-dropdown__item" value="0000">無し</option>';
      str += '<option class="p-dropdown__item" value="1">X</option>';
      str += '<option class="p-dropdown__item" value="1" selected="selected">Y</option>'; // 初期値
      str += '<option class="p-dropdown__item" value="1">Z</option>';
      str += '</select>';
    } else {
      str += '<select class="p-dropdown" name="second_classes" id="second_classes">';
      str += '<option class="p-dropdown__item" value="0000">無し</option>';
      str += '<option class="p-dropdown__item" value="1">X</option>';
      str += '<option class="p-dropdown__item" value="1">Y</option>';
      str += '<option class="p-dropdown__item" value="1" selected="selected">Z</option>'; // 初期値
      str += '</select>';
    }
    // 2,3年生の場合
  } else {
    if (secClassName == '高度対策') {
      str += '<select class="p-dropdown" name="_4rd_classes">';
      str += '<option class="p-dropdown__item" value="0000">無し</option>';
      str += '<option class="p-dropdown__item" value="1" selected="selected">高度対策</option>'; // 初期値
      str += '<option class="p-dropdown__item" value="1">応用対策</option>';
      str += '<option class="p-dropdown__item" value="1">基本対策2</option>';
      str += '<option class="p-dropdown__item" value="1">基本対策1</option>';
      str += '</select>';
    } else if (secClassName == '応用対策') {
      str += '<select class="p-dropdown" name="_4rd_classes">';
      str += '<option class="p-dropdown__item" value="0000">無し</option>';
      str += '<option class="p-dropdown__item" value="1">高度対策</option>';
      str += '<option class="p-dropdown__item" value="1" selected="selected">応用対策</option>'; // 初期値
      str += '<option class="p-dropdown__item" value="1">基本対策2</option>';
      str += '<option class="p-dropdown__item" value="1">基本対策1</option>';
      str += '</select>';
    } else if (secClassName == '基本対策2') {
      str += '<select class="p-dropdown" name="_4rd_classes">';
      str += '<option class="p-dropdown__item" value="0000">無し</option>';
      str += '<option class="p-dropdown__item" value="1">高度対策</option>';
      str += '<option class="p-dropdown__item" value="1">応用対策</option>';
      str += '<option class="p-dropdown__item" value="1" selected="selected">基本対策2</option>'; // 初期値
      str += '<option class="p-dropdown__item" value="1">基本対策1</option>';
      str += '</select>';
    } else {
      str += '<select class="p-dropdown" name="_4rd_classes">';
      str += '<option class="p-dropdown__item" value="0000">無し</option>';
      str += '<option class="p-dropdown__item" value="1">高度対策</option>';
      str += '<option class="p-dropdown__item" value="1">応用対策</option>';
      str += '<option class="p-dropdown__item" value="1">基本対策2</option>';
      str += '<option class="p-dropdown__item" value="1" selected="selected">基本対策1</option>'; // 初期値
      str += '</select>';
    }
  }

  return str;
}
//### セレクトボックスと同じデータの添え字を返す ###//
function select_second_classes(sec_class_name) {
  var array = ["PG(X)", "PG(Y)", "PG(Z)"]; //### データ ###//
  for (var i = 0; i < array.length; i++) {
    if (array[i] == sec_class_name) return i; //### 添え字を返す ###//
  }
}

//###############################################//
//### "3"次クラスのセレクトボックスを生成するメソッド ###//
//### admin_select_class() にて使用			   ###//
//### 選択 			   ###//
//###############################################//
function return_3rd_classes(className) {
  var str = '';
  if (className == '2年選択1') {
    str += '<select class="p-dropdown" name="_3rd_classes">';
    str += '<option class="p-dropdown__item" value="1" selected="selected">2年選択1</option>'; // 初期値
    str += '<option class="p-dropdown__item" value="1">2年選択2</option>';
    str += '<option class="p-dropdown__item" value="1">2年選択3</option>';
    str += '</select>';
  } else if (className == '2年選択2') {
    str += '<select class="p-dropdown" name="_3rd_classes">';
    str += '<option class="p-dropdown__item" value="1">2年選択1</option>';
    str += '<option class="p-dropdown__item" value="1" selected="selected">2年選択2</option>'; // 初期値
    str += '<option class="p-dropdown__item" value="1">2年選択3</option>';
    str += '</select>';
  } else if (className == '2年選択3'){
    str += '<select class="p-dropdown" name="_3rd_classes">';
    str += '<option class="p-dropdown__item" value="1">2年選択1</option>';
    str += '<option class="p-dropdown__item" value="1">2年選択2</option>';
    str += '<option class="p-dropdown__item" value="1" selected="selected">2年選択3</option>'; // 初期値
    str += '</select>';
  } else {
    str += '<select class="p-dropdown" name="_3rd_classes">';
    str += '<option class="p-dropdown__item" value="1" selected="selected">2年選択1</option>'; // 初期値
    str += '<option class="p-dropdown__item" value="1">2年選択2</option>';
    str += '<option class="p-dropdown__item" value="1">2年選択3</option>';
    str += '</select>';
  }

  return str;
}
// function return_3rd_classes() {
//   var str = '';
//   str += '<select class="p-dropdown" name="_3rd_classes">';
//   str += '<option class="p-dropdown__item" value="1">PG(X)</option>';
//   str += '<option class="p-dropdown__item" value="1">PG(Y)</option>';
//   str += '<option class="p-dropdown__item" value="1">PG(Z)</option>';
//   str += '</select>';
//
//   return str;
// }
//### セレクトボックスと同じデータの添え字を返す ###//
function select_3rd_classes(_3rd_class_name) {
  var array = ["PG(X)", "PG(Y)", "PG(Z)"]; //### データ ###//
  for (var i = 0; i < array.length; i++) {
    if (array[i] == _3rd_class_name) return i; //### 添え字を返す ###//
  }
}


//### ２，３年用 ###//
//###############################################//
//### "2"次クラスのセレクトボックスを生成するメソッド ###//
//### admin_select_class() にて使用			   ###//
//### 高度、応用、基本（なしあり）用			   ###//
//###############################################//
// function return_4rd_classes(stu_id) {
//   var str = '';
//   str += "<select class="p-dropdown name=" + stu_id + ">";
//   str += '<option class="p-dropdown__item" value="1">高度</option>';
//   str += '<option class="p-dropdown__item" value="1">応用</option>';
//   str += '<option class="p-dropdown__item" value="1">基本（あり）</option>';
//   str += '<option class="p-dropdown__item" value="1">基本（なし）</option>';
//   str += '</select>';
//
//   return str;
// }
// //### セレクトボックスと同じデータの添え字を返す ###//
// function select_4rd_classes(_4rd_class_name) {
//   var array = ["高度", "応用", "基本（あり）", "基本（なし）"]; //### データ ###//
//   for (var i = 0; i < array.length; i++) {
//     if (array[i] == _4rd_class_name) return i; //### 添え字を返す ###//
//   }
// }



//### クラス編集関連 おわり ###//
//### _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ ###//



//***	Admin : クラス編集->編集ボタン押下時の処理	***//
function edit_submit() {
  console.log('call edit_submit()');

  // 取得データ格納用配列用意
  var stu_id = [];
  var pri_class_id = [];
  var sec_class_id = [];
  var third_class_id = [];
  // var fourth_class_id = [];

  // 作業用変数
  var selectbox;
  var selectNum;
  var check = 0;
  /***
		 テーブルタグをスクレイピングして値を取り出す
 ***/
  var table = document.getElementById('student-edit');
  for (var i = 1; i < table.rows.length; i++) {
    // チェックされた行を取得
    if (table.rows[i].cells[0].children[0].checked) {
      check++;
      // 取得データ格納用配列にそれぞれを格納していく
      // 学籍番号取得
      stu_id.push(table.rows[i].cells[1].innerText);
      // 選択中のpri取得準備
      // selectbox = table.rows[i].cells[3].children[0];
      // selectNum = selectbox.selectedIndex;
      // // 選択中のpri取得
      // pri_class_id.push(selectbox.options[selectNum].value);
      // 選択中のsec取得準備
      selectbox = table.rows[i].cells[4].children[0];
      selectNum = selectbox.selectedIndex;
      // 選択中のsec取得
      sec_class_id.push(selectbox.options[selectNum].text);
      // 選択中のthird取得準備
      selectbox = table.rows[i].cells[5].children[0];
      selectNum = selectbox.selectedIndex;
      // 選択中のthird取得
      third_class_id.push(selectbox.options[selectNum].text);
      // fourth取得
      // fourth_class_id.push(table.rows[i].cells[6].innerText);
    }
  }
  // var val = $('[name=student] option:selected').text();
  var years = $('[name=edit_years] option:selected').text();
  var classes = $('[name=edit_classes] option:selected').text();
  var edit_class = years + classes;
  console.log(edit_class);


  var students = [];
  // チェック数分繰り返す
  for (var i = 0; i < check; i++) {
    var student = {
      'stu_id': stu_id[i],
      'pri_class_id': pri_class_id[i],
      'sec_class_id': sec_class_id[i],
      '3th_class_id': third_class_id[i],
      '4th_class_id': '0000'
    }
    students.push(student);
  }
  var arr = {
    years: edit_class,
    students: students,
    count: check
  };

  return arr;
}

//***	Admin:学生削除->削除ボタン押下時の処理	***//
function stuDelete() {
  // <table>のidで参照
  var table = document.getElementById('delete');
  // 格納用
  var target = [];
  // ヘッダー（i=0）を除く行を順番に見ていく
  for (var i = 1, j = 0; i < table.rows.length; i++, j++) {
    // 現在行のチェックボックスが選択状態である場合
    // children[0]は<td>の（最初の子要素=<input type='checkbox'>）を見ている
    if (table.rows[i].cells[0].children[0].checked) {
      // key付けるンゴ
      // 現在行の、（cells[1]=学籍番号）の文字列取得
      var arr = {
        stu_id: target[j] = table.rows[i].cells[1].innerText
      }
      // 確認用
      console.log(arr);
    }
  }
}
//***	CSV出力用テーブル表示関数	***//
/*
[
  {
    "att_date": "2017-06-01",
    "att_period": "2",
    "att_attend": "1",
    "sub_id": "0001",
    "sub_name": "システム構築",
    "stu_id": "5151021",
    "stu_name": "大馬 裕一",
    "stu_rubi": "おおばゆういち",
    "class_id": "0001",
    "class_name": "3B",
    "pri_tea_id": "0001",
    "tea_name": "test"
  },
  {
    "att_date": "2017-06-02",
    "att_period": "1",
    "att_attend": "1",
    "sub_id": "0001",
    "sub_name": "システム構築",
    "stu_id": "5151021",
    "stu_name": "大馬 裕一",
    "stu_rubi": "おおばゆういち",
    "class_id": "0001",
    "class_name": "3B",
    "pri_tea_id": "0001",
    "tea_name": "test"
  }
]
*/

//*** 学生新規登録のアップロードボタン押下時の処理 ***//
function admin_new_regist() {
  'use strict';
  console.log('call admin_page->admin_new_regist()');
}

// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//
//    自作関数群
//
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
/***
    CSVダウンロード画面の選択項目をオブジェクト化して返す
***/
var retSelectedInfo = function() {
  var _class = $('[name=class] option:selected').text();
  var _subject = $('[name=subject] option:selected').text().split(":");
  var _startMonth = $('[name=start_month] option:selected').text();
  var _startDay = $('[name=start_day] option:selected').text();
  var _endMonth = $('[name=end_month] option:selected').text();
  var _endDay = $('[name=end_day] option:selected').text();
  var now = new Date();
  var year = now.getYear() + 1900;

  var sm = Number(_startMonth);
  var sd = Number(_startDay);
  var em = Number(_endMonth);
  var ed = Number(_endDay);

  return val = {
    class: _class,
    subject: _subject[0],
    startDay: year + "/" + sm.format("0", 2) + "/" + sd.format("0", 2),
    endDay: year + "/" + em.format("0", 2) + "/" + ed.format("0", 2)
  }
};
/***
  デバッグ用
***/
var callMethod = function(text) {
  console.log("----------------------");
  console.log(text);
  console.log("----------------------");
};
/***
Javascriptで文字列の０埋め、空白で右寄せでフォーマットする関数
***/
Number.prototype.format = function(char, cnt) {
  return (Array(cnt).fill(char).join("") + this.valueOf()).substr(-1 * cnt);
};

var ACCESSTOKEN = '?accessToken=fad'

function deleteStudent() {
  'use strict'
  console.log("click admin_page->deleteStudent()");
  var tbody = document.getElementById('delete_students');
  for (var i = 0, rowlen = tbody.rows.length; i < rowlen; i++) {
    for (var j = 0, collen = tbody.rows[i].cells.length; j < collen; j++) {
      var cell = tbody.rows[i].cells[j];
    }
  }
}

//*** 選択したクラスの、科目JSONを返す ***/
function retsubject() {
  console.log("call ret_subject()")

  // 選択された項目を取得
  var val = $('[name=admin_subject] option:selected').val();
  var classes = $('[name=admin_classes] option:selected').val();

  
  var args = val + classes;
  // ■■■■■対策クラスが選択されたなら、対策用の処理に飛ぶ■■■■■
  // console.log(val);
  // if (val.indexOf("対策") > -1) {
  //   ret_subject_taisaku(val);

  //   return; // 以降の処理は対策時は不要なので返す
  // }
  // ■■■■■ここまで 対策クラスが選択されたなら、対策用の処理に飛ぶ■■■■■

  console.log(args) // 0001

  // _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
  //  HTTP GET REQUEST
  // _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
  // GET       /teachers/management/subject2/:class_id
  var rest_uri = 'http://api.network.hsc.ac.jp:9090'
  var url_ret_subject = rest_uri + '/teachers/management/subject2/' + args + '?accessToken=da';

  console.log(url_ret_subject);
  var request = new XMLHttpRequest();
  request.open('GET', url_ret_subject);
  // 一年生以外は、これで取得する
  request.onreadystatechange = function() {
    if (request.readyState != 4) {
      // リクエスト中
    } else if (request.status != 200) {
      // request failed
      console.log('request failed');
    } else {
      // 取得成功 -- > ＪＳＯＮをオブジェクト化する
      var json = JSON.parse(request.responseText);
      console.log(json);

      // HTML 組み立て
      var div = document.getElementById('select_box_subject');
      var str = "";
      str += "<select name=ret_subject class=c-dropdown>";
      for (var i = 0; i < json.length; i++) {
        var data = json[i.toString()];
        console.log(data)
        str += "<option class=c-dropdown__item value=" + data['sub_id'] + ">" + data['sub_name'] + "</option>";
      }
      str += "</select>";

      div.innerHTML = str;
    }
  }
  request.send(null);
  // return json;
}

// // 対策時のCSV生成用メソッド taisaku csv
// function ret_subject_taisaku(subName){
//   console.log('function ret_subject_taisaku(subName)');
//   console.log(subName);

//   var rest_uri = 'http://api.network.hsc.ac.jp:9090'
//   var url_ret_subject = rest_uri + '/teachers/management/subject_taisaku/' + subName + '?accessToken=da';
//   console.log(url_ret_subject);
//   var request = new XMLHttpRequest();
//   request.open('GET', url_ret_subject);
//   request.onreadystatechange = function() {
//     // 取得成功 -- > ＪＳＯＮをオブジェクト化する
//     var json = JSON.parse(request.responseText);
//     console.log(json);

//     // HTML 組み立て
//     var div = document.getElementById('select_box_subject');
//     var str = "";
//     str += "<select name=ret_subject class=c-dropdown>";
//     for (var i = 0; i < json.length; i++) {
//       var data = json[i.toString()];
//       console.log(data)
//       str += "<option class=c-dropdown__item value=" + data['sub_id'] + ">" + data['sub_name'] + "</option>";
//     }
//     str += "</select>";

//     div.innerHTML = str;
//   }
//   request.send(null);


// }

function deleteTimeSelect() {
  var URLDELSERCH = REST_API_URI + '/teachers/timetable/deletetimetables' + ACCESSTOKEN
  var DELTD = '<td class="c-table__cell">'
  var ENDTD = '</td>'
  var yearInd = document.selectDelete.years.selectedIndex;
  var periInd = document.selectDelete.periods.selectedIndex;
  var delYear = document.selectDelete.years.options[yearInd].value;
  var delperi = document.selectDelete.periods.options[periInd].value;
  var flg = '0';
  var deluri = URLDELSERCH + '&sub_year=' + delYear + '&sub_period=' + delperi + '&flg=' + flg;
  console.log(delYear);
  console.log(delperi);
  console.log(deluri);
  var delrequ = new XMLHttpRequest();
  var deldiv = document.getElementById('deletetimetable');
  var delhtml = '<table id="del-time" class="c-table" border="1">';
  delhtml += '<tr><th class="c-table__text">曜日</th><th class="c-table__text">時限</th><th class="c-table__text">クラス</th><th class="c-table__text">担当教員</th><th class="c-table__text">科目名</th><th class="c-table__text">教場</th></tr>';

  delrequ.open('GET', deluri);
  delrequ.onreadystatechange = function() {
    if (delrequ.readyState != 4) {

    } else if (delrequ.status != 200) {

    } else {
      var deljson = JSON.parse(delrequ.responseText);
      console.log(deljson);
      for (var i = 0; i < deljson.length; i++) {
        delhtml += '<tr>';
        delhtml += DELTD + deljson[i]["tt_dayofweek"] + ENDTD;
        delhtml += DELTD + deljson[i]["tt_period"] + ENDTD;
        delhtml += DELTD + deljson[i]["class_id"] + ENDTD;
        delhtml += DELTD + deljson[i]["pri_tea_id"] + ENDTD;
        delhtml += DELTD + deljson[i]["sub_id"] + ENDTD;
        delhtml += DELTD + deljson[i]["room_id"] + ENDTD;
        delhtml += '</tr>';
      }
      delhtml += '</table>';
      console.log(delhtml)
      deldiv.innerHTML = delhtml;
    }
  }
  delrequ.send(null);
}

function fileSelect(target) {
  document.getElementById(target).disabled = false;
}

// sub_file.addEventListener('change', function(e) {
// 	'use strict'
//
// 	var subData = e.target.files[0];
// 	var subreader = new FileReader();
// 	subreader.onerror = function() {
// 		alert('お前を蝋人形にしてやろうか')
// 	}
// 	subreader.onload = function() {
//
// 		var subline = subreader.result.split("\n");
//
// 		var subitem = [];
// 		for (var i = 0; i < subline.length; i++) {
//
// 			subitem[i] = subline[i].split(",");
// 		}
//
// 		var subitems = JSON.stringify(subitem);
//
// 	}
// 	subreader.readAsText(subData);
// }, false);
//
// time_file.addEventListener('change', function(e) {
// 	'use strict'
//
// 	var timeData = e.target.files[0];
// 	var timereader = new FileReader();
// 	timereader.onerror = function() {
// 		alert('お前を蝋人形にしてやろうか')
// 	}
// 	timereader.onload = function() {
//
// 		var timeline = timereader.result.split("\n");
//
// 		var timeitem = [];
// 		for (var i = 0; i < timeline.length; i++) {
//
// 			timeitem[i] = timeline[i].split(",");
// 		}
//
// 		var timeitems = JSON.stringify(timeitem);
//
// 	}
// 	timereader.readAsText(timeData);
// }, false);
//
// function sendTableJson() {
// 	'use strict'
// 	teacherSend();
// 	subjectSend();
// 	timeSend();
// }
//
// function teacherSend() {
// 	// $.ajax({
// 	//   url:'http://api.network.hsc.ac.jp:9090/teachers/timetable/subjects'
// 	//   type : "POST",
// 	//   dataType:'json',
// 	//   scriptCharset:'utf-8',
// 	//   data:JSON.stringify(tealist[0]),
// 	//   success : function () {
// 	//     console.log('ok');
// 	//   },
// 	//   error : function () {
// 	//     console.log('ng');
// 	//   }
// 	// });
// }
//
// function subjectSend() {
// 	// $.ajax({
// 	//   url:'http://api.network.hsc.ac.jp:9090/teachers/timetable/teachers'
// 	//   type : "POST",
// 	//   dataType:'json',
// 	//   scriptCharset:'utf-8',
// 	//   data:JSON.stringify(sublist[0]),
// 	//   success : function () {
// 	//     console.log('ok');
// 	//   },
// 	//   error : function () {
// 	//     console.log('ng');
// 	//   }
// 	// });
// }
//
// function timeSend() {
// 	// $.ajax({
// 	//   url:'http://api.network.hsc.ac.jp:9090/teachers/timetable/timetables'
// 	//   type : "POST",
// 	//   dataType:'json',
// 	//   scriptCharset:'utf-8',
// 	//   data:JSON.stringify(timelist[0]),
// 	//   success : function () {
// 	//     console.log('ok');
// 	//   },
// 	//   error : function () {
// 	//     console.log('ng');
// 	//   }
// 	// });
// }

// 確認ダイアログ
function disp(executeId, msg) {
  if (executeId == 'stUpdateBtn') { // 編集押されたとき
    if (window.confirm(msg + '処理を実行します')) {
      studentUpdate();
    } else {
      window.alert('キャンセルしました');
      console.log('キャンセルしました');
    }
  } else if (executeId == 'promotionBtn') { // 進級押されたとき
    if (window.confirm(msg + '処理を実行します')) {
      window.alert(msg + '成功しました');
    } else {
      window.alert('キャンセルしました');
    }
  }
}

// 進級ボタン押したときの処理
function classPromotion() {
  console.log('call classPromotion');

  // 作業用変数
  var selectbox;
  var selectNum;

  // 学年取得
  selectbox = document.getElementById('js-edit__year');
  selectNum = selectbox.selectedIndex;
  var promYear = selectbox.options[selectNum].value;

  // クラス取得
  selectbox = document.getElementById('js-edit__classes');
  selectNum = selectbox.selectedIndex;
  var promClasses = selectbox.options[selectNum].innerText;

  // 合体！！
  var promTarget = promYear + promClasses;
  console.log(promTarget);
}

// チェック数格納用
checkNum = 0;

// 全選択ボタンチェック時の処理
function allChecked() {
  console.log('call allChecked OK');
  var checks = document.adminEdit.st01;
  console.log('call allChecked 2');
  var check = document.adminEdit.allCheck.checked;
  console.log('call allChecked 3');

  for (var i = 0; i < checks.length; i++) {
    document.adminEdit.st01[i].checked = check;
    // チェック数の判定
    if (document.adminEdit.st01[i].checked == true) {
      checkNum = checks.length;
    } else {
      checkNum = 0;
    }
  }
  console.log('allChecked:' + checkNum);
  editBtn();
}

// 各々のチェックボックスクリック時の処理
function disChecked(obj) {
  var checks = document.adminEdit.st01;
  // チェックついたらcheckNumに加算 外れたら減算
  if (obj.checked) {
    checkNum++;
  } else {
    checkNum--;
  }

  // 一つでもチェックがついてないと全選択ボタンのチェックを外す
  for (var i = 0; i < checks.length; i++) {
    if (checks[i].checked == false) { // チェックしてないやつがおる
      document.adminEdit.allCheck.checked = false;
    } else { // 全部チェックしとる
      if (checkNum == checks.length) {
        document.adminEdit.allCheck.checked = true;
      }
    }
  }
  console.log('checked' + checkNum);
  editBtn();
}

// 進級ボタンの有効化無効化
function promotionBtn() {
  // 進級許可ボタンがオンだったら
  if (document.getElementById('promPermission').checked) {
    // 進級ボタンを有効化
    document.getElementById('promotionBtn').disabled = false;
  } else {
    document.getElementById('promotionBtn').disabled = true;
  }
}

// クラス編集ボタンの有効化無効化
function editBtn() {
  if (0 < checkNum) { // 一個でもチェックがある
    // 編集ボタン有効化
    document.getElementById('stUpdateBtn').disabled = false;
  } else { // チェックが一つもない
    // 編集ボタン無効化
    document.getElementById('stUpdateBtn').disabled = true;
  }
}

window.onload = editBtn;
window.onload = promotionBtn;

