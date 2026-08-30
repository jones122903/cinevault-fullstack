import requests from "./httpServices";
export const LoginUser = async (data) => {
  return await requests.post(`api/auth/login`, data);
};
export const RegisterUser = async (data) => {
  return await requests.post(`api/auth/register`, data);
};

// ================== producers  page start ================
export const GetProducers = async (data) => {
  return await requests.post(`api/producers/get-all`, data);
};

export const CreateProducer = async (data) => {
  return await requests.post(`api/producers`, data);
};

export const UpdateProducer = async (id, data) => {
  return await requests.put(`api/producers/${id}`, data);
};

export const DeleteProducer = async (id) => {
  return await requests.delete(`api/producers/${id}`);
};
// ================== User page start================
export const GetActor = async (data) => {
  return await requests.post(`api/actors/get-all`, data);
};
export const CreateActor = async (data) => {
  return await requests.post(`api/actors`, data);
};
export const UpdateActor = async (id, data) => {
  return await requests.put(`api/actors/${id}`, data);
};
export const DeleteActor = async (id) => {
  return await requests.delete(`api/actors/${id}`);
};

// ================ Movie =====================
export const GetMovie = async (data) => {
  return await requests.post(`api/movies/get-all`, data);
};
export const CreateMovie = async (formData) => {
  return await requests.post("api/movies/", formData);
};

export const DeleteMovie = async (id) => {
  return await requests.delete(`api/movies/${id}`);
};
export const UpdateMovie = async (id, formData) => {
  return await requests.put(`api/movies/${id}`, formData);
};
