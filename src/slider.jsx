import { useStore } from "@/store";
import { Slider } from "../ui/slider";

export const SpeedSlider = () => {
    const{ speed } = useStore();
    <Slider 
    defaultValue = {[1500]}
    min = {500}
    max = {3000}
    step = {1}
    
    
    /> 
}