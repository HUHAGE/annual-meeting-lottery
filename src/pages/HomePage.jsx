import StarryBackground from '../components/StarryBackground';
import './HomePage.css'; // 确保有对应的CSS文件
import '../styles/global.css';

function HomePage() {
  return (
    <div className="home-container">
      <StarryBackground />
      <div className="content" style={{ color: 'white', zIndex: 1, position: 'relative' }}>
        <h1>抽奖首页</h1>
        {/* 其他内容 */}
      </div>
    </div>
  );
}

export default HomePage; 