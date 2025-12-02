"use client";

import MenuButton from './MenuButton';
import { useUser } from "@/components/UserContext";

export default function MainMenu() {
    const user = useUser();

    return(
        <nav className="flex flex-row flex-wrap gap-5 justify-center items-center p-10">
            {user?.access === "ADMIN" && (
                <MenuButton
                    buttonTitle="仕事"
                    link="/staff"
                />
            )}
            <MenuButton 
                buttonTitle="生徒"
                link="/students"
                buttonColor="bg-green-500"
            />
            <MenuButton 
                buttonTitle="予定"
                link="/calendar"
                buttonColor="bg-purple-500"
            />
            <MenuButton 
                buttonTitle="授業"
                link="/lessons"
                buttonColor="bg-rose-800"
            />
        </nav>
    )
}