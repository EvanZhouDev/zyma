"use client";
import { useRef, useState } from "react";
import { createClass } from "../actions";
import { PlusIcon } from "@primer/octicons-react";
export default function NewClass() {
  const [className, setClassName] = useState<string>("");
  const handle = async () => {
    const { error } = await createClass(className);
    if (error == null) {
      modal.current!.close();
    } else {
      console.error(error);
    }
  };
  const modal = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        className="btn btn-standard flex items-center justify-center"
        onClick={() => modal.current!.showModal()}
      >
        <PlusIcon size="medium" verticalAlign="middle" />
        Add Class
      </button>
      <dialog ref={modal} id="my_modal_3" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Create a Class</h3>
          <p className="py-4">
            First, name your class. Afterwards, go to Mange Students and hit
            Register Students to continue.
          </p>
          <div>
            <label className="label">
              <span className="label-text text-base">Class Name</span>
            </label>
            <input
              type="text"
              name="className"
              required
              value={className}
              onChange={(event) => {
                setClassName(event.target.value);
              }}
              className="input input-standard w-full"
              placeholder="Class name..."
            />
          </div>
          <p className="py-4 opacity-50">
            You can rename your class at any time. To make sure the name is
            unique, it is recommended to include your period.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-standard">Close</button>
              <button className="btn btn-standard ml-3" formAction={handle} disabled={className.trim().length == 0}>
                Create Class
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
}
