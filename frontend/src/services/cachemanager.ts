import { ref, computed } from 'vue';

export const Cache = {
    Session: ref(localStorage.getItem('session_key') || ''),
    UserId: ref(localStorage.getItem('user_id') || ''),
    UserName: ref(localStorage.getItem('user_name') || ''),
    UserRole: ref(localStorage.getItem('user_role') || ''),
    
    // Computed para verificar se está logado
    get isLoggedIn() {
        return computed(() => !!this.Session.value);
    },
    
    setAuth(session: string, id: string, name: string, role?: string) {
    this.Session.value = session;
    this.UserId.value = id;
    this.UserName.value = name;
    if (role) {
        this.UserRole.value = role;
        localStorage.setItem('user_role', role);
    }
    
    localStorage.setItem('session_key', session);
    localStorage.setItem('user_id', id);
    localStorage.setItem('user_name', name);
},
    
    clearAuth() {
        this.Session.value = '';
        this.UserId.value = '';
        this.UserName.value = '';
        this.UserRole.value = '';
        localStorage.removeItem('session_key');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
    }
};