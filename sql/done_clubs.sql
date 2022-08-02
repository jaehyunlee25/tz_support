SELECT 
	golf_club.name,
	golf_club_eng.eng_id,
	golf_club_detail.* 
FROM golf_club_detail 
JOIN golf_club ON golf_club.id = golf_club_detail.golf_club_id
JOIN golf_club_eng ON golf_club_eng.golf_club_id = golf_club_detail.golf_club_id
WHERE reserve_script = 1 
ORDER BY reserve_script_date DESC;