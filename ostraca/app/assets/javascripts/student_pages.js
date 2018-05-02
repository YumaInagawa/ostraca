function reportSend() {
  /* document + formのname + selectのname + selectedIndexで選択中の
  optionのvalueを取得する */
  // var num = '';
  // num = document.form.department.selectedIndex;
  // var department = document.form.department.options[num].value;
  // console.log('学科：' + department);

  // num = document.form.course.selectedIndex;
  // var course = document.form.course.options[num].value;
  // console.log('コース：' + course);

  // num = document.form.grade.selectedIndex;
  // var grade = document.form.grade.options[num].value;
  // console.log('学年' + grade);

  // num = document.form.group.selectedIndex;
  // var group = document.form.group.options[num].value;
  // console.log('組：' + group);

  var stuId = document.form.stuId.value;
  // console.log('学籍番号：' + stuId);

  var stuName = document.form.stuName.value;
  // console.log('氏名：' + stuName);
  var arr = {
    stu_department: '0000',
    stu_course: '0000',
    stu_grade: '0000',
    stu_group: '0000',
    stu_id: stuId,
    stu_name: stuName
  }
  // 確認用
  // console.log(arr);
  // コールされたとき連想配列を返却する
  return arr;
}

// 欠席日決定時送信処理
function absenceSend() {
  // 共通部分を取得
  var arr = reportSend();
  // dateの値を取得する idで参照
  var day = document.getElementById('absence').value;
  console.log(day);
  // 連想配列arrにdateの値を追加する
  arr.absence_day = day;
  console.log(arr);
  // arrを送る
}

// 届書内容送信処理
function noticeSend() {
  // tableタグを参照するためのおまじない
  var table = document.getElementById('table-notice');
  // 取得データ格納用
  var check = 0;
  var radio;
  var selectbox;
  var selectNum;
  var company;
  var purpose;
  var place;
  // var sTime;
  // var eTime;
  var other;
  var teachingTime = [];
  var distinction = [];
  var subject = [];
  var teacher = [];
  var notice = {};
  // trの数だけ繰り返す
  for (var i = 0; i < table.rows.length; i++) {
    // 時限のチェックボックス判定
    switch (i) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // チェックされている行を検知
        if (table.rows[i].cells[0].children[1].checked) {
          check++;
          // 時限取得
          teachingTime.push(table.rows[i].cells[0].children[1].value);
          // 区別取得
          radio = table.rows[i].cells[1].children;
          // input:radioのvalueを取得するのでゼロオリジンで2ずつ
          for (var j = 0; j < radio.length; j += 2) {
            if (table.rows[i].cells[1].children[j].checked) {
              distinction.push(table.rows[i].cells[1].children[j].value);
            }
          }
          // 科目取得
          // テーブル内の子要素selectをみる
          selectbox = table.rows[i].cells[2].children[0];
          // 選択されているoptionの番号を取得（ゼロオリジン）
          selectNum = selectbox.selectedIndex;
          // 選択されているoptionのvalueを配列に追加していく
          subject.push(selectbox.options[selectNum].value);
          // 担当教員取得
          teacher.push(table.rows[i].cells[3].children[0].value);
        }
        break;
        // 場所とかその他とかの取得
      case 8:
        // 会社名取得
        company = table.rows[i].cells[1].children[0].value;
        // 目的取得
        purpose = table.rows[i].cells[3].children[0].value;
        break;
      case 9:
        // 場所取得
        place = table.rows[i].cells[1].children[0].value;
        // 時間取得
        // sTime = table.rows[i].cells[2].children[0].value;
        // eTime = table.rows[i].cells[2].children[2].value;
        break;
      case 10:
        // その他取得
        other = table.rows[i].cells[1].children[0].value;
    }

  }

  // 時限部分の連想配列に追加する処理
  for (var i = 0, j = 1; i < check; i++, j++) {
    notice[[j]] = {};
    notice[[j]]['teachingTime'] = teachingTime[i];
    notice[[j]]['distinction'] = distinction[i];
    notice[[j]]['subject'] = subject[i];
    notice[[j]]['teacher'] = teacher[i];
  }

  // すべてを連想配列化
  var arr = {
    notice,
    'company': company,
    'purpose': purpose,
    'place': place,
    'other': other
  }
  console.log(arr);
}

function jobSend() {
  // tableタグを参照するためのおまじない
  var table = document.getElementById('table-job');
  var repoArr = reportSend();
  // 取得データ格納用
  var companyRubi;
  var company;
  var pref;
  var city;
  var location;
  var eDate;
  var sTime;
  var eTime;
  var ePeople;
  // var male;
  // var female;
  var resultDay;
  var rDestination;
  var job;
  var industry;
  var childBlock;
  var childItem;
  var jobOffer;
  var testStage;
  var interviewA;
  var interviewB;
  // var groupNum;
  var interviewTheme = "";
  // var interviewTime;
  // var interviewer;
  // var answerA, answerB, answerC, answerD, answerE, answerF, answerG, answerH, answerI, answerJ;
  // var questionF, questionG, questionH, questionI, questionJ;
  var writeTest;
  // var spi;
  // var spiTime;
  // var spiText;
  // var appr;
  // var apprTime;
  // var apprText
  // var expert;
  // var expertTime;
  // var expertText;
  // var paperTime;
  // var paperText;
  var advise;
  var schoolType;
  var sex;
  var dep;
  var course;
  var free;

  // 提出日取得
  var fDate = document.getElementById('f-date').value;

  for (var i = 0; i < table.rows.length; i++) {
    switch (i) {
      case 0:
        // 会社名ふりがな取得
        companyRubi = table.rows[i].cells[1].children[0].value;
        // 会社名取得
        company = table.rows[i].cells[2].children[0].value;
        break;
      case 1:
        // 所在地取得
        // 県取得
        var selectbox = table.rows[i].cells[1].children[0];
        // 選択されているoptionの番号を取得（ゼロオリジン）
        var selectNum = selectbox.selectedIndex;
        pref = selectbox.options[selectNum].value
        // 市町村取得
        selectbox = table.rows[i].cells[1].children[1];
        // 選択されているoptionの番号を取得（ゼロオリジン）
        selectNum = selectbox.selectedIndex;
        city = selectbox.options[selectNum].value
        location = pref + city;
        break;
      case 2:
        // 試験日取得
        eDate = table.rows[i].cells[1].children[0].value;
        // 試験開始時間取得
        sTime = table.rows[i].cells[1].children[1].value
        // 試験終了時間取得
        eTime = table.rows[i].cells[1].children[3].value;
        break;
      case 3:
        // 受験者数取得
        ePeople = table.rows[i].cells[1].children[0].value;
        // 男子受験者数
        // male = table.rows[i].cells[2].children[0].value;
        // 女子受験者数
        // female = table.rows[i].cells[4].children[0].value;
        // 試験結果日
        resultDay = table.rows[i].cells[3].children[0].value;
        // 試験結果送り先
        if (table.rows[i].cells[3].children[1].checked) {
          rDestination = table.rows[i].cells[3].children[1].value;
        } else if (table.rows[i].cells[3].children[2].checked) {
          rDestination = table.rows[i].cells[3].children[2].value;
        } else if (table.rows[i].cells[3].children[1].checked && table.rows[i].cells[3].children[2].checked) {
          rDestination = 2;
        }
        break;
      case 4:
        // 受験先企業の職種
        job = table.rows[i].cells[1].children[0].value;
        // 受験先企業の業種
        industry = table.rows[i].cells[3].children[0].value;
        break;
      case 5:
        childBlock = table.rows[i].cells[1];
        childItem = childBlock.children;
        // 学校求人か？
        if (childItem[4].checked) {
          // 求人番号取得
          jobOffer = childItem[6].value;
        } else if (childItem[0].checked) {
          // 自己開拓
          jobOffer = childItem[0].value;
        } else if (childItem[2].checked) {
          // 縁故
          jobOffer = childItem[2].value;
        }
        break;
      case 6:
        // 何次試験か取得
        testStage = table.rows[i].cells[0].children[1].value;
        // 面接試験の有無
        if (table.rows[i].cells[2].children[0].checked) {
          interviewA = table.rows[i].cells[2].children[0].value;
        } else if (table.rows[i].cells[2].children[2].checked) {
          interviewA = table.rows[i].cells[2].children[2].value;
        }
        break;
      case 7:
        // 面接形式取得 ：個人だけ 1,グループ 2,ディスカッション 3
        if (table.rows[i].cells[0].children[0].checked) {
          // 個人面接
          interviewB = table.rows[i].cells[0].children[0].value;
        } else if (table.rows[i].cells[1].children[0].checked) {
          // グループ面接
          interviewB = table.rows[i].cells[1].children[0].value;
          // groupNum = table.rows[i].cells[2].children[0].value;
        } else if (table.rows[i].cells[3].children[0].checked) {
          // ディスカッション
          interviewB = table.rows[i].cells[3].children[0].value;
          interviewTheme = table.rows[i].cells[4].children[0].value;
        }
        // 面接時間取得
        // interviewTime = table.rows[i].cells[6].children[0].value;
        // 面接官の人数取得
        // interviewer = table.rows[i].cells[8].children[0].value;
        break;
        // 9~18は面接時の質問内容と回答を取得
        // case 9:
        //   answerA = table.rows[i].cells[1].children[0].value;
        //   break;
        // case 10:
        //   answerB = table.rows[i].cells[1].children[0].value;
        //   break;
        // case 11:
        //   answerC = table.rows[i].cells[1].children[0].value;
        //   break;
        // case 12:
        //   answerD = table.rows[i].cells[1].children[0].value;
        //   break;
        // case 13:
        //   answerE = table.rows[i].cells[1].children[0].value;
        //   break;
        // case 14:
        //   questionF = table.rows[i].cells[1].children[0].value;
        //   answerF = table.rows[i].cells[2].children[0].value;
        //   break;
        // case 15:
        //   questionG = table.rows[i].cells[1].children[0].value;
        //   answerG = table.rows[i].cells[2].children[0].value;
        //   break;
        // case 16:
        //   questionH = table.rows[i].cells[1].children[0].value;
        //   answerH = table.rows[i].cells[2].children[0].value;
        //   break;
        // case 17:
        //   questionI = table.rows[i].cells[1].children[0].value;
        //   answerI = table.rows[i].cells[2].children[0].value;
        //   break;
        // case 18:
        //   questionJ = table.rows[i].cells[1].children[0].value;
        //   answerJ = table.rows[i].cells[2].children[0].value;
        //   break;
      case 9:
        // 自由記述の取得
        free = table.rows[i].cells[0].children[0].value;
        break;
      case 10:
        // 筆記試験の有無を取得
        if (table.rows[i].cells[1].children[0].checked) {
          writeTest = table.rows[i].cells[1].children[0].value;
        } else if (table.rows[i].cells[1].children[2].checked) {
          writeTest = table.rows[i].cells[1].children[2].value;
        }
        break;
        // case 10:
        //   // 一般常識とかの試験形式を取得
        //   if(table.rows[i].cells[1].children[0].checked) {
        //     spi = table.rows[i].cells[1].children[0].value;
        //   } else if (table.rows[i].cells[1].children[2].checked) {
        //     spi = table.rows[i].cells[1].children[2].value;
        //   }
        //   // 一般常識とかの試験時間取得
        //   spiTime = table.rows[i].cells[3].children[0].value;
        //   break;
        // case 11:
        //   // 一般常識とかの試験内容
        //   spiText = table.rows[i].cells[0].children[0].value;
        //   break;
        // case 12:
        //   // 適性検査の種類取得
        //   if(table.rows[i].cells[1].children[0].checked) {
        //     appr = table.rows[i].cells[1].children[0].value;
        //   } else if (table.rows[i].cells[1].children[2].checked) {
        //     appr = table.rows[i].cells[1].children[2].value;
        //   } else if (table.rows[i].cells[1].children[4].checked) {
        //     appr = table.rows[i].cells[1].children[4].value;
        //   } else if (table.rows[i].cells[1].children[6].checked) {
        //     appr = table.rows[i].cells[1].children[6].value;
        //   }
        //   // 適性検査の時間取得
        //   apprTime = table.rows[i].cells[3].children[0].value;
        //   break;
        // case 13:
        //   apprText = table.rows[i].cells[0].children[0].value;
        //   break;
        // case 14:
        //   // 専門試験の種類取得
        //   if(table.rows[i].cells[1].children[0].checked) {
        //     expert = table.rows[i].cells[1].children[0].value;
        //   } else if (table.rows[i].cells[1].children[2].checked) {
        //     expert = table.rows[i].cells[1].children[2].value;
        //   } else if (table.rows[i].cells[1].children[4].checked) {
        //     expert = table.rows[i].cells[1].children[4].value;
        //   }
        //   // 専門試験の試験時間取得
        //   expertTime = table.rows[i].cells[3].children[0].value;
        //   break;
        // case 15:
        //   // 専門試験の試験内容
        //   expertText = table.rows[i].cells[0].children[0].value;
        //   break;
        // case 16:
        //   // 試験時間取得
        //   paperTime = table.rows[i].cells[1].children[0].value;
        //   break;
        // case 17:
        //   // 作文試験の内容を取得
        //   paperText = table.rows[i].cells[0].children[0].value;
        //   break;
      case 12:
        // 感想、アドバイス取得
        advise = table.rows[i].cells[0].children[0].value;
        break;
      case 14:
        // 学校
        if (table.rows[i].cells[0].children[0].checked) {
          schoolType = table.rows[i].cells[0].children[0].value;
        } else if (table.rows[i].cells[0].children[2].checked) {
          schoolType = table.rows[i].cells[0].children[2].value;
        } else if (table.rows[i].cells[0].children[4].checked) {
          schoolType = table.rows[i].cells[0].children[4].value;
        }
        // 性別
        if (table.rows[i].cells[1].children[0].checked) {
          sex = table.rows[i].cells[1].children[0].value;
        } else if (table.rows[i].cells[1].children[2].checked) {
          sex = table.rows[i].cells[1].children[2].value;
        }
        // 学科
        dep = table.rows[i].cells[3].children[0].value;
        // コース
        course = table.rows[i].cells[4].children[0].value;
        break;
    }
  }
  // 連想配列化
  var arr = {
    'stu_id': repoArr['stu_id'],
    'f-date': fDate,
    'c-name': company,
    'c-rubi': companyRubi,
    'location': location,
    'e-date': eDate,
    'sTime': sTime,
    'eTime': eTime,
    'e-people': ePeople,
    'r_date': resultDay,
    'rDestination': rDestination,
    'j_category': job,
    'industry': industry,
    'jobOffer': jobOffer,
    'testStage': testStage,
    'interviewA': interviewA,
    'interviewB': interviewB,
    'interviewTheme': interviewTheme,
    'writeTest': writeTest,
    'free': free,
    'advise': advise,
    'schoolType': schoolType,
    'sex': sex,
    'dep': dep,
    'course': course,
  }

  console.log(arr);
}

function visitSend() {
  var repoArr = reportSend();
  var table = document.getElementById('table-visit');
  var fDate = document.getElementById('f-Vdate').value;
  var company;
  var location = '';
  var position;
  var pName;
  var impressions;
  var eFlg;
  var eReason = '';

  for (var i = 0; i < table.rows.length; i++) {
    switch (i) {
      case 0:
        // 訪問先会社名取得
        company = table.rows[i].cells[1].children[0].value;
        // 訪問先の会場取得
        location = table.rows[i].cells[3].children[0].value;
        break;
      case 1:
        // 面談者役職取得
        position = table.rows[i].cells[1].children[0].value;
        // 面談者氏名取得
        pName = table.rows[i].cells[3].children[0].value;
        break;
      case 2:
        // 感想取得
        impressions = table.rows[i].cells[1].children[0].value;
        break;
      case 3:
        // 受験希望取得
        if (table.rows[i].cells[1].children[0].checked) {
          // 希望する場合
          eFlg = table.rows[i].cells[1].children[0].value;
        } else if (table.rows[i].cells[1].children[2].checked) {
          // 希望しない場合
          eFlg = table.rows[i].cells[1].children[2].value;
        } else if (table.rows[i].cells[1].children[4].checked) {
          // 検討中の場合
          eFlg = table.rows[i].cells[1].children[4].value;
        }
        break;
      case 4:
        // 希望理由取得
        eReason = table.rows[i].cells[1].children[0].value;
        break;
    }
  }
  // 連想配列化
  var arr = {
    'stu_id': repoArr['stu_id'],
    'f_date': fDate,
    'c_name': company,
    'location': location,
    'position': position,
    'p_name': pName,
    'impressions': impressions,
    'e_flg': eFlg,
    'e_reason': eReason,
  }
  console.log(arr);
}

// 該当ラジオボタンに関係ある要素の活性化
function activText(targetId) {
  // 求人方法のとこ
  if (targetId == 'school') {
    // 学校求人なら有効化
    document.getElementById('job-num').disabled = false;
  } else {
    // 学校求人以外なら無効化
    document.getElementById('job-num').disabled = true;
  }

  // 面接形式のとこ
  document.getElementById('group-num').disabled = true;
  document.getElementById('interview-theme').disabled = true;
  if (targetId == 'group-interview') {
    // グループ人数活性化
    document.getElementById('group-num').disabled = false;
  } else if (targetId == 'discussion-interview') {
    // ディスカッションテーマ活性化
    document.getElementById('interview-theme').disabled = false;
  }

  // 受験希望理由
  if (targetId == 'e-not') {
    // 希望しないの場合無効化
    document.getElementById('e-reason').disabled = true;
  } else {
    // 希望する又は検討中の場合有効化
    document.getElementById('e-reason').disabled = false;
  }
}

window.onload = activText;
