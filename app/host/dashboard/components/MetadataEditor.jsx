import { useRef } from "react";

import { GearIcon, PlusIcon, TrashIcon } from "@primer/octicons-react";

export default function MetadataEditor({ title = "" }) {
    const modal = useRef(null);
    return (
        <>
            <button
                className="btn btn-standard"
                onClick={() => {
                    modal.current?.showModal();
                }}
            >
                <GearIcon size="medium" />
            </button>
            <dialog ref={modal} className="modal">
                <div className="modal-box">
                    <div className="flex w-full flex-row items-center justify-between">
                        <h3 className="font-bold text-xl">Edit {title} Metadata</h3>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between mt-2 mb-2">
                        <p className="font-normal opacity-50">You will not be able to rename the key of your property later. If you need to, recreate the row with a new key.</p>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between">
                        <input
                            type="text"
                            placeholder="Key..."
                            onChange={async () => {
                                // do db changes
                            }}
                            className="input input-standard font-normal flex-grow mr-2"
                        />
                        <button
                            className="btn btn-standard flex items-center justify-center"
                            onClick={async () => {
                                // add to metadata
                            }}
                            aria-label="Add Row with Key"
                        >
                            <PlusIcon size="medium" verticalAlign="middle" />
                            Add Row
                        </button>
                    </div>

                    <table className="mt-5 table">
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="font-normal text-lg">
                            <tr>
                                <td>Advisor</td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Type here"
                                        onChange={async () => {
                                            // do db changes
                                        }}
                                        value={"Mrs. Smith"}
                                        className="input input-standard w-fit max-w-xs"
                                    />
                                </td>
                                <td>
                                    <div className="flex space-x-2">
                                        <button
                                            className="btn btn-dangerous transition-none"
                                            onClick={async () => { }}
                                        >
                                            <TrashIcon size="medium" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-standard">Close</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}