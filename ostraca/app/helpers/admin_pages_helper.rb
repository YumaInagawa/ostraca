module AdminPagesHelper
	#*** emailアドレスから自分の教員ＩＤを返すメソッド ***#
	def email_solution
		# uri_str = IP_ADDR + "teachers/email?email=" + $teacher.email
		uri_str = IP_ADDR + "teachers/email?email=" + '5151021@st.hsc.ac.jp'
		
    logger.debug(uri_str)
    uri = URI.parse(uri_str)

    # 教員ＩＤ
    tea_id = Net::HTTP.get(uri)
		return tea_id
	end

	$json_data = ''
end
