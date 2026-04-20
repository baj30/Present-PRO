import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchUserData } from '../api/userAPI';
import UserCard from './UserCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const UserDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchUserData();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <ErrorMessage message="Please log in to view the dashboard" />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      <div className="user-grid">
        {users.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
