WITH 
	golf_club_list AS (
	   SELECT 
	      golf_club.id,
	      golf_club_eng.eng_id,
	      golf_club.name      
	   FROM 
	       golf_club
	       join golf_club_eng on golf_club_eng.golf_club_id = golf_club.id
	       join golf_club_usability on golf_club_usability.golf_club_id = golf_club.id
	       join golf_club_detail on golf_club_detail.golf_club_id = golf_club.id
	       JOIN golf_club_order ON golf_club_order.golf_club_id = golf_club.id
	   WHERE 
	       golf_club_detail.login_script = true
	       and golf_club_usability.golf_club_state != -1
	),
	RankedSchedule AS (
      SELECT 
         golf_schedule_date.*, 
         ROW_NUMBER() OVER(PARTITION BY golf_schedule_date.golf_club_id ORDER BY created_at desc) AS rn
      FROM golf_schedule_date 
      WHERE created_at > '2023-10-10'
   )      

SELECT 
   golf_club_list.*,
   proc_login.result,
   proc_login.proc,
   proc_login.message,
   proc_login.landing_link,
   golf_club_detail.login_script,
   golf_club_detail.search_script,
   RankedSchedule.jsonstr
FROM golf_club_list 
	LEFT JOIN RankedSchedule ON RankedSchedule.golf_club_id = golf_club_list.id
	LEFT JOIN proc_login ON golf_club_list.id = proc_login.id
	LEFT JOIN golf_club_detail ON golf_club_detail.golf_club_id = golf_club_list.id
WHERE 
	ISNULL(jsonstr) = FALSE
	AND RankedSchedule.rn = 1
ORDER BY eng_id asc;