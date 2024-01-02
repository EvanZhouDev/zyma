CREATE VIEW attendees_with_group AS
SELECT *, 
    (SELECT id FROM groups WHERE code = attendees.with_code) AS group, (SELECT admin FROM groups WHERE code = attendees.with_code) AS admin
FROM attendees;
