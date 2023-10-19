WITH 
   new_golf_schedule_date AS (
      WITH RankedSchedule AS (
         SELECT 
            golf_schedule_date.*, 
            ROW_NUMBER() OVER(PARTITION BY golf_schedule_date.golf_club_id ORDER BY created_at desc) AS rn
         FROM golf_schedule_date 
         WHERE created_at > '2023-10-17'
      )      
      SELECT * FROM RankedSchedule WHERE rn = 1
   ),
   golf_club_list AS (
      SELECT 
         golf_club.id,
         golf_club_eng.eng_id,
         golf_club_detail.isLoginWall
      FROM 
          golf_club
          join golf_club_eng on golf_club_eng.golf_club_id = golf_club.id
          join golf_club_usability on golf_club_usability.golf_club_id = golf_club.id
          join golf_club_detail on golf_club_detail.golf_club_id = golf_club.id
          JOIN golf_club_order ON golf_club_order.golf_club_id = golf_club.id
      WHERE 
          golf_club_detail.login_script = true
          and golf_club_usability.golf_club_state != -1
   )
SELECT 
    golf_club_list.id,
    golf_club_list.eng_id,
    proc_login.proc
FROM golf_club_list
LEFT JOIN new_golf_schedule_date ON golf_club_list.id = new_golf_schedule_date.golf_club_id
LEFT JOIN proc_login ON golf_club_list.id = proc_login.id
LEFT JOIN golf_club_detail ON golf_club_list.id = golf_club_detail.golf_club_id
WHERE 
    isnull(jsonstr)
    AND ISNULL(proc_login.eng_id) = false
    AND golf_club_detail.search_script = true;
