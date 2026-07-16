import api from '../axios';

// ===== SUBMIT CONTACT =====
export const submitContact = async (formData) => {
  const response = await api.post('/api/contact/create', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// ===== GET ALL CONTACTS =====
export const getAllContacts = async (
  page = 1,
  limit = 10,
  isSearch = false,
  searchQuery = ""
) => {
  let url = `/api/contact/get-all?page=${page}&limit=${limit}`;

  if (isSearch && searchQuery) {
    url += `&isSearch=true&query=${encodeURIComponent(searchQuery)}`;
  }

  const response = await api.get(url);
  return response.data;
};

// ===== GET CONTACT BY ID =====
export const getContactById = async (id) => {
  const response = await api.get(`/api/contact/get/${id}`);
  return response.data;
};

// ===== DELETE CONTACT =====
export const deleteContact = async (id) => {
  const response = await api.delete(`/api/contact/delete/${id}`);
  return response.data;
};

// ===== MARK CONTACT AS READ =====
export const markContactAsRead = async (id) => {
  const response = await api.patch(`/api/contact/updatebyid/mark-read/${id}`);
  return response.data;
};