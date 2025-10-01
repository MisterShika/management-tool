import MenuButton from './MenuButton';

export default function MainMenu() {
    return(
        <nav>
            <MenuButton 
                buttonTitle="スタッフ"
                link="/staff"
            />
        </nav>
    )
}