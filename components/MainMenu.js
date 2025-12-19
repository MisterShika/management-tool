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
                    buttonColor="bg-blue-600"
                />
            )}
            <MenuButton 
                buttonTitle="生徒"
                link="/students"
                buttonColor="bg-green-600"
            />
            <MenuButton 
                buttonTitle="予定"
                link="/calendar"
                buttonColor="bg-red-600"
            />
            <MenuButton 
                buttonTitle="授業"
                link="/lessons"
                buttonColor="bg-purple-600"
            />
            <MenuButton 
                buttonTitle="迎え"
                link="/pickup"
                buttonColor="bg-amber-600"
            />
            <MenuButton 
                buttonTitle="学校"
                link="/schools"
                buttonColor="bg-rose-600"
            />
        </nav>
    )
}