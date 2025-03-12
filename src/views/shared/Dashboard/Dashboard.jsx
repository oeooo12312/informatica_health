import Card from "../../../components/Card/Card";
import "./Dashboard.css";

function Dashboard({ userType }) {
    /**
     * This dashboard is a general dashboard based on user type (Doctor/Patient/Pharmacy)
     * It fulfills a few conditions:
     * 1. Voice-based for patient, visual for doctor and pharmacy
     * 2. Simple and clean UI cards-based
     * 3. Not sure if we need a dashboard for patient? What do you all think? Maybe, maybe not? 
     *    How are blind people going to use the dashboard anyway... This will be different in design.
     */    

    const analyticsData = {
        'doctor': [
            { title: "Total Appointments", value: "120", description: "Appointments scheduled this week" },
            { title: "Active Patients", value: "85", description: "Patients currently being treated" },
            { title: "Prescription Requests", value: "58", description: "Requests made for prescriptions" },
            { title: "Completed Surgeries", value: "35", description: "Surgeries successfully completed" }
        ],
        'patient': [
            { title: "Upcoming Appointments", value: "2", description: "Appointments scheduled for the week" },
            { title: "Medication Reminders", value: "4", description: "Upcoming medications to take" },
            { title: "Recent Consultations", value: "3", description: "Recent consultations with doctors" },
            { title: "Lab Results Pending", value: "1", description: "Lab results awaiting review" }
        ],
        'pharmacy': [
            { title: "Available Stock", value: "1500", description: "Units of medication in stock" },
            { title: "Orders Processed", value: "350", description: "Orders processed this week" },
            { title: "Medication Requests", value: "75", description: "Requests for medication this month" },
            { title: "Pending Shipments", value: "20", description: "Shipments awaiting delivery" }
        ]
    };

    const cards = analyticsData[userType] || [];

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
                            <Card key={index} title={card.title} value={card.value} description={card.description} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;