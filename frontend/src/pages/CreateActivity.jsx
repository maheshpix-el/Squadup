import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createActivity } from "../api/activities";
import Navbar from "../components/Navbar";

import "../components/CreateActivity.css";


function CreateActivity() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    sport: "football",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    activity_date: "",
    max_players: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const activityData = {
        title: formData.title.trim(),

        sport: formData.sport,

        description:
          formData.description.trim() || null,

        location: formData.location.trim(),

        latitude:
          formData.latitude === ""
            ? null
            : Number(formData.latitude),

        longitude:
          formData.longitude === ""
            ? null
            : Number(formData.longitude),

        activity_date: new Date(
          formData.activity_date
        ).toISOString(),

        max_players: Number(
          formData.max_players
        ),
      };

      await createActivity(activityData);

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Failed to create activity:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Unable to create activity. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="create-activity-page">

      <Navbar />

      <main className="create-activity-container">

        <button
          className="create-back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back to Discover
        </button>


        <section className="create-activity-card">

          <div className="create-activity-header">

            <p>Create</p>

            <h1>
              Start a new game
            </h1>

            <span>
              Bring players together and build
              your squad.
            </span>

          </div>


          <form
            className="create-activity-form"
            onSubmit={handleSubmit}
          >

            <div className="form-row">

              <div className="create-form-group">

                <label htmlFor="title">
                  Activity name
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Example: Evening Football"
                  value={formData.title}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={150}
                  required
                />

              </div>


              <div className="create-form-group">

                <label htmlFor="sport">
                  Sport
                </label>

                <select
                  id="sport"
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                >
                  <option value="football">
                    Football
                  </option>

                  <option value="cricket">
                    Cricket
                  </option>

                  <option value="badminton">
                    Badminton
                  </option>

                  <option value="basketball">
                    Basketball
                  </option>

                  <option value="tennis">
                    Tennis
                  </option>

                  <option value="volleyball">
                    Volleyball
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>

              </div>

            </div>


            <div className="create-form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Tell players about the game..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />

            </div>


            <div className="create-form-group">

              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="Example: Ottapalam"
                value={formData.location}
                onChange={handleChange}
                minLength={2}
                maxLength={255}
                required
              />

            </div>


            <div className="form-row">

              <div className="create-form-group">

                <label htmlFor="activity_date">
                  Date & time
                </label>

                <input
                  id="activity_date"
                  name="activity_date"
                  type="datetime-local"
                  value={formData.activity_date}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="create-form-group">

                <label htmlFor="max_players">
                  Maximum players
                </label>

                <input
                  id="max_players"
                  name="max_players"
                  type="number"
                  min="2"
                  max="100"
                  value={formData.max_players}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="coordinates-section">

              <div>
                <h3>
                  Location coordinates
                </h3>

                <p>
                  Optional for now. We'll connect
                  this to Maps later.
                </p>
              </div>


              <div className="form-row">

                <div className="create-form-group">

                  <label htmlFor="latitude">
                    Latitude
                  </label>

                  <input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    placeholder="10.78"
                    value={formData.latitude}
                    onChange={handleChange}
                  />

                </div>


                <div className="create-form-group">

                  <label htmlFor="longitude">
                    Longitude
                  </label>

                  <input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    placeholder="76.37"
                    value={formData.longitude}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>


            {error && (
              <div className="create-error">
                {error}
              </div>
            )}


            <div className="create-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate("/dashboard")
                }
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Activity"}
              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

export default CreateActivity;
