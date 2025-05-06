import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${BASE_URL}/community/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPosts(response.data.data);
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      showAlert('게시글 목록을 불러오는데 실패했습니다.', 'error');
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleOpenDialog = () => {
    setFormData({
      title: '',
      content: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      title: '',
      content: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`${BASE_URL}/community/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      showAlert('게시글이 작성되었습니다.');
      handleCloseDialog();
      fetchPosts();
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      showAlert('게시글 저장에 실패했습니다.', 'error');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">커뮤니티</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleOpenDialog}
        >
          새 게시글 작성
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => navigate(`/community/${post.id}`)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
                <p className="text-gray-400 text-sm">
                  작성자: {post.user_id.username} | 
                  작성일: {formatDate(post.created_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              새 게시글 작성
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="제목"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <textarea
                placeholder="내용"
                className="w-full p-2 rounded bg-gray-700 text-white h-32"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500"
                onClick={handleCloseDialog}
              >
                취소
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleSubmit}
              >
                작성
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Community; 