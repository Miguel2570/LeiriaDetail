import { ref } from 'vue';

export const Cache = {
    // Usamos o localStorage para o cliente não perder a sessão se fizer F5 à página
    Session: ref(localStorage.getItem('session_key') || ''),
    UserId: ref(localStorage.getItem('user_id') || ''),
    UserName: ref(localStorage.getItem('user_name') || ''),
    
    // Função utilitária para guardar o login
    setAuth(session: string, id: string, name: string) {
        this.Session.value = session;
        this.UserId.value = id;
        this.UserName.value = name;
        localStorage.setItem('session_key', session);
        localStorage.setItem('user_id', id);
        localStorage.setItem('user_name', name);
    },
    
    // Função utilitária para fazer logout
    clearAuth() {
        this.Session.value = '';
        this.UserId.value = '';
        this.UserName.value = '';
        localStorage.removeItem('session_key');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
    }
};