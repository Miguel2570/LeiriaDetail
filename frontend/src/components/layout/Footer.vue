<template>
  <footer class="bg-gray-900 text-white py-12 mt-20">
    <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div class="col-span-1 md:col-span-2">
        <h2 class="text-2xl font-bold mb-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">LeiriaDetail</h2>
        <p class="text-gray-400 max-w-sm">Detalhe automóvel profissional em Leiria. Tratamos do seu veículo com a máxima atenção e cuidado. [cite: 6]</p>
      </div>

      <div>
        <h4 class="font-bold mb-4">Navegação</h4>
        <ul class="space-y-2 text-gray-400 text-sm">
          <li><router-link to="/sobre" class="hover:text-white">Sobre Nós</router-link></li>
          <li><router-link to="/servicos" class="hover:text-white">Serviços</router-link></li>
          <li><router-link to="/precos" class="hover:text-white">Preços</router-link></li>
          <li><router-link to="/marcacao" class="hover:text-white">Agendar</router-link></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-4">Legal</h4>
        <ul class="space-y-2 text-gray-400 text-sm">
          <li><router-link to="/privacidade" class="hover:text-white">Privacidade [cite: 353]</router-link></li>
          <li><router-link to="/termos" class="hover:text-white">Termos e Condições [cite: 423]</router-link></li>
          <li><router-link to="/cookies" class="hover:text-white">Cookies [cite: 253]</router-link></li>
        </ul>
      </div>
    </div>
    <div class="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
      &copy; 2026 LeiriaDetail. Todos os direitos reservados. [cite: 253]
    </div>
  </footer>
</template>