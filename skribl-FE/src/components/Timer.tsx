import React, { useEffect, useState } from "react";
import {MdOutlineTimer} from "react-icons/md";
interface Props {
    start:number;
    onTimerEnd: ()=>void;
    reset?: boolean;
    stop:boolean;
}

const Timer: React.FC<Props> = ({start,onTimerEnd,stop,reset}) => {
    const [timer,setTimer] = useState(start);
    useEffect(()=>{
        let timerId:any;
        if(timer > 0 && !stop){
            timerId = setInterval(()=>{
                setTimer(t=>--t);
            },1000);
         }else{
            if(!stop){
                onTimerEnd();
            }
            clearInterval(timerId!);
         }

         return ()=>clearInterval(timerId);
    },[timer,onTimerEnd,stop]);

    useEffect(()=>{
        setTimer(start);
    },[start])

    useEffect(()=>{if(reset)setTimer(start)},[reset])

    return<h2 className="flex items-center"><MdOutlineTimer className={`mr-2 ${timer !== start && timer>0 ?"animate-bounce" :""}`}/> {timer}</h2>
}

Timer.defaultProps = {
    reset:false,
    stop:false,
};

export default React.memo(Timer);