// Card.jsx
import "./Card.css";

function Card({ title, value, description }) {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p className="card-value">{value}</p>
            <p className="card-description">{description}</p>
        </div>
    );
}

export default Card;