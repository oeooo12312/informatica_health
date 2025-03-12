import "./Card.css";
import { useNavigate } from "react-router-dom";

function Card({keyValue}) {

    const [title, link] = keyValue;
    const navigate = useNavigate();

    return (
      <div className="card" onClick={() => navigate(link)}>
        <h3>{title}</h3>
      </div>
    );
  }
  
  export default Card;