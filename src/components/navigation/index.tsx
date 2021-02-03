import { useWs } from "../../ws/ws-context";

import "../../styles/navigation.module.css";

export default function Navigation() {
    const ws = useWs();

    return (
        <nav className="nav">
            <div className="nav-item"></div>
            <div className="nav-item"></div>
        </nav>
    );
}
