import { commonApi } from "./commonApi"
import { serverUrl } from "./serverUrl"

const getAuthHeader = () => {
    const token = localStorage.getItem('admin_token')
    return{
        "Authorization":`Bearer ${token}`
    }
}

// LOGIN  
export const loginAPI = async(reqBody: any) => {
    console.log("Inside Login API")
    return await commonApi('POST', `${serverUrl}/login`, reqBody, null)
}

// FETCH - COMPANY PLANS
export const plansAPI = async() => {
    console.log("Inside Fetch Company Plans API")
    return await commonApi('GET', `${serverUrl}/plans/company`, null, getAuthHeader())
}

// CREATE - COMPANY PLAN
export const createPlanAPI = async(reqBody: any) => {
    console.log("Inside Create Company Plan API")
    return await commonApi('POST', `${serverUrl}/plans/create`, reqBody, getAuthHeader())
}

// UPDATE - COMPANY PLAN
export const updatePlanAPI = async (reqBody: any, planId: string) => {
    console.log("Inside Update Company Plan API")
    return await commonApi('PUT', `${serverUrl}/plans/update/${planId}`, reqBody, getAuthHeader())
}

// DELETE - COMPANY PLAN
export const deletePlanAPI = async(planId: string) => {
    console.log("Inside Delete Company Plan API")
    return await commonApi("DELETE", `${serverUrl}/plans/delete/${planId}`, null, getAuthHeader())
}

export const addClientSubscriptionAPI = async (reqBody:any) => {
    console.log("Inside Add Client API")
    return await commonApi( "POST",`${serverUrl}/clients/add`, reqBody, getAuthHeader())
}


export const fetchClientsAPI = async () => {
    console.log("Inside Fetch Client API")
    return await commonApi( "GET", `${serverUrl}/clients/fetch`,{}, getAuthHeader())
}

// READ - SEARCHED ONE CLIENT
export const findClientAPI = async(searchTerm: string) => {
    console.log("Inside Search Client API")
    return await commonApi("GET", `${serverUrl}/client/find?detail=${searchTerm}`, {}, getAuthHeader())
}

export const markSubscriptionPaidAPI = async (subId: string) => {
  return await commonApi("PUT",`${serverUrl}/usersub/mark-paid/${subId}`,{},getAuthHeader())
}

export const pauseSubscriptionAPI = async (subId: string) => {
  return await commonApi("PUT",`${serverUrl}/usersub/pause/${subId}`,{},getAuthHeader())
}

export const resumeSubscriptionAPI = async (subId: string) => {
  return await commonApi("PUT",`${serverUrl}/usersub/resume/${subId}`,{}, getAuthHeader())
}

export const cancelSubscriptionAPI = async (subId: string) => {
  return await commonApi("PUT",`${serverUrl}/usersub/cancel/${subId}`, {},getAuthHeader())
}

export const getAllPaymentsAPI = async () => {
  return await commonApi("GET", `${serverUrl}/payments`,{}, getAuthHeader())
}

export const getDuePaymentsAPI = async () => {
  return await commonApi("GET",`${serverUrl}/payments/due`,{},getAuthHeader())
}

export const getPaidPaymentsAPI = async () => {
  return await commonApi("GET",`${serverUrl}/payments/paid`,{},getAuthHeader())
}

export const createStripeCheckoutAPI = (subId: string) => {
  return commonApi("POST",`${serverUrl}/stripe-checkout/${subId}`,{},getAuthHeader())
}

export const confirmOnlinePaymentAPI = (subId: string) => {
  return commonApi("POST",`${serverUrl}/confirm-online/${subId}`,{},getAuthHeader())
}