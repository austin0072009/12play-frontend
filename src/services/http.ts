import request from '../utils/request';

export async function getData<T>(url: string, config?: any): Promise<T> {
    const res = await request.get(url, config);
    return res as T;
}

export async function postData<T>(url: string, data?: any, config?: any): Promise<T> {
    const res = await request.post(url, data, config);
    return res as T;
}
