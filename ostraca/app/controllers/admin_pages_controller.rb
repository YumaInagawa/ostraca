# -*- coding: utf-8 -*-
require 'json'
require 'uri'
require 'net/http'
require 'date'
require 'csv'
require 'kconv'
require 'addressable/uri'
REST_URL = IP_ADDR + '/admin?accessToken=fdaf'
class AdminPagesController < ApplicationController

  # before_filter :login_required
  def index
  end

  def schedule
  end

  def to_rest
    logger.debug(params[:teacher_csv])
    logger.debug(params[:subject_csv])
    logger.debug(params[:timetable_csv])

    # ファイル格納
    teacher_data = params[:teacher_csv]
    subject_data = params[:subject_csv]
    timetable_data = params[:timetable_csv]

    # アクセストークン付与はJSONと同じようにbodyにセットすべき
    # このパラメータの書き方はGETメソッドのものである（少なくともPOSTじゃ使えないようだ）
    # teacher_rest = URI.parse("http://192.168.0.2:9000/teachers/timetable/teachers?accessToken=fdaf")
    # subject_rest = URI.parse("http://192.168.0.2:9000/teachers/timetable/subjects?accessToken=fdaf")
    # timetable_rest = URI.parse("http://192.168.0.2:9000/teachers/timetable/timetables?accessToken=fdaf")

    teacher_rest = URI.parse("http://192.168.0.2:9000/teachers/timetable/teachers")
    subject_rest = URI.parse("http://192.168.0.2:9000/teachers/timetable/subjects")
    timetable_rest = URI.parse("http://192.168.0.2:9000/teachers/timetable/timetables")

    logger.debug(teacher_rest)
    logger.debug(subject_rest)
    logger.debug(timetable_rest)

    tea_http = Net::HTTP.new(teacher_rest.host, teacher_rest.port)
    sub_http = Net::HTTP.new(subject_rest.host, subject_rest.port)
    time_http = Net::HTTP.new(timetable_rest.host, timetable_rest.port)

    logger.debug(tea_http)
    logger.debug(sub_http)
    logger.debug(time_http)

    tea_req = Net::HTTP::Post.new(teacher_rest.path)
    sub_req = Net::HTTP::Post.new(subject_rest.path)
    time_req = Net::HTTP::Post.new(timetable_rest.path)

    tea_req["Content-Type"] = "application/json"
    sub_req["Content-Type"] = "application/json"
    time_req["Content-Type"] = "application/json"

    # JSON格納用配列
    tea_array = []
    sub_array = []
    time_array = []

    # 格納したCSVを一行ずつ見ていく
    # 教員のPOST（元がShift-JIS）
    # SJIS以外の文字コードはエラーを起こす
    CSV.foreach(teacher_data.path, encoding: "SJIS", row_sep: "\r\n") do |tearow|
      # logger.debug(tearow)
      # logger.debug(tearow[0].encoding)
      # 連想配列にする

      unless tearow[0].blank? || tearow[1].blank? || tearow[2].blank? || tearow[3].blank? then
        # ハッシュ化する過程でエンコード
        teahash = {
          "pri_tea_id" => tearow[0].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
          "tea_name" => tearow[1].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
          "tea_flg" => tearow[2].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
          "tea_mailaddr" => tearow[3].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
          "accessToken" => "fdaf"  # 仮のトークン
        }
        # 配列にhash追加
        tea_array << teahash
      else
        # redirect_toが複数あるので代替処理を
        # redirect_to schedule_url
      end

    end
    # logger.debug(tea_array.to_json)
    # ハッシュ配列をハッシュへ格納
    tea_json_hash = {"teacher_json" => tea_array}
    logger.debug("TEACHERJSONHASH:" + tea_json_hash.to_s)
    # ハッシュ配列を格納したハッシュをJSON化してセット
    tea_req.body = tea_json_hash.to_json
    tea_res = tea_http.request(tea_req)

    # 科目のPOST（元がShift-JIS）
    # SJIS以外の文字コードはエラーを起こす
    CSV.foreach(subject_data.path, encoding: "SJIS", row_sep: "\r\n") do |subrow|
      # logger.debug(subrow)
      # logger.debug(subrow[0].encoding)

      unless subrow[0].blank? || subrow[1].blank? || subrow[2].blank? || subrow[3].blank? || subrow[4].blank? then
        # ハッシュ化する過程でエンコード
        subhash = {
          "sub_id" => subrow[0].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
          "sub_name" => subrow[1].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
          "sub_num_lesson" => subrow[2].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
          "sub_year" => subrow[3].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
          "sub_period" => subrow[4].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
          "accessToken" => "fdaf"   # 仮のトークン
        }
        if subhash["sub_name"].eql?("対策授業")
          subhash["sub_name"] = "a" + subhash["sub_name"]
          logger.debug("対策授業がきた")
        end

        if subhash["sub_name"].eql?("選択授業")
          subhash["sub_name"] = "b" + subhash["sub_name"]
          logger.debug("選択授業がきた")
        end
        # 配列にhash追加
        sub_array << subhash
      else
        # redirect_to schedule_url
      end

    end
    # logger.debug(sub_array.to_json)
    # ハッシュ配列をハッシュへ格納
    sub_json_hash = {"subject_json" => sub_array}
    logger.debug("SUBJECTJSONHASH:" + sub_json_hash.to_s)
    # ハッシュ配列を格納したハッシュをJSON化してセット
    sub_req.body = sub_json_hash.to_json
    sub_res = sub_http.request(sub_req)

    # 時間割カウンタ
    cnt = 0
    # 時間割のPOST（元がShift-JIS）
    # SJIS以外の文字コードはエラーを起こす

    # 対策授業は頭にaしておくこと
    CSV.foreach(timetable_data.path, encoding: "SJIS", row_sep: "\r\n") do |timerow|
      # logger.debug(timerow)

      unless timerow[0].blank? || timerow[1].blank? || timerow[2].blank? || timerow[3].blank? then
        # 科目が「対策授業（教員と教場が空）」の場合の分岐処理
        unless timerow[4].blank? || timerow[5].blank? then
          # ハッシュ化する過程でエンコード
          timehash = {
            "tt_dayofweek" => timerow[0].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
            "tt_period" => timerow[1].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
            "class_id" => timerow[2].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
            "sub_id" => timerow[3].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
            "pri_tea_id" => timerow[4].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
            "room_id" => timerow[5].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
            "accessToken" => "fdaf"  # 仮のトークン
          }

          # 配列にhash追加
          # time_array << timehash
        else
          # ハッシュ化する過程でエンコード
          timehash = {
            "tt_dayofweek" => timerow[0].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
            "tt_period" => timerow[1].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
            "class_id" => timerow[2].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
            "sub_id" => timerow[3].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
            "pri_tea_id" => "",
            "room_id" => "",
            "accessToken" => "fdaf"  # 仮のトークン
          }

          if timehash["sub_id"].eql?("対策授業")
            timehash["sub_id"] = "a" + timehash["sub_id"]
            logger.debug("対策授業がきた")
          end

          if timehash["sub_id"].eql?("選択授業")
            timehash["sub_id"] = "b" + timehash["sub_id"]
            logger.debug("選択授業がきた")
          end

          # 配列にhash追加
          # time_array << timehash
        end
        # 配列にhash追加
        time_array << timehash
      else
        # redirect_to schedule_url
      end
      # カウント
      cnt += 1
      # 300行目で
      if cnt == 300 then
        # ここで一度ハッシュ化
        time_json_hash = {"time_json" => time_array}
        # ログ吐き
        # logger.debug("TIMEJSONHASH:" + time_json_hash.to_s)
        time_req.body = time_json_hash.to_json
        # いったんRESTへPOST
        time_res = time_http.request(time_req)

        # array初期化
        time_array = []

        cnt = 0
      end
    end
    logger.debug(time_array.to_json)
    # time_req.body = time_array.to_json
    # ハッシュを格納した配列をハッシュへ格納
    time_json_hash = {"time_json" => time_array}
    logger.debug("TIMEJSONHASH:" + time_json_hash.to_s)
    # ハッシュ配列を格納したハッシュをJSON化してセット
    # time_req.body = time_json_hash.to_json
    time_req.body = time_json_hash.to_json
    # time_res = time_http.request(time_req)
    time_res = time_http.request(time_req)

    # redirect_to schedule_url
    redirect_to OSTRACA_URI + '/schedule'
  end

  def scheduleDelete
    # セレクトボックス選択項目取得
    year = params[:years]
    period = params[:periods]
    flg = "1"
    logger.debug(year)
    logger.debug(period)

    # RESTのretDeletionTargetを利用
    delete_rest = Addressable::URI.parse("http://192.168.0.2:9000/teachers/timetable/deletetimetables?accessToken=" + session[:user_token] + "&sub_year=" + year + "&sub_period=" + period + "&flg=" + flg)
    deljson = Net::HTTP.get(delete_rest)

    logger.debug(deljson)
    # 戻ってきたJSONをハッシュ化
    hashtables = JSON.parse(deljson)
    logger.debug(hashtables)
    logger.debug(hashtables[0]["class_id"])

    # 消すべき時間割の主キーが判明したので、deleteTimeTableへのURI生成（DELETEメソッド）
    # ハッシュの配列をループしながらDELETEリクエストを送信
    hashtables.each do |hash|
      delete_rest = URI.parse(URI.encode("http://192.168.0.2:9000/teachers/timetable/timetables?accessToken=" + session[:user_token] + "&dayofweek=" + hash["tt_dayofweek"].to_s + "&period=" + hash["tt_period"].to_s + "&classid=" + hash["class_id"].to_s))
      http = Net::HTTP.new(delete_rest.host, delete_rest.port)
      req = Net::HTTP::Delete.new(delete_rest.request_uri)
      res = http.request(req)
    end

    # redirect_to schedule_url
    redirect_to OSTRACA_URI + '/schedule'
  end
  ### 学生新規登録CSVファイルをJSON化してRESTをたたくメソッド ###
  def new_regist
    # TODO: インサートできているが、文字化け発生！
    logger.debug("call admin_pages->new_regist")
    # logger.debug(params[:csv_file])
    #--- ファイルのデータ格納 ---#
    csv_file = params[:csv_file]
    #--- POST ManagementController.newRegistStudent()使用 ---#
    rest_new_regist = URI.parse("http://192.168.0.2:9000/teachers/management/newregist")
    http_new_regist = Net::HTTP.new(rest_new_regist.host, rest_new_regist.port)
    req_new_regist = Net::HTTP::Post.new(rest_new_regist.path)
    req_new_regist["Content-Type"] = "application/json"
    #--- 生徒の配列をハッシュ化 ---#
    students = []
    # CSV.foreach(csv_file.path, encoding: "SJIS", row_sep:"\r\n") do |d|
    #   logger.debug(d)
    #   #--- ハッシュ化する過程でエンコードする ---#
    #   wk = {
    #     "stu_id" => d[0].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
    #     "stu_name" => d[1].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
    #     "stu_rubi" => d[2].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
    #     "stu_mailaddr" => d[3].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8")
    #   }
    #   students << wk #--- 追加 ---#
    # end

    #--- クラスの比較用 ---#
    stu_code = ""
    #--- ヘッダー設定ONで読み込み ---#
    #--- ヘッダーの内容によって処理を変える ---#
    CSV.foreach(csv_file.path, encoding: "SJIS", row_sep: "\r\n", headers: true) do |stu|
      logger.debug(stu["学籍番号"])
      #--- 必要なヘッダーの内容が存在しているか ---#
      #--- 森本様から授かったCSV形式以外はRESTへ送信されない ---#
      #--- 一部氏名（ほんの２、３文字程度）が元のCSVファイルから化けている ---#
      unless stu["学籍番号"].blank? || stu["コード"].blank? || stu["姓"].blank? || stu["名"].blank? || stu["フリガナ姓"].blank? || stu["フリガナ名"].blank? || stu["メールアドレス"].blank? then
        #--- 全てがblankでなければ（必要なデータが揃っている） ---#

        #--- ループ中にクラスが変わった場合 ---#
        unless stu_code.blank? || stu_code == stu["コード"] then
          logger.debug("クラスが変わった")
          #--- クラスが変わったので一旦送信をする ---#
          len = stu["コード"].length
          hash_array = {
            :students => students,
            :accessToken => "fdaf",
            :year => stu_code[0],
            :classes => stu_code[1, len]
          }
          logger.debug(hash_array.to_json)
          #--- RESTへリクエストする ---#
          req_new_regist.body = hash_array.to_json
          res_new_regist = http_new_regist.request(req_new_regist)
          #--- students初期化 ---#
          students = []
        end
        stu_code = stu["コード"]
        #--- 氏名とフリガナは一旦結合して格納 ---#
        stu_name = stu["姓"] + stu["名"]
        stu_rubi = stu["フリガナ姓"] + stu["フリガナ名"]
        data = {
          "stu_id" => stu["学籍番号"].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
          "stu_name" => stu_name.encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
          "stu_rubi" => stu_rubi.encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8"),
          "stu_mailaddr" => stu["メールアドレス"].encode("UTF-16BE", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8")
        }
        #--- 追加 ---#
        students << data
      end
    end
    logger.debug(students.to_json)
    logger.debug(stu_code)
    len = stu_code.length
    #--- models.M_Student ---#
    hash_array = {
      :students => students,
      :accessToken => "fdaf",
      :year => stu_code[0],
      :classes => stu_code[1, len]
    }
    logger.debug(hash_array.to_json)
    req_new_regist.body = hash_array.to_json
    # req_new_regist.body = stu_json_hash.to_json               # ハッシュ化したデータをJSON化して、リクエストボディに代入する
    res_new_regist = http_new_regist.request(req_new_regist)  # POSTリクエストし、responseを代入する

    redirect_to OSTRACA_URI +  '/admin'  # ページをリダイレクトする
  end
  #--- 学生削除 ---#
  def student_delete
    logger.debug('call admin_pages->student_delete()')

    students = []
    params.each{|e|
      logger.debug(e)

      # => これを行わないと、エラー　”✓”　← これが、include?でエラーとなる
      if e.include?("utf8")
        next
      end

      #--- RESTに関係するHash(構造をそろえろよ！ ---#
      if e.include?("5")
        student = {
          :stu_id => e
        }
        students << student
      end
    }
    hash_array = {
      :studentid => students
    }
    #--- 学生リストをデバッグ出力 ---#
    logger.debug(hash_array)
    # POST      /teachers/management/students
    teacher_rest = URI.parse("http://192.168.0.2:9000/teachers/management/students")
    teacher_http = Net::HTTP.new(teacher_rest.host, teacher_rest.port)
    teacher_req = Net::HTTP::Post.new(teacher_rest.path)
    teacher_req["Content-Type"] = "application/json"

    teacher_req.body = hash_array.to_json
    response = teacher_http.request(teacher_req)
    logger.debug(teacher_rest)
    logger.debug(response)
  end
  ### CSVダウンロード用のデータをリクエストして、JSON->ハッシュ化するメソッド ###
  def csv_download
    logger.debug("call AdminPagesController->csv_download()")
    logger.debug(params)
    logger.debug("パラメータの長さ --> #{params.size}")

    if params.size >= 9 then
      ret_subject = params[:ret_subject]
      smonth = params[:smonth]
      # "admin_subject"=>"1", "admin_classes"=>"A", 
      class_id = params[:admin_subject] + params[:admin_classes]
      sDay = params[:sDay]
      eDay = params[:eDay]
      logger.debug("--------------------------")
      uri_str = IP_ADDR + "teachers/management/csvdownload?" + "sub_id=" + ret_subject + "&startDay=" +  sDay + "&endDay=" + eDay + "&class_id=" + class_id +  "&accessToken=" + session[:user_token];
      uri = URI.parse(uri_str)
      response = Net::HTTP.get(uri)
      logger.debug(response)            # JSONデータ

      $json_data = JSON.parse(response) # JSON をハッシュ化する
      logger.debug("json_data : #{$json_data}")
    end
  end
  def csvdisplay
    logger.debug("call csvdisplay()")
  end
  ### CSVデータに変換して、CSVファイルを出力するメソッド
  def csv_export
    logger.debug("call csv_export()")
    logger.debug("JSON_DATA :: #{$json_data}")

    arr_date = []     #
    arr_period = []   #
    arr_tea_name = [] #

    arr_date << "日付"
    arr_period << "時限"  #RESTの日付の解析がおかしいため、余計な日付が返ってくる
    $json_data[0]['csvDates'].each do |date|
      logger.debug("date の 中身 : #{date}")
      arr_date << date['att_date']
      arr_period << date['att_period']
      arr_tea_name << date['tea_name']
    end

    # csv_data = CSV.generate(encoding: Encoding::SJIS, row_sep: '\r\n', force_quotes: true) do |data|
    ### CSVデータを動的に生成して、出力する OK!
    csv_data = CSV.generate() do |data|
      data << arr_date      # 日付の追加
      data << arr_period    # 時限の追加
      data << arr_tea_name  # 担当教員の追加

      ### JSON_DATA の 学生の出席情報を人数分ループする
      $json_data.each do |d|
        d['csvStudents'].each do |stu|
          arr_stu = []
          logger.debug("stuの中身 : #{stu}")
            arr_stu << stu['stu_name']        # 学生の氏名
            stu['csvAttends'].each do |att|
                arr_stu << att['att_attend']  # 学生の出席区分
            end
            logger.debug(arr_stu)
            data << arr_stu                   # CSV用オブジェクトに、一行分を追加
        end
      end
   end
    # send_data csv_data, filename: 'test.csv', type: 'text/csv; charset=shift_jis'
    ### CSVをブラウザに出力する
    fileName = $json_data[0]['sub_name'] + "_" +  Date.today.to_s + ".csv";
    logger.debug(fileName);
    
    send_data(NKF::nkf('--sjis -Lw', csv_data), :filename => fileName)
  end

  def student_edit
    logger.debug("call admin_pages->student_edit")
    cnt = params["count"]                               #--- "3" チェックした学生数 ---#
    logger.debug("pri_class_id : #{params["years"]}")   #--- 1A, 2B ---#
    #--- {"stu_id"=>"5151002", "sec_class_id"=>"1", "3th_class_id"=>"0000", "4th_class_id"=>"0000"} ---#
    studentList = []
    for i in 0..cnt.to_i - 1  #--- "3" --> 3 ---#
      hash = params["students"][i.to_s]
      logger.debug("一人分のjsonデータ : #{hash.to_json}")
      student = {
        :stu_id => hash["stu_id"],
        :sec_class_id => hash["sec_class_id"],
        :_3th_class_id => hash["3th_class_id"],
        :_4th_class_id => hash["4th_class_id"]
      }
      studentList << student         #--- JSON化した一人分のデータを配列に追加 ---#
    end
    hash_array = {
      :studentid => studentList          #--- 学生リストJSON ---#
      # :pri_class_id => params["years"]    #--- 主クラス名 ---#
    }
    logger.debug("RESTに送信する最終JSONデータ : #{hash_array.to_json}")

    #--- RESTに対してPOSTリクエストを発行 ---#
    rest_edit_student = URI.parse("http://192.168.0.2:9000/teachers/management/editstudents")
    http_edit_student = Net::HTTP.new(rest_edit_student.host, rest_edit_student.port)
    req_edit = Net::HTTP::Post.new(rest_edit_student.path)
    req_edit["Content-Type"] = "application/json"
    req_edit.body = hash_array.to_json
    res_edit = http_edit_student.request(req_edit)  # POSTリクエストし、responseを代入する

    flash[:notice] = "クラスを編集しました"

    redirect_to OSTRACA_URI + '/admin'  # ページをリダイレクトする
  end


end
