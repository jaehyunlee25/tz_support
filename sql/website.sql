SELECT  
    golf_club_eng.eng_id
FROM  
    golf_club
JOIN golf_club_eng ON golf_club_eng.golf_club_id = golf_club.id
JOIN golf_club_detail ON golf_club_detail.golf_club_id = golf_club.id
WHERE golf_club_detail.reserve_script = 1
order by golf_club_eng.eng_id asc;
