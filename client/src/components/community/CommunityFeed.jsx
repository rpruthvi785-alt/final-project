import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const CommunityFeed = ({ posts = [], onLike, onComment }) => {
  return (
    <div className="space-y-8">
      {posts.map((post, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-border"
        >
          {/* Post Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700">
              {post.user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">{post.user?.name || 'Community Member'}</h4>
              <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(post.createdAt))} ago</p>
            </div>
          </div>

          {/* Post Content */}
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-4">
            {post.content}
          </p>

          {/* Post Media */}
          {post.media?.length > 0 && (
            <div className="grid grid-cols-1 gap-4 mb-4 rounded-2xl overflow-hidden">
              {post.media.map((url, i) => (
                <img key={i} src={url} alt="Post media" className="w-full object-cover max-h-96" />
              ))}
            </div>
          )}

          {/* Post Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-slate-50 dark:border-slate-800">
            <button 
              onClick={() => onLike(idx)}
              className="flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-colors"
            >
              <span className="text-xl">❤️</span>
              <span className="text-sm font-bold">{post.likes?.length || 0}</span>
            </button>
            <button 
              onClick={() => onComment(idx)}
              className="flex items-center gap-2 text-slate-500 hover:text-primary-500 transition-colors"
            >
              <span className="text-xl">💬</span>
              <span className="text-sm font-bold">{post.comments?.length || 0}</span>
            </button>
          </div>
        </motion.div>
      ))}

      {posts.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-400 font-medium">No discussions yet. Be the first to start a conversation!</p>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
