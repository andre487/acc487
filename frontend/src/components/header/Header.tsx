import cn from './Header.module.scss';
import Link from '@components/link/Link.tsx';

export interface HeaderProps {
    user: string;
}

export default function Header(props: HeaderProps) {
    return (
        <header className={cn.header}>
            <Link
                href="/"
                theme="white">ACC 487</Link>

            <div>{props.user}</div>
        </header>
    );
}
