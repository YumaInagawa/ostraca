#rails_root = File.expand_path('../../', __FILE__)
rails_root = "/usr/share/ostraca"

ENV['BUNDLE_GEMFILE'] = rails_root + "/Gemfile"

worker_processes 2
working_directory rails_root

timeout 30

listen "/usr/share/tmp/unicorn.sock"

pid "/usr/share/tmp/unicorn.pid"

preload_app true

stderr_path "/var/log/unicorn/error.log"
stdout_path "/var/log/unicorn/unicorn.log"

before_fork do |server, worker|
  defined?(ActiveRecord::Base) and
      ActiveRecord::Base.connection.disconnect!

  old_pid = "#{server.config[:pid]}.oldbin"
  if old_pid != server.pid
    begin
      sig = (worker.nr + 1) >= server.worker_processes ? :QUIT : :TTOU
      Process.kill(sig, File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
    end
  end
end

after_fork do |server, worker|
  defined?(ActiveRecord::Base) and ActiveRecord::Base.establish_connection

  if defined?(ActiveSupport::Cache::DalliStore) && Rails.cache.is_a?(ActiveSupport::Cache::DalliStore)
    Rails.cache.reset
    ObjectSpace.each_object(ActionDispatch::Session::DalliStore) { |obj| obj.reset }
  end

end
