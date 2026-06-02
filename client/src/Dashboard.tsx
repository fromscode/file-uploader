import { useEffect } from "react"
import { useNavigate } from "react-router"

export default function Dashboard() {

    const navigate = useNavigate();

    useEffect(() => {
        // TO-DO fetch dashboard details, and if the result is unauthorzied then redirect to login page

        navigate('/begin');
    }, [])

    return <div>This is the dashboard</div>
}