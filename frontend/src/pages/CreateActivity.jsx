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

    if (!formData.title.trim()) {
      setError("Please enter an activity name.");
      return;
    }

    if (!formData.location.trim()) {
      setError("Please enter a location.");
      return;
    }

    if (!formData.activity_date) {
      setError("Please select a date and time.");
      return;
    }

    if (Number(formData.max_players) < 2) {
      setError("An activity must have at least 2 players.");
      return;
    }

    try {
      setLoading(true);

      const activityData = {
        title: formData.title.trim(),
        sport: formData.sport,
        description: formData.description.trim() || null,
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

        max_players: Number(formData.max_players),
      };

      await createActivity(activityData);

      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create activity:", error);

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
          type="button"
          className="create-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <span>←</span>
          Back to Discover
        </button>

        <section className="create-activity-card">
          <div className="create-activity-header">
            <div className="create-header-badge">CREATE</div>

            <h1>Start a new game</h1>

            <p>
              Bring players together, create an activity,
              and build your squad.
            </p>
          </div>

          <form
            className="create-activity-form"
            onSubmit={handleSubmit}
          >
            {/* BASIC INFORMATION */}
            <div className="create-section">
              <div className="create-section-heading">
                <span className="create-section-number">01</span>

                <div>
                  <h2>Game details</h2>
                  <p>Tell players what you're organizing.</p>
                </div>
              </div>

              <div className="create-form-group">
                <label htmlFor="title">
                  Activity name
                  <span className="required-mark">*</span>
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

                <span className="field-hint">
                  Give your game a short, recognizable name.
                </span>
              </div>

              <div className="create-form-group">
                <label htmlFor="sport">
                  Sport
                  <span className="required-mark">*</span>
                </label>

                <div className="sport-select-wrapper">
                  <select
                    id="sport"
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    required
                  >
                    <option value="football">Football</option>
                    <option value="cricket">Cricket</option>
                    <option value="badminton">Badminton</option>
                    <option value="basketball">Basketball</option>
                    <option value="tennis">Tennis</option>
                    <option value="volleyball">Volleyball</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="create-form-group">
                <label htmlFor="description">
                  Description
                  <span className="optional-label">Optional</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Tell players about the game, skill level, rules, or anything they should know..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  maxLength={1000}
                />

                <span className="field-hint">
                  {formData.description.length}/1000 characters
                </span>
              </div>
            </div>

            {/* DATE / LOCATION */}
            <div className="create-section">
              <div className="create-section-heading">
                <span className="create-section-number">02</span>

                <div>
                  <h2>When & where</h2>
                  <p>Help players know when and where to meet.</p>
                </div>
              </div>

              <div className="create-form-group">
                <label htmlFor="location">
                  Location
                  <span className="required-mark">*</span>
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Example: Ottapalam Stadium"
                  value={formData.location}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={255}
                  required
                />

                <span className="field-hint">
                  Enter the venue, ground, turf, or meeting point.
                </span>
              </div>

              <div className="create-form-row">
                <div className="create-form-group">
                  <label htmlFor="activity_date">
                    Date & time
                    <span className="required-mark">*</span>
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
                    <span className="required-mark">*</span>
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

                  <span className="field-hint">
                    Including you as the activity creator.
                  </span>
                </div>
              </div>
            </div>

            {/* COORDINATES */}
            <div className="create-section coordinates-section">
              <div className="create-section-heading">
                <span className="create-section-number">03</span>

                <div>
                  <h2>Map location</h2>
                  <p>Optional location coordinates.</p>
                </div>
              </div>

              <div className="coordinates-info">
                <span className="coordinates-icon">⌖</span>

                <div>
                  <strong>Maps integration coming soon</strong>
                  <p>
                    You can leave these fields empty for now.
                    We'll connect this to Maps later.
                  </p>
                </div>
              </div>

              <div className="create-form-row">
                <div className="create-form-group">
                  <label htmlFor="latitude">
                    Latitude
                    <span className="optional-label">Optional</span>
                  </label>

                  <input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    placeholder="10.7800"
                    value={formData.latitude}
                    onChange={handleChange}
                  />
                </div>

                <div className="create-form-group">
                  <label htmlFor="longitude">
                    Longitude
                    <span className="optional-label">Optional</span>
                  </label>

                  <input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    placeholder="76.3700"
                    value={formData.longitude}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="create-error" role="alert">
                <span className="create-error-icon">!</span>

                <div>
                  <strong>Something went wrong</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="create-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="create-spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Activity
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CreateActivity;