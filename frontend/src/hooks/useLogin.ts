import { useState } from "react";
// AsyncStorage removido daqui — o AuthContext agora é responsável por salvar o token
import { API_URL } from "../config/apiUrl";
import { DadosUsuario } from "../services/authService";

type LoginForm = {
  email: string;
  senha: string;
};

export function useLogin(onSuccess: (token: string, usuario: DadosUsuario) => void) {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    senha: "",
  });

  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  function setEmail(email: string) {
    setForm((old) => ({
      ...old,
      email,
    }));
  }

  function setSenha(senha: string) {
    setForm((old) => ({
      ...old,
      senha,
    }));
  }

  function toggleSenhaVisivel() {
    setSenhaVisivel((old) => !old);
  }

  async function handleLogin() {
    try {
      setCarregando(true);
      setErro("");

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: form.email,
          password: form.senha,
        }),
      });

      const data = await response.json();

      console.log("RESPOSTA API:", data);

      if (!response.ok) {
        throw new Error(data?.mensagem || "Erro ao realizar login");
      }

      const token = data.dados.token;
      const usuario = data.dados.usuario;

      // salvamento do token removido daqui — o AuthContext cuida disso via salvarSessao
      onSuccess(token, usuario);
    } catch (error: any) {
      console.log(error);

      setErro(error.message || "Erro ao fazer login");
    } finally {
      setCarregando(false);
    }
  }

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
