insert into golf_schedule_date
values(
    uuid(),
    '${club_id}',
    '${jsonstr}',
    now(3),
    now(3)
);