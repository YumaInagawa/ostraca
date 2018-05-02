# 名前付き定数 config.application.rbに記述
require 'uri'
require 'net/http'
require 'json'
require 'addressable/uri' #  gem install  もしくは Gemfileに書いてbundle install を走らせる必要があり

class StaticPagesController < ApplicationController
  before_filter :login_required
  #--- 通知JSONのリクエスト ---#
  def home
    # logger.debug("教員ID")
    # logger.debug($teacher.id)
    uri_str = IP_ADDR + "notice/" + $teacher.id.to_s + "?accessToken=" + session[:user_token]
    uri = URI.parse(uri_str)
    json = Net::HTTP.get(uri)
    
    logger.debug("通知件数" + json)

    @noticeNum = json #
    # @noticeNum = 1

    #--- 教員と学生で、入るページを変える(開発時は無効とする) ---#
    if session[:user_email].include?("@st.hsc.ac.jp")
      redirect_to OSTRACA_URI + "/student"
    else 
      redirect_to OSTRACA_URI + "/teacher"
    end
  end




end
