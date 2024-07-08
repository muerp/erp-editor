import { CSSProperties } from "react";

export interface ComponentProps {
    children?: any,
    className?: string
}
export interface DOMProps extends React.DOMAttributes<HTMLDivElement> {
    children?: any,
    className?: string
    style?: CSSProperties | undefined;
}
// export interface DOMProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
//     children?: any,
//     className?: string
// }