/* =========================================================
   TIPOS
========================================================= */

type TipoCampo =
  | "string"
  | "email"
  | "password"
  | "telefone"
  | "number"
  | "boolean";

type CampoSchema = {
  required?: boolean;
  type?: TipoCampo;
  min?: number;
  max?: number;
};

type Schema = Record<string, CampoSchema>;

type ResultadoValidacao = {
  valido: boolean;
  erros: string[];
};

/* =========================================================
   CLASSE DE VALIDAÇÃO
========================================================= */

export class Validacao {
  /* =====================================================
       NOME
    ===================================================== */

  static isNomeValido(nome: string): boolean {
    if (typeof nome !== "string") {
      return false;
    }

    const nomeLimpo = nome.trim();

    return nomeLimpo.length >= 3 && nomeLimpo.length <= 150;
  }

  /* =====================================================
       EMAIL
    ===================================================== */

  static isEmailValido(email: string): boolean {
    if (typeof email !== "string") {
      return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
  }

  /* =====================================================
       SENHA
    ===================================================== */

  static isPasswordValida(senha: string): boolean {
    if (typeof senha !== "string") {
      return false;
    }

    return senha.trim().length >= 6;
  }

  /* =====================================================
       TELEFONE
    ===================================================== */

  static isTelefoneValido(telefone: string): boolean {
    if (typeof telefone !== "string") {
      return false;
    }

    return /^(\(?\d{2}\)?\s?)?9?\d{4}-?\d{4}$/.test(telefone.trim());
  }

  /* =====================================================
       NUMBER
    ===================================================== */

  static isNumeroValido(valor: any): boolean {
    return valor !== null && valor !== "" && !isNaN(Number(valor));
  }

  /* =====================================================
       BOOLEAN
    ===================================================== */

  static isBoolean(valor: any): boolean {
    return typeof valor === "boolean";
  }

  /* =====================================================
       STRING
    ===================================================== */

  static sanitizarString(valor: string): string {
    return valor.trim().replace(/\s+/g, " ");
  }
}

/* =========================================================
   SCHEMAS
========================================================= */

export const SCHEMAS = {
  REGISTRO: {
    nome: {
      required: true,
      type: "string",
      min: 3,
      max: 150,
    },

    email: {
      required: true,
      type: "email",
      max: 150,
    },

    password: {
      required: true,
      type: "password",
      min: 6,
      max: 100,
    },

    telefone: {
      required: false,
      type: "telefone",
    },
  },

  LOGIN: {
    email: {
      required: true,
      type: "email",
    },

    password: {
      required: true,
      type: "password",
      min: 6,
    },
  },

  USUARIO_UPDATE: {
    nome: {
      type: "string",
      min: 3,
    },

    email: {
      type: "email",
    },

    telefone: {
      type: "telefone",
    },

    status_usuario: {
      type: "string",
    },
  },

  DISPOSITIVO: {
    id_usuario: {
      required: true,
      type: "number",
    },

    nome_dispositivo: {
      required: true,
      type: "string",
      min: 2,
      max: 120,
    },

    modelo: {
      type: "string",
      max: 100,
    },

    mac_address: {
      type: "string",
      max: 50,
    },

    wifi_ssid: {
      type: "string",
      max: 100,
    },

    token_dispositivo: {
      type: "string",
    },

    status_dispositivo: {
      type: "string",
    },
  },

  SENSOR: {
    id_dispositivo: {
      required: true,
      type: "number",
    },

    nome_sensor: {
      required: true,
      type: "string",
      min: 2,
      max: 100,
    },

    tipo_sensor: {
      required: true,
      type: "string",
      min: 2,
      max: 50,
    },

    unidade_medida: {
      type: "string",
      max: 20,
    },

    descricao: {
      type: "string",
    },
  },

  LEITURA: {
    id_sensor: {
      required: true,
      type: "number",
    },

    valor: {
      type: "number",
    },

    valor_booleano: {
      type: "boolean",
    },

    modo_origem: {
      type: "string",
    },

    sincronizado: {
      type: "boolean",
    },
  },

  EVENTO: {
    id_dispositivo: {
      required: true,
      type: "number",
    },

    id_sensor: {
      type: "number",
    },

    tipo_evento: {
      required: true,
      type: "string",
      min: 3,
      max: 100,
    },

    mensagem: {
      required: true,
      type: "string",
      min: 3,
    },

    nivel_criticidade: {
      required: true,
      type: "string",
    },
  },
} as const satisfies Record<string, Schema>;

/* =========================================================
   VALIDAR SCHEMA
========================================================= */

export const validarSchema = (
  body: any,
  schema: Schema,
): ResultadoValidacao => {
  const erros: string[] = [];

  for (const campo in schema) {
    const regras = schema[campo];

    const valor = body[campo];

    /* =================================================
           REQUIRED
        ================================================= */

    if (
      regras.required &&
      (valor === undefined || valor === null || valor === "")
    ) {
      erros.push(`${campo} é obrigatório`);

      continue;
    }

    /* =================================================
           IGNORA OPCIONAIS VAZIOS
        ================================================= */

    if (valor === undefined || valor === null || valor === "") {
      continue;
    }

    /* =================================================
           STRING
        ================================================= */

    if (regras.type === "string") {
      if (typeof valor !== "string") {
        erros.push(`${campo} deve ser texto`);

        continue;
      }
    }

    /* =================================================
           EMAIL
        ================================================= */

    if (regras.type === "email") {
      if (!Validacao.isEmailValido(valor)) {
        erros.push(`${campo} inválido`);
      }
    }

    /* =================================================
           PASSWORD
        ================================================= */

    if (regras.type === "password") {
      if (!Validacao.isPasswordValida(valor)) {
        erros.push(`${campo} deve ter no mínimo 6 caracteres`);
      }
    }

    /* =================================================
           TELEFONE
        ================================================= */

    if (regras.type === "telefone") {
      if (!Validacao.isTelefoneValido(valor)) {
        erros.push("telefone inválido");
      }
    }

    /* =================================================
           NUMBER
        ================================================= */

    if (regras.type === "number") {
      if (!Validacao.isNumeroValido(valor)) {
        erros.push(`${campo} deve ser numérico`);
      }
    }

    /* =================================================
           BOOLEAN
        ================================================= */

    if (regras.type === "boolean") {
      if (!Validacao.isBoolean(valor)) {
        erros.push(`${campo} deve ser boolean`);
      }
    }

    /* =================================================
           MIN
        ================================================= */

    if (
      regras.min &&
      typeof valor === "string" &&
      valor.trim().length < regras.min
    ) {
      erros.push(`${campo} deve ter no mínimo ${regras.min} caracteres`);
    }

    /* =================================================
           MAX
        ================================================= */

    if (
      regras.max &&
      typeof valor === "string" &&
      valor.trim().length > regras.max
    ) {
      erros.push(`${campo} deve ter no máximo ${regras.max} caracteres`);
    }
  }

  /* =====================================================
       VALIDAÇÃO LEITURA
    ===================================================== */

  if (schema === SCHEMAS.LEITURA) {
    const possuiValor = body.valor !== undefined && body.valor !== null;

    const possuiBoolean =
      body.valor_booleano !== undefined && body.valor_booleano !== null;

    if (!possuiValor && !possuiBoolean) {
      erros.push("valor ou valor_booleano deve ser informado");
    }
  }

  return {
    valido: erros.length === 0,

    erros,
  };
};
