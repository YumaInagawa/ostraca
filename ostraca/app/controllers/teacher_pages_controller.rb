# _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
#
#           教員用コントローラ 名前付き定数 config.application.rbに記述
#
# _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
require 'uri'
require 'net/http'
require 'json'
require 'addressable/uri' #  gem install  もしくは Gemfileに書いてbundle install を走らせる必要があり


class TeacherPagesController < ApplicationController
  # _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
  #
  # => 出席状況 出席記録
  # => に必要なJSONデータを取得する
  # _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
  before_filter :login_required
  def index
    logger.debug('call TeacherPagesController->index()')
    # => Emailから自分の教員IDを取得する GET index(:email)
    uri_str = IP_ADDR + "teachers/email?email=" + session[:user_email]
    uri = URI.parse(uri_str)
    @tea_id = Net::HTTP.get(uri)  #--- 教員IDを取得 ---#
    logger.debug("tea_id : #{@tea_id}")

    # 通知件数取得
    # rest = Addressable::URI.parse("http://192.168.0.2:9000/notice?tea_id=" + "4") # テスト用に決め打つ
    rest = Addressable::URI.parse("http://192.168.0.2:9000/notice?tea_id=" + @tea_id) # ハードコーディング、ダメ、絶対!
    $count = Net::HTTP.get(rest)
  end

  # before_filter :login_required
  def teacher_students
    logger.debug('call teacher_students()')
  end

  #--- 出席記録したデータをRESTへPOSTリクエストを行うメソッド ---#
  # before_filter :login_required   #--- ログイン認証フィルタ ---#
  def insert_attend
    logger.debug('call teacher_pages->insert_attend()')
    ### 学生の空のHASHを用意 ###
    students = []
    # date = Date.today
    date = params[:date].split("(")[0]
    sub_id = ''
    period = ''
    youbi = ''
    # Formの中身をループで探索
    params.each { |e|
      # => これを行わないと、エラー　”✓”　← これが、include?でエラーとなる
      if e.include?("utf8")
        next
      end

      # => 学生情報の抜き取り
      if e.include?("5")
        logger.debug("#{e} : #{params[e]}") # 5151021 1
        student = {
          :stu_id => e,             #--- 学籍番号 ---#
          :att_attend => params[e]  #--- 出席区分 ---#
        }
        ### 出席リストのJSON ###
        students << student
      end
      # => 科目情報（科目ID） の抜き取り
      if e.include?("subject")
        sub_id = params[e]
        next
      end
      # => 時限情報の抜き取り
      if e.include?("period")
        period = params[e]
        next
      end

      if (e.include?("youbi"))
        youbi = params[e]
        next
      end
    }
    ### 科目・時限・日付JSONの設定 ###
    common = {
      :accessToken => session[:user_token].to_s,  #--- アクセストークン ---#
      # :att_date => date.strftime("%Y-%m-%d"),     #--- 日付 ---#
      :att_date => date,
      :att_period => period,                      #--- 時限 ---#
      :sub_id => sub_id,                           #--- 科目ID ---#
      :youbi => youbi

    }
    ### RESTへ送るように、JSONを合体！ ###
    hashArray = {
      :common => common,
      :students => students
    }
    logger.debug("RESTへ送る用の、JSON : #{hashArray}") #--- debug ---#

    ### RESTへの出席記録リクエスト ###
    # POST      /teachers/class
    teacher_rest = URI.parse("http://192.168.0.2:9000/teachers/class")
    teacher_http = Net::HTTP.new(teacher_rest.host, teacher_rest.port)
    teacher_req = Net::HTTP::Post.new(teacher_rest.path)
    teacher_req["Content-Type"] = "application/json"

    teacher_req.body = hashArray.to_json              #--- http/bodyにjsonをセットする ---#
    response = teacher_http.request(teacher_req)
    logger.debug(response)
  end

  def noticelist
    logger.debug('call def noticelist')

    tea_id = session[:user_email].split('@')[0]
    # list_rest = Addressable::URI.parse("http://192.168.0.2:9000/notice/list/" + $teacher.pri_tea_id + "?accessToken=fda")
    # list_rest = Addressable::URI.parse("http://192.168.0.2:9000/notice/list/" + "4" + "?accessToken=fda")
    list_rest = Addressable::URI.parse("http://192.168.0.2:9000/notice/list/" + tea_id + "?accessToken=" + session[:user_token])
    result = Net::HTTP.get(list_rest)
    logger.debug(result)
    listjson = JSON.parse(result)
    logger.debug(listjson)

    @notice_list = []
    listjson.each do |list|
      list_noid = list["no_id"]
      list_date = list["date"]
      list_stuid = list["stu_id"]
      list_stuname = list["stu_name"]
      listtableName = list["table"]
      list_flg = list["flg"]
      item = {"no_id" => list_noid, "date" => list_date, "stu_id" => list_stuid, "stu_name" => list_stuname, "table" => listtableName, "flg" => list_flg}
      @notice_list << item
    end
    logger.debug("@notice_list : #{@notice_list}")

    @notice_list.each {|e|
      logger.debug(e);
      logger.debug(e["no_id"])
      logger.debug(e["flg"])
    }
  end

  def noticeContent
    # restからとってきた内容の表示はviewのnoticeContentで行うよう切り替え
    logger.debug("params ---------->")
    # 現状の中身はこんな感じ-- > {"controller"=>"teacher_pages", "action"=>"noticeContent"}と、ID・テーブル名は来ていない
    logger.debug(params)
    @notice_id = params[:no_id]
    @tableName = params[:table]

    logger.debug("notice_id:" + @notice_id.to_s)
    logger.debug(@tableName)

    rest = URI.parse("http://192.168.0.2:9000/notice/detail/" + @notice_id.to_s + "?tableName=" + @tableName + "&accessToken=" + session[:user_token])
    logger.debug("送るURI")
    logger.debug(rest)
    result = Net::HTTP.get(rest)
    logger.debug("帰ってきたJSON")
    logger.debug(result)
    @notice = JSON.parse(result)
  end

  def acceptance
    no_id =params[:notice_id]
    table = params[:table]
    rest = URI.parse("http://192.168.0.2:9000/notice/acceptance/" + no_id.to_s + "?tableName=" + table + "&accessToken=" + session[:user_token])
    logger.debug(rest)
    result = Net::HTTP.get(rest)

    redirect_to teacher_path
  end

  # def noticereport
  #   notice_id = params[:notice_id]
  #
  #   report_rest = Addressable::URI.parse("http://192.168.0.2:9000/notice/detail/" + notice_id + "?tableName=exam" + "&accessToken=fda")
  #   @report_json = Net::HTTP.get(report_rest)
  #
  # end
  #
  # def noticebriefing
  #   notice_id = params[:notice_id]
  #
  #   briefing_rest = Addressable::URI.parse("http://192.168.0.2:9000/notice/detail/" + notice_id + "?tableName=brifing" + "&accessToken=fda")
  #   @briefing_json = Net::HTTP.get(briefing_rest)
  # end
  #
  # def noticeatt
  #   notice_id = params[:notice_id]
  #
  #   att_rest = Addressable::URI.parse("http://192.168.0.2:9000/notice/detail/" + notice_id + "?tableName=notification" + "&accessToken=fda")
  #   @att_json = Net::HTTP.get(att_rest)
  # end
end
