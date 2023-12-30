import { Tables } from "@/utils/supabase/types";
import { GearIcon, PlusIcon, TrashIcon } from "@primer/octicons-react";
import { useRef } from "react";
import MetadataEditor from "./MetadataEditor";

export default function GroupSettings({ group }: { group: Tables<"groups"> }) {
	return <MetadataEditor title="Group" />;
}
