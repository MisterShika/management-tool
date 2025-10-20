"use client";

import MenuButton from './MenuButton';
import { useUser } from "@/components/UserContext";

export default function MainMenu() {
    const user = useUser();

    return(
        <nav>
            
            {user?.access === "ADMIN" && (
                <MenuButton
                    buttonTitle="スタッフ"
                    link="/staff"
                />
            )}
            <MenuButton 
                buttonTitle="生徒"
                link="/students"
                buttonColor="bg-green-500"
            />
            <MenuButton 
                buttonTitle="カレンダー"
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