SELECT 
	proc_login.*
FROM proc_login
JOIN golf_club ON golf_club.id = proc_login.id
join golf_club_detail on golf_club_detail.golf_club_id = proc_login.id
join golf_club_usability on golf_club_usability.golf_club_id = proc_login.id
WHERE 
	golf_club_detail.login_script = TRUE
   and golf_club_usability.golf_club_state != -1
	AND proc = '${proc}';