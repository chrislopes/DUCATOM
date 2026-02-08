import {
    createAdminRequest,
    createMentorRequest,
    createStudentRequest,
} from '@/service/endpoints/create-user.api';

export async function createStudentService(
    name: string,
    email: string,
    password: string,
) {
    try {
        const data = await createStudentRequest(name, email, password);
        return { success: true, data };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                'Erro ao realizar cadastro de aluno.',
        };
    }
}

export async function createMentorService(
    name: string,
    email: string,
    password: string,
) {
    try {
        const data = await createMentorRequest(name, email, password);
        return { success: true, data };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                'Erro ao realizar cadastro de Mentor.',
        };
    }
}

export async function createAdminService(
    name: string,
    email: string,
    password: string,
) {
    try {
        const data = await createAdminRequest(name, email, password);
        return { success: true, data };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                'Erro ao realizar cadastro de Administrador.',
        };
    }
}
