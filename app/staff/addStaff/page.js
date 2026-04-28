"use client";
import AddUser from "@/components/AddUser";
import NavigationButtons from '@/components/NavigationButtons';

export default function AddStaff() {
    return (<div>
        <NavigationButtons />
        {/* I'm not sure why I did this as a component. I'm so sorry, future me. */}
        {/* Dear past me. Why did you do this as a component? */}
        <AddUser />
    </div>);
};