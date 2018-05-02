class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2

    @user = User.find_for_google_oauth2(request.env["omniauth.auth"])
    $teacher = @user
    $student = @user

    # session に 格納する
    session[:user_name] = @user.name    #--- 名前 ---#
    session[:user_token] = @user.token  #--- アクセストークン ---#
    session[:user_email] = @user.email

    if @user.present?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Google"
      sign_in_and_redirect @user, :event => :authentication
    else
      redirect_to OSTRACA_URI +  "/failed"
    end
  end
end
