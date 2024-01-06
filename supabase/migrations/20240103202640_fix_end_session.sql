CREATE OR REPLACE FUNCTION public.end_session(attendance_code uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  -- Update metadata for all attendees in the group with the given code
  UPDATE attendees
  SET metadata = jsonb_set(attendees_with_group.metadata,
    CAST(concat('{attendanceHistory,', to_char((SELECT created_at FROM codes WHERE codes.code = attendance_code), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '}') as text[]),
    CAST(concat('["', to_char(attendance.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),'", ', CAST (attendance.status as char), ']') as jsonb)
  )
  FROM attendees_with_group
  INNER JOIN attendance ON attendance.code_used = attendance_code
  WHERE (EXISTS (SELECT 1 FROM attendance WHERE attendance.attendee = attendees.attendee));
  DELETE FROM codes WHERE code = attendance_code;
END;$function$
;
