CREATE OR REPLACE FUNCTION public.bool2str(input_bool boolean)
 RETURNS text
 LANGUAGE plpgsql
AS $function$BEGIN
  IF input_bool THEN
    RETURN 'true';
  ELSE
    RETURN 'false';
  END IF;
END;$function$
;

CREATE OR REPLACE FUNCTION public.end_session(attendance_code uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  -- Update metadata for all attendees in the group with the given code
  UPDATE attendance
  SET metadata = jsonb_set(metadata, concat('{attendanceHistory,', to_char(codes.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '}'), concat('[', to_char(attendance.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), bool2str((status = 0)::boolean), ']'))
  WHERE attendance.code_used = attendance_code;
  DELETE FROM codes WHERE code = attendance_code;
END;$function$
;
