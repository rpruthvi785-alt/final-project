import API from './axios';

export const login = (data) => API.post('/auth/login', data);
export const signup = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

export const getCategories = () => API.get('/categories');
export const createCategory = (data) => API.post('/categories', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export const getEvents = (params) => API.get('/events', { params });
export const getEvent = (id) => API.get(`/events/${id}`);
export const createEvent = (data) => API.post('/events', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateEvent = (id, data) => API.put(`/events/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteEvent = (id) => API.delete(`/events/${id}`);

export const bookEvent = (data) => API.post('/bookings', data);
export const getUserBookings = () => API.get('/bookings');
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);
export const addReview = (id, data) => API.post(`/events/${id}/review`, data);

// Social & Admin User Endpoints
export const getUsers = () => API.get('/users/all');
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const blockUser = (id) => API.put(`/users/${id}/block`);
export const toggleFollow = (userId) => API.post(`/users/${userId}/follow`);
export const getPosts = () => API.get('/posts');
export const createPost = (data) => API.post('/posts', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const toggleLikePost = (postId) => API.put(`/posts/${postId}/like`);
export const addCommentPost = (postId, data) => API.post(`/posts/${postId}/comment`, data);
