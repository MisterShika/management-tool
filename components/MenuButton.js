import Link from 'next/link';

export default function MenuButton({buttonTitle, buttonColor, textBrightness, link}) {

    const backgroundColor = buttonColor || 'bg-blue-500';
    const textColor = textBrightness === 'black' ? 'text-black' : 'text-white';

    return(
        <Link href={link}>
        <div 
            className={`${backgroundColor} ${textColor} font-bold text-white aspect-square block rounded-2xl max-w-[150px] p-5 flex justify-center items-center`}>
            {buttonTitle}
        </div>
        </Link>
    )
}