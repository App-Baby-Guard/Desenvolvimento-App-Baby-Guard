
// Esse hook centraliza toda a lógica da tela de login , A tela de login só cuida da parte visual; toda a lógica fica aqui.

import { useState } from 'react';
import { loginApi } from '../services/authService';
import { DadosUsuario } from '../services/authService';


interface LoginForm {
  email: string;
  senha: string;
}

// O que o hook retorna para a tela usar
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

// Callback que recebe token e usuário após login bem-sucedido
type OnSuccessCallback = (token: string, usuario: DadosUsuario) => void;

export function useLogin(onSuccess?: OnSuccessCallback): UseLoginReturn {
  const [form, setForm] = useState<LoginForm>({ email: '', senha: '' });
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Atualiza o email e limpa o erro anterior
  const setEmail = (value: string) => {
    setErro('');
    setForm((prev) => ({ ...prev, email: value }));
  };

  // Atualiza a senha e limpa o erro anterior
  const setSenha = (value: string) => {
    setErro('');
    setForm((prev) => ({ ...prev, senha: value }));
  };

  // Alterna entre mostrar e esconder a senha
  const toggleSenhaVisivel = () => setSenhaVisivel((prev) => !prev);

  // Função principal: valida os campos e chama a API
  const handleLogin = async () => {
    const emailLimpo = form.email.trim().toLowerCase();
    const senhaLimpa = form.senha.trim();

    //validações antes de chamar a api (lembrar verificação)

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

    // aqui chama a api, mostra indicador de carregamento e trata erros

    setCarregando(true);
    setErro('');

    try {
      const resposta = await loginApi(emailLimpo, senhaLimpa);

      if (resposta.sucesso && resposta.dados) {
        // Login funcionou: chama o callback com o token e usuário
        onSuccess?.(resposta.dados.token, resposta.dados.usuario);
      } else {
        // A API retornou um erro (email ou senha errados, por exemplo)
        setErro(resposta.mensagem || 'E-mail ou senha incorretos.');
      }
    } catch (error) {
      // Erro de rede: servidor offline, sem internet, etc.
      setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      // Sempre para o indicador de carregamento, deu certo ou errado
      setCarregando(false);
    }
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