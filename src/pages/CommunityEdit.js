import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CommunityEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${BASE_URL}/community/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFormData({
        title: response.data.data.title,
        content: response.data.data.content,
      });
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      showAlert('게시글을 불러오는데 실패했습니다.', 'error');
      navigate('/community');
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`${BASE_URL}/community/${id}/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      showAlert('게시글이 수정되었습니다.');
      navigate(`/community/${id}`);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      showAlert('게시글 수정에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">게시글 수정</h1>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
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
            className="w-full p-2 rounded bg-gray-700 text-white h-64"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500"
            onClick={() => navigate(`/community/${id}`)}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSubmit}
          >
            수정
          </button>
        </div>
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

export default CommunityEdit; 