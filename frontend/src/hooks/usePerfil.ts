import { useState, type Dispatch, type SetStateAction } from "react";
import { API_URL } from "../config/apiUrl";
import { useAuth } from "../context/AuthContext";

type UsePerfilParams = {
  usuario: any | null;
  setUsuario: Dispatch<SetStateAction<any | null>>;
  setNome?: Dispatch<SetStateAction<string>>;
  setTelefone?: Dispatch<SetStateAction<string>>;
};

export function usePerfil({
  usuario,
  setUsuario,
  setNome,
  setTelefone,
}: UsePerfilParams) {
  const [salvando, setSalvando] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  // pega o token do contexto de autenticação em vez do AsyncStorage
  const { token } = useAuth();

  const atualizarPerfil = async (nome: string, telefone: string) => {
    if (!usuario?.id_usuario) {
      throw new Error("Usuário não encontrado.");
    }

    setSalvando(true);

    try {
      const response = await fetch(
        `${API_URL}/usuarios/${usuario.id_usuario}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome, telefone }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.mensagem || "Erro ao atualizar perfil");
      }

      const usuarioAtualizado = data?.dados || data;

      setUsuario(usuarioAtualizado);
      if (setNome) setNome(usuarioAtualizado.nome || "");
      if (setTelefone) setTelefone(usuarioAtualizado.telefone || "");

      return usuarioAtualizado;
    } finally {
      setSalvando(false);
    }
  };

  const alterarSenha = async (senha: string) => {
    if (!usuario?.id_usuario) {
      throw new Error("Usuário não encontrado.");
    }

    setSalvandoSenha(true);

    try {
      const response = await fetch(
        `${API_URL}/usuarios/${usuario.id_usuario}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ senha }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.mensagem || "Erro ao alterar senha");
      }

      return true;
    } finally {
      setSalvandoSenha(false);
    }
  };

  return {
    salvarPerfil: atualizarPerfil,
    alterarSenha,
    salvando,
    salvandoSenha,
  };
}