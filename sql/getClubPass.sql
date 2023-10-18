WITH     
RankedSchedule AS (
   SELECT 
      golf_schedule_date.*, 
      ROW_NUMBER() OVER(PARTITION BY golf_schedule_date.golf_club_id ORDER BY created_at desc) AS rn
   FROM golf_schedule_date
),
ranked_schedule AS (
   SELECT * 
   FROM RankedSchedule
   WHERE rn = 1
)
SELECT 
	golf_club.id,
	golf_club_eng.eng_id,
	proc_login.proc
FROM ranked_schedule
LEFT JOIN golf_club ON golf_club.id = ranked_schedule.golf_club_id
LEFT JOIN golf_club_eng ON golf_club_eng.golf_club_id = ranked_schedule.golf_club_id
LEFT JOIN proc_login ON proc_login.id = ranked_schedule.golf_club_id
LEFT JOIN golf_club_usability ON golf_club_usability.golf_club_id = ranked_schedule.golf_club_id
WHERE golf_club_usability.golf_club_state != -1;
