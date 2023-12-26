import { QRCodeSVG } from "qrcode.react";

export default function ZymaCode({ code, url }: { code: string; url: string }) {
	return (
		<>
			<div className="text-3xl">Scan the code to attend.</div>
			<div className="flex items-center justify-center w-[27vw] h-[27vw]">
				<div className="absolute z-10">
					<div className="w-[27vw] h-[27vw] rounded-3xl zyma-code-bg" />
				</div>
				<div className="absolute z-20">
					<div className="w-[25vw] h-[25vw] rounded-2xl bg-base-100" />
				</div>
				<div className="absolute z-30">
					<QRCodeSVG
						value={url}
						size={400}
						className="top-0 left-0 w-[23vw] h-[23vw]"
					/>
				</div>
			</div>
			<div className="flex flex-col items-center">
				<div className="text-2xl mb-2">Alternatively, enter the Passcode</div>
				<div className="flex flex-row text-center">
					<div className="text-3xl font-bold">{code}</div>
				</div>
			</div>
		</>
	);
	// return (
	// 	<>
	// 		<div className="flex flex-col items-center -mt-5">
	// 			<div className="text-3xl mb-4">Scan the code to attend.</div>
	// 			<div className="flex items-center justify-center w-[27vw] h-[27vw]">
	// 				<div className="absolute z-10">
	// 					<div className="w-[27vw] h-[27vw] rounded-3xl zyma-code-bg" />
	// 				</div>
	// 				<div className="absolute z-20">
	// 					<div className="w-[25vw] h-[25vw] rounded-2xl bg-base-100" />
	// 				</div>
	// 				<div className="absolute z-30">
	// 					<QRCodeSVG
	// 						value={url}
	// 						size={400}
	// 						className="top-0 left-0 w-[23vw] h-[23vw]"
	// 					/>
	// 				</div>
	// 			</div>
	// 		</div>

	// 		<div className="flex flex-col items-center">
	// 			<div className="text-2xl mb-2">Alternatively, enter the Passcode</div>
	// 			<div className="flex flex-row items-center">
	// 				<div className="text-3xl font-bold">{code}</div>
	// 			</div>
	// 		</div>
	// 	</>
	// );
}
