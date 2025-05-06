import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CommunityDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${BASE_URL}/community/${postId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPost(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      showAlert('게시글을 불러오는데 실패했습니다.', 'error');
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`${BASE_URL}/community/${postId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        showAlert('게시글이 삭제되었습니다.');
        navigate('/community');
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        showAlert('게시글 삭제에 실패했습니다.', 'error');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center text-white">로딩 중...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center text-white">게시글을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-white">{post.title}</h1>
          <div className="flex space-x-2">
            <button
              className="text-blue-400 hover:text-blue-300"
              onClick={() => navigate(`/community/edit/${postId}`)}
            >
              수정
            </button>
            <button
              className="text-red-400 hover:text-red-300"
              onClick={handleDelete}
            >
              삭제
            </button>
          </div>
        </div>
        
        <div className="text-gray-400 text-sm mb-4">
          작성자: {post.user_id.username} | 
          작성일: {formatDate(post.created_at)}
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>

      <div className="mt-4">
        <button
          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => navigate('/community')}
        >
          목록으로 돌아가기
        </button>
      </div>

      {alert.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded ${
          alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default CommunityDetail; 