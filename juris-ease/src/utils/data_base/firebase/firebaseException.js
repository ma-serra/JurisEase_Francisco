export const getFirebaseErrorMessage = async (error) => {
    switch (error) {
        case 'auth/weak-password':
            return 'A senha deve ser mais forte e segura. Tente incluir letras maiúsculas, minúsculas, números e caracteres especiais.';

        case 'auth/email-already-in-use':
            return 'Este e-mail já está sendo usado por outra conta. Por favor, escolha outro e-mail.';

        case 'auth/invalid-login-credentials':
            return 'Credenciais de login inválidas. Verifique seu e-mail e senha.';

        case 'auth/user-not-found':
            return 'Usuário não encontrado. Por favor, verifique o e-mail inserido.';

        case 'auth/wrong-password':
            return 'Senha incorreta. Por favor, tente novamente.';

        case 'auth/invalid-email':
            return 'E-mail inválido. Certifique-se de inserir um e-mail válido.';

        default:
            return 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.';
    }
}