
"use client"
import MainHero from "@/components/MainHero"
import { useRef } from "react";
import { TrashIcon, InfoIcon, GearIcon } from "@primer/octicons-react";

export default function Page() {
    const classDialog = useRef(null);

    return (
        <MainHero padding={3}>
            <div className="flex-1 flex flex-col items-center px-8 min-w-[450px] text-left mb-10">
                <b className="text-lg text-center w-full mt-10">Scan Host's QR Code to Attend.</b>
                <br />
                Alternatively, enter the Passcode below.

                <form className="animate-in flex-1 flex flex-row w-full justify-center gap-2 text-foreground mt-10 mb-10">
                    <input
                        required
                        type="text"
                        name="groupCode"
                        placeholder="Group Passcode..."
                        className="w-full input input-standard flex-grow form-input"
                    />
                    <button
                        className="btn btn-standard !rounded-lg"
                        formAction={() => { }}
                    >
                        Join Session
                    </button>
                </form>

                <button
                    className="btn btn-standard !rounded-lg !mt-15 w-full"
                    onClick={(e) => {
                        e.preventDefault()
                        classDialog.current.showModal();
                    }}
                >
                    <GearIcon verticalAlign="center" size="medium" />
                    Manage Your Registered Groups
                </button>
                <dialog ref={classDialog} className="modal">
                    <div className="modal-box max-w-[50vw]">
                        <div className="w-full flex flex-row text-2xl font-bold mb-5">
                            Your Groups
                        </div>
                        <div className="w-full flex flex-row items-center justify-center">
                            <span className="label-text text-xl h-full mr-5">Join a Group:</span>
                            <input
                                type="text"
                                placeholder="Group Code..."
                                className="input input-standard flex-grow"
                            />
                        </div>
                        <div className="mb-10 mt-5 opacity-50">
                            Registering for a group lets the Host automagically get attendance statistics. You may also be required to register for the Group to Attend.
                        </div>
                        <table className="mt-10 table">
                            <thead>
                                <tr>
                                    <th>Class Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="font-bold">Test Class 1</div>
                                            </div>
                                        </div>
                                    </td>
                                    <th>
                                        <div className="flex">
                                            <button
                                                className="btn btn-standard ml-2"
                                                onClick={
                                                    () => { }
                                                }
                                            >
                                                <InfoIcon size="medium" />
                                            </button>
                                            <button
                                                className="btn btn-dangerous ml-2 transition-none"
                                                onClick={async () => {
                                                }}
                                            >
                                                <TrashIcon size="medium" />
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                        <form method="dialog" className="self-end">
                            <button className="btn btn-standard mt-5">Close</button>
                        </form>
                    </div>
                </dialog>
            </div>
        </MainHero>
    )
}