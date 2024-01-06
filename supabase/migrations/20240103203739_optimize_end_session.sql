CREATE OR REPLACE FUNCTION public.end_session(attendance_code uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  -- Update metadata for all attendees in the group with the given code
  UPDATE attendees
  SET metadata = jsonb_set(attendees.metadata,
    CAST(concat('{attendanceHistory,', to_char((SELECT created_at FROM codes WHERE codes.code = attendance_code), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '}') as text[]),
    CAST(concat('["', to_char(attendance.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),'", ', CAST (attendance.status as char), ']') as jsonb)
  )
  FROM attendance
  WHERE attendance.code_used = attendance_code
        AND attendance.attendee = attendees.attendee;
  DELETE FROM codes WHERE code = attendance_code;
END;$function$
;
