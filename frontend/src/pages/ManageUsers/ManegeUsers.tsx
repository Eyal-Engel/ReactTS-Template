import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { User } from "../../utils/types/types";
import { createUser, getUserById, getUsers } from "../../utils/api/usersApi";
import { Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { AxiosError } from "axios";
export default function ManageUsers() {
  const queryClient = useQueryClient();
  const usersQuery = useQuery<User[]>(["users"], getUsers);

  // Define userId or fetch it from somewhere
  const userId = "85bdabba-2e51-4406-a1e6-70f142b27d15"; // Example userId

  const userByIdQuery = useQuery<User>(
    ["user", userId], // userId should be defined
    () => getUserById(userId),
    {
      enabled: !!userId,
    }
  );

  const newUser: User = {
    fullName: "guy",
    privateNumber: "2222222",
    password: "123",
    commandId: "38dd4929-d496-4df7-824d-3fa01a640ca3",
    editPerm: true,
    managePerm: true,
  };
  const newUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => queryClient.invalidateQueries(["users"]),
    onError: (error: AxiosError, variables: User) => {
      console.log(
        "an error occurred: " +
          error.message +
          " with user: " +
          variables.fullName
      );
    },
  });

  if (usersQuery.isLoading || userByIdQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (usersQuery.isError || userByIdQuery.isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <h1>Manage Users</h1>
      <LoadingButton
        variant="contained"
        color="primary"
        loading={newUserMutation.isLoading}
        onClick={() => newUserMutation.mutate(newUser)}
      >
        create user
      </LoadingButton>
      <div>
        <h2>Users</h2>
        {usersQuery.data &&
          usersQuery.data.map((user) => (
            <div key={user.id}>{user.fullName}</div>
          ))}
      </div>
      {userByIdQuery.data && (
        <div>
          <h2>User Details</h2>
          <div>Full Name: {userByIdQuery.data.fullName}</div>
          {/* Render other user details */}
        </div>
      )}

      {/* Render forms and buttons for signup, login, update, password change, and delete */}
    </div>
  );
}
