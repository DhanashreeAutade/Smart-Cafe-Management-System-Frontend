const API = "http://localhost:6100";

// LOGIN (user + admin)
export const loginUser = async (email, password) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return res.json();
};

//  REGISTER
export const registerUser = async (form) => {
  const res = await fetch(`http://localhost:6100/users/createuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
};

//getusers
export const getUsers = async () => {
  const res = await fetch('http://localhost:6100/users/getusers', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = await res.json();
  return data;
};

export const deleteUserApi = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:6100/users/deleteuser?id=${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return res.json();
};