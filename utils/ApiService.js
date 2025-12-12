import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormData from 'form-data'; // npm i form-data pour uploads multipart
// deja deployer
const API_BASE_URL = 'https://pickndropback.onrender.com/api';

// Crée une instance d'axios préconfigurée
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Intercepteur pour ajouter le token JWT à chaque requête ---
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Utilitaires de gestion du Token ---
const TOKEN_KEY = 'auth_session_token';
export const storeToken = async (token) => {
  try {
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      console.warn("Tentative de stocker un token null ou undefined.");
    }
  } catch (e) {
    console.error("Erreur lors du stockage du token", e);
  }
};
// --- Fonction utilitaire pour récupérer le token ---
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.error("Erreur lors de la lecture du token", e);
    return null;
  }
};
export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error("Erreur lors de la suppression du token", e);
  }
};
// ==============================================
// Authentification
// ==============================================
export const registerFreelance = (userData) => {
  return apiClient.post('/auth/register/freelance', userData);
};
export const registerEmployee = (userData) => {
  return apiClient.post('/auth/register/employee', userData);
};
export const registerDeliverer = (userData) => {
  return apiClient.post('/auth/register/deliverer', userData);
};
export const registerClient = (userData) => {
  return apiClient.post('/auth/register/client', userData);
};
export const registerAgencyOwner = (userData) => {
  return apiClient.post('/auth/register/agency-owner', userData);
};
export const login = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};
export const createAdmin = (adminData) => {
  return apiClient.post('/auth/admin/create', adminData);
};
export const register = (userData) => {
  return apiClient.post('/auth/register', userData);
};
export const logout = () => {
  return apiClient.post('/auth/logout');
};
export const getProfile = () => {
  return apiClient.get('/auth/profile');
};
export const updateProfile = (updates) => {
  return apiClient.put('/auth/profile', updates);
};
export const requestPasswordReset = (email, redirectTo) => {
  return apiClient.post('/auth/request-password-reset', { email, redirectTo });
};
export const refreshAuth = (refreshToken) => {
  return apiClient.post('/auth/refresh', { refresh_token: refreshToken });
};
export const updatePassword = (access_token, new_password) => {
  return apiClient.post('/auth/update-password', { access_token, new_password });
};
export const generateAutoLoginToken = () => {
  return apiClient.post('/auth/generate-auto-login-token');
};
export const exchangeToken = (customToken) => {
  return apiClient.post('/auth/exchange-token', { custom_token: customToken });
};
export const signInWithCustomToken = (customToken) => {
  return apiClient.post('/auth/sign-in-with-token', { custom_token: customToken });
};
export const adminLogin = (email, password) => {
  return apiClient.post('/auth/admin-login', { email, password });
};
// ==============================================
// Gestion Photos
// ==============================================
export const uploadUserNiuDocument = (imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg', // Ajuste selon type
    name: 'niu-document.jpg',
  });
  return apiClient.post('/photos/user/niu-document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const uploadUserIdentity = (imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg', // Ajuste selon type
    name: 'identity.jpg',
  });
  return apiClient.post('/photos/user/identity', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const uploadRelayPointPhoto = (relayPointId, imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg', // Ajuste selon type
    name: 'relay-point.jpg',
  });
  return apiClient.post(`/photos/relay-point/${relayPointId}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const uploadBusinessActorPhoto = (imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg', // Ajuste selon type
    name: 'business-actor.jpg',
  });
  return apiClient.post('/photos/business-actor/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const uploadBusinessActorCniVerso = (imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg', // Ajuste selon type
    name: 'cni-verso.jpg',
  });
  return apiClient.post('/photos/business-actor/cni-verso', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const uploadBusinessActorCniRecto = (imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg', // Ajuste selon type
    name: 'cni-recto.jpg',
  });
  return apiClient.post('/photos/business-actor/cni-recto', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const uploadAgencyPhoto = (agencyId, imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg', // Ajuste selon type
    name: 'agency.jpg',
  });
  return apiClient.post(`/photos/agency/${agencyId}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
// Uploads pour Profile (avatars)
export const uploadAvatar = (userId, imageUri) => { // Convertit URI en Blob si besoin (expo)
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg', // Ajuste selon type
    name: 'avatar.jpg',
  });
  return apiClient.post(`/auth/upload-avatar/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteAvatar = (userId) => {
  return apiClient.delete(`/auth/delete-avatar/${userId}`);
};
// ==============================================
// Gestion Fichiers
// ==============================================
export const uploadFile = (category, fileUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    type: 'application/octet-stream', // Ajuste selon type de fichier
    name: `file-${Date.now()}`,
  });
  return apiClient.post(`/files/upload/${category}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const downloadFile = (category, fileName) => {
  return apiClient.get(`/files/${category}/${fileName}`, { responseType: 'blob' });
};
export const deleteFile = (fileData) => {
  return apiClient.delete('/files/delete', { data: fileData });
};
// ==============================================
// Gestion Agences
// ==============================================
export const updateAgency = (agencyId, agencyData) => {
  return apiClient.put(`/agencies/management/${agencyId}`, agencyData);
};
export const addEmployeeToAgency = (agencyId, employeeId) => {
  return apiClient.post(`/agencies/management/${agencyId}/employees/${employeeId}`);
};
export const createAgency = (agencyData) => {
  return apiClient.post('/agencies/management/create', agencyData);
};
// Création Agences
// Création complète avec photos
export const createAgencyComplete = (formData) => {
  return apiClient.post('/agencies/create-complete', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
// ==============================================
// Création BusinessActor
// Création complète avec photos
// ==============================================
export const createBusinessActorComplete = (formData) => {
  return apiClient.post('/business-actors/create-complete', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
// ==============================================
// Gestion Points Relais
// ==============================================
export const updateRelayPoint = (relayPointId, relayPointData) => {
  return apiClient.put(`/relay-points/management/${relayPointId}`, relayPointData);
};
export const createRelayPoint = (relayPointData) => {
  return apiClient.post('/relay-points/management/create', relayPointData);
};
// Création Points Relais
// Création complète avec photos
// (Utiliser createRelayPoint avec formData si photos incluses)
export const createRelayPointComplete = (formData) => {
  return apiClient.post('/relay-points/management/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
// ==============================================
// Vehicle Types
// ==============================================
export const getVehicleTypes = () => {
  return apiClient.get('/vehicle-types');
};
export const createVehicleType = (data) => {
  return apiClient.post('/vehicle-types', data);
};
export const getVehicleType = (id) => {
  return apiClient.get(`/vehicle-types/${id}`);
};
export const updateVehicleType = (id, data) => {
  return apiClient.put(`/vehicle-types/${id}`, data);
};
export const deleteVehicleType = (id) => {
  return apiClient.delete(`/vehicle-types/${id}`);
};
// ==============================================
// Vehicle History
// ==============================================
export const getVehicleHistorys = () => {
  return apiClient.get('/vehicle-historys');
};
export const createVehicleHistory = (data) => {
  return apiClient.post('/vehicle-historys', data);
};
export const getVehicleHistory = (id) => {
  return apiClient.get(`/vehicle-historys/${id}`);
};
export const updateVehicleHistory = (id, data) => {
  return apiClient.put(`/vehicle-historys/${id}`, data);
};
export const deleteVehicleHistory = (id) => {
  return apiClient.delete(`/vehicle-historys/${id}`);
};
// ==============================================
// Users
// ==============================================
export const getUsers = () => {
  return apiClient.get('/users');
};
export const createUser = (data) => {
  return apiClient.post('/users', data);
};
export const getUser = (id) => {
  return apiClient.get(`/users/${id}`);
};
export const updateUser = (id, data) => {
  return apiClient.put(`/users/${id}`, data);
};
export const deleteUser = (id) => {
  return apiClient.delete(`/users/${id}`);
};
// ==============================================
// User History
// ==============================================
export const getUserHistorys = () => {
  return apiClient.get('/user-historys');
};
export const createUserHistory = (data) => {
  return apiClient.post('/user-historys', data);
};
export const getUserHistory = (id) => {
  return apiClient.get(`/user-historys/${id}`);
};
export const updateUserHistory = (id, data) => {
  return apiClient.put(`/user-historys/${id}`, data);
};
export const deleteUserHistory = (id) => {
  return apiClient.delete(`/user-historys/${id}`);
};
// ==============================================
// Storage Capacity
// ==============================================
export const getStorageCapacitys = () => {
  return apiClient.get('/storage-capacitys');
};
export const createStorageCapacity = (data) => {
  return apiClient.post('/storage-capacitys', data);
};
export const getStorageCapacity = (id) => {
  return apiClient.get(`/storage-capacitys/${id}`);
};
export const updateStorageCapacity = (id, data) => {
  return apiClient.put(`/storage-capacitys/${id}`, data);
};
export const deleteStorageCapacity = (id) => {
  return apiClient.delete(`/storage-capacitys/${id}`);
};
// ==============================================
// Shipment Status
// ==============================================
export const getShipmentStatuss = () => {
  return apiClient.get('/shipment-statuss');
};
export const createShipmentStatus = (data) => {
  return apiClient.post('/shipment-statuss', data);
};
export const getShipmentStatus = (id) => {
  return apiClient.get(`/shipment-statuss/${id}`);
};
export const updateShipmentStatus = (id, data) => {
  return apiClient.put(`/shipment-statuss/${id}`, data);
};
export const deleteShipmentStatus = (id) => {
  return apiClient.delete(`/shipment-statuss/${id}`);
};
// ==============================================
// Relay Points
// ==============================================
export const getRelayPoints = () => {
  return apiClient.get('/relay-points');
};
export const createRelayPointEntity = (data) => {
  return apiClient.post('/relay-points', data);
};
export const getRelayPoint = (id) => {
  return apiClient.get(`/relay-points/${id}`);
};
export const updateRelayPointEntity = (id, data) => {
  return apiClient.put(`/relay-points/${id}`, data);
};
export const deleteRelayPoint = (id) => {
  return apiClient.delete(`/relay-points/${id}`);
};
// ==============================================
// Relay Point History
// ==============================================
export const getRelayPointHistorys = () => {
  return apiClient.get('/relay-point-historys');
};
export const createRelayPointHistory = (data) => {
  return apiClient.post('/relay-point-historys', data);
};
export const getRelayPointHistory = (id) => {
  return apiClient.get(`/relay-point-historys/${id}`);
};
export const updateRelayPointHistory = (id, data) => {
  return apiClient.put(`/relay-point-historys/${id}`, data);
};
export const deleteRelayPointHistory = (id) => {
  return apiClient.delete(`/relay-point-historys/${id}`);
};
// ==============================================
// QoS
// ==============================================
export const getQoSs = () => {
  return apiClient.get('/qo-ss');
};
export const createQoS = (data) => {
  return apiClient.post('/qo-ss', data);
};
export const getQoS = (id) => {
  return apiClient.get(`/qo-ss/${id}`);
};
export const updateQoS = (id, data) => {
  return apiClient.put(`/qo-ss/${id}`, data);
};
export const deleteQoS = (id) => {
  return apiClient.delete(`/qo-ss/${id}`);
};
// ==============================================
// Payment Modes
// ==============================================
export const getPaymentModes = () => {
  return apiClient.get('/payment-modes');
};
export const createPaymentMode = (data) => {
  return apiClient.post('/payment-modes', data);
};
export const getPaymentMode = (id) => {
  return apiClient.get(`/payment-modes/${id}`);
};
export const updatePaymentMode = (id, data) => {
  return apiClient.put(`/payment-modes/${id}`, data);
};
export const deletePaymentMode = (id) => {
  return apiClient.delete(`/payment-modes/${id}`);
};
// ==============================================
// Package Types
// ==============================================
export const getPackageTypes = () => {
  return apiClient.get('/package-types');
};
export const createPackageType = (data) => {
  return apiClient.post('/package-types', data);
};
export const getPackageType = (id) => {
  return apiClient.get(`/package-types/${id}`);
};
export const updatePackageType = (id, data) => {
  return apiClient.put(`/package-types/${id}`, data);
};
export const deletePackageType = (id) => {
  return apiClient.delete(`/package-types/${id}`);
};
// ==============================================
// Package Status
// ==============================================
export const getPackageStatuss = () => {
  return apiClient.get('/package-statuss');
};
export const createPackageStatus = (data) => {
  return apiClient.post('/package-statuss', data);
};
export const getPackageStatus = (id) => {
  return apiClient.get(`/package-statuss/${id}`);
};
export const updatePackageStatus = (id, data) => {
  return apiClient.put(`/package-statuss/${id}`, data);
};
export const deletePackageStatus = (id) => {
  return apiClient.delete(`/package-statuss/${id}`);
};
// ==============================================
// Notification Types
// ==============================================
export const getNotificationTypes = () => {
  return apiClient.get('/notification-types');
};
export const createNotificationType = (data) => {
  return apiClient.post('/notification-types', data);
};
export const getNotificationType = (id) => {
  return apiClient.get(`/notification-types/${id}`);
};
export const updateNotificationType = (id, data) => {
  return apiClient.put(`/notification-types/${id}`, data);
};
export const deleteNotificationType = (id) => {
  return apiClient.delete(`/notification-types/${id}`);
};
// ==============================================
// Notification Status
// ==============================================
export const getNotificationStatuss = () => {
  return apiClient.get('/notification-statuss');
};
export const createNotificationStatus = (data) => {
  return apiClient.post('/notification-statuss', data);
};
export const getNotificationStatus = (id) => {
  return apiClient.get(`/notification-statuss/${id}`);
};
export const updateNotificationStatus = (id, data) => {
  return apiClient.put(`/notification-statuss/${id}`, data);
};
export const deleteNotificationStatus = (id) => {
  return apiClient.delete(`/notification-statuss/${id}`);
};
// ==============================================
// Freelances
// ==============================================
export const getFreelances = () => {
  return apiClient.get('/freelances');
};
export const createFreelance = (data) => {
  return apiClient.post('/freelances', data);
};
export const getFreelance = (id) => {
  return apiClient.get(`/freelances/${id}`);
};
export const updateFreelance = (id, data) => {
  return apiClient.put(`/freelances/${id}`, data);
};
export const deleteFreelance = (id) => {
  return apiClient.delete(`/freelances/${id}`);
};
// ==============================================
// Event Types
// ==============================================
export const getEventTypes = () => {
  return apiClient.get('/event-types');
};
export const createEventType = (data) => {
  return apiClient.post('/event-types', data);
};
export const getEventType = (id) => {
  return apiClient.get(`/event-types/${id}`);
};
export const updateEventType = (id, data) => {
  return apiClient.put(`/event-types/${id}`, data);
};
export const deleteEventType = (id) => {
  return apiClient.delete(`/event-types/${id}`);
};
// ==============================================
// Event Logs
// ==============================================
export const getEventLogs = () => {
  return apiClient.get('/event-logs');
};
export const createEventLog = (data) => {
  return apiClient.post('/event-logs', data);
};
export const getEventLog = (id) => {
  return apiClient.get(`/event-logs/${id}`);
};
export const updateEventLog = (id, data) => {
  return apiClient.put(`/event-logs/${id}`, data);
};
export const deleteEventLog = (id) => {
  return apiClient.delete(`/event-logs/${id}`);
};
// ==============================================
// Event Levels
// ==============================================
export const getEventLevels = () => {
  return apiClient.get('/event-levels');
};
export const createEventLevel = (data) => {
  return apiClient.post('/event-levels', data);
};
export const getEventLevel = (id) => {
  return apiClient.get(`/event-levels/${id}`);
};
export const updateEventLevel = (id, data) => {
  return apiClient.put(`/event-levels/${id}`, data);
};
export const deleteEventLevel = (id) => {
  return apiClient.delete(`/event-levels/${id}`);
};
// ==============================================
// Event Categories
// ==============================================
export const getEventCategorys = () => {
  return apiClient.get('/event-categorys');
};
export const createEventCategory = (data) => {
  return apiClient.post('/event-categorys', data);
};
export const getEventCategory = (id) => {
  return apiClient.get(`/event-categorys/${id}`);
};
export const updateEventCategory = (id, data) => {
  return apiClient.put(`/event-categorys/${id}`, data);
};
export const deleteEventCategory = (id) => {
  return apiClient.delete(`/event-categorys/${id}`);
};
// ==============================================
// Employees
// ==============================================
export const getEmployees = () => {
  return apiClient.get('/employees');
};
export const createEmployee = (data) => {
  return apiClient.post('/employees', data);
};
export const getEmployee = (id) => {
  return apiClient.get(`/employees/${id}`);
};
export const updateEmployee = (id, data) => {
  return apiClient.put(`/employees/${id}`, data);
};
export const deleteEmployee = (id) => {
  return apiClient.delete(`/employees/${id}`);
};
// ==============================================
// Delivery Status
// ==============================================
export const getDeliveryStatuss = () => {
  return apiClient.get('/delivery-statuss');
};
export const createDeliveryStatus = (data) => {
  return apiClient.post('/delivery-statuss', data);
};
export const getDeliveryStatus = (id) => {
  return apiClient.get(`/delivery-statuss/${id}`);
};
export const updateDeliveryStatus = (id, data) => {
  return apiClient.put(`/delivery-statuss/${id}`, data);
};
export const deleteDeliveryStatus = (id) => {
  return apiClient.delete(`/delivery-statuss/${id}`);
};
// ==============================================
// Delivery Options
// ==============================================
export const getDeliveryOptions = () => {
  return apiClient.get('/delivery-options');
};
export const createDeliveryOption = (data) => {
  return apiClient.post('/delivery-options', data);
};
export const getDeliveryOption = (id) => {
  return apiClient.get(`/delivery-options/${id}`);
};
export const updateDeliveryOption = (id, data) => {
  return apiClient.put(`/delivery-options/${id}`, data);
};
export const deleteDeliveryOption = (id) => {
  return apiClient.delete(`/delivery-options/${id}`);
};
// ==============================================
// Deliverers
// ==============================================
export const getDeliverers = () => {
  return apiClient.get('/deliverers');
};
export const createDeliverer = (data) => {
  return apiClient.post('/deliverers', data);
};
export const getDeliverer = (id) => {
  return apiClient.get(`/deliverers/${id}`);
};
export const updateDeliverer = (id, data) => {
  return apiClient.put(`/deliverers/${id}`, data);
};
export const deleteDeliverer = (id) => {
  return apiClient.delete(`/deliverers/${id}`);
};
// ==============================================
// Deliverer History
// ==============================================
export const getDelivererHistorys = () => {
  return apiClient.get('/deliverer-historys');
};
export const createDelivererHistory = (data) => {
  return apiClient.post('/deliverer-historys', data);
};
export const getDelivererHistory = (id) => {
  return apiClient.get(`/deliverer-historys/${id}`);
};
export const updateDelivererHistory = (id, data) => {
  return apiClient.put(`/deliverer-historys/${id}`, data);
};
export const deleteDelivererHistory = (id) => {
  return apiClient.delete(`/deliverer-historys/${id}`);
};
// ==============================================
// Clients
// ==============================================
export const getClients = () => {
  return apiClient.get('/clients');
};
export const createClient = (data) => {
  return apiClient.post('/clients', data);
};
export const getClient = (id) => {
  return apiClient.get(`/clients/${id}`);
};
export const updateClient = (id, data) => {
  return apiClient.put(`/clients/${id}`, data);
};
export const deleteClient = (id) => {
  return apiClient.delete(`/clients/${id}`);
};
// ==============================================
// Business Actors
// ==============================================
export const getBusinessActors = () => {
  return apiClient.get('/business-actors');
};
export const createBusinessActor = (data) => {
  return apiClient.post('/business-actors', data);
};
export const getBusinessActor = (id) => {
  return apiClient.get(`/business-actors/${id}`);
};
export const updateBusinessActor = (id, data) => {
  return apiClient.put(`/business-actors/${id}`, data);
};
export const deleteBusinessActor = (id) => {
  return apiClient.delete(`/business-actors/${id}`);
};
// ==============================================
// Agencies
// ==============================================
export const getAgencys = () => {
  return apiClient.get('/agencys');
};
export const createAgencyEntity = (data) => {
  return apiClient.post('/agencys', data);
};
export const getAgency = (id) => {
  return apiClient.get(`/agencys/${id}`);
};
export const updateAgencyEntity = (id, data) => {
  return apiClient.put(`/agencys/${id}`, data);
};
export const deleteAgency = (id) => {
  return apiClient.delete(`/agencys/${id}`);
};
// ==============================================
// Agency Owners
// ==============================================
export const getAgencyOwners = () => {
  return apiClient.get('/agency-owners');
};
export const createAgencyOwner = (data) => {
  return apiClient.post('/agency-owners', data);
};
export const getAgencyOwner = (id) => {
  return apiClient.get(`/agency-owners/${id}`);
};
export const updateAgencyOwner = (id, data) => {
  return apiClient.put(`/agency-owners/${id}`, data);
};
export const deleteAgencyOwner = (id) => {
  return apiClient.delete(`/agency-owners/${id}`);
};
// ==============================================
// Actor Types
// ==============================================
export const getActorTypes = () => {
  return apiClient.get('/actor-types');
};
export const createActorType = (data) => {
  return apiClient.post('/actor-types', data);
};
export const getActorType = (id) => {
  return apiClient.get(`/actor-types/${id}`);
};
export const updateActorType = (id, data) => {
  return apiClient.put(`/actor-types/${id}`, data);
};
export const deleteActorType = (id) => {
  return apiClient.delete(`/actor-types/${id}`);
};
// ==============================================
// Profile & User (Adresses, Préférences)
// ==============================================
export const getAddresses = () => {
  return apiClient.get('/addresses');
};
export const getAddress = (id) => {
  return apiClient.get(`/addresses/${id}`);
};
export const createAddress = (addressData) => {
  return apiClient.post('/addresses', addressData);
};
export const updateAddress = (id, addressData) => {
  return apiClient.put(`/addresses/${id}`, addressData);
};
export const deleteAddress = (id) => {
  return apiClient.delete(`/addresses/${id}`);
};
export const setDefaultAddress = (id) => {
  return apiClient.put(`/addresses/${id}/set-default`);
};
export const getUserPreferences = () => {
  return apiClient.get('/user-preferences');
};
export const updateUserPreferences = (prefsData) => {
  return apiClient.put('/user-preferences', prefsData);
};
// ==============================================
// Home Controller
// ==============================================
export const healthCheck = () => {
  return apiClient.get('/health');
};
export const getRoot = () => {
  return apiClient.get('/');
};
export default apiClient;