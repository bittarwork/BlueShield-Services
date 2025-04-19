import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// إنشاء السياق
const UserContext = createContext();

// المدة المسموحة للجلسة (5 ساعات بالملي ثانية)
const SESSION_DURATION_MS = 5 * 60 * 60 * 1000;

// المزود الخاص بالسياق
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // التحقق من صلاحية الجلسة عند التحميل
  useEffect(() => {
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (loginTimestamp && isAuthenticated) {
      const now = Date.now();
      const sessionTime = now - parseInt(loginTimestamp, 10);
      if (sessionTime > SESSION_DURATION_MS) {
        logout(); // جلسة منتهية
      }
    }
  }, []);

  // تسجيل الدخول
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loginTimestamp', Date.now().toString());

      setToken(token);
      setUser(userData);
      setIsAuthenticated(true);

      // توجيه حسب الدور
      switch (userData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'technician':
          navigate('/tech');
          break;
        default:
          navigate('/dashboard');
          break;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل مستخدم جديد
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/users/register`,
        userData
      );
      const { token, user: newUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loginTimestamp', Date.now().toString());

      setToken(token);
      setUser(newUser);
      setIsAuthenticated(true);

      navigate('/Login');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = () => {
    setLoading(true);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTimestamp');

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    navigate('/');
    setLoading(false);
  };

  // تعديل الملف الشخصي
  const updateProfile = async (updatedData) => {
    if (!user) throw new Error('User is not authenticated');
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/users/profile/${user._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // تغيير كلمة المرور
  const changePassword = async (oldPassword, newPassword) => {
    if (!user) throw new Error('User is not authenticated');
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/users/change-password/${user._id}`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return 'Password changed successfully';
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل مشرف (admin)
  const registerAdmin = async (adminData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/users/register-admin`,
        adminData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Register admin error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // حذف مستخدم (admin فقط)
  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return 'User deleted successfully';
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // القيم المتاحة داخل السياق
  const value = {
    user,
    isAuthenticated,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    registerAdmin,
    deleteUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// هوك مخصص لاستخدام السياق
export const useUser = () => useContext(UserContext);
