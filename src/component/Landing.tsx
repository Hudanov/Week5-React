import React from "react";
import {
  Link
} from "react-router-dom";

export default function Landing(): JSX.Element {
  return (
    <div className="flex h-screen bg-green-700">
      <div className="m-auto text-center">
        <h1 className="text-xl font-bold text-white"> Welcome to weather forecast!</h1>
        <button id="loginBtn" className="rounded-full bg-red-900 text-white w-56 my-7 py-4 font-bold">
          <Link to="/login">Login</Link>
        </button>
      </div>
    </div>
  )
}
