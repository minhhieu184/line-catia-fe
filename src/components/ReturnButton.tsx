import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReturnButton({ className }: { className?: string }) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className={className} type="button">
      <ArrowLeft />
    </button>
  );
}
