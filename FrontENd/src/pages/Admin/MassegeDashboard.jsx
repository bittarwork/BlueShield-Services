import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import AdminLayout from '../../layout/AdminLayout';
import MessageViewModal from '../../model/MessageViewModal';
import MessageReplyModal from '../../model/MessageReplyModal';
import MessageNoteModal from '../../model/MessageNoteModal';
import ConfirmDeleteModal from '../../model/ConfirmDeleteModal';
import MessagesStatistics from '../../components/Admin/MessagesStatistics';

const MassegeDashboard = () => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();

  const [messages, setMessages] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleMarkAsRead = async (messageId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/message/${messageId}/mark-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // تحديث الرسائل بعد التعيين
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
      alert('❌ Failed to mark message as read.');
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/message`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <AdminLayout>
      <div
        className={`p-6 min-h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          📨 Messages Management
        </h2>

        {loading ? (
          <p className="text-center text-sm">Loading messages...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-md shadow-md">
              <MessagesStatistics />
              <table
                className={`min-w-full text-sm text-left ${
                  isDarkMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}>
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.slice(0, visibleCount).map((msg, index) => (
                    <tr
                      key={msg._id}
                      className={`${
                        index % 2 === 0
                          ? ''
                          : isDarkMode
                            ? 'bg-gray-900'
                            : 'bg-gray-100'
                      }`}
                    >
                      <td className="p-3 font-medium">{msg.name}</td>
                      <td className="p-3 max-w-xs truncate">{msg.email}</td>
                      <td className="p-3 max-w-xs truncate">{msg.subject}</td>
                      <td className="p-3 space-x-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            msg.isRead
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {msg.isRead ? 'Read' : 'Unread'}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            msg.isReplied
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {msg.isReplied ? 'Replied' : 'No Reply'}
                        </span>
                      </td>
                      <td className="p-3 text-xs">
                        {moment(msg.createdAt).format('YYYY-MM-DD HH:mm')}
                      </td>
                      <td className="p-3 space-y-1 flex flex-col">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs"
                          onClick={() => {
                            setSelectedMessage(msg);
                            setIsViewModalOpen(true);
                          }}
                        >
                          View
                        </button>

                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-xs"
                          onClick={() => {
                            setSelectedMessage(msg);
                            setIsReplyModalOpen(true);
                          }}
                        >
                          Reply
                        </button>

                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs"
                          onClick={() => {
                            setSelectedMessage(msg);
                            setIsNoteModalOpen(true);
                          }}
                        >
                          Add Note
                        </button>

                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs"
                          onClick={() => {
                            setSelectedMessage(msg);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition text-xs"
                          onClick={() => handleMarkAsRead(msg._id)}
                          disabled={msg.isRead} // إلغاء التفعيل إذا كانت مقروءة أصلاً
                        >
                          Mark as Read
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visibleCount < messages.length && (
              <div className="text-center mt-6">
                <button
                  onClick={handleLoadMore}
                  className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
        <MessageViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          message={selectedMessage}
          isDarkMode={isDarkMode}
        />
        <MessageReplyModal
          isOpen={isReplyModalOpen}
          onClose={() => setIsReplyModalOpen(false)}
          message={selectedMessage}
          isDarkMode={isDarkMode}
          token={token}
          onSuccess={() => {
            // Reload messages
            setLoading(true);
            axios
              .get(`${import.meta.env.VITE_API_URL}/api/message`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((res) => setMessages(res.data))
              .catch((err) => console.error(err))
              .finally(() => setLoading(false));
          }}
        />
        <MessageNoteModal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          message={selectedMessage}
          isDarkMode={isDarkMode}
          token={token}
          onSuccess={() => {
            setLoading(true);
            axios
              .get(`${import.meta.env.VITE_API_URL}/api/message`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((res) => setMessages(res.data))
              .catch((err) => console.error(err))
              .finally(() => setLoading(false));
          }}
        />
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          item={selectedMessage}
          deleteUrl={`/api/message/${selectedMessage?._id}`} // <-- API مسار الحذف
          token={token}
          isDarkMode={isDarkMode}
          onSuccess={() => {
            setLoading(true);
            axios
              .get(`${import.meta.env.VITE_API_URL}/api/message`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((res) => setMessages(res.data))
              .catch((err) => console.error(err))
              .finally(() => setLoading(false));
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default MassegeDashboard;
