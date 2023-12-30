"use client";

import React from "react";
import { useRatelimit } from "./actions";

import { useFormState, useFormStatus } from "react-dom";

const initialState = {
  success: false,
  message: null,
};

const ServerComponent = () => {
  const [state, formAction] = useFormState(useRatelimit, null);

  return (
    <div>
      <div className="w-128 mx-auto">
        <form action={useRatelimit}>
          <button type="submit" className="border border-black padding-4">
            Ratelimit
          </button>
        </form>
        <p>{state?.message || "No message"}</p>
      </div>
      ;
    </div>
  );
};

export default ServerComponent;
