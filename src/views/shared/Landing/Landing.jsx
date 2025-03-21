import "./Landing.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "../../../context/UserContext";

function Landing() {

    const navigate = useNavigate();
    const { user } = useUserContext();

    const handleRedirect = () => {
        navigate("/auth");
    };

    useEffect(() => {
        if (user) {
            navigate("/dashboard")
        } else {
            handleRedirect();
        }
        },
        [user]
    )

    return (
        <div className="landing-container" onClick={handleRedirect}>
        <div className="content">
            <h1 className="title">Welcome to MedCare</h1>
            <p className="description">
            Your health, our priority. Explore our medical services, and get the best care.
            </p>
            <button className="cta-btn">Get Started</button>
        </div>
        </div>
    );
}


export default Landing;