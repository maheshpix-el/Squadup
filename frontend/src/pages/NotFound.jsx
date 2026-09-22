import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#fafafa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "500px",
        }}
      >
        <div
          style={{
            fontSize: "72px",
            fontWeight: "800",
            color: "#ff6b35",
            lineHeight: 1,
            marginBottom: "16px",
          }}
        >
          404
        </div>

        <h1
          style={{
            margin: "0 0 10px",
            color: "#171717",
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            margin: "0 0 24px",
            color: "#666",
          }}
        >
          The page you're looking for doesn't exist.
        </p>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            border: "none",
            borderRadius: "8px",
            padding: "11px 18px",
            background: "#ff6b35",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </main>
  );
}

export default NotFound;