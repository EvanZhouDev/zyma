import { useRef } from "react";
import { InfoIcon, TrashIcon } from "@primer/octicons-react";
import AttendeeActions from "./AttendeeActions";

export default function YourLastAttendance() {
    const lastAttendanceDialog = useRef(null);

    return (
        <div className="flex flex-col items-center justify-between w-full mb-5 px-5">
            <div className="flex justify-between items-center w-full mt-3">
                <div className="flex flex-col">
                    <h1 className="font-bold !text-secondary-content !text-2xl">
                        Your Last Attendance:
                    </h1>
                    <p className="text-secondary-content text-xl opacity-50">
                        On 12/29/23 for 36.4k attendees
                    </p>
                </div>
                <button
                    className="btn btn-standard"
                    onClick={(e) => {
                        e.preventDefault();
                        lastAttendanceDialog.current.showModal();
                    }}>See Full Statistics</button>
                <dialog ref={lastAttendanceDialog} className="modal">
                    <div className="modal-box max-w-[75vw]">
                        <div className="w-full flex flex-row justify-between items-center">
                            <div className="flex flex-col justify-center">
                                <h1 className="text-2xl font-bold">Your Last Attendance:</h1>
                                <p className="text-xl opacity-50">On 12/29/23 for 36.4k attendees

                                </p>
                            </div>

                            <div className="stats w-[70%] overflow-hidden ml-5">
                                <div className="stat">
                                    <div className="stat-title">Attendees joined</div>
                                    <div className="stat-value">31K</div>
                                    <div className="stat-desc">85% of total</div>
                                </div>

                                <div className="stat">
                                    <div className="stat-title">Attendees Absent</div>
                                    <div className="stat-value">4,200</div>
                                    <div className="stat-desc">12% of total</div>
                                </div>

                                <div className="stat">
                                    <div className="stat-title">Unregistered</div>
                                    <div className="stat-value">1,200</div>
                                    <div className="stat-desc">3% of total</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center w-full justify-between mt-4">
                            <label>
                                <select
                                    className="select input-standard mr-2"
                                    onChange={() => {}}
                                >
                                    <option defaultChecked>All Statuses</option>
                                    <option>Present</option>
                                    <option>Late</option>
                                    <option>Absent</option>
                                </select>
                            </label>
                            <input
                                type="text"
                                placeholder="Search Attendees..."
                                className="input input-standard ml-1 flex-grow"
                                onChange={() => {}}
                            />
                        </div>
                        <table className="table mt-5 w-full outline outline-base-200 outline-1 text-[#24292F] rounded-lg">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Attendance Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b-0">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="font-bold">
                                                    Hi
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>test@test.com</td>
                                    <td>
                                        Absent
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <form method="dialog" className="self-end">
                            <button className="btn btn-standard mt-5">Close</button>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>Close</button>
                    </form>
                </dialog>
            </div>
            <div className="stats w-full overflow-hidden mt-5 mb-3">
                <div className="stat">
                    <div className="stat-title">Attendees joined</div>
                    <div className="stat-value">31K</div>
                    <div className="stat-desc">85% of total</div>
                </div>

                <div className="stat">
                    <div className="stat-title">Attendees Absent</div>
                    <div className="stat-value">4,200</div>
                    <div className="stat-desc">12% of total</div>
                </div>

                <div className="stat">
                    <div className="stat-title">Unregistered</div>
                    <div className="stat-value">1,200</div>
                    <div className="stat-desc">3% of total</div>
                </div>
            </div>
        </div>
    )
}