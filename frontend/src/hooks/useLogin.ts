import { useState } from 'react';

interface LoginForm {
  email: string;
  senha: string;
}

interface UseLoginReturn {
  form: LoginForm;
  senhaVisivel: boolean;
  carregando: boolean;
  erro: string;
  setEmail: (value: string) => void;
  setSenha: (value: string) => void;
  toggleSenhaVisivel: () => void;
  handleLogin: () => Promise<void>;
}

export function useLogin(onSuccess?: (token: string) => void): UseLoginReturn {
  const [form, setForm] = useState<LoginForm>({ email: '', senha: '' });
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const setEmail = (value: string) => {
    setErro('');
    setForm((prev) => ({ ...prev, email: value }));
  };

  const setSenha = (value: string) => {
    setErro('');
    setForm((prev) => ({ ...prev, senha: value }));
  };

  const toggleSenhaVisivel = () => setSenhaVisivel((prev) => !prev);

  const handleLogin = async () => {
    const emailLimpo = form.email.trim().toLowerCase();
    const senhaLimpa = form.senha.trim();

    if (!emailLimpo || !senhaLimpa) {
      setErro('Preencha o e-mail e a senha para continuar.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      setErro('Informe um e-mail válido.');
      return;
    }

    if (senhaLimpa.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setCarregando(true);
    setErro('');

    // TODO: MODO DE TESTE — remove esse bloco quando o backend estiver pronto
    // Qualquer e-mail/senha válidos passam direto
    await new Promise((resolve) => setTimeout(resolve, 800)); // simula delay de rede
    setCarregando(false);
    onSuccess?.('token-de-teste');
    return;
    // ── fim do bloco de teste ──────────────────────────────────────────────

    //  Código real 
    // try {
    //   const resposta = await fetch('http://localhost:3000/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email: emailLimpo, password: senhaLimpa }),
    //   });
    //   const dados = await resposta.json();
    //   if (dados.sucesso) {
    //     onSuccess?.(dados.dados.token);
    //   } else {
    //     setErro(dados.mensagem || 'E-mail ou senha incorretos.');
    //   }
    // } catch {
    //   setErro('Não foi possível conectar ao servidor.');
    // } finally {
    //   setCarregando(false);
    // }
  };

  return {
    form,
    senhaVisivel,
    carregando,
    erro,
    setEmail,
    setSenha,
    toggleSenhaVisivel,
    handleLogin,
  };
}