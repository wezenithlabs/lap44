import { useRef, useState, useEffect } from "react";

export default function Landing() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showGameInfo, setShowGameInfo] = useState(false);

  // Ensure video autoplays on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((err) => {
        console.log("Autoplay blocked:", err);
      });
    }
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(!isMuted);
    }
  };

  const cards = [
    {
      title: "The Primordial Tree",
      desc: "Pay tribute to the ancient origin of all life in the valley...",
    },
    {
      title: "Cernuna’s Garden",
      desc: "Discover the story of your new farm in the middle of the forest...",
    },
    {
      title: "Tears of the Night",
      desc: "A deep dive through the origin story of Lucky Star...",
    },
    {
      title: "The Primordial Treasure Hoard",
      desc: "A deep dive through the origin story of Chumbi Token...",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f0c] text-white font-mono">
      {/* Navbar - Transparent and overlaid */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-6 bg-transparent">
        <div className="text-2xl font-bold font-[anton]">lap44</div>
        <ul className="hidden md:flex space-x-8 text-gray-300">
          <li 
            className="hover:text-white cursor-pointer"
            onClick={() => setShowGameInfo(true)}
          >
            Game Info
          </li>
          <li className="hover:text-white cursor-pointer">Token</li>
          <li className="hover:text-white cursor-pointer">About</li>
          <li className="hover:text-white cursor-pointer">Lore</li>
        </ul>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleMute}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/50 hover:bg-white/10 transition backdrop-blur-sm"
            title={isMuted ? "Unmute Video" : "Mute Video"}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            )}
          </button>
          <button className="border border-white px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black">
            BUY CHMB
          </button>
        </div>
      </nav>

      {/* Game Info Popup Modal */}
      {showGameInfo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-lg p-4"
          onClick={() => setShowGameInfo(false)}
        >
          <div 
            className="bg-[#0a0a0a] border border-gray-800 rounded-xl w-full max-w-6xl h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-black px-8 py-6 flex justify-between items-center border-b border-gray-800">
              <div>
                <h1 className="text-3xl font-bold text-white">DF1RA</h1>
                <p className="text-gray-400 text-sm mt-1">F1 Racing, Rebuilt on Web3</p>
              </div>
              <button
                onClick={() => setShowGameInfo(false)}
                className="text-gray-400 hover:text-white text-3xl w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* Content - Two Column Layout */}
            <div className="grid grid-cols-2 gap-8 p-8 h-[calc(85vh-88px)]">
              
              {/* Left Column - Benefits */}
              <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-white"></span>
                  Benefits
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-white font-semibold mb-2 text-sm">RACERS</div>
                    <div className="text-gray-400 text-sm space-y-1">
                      <p>• Earn guaranteed rewards</p>
                      <p>• Race live in 2D F1</p>
                      <p>• No empty-handed exits</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <div className="text-white font-semibold mb-2 text-sm">VIEWERS</div>
                    <div className="text-gray-400 text-sm space-y-1">
                      <p>• Bet with Sepolia ETH</p>
                      <p>• Win 90% of pot</p>
                      <p>• AI predicts winners</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <div className="text-white font-semibold mb-2 text-sm">SPONSORS</div>
                    <div className="text-gray-400 text-sm space-y-1">
                      <p>• Pay once, show ads</p>
                      <p>• Reach live audience</p>
                      <p>• Boost brand in-game</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <div className="text-white font-semibold mb-2 text-sm">ORGANISERS</div>
                    <div className="text-gray-400 text-sm space-y-1">
                      <p>• Host races easily</p>
                      <p>• Earn 10% rake</p>
                      <p>• Full on-chain control</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <div className="text-white font-semibold mb-2 text-sm">EVERYONE</div>
                    <div className="text-gray-400 text-sm space-y-1">
                      <p>• Wallet login only</p>
                      <p>• Transparent payouts</p>
                      <p>• Real-time Web3 fun</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Actions */}
              <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-white"></span>
                  What Each Entity Can Do
                </h2>
                
                <div className="space-y-6">
                  <div className="border-l-2 border-gray-600 pl-4">
                    <div className="text-white font-semibold mb-2">Organiser</div>
                    <div className="text-gray-400 text-sm">
                      Create race → Set entry fee → Start & earn rake
                    </div>
                  </div>

                  <div className="border-l-2 border-gray-600 pl-4">
                    <div className="text-white font-semibold mb-2">Racer</div>
                    <div className="text-gray-400 text-sm">
                      Pay to join → Compete live → Claim prize share
                    </div>
                  </div>

                  <div className="border-l-2 border-gray-600 pl-4">
                    <div className="text-white font-semibold mb-2">Viewer</div>
                    <div className="text-gray-400 text-sm">
                      Watch race → Bet on driver → Claim winnings
                    </div>
                  </div>

                  <div className="border-l-2 border-gray-600 pl-4">
                    <div className="text-white font-semibold mb-2">Sponsor</div>
                    <div className="text-gray-400 text-sm">
                      Pay ETH → Upload ad → Display on track
                    </div>
                  </div>
                </div>

                {/* Tech Stack Info */}
                <div className="mt-12 p-4 bg-gray-900/50 border border-gray-800 rounded">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Tech Stack</div>
                  <div className="text-sm text-gray-300">
                    Ethereum Sepolia Testnet • WebSocket Racing • 2D F1 Game Engine
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Now extends to top */}
      <section className="relative w-full h-screen bg-gradient-to-b from-blue-900 to-green-900 flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Background Video with Blur */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
        >
          <source src="/loosemy.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            A Mystical Journey Awaits
          </h1>
          <p className="text-gray-200 max-w-xl mx-auto mb-6">
            Immerse yourself in the ancient knowledge and engaging stories of
            Chumbi Valley...
          </p>
          <button className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition">
            Read the introduction article →
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="text-center mt-16 mb-8 space-x-10 text-lg">
        <button className="text-white font-bold border-b-2 border-green-500">
          The Valley
        </button>
        <button className="text-green-400 hover:text-green-200">Chumbi</button>
        <button className="text-green-400 hover:text-green-200">
          Characters
        </button>
      </div>

      {/* Cards Section */}
      <section className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 px-10 pb-20">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-[#111814] rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition transform"
          >
            <img
              src={`https://placehold.co/400x250?text=${encodeURIComponent(
                card.title
              )}`}
              alt={card.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2">{card.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{card.desc}</p>
              <button className="text-green-400 hover:text-green-200 font-semibold">
                Learn more →
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-[#0b0f0c] border-t border-gray-800 px-10 py-12 text-gray-400">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl text-white font-bold mb-2">chumbi valley</h3>
            <p className="text-sm">© 2025 All rights reserved.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Explore</h4>
            <ul className="space-y-1 text-sm">
              <li>Game Features</li>
              <li>Gallery</li>
              <li>Whitepaper</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Connect</h4>
            <div className="flex space-x-3 text-lg">
              <i className="fa-brands fa-twitter"></i>
              <i className="fa-brands fa-discord"></i>
              <i className="fa-brands fa-youtube"></i>
              <i className="fa-brands fa-telegram"></i>
            </div>
            <div className="mt-4 flex">
              <input
                placeholder="Enter your email"
                className="bg-[#111814] px-3 py-2 rounded-l-full outline-none text-sm text-white w-48"
              />
              <button className="bg-green-500 px-4 py-2 rounded-r-full text-sm font-semibold hover:bg-green-400">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
