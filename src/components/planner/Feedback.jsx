import './Feedback.css';

const Feedback = ({ feedback }) => {
    if (!feedback.show) return null;

    const feedbackClass = `feedback-notification ${feedback.type}`;

    return (
        <div className={feedbackClass}>
      <span className="feedback-icon">
        {feedback.type === 'success' ? '🎉' :
            feedback.type === 'waypoint' ? '✓' :
                feedback.type === 'error' ? '⚠️' : '💡'}
      </span>
            <span className="feedback-message">{feedback.message}</span>
        </div>
    );
};

export default Feedback;