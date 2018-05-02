class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable,:trackable, :validatable, :omniauthable, :rememberable

  def self.find_for_google_oauth2(auth)

    if auth.info.email =~ /.*@st\.hsc\.ac\.jp/ then
      user = User.where(email: auth.info.email).first

      unless user then
        user = User.create(name: auth.info.name,
                        provider: auth.provider,
                        uid:      auth.uid,
                        email:    auth.info.email,
                        token:    auth.credentials.token,
                        password: Devise.friendly_token[0, 20])
      else
        token =  user.token
        if token != auth.credentials.token  then
          user.update_attribute(:token,auth.credentials.token)
          user.save
        end
      end
      return user
    else
      return nil
    end

  end
end
