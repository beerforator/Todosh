// src/api/auth-api.ts
import { instance } from './instance';

type LoginParamsType = {
    email: string
    password: string
}

type AuthResponseType = { // Ответ при успешном логине
    token: string
}
type RegisterResponseType = { // Ответ при успешной регистрации
    message: string
}

export const authAPI = {
    login(data: LoginParamsType) {
        // `.post` возвращает { data: AuthResponseType }
        return instance.post<AuthResponseType>('auth/login', data);
    },
    register(data: LoginParamsType) {
        return instance.post<RegisterResponseType>('auth/register', data);
    }
    // authMe() ... если нужно
}