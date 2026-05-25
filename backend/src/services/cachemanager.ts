import { ref, computed } from 'vue';

export const Cache = {
    Session: ref(localStorage.getItem('session_key') || ''),
    UserId: ref(localStorage.getItem('user_id') || ''),
    UserName: ref(localStorage.getItem('user_name') || ''),
    
    // Computed para verificar se está logado
    get isLoggedIn() {
        return computed(() => !!this.Session.value);
    },
    
    setAuth(session: string, id: string, name: string) {
        console.log('🔐 Guardando sessão:', { session, id, name }); // Debug
        
        this.Session.value = session;
        this.UserId.value = id;
        this.UserName.value = name;
        
        localStorage.setItem('session_key', session);
        localStorage.setItem('user_id', id);
        localStorage.setItem('user_name', name);
        
        console.log('✅ Cache atualizado:', {
            Session: this.Session.value,
            UserId: this.UserId.value,
            UserName: this.UserName.value
        });
    },
    
    clearAuth() {
        this.Session.value = '';
        this.UserId.value = '';
        this.UserName.value = '';
        localStorage.removeItem('session_key');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
    }
};