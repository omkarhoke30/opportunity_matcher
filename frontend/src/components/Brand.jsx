import { Link } from "react-router-dom";
import { APP_NAME } from "../data/constants";

export default function Brand({ to = "/" }) {
  return (
    <Link to={to} className="brand">
      <img src="/logo.png" alt="" />
      <span>{APP_NAME}</span>
    </Link>
  );
}
