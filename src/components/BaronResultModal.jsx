import React from 'react';

const BaronResultModal = ({ 
  isOpen, 
  onConfirm, 
  userRole, // "attacker" or "target"
  attackerName,
  targetName,
  attackerCard,
  targetCard,
  eliminatedPlayer,
  isTie,
  message 
}) => {
  if (!isOpen) return null;

  // Determine if this player was eliminated
  const currentPlayer = userRole === "attacker" ? attackerName : targetName;
  const wasEliminated = eliminatedPlayer === currentPlayer;
  
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>⚔️ Baron's Duel Results ⚔️</h2>
        
        <div style={{ margin: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <h3>🏰 {attackerName}</h3>
              <div style={{ border: '2px solid #8B4513', borderRadius: '8px', padding: '10px', margin: '5px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{attackerCard.name}</div>
                <div style={{ color: '#666' }}>Strength: {attackerCard.strength}</div>
                {attackerCard.effect && (
                  <div style={{ fontStyle: 'italic', fontSize: '12px', marginTop: '5px', color: '#555' }}>
                    "{attackerCard.effect}"
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '0 20px', fontSize: '20px', fontWeight: 'bold' }}>
              ⚔️ VS ⚔️
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <h3>🏰 {targetName}</h3>
              <div style={{ border: '2px solid #8B4513', borderRadius: '8px', padding: '10px', margin: '5px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{targetCard.name}</div>
                <div style={{ color: '#666' }}>Strength: {targetCard.strength}</div>
                {targetCard.effect && (
                  <div style={{ fontStyle: 'italic', fontSize: '12px', marginTop: '5px', color: '#555' }}>
                    "{targetCard.effect}"
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '20px 0', padding: '15px', backgroundColor: isTie ? '#e6f3ff' : wasEliminated ? '#ffe6e6' : '#e6ffe6', borderRadius: '8px' }}>
            {isTie ? (
              <div>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>🤝</div>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Honorable Draw!</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Both knights live to fight another day</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>
                  {wasEliminated ? '💀' : '🏆'}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                  {eliminatedPlayer === attackerName ? `${targetName} Wins!` : `${attackerName} Wins!`}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {eliminatedPlayer} is eliminated from the round
                </div>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px', fontStyle: 'italic' }}>
            <p>{message}</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {/* Only show confirm button to attacker (to control game flow) */}
          {userRole === "attacker" && (
            <button onClick={onConfirm} style={{ padding: '10px 20px', fontSize: '16px' }}>
              Continue ⚔️
            </button>
          )}
          {userRole === "target" && (
            <div style={{ fontStyle: 'italic', color: '#888' }}>
              ⏳ Waiting for {attackerName} to continue...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaronResultModal;
