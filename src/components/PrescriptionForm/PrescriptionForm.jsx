import React, { useState, useEffect } from "react";
import './PrescriptionForm.css';
import products_json from '../../assets/products_prices.json';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

const PrescriptionForm = ({ appointment }) => {
  const [products, setProducts] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [consultationNotes, setConsultationNotes] = useState(""); // NEW STATE
  const [finalized, setFinalized] = useState(false);

  useEffect(() => {
    setProducts(products_json);
  }, [products_json]);

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { productId: "", quantity: 1, dosage: "" }]);
  };

  const updatePrescription = (index, field, value) => {
    const updatedPrescriptions = prescriptions.map((prescription, i) =>
      i === index ? { ...prescription, [field]: value } : prescription
    );
    setPrescriptions(updatedPrescriptions);
  };

  const removePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const processPayment = async () => {
    await saveForm();
    setFinalized(true);
    if (prescriptions.length === 0) {
      alert("Please add at least one prescription.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/appointments/create-payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          line_items: prescriptions
          .filter((p) => p.productId)  // Filter out prescriptions without a productId
          .map((p) => ({
            price: products[p.productId]?.priceId,  // Get priceId from the JSON
            quantity: p.quantity,
          })),
          customerEmail: appointment.email, // Customer email (for example)
        }),
      });

      console.log(response);
      // const data = await response.json();

      // if (data.url) {
      //   window.location.href = data.url; // Redirect to Stripe payment link
      // } else {
      //   alert("Failed to create payment link.");
      // }
    } catch (error) {
      console.error("Error creating payment link:", error);
    }
  };

  const saveForm = async () => {
    const formData = {
      ...appointment,
      consultationNotes,
      prescriptions,
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, "prescriptions"), formData);
      alert("Form saved successfully!");
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save form.");
    }
  };

  return (
    <div className="prescription-form">
      <h3>Consultation Form</h3>
      <label>Patient Name</label>
      <input
        type="text"
        name="patientName"
        defaultValue={appointment.name}
        readOnly
        disabled={finalized}
      />

      <label>Consultation Notes</label>
      <textarea
        name="notes"
        value={consultationNotes}
        onChange={(e) => setConsultationNotes(e.target.value)}
        disabled={finalized}
      ></textarea>

      {prescriptions.map((prescription, index) => (
        <div key={index} className="prescription-entry">
          <select
            value={prescription.productId}
            onChange={(e) => updatePrescription(index, "productId", e.target.value)}
            disabled={finalized}
          >
            <option value="">Select a product</option>
            {Object.entries(products).map(([id, product]) => (
              <option key={id} value={id}>
                {product.description}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={prescription.quantity}
            onChange={(e) => updatePrescription(index, "quantity", e.target.value)}
            placeholder="Quantity"
            min="1"
            disabled={finalized}
          />

          <input
            type="text"
            value={prescription.dosage}
            onChange={(e) => updatePrescription(index, "dosage", e.target.value)}
            placeholder="Dosage Instructions"
            disabled={finalized}
          />

          <button onClick={() => removePrescription(index)} disabled={finalized}>
            Remove
          </button>
        </div>
      ))}

      {!finalized && (
        <button onClick={addPrescription}>+ Add Prescription</button>
      )}

      {/* ✅ SAVE FORM BUTTON */}
      {/* <button
        onClick={saveForm}
        style={{ marginTop: "10px", backgroundColor: "green", color: "white" }}
        disabled={finalized}
      >
        Save Form
      </button> */}

      <button onClick={processPayment} disabled={finalized}>
        Finalize Consultation
      </button>
    </div>
  );
};

export default PrescriptionForm;