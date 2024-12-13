export const BASE_URL = "http://192.168.1.35:5000/api";

export const FORM_ENDPOINTS = {
  createForm: `${BASE_URL}/forms`,
  uploadImage: `${BASE_URL}/forms/upload`,
  getFormById: (formId: string) => `${BASE_URL}/forms/${formId}`,
  getAllForms: `${BASE_URL}/forms/all`,
  submitResponse: `${BASE_URL}/responses`,
  getResponsesByFormId: (formId: string) => `${BASE_URL}/responses/${formId}`,
};
