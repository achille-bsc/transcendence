import Profile from "../Profile.tsx"
import MyButton from "./Button.tsx"
import Img from "./Img.tsx"
import { menu, user, friends, game, notifications } from "../../icons/Icons.tsx"
import SwitchButton from "./SwitchButton.tsx"
import { useState } from "react";

function DisplayFriends(){
    return
}

function SwitchLights(){
    return alert("test")
}

function DisplayMenu(){
    return
}

function Main (){
    const [isOn, setIsOn] = useState(false);
    return (
        <div className="h-20 bg-black flex items-center justify-between px-2 md:px-10">
            <div className="flex items-center space-x-4">
              <MyButton onClick={() => DisplayMenu()}><Img src={menu} alt="Menu" className="w-[2vw] h-[4vw]" /></MyButton>
              <MyButton onClick={() => DisplayFriends()}><Img src={friends} alt="Friends" className="w-[2vw] h-[4vw]"/></MyButton>
              <SwitchButton  checked={isOn} onChange={() => setIsOn(!isOn)} />
            </div>
            <span className="text-purple-900 text-[30px] md:text-[50px] font-bold">
                Transcendence
            </span>
            <div className="flex items-center space-x-4">
              <MyButton onClick={() => DisplayMenu()}><Img src={game} alt="Game" className="w-[2vw] h-[4vw]"/></MyButton>
              <MyButton onClick={() => DisplayMenu()}><Img src={notifications} alt="Notifications" className="w-[2vw] h-[4vw]"/></MyButton>
              <MyButton onClick={() => Profile()}><Img src={user} alt="User" className="w-[2vw] h-[4vw]"/></MyButton>
            </div>
        </div>
    )
}

export default Main