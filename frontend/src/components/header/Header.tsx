import './Header.css';
import Link from '../link/Link.tsx';

export interface HeaderProps {
    user: string;
}

export default function Header(props: HeaderProps) {
    return (
        <header className="header">
            <Link
                className="header__home-link"
                href="/"
                theme="white">ACC 487</Link>

            <div className="header__user">{props.user}</div>
        </header>
    );
}
