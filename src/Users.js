import React from "react";

function Users() {
  return <div></div>;
}

export default Users;

const users = [];

export function user_join(id, username, room_id) {
  const user = { id, username, room_id };
  users.push(user);
}

export function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

export function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}
