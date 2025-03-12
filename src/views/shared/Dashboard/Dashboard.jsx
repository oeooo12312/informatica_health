function Dashboard(user) {

    /**
     * This dashboard is a general dashboard based on user : (Docotr/Patient/Pharmacy)
     * It fulfills a few conditions : 
     *      1. Voice-based for patient, visual for doctor and pharmacy
     *      2. Simple and clean UI cards-based
     */    

    doctors = []
    patients = []
    pharmacies = []
    
    cards = user == "doctor" ? doctors : user == "patient" ? patients : pharmacies

    return (
        <div className="dashboard">
            {/** If its patient and blind , we display a voice-based UI else visual UI */}
            {user == patient ? <></> : 
                
                <div>
                </div>}
        </div>
    )

}

export default Dashboard;