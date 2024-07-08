interface SvgIconProps {
    className?: string
    iconClass: string
}

export const SvgIcon = ({ className, iconClass }: SvgIconProps) => {
    return (
        <svg className={`svg-icon${className? ' '+className:''}`}>
            <use xlinkHref={"#icon-" + iconClass} />
        </svg>
    )
}