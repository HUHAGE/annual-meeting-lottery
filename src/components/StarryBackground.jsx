import { useEffect, useRef } from 'react';
import '../styles/starry-background.css';

const StarryBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.error('Container not found');
      return;
    }

    console.log('Container dimensions:', {
      width: container.offsetWidth,
      height: container.offsetHeight
    });

    const createStars = () => {
      container.innerHTML = '';
      
      const numberOfStars = 200;
      
      for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 3 + 2;
        const duration = Math.random() * 4 + 3;
        const delay = Math.random() * 2;
        
        star.style.cssText = `
          left: ${left}%;
          top: ${top}%;
          width: ${size}px;
          height: ${size}px;
          --duration: ${duration}s;
          animation-delay: ${delay}s;
          background-color: white;
        `;
        
        container.appendChild(star);
      }

      // 调试信息
      console.log(`Created ${numberOfStars} stars`);
    };

    createStars();
    const interval = setInterval(createStars, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div 
        ref={containerRef} 
        className="starry-background"
        style={{
          backgroundColor: '#000000',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0
        }}
      />
      {/* 添加一个测试星星 */}
      <div 
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '10px',
          height: '10px',
          backgroundColor: 'red',
          borderRadius: '50%',
          zIndex: 1
        }}
      />
    </>
  );
};

export default StarryBackground; 