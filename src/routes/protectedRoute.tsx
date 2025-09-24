import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    api
      .get("/check-token")
      .then(() => setIsValid(true))
      .catch(() => setIsValid(false));
  }, []);

  if (isValid === null) return <p>Loading...</p>;
  if (!isValid) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
