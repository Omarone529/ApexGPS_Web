import './PlannerForm.css';

const PlannerForm = ({ form, updateForm, handleAddWaypoint, isGenerating, handleGenerateRoute, routePoints }) => {
    const waypointCount = form.waypoints.filter(w => w.trim() !== '').length;

    return (
        <div className="planner-form-card">
            <div className="form-section">
                <h3><span className="section-number">1</span> Dettagli</h3>
                <input
                    className="form-input"
                    placeholder="Nome itinerario"
                    value={form.name}
                    onChange={e => updateForm('name', e.target.value)}
                />
                <textarea
                    className="form-input"
                    placeholder="Descrizione"
                    value={form.description}
                    onChange={e => updateForm('description', e.target.value)}
                    rows="2"
                />
            </div>

            <div className="form-section">
                <h3><span className="section-number">2</span> Percorso</h3>
                <input
                    className="form-input"
                    placeholder="Partenza"
                    value={form.start}
                    onChange={e => updateForm('start', e.target.value)}
                />
                <input
                    className="form-input"
                    placeholder="Arrivo"
                    value={form.end}
                    onChange={e => updateForm('end', e.target.value)}
                />

                <div className="waypoints-section">
                    <div className="waypoints-counter">
                        <span>Tappe intermedie</span>
                        {waypointCount > 0 && (
                            <span className="waypoints-counter-badge">
                {waypointCount} {waypointCount === 1 ? 'tappa' : 'tappe'}
              </span>
                        )}
                    </div>

                    {form.waypoints.map((w, i) => (
                        <div key={i} className={`waypoint-item ${w.trim() !== '' ? 'active' : ''}`}>
                            <span className="waypoint-num">{i + 1}</span>
                            <input
                                className="form-input"
                                placeholder={`Tappa ${i + 1}`}
                                value={w}
                                onChange={e => {
                                    const newWps = [...form.waypoints];
                                    newWps[i] = e.target.value;
                                    updateForm('waypoints', newWps);
                                }}
                            />
                            {form.waypoints.length > 1 && (
                                <button
                                    className="remove-btn"
                                    onClick={() => updateForm('waypoints', form.waypoints.filter((_, idx) => idx !== i))}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}

                    <button className="add-waypoint-btn" onClick={handleAddWaypoint}>
                        + Aggiungi tappa
                    </button>
                </div>
            </div>

            <div className="form-section">
                <h3><span className="section-number">3</span> Impostazioni</h3>
                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={form.isPublic}
                        onChange={e => updateForm('isPublic', e.target.checked)}
                    />
                    <span>Rendi pubblico</span>
                </label>
            </div>

            <div className={`route-generation-progress ${isGenerating ? 'active' : ''}`}>
                <div>Generazione percorso in corso...</div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: isGenerating ? '100%' : '0%' }}></div>
                </div>
            </div>

            {routePoints.length > 0 && (
                <div className="success-message">
                    <span>✓</span>
                    Percorso pronto! Puoi modificare le tappe o salvare.
                </div>
            )}

            <div className="form-actions">
                <button className="btn secondary">Salva bozza</button>
                <button
                    className={`btn primary ${isGenerating ? 'loading' : ''}`}
                    onClick={handleGenerateRoute}
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Generazione...' : 'Genera percorso'}
                </button>
            </div>
        </div>
    );
};

export default PlannerForm;