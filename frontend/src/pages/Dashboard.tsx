import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold mb-6">Select Your Role</h1>
      <button 
        onClick={() => navigate('/OrganiserLogin')}
        className="bg-blue-500 text-white px-6 py-3 rounded w-full"
      >
        Organiser
      </button>
      <button 
        onClick={() => navigate('/RacerLogin')}
        className="bg-green-500 text-white px-6 py-3 rounded w-full"
      >
        Racer
      </button>
      <button 
        onClick={() => navigate('/ViewerLogin')}
        className="bg-yellow-500 text-white px-6 py-3 rounded w-full"
      >
        Viewer/Spectator
      </button>
      <button 
        onClick={() => navigate('/SponsorLogin')}
        className="bg-purple-500 text-white px-6 py-3 rounded w-full"
      >
        Sponsor
      </button>
    </div>
  );
};

export default Dashboard;