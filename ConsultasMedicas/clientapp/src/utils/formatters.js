// Formata o telefone no padrão (99) 99999-9999
export const formatarTelefone = (valor) => {
  if (!valor) return '';
  
  const apenasNumeros = valor.replace(/\D/g, '');
  if (apenasNumeros.length <= 11) {
    let telefoneFormatado = apenasNumeros;
    if (apenasNumeros.length > 2) {
      telefoneFormatado = `(${apenasNumeros.slice(0, 2)})${apenasNumeros.slice(2)}`;
    }
    if (apenasNumeros.length > 7) {
      telefoneFormatado = `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
    }
    return telefoneFormatado;
  }
  return valor.slice(0, 15);
};

// Formata o CPF no padrão 999.999.999-99
export const formatarCPF = (valor) => {
  if (!valor) return '';
  
  const apenasNumeros = valor.replace(/\D/g, '');
  if (apenasNumeros.length <= 11) {
    let cpfFormatado = apenasNumeros;
    if (apenasNumeros.length > 3) {
      cpfFormatado = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
    }
    if (apenasNumeros.length > 6) {
      cpfFormatado = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
    }
    if (apenasNumeros.length > 9) {
      cpfFormatado = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9)}`;
    }
    return cpfFormatado;
  }
  return valor.slice(0, 14);
};

// Remove pontuações de CPF e telefone
export const removerPontuacao = (valor) => {
  if (!valor) return '';
  return valor.replace(/\D/g, '');
};
