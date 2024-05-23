import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

interface User {
  id: string;
  fullName: string;
  // Define other user properties here
}

const getUsers = async (): Promise<User[]> => {
  const response = await fetch('http://localhost:5000/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

const getUserById = async (userId: string): Promise<User> => {
  const response = await fetch(`http://localhost:5000/api/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user ${userId}`);
  }
  return response.json();
};

function ManageUsers() {
  const { data: users, isLoading: isUsersLoading, isError: isUsersError } = useQuery<User[]>('users', getUsers);

  // Define userId or fetch it from somewhere
  const userId = '093d0548-7c1c-4853-805c-40c86f4f6f8c'; // Example userId

  const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery<User>(
    ['user', userId], // userId should be defined
    () => getUserById(userId),
    {
      enabled: !!userId,
    }
  );

  if (isUsersLoading || isUserLoading) {
    return <div>Loading...</div>;
  }

  if (isUsersError || isUserError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <h1>Manage Users</h1>
      <div>
        <h2>Users</h2>
        {users && users.map((user) => (
          <div key={user.id}>{user.fullName}</div>
        ))}
      </div>
      {user && (
        <div>
          <h2>User Details</h2>
          <div>Full Name: {user.fullName}</div>
          {/* Render other user details */}
        </div>
      )}
      {/* Render forms and buttons for signup, login, update, password change, and delete */}
    </div>
  );
}

// Create a new instance of QueryClient
const queryClient = new QueryClient();

// Wrap your entire application with QueryClientProvider
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ManageUsers />
    </QueryClientProvider>
  );
}

export default App;
