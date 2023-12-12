import * as OutlineIcons from "@heroicons/react/24/outline";
import * as SolidIcons from "@heroicons/react/24/solid";

const getIconID = (name) =>
	`${name.charAt(0).toUpperCase()}${name.slice(1)}Icon`;

export default {
	Outlined: ({ name, className = "" }) => {
		const OutlineIcon = OutlineIcons[getIconID(name)];
		return <OutlineIcon className={`w-6 h-6 ${className} stroke-2`} />;
	},
	Solid: ({ name, className = "" }) => {
		const SolidIcon = SolidIcons[getIconID(name)];
		return <SolidIcon className={`w-6 h-6 ${className}`} />;
	},
};
