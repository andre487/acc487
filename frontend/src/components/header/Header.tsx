import './Header.css';
import Link from '../link/Link.tsx';

export default function Header() {
    return (
        <header className="header">
            <Link
                className="header__home-link"
                href="/"
                theme="white">ACC 487</Link>
        </header>
    );
};
