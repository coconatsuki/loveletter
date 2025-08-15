import React from "react";

export default function EffectResultModal({
  resultText,
  cardDetails = null,
  onClose,
}) {
  console.log("EffectResultModal has been called! / resultText: ", resultText);

  // Helper function to format text with line breaks
  const formatText = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Check if this is a Handmaid protection message
  const isHandmaidProtection = resultText?.includes('tea and biscuits') || 
                               resultText?.includes('protected from courtly intrigue');

  return (
    <div className="modal" style={modalOverlayStyle}>
      <div className="modal-content" style={{
        ...modalContentStyle,
        ...(isHandmaidProtection ? handmaidModalStyle : {})
      }}>
        <h3 style={headerStyle}>
          {isHandmaidProtection ? '🛡️ Protected by the Handmaid' : 'Effect Result'}
        </h3>
        
        <div style={messageStyle}>
          {formatText(resultText)}
        </div>

        {cardDetails && (
          <div style={cardDetailsStyle}>
            {Object.entries(cardDetails).map(([label, value]) => (
              <div key={label} style={detailRowStyle}>
                <strong>{label}:</strong> {value}
              </div>
            ))}
          </div>
        )}

        <div style={buttonContainerStyle}>
          <button onClick={onClose} style={buttonStyle}>
            {isHandmaidProtection ? '🍃 Very Well' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Enhanced styling
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  maxWidth: '400px',
  width: '90%',
  textAlign: 'center',
  border: '3px solid #8B4513'
};

const handmaidModalStyle = {
  backgroundColor: '#f9f7f4',
  border: '3px solid #6B4423',
  boxShadow: '0 8px 32px rgba(107, 68, 35, 0.3)'
};

const headerStyle = {
  color: '#8B4513',
  marginBottom: '1.5rem',
  fontSize: '1.5rem',
  fontWeight: 'bold'
};

const messageStyle = {
  fontSize: '1.1rem',
  lineHeight: '1.6',
  color: '#4a4a4a',
  marginBottom: '1.5rem',
  padding: '1rem',
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  border: '1px solid #ddd'
};

const cardDetailsStyle = {
  marginTop: '1rem',
  padding: '1rem',
  backgroundColor: '#f0f0f0',
  borderRadius: '8px',
  textAlign: 'left'
};

const detailRowStyle = {
  marginBottom: '0.5rem'
};

const buttonContainerStyle = {
  marginTop: '1.5rem'
};

const buttonStyle = {
  padding: '0.8rem 1.5rem',
  fontSize: '1rem',
  backgroundColor: '#8B4513',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.2s'
};
