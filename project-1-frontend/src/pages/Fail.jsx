import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div style={{ maxWidth:"500px", margin:"50px auto", textAlign:"center" }}>
      <h2>❌ Payment Cancelled</h2>
      <p>Your payment was not completed.</p>

      <Link to="/bookguide">
        <button style={{ marginTop:"20px" }}>Try Again</button>
      </Link>
    </div>
  );
}
