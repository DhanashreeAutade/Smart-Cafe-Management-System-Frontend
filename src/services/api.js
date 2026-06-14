export const API = "http://localhost:6100";

const buildHeaders = (isForm = false) => {
  const token = localStorage.getItem("token");
  const headers = {};
  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const isProductArray = (arr) => {
  if (!Array.isArray(arr)) return false;
  return arr.some(item => item && typeof item === 'object' && (('name' in item || 'title' in item) && ('price' in item || 'cost' in item || 'amount' in item)));
};

const isCategoryArray = (arr) => {
  if (!Array.isArray(arr)) return false;
  if (arr.every(item => typeof item === 'string')) return true;
  return arr.some(item => item && typeof item === 'object' && ('name' in item || 'category' in item || '_id' in item || 'id' in item));
};

const findArrayInObject = (obj, predicate, seen = new Set()) => {
  if (!obj || typeof obj !== 'object') return null;
  if (seen.has(obj)) return null;
  seen.add(obj);

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (Array.isArray(value) && (!predicate || predicate(value))) return value;
    if (value && typeof value === 'object') {
      const nested = findArrayInObject(value, predicate, seen);
      if (Array.isArray(nested)) return nested;
    }
  }

  return null;
};

export const normalizeApiList = (payload, preferredKeys = ['products', 'items', 'categories', 'docs', 'data'], predicate) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return predicate ? (predicate(payload) ? payload : []) : payload;
  if (typeof payload !== 'object') return [];

  for (const key of preferredKeys) {
    const value = payload[key];
    if (Array.isArray(value) && (!predicate || predicate(value))) return value;
  }

  if (payload.data && typeof payload.data === 'object') {
    for (const key of preferredKeys) {
      const value = payload.data[key];
      if (Array.isArray(value) && (!predicate || predicate(value))) return value;
    }
  }

  const found = findArrayInObject(payload, predicate);
  return Array.isArray(found) ? found : [];
};

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
  const res = await fetch(`${API}/users/getusers`, {
    headers: buildHeaders()
  });

  const data = await res.json();
  return data;
};

export const deleteUserApi = async (id) => {
  const res = await fetch(`${API}/users/deleteuser?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: buildHeaders()
  });

  return res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${API}/categories/getcategories`, {
    headers: buildHeaders()
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Failed to fetch categories');
  }

  return normalizeApiList(data, ['categories', 'items', 'data', 'docs', 'products', 'category'], isCategoryArray);
};

export const createCategory = async (category) => {
  const res = await fetch(`${API}/categories/createcategory`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(category)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Failed to create category');
  }
  return data;
};

export const updateCategory = async (id, category) => {
  const res = await fetch(`${API}/categories/updatecategory?id=${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(category)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Failed to update category');
  }
  return data;
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${API}/categories/deletecategory?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: buildHeaders()
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Failed to delete category');
  }
  return data;
};

export const createProduct = async (product) => {
  const formData = new FormData();

  formData.append("name", product.name);
  formData.append("price", product.price);
  formData.append("description", product.description);
  formData.append("category", product.category);

  if (product.emoji) formData.append("emoji", product.emoji);
  if (product.tags) formData.append("tags", product.tags);
  if (product.imageFile) {
    formData.append("image", product.imageFile);
  }

  const res = await fetch(`${API}/products/createproduct`, {
    method: "POST",
    headers: buildHeaders(true),
    body: formData
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Failed to create product');
  }
  return data;
};

export const deleteProduct = async (name) => {
  const res = await fetch(`${API}/products/deleteproduct?name=${encodeURIComponent(name)}`, {
    method: 'DELETE',
    headers: buildHeaders()
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Failed to delete product');
  }
  return data;
};

export async function getProducts() {
  const res = await fetch(`${API}/products/getproducts`, {
    method: 'GET',
    headers: buildHeaders()
  });
  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.message || payload.error || 'Failed to fetch products');
  }

  return normalizeApiList(payload, ['products', 'items', 'data', 'docs', 'categories', 'product'], isProductArray);
}