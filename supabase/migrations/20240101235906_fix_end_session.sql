CREATE OR REPLACE FUNCTION public.end_session(attendance_code uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  -- Update metadata for all attendees in the group with the given code
  UPDATE attendees
  SET metadata = jsonb_set(attendees_with_group.metadata,
    CAST (concat('{attendanceHistory,', to_char(codes.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '}') as text[]),
    CAST(concat('["', to_char(attendance.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),'", ', CAST (status as char), ']') as jsonb)
  )
  FROM attendees_with_group
  INNER JOIN codes ON codes.group = attendees_with_group.group
  INNER JOIN attendance ON attendance.code_used = attendance_code
  WHERE attendees.with_code in (SELECT groups.code FROM groups INNER JOIN codes ON codes.group = groups.id WHERE codes.code = attendance_code);
  -- WHERE attendees.with_code in (SELECT groups.code FROM groups INNER JOIN  codes ON codes.group = groups.id WHERE codes.code = attendance_code);
  DELETE FROM codes WHERE code = attendance_code;
END;$function$
;
