# 名前付き定数 config.application.rbに記述
require 'json'
require 'uri'
require 'net/http'

REST_URL = IP_ADDR + 'students/5151021?accessToken=fdaf'

class StudentPagesController < ApplicationController

  #
  # => JSON変換用学生クラス
  #
  class Student
    @stu_id = ''
    @stu_name = ''

    attr_accessor :stu_id
    attr_accessor :stu_name


  end

  # before_filter :login_required
  def index
    logger.debug("call StudentPagesController->index()")

    stu_id = session[:user_email].split('@')[0]
  	uri_str = IP_ADDR + "students/" + stu_id + "?accessToken=" + session[:user_token]
    uri = URI.parse(uri_str)
  	json = Net::HTTP.get(uri)
    @results = JSON.parse(json)
    @student = Student.new

    logger.debug('---------------------------------')
    # 一個ずつの｛｝(ハッシュ）に分解する
    @results.each { |result|
      # さらにその中を分解してデバッグ出力
      result.each_pair { |name, val|
        logger.debug(name)
        logger.debug(val)
        if name == 'stu_id'
          @stu_id = val
          @student.stu_id = val
        end
        if name == 'stu_name'
          @student.stu_name = val
        end
      }
    }
    logger.debug('==================================')
    logger.debug(@student.stu_id)
    logger.debug(@student.stu_name)

    ### 時間割ＪＳＯＮの取得  GET       /students/timetables/:stu_id?accessToken=dfa ###
    uriTimeTable = IP_ADDR + 'students/timetables/' + stu_id + '?accessToken=' + session[:user_token]
    uri = URI.parse(uriTimeTable)
    json = Net::HTTP.get(uri)
    @timetables = JSON.parse(json)
  end

  #--- 報告書提出ページ押下で、コールされる ---#
  def report
    logger.debug("call def report")
    stu_id = session[:user_email].split('@')[0]

    # 学籍番号をもとに、主クラスIDを取得する
    uri_class_resolve = IP_ADDR + "students/class/" + stu_id  # GET   /students/class/:stu_id ***//
    uri = URI.parse(uri_class_resolve)
    classId = Net::HTTP.get(uri)
    logger.debug("classId : #{classId}")
    # ログインした学生の主クラスIDで取りうる科目リストを取得
    uri_subject = IP_ADDR + "students/subject/" + classId     # GET   /teachers/management/subject/:class_id
    uri = URI.parse(uri_subject)
    result = Net::HTTP.get(uri)
    @subject = JSON.parse(result)
    logger.debug("subjects : #{@subject}, #{@subject.class}")
  end

  def detail
  end

  def insert_report
    logger.debug('call def insert_report')
## チェックが外れている次元に対しての科目名はnull
    sub_id1 = ""
    sub_id2 = ""
    sub_id3 = ""
    sub_id4 = ""
    sub_id5 = ""
    sub_id6 = ""
    sub_id7 = ""
    if params[:input1] == "1" then
      sub_id1 = params[:subject1]
      logger.debug(sub_id1)
    else
      sub_id1 = nil
    end

    if params[:input2] == "2" then
      sub_id2 = params[:subject2]
      logger.debug(sub_id2)
    else
      sub_id2 = nil
    end

    if params[:input3] == "3" then
      sub_id3 = params[:subject3]
      logger.debug(sub_id3)
    else
      sub_id3 = nil
    end

    if params[:input4] == "4" then
      sub_id4 = params[:subject4]
      logger.debug(sub_id4)
    else
      sub_id4 = nil
    end

    if params[:input5] == "5" then
      sub_id5 = params[:subject5]
      logger.debug(sub_id5)
    else
      sub_id5 = nil
    end

    if params[:input6] == "6" then
      sub_id6 = params[:subject6]
      logger.debug(sub_id6)
    else
      sub_id6 = nil
    end

    if params[:input7] == "7" then
      sub_id7 = params[:subject7]
      logger.debug(sub_id7)
    else
      sub_id7 = nil
    end

    notice_hash = {
      :no_id => "",
      :stu_id => params[:stuId],
      :date => params[:absence].to_s,
      :sub_id_1 => sub_id1,
      :sub_id_2 => sub_id2,
      :sub_id_3 => sub_id3,
      :sub_id_4 => sub_id4,
      :sub_id_5 => sub_id5,
      :sub_id_6 => sub_id6,
      :sub_id_7 => sub_id7,
      :company_name => params[:company].to_s,
      :location => params[:location].to_s,
      :purpose => params[:purpose].to_s,
      :other => params[:other].to_s,
      :flg => "0"
    }
    logger.debug(notice_hash)
    rest = URI.parse("http://192.168.0.2:9000/students/notice")
    http = Net::HTTP.new(rest.host, rest.port)
    req = Net::HTTP::Post.new(rest.path)
    req["Content-Type"] = "application/json"
    req.body = notice_hash.to_json
    response = http.request(req)

    redirect_to student_path
  end

  def insert_briefing
    briefing_hash = {
      :no_id => "",
      :stu_id => params[:stuId],
      :date => params[:date],
      :company_name => params[:company_name],
      :location => params[:location],
      :pos_name => "",
      :emp_name => params[:emp_name],
      :impressions => params[:Impressions],
      :exam_flg => params[:exam],
      :exam_reason => params[:reason]
    }
    logger.debug(briefing_hash)
    rest = URI.parse("http://192.168.0.2:9000/students/brifing")
    http = Net::HTTP.new(rest.host, rest.port)
    req = Net::HTTP::Post.new(rest.path)
    req["Content-Type"] = "application/json"
    req.body = briefing_hash.to_json
    response = http.request(req)

    redirect_to student_path
  end

  def insert_exam
    exam_hash = {
      :no_id => "",
      :stu_id => params[:stuId],
      :date => params[:date],
      :company_name => params[:company_name],
      :location => params[:prefectures] + params[:cities],
      :exam_date => params[:exam_date],
      :exam_time => params[:exam_time],
      :exam_num => params[:exam_num],
      :exam_result_date => params[:exam_result_date],
      :exam_result_dis => "",
      :category => params[:category],
      :industry => params[:industry],
      :app_method => params[:apply],
      :job_number => params[:job_number],
      :exam_number => params[:exam_number],
      :presence => params[:interview],
      :method => params[:interview_type],
      :theme => params[:theme],
      :free_txt => params[:free_txt],
      :advice => params[:advice]
    }
    logger.debug(exam_hash)
    rest = URI.parse("http://192.168.0.2:9000/students/exam")
    http = Net::HTTP.new(rest.host, rest.port)
    req = Net::HTTP::Post.new(rest.path)
    req["Content-Type"] = "application/json"
    req.body = exam_hash.to_json
    response = http.request(req)

    redirect_to student_path
  end
end
