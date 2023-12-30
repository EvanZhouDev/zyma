import { Tables } from "@/utils/supabase/types";
import MetadataEditor from "./MetadataEditor";

export default function GroupSettings({ group }: { group: Tables<"groups"> }) {
	return <MetadataEditor title="Group" />;
}
