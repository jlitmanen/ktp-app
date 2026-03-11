import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login({ username, password });
      setAuth(true);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        "Kirjautuminen epäonnistui. Tarkista käyttäjätunnus ja salasana.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-prussian_blue">
            Kirjaudu sisään
          </h2>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Käyttäjätunnus
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-alabaster_grey-400 placeholder-alabaster_grey-300 text-black rounded-t-md focus:outline-none focus:ring-orange focus:border-orange focus:z-10 sm:text-sm"
                placeholder="Käyttäjätunnus"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" throws className="sr-only">
                Salasana
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-alabaster_grey-400 placeholder-alabaster_grey-300 text-black rounded-b-md focus:outline-none focus:ring-orange focus:border-orange focus:z-10 sm:text-sm"
                placeholder="Salasana"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-prussian_blue bg-orange hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-prussian_blue"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Kirjaudu"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-black">
            Tarvitsetko tunnukset?{" "}
            <Link
              to="/signup"
              className="font-medium text-orange hover:text-orange-600"
            >
              Rekisteröidy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
