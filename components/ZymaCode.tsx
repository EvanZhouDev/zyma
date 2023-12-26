import { QRCodeSVG } from "qrcode.react";

export default function ZymaCode({ code, url }: { code: string; url: string }) {
	return (
		<div className="flex flex-col justify-between items-center h-full">
			{/* <div className="flex justify-between items-center w-full">
        <div className="flex flex-col mt-5">
            <Logo className="w-[8.7vw] ml-5 mb-1" size={500} />

            {RTworking ? (
                <span className="text-[#1E883E] ml-5">
                    <ZapIcon /> RT Connected
                </span>
            ) : (
                <span className="text-red-600 ml-5">
                    <AlertIcon /> RT Failed
                </span>
            )}
        </div>
        <div className="text-right mr-5 mt-5">
            Attendance session for
            <br />
            <b className="text-xl">{data.groups!.name}</b>
        </div>
    </div> */}
			<div className="flex flex-col items-center">
				<div className="text-3xl mb-4">Scan the code to attend.</div>
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
			</div>

			<div className="flex flex-col items-center">
				<div className="text-2xl mb-2">Alternatively, enter the Passcode</div>
				<div className="flex flex-row text-center">
					<div className="text-3xl font-bold">{code}</div>
				</div>
			</div>

			{/* <div className="flex flex-col items-center mb-4">
        <div className="text-3xl opacity-50">
            Session started{" "}
            <TimeElapsed
                time={data.created_at}
                getRelativeTime={getRelativeMinuteTime}
            />{" "}
            ago.
        </div>
    </div> */}
		</div>
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
