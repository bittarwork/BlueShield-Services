import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FaUsers,
  FaUserShield,
  FaUserCheck,
  FaMapMarkerAlt,
  FaCreditCard,
  FaHeart,
  FaSmile,
  FaFrown,
} from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

// تسجيل مكونات Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const UserNumaricStatistic = () => {
  const { isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب البيانات من الـ API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/statistics`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // إضافة التوكن للتحقق من الصلاحية
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        setStatistics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // تصميم البطاقة مع أيقونة
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div
      className={`p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-2xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  // بيانات المخطط الدائري (Pie Chart) لتوزيع المستخدمين حسب الدور
  const rolesChartData = {
    labels: statistics?.usersByRole?.map((role) => role._id) || [],
    datasets: [
      {
        label: 'Users by Role',
        data: statistics?.usersByRole?.map((role) => role.count) || [],
        backgroundColor: ['#3b82f6', '#a855f7', '#10b981'], // ألوان الأدوار
        borderColor: isDarkMode ? '#1e293b' : '#f3f4f6', // لون الحدود
        borderWidth: 1,
      },
    ],
  };

  // بيانات المخطط الشريطي (Bar Chart) لتوزيع المستخدمين حسب الفئة العمرية
  const ageChartData = {
    labels: statistics?.usersByAgeGroup?.map((age) => `Age ${age._id}+`) || [],
    datasets: [
      {
        label: 'Users by Age Group',
        data: statistics?.usersByAgeGroup?.map((age) => age.count) || [],
        backgroundColor: '#3b82f6', // لون الأشرطة
        borderColor: isDarkMode ? '#1e293b' : '#f3f4f6', // لون الحدود
        borderWidth: 1,
      },
    ],
  };

  // بيانات المخطط الدائري (Pie Chart) للحالة الاجتماعية
  const maritalStatusChartData = {
    labels: statistics?.usersByMaritalStatus?.map((status) => status._id) || [],
    datasets: [
      {
        label: 'Users by Marital Status',
        data:
          statistics?.usersByMaritalStatus?.map((status) => status.count) || [],
        backgroundColor: ['#3b82f6', '#a855f7', '#10b981'], // ألوان الحالات الاجتماعية
        borderColor: isDarkMode ? '#1e293b' : '#f3f4f6', // لون الحدود
        borderWidth: 1,
      },
    ],
  };

  // بيانات المخطط الشريطي (Bar Chart) للمستخدمين الذين أضافوا مواقع أو طرق دفع
  const locationsAndPaymentsChartData = {
    labels: ['Users with Locations', 'Users with Payment Methods'],
    datasets: [
      {
        label: 'Count',
        data: [
          statistics?.usersWithLocations || 0,
          statistics?.usersWithPaymentMethods || 0,
        ],
        backgroundColor: ['#3b82f6', '#a855f7'], // ألوان الأشرطة
        borderColor: isDarkMode ? '#1e293b' : '#f3f4f6', // لون الحدود
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <h2 className="text-center text-2xl font-bold mb-6">User Statistics</h2>

      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={statistics?.totalUsers || 0}
          icon={FaUsers}
          color="bg-blue-100 text-blue-600"
        />
        {statistics?.usersByRole?.map((role) => (
          <StatCard
            key={role._id}
            title={`${role._id}s`}
            value={role.count}
            icon={role._id === 'admin' ? FaUserShield : FaUserCheck}
            color={
              role._id === 'admin'
                ? 'bg-purple-100 text-purple-600'
                : 'bg-green-100 text-green-600'
            }
          />
        ))}
        {statistics?.usersByMaritalStatus?.map((status) => (
          <StatCard
            key={status._id}
            title={`${status._id}`}
            value={status.count}
            icon={
              status._id === 'married'
                ? FaHeart
                : status._id === 'single'
                  ? FaSmile
                  : FaFrown
            }
            color={
              status._id === 'married'
                ? 'bg-pink-100 text-pink-600'
                : status._id === 'single'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-red-100 text-red-600'
            }
          />
        ))}
        <StatCard
          title="Users with Locations"
          value={statistics?.usersWithLocations || 0}
          icon={FaMapMarkerAlt}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title="Users with Payment Methods"
          value={statistics?.usersWithPaymentMethods || 0}
          icon={FaCreditCard}
          color="bg-teal-100 text-teal-600"
        />
      </div>

      {/* المخططات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="text-lg font-semibold mb-4">Users by Role</h3>
          <Pie data={rolesChartData} />
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="text-lg font-semibold mb-4">
            Users by Marital Status
          </h3>
          <Pie data={maritalStatusChartData} />
        </div>
        <div
          className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="text-lg font-semibold mb-4">Users by Age Group</h3>
          {statistics?.usersByAgeGroup?.length === 0 ? (
            <p className="text-center text-gray-500">
              لا توجد بيانات كافية لعرض التوزيع العمري.
            </p>
          ) : (
            <Bar data={ageChartData} />
          )}
        </div>
        <div
          className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="text-lg font-semibold mb-4">
            Users with Locations & Payment Methods
          </h3>
          <Bar data={locationsAndPaymentsChartData} />
        </div>
      </div>
    </div>
  );
};

export default UserNumaricStatistic;
