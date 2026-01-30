import { useState } from "react";
import MyButton from "./utils/Button.tsx"
import Main from "./utils/Main.tsx"

function Profile () {

    return(
        <>
        <div>
            <Main></Main>
        </div>
            <h1>USERNAME</h1>
            <img
                src="/src/img/img.webp"
                alt="ah non"
                width="50" height="60"
            />
            <div>
                <MyButton onClick={() => alert("Hello 👋")}> Invite </MyButton>
                <MyButton onClick={() => alert("Hello 👋")}> Message </MyButton>
                <MyButton onClick={() => alert("Hello 👋")}> Block </MyButton>
            </div>
        </>
    )
}


export default Profile