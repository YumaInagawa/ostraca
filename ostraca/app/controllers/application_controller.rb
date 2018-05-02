class ApplicationController < ActionController::Base
  # protect_from_forgery with: :exception
  protect_from_forgery with: :null_session


  private
    def login_required
      unless user_signed_in?
        redirect_to controller: 'sessions', action: 'login'
      end
    end
end
