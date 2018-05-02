Rails.application.routes.draw do




  devise_for :users, controllers: {omniauth_callbacks: "users/omniauth_callbacks"}, skip: [:sessions]
  #---  ---#
  post 'exam' => 'student_pages#insert_exam'
  post 'insert_report' => 'student_pages#insert_report'
  post 'briefing' => 'student_pages#insert_briefing'
  get 'login' => 'sessions#login'
  root 'static_pages#home', as: "user_root"
  get 'failed' => 'sessions#failed'
  get 'admin' => 'admin_pages#index'
  get 'detail/:sub_id' => 'student_pages#detail'
  get 'teacher' => 'teacher_pages#index'
  get 'get_report' => 'teacher_pages#report'
  get 'schedule' => 'admin_pages#schedule', as: "schedule"
  get 'report' => 'student_pages#report'
  get 'student' => 'student_pages#index', as: "student"
  post 'to_rest' => 'admin_pages#to_rest'
  post 'scheduledelete' => 'admin_pages#scheduleDelete'

  ### 出席記録の送信 ###
  post 'insert_attend' => 'teacher_pages#insert_attend'
  ### CSVダウンロード関連 ###
  get 'csvdisplay' => 'admin_pages#csvdisplay'
  get 'csv_download' => 'admin_pages#csv_download'
  post 'csv_export' => 'admin_pages#csv_export'

  ### 学生新規登録用 API ###
  post 'new_regist' =>'admin_pages#new_regist'
  #--- 学生削除 ---#
  delete 'student' => 'admin_pages#student_delete'

  ### 学生の編集 ###
  post 'student' => 'admin_pages#student_edit'

  ### 通知関連 ###
  get 'noticelist' => 'teacher_pages#noticelist'
  get 'noticecontent' => 'teacher_pages#noticeContent', as: "noticecontent"
  post 'acceptance' => 'teacher_pages#acceptance', as: "acceptance"
  # get 'noticereport' => 'teacher_pages#noticereport'
  # get 'noticebriefing' => 'teacher_pages#noticebriefing'
  # get 'noticeatt' => 'teacher_pages#noticeatt'



end

# _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
# _/                            Hint!
# _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
# => URL のホスト名以降のパス文字列を取得する。クエリ文字列（?以降）は含まない。
# =>  request.path_info            # /users/search
#
#
#  <!--  Javascript + Rails の合体版、出来た！-->
#   <%= form_tag '/new_regist', method: 'post', multipart: true do  % > フォーム自体は、Rails
#     <label>ファイル</label>
#     <input type="file" name="csv_file" id="csv_file"/>  ここは、普通のHTML
#     <%= submit_tag 'Send file' %>
#   <% end %>
# <!-- ここまで -->
#
#
#
#
#
#
###
