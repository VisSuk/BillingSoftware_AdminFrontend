import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const commonApi = async(httpRequest: AxiosRequestConfig["method"], url: string,reqBody: any, reqHeader: AxiosRequestConfig['headers']): Promise<AxiosResponse | any> => {

    const reConfig: AxiosRequestConfig = {
        method: httpRequest,
        url,
        data: reqBody,
        headers: reqHeader
    }

    return await axios(reConfig).then((res) =>{
        return res
    }).catch((error) => {
        throw error
    })

}