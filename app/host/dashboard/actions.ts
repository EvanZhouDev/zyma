"use server";

import { v } from "@/utils";
import { getServerClient } from "@/utils/supabase/server";

export async function addAttendee(group: number, form: FormData) {
  const client = getServerClient();
  const attendees = v(
    await client
      .from("profiles")
      .select("id")
      .eq("email", form.get("email") as string)
  );
  // TODO: Form validation and use return
  if (attendees.length === 0) {
    throw new Error("Attendee not found");
  }
  const attendee = attendees[0].id;

  const { error } = await client
    .from("attendees")
    .insert([{ attendee, group }]);
  if (error != null) {
    console.error(error);
    throw new Error("Attendee is already in your group");
  }
}
export async function removeAttendee(group: number, attendee: string) {
  const client = getServerClient();
  v(
    await client
      .from("attendees")
      .delete()
      .eq("attendee", attendee)
      .eq("group", group)
  );
}
export async function createClass(className: string) {
  const client = getServerClient();
  return await client
    .from("groups")
    .insert([
      { admin: (await client.auth.getUser()).data.user!.id, name: className },
    ]);
}
export async function deleteClass(groupId: number) {
  const client = getServerClient();
  v(await client.from("groups").delete().eq("id", groupId));
}
