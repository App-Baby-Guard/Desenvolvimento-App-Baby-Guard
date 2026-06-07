import { useReducer } from "react"; // troquei o useState por useReducer pra juntar todo o estado do login num lugar só
// AsyncStorage removido daqui — o AuthContext agora é responsável por salvar o token
import { API_URL } from "../config/apiUrl";
import { DadosUsuario } from "../services/authService";
// uso o logger pra padronizar os console.log/console.error e a mensagensErro pra
// transformar o status HTTP (401, 500...) em uma frase amigável pro usuário
import { logErro } from "../shared/utils/logger";
import { obterMensagemErro } from "../shared/utils/mensagensErro";

type LoginForm = {
  email: string;
  senha: string;
};

// --- useReducer: em vez de 4 useState soltos (form, senhaVisivel, carregando, erro),
// guardo tudo num único objeto de estado e toda mudança passa por uma "ação" nomeada.
// fica mais fácil de acompanhar o que pode acontecer com o estado do login.

type LoginState = {
  email: string;
  senha: string;
  senhaVisivel: boolean;
  carregando: boolean;
  erro: string;
};

const estadoInicial: LoginState = {
  email: "",
  senha: "",
  senhaVisivel: false,
  carregando: false,
  erro: "",
};

// cada "type" aqui é uma ação possível — é só olhar essa lista pra saber tudo
// que pode mudar o estado do formulário de login
type LoginAction =
  | { type: "SET_EMAIL"; valor: string }
  | { type: "SET_SENHA"; valor: string }
  | { type: "TOGGLE_SENHA_VISIVEL" }
  | { type: "LOGIN_INICIADO" }
  | { type: "LOGIN_SUCESSO" }
  | { type: "LOGIN_ERRO"; mensagem: string };

// o reducer é uma função pura: recebe o estado atual + a ação e devolve o novo estado.
// toda a lógica de "o que muda quando X acontece" fica concentrada aqui
function loginReducer(estado: LoginState, acao: LoginAction): LoginState {
  switch (acao.type) {
    case "SET_EMAIL":
      return { ...estado, email: acao.valor };
    case "SET_SENHA":
      return { ...estado, senha: acao.valor };
    case "TOGGLE_SENHA_VISIVEL":
      return { ...estado, senhaVisivel: !estado.senhaVisivel };
    case "LOGIN_INICIADO":
      // começou a tentativa: liga o carregando e limpa erro antigo
      return { ...estado, carregando: true, erro: "" };
    case "LOGIN_SUCESSO":
      return { ...estado, carregando: false };
    case "LOGIN_ERRO":
      return { ...estado, carregando: false, erro: acao.mensagem };
    default:
      return estado;
  }
}

export function useLogin(onSuccess: (token: string, usuario: DadosUsuario) => void) {
  const [estado, dispatch] = useReducer(loginReducer, estadoInicial);

  // mantenho "form" como objeto separado só pra não precisar mudar a LoginScreen,
  // que já espera receber form.email e form.senha
  const form: LoginForm = { email: estado.email, senha: estado.senha };

  function setEmail(email: string) {
    dispatch({ type: "SET_EMAIL", valor: email });
  }

  function setSenha(senha: string) {
    dispatch({ type: "SET_SENHA", valor: senha });
  }

  function toggleSenhaVisivel() {
    dispatch({ type: "TOGGLE_SENHA_VISIVEL" });
  }

  async function handleLogin() {
    dispatch({ type: "LOGIN_INICIADO" });

    // separei em duas etapas — "tentar se conectar" e "tentar entender a resposta" —
    // assim eu sei exatamente ONDE o erro aconteceu, sem precisar adivinhar o tipo
    // dele (tentei usar "instanceof TypeError" antes, mas isso não é confiável
    // no React Native, então troquei por essa separação mais simples e direta)

    let response: Response;
    try {
      response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: form.email,
          password: form.senha,
        }),
      });
    } catch (erro: any) {
      // chegou aqui = nem conseguiu se conectar (sem internet, servidor fora do ar...)
      logErro("useLogin", "Falha de conexão ao tentar fazer login", erro);
      dispatch({ type: "LOGIN_ERRO", mensagem: obterMensagemErro() });
      return;
    }

    try {
      const data = await response.json();

      console.log("RESPOSTA API (Mensagem):", data.mensagem);

      if (!response.ok) {
        // a API respondeu, mas com erro (401, 500...). Traduzo o status numa frase
        // amigável — mas se a própria API já mandou uma mensagem (ex: "Senha incorreta"),
        // essa tem prioridade
        logErro("useLogin", "API recusou o login", data);
        dispatch({ type: "LOGIN_ERRO", mensagem: obterMensagemErro(response.status, data?.mensagem) });
        return;
      }

      const token = data.dados.token;
      const usuario = data.dados.usuario;

      // salvamento do token removido daqui — o AuthContext cuida disso via salvarSessao
      onSuccess(token, usuario);
      dispatch({ type: "LOGIN_SUCESSO" });
    } catch (erro: any) {
      // a conexão funcionou, mas algo deu errado ao entender a resposta da API
      logErro("useLogin", "Falha ao processar resposta do login", erro);
      dispatch({ type: "LOGIN_ERRO", mensagem: obterMensagemErro() });
    }
  }

  return {
    form,
    senhaVisivel: estado.senhaVisivel,
    carregando: estado.carregando,
    erro: estado.erro,
    setEmail,
    setSenha,
    toggleSenhaVisivel,
    handleLogin,
  };
}
