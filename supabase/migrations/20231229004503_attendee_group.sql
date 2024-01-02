CREATE VIEW attendees_with_group AS
SELECT *, 
    (SELECT id FROM groups WHERE code = attendees.with_code) AS group
FROM attendees;
