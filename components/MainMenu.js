import MenuButton from './MenuButton';

export default function MainMenu() {
    return(
        <nav>
            <MenuButton 
                buttonTitle="スタッフ"
                link="/staff"
            />
            <MenuButton 
                buttonTitle="生徒"
                link="/students"
                buttonColor="bg-green-500"
            />
        </nav>
    )
}