
import Card from "../../../components/Card/Card";
import "./Dashboard.css";

function Dashboard({userType}) {

    /**
     * This dashboard is a general dashboard based on user : (Docotr/Patient/Pharmacy)
     * It fulfills a few conditions : 
     *      1. Voice-based for patient, visual for doctor and pharmacy
     *      2. Simple and clean UI cards-based
     *      3. Not sure if we need a dashboard for patient ? What do you all think ? Maybe, maybe not ? 
     *         How are the blind people going to be able to use the dashbaord anyway... This will be different
     *         in design.
     */    
    const cardData = {
        'doctor': [
          ["Appointments", "/appointments"]
        ],
        'patient': [
          ["Appointments", "/appointments"]
        ],
        'pharmacy': [
          ["Medical Supplies", "/supplies"]
        ]
    };
    console.log(userType);
    const cards = cardData[userType] || [];

    return (
        <div className="dashboard">
        {/* Conditional rendering based on user type */}
        {userType === "patient" ? (
            <div className="voice-dashboard">
                {/* Add voice-based UI here (e.g., screen reader, voice commands) */}
                <p>Voice-based UI for patient</p>
            </div>
        ) : (
            <div className="visual-dashboard">
            {/* Visual dashboard for doctors and pharmacies */}
                <div className="card-container">
                    {cards.map((card, index) => (
                        <Card key={index} keyValue={card} />
                ))}
                </div>
            </div>
        )}
        </div>
    );
}

export default Dashboard;