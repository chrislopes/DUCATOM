export async function createStudentRequest(
    name: string,
    email: string,
    password: string,
) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                Authorization: `Bearer ${process.env
                    .NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            },
            body: JSON.stringify({
                email,
                password,
                data: {
                    role: 'STUDENT',
                    nome: name,
                },
            }),
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw {
            message: result.msg || 'Erro ao criar aluno.',
            error: result,
        };
    }

    return result;
}

export async function createMentorRequest(
    name: string,
    email: string,
    password: string,
) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                Authorization: `Bearer ${process.env
                    .NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            },
            body: JSON.stringify({
                email,
                password,
                data: {
                    role: 'MENTOR',
                    nome: name,
                },
            }),
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw {
            message: result.msg || 'Erro ao criar Mentor.',
            error: result,
        };
    }

    return result;
}

export async function createAdminRequest(
    name: string,
    email: string,
    password: string,
) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                Authorization: `Bearer ${process.env
                    .NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            },
            body: JSON.stringify({
                email,
                password,
                data: {
                    role: 'ADMIN',
                    nome: name,
                },
            }),
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw {
            message: result.msg || 'Erro ao criar Administrador.',
            error: result,
        };
    }

    return result;
}
