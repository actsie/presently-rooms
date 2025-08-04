// Simple sparkles effect without external library
export const createSparkles = (element, options = {}) => {
  const { count = 20 } = options;
  
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    const size = Math.random() * 12 + 8; // Random size between 8-20px
    
    sparkle.innerHTML = '⭐';
    sparkle.style.cssText = `
      position: fixed;
      font-size: ${size}px;
      color: #FFD700;
      text-shadow: 0 0 2px #FFD700, 0 0 4px rgba(255, 165, 0, 0.3);
      pointer-events: none;
      z-index: 10000;
      left: ${centerX}px;
      top: ${centerY}px;
      filter: drop-shadow(0 0 1px rgba(255, 215, 0, 0.4));
    `;
    
    document.body.appendChild(sparkle);
    
    // Animate sparkle
    const angle = (Math.PI * 2 * i) / count;
    const distance = Math.random() * 100 + 50;
    const duration = Math.random() * 1000 + 500;
    
    sparkle.animate([
      { 
        transform: 'translate(0, 0) scale(0)', 
        opacity: 1 
      },
      { 
        transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`, 
        opacity: 0.7,
        offset: 0.7
      },
      { 
        transform: `translate(${Math.cos(angle) * distance * 1.5}px, ${Math.sin(angle) * distance * 1.5}px) scale(0)`, 
        opacity: 0 
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => {
      sparkle.remove();
    };
  }
};

export const playChime = () => {
  // Create a gentle chime sound using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Create a pleasant chime sequence
  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
  oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
  oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.8);
};