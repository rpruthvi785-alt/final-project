import { useParams } from 'react-router-dom';

const ActivityDetails = () => {
  const { id } = useParams();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Activity Details: {id}</h1>
      <div className="text-center py-20 text-slate-500">
        <p className="text-xl">Activity details will be displayed here.</p>
      </div>
    </div>
  );
};

export default ActivityDetails;
