import React from "react";
import { useQuery } from "react-query";
import { User } from "../../utils/types/types";
import { getUserById, getUsers } from "../../utils/api/usersApi";

export default function ManageUsers() {
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useQuery<User[]>("users", getUsers);

  // Define userId or fetch it from somewhere
  const userId = "85bdabba-2e51-4406-a1e6-70f142b27d15"; // Example userId

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery<User>(
    ["user", userId], // userId should be defined
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
        {users && users.map((user) => <div key={user.id}>{user.fullName}</div>)}
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
