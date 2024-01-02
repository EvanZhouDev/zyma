CREATE OR REPLACE FUNCTION public.end_session(attendance_code uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  -- Update metadata for all attendees in the group with the given code
  UPDATE attendees
  SET metadata = jsonb_set(metadata, concat('{attendanceHistory,', to_char(codes.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '}'), concat('[', to_char(attendance.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), to_char(status), ']'))
  WHERE attendees.with_code in (SELECT groups.code FROM groups INNER JOIN  codes ON codes.group = groups.id WHERE codes.code = attendance_code);
  DELETE FROM codes WHERE code = attendance_code;
END;$function$
;
