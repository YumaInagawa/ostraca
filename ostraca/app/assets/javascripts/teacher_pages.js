// var REST_API_URI = '//api.network.hsc.ac.jp:9090'
var ACCESSTOKEN = '?accessToken=fad'
//*** ---出席状況---　選択した学年、クラスの学生JSONをGETリクエスト ***//
function select_classes(){
  'use strict'
  console.log('call teacher_pages->select_classes()')

  var years = $('[name=situation_years] option:selected').text();       //*** 1,2,3 ***//
  var classes = $('[name=situation_class] option:selected').text();   //*** A,B ***//

  //### 学生セレクトボックスの中身を全削除する ###//
  var sl = document.getElementById('teacher_students');
  if (sl.hasChildNodes()){
    while (sl.childNodes.length > 0){
      sl.removeChild(sl.firstChild)
    }
  }

  //*** REST->retHome2(accessToken, className) ***//
  //*** GET       /teachers/class/className?className=XXX&accessToken=XXX ***//
  var url = REST_API_URI + '/teachers/class/className?className=' + years + classes + '&accessToken=fas';
  console.log(url);

  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.onreadystatechange = function() {
    if (request.readyState != 4){
      // リクエスト中
    }
    else if (request.status != 200){
      // request failed
      console.log('request failed')
    } else {
      var json = JSON.parse(request.responseText);
      console.log(json);

      var div = document.getElementById('div2');
      var str = "";
      str = '<select class="c-dropdown" name="student" id="teacher_students" onchange="te_select_students()">';
      str += '<option class="c-dropdown__item" value="">==生徒を選択してください==</option>';
      for (var i = 0; i < json.length; i++){
        var data = json[i.toString()];
        console.log(data);
        str += '<option class="c-dropdown__item" value="">' + data['stu_id'] + ':' + data['stu_name'] + '</option>';
      }
      str += '</select>'
      div.innerHTML = str;
    }
  };
  request.send(null);


}
//### ---出席状況詳細--- ###//
function te_select_students(){
  console.log('call te_select_students()');
  'use strict';

  var val = $('[name=student] option:selected').text();
  var stu_id = val.split(":");
  var URL_SELECT_STUDENT = REST_API_URI + '/teachers/class/students/' + stu_id[0] + ACCESSTOKEN;
  console.log(URL_SELECT_STUDENT);

  // _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
  //  HTTP GET REQUEST
  // _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
  var request = new XMLHttpRequest();
  request.open('GET', URL_SELECT_STUDENT);
  request.onreadystatechange = function() {
    if (request.readyState != 4){
      // リクエスト中
    }
    else if (request.status != 200){
      // request failed
    } else {
      // 取得成功 -- > ＪＳＯＮをオブジェクト化する
      // _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
      //  JSON --> JavascriptObject
      // _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

      // 欠席数と遅刻数を追加
      // restでのjsonはv_stu_attend_status
      var json = JSON.parse(request.responseText);
      console.log(json);
      console.log(json.length);               // 左と同義 var len = Object.keys(json).length;
      /***************************************
          HTML の組み立て
      ****************************************/
      var div = document.getElementById('div3');
      var str = "";
      str += "<table class=p-situation>";
      str += "<thead class=p-situation__head>";
      str += "<tr class=p-situation__block>";
      str += "<th class=p-situation__item p-situation__item--term>科目名</th>";
      str += "<th class=p-situation__item p-situation__item--term>出席回数</th>";
      str += "<th class=p-situation__item p-situation__item--term>遅刻回数</th>";
      str += "<th class=p-situation__item p-situation__item--term>欠席回数</th>";
      str += "<th class=p-situation__item p-situation__item--term>公欠回数</th>";
      str += "<th class=p-situation__item p-situation__item--term>総数</th>";
      str += "<th class=p-situation__item p-situation__item--term>出席率</th>";
      str += "</thead>";
      str += "<tbody class=p-situation__body>";
      str += "<tr class=p-situation__block>";
      // オブジェクト配列を分解する
      for (var i = 0; i < json.length; i++)
      {
        var data = json[i.toString()];
        console.log(data);
        // key : value(data[key])
        //### 科目名 ###//
        str += "<td class=p-situation__item p-situation__item--term>" + data['sub_name'] + "</td>";
        //### 出席回数 ###//
        str += "<td class=p-situation__item p-situation__item--term>" + data['attend'] + "</td>";
        //### 遅刻回数 ###//
        str += "<td class=p-situation__item p-situation__item--term>" + data['late'] + "</td>";
        //### 欠席回数 ###//
        str += "<td class=p-situation__item p-situation__item--term>" + data['absence'] + "</td>";
        //### 公欠回数 ###//
        str += "<td class=p-situation__item p-situation__item--term>" + data['publicHoliday'] + "</td>";
        //### 科目の総数 ###//
        str += "<td class=p-situation__item p-situation__item--term>" + data['total_lesson'] + "</td>";
        //### 出席率 ###//
        str += "<td class=p-situation__item p-situation__item--term>" + data['attend_rate'] + " % " + "</td>";
        str += "</tr>";
      }
      str += "</table>";
      div.innerHTML = str;
    }
  };
  request.send(null);
  // htmlへ埋め込み
}
//*** 対策授業用 の クラスが選択されたときの処理 ***//
function select_class_taisaku(){
  'use strict'
  console.log("call select_class_taisaku()");

  var sub_id = $('[name=subject] option:selected').text().split(":")[0];      //### 科目ID ###//
  // var classId = $('[name=class_name] option:selected').text().split(":")[0];  //*** クラスID ***//
  // var period = $('[name=period] option:selected').text()[0] // 時限
  var period = $("[name=period-group]:checked").val();
  var classId = $("[name=taisaku-group]:checked").val();
  var youbi = $('[name=youbi] option:selected').text().split(":")[0] // 何曜日か １：月・・・

  var selectBox = document.getElementById('class_name');
  // var target = selectBox.options[selectBox.selectedIndex].value;
  // console.log("target : " + target)
  console.log(classId);

  //### REST->retStudentList2()  ###//
  var URL_SELECT_SUBJECT = REST_API_URI + '/teachers/class/studentList/'+ sub_id + '/' + classId + '/' + period + ACCESSTOKEN + '&youbi=' + youbi;
  console.log(URL_SELECT_SUBJECT);

  var request = new XMLHttpRequest();
  request.open('GET', URL_SELECT_SUBJECT);
  request.onreadystatechange = function() {
    if (request.readyState != 4){
      // リクエスト中
    }
    else if (request.status != 200){
      // request failed
      console.log("connection failed");
    } else {
      // 取得成功 -- > ＪＳＯＮをオブジェクト化する
      var result = JSON.parse(request.responseText);
      _students = result;
      console.log(result);
      /***************************************
          HTML の組み立て
      ****************************************/
      var div = document.getElementById('st');
      var str = '';
      // TODO: 学籍番号をとれない　dt label は、formでPOSTできない？
      for (var i = 0; i < result.length; i++){
        var r = result[i.toString()];
        str += "<dl class= c-checklist__nameblock  id=student>";
        str += "<dt class= c-checklist__number value=" + r['stu_id'] + ">" + r['stu_id'] + "</dt>";
        str += "<dd class= c-checklist__name >" + r['stu_name'] + "</dd>";
        // str += "<label class= c-checklist__name name=" + r['stu_id'] + ">" + r['stu_id'] + "</label>";
        str += "</dl>"
        str += "<div class= c-checklist__btnblock >" ;
        str += "<input type=radio name=" + r['stu_id'] +  " value=1 checked id=st" + i.toString() + "-attend class=c-checklist__radio>";
        str += "<label for=st" + i.toString() + "-attend class=c-checklist__btn>出席</label>";
        str += "<input type=radio name=" + r['stu_id'] + " value=2  id=st" + i.toString() + "-late class=c-checklist__radio>";
        str += "<label for=st" + i.toString() + "-late class=c-checklist__btn>遅刻</label>";
        str += "<input type=radio name=" + r['stu_id'] + " value=3 id=st" + i.toString() + "-absence class=c-checklist__radio>";
        str += "<label for=st" + i.toString() + "-absence class=c-checklist__btn>欠席</label>";
        str += "<input type=radio name=" + r['stu_id'] + " value=4 id=st" + i.toString() + "-official class=c-checklist__radio>";
        str += "<label for= st" + i.toString() + "-official  class=c-checklist__btn>公欠</label>";
        str += "</div>";
      }
      div.innerHTML = str;
    }
  };
  request.send(null);
}
function select_class_taisaku2(){
  'use strict'
  console.log("call select_class_taisaku2()");

  var sub_id = $('[name=subject] option:selected').text().split(":")[0];      //### 科目ID ###//
  // var classId = $('[name=class_name] option:selected').text().split(":")[0];  //*** クラスID ***//
  // var period = $('[name=period] option:selected').text()[0] // 時限
  var period = $("[name=period-group]:checked").val();
  var classId = $("[name=sentaku-group]:checked").val();
  var youbi = $('[name=youbi] option:selected').text().split(":")[0] // 何曜日か １：月・・・

  var selectBox = document.getElementById('class_name');
  // var target = selectBox.options[selectBox.selectedIndex].value;
  // console.log("target : " + target)
  console.log(classId);

  //### REST->retStudentList2()  ###//
  var URL_SELECT_SUBJECT = REST_API_URI + '/teachers/class/studentList/'+ sub_id + '/' + classId + '/' + period + ACCESSTOKEN + '&youbi=' + youbi;
  console.log(URL_SELECT_SUBJECT);

  var request = new XMLHttpRequest();
  request.open('GET', URL_SELECT_SUBJECT);
  request.onreadystatechange = function() {
    if (request.readyState != 4){
      // リクエスト中
    }
    else if (request.status != 200){
      // request failed
      console.log("connection failed");
    } else {
      // 取得成功 -- > ＪＳＯＮをオブジェクト化する
      var result = JSON.parse(request.responseText);
      _students = result;
      console.log(result);
      /***************************************
          HTML の組み立て
      ****************************************/
      var div = document.getElementById('st');
      var str = '';
      // TODO: 学籍番号をとれない　dt label は、formでPOSTできない？
      for (var i = 0; i < result.length; i++){
        var r = result[i.toString()];
        str += "<dl class= c-checklist__nameblock  id=student>";
        str += "<dt class= c-checklist__number value=" + r['stu_id'] + ">" + r['stu_id'] + "</dt>";
        str += "<dd class= c-checklist__name >" + r['stu_name'] + "</dd>";
        // str += "<label class= c-checklist__name name=" + r['stu_id'] + ">" + r['stu_id'] + "</label>";
        str += "</dl>"
        str += "<div class= c-checklist__btnblock >" ;
        str += "<input type=radio name=" + r['stu_id'] +  " value=1 checked id=st" + i.toString() + "-attend class=c-checklist__radio>";
        str += "<label for=st" + i.toString() + "-attend class=c-checklist__btn>出席</label>";
        str += "<input type=radio name=" + r['stu_id'] + " value=2  id=st" + i.toString() + "-late class=c-checklist__radio>";
        str += "<label for=st" + i.toString() + "-late class=c-checklist__btn>遅刻</label>";
        str += "<input type=radio name=" + r['stu_id'] + " value=3 id=st" + i.toString() + "-absence class=c-checklist__radio>";
        str += "<label for=st" + i.toString() + "-absence class=c-checklist__btn>欠席</label>";
        str += "<input type=radio name=" + r['stu_id'] + " value=4 id=st" + i.toString() + "-official class=c-checklist__radio>";
        str += "<label for= st" + i.toString() + "-official  class=c-checklist__btn>公欠</label>";
        str += "</div>";
      }
      div.innerHTML = str;
    }
  };
  request.send(null);
}



//### "選択授業"が選択された時の処理 ###//
function select_class_sentaku(){
  'use strict'
  console.log("call select_class_SENTAKU()");

    var sub_id = $('[name=subject] option:selected').text().split(":")[0];      //### 科目ID ###//
    // var classId = $('[name=class_name] option:selected').text().split(":")[0];  //*** クラスID ***//
    // var period = $('[name=period] option:selected').text()[0] // 時限
    var period = $("[name=period-group]:checked").val();
    var classId = $("[name=sentaku-group]:checked").val();
    var youbi = $('[name=youbi] option:selected').text().split(":")[0] // 何曜日か １：月・・・

    var selectBox = document.getElementById('class_name');
    // var target = selectBox.options[selectBox.selectedIndex].value;
    // console.log("target : " + target)
    console.log(classId);

    //### REST->retStudentListSentaku() 3th_classを検索する ###//
    var URL_SELECT_SUBJECT = REST_API_URI + '/teachers/class/studentList/sentaku/'+ sub_id + '/' + classId + '/' + period + ACCESSTOKEN + '&youbi=' + youbi;
    console.log(URL_SELECT_SUBJECT);

    var request = new XMLHttpRequest();
    request.open('GET', URL_SELECT_SUBJECT);
    request.onreadystatechange = function() {
      if (request.readyState != 4){
        // リクエスト中
      }
      else if (request.status != 200){
        // request failed
        console.log("connection failed");
      } else {
        // 取得成功 -- > ＪＳＯＮをオブジェクト化する
        var result = JSON.parse(request.responseText);
        _students = result;
        console.log(result);
        /***************************************
            HTML の組み立て
        ****************************************/
        var div = document.getElementById('st');
        var str = '';
        // TODO: 学籍番号をとれない　dt label は、formでPOSTできない？
        for (var i = 0; i < result.length; i++){
          var r = result[i.toString()];
          str += "<dl class= c-checklist__nameblock  id=student>";
          str += "<dt class= c-checklist__number value=" + r['stu_id'] + ">" + r['stu_id'] + "</dt>";
          str += "<dd class= c-checklist__name >" + r['stu_name'] + "</dd>";
          // str += "<label class= c-checklist__name name=" + r['stu_id'] + ">" + r['stu_id'] + "</label>";
          str += "</dl>"
          str += "<div class= c-checklist__btnblock >" ;
          str += "<input type=radio name=" + r['stu_id'] +  " value=1 checked id=st" + i.toString() + "-attend class=c-checklist__radio>";
          str += "<label for=st" + i.toString() + "-attend class=c-checklist__btn>出席</label>";
          str += "<input type=radio name=" + r['stu_id'] + " value=2  id=st" + i.toString() + "-late class=c-checklist__radio>";
          str += "<label for=st" + i.toString() + "-late class=c-checklist__btn>遅刻</label>";
          str += "<input type=radio name=" + r['stu_id'] + " value=3 id=st" + i.toString() + "-absence class=c-checklist__radio>";
          str += "<label for=st" + i.toString() + "-absence class=c-checklist__btn>欠席</label>";
          str += "<input type=radio name=" + r['stu_id'] + " value=4 id=st" + i.toString() + "-official class=c-checklist__radio>";
          str += "<label for= st" + i.toString() + "-official  class=c-checklist__btn>公欠</label>";
          str += "</div>";
        }
        div.innerHTML = str;
      }
    };
    request.send(null);

}

//### 教員：選択した科目で、出席すべき学生をマッピングする関数 ###//
_students = '';   // グローバル変数
function subject_select(){
  'use strict'

  console.log('call subject_select()');
  var sub_id = $('[name=subject] option:selected').text().split(":")[0];  //### 科目ID ###//
  var sub_name = $('[name=subject] option:selected').text().split(":")[1];//### 科目名 ###//
  var period = $("[name=period-group]:checked").val();
  var youbi = $('[name=youbi] option:selected').text().split(":")[0] // 何曜日か １：月・・・

  //*** 対策授業が選択されたなら・・・クラスXYZセレクトボックスを出現させる ***//
  if (sub_name == "a対策授業"){
    var str2 = '';
    var div = document.getElementById('class_name');
    // str2 += "<select class=c-dropdown name=class_name onclick=select_class_taisaku() >";
    // str2 += "<option class=c-dropdown__item value=" + "0007" + ">" + "X" + "</option>";
    // str2 += "<option class=c-dropdown__item value=" + "0008 " + ">" + "Y" + "</option>";
    // str2 += "<option class=c-dropdown__item value=" + "0009 " + ">" + "Z" + "</option>";
    // str2 += "</select>"
    str2 +='<p class="p-admin__text">クラス種別</p>'
    str2 += '<input type="radio" name="taisaku-group" value="X" checked id="X" class="c-checklist__radio" onclick="select_class_taisaku()"><label for="X" class="c-checklist__btn">X</label>';
    str2 += '<input type="radio" name="taisaku-group" value="Y" id="Y" class="c-checklist__radio" onclick="select_class_taisaku()"><label for="Y" class="c-checklist__btn">Y</label>';
    str2 += '<input type="radio" name="taisaku-group" value="Z" id="Z" class="c-checklist__radio" onclick="select_class_taisaku()"><label for="Z" class="c-checklist__btn">Z</label>';
    str2 += '<input type="radio" name="taisaku-group" value="基本対策1" id="none" class="c-checklist__radio" onclick="select_class_taisaku()"><label for="none" class="c-checklist__btn">基本対策1</label>';
    str2 += '<input type="radio" name="taisaku-group" value="基本対策2" id="ari" class="c-checklist__radio" onclick="select_class_taisaku()"><label for="ari" class="c-checklist__btn">基本対策2</label>';
    str2 += '<input type="radio" name="taisaku-group" value="応用対策" id="ouyou" class="c-checklist__radio" onclick="select_class_taisaku()"><label for="ouyou" class="c-checklist__btn">応用対策</label>';
    str2 += '<input type="radio" name="taisaku-group" value="高度対策" id="koudo" class="c-checklist__radio" onclick="select_class_taisaku()"><label for="koudo" class="c-checklist__btn">高度対策</label>';

    div.innerHTML = str2;
    return;   //*** 処理を抜ける ***//
  }
  else if (sub_name == "b選択授業"){  //### 選択授業が選択されたなら ###//
    //### RESTに対して、選択授業とおなじ曜日、時限（本来置き換わるべき科目JSONを返す） ###//
    var str2 = '';
    var div = document.getElementById('class_name');

    //### TODO : ハードコーディング 暫定 ###//
    str2 +='<p class="p-admin__text">クラス種別</p>'
    str2 += '<input type="radio" name="sentaku-group" value="2年選択1" checked id="aaa" class="c-checklist__radio" onclick="select_class_sentaku()"><label for="aaa" class="c-checklist__btn">2年選択1</label>';
    str2 += '<input type="radio" name="sentaku-group" value="2年選択2" id="bbb" class="c-checklist__radio" onclick="select_class_sentaku()"><label for="bbb" class="c-checklist__btn">2年選択2</label>';
    str2 += '<input type="radio" name="sentaku-group" value="2年選択3" id="ccc" class="c-checklist__radio" onclick="select_class_sentaku()"><label for="ccc" class="c-checklist__btn">2年選択3</label>';
    div.innerHTML = str2;
    return;   //*** 処理を抜ける ***//
  }
  else {
    var str2 = '';
    var div = document.getElementById('class_name');
    div.innerHTML = str2;
  }

  //### RESTへGETリクエスト --- TeacherController->retStudentLists()使用 ---  ###//
  //### /teachers/class/studentList/:sub_id/:period?youbi=XXX&period=XXX                         ###//
  //### 科目ID と 時限 指定で、 ###//
  var URL_SELECT_SUBJECT = REST_API_URI + '/teachers/class/studentList/'+ sub_id + ACCESSTOKEN + '&youbi=' + youbi + '&period=' + period;
  console.log(URL_SELECT_SUBJECT);

  var request = new XMLHttpRequest();
  request.open('GET', URL_SELECT_SUBJECT);
  request.onreadystatechange = function() {
    if (request.readyState != 4){
      // リクエスト中
    }
    else if (request.status != 200){
      // request failed
      console.log("connection failed");
    } else {
      // 取得成功 -- > ＪＳＯＮをオブジェクト化する
      var result = JSON.parse(request.responseText);
      _students = result;
      console.log(result);
      /***************************************
          HTML の組み立て
      ****************************************/
      var div = document.getElementById('st');
      var str = '';
      // TODO: 学籍番号をとれない　dt label は、formでPOSTできない？
      for (var i = 0; i < result.length; i++){
        var r = result[i.toString()];
        str += "<dl class= c-checklist__nameblock  id=student>";
        str += "<dt class= c-checklist__number value=" + r['stu_id'] + ">" + r['stu_id'] + "</dt>";
        str += "<dd class= c-checklist__name >" + r['stu_name'] + "</dd>";
        // str += "<label class= c-checklist__name name=" + r['stu_id'] + ">" + r['stu_id'] + "</label>";
        str += "</dl>"
        str += "<div class= c-checklist__btnblock >" ;
        str += "<input type=radio name=" + r['stu_id'] +  " value=1 checked id=st" + i.toString() + "-attend class=c-checklist__radio>";
        str += "<label for=st" + i.toString() + "-attend class=c-checklist__btn>出席</label>";
        str += "<input type=radio name=" + r['stu_id'] + " value=2  id=st" + i.toString() + "-late class=c-checklist__radio>";
        str += "<label for=st" + i.toString() + "-late class=c-checklist__btn>遅刻</label>";
        str += "<input type=radio name=" + r['stu_id'] + " value=3 id=st" + i.toString() + "-absence class=c-checklist__radio>";
        str += "<label for=st" + i.toString() + "-absence class=c-checklist__btn>欠席</label>";
        str += "<input type=radio name=" + r['stu_id'] + " value=4 id=st" + i.toString() + "-official class=c-checklist__radio>";
        str += "<label for= st" + i.toString() + "-official  class=c-checklist__btn>公欠</label>";

        str += "</div>";
      }
      div.innerHTML = str;
    }
  };
  request.send(null);
}

/***
  教員：出席記録をRESTにPOSTする関数
  http://192.168.0.2:9000/teachers/class?accessToken=OOO
  {
  "common": {
  "att_date": "2017/07/09",
  "att_period": 1,
  "sub_id": "0001"
  },
  "students": [
    {
    "att_attend": 1,
    "stu_id": "5151021"
    },
    {
    "att_attend": 1,
    "stu_id": "5151002"
    }
  ]
}
***/
function insertAttendance() {
  'use strict'

  callMethod("call teacher_pages->insertAttendance()")
  // 出席記録の共通情報
  var common = retCommon();
  // 各学生の情報
  var students = retStudents();
  // 共通情報を、各学生の情報を連想配列として格納する
  var hashArray = {
    common : common,
    students : students
  }
  console.log('----- hashArray -----');
  console.log(hashArray);

  // Object-->JSON変換する
  var json = JSON.stringify(hashArray);
  console.log(json);
  // POSTする => これで、RESTに対してリクエストOK
  $.ajax({
    url: OSTRACA_URI + '/insert_attend',
    type : "POST",
    dataType:'json',
    scriptCharset:'utf-8',
    data:json,
    success : function () {
      console.log('success');
    },
    error : function () {
      console.log('error');
    }
  });

}

/***
  せんたくした時限の科目一覧JSONを受け取り、セレクトボックスを生成する
  /teachers/class/subject/:period?accessToken=fdadafd
***/
function selectPeriod(){
  'use strict'
  console.log("call teacher_pages->selectPeriod()");

  var youbi = $('[name=youbi] option:selected').text().split(":")[0] // 何曜日か １：月・・・
  // var period = $('[name=period] option:selected').text()[0] // "1"時限目
  var period = $("[name=period-group]:checked").val();
  console.log(period); // "1"
  var request = new XMLHttpRequest();
  //*** GET retSubject() ***/
  var uri = REST_API_URI + '/teachers/class/subject/' + period + '?accessToken=fda&youbi=' + youbi;
  console.log(uri);
  request.open('GET', uri);
  request.onreadystatechange = function() {
    if (request.readyState != 4){
      // リクエスト中
    }
    else if (request.status != 200){
      // request failed
      console.log("connection failed");
    } else {
      // 取得成功 -- > ＪＳＯＮをオブジェクト化する
      var result = JSON.parse(request.responseText);
      var div = document.getElementById('subject');
      var str = "";
      // console.log(result);
      str += '<select class="c-dropdown" name="subject" onclick="subject_select()">';
      for (var i = 0; i < result.length; i++)
      {
        var r = result[i];
        console.log(r);
        str += "<option value=" + r['sub_id'] + ":" + r['sub_name'] + ">" + r['sub_id'] + ":" + r['sub_name'] + "</option>";
      }
      str += '</select>';
      div.innerHTML = str;
    }
  };
  request.send(null);


}

// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//
//    デバッグ用
//
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
function test_show_time_table(){
  'use strict'
  console.log("call test_show_time_table()");

  var classes = $('[name=test_classes] option:selected').val();
  console.log(classes);

  var uri = REST_API_URI + '/students/timetables/class/' + classes;
  console.log(uri);
  var request = new XMLHttpRequest();
  request.open('GET', uri);
  request.onreadystatechange = function() {
    if (request.readyState != 4){
      // リクエスト中
    }
    else if (request.status != 200){
      // request failed
      console.log("connection failed");
    } else {
      // 取得成功 -- > ＪＳＯＮをオブジェクト化する
      var result = JSON.parse(request.responseText);
      console.log(result)
      var div = document.getElementById('test_class');
      var str = "";
      // console.log(result);
      str += '<table id="student-edit" class="c-timetable">';
      str += '<tbody class="c-timetable__box">';
      str += '<tr class="c-timetable__line c-timetable__line--header"><th class="c-timetable__item">月</th><th class="c-timetable__item">火</th><th class="c-timetable__item">水</th><th class="c-timetable__item">木</th><th class="c-timetable__item">金</th>';
      for (var i = 0; i < result.length; i++)
      {
        var r = result[i];
        console.log(r);
        console.log(r["subject"][i]);
        str += '<tr class="c-timetable__line">'
        str += '<td class="c-timetable__item">' + r["subject"][0] + '</td>'
        str += '<td class="c-timetable__item">' + r["subject"][1] + '</td>'
        str += '<td class="c-timetable__item">' + r["subject"][2] + '</td>'
        str += '<td class="c-timetable__item">' + r["subject"][3] + '</td>'
        str += '<td class="c-timetable__item">' + r["subject"][4] + '</td>'
        str += '</tr>'
      }
      str += '</tbody></table>';
      div.innerHTML = str;
    }
  };
  request.send(null);
}



// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//
//    自作関数群
//
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
/***
  出席記録共通部分の情報を返す関数
***/
var retCommon = function () {
  var sub_id = $('[name=subject] option:selected').text().split(":")[0];  // 科目ID
  var period = $('[name=period] option:selected').text().substring(0,1);  // 時限情報
  var now = new Date();
  var year = now.getYear() + 1900;
  var month = now.getMonth() + 1;
  var date = now.getDate();
  return common = {
    att_date : year + "/" + month.format("0", 2) + "/" + date.format("0", 2),
    att_period : period,
    sub_id : sub_id
  }
};
/***
  出席記録の記録された学生の情報配列を返す関数
***/
var retStudents = function () {
  var students = [];
  for (var i = 0; i < _students.length; i++)
  {
    var r = _students[i.toString()];
    var rb_st1 = document.getElementsByName('st' + i.toString());
    for (var j = 0; j < rb_st1.length; j++){
      if (rb_st1[j].checked){
        var student = {
          stu_id : r['stu_id'],
          att_attend : rb_st1[j].value
        }
        students.push(student);
      }
    }
  }
  return students;
}
/***
  デバッグ用
***/
var callMethod = function (text) {
  console.log("----------------------");
  console.log(text);
  console.log("----------------------");
}
/***
Javascriptで文字列の０埋め、空白で右寄せでフォーマットする関数
***/
Number.prototype.format = function(char, cnt){
  return (Array(cnt).fill(char).join("") + this.valueOf()).substr(-1*cnt);
}
