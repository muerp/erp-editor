import {getAvatarColor, firstChar} from './Utils'
interface AvatarProps  {
    className?: string
    size?: string
    name?: string,
    srt?: string
}
export const Avatar = ({size, name}: AvatarProps) => {
    return (
        <div className={`avatar${size? ' avatar-'+size:''}`}>
            {
                name && <div className='default-avatar d-center' style={{backgroundColor: getAvatarColor(name)}}>{firstChar(name)}</div>
            }
        </div>
    )
}