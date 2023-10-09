WITH RankedSchedule AS (
   SELECT
      *,
      ROW_NUMBER() OVER(PARTITION BY golf_club_id ORDER BY created_at desc) AS rn
   FROM
      golf_schedule_date 
    WHERE golf_club_id 
        IN (${golfClubIds})
)
SELECT jsonstr
FROM RankedSchedule
WHERE rn = 1;