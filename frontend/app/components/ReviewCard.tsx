import React from 'react';
import { Star, ThumbsUp, Flag } from 'lucide-react';

interface ReviewCardProps {
  review: {
    _id: string;
    user: {
      _id: string;
      name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-800">{review.user.name}</h4>
          <div className="flex items-center">
            <div className="flex text-yellow-500 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4"
                  fill={i < review.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 my-3">{review.comment}</p>
      
      <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span className="text-sm">Helpful</span>
          </button>
        </div>
        <button className="flex items-center text-gray-500 hover:text-red-600 transition-colors">
          <Flag className="h-4 w-4 mr-1" />
          <span className="text-sm">Report</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;