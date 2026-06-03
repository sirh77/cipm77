/* 
  SiRH77 — Sistema de RH da 77ª CIPM/PMBA
  v2.1 — build 2026-06-02
  Configuração Supabase: defina as variáveis de ambiente no Vercel:
    VITE_SUPABASE_URL=https://seu-projeto.supabase.co
    VITE_SUPABASE_ANON_KEY=sua-chave-anon
*/
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSupabaseState, useGlobalLoading } from "./useSupabase.js";
import { isConfigured } from "./supabase.js";

// ──────────────────────────────────────────────
// DADOS INICIAIS (importados da planilha PECÚLIO)
// ──────────────────────────────────────────────
const INITIAL_OFFICERS = [{"id":1,"grau":"MAJ PM","nome":"Orlins dos santos Almeida","nomeGuerra":"Orlins","matricula":"30.366.553-5","localTrabalho":"Comando","dataNasc":"1982-01-15","cpf":"822.361.005-15","rg":"0792290186","admissao":"2001-02-05","planoSaude":"Cassi","grauInstrucao":"Pós-graduação","ddd":"77","telefone":"991975363","tipoSang":"A positivo","email":"orlins03@hotmail.com","endereco":"Rua José Pereira de Oliveira, loteamento Jardim Candeias, 660, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante da Unidade","estadoCivil":"Casado(a)","naturalidade":"Jequié-BA","pai":"Pedro Moreira Almeida","mae":"Sonia Maria dos Santos Almeida","filhos":"Não","penultimaUnidade":"80ª CIPM","titulo":"0000 0000 0000","antiguidade":1,"cnh":"04575924205","categoriaCnh":"B","validCnh":"2034-04-10","nomePai":"Pedro Moreira Almeida","nomeMae":"Sonia Maria dos Santos Almeida","dataUltimaPromocao":"2023-05-26","classifBgo":"43"},{"id":2,"grau":"MAJ PM","nome":"Marcio de Souza Couto","nomeGuerra":"Marcio Couto","matricula":"30.307.755-4","localTrabalho":"Corregedoria do CPRSO","dataNasc":"1972-04-08","cpf":"671.996.825-49","rg":"0475221869","admissao":"1998-08-03","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991118264","tipoSang":"AB positivo","email":"marciocoutopm@hotmail.com","endereco":"Avenida Amazonas, 690, Ibirapuera, Vitória da Conquista-BA","observacao":"Corregedoria.","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Corregedor do CPRSO","estadoCivil":"Casado(a)","naturalidade":"Feira de Santana-BA","pai":"Emídio Gonçalves do Couto Filho","mae":"Aladia de Souza Couto","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0676 9453 0558","antiguidade":2,"cnh":"02783115024","categoriaCnh":"B","validCnh":"2024-10-21","nomePai":"Emídio Gonçalves do Couto Filho","nomeMae":"Aladia de Souza Couto","dataUltimaPromocao":"2025-09-09","classifBgo":"1"},{"id":3,"grau":"CAP PM","nome":"Marcos Venicius Costa Figueredo","nomeGuerra":"Figueredo","matricula":"30.486.292-8","localTrabalho":"Subcomando","dataNasc":"1986-11-02","cpf":"019.461.055-11","rg":"1432847627","admissao":"2008-08-11","planoSaude":"BRADESCO","grauInstrucao":"ENSINO SUPERIOR COMPLETO","ddd":"77","telefone":"999871109","tipoSang":"O negativo","email":"viniciusfigueredo1986@gmail.com","endereco":"Rua Guiomar Nogueira de Queiroz, 200 - Condomínio Dona Olívia Residencial Boulevard, Bloco 18, apto 101, Candeias, Vitória da Conquista -BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Subcomandante da Unidade","estadoCivil":"","naturalidade":"","pai":"","mae":"","filhos":"Sim","penultimaUnidade":"4ª CIPM","titulo":"","antiguidade":1,"dataUltimaPromocao":"2020-02-04","classifBgo":"1"},{"id":4,"grau":"CAP PM","nome":"Henrique Ferreira Coutinho","nomeGuerra":"Coutinho","matricula":"30.295.858-7","localTrabalho":"1º Pelotão","dataNasc":"1976-08-29","cpf":"749.115.625-87","rg":"0658495070","admissao":"1997-05-05","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988012116","tipoSang":"O positivo","email":"henricouti@hotmail.com","endereco":"Rua F, 10, Morada Real III, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante do 1º Pelotão","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Alcino Almeida Coutinho","mae":"Maria Aparecida Ferreira Coutinho","filhos":"Sim","penultimaUnidade":"APM","titulo":"2320 0011 1202","antiguidade":6,"cnh":"01050501271","categoriaCnh":"AB","validCnh":"2026-01-03","nomePai":"Alcino Almeida Coutinho","nomeMae":"Maria Aparecida Ferreira Coutinho","dataUltimaPromocao":"2026-02-04","classifBgo":"65"},{"id":5,"grau":"CAP PM","nome":"Hudson Matos Cunha","nomeGuerra":"Hudson Matos","matricula":"30.564.476-3","localTrabalho":"4º Pelotão","dataNasc":"1993-11-02","cpf":"030.833.635-67","rg":"1177046369","admissao":"2014-01-06","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991170032","tipoSang":"A positivo","email":"hudson_mc93@hotmail.com","endereco":"Avenida Porto Alegre, 847, Patagônia, Vitória da Conquista-BA","observacao":"SAME. Nova Inspeção JMS: 05/03/2025","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Chefe do SAME","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Edson Santos Cunha","mae":"Maricleia Matos Cunha","filhos":"Não","penultimaUnidade":"CPR/SO","titulo":"1482 4811 0507","antiguidade":5,"cnh":"05622275339","categoriaCnh":"AB","validCnh":"2032-08-04","nomePai":"Edson Santos Cunha","nomeMae":"Maricleia Matos Cunha","dataUltimaPromocao":"2025-09-09","classifBgo":"40"},{"id":6,"grau":"CAP PM","nome":"Thander Almeida Santos","nomeGuerra":"Thander","matricula":"30479974","localTrabalho":"SPO","dataNasc":"1986-12-30","cpf":"031.379.665-31","rg":"1320478107","admissao":"2008-04-07","planoSaude":"Unimed Sudoeste","grauInstrucao":"Pós-graduação","ddd":"77","telefone":"999201372","tipoSang":"A positivo","email":"almeida3012@hotmail.com","endereco":"Avenida Caetité, 2515, Brasil, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Chefe da SPO","estadoCivil":"Casado(a)","naturalidade":"Alagoinhas","pai":"Gilmar Bispo dos Santos","mae":"Walterlicia Almeida Santos","filhos":"Sim","penultimaUnidade":"92ª CIPM","titulo":"1185 2178 0507","antiguidade":4,"cnh":"03676048678","categoriaCnh":"AB","validCnh":"2035-02-04","nomePai":"Gilmar Bispo dos Santos","nomeMae":"Walterlicia Almeida Santos","dataUltimaPromocao":"2025-06-06","classifBgo":"32"},{"id":7,"grau":"CAP PM","nome":"Wellen Gonsalves Oliveira de Carvalho","nomeGuerra":"Wellen Gonsalves","matricula":"30.507.751-8","localTrabalho":"Unidade Básica de Saúde","dataNasc":"1987-05-13","cpf":"029.658.985-30","rg":"0962086606","admissao":"2010-01-18","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991411530","tipoSang":"O positivo","email":"wgoc@live.com","endereco":"Rua Roberto Santos Flortes, 190, Candeias, Vog Privillege, Torre Versailes, Apartamento 606, Vitória da Conquista-BA","observacao":"CEVAP","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Médico","estadoCivil":"Solteiro(a)","naturalidade":"Salvador-BA","pai":"Wellington Nunes de Carvalho","mae":"Marilene Gonsalves Oliveira","filhos":"Sim","penultimaUnidade":"APM","titulo":"1250 7437 0590","antiguidade":2,"cnh":"04804888375","categoriaCnh":"B","validCnh":"2020-07-26","nomePai":"Wellington Nunes de Carvalho","nomeMae":"Marilene Gonsalves Oliveira","dataUltimaPromocao":"2022-06-30","classifBgo":"1"},{"id":8,"grau":"1º TEN PM","nome":"Fabio Augusto Santos Souza","nomeGuerra":"Augusto","matricula":"30.270.991-2","localTrabalho":"2º Pelotão","dataNasc":"1972-05-26","cpf":"604.683.605-06","rg":"0566554607","admissao":"1994-02-21","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988013434","tipoSang":"A positivo","email":"gugabushido@hotmail.com","endereco":"Rua H, 41, Morada dos Passaros II, Felícia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante do 2º Pelotão","estadoCivil":"Solteiro(a)","naturalidade":"Alagoinhas-BA","pai":"Mario Santos Souza","mae":"Maria de Lourdes Souza Santos","filhos":"Sim","penultimaUnidade":"14ª CIPM","titulo":"0593 4946 0582","antiguidade":3,"cnh":"02921149862","categoriaCnh":"AB","validCnh":"2027-11-04","nomePai":"Mario Santos Souza","nomeMae":"Maria de Lourdes Souza Santos","dataUltimaPromocao":"2025-03-14","classifBgo":"96"},{"id":9,"grau":"1º TEN PM","nome":"John Hebert Moura Santos","nomeGuerra":"Moura","matricula":"30647095","localTrabalho":"SOINT","dataNasc":"1998-01-19","cpf":"073.623.995-29","rg":"1613724306","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"73","telefone":"73988777140","tipoSang":"B positivo","email":"John.moura@pm.ba.gov.br","endereco":"Rua T, 185-A, Felicia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Chefe do SOINT","estadoCivil":"Casado(a)","naturalidade":"Itabuna-BA","pai":"José Alberto Sousa Santos","mae":"Janece Santos Moura Santos","filhos":"Não","penultimaUnidade":"80ª CIPM","titulo":"1555 9807 0540","antiguidade":1,"cnh":"06710338637","categoriaCnh":"AB","validCnh":"2026-02-21","nomePai":"José Alberto Sousa Santos","nomeMae":"Janece Santos Moura Santos","dataUltimaPromocao":"2020-05-09","classifBgo":"3"},{"id":10,"grau":"1º TEN PM","nome":"Marcondes Dantas de Paiva","nomeGuerra":"Paiva","matricula":"30270782","localTrabalho":"Outros","dataNasc":"1972-04-23","cpf":"644.558.315.68","rg":"0443189102","admissao":"1994-02-21","planoSaude":"Hapvida","grauInstrucao":"Médio","ddd":"77","telefone":"994044724","tipoSang":"A positivo","email":"condedpaiva@hotmail.com","endereco":"Avenida B, 95, Rua das Palmeiras, Ccasa 25, Ccondomínio Vog Primavera, Primavera, Vitória da Cconquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante de Pelotão","estadoCivil":"Casado(a)","naturalidade":"Paulista-PE","pai":"Francisco Dantas de Paiva","mae":"Inácia Maria da Costa","filhos":"Sim","penultimaUnidade":"BPT RMS","titulo":"0641 4172 0515","antiguidade":2,"cnh":"01733127929","categoriaCnh":"AB","validCnh":"2027-11-07","nomePai":"Francisco Dantas de Paiva","nomeMae":"Inácia Maria da Costa","dataUltimaPromocao":"2025-03-14","classifBgo":"30"},{"id":11,"grau":"ASP PM","nome":"Joao Pedro de Jesus Guimaraes","nomeGuerra":"Joao Pedro","matricula":"92100607","localTrabalho":"Sem local","dataNasc":"2000-07-17","cpf":"863.812.445-77","rg":"2021510000","admissao":"2023-06-30","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"999311919","tipoSang":"A negativo","email":"pedroguimaraesvca@gmail.com","endereco":"Rua Paulo Filadelfo, N° 65, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Sem função","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista -BA","pai":"Ricardo Pinheiro Guimarães","mae":"Margarete Rosa Guimarães","filhos":"Não","penultimaUnidade":"APM","titulo":"1632 2442 0507","antiguidade":2,"cnh":"07188692194","categoriaCnh":"AB","validCnh":"2032-04-04","nomePai":"Ricardo Pinheiro Guimarães","nomeMae":"Margarete Rosa Guimarães","dataUltimaPromocao":"2025-12-18","classifBgo":"1"},{"id":12,"grau":"ASP PM","nome":"Cristiana dos Santos Oliveira","nomeGuerra":"Cristiana","matricula":"30307126","localTrabalho":"SSO","dataNasc":"1979-01-30","cpf":"796.189.105-63","rg":"0703340212","admissao":"1998-08-03","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988485646","tipoSang":"A negativo","email":"cso2019oliveira@gmail.com","endereco":"Rua São Francisco de Assis, 196, Candeias, Vitória da Conquista -BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Auxiliar da SSO","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista BA","pai":"Antônio de Oliveira Filho","mae":"Dalvany dos Santos Oliveira","filhos":"Sim","penultimaUnidade":"CPM/Vitória da Conquista","titulo":"0930 1032 0507","antiguidade":1,"cnh":"07785465139","categoriaCnh":"B","validCnh":"2031-10-19","nomePai":"Antônio de Oliveira Filho","nomeMae":"Dalvany dos Santos Oliveira","dataUltimaPromocao":"2013-11-29","classifBgo":"61"},{"id":13,"grau":"ST PM","nome":"Adelice Santos Sande","nomeGuerra":"Sande","matricula":"30.294.196-2","localTrabalho":"BCS","dataNasc":"1975-11-08","cpf":"921.704.045-20","rg":"0720442095","admissao":"1997-06-02","planoSaude":"UNIMED","grauInstrucao":"Superior","ddd":"77","telefone":"988262420","tipoSang":"B positivo","email":"delisande@hotmail.com","endereco":"Rua 8, Casa 23, Caminho da Universade, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Administrativo","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Ezequias Portela Sande","mae":"Maria Sinesia Santos Sande","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0770 7316 0507","antiguidade":1,"cnh":"05169482072","categoriaCnh":"AB","validCnh":"2021-09-12","nomePai":"Ezequias Portela Sande","nomeMae":"Maria Sinesia Santos Sande","dataUltimaPromocao":"2016-12-23","classifBgo":"99"},{"id":14,"grau":"ST PM","nome":"Aguinaldo Gomes Queiroz Junior","nomeGuerra":"Junior","matricula":"30.285.764-2","localTrabalho":"Subcomando","dataNasc":"1971-05-12","cpf":"737.323.975-72","rg":"0384647308","admissao":"1996-09-09","planoSaude":"NÃO POSSUI","grauInstrucao":"ENSINO MÉDIO COMPLETO","ddd":"77","telefone":"999786194","tipoSang":"O positivo","email":"juniorcaesg@hotmail.com","endereco":"Rua Otacílio Pires, 136, Cidade Nova, Barra da Estiva-BA","observacao":"PROMOÇÃO: BGO nº 161 de 22 de agosto de 2024","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Coordenador de Área","estadoCivil":"Solteiro(a)","naturalidade":"Caetite-BA","pai":"Agnaldo Gomes Queiroz","mae":"Ostília Maria da SIlva Queiroz","filhos":"Sim","penultimaUnidade":"CIPE-SUDOESTE","titulo":"0631 6267 0590","antiguidade":3,"nomePai":"Agnaldo Gomes Queiroz","nomeMae":"Ostília Maria da SIlva Queiroz","dataUltimaPromocao":"2024-08-22","classifBgo":"160"},{"id":15,"grau":"ST PM","nome":"Anderson de Souza Silva","nomeGuerra":"Anderson","matricula":"30294449","localTrabalho":"1º Pelotão","dataNasc":"1973-07-02","cpf":"696.915.505-63","rg":"0668138436","admissao":"1997-05-05","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"71","telefone":"71991754821","tipoSang":"A positivo","email":"andersondesouza73@hotmail.com","endereco":"Rua Abimael Andrade de Matos, 275, Filipinas, Condomínio Parque Vitória Sul, Bloco 12, Apto 101, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Ilhéus-BA","pai":"Emanuel Silva","mae":"Vilma de Souza Silva","filhos":"Sim","penultimaUnidade":"80CIPM","titulo":"0688 6401 0523","antiguidade":8,"nomePai":"Emanuel Silva","nomeMae":"Vilma de Souza Silva","dataUltimaPromocao":"2025-12-18","classifBgo":"95"},{"id":16,"grau":"ST PM","nome":"Eleneide Alves de Araujo","nomeGuerra":"Eleneide","matricula":"30.285.086-0","localTrabalho":"SOINT","dataNasc":"1973-03-21","cpf":"711.438.745-87","rg":"0423512943","admissao":"1996-09-30","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988046268","tipoSang":"B negativo","email":"elenneide@gmail.com","endereco":"Rua L, Quadra 16, Casa 30, Morada dos Passaros III, Felícia, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Analista","estadoCivil":"Solteiro(a)","naturalidade":"Itambe-BA","pai":"Edinito Nery de Araújo","mae":"Aldetrudes Alves de Araújo","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"0710 6456 0574","antiguidade":4,"cnh":"05796202427","categoriaCnh":"B","validCnh":"2022-10-18","nomePai":"Edinito Nery de Araújo","nomeMae":"Aldetrudes Alves de Araújo","dataUltimaPromocao":"2025-02-14","classifBgo":"128"},{"id":17,"grau":"ST PM","nome":"Eneas de Oliveira Amaral","nomeGuerra":"Eneas","matricula":"30.295.609-8","localTrabalho":"CORSET","dataNasc":"1976-09-25","cpf":"911.698.445-53","rg":"0513831878","admissao":"1997-06-30","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988078228","tipoSang":"O negativo","email":"eneasdeoliveira@gmail.com","endereco":"Rua Jonas da Silva Porto, 11, URBIS III, Bairro Bateias, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Auxiliar de Seção","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Ulisses Oliveira do Amaral","mae":"Irani de Oliveira Amaral","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"0766 2155 0531","antiguidade":5,"cnh":"05010598763","categoriaCnh":"B","validCnh":"2035-01-08","nomePai":"Ulisses Oliveira do Amaral","nomeMae":"Irani de Oliveira Amaral","dataUltimaPromocao":"2025-02-14","classifBgo":"129"},{"id":18,"grau":"ST PM","nome":"Everaldo Floriano de Jesus","nomeGuerra":"Floriano","matricula":"30.285.788-8","localTrabalho":"5º Pelotão - PETO","dataNasc":"1975-12-22","cpf":"926.885.435-04","rg":"0860974669","admissao":"1996-09-09","planoSaude":"Planserv","grauInstrucao":"Pós-graduação","ddd":"77","telefone":"981111258","tipoSang":"A positivo","email":"florianodejesus2@hotmail.com","endereco":"Rua Paraguai, 282, Vitória Regia, Itapetinga-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante do 5º Pelotão","estadoCivil":"Casado(a)","naturalidade":"Nova Canaa-BA","pai":"Jose Floriano de Jesus","mae":"Luzia Maria de Jesus","filhos":"Sim","penultimaUnidade":"8ª CIPM","titulo":"0827 5821 0523","antiguidade":2,"cnh":"04697824663","categoriaCnh":"AB","validCnh":"2024-08-01","nomePai":"Jose Floriano de Jesus","nomeMae":"Luzia Maria de Jesus","dataUltimaPromocao":"2024-08-22","classifBgo":"114"},{"id":19,"grau":"ST PM","nome":"Jailton de Cintra Costa","nomeGuerra":"Cintra","matricula":"30.295.851-1","localTrabalho":"3º Pelotão","dataNasc":"1974-04-19","cpf":"710.436.755-15","rg":"0459656252","admissao":"1997-05-05","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988565662","tipoSang":"A positivo","email":"jailtoncintra@hotmail.com","endereco":"Rua Otaviano Souza, 230, Centro, Caetanos-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Guarda do Fisco","estadoCivil":"Casado(a)","naturalidade":"Itapetinga-BA","pai":"Jose Vitorino de Cintra","mae":"Maria Damiana Reis Costa","filhos":"Sim","penultimaUnidade":"79ª CIPM","titulo":"0672 1605 0566","antiguidade":7,"cnh":"03171809627","categoriaCnh":"D","validCnh":"2031-07-20","nomePai":"Jose Vitorino de Cintra","nomeMae":"Maria Damiana Reis Costa","dataUltimaPromocao":"2025-12-18","classifBgo":"25"},{"id":20,"grau":"ST PM","nome":"Joselita Barreto Bomfim Barbosa","nomeGuerra":"Joselita","matricula":"30.295.406-2","localTrabalho":"6º Pelotão - PCS","dataNasc":"1978-03-19","cpf":"907.708.385-53","rg":"0797525009","admissao":"1997-06-30","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988052191","tipoSang":"O positivo","email":"joselitabarreto1903@gmail.com","endereco":"Rua A, 60, Zabelê, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Adjunto ao Coordenador","estadoCivil":"Casado(a)","naturalidade":"Santo Antônio de Jesus-BA","pai":"Paulo Menezes Bomfim","mae":"Anita Andrade Barreto","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0804 8137 0507","antiguidade":11,"cnh":"03547852603","categoriaCnh":"AD","validCnh":"2033-03-02","nomePai":"Paulo Menezes Bomfim","nomeMae":"Anita Andrade Barreto","dataUltimaPromocao":"2025-12-18","classifBgo":"276"},{"id":21,"grau":"ST PM","nome":"Robson Caracas de Souza","nomeGuerra":"Caracas","matricula":"30.295.681-0","localTrabalho":"6º Pelotão - PCS","dataNasc":"1972-08-30","cpf":"604.007.495-72","rg":"0343893002","admissao":"1997-06-30","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988643021","tipoSang":"A positivo","email":"robson.caracas@pm.ba.gov.br","endereco":"Rua I, 23, Morada dos Passaros II, Felícia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante do 6º Pelotão","estadoCivil":"Casado(a)","naturalidade":"Joazeiro do Norte-CE","pai":"Jose Almir Dias de Souza","mae":"Luiza Geralda Caracas de Souza","filhos":"Sim","penultimaUnidade":"80ª CIPM","titulo":"0634 1248 0590","antiguidade":6,"nomePai":"Jose Almir Dias de Souza","nomeMae":"Luiza Geralda Caracas de Souza","dataUltimaPromocao":"2025-02-14","classifBgo":"152"},{"id":22,"grau":"1º SGT PM","nome":"Adailson Machado de Castro","nomeGuerra":"Adailson","matricula":"30.390.771-7","localTrabalho":"4º Pelotão","dataNasc":"1982-04-21","cpf":"004.357.295-27","rg":"0993869335","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991027881","tipoSang":"O positivo","email":"daicastro.pm@gmail.com","endereco":"Rua Araxa, 95, Felícia, Vitória da Conquista-BA","observacao":"Polícia em Treino/CEVAP","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"06399644473","categoriaCnh":"AB","validCnh":"2035-03-14","cargo":"Polícia em Treino","estadoCivil":"Casado(a)","naturalidade":"Itamari-BA","pai":"Adaías Lopes de Castro","mae":"Maria Machado de Castro","filhos":"Sim","penultimaUnidade":"79ª CIPM","titulo":"0994 3037 0515","antiguidade":15,"nomePai":"Adaías Lopes de Castro","nomeMae":"Maria Machado de Castro","dataUltimaPromocao":"2025-01-14","classifBgo":"61"},{"id":23,"grau":"1º SGT PM","nome":"Agenaldo Gama Silveira Junior","nomeGuerra":"Gama","matricula":"30505858","localTrabalho":"2º Pelotão","dataNasc":"1988-08-28","cpf":"030.330.965-22","rg":"1141101238","admissao":"2009-12-21","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"998190346","tipoSang":"A positivo","email":"gama88cave@gmail.com","endereco":"Rua A, 830, Condomínio Vivenda das Orquídeas, Quadra N, Casa 18, São Pedro, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante do 2º Pelotão","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Agenaldo Gama Silveira","mae":"Zizelia Marinho da Silva","filhos":"Sim","penultimaUnidade":"BOPE","titulo":"1291 0160 0558","antiguidade":17,"cnh":"02680440510","categoriaCnh":"AB","validCnh":"2036-01-07","nomePai":"Agenaldo Gama Silveira","nomeMae":"Zizelia Marinho da Silva","dataUltimaPromocao":"2025-09-23","classifBgo":"10"},{"id":24,"grau":"1º SGT PM","nome":"Alex Ferraz Cordeiro","nomeGuerra":"Cordeiro","matricula":"30.429.535-9","localTrabalho":"3º Pelotão","dataNasc":"1976-04-05","cpf":"912.044.105-34","rg":"0844249408","admissao":"2005-03-14","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"981282015","tipoSang":"O positivo","email":"alexf20057@gmail.com","endereco":"Avenida Sao Geraldo,867, Recreio, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"04304853935","categoriaCnh":"AB","validCnh":"2027-10-27","cargo":"Guarda do Hospital de Base","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Anízio Alves Cordeiro","mae":"Maria Jose Ferraz de Sousa","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0750 3269 0540","antiguidade":36,"nomePai":"Anízio Alves Cordeiro","nomeMae":"Maria Jose Ferraz de Sousa","dataUltimaPromocao":"2025-11-25","classifBgo":"689"},{"id":25,"grau":"1º SGT PM","nome":"Alexandre Marques Silva","nomeGuerra":"Marques","matricula":"30.389.687-7","localTrabalho":"6º Pelotão - PCS","dataNasc":"1973-09-03","cpf":"656.291.405-15","rg":"0495796069","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988395327","tipoSang":"B positivo","email":"xande_marques@hotmail.com","endereco":"Rua Dez,16 Vilas Serrana III, Zabelê Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"04037851790","categoriaCnh":"B","validCnh":"2031-05-30","cargo":"Adjunto ao Coordenador","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Antonio Fonseca Silva","mae":"Valdelice Marques Silva","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0691 7557 0582","antiguidade":21,"nomePai":"Antonio Fonseca Silva","nomeMae":"Valdelice Marques Silva","dataUltimaPromocao":"2025-10-14","classifBgo":"167"},{"id":26,"grau":"1º SGT PM","nome":"Alexsandre Viana Novaes","nomeGuerra":"Novaes","matricula":"30.427.458-1","localTrabalho":"Força Nacional","dataNasc":"1977-04-26","cpf":"869.482.455-87","rg":"0586343121","admissao":"2005-03-14","planoSaude":"Unimed","grauInstrucao":"Médio","ddd":"77","telefone":"61982208411","tipoSang":"O negativo","email":"alefnavn@gmail.com","endereco":"Avenida Monumental, Condomínio Total Ville, 103, Santa Maria-DF","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Apresentado à Força Nacional","estadoCivil":"Casado(a)","naturalidade":"Itororó-BA","pai":"Eurelino Ribeiro de Novaes","mae":"Euflozina Viana Neta","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0769 4065 0590","antiguidade":39,"cnh":"01652947975","categoriaCnh":"AE","validCnh":"2024-01-27","nomePai":"Eurelino Ribeiro de Novaes","nomeMae":"Euflozina Viana Neta","dataUltimaPromocao":"2025-11-25"},{"id":27,"grau":"1º SGT PM","nome":"Alexandro Bomfim Lago","nomeGuerra":"Lago","matricula":"30.427.603-8","localTrabalho":"BCS","dataNasc":"1980-05-10","cpf":"000.191.765-03","rg":"1167082710","admissao":"2005-03-14","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"71","telefone":"71981325848","tipoSang":"O positivo","email":"","endereco":"Avenida B, 95, Condomínio Vog Primavera, Casa 28, Primavera, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Adjunto da BCS","estadoCivil":"Casado(a)","naturalidade":"Salvador-BA","pai":"José Carlos Vieira Lago","mae":"Dalva Maria Bomfim Lago","filhos":"Sim","penultimaUnidade":"CIPRV-BRUMADO","titulo":"0938 1193 0540","antiguidade":26,"cnh":"1234436532","categoriaCnh":"B","validCnh":"2035-01-15","nomePai":"José Carlos Vieira Lago","nomeMae":"Dalva Maria Bomfim Lago","dataUltimaPromocao":"2025-10-14","classifBgo":"538"},{"id":28,"grau":"1º SGT PM","nome":"Alessandro Vilas Boas Cardoso","nomeGuerra":"Vilas Boas","matricula":"30.427.440-0","localTrabalho":"3º Pelotão","dataNasc":"1974-01-19","cpf":"650.244.005-34","rg":"590626906","admissao":"2005-03-14","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988737649","tipoSang":"O negativo","email":"vilas.boas_@hotmail.com","endereco":"Avenida B, 95, Condomínio Vog Primavera, Quadra F, Casa 05, Bairro Primavera, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Salvador-BA","pai":"Arnaldo Teixeira Cardoso","mae":"Solange Vilas Boas Cardoso","filhos":"Sim","penultimaUnidade":"68ª CIPM","titulo":"0682 4735 0540","antiguidade":38,"cnh":"02318714340","categoriaCnh":"B","validCnh":"2019-07-08","nomePai":"Arnaldo Teixeira Cardoso","nomeMae":"Solange Vilas Boas Cardoso","dataUltimaPromocao":"2025-11-25","classifBgo":"768"},{"id":29,"grau":"1º SGT PM","nome":"Angra Souza Rocha","nomeGuerra":"Angra","matricula":"30.479.332-3","localTrabalho":"SPO","dataNasc":"1984-12-19","cpf":"019.645.415-81","rg":"0939327236","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988112747","tipoSang":"A positivo","email":"https://firebasestorage.googleapis.com/v0/b/produtividade-ordinaria.appspot.com/o/ANGRA_SOUZA_ROCHA_30479332_COLORIDO?alt=media---token=84bb570e-b4b0-4610-9add-dd51cacb8fcf","endereco":"Avenida Francisco Sabino, 160, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cnh":"05046903269","categoriaCnh":"AB","validCnh":"2031-05-30","cargo":"Auxiliar da SPO","estadoCivil":"Solteiro(a)","naturalidade":"Ibiassucê-BA","pai":"Durvalino Rodrigues Rocha","mae":"Irene MAria de Souza Rocha","filhos":"Não","penultimaUnidade":"CFAP","titulo":"1062 6557 0515","antiguidade":18,"nomePai":"Durvalino Rodrigues Rocha","nomeMae":"Irene MAria de Souza Rocha","dataUltimaPromocao":"2025-09-23","classifBgo":"33"},{"id":30,"grau":"1º SGT PM","nome":"Aparecido Camelio Lelis de Souza Lobo","nomeGuerra":"Lelis","matricula":"30.389.494-8","localTrabalho":"4º Pelotão","dataNasc":"1978-07-28","cpf":"961.231.255-91","rg":"0953657108","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988348979","tipoSang":"O negativo","email":"lelislobo@hotmail.com","endereco":"Avenida Aulino Silva, 01, Subestaçao, Rio do Antônio-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Auxiliar do SAME","estadoCivil":"Solteiro(a)","naturalidade":"Rio do Antônio-BA","pai":"Jose Teixeira Lobo","mae":"Maria Glória de Souza","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1072 2691 0507","antiguidade":28,"cnh":"00130883101","categoriaCnh":"AB","validCnh":"2021-01-25","nomePai":"Jose Teixeira Lobo","nomeMae":"Maria Glória de Souza","dataUltimaPromocao":"2025-10-14","classifBgo":"679"},{"id":31,"grau":"1º SGT PM","nome":"Edna Márcia Santos Sousa","nomeGuerra":"E Márcia","matricula":"30295371","localTrabalho":"CPRSO","dataNasc":"1974-03-15","cpf":"738.569.165-04","rg":"435696920","admissao":"1997-06-30","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988065767","tipoSang":"AB positivo","email":"emarccia@yahoo.com.br","endereco":"Rua Rio Grande do Sul, 425 - Patagônia","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Auxiliar do SAME","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"José Edson Dias de Souza","mae":"Guiomar Oliveira Santos","filhos":"Não","penultimaUnidade":"78ª CIPM","titulo":"7350 9040 531","antiguidade":4,"cnh":"08053933832","categoriaCnh":"AB","validCnh":"2030-05-07","nomePai":"José Edson Dias de Souza","nomeMae":"Guiomar Oliveira Santos","dataUltimaPromocao":"2021-05-07","classifBgo":"87"},{"id":32,"grau":"1º SGT PM","nome":"Geraldo Andre Matos de Oliveira","nomeGuerra":"Andre","matricula":"30.428.812-4","localTrabalho":"1º Pelotão","dataNasc":"1971-03-24","cpf":"441.684.975-34","rg":"368367452","admissao":"2005-03-14","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"71","telefone":"71991732752","tipoSang":"B positivo","email":"geanmaol@protonmail.ch","endereco":"Avenida Central, Loteamento Vila do Marquês, Casa 03, Quadra 22, Ayrton Senna, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"02110911378","categoriaCnh":"D","validCnh":"2028-02-23","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Salvador-BA","pai":"Cândido Constâncio de Oliveira","mae":"Jacy Matos de Oliviera","filhos":"Sim","penultimaUnidade":"BPG","titulo":"0000 0000 0000","antiguidade":37,"nomePai":"Cândido Constâncio de Oliveira","nomeMae":"Jacy Matos de Oliviera","dataUltimaPromocao":"2025-11-25","classifBgo":"694"},{"id":33,"grau":"1º SGT PM","nome":"Herling Santos Conceicao","nomeGuerra":"Herling","matricula":"30.295.857-9","localTrabalho":"3º Pelotão","dataNasc":"1974-04-20","cpf":"856.192.805-00","rg":"0528477218","admissao":"1997-03-05","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988222765","tipoSang":"O positivo","email":"herlingconceicaosantos@gmail.com","endereco":"Rua 15, Casa 07, Vila Serrana II, Zabelê, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Guarda do Fórum","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Jorge Conceiçao","mae":"Alaide dos Santos Conceiçao","filhos":"Sim","penultimaUnidade":"CIPRV","titulo":"0720 0028 0574","antiguidade":1,"cnh":"00846674207","categoriaCnh":"B","validCnh":"2032-03-16","nomePai":"Jorge Conceiçao","nomeMae":"Alaide dos Santos Conceiçao","dataUltimaPromocao":"2021-04-20","classifBgo":"110"},{"id":34,"grau":"1º SGT PM","nome":"Hinattiano Ferreira Alves","nomeGuerra":"Hinattiano","matricula":"30.389.626-7","localTrabalho":"1º Pelotão","dataNasc":"1980-12-08","cpf":"805.384.605-04","rg":"930626303","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988220812","tipoSang":"A negativo","email":"hinattianoalves@gmail.com","endereco":"Rua Claudia Botelho, 150, Primavera, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"02251778699","categoriaCnh":"AB","validCnh":"2031-06-18","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Itapetinga-BA","pai":"Lúcio Roberto Alves","mae":"Rita Ferreira Gama Alves","filhos":"Sim","penultimaUnidade":"2ª CIPRV","titulo":"1547 3855 0574","antiguidade":13,"nomePai":"Lúcio Roberto Alves","nomeMae":"Rita Ferreira Gama Alves","dataUltimaPromocao":"2024-09-25","classifBgo":"207"},{"id":35,"grau":"1º SGT PM","nome":"Ionara Conceicao Vaconcelos Santos","nomeGuerra":"Ionara","matricula":"30.429.525-2","localTrabalho":"3º Pelotão","dataNasc":"1981-12-08","cpf":"004.292.395-64","rg":"0780801180","admissao":"2005-03-14","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"73","telefone":"73981743818","tipoSang":"O positivo","email":"ionaravasconcelos@yahoo.com.br","endereco":"Avenida Para, 1235, Condomínio Jatoba, Bloco 3, Apto 205, Ibirapuera, Vitória da Conquista-BA","observacao":"LICENÇA-PRÊMIO / 01-30/04","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Guarda da Rodoviária","estadoCivil":"Solteiro(a)","naturalidade":"Jequie-BA","pai":"Edmundo Silva Santos","mae":"Joana Angelica Oliveira Vasconcelos Santos","filhos":"Sim","penultimaUnidade":"55ª CIPM","titulo":"0914 6140 0558","antiguidade":35,"nomePai":"Edmundo Silva Santos","nomeMae":"Joana Angelica Oliveira Vasconcelos Santos","dataUltimaPromocao":"2025-11-25","classifBgo":"330"},{"id":36,"grau":"1º SGT PM","nome":"Irlane Barbosa Brito","nomeGuerra":"Irlane","matricula":"30.429.439-5","localTrabalho":"4º Pelotão","dataNasc":"1980-10-29","cpf":"817.691.995-00","rg":"0835925803","admissao":"2005-03-14","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"991135211","tipoSang":"O positivo","email":"irlanebarbosa83@gmail.com.br","endereco":"Rua Q, 380, Morada dos Passaros II, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Auxiliar do SAME","estadoCivil":"Solteiro(a)","naturalidade":"Bom Jesus da Lapa-BA","pai":"Orlando Silva Barbosa","mae":"Graciete da Silva Barbosa","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0950 8933 0507","antiguidade":32,"cnh":"06468060059","categoriaCnh":"B","validCnh":"2031-05-30","nomePai":"Orlando Silva Barbosa","nomeMae":"Graciete da Silva Barbosa","dataUltimaPromocao":"2025-11-25","classifBgo":"21"},{"id":37,"grau":"1º SGT PM","nome":"Ivan Santos Bittencourt","nomeGuerra":"Bittencourt","matricula":"30.295.847-2","localTrabalho":"2º Pelotão","dataNasc":"1974-10-12","cpf":"709.498.135-53","rg":"0865382921","admissao":"1997-05-05","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"981555928","tipoSang":"A negativo","email":"ivan.bittencourt74@hotmail.com","endereco":"Avenida Paramirim, 2075, Brasil, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"8857825903","categoriaCnh":"B","validCnh":"2025-12-22","cargo":"Comandante de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Itambé-BA","pai":"Manoel Mario Bittencourt","mae":"Júlia Maria Santos","filhos":"Não","penultimaUnidade":"92ª CIPM","titulo":"0746 7224 0507","antiguidade":7,"nomePai":"Manoel Mario Bittencourt","nomeMae":"Júlia Maria Santos","dataUltimaPromocao":"44608","classifBgo":"3"},{"id":38,"grau":"1º SGT PM","nome":"Joelma de Almeida Cruz","nomeGuerra":"Joelma","matricula":"30.337.569-3","localTrabalho":"3º Pelotão","dataNasc":"1973-09-18","cpf":"952.266.135-04","rg":"0517385708","admissao":"1999-08-02","planoSaude":"Unimed","grauInstrucao":"Médio","ddd":"77","telefone":"981559335","tipoSang":"A negativo","email":"joelmadealmeidacruz@gmail.com","endereco":"Rua Rio Grande do Sul, 455, Patagônia, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Guarda do Fórum","estadoCivil":"Casado(a)","naturalidade":"Itambé-BA","pai":"Jose Assis Cruz","mae":"Maria Campos de Almeida","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0749 3372 0582","antiguidade":10,"cnh":"04704938190","categoriaCnh":"A","validCnh":"2030-04-23","nomePai":"Jose Assis Cruz","nomeMae":"Maria Campos de Almeida","dataUltimaPromocao":"2023-09-29","classifBgo":"440"},{"id":39,"grau":"1º SGT PM","nome":"Joilson Santos Barreto","nomeGuerra":"Barreto","matricula":"30.430.080-3","localTrabalho":"6º Pelotão - PCS","dataNasc":"1973-07-29","cpf":"578.283.345-91","rg":"513049967","admissao":"2005-03-14","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988246025","tipoSang":"O positivo","email":"barretopmba@gmail.com","endereco":"Rua I, Quadra 13, 241, Bairro Felícia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"02360385863","categoriaCnh":"AD","validCnh":"2028-10-05","cargo":"STM","estadoCivil":"Casado(a)","naturalidade":"Vitoria da Conquista-BA","pai":"Gildasio Araújo Barreto","mae":"Eduvirgem Pereira dos santos","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0719 9017 0582","antiguidade":34,"nomePai":"Gildasio Araújo Barreto","nomeMae":"Eduvirgem Pereira dos santos","dataUltimaPromocao":"2025-11-25","classifBgo":"178"},{"id":40,"grau":"1º SGT PM","nome":"Jose Lucio Santos Tavares","nomeGuerra":"Tavares","matricula":"30.389.672-0","localTrabalho":"5º Pelotão - PETO","dataNasc":"1976-09-04","cpf":"921.385.785-34","rg":"0761535179","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"999737214","tipoSang":"B positivo","email":"jlmopeemfla96@gmail.com","endereco":"Rua 10, 4, Quadra C, Henriqueta Prates, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante/Motorista","estadoCivil":"Casado(a)","naturalidade":"Itapetinga-BA","pai":"Manoel Vieira Tavares","mae":"Luzinete Costa Santos Tavares","filhos":"Sim","penultimaUnidade":"79ª CIPM","titulo":"0764 4698 0507","antiguidade":22,"nomePai":"Manoel Vieira Tavares","nomeMae":"Luzinete Costa Santos Tavares","dataUltimaPromocao":"2025-10-14","classifBgo":"278"},{"id":41,"grau":"1º SGT PM","nome":"Linds Ley Silva Pereira","nomeGuerra":"Linds Ley","matricula":"30.389.629-1","localTrabalho":"6º Pelotão - PCS","dataNasc":"1976-08-10","cpf":"900.853.705-25","rg":"593600541","admissao":"2003-03-10","planoSaude":"Unimed","grauInstrucao":"Superior","ddd":"77","telefone":"999915774","tipoSang":"O positivo","email":"consultoriadoisl@gmail.com","endereco":"Avenida Paulo Amorim, 95, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Adjunto ao Coordenador","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Dermeval Jose Pereira","mae":"Eliane da Silva Pereira","filhos":"Sim","penultimaUnidade":"CIPE-SUDOESTE","titulo":"0782 4917 0515","antiguidade":25,"cnh":"3034525650","categoriaCnh":"B","validCnh":"2025-10-14","nomePai":"Dermeval Jose Pereira","nomeMae":"Eliane da Silva Pereira","dataUltimaPromocao":"2025-10-14","classifBgo":"511"},{"id":42,"grau":"1º SGT PM","nome":"Luis Antonio Santos Dantas","nomeGuerra":"Luis","matricula":"30.390.734-3","localTrabalho":"5º Pelotão - PETO","dataNasc":"1976-06-09","cpf":"935.799.695-87","rg":"0720879604","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"998105346","tipoSang":"B positivo","email":"lasd99@hotmail.com","endereco":"Caminho 34, Casa 03, Urbis II","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Luiz Gonzaga Dantas","mae":"Edite Santos Dantas","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0750 3430 0515","antiguidade":19,"cnh":"05093230164","categoriaCnh":"B","validCnh":"2020-03-10","nomePai":"Luiz Gonzaga Dantas","nomeMae":"Edite Santos Dantas","dataUltimaPromocao":"2025-10-14","classifBgo":"56"},{"id":43,"grau":"1º SGT PM","nome":"Luiz Carlos Evangelista da Silva","nomeGuerra":"Evangelista","matricula":"30.389.622-5","localTrabalho":"3º Pelotão","dataNasc":"1976-05-10","cpf":"922.354.255-34","rg":"0569273471","admissao":"2003-03-10","planoSaude":"Unimed","grauInstrucao":"Médio","ddd":"77","telefone":"988458414","tipoSang":"A positivo","email":"luizevangeliista@gmail.com","endereco":"Rua Sao Borja, 846, Patagônia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Guarda do Fórum","estadoCivil":"Solteiro(a)","naturalidade":"Barra do Choça-BA","pai":"Manoel Batista da Silva","mae":"Maria Evangelista da Silva","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"0804 7425 0507","antiguidade":23,"cnh":"06753326183","categoriaCnh":"B","validCnh":"2032-08-09","nomePai":"Manoel Batista da Silva","nomeMae":"Maria Evangelista da Silva","dataUltimaPromocao":"2025-10-14","classifBgo":"366"},{"id":44,"grau":"1º SGT PM","nome":"Marcondes de Souza Lobo","nomeGuerra":"Marcondes Lobo","matricula":"30.391.139-2","localTrabalho":"3º Pelotão","dataNasc":"1980-07-05","cpf":"796.067.925-87","rg":"0964017962","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988153580","tipoSang":"O positivo","email":"marcondeslobo@hotmail.com","endereco":"Avenida Barreiras, 2361, Brasil, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"00859336009","categoriaCnh":"AD","validCnh":"2034-10-14","cargo":"Plantão","estadoCivil":"Casado(a)","naturalidade":"Rio do Antônio-BA","pai":"Jose Teixeira Lobo","mae":"Maria Glória de Souza","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"0882 0520 0574","antiguidade":16,"nomePai":"Jose Teixeira Lobo","nomeMae":"Maria Glória de Souza","dataUltimaPromocao":"2025-01-14","classifBgo":"222"},{"id":45,"grau":"1º SGT PM","nome":"Marconi Gomes Pereira","nomeGuerra":"Gomes","matricula":"30.389.725-5","localTrabalho":"4º Pelotão","dataNasc":"1971-07-09","cpf":"624.196.415-15","rg":"0789794802","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988069757","tipoSang":"A positivo","email":"gomes_caesg@hotmail.com","endereco":"Sexta Avenida Boa Vista, 332, Condomínio Morada Sul, Bloco Bolívia, Apto 302, Boa Vista, Vitória da Conquista-BA","observacao":"Polícia em Treino/CEVAP","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"01293920340","categoriaCnh":"AB","validCnh":"2028-02-08","cargo":"Polícia em Treino","estadoCivil":"Casado(a)","naturalidade":"Duque de Caxias-RJ","pai":"Gilberto Pereira","mae":"Lídia Gomes Pereria","filhos":"Sim","penultimaUnidade":"CIPE-SUDOESTE","titulo":"0633 8508 0523","antiguidade":20,"nomePai":"Gilberto Pereira","nomeMae":"Lídia Gomes Pereria","dataUltimaPromocao":"2025-10-14","classifBgo":"138"},{"id":46,"grau":"1º SGT PM","nome":"Noelio Barbosa Goes da Silva","nomeGuerra":"Goes","matricula":"30.437.167-6","localTrabalho":"3º Pelotão","dataNasc":"1972-11-28","cpf":"634.937.935-34","rg":"0599596490","admissao":"2005-12-12","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991289185","tipoSang":"B positivo","email":"goesb@hotmail.com","endereco":"Rua A, 4, Loteamento Conquistense, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"03268556956","categoriaCnh":"AB","validCnh":"2031-12-28","cargo":"Guarda do Hospital de Base","estadoCivil":"Casado(a)","naturalidade":"Alagoinhas-BA","pai":"Nadvaldo Barbosa da Silva","mae":"Geralda Goes da Silva","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0688 4083 0574","antiguidade":5,"nomePai":"Nadvaldo Barbosa da Silva","nomeMae":"Geralda Goes da Silva","dataUltimaPromocao":"2021-10-14","classifBgo":"815"},{"id":47,"grau":"1º SGT PM","nome":"Radames Venturini","nomeGuerra":"Venturini","matricula":"30.429.665-6","localTrabalho":"Corregedoria do CPRSO","dataNasc":"1980-05-25","cpf":"001.732.225-10","rg":"0760857326","admissao":"2005-03-14","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988149680","tipoSang":"B positivo","email":"radajones@hotmail.com","endereco":"Rua Patativa, 34, Felícia, Vitória da Conquista-BA","observacao":"Corregedoria.","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Auxiliar de Seção","estadoCivil":"Casado(a)","naturalidade":"Cariacica-ES","pai":"","mae":"Maria Marta Venturini","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0951 2453 0558","antiguidade":33,"cnh":"02961763514","categoriaCnh":"AD","validCnh":"2031-08-16","nomeMae":"Maria Marta Venturini","dataUltimaPromocao":"2025-11-25","classifBgo":"52"},{"id":48,"grau":"1º SGT PM","nome":"Rejane Ribeiro Luz","nomeGuerra":"Rejane","matricula":"30.295.436-3","localTrabalho":"4º Pelotão","dataNasc":"1974-03-22","cpf":"770.636.435-68","rg":"441669905","admissao":"1997-06-30","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988045635","tipoSang":"O positivo","email":"luzribeiro30@hotmail.com","endereco":"Avenida Santa Marta, 315, Centro, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Patrulha Solidária","estadoCivil":"Solteiro(a)","naturalidade":"Brumado-BA","pai":"Laudelino Ribeiro Luz","mae":"Nilza Ribeiro Luz","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0745 5694 0507","antiguidade":3,"cnh":"05215934942","categoriaCnh":"B","validCnh":"2012-05-18","nomePai":"Laudelino Ribeiro Luz","nomeMae":"Nilza Ribeiro Luz","dataUltimaPromocao":"2021-05-06","classifBgo":"167"},{"id":49,"grau":"1º SGT PM","nome":"Ricardo da Silva Souza","nomeGuerra":"Ricardo","matricula":"30.337.635-6","localTrabalho":"3º Pelotão","dataNasc":"1976-04-04","cpf":"879.521.815-72","rg":"0699274486","admissao":"1999-08-02","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"981063868","tipoSang":"A negativo","email":"ricardoservodoaltissimo@gmail.com","endereco":"Rua Jose Bonifacio, 25, Centro, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Guarda do Hospital de Base","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Jose Sabino de Souza Filho","mae":"Teresa da Silva Sousa","filhos":"Sim","penultimaUnidade":"80ª CIPM","titulo":"0749 2628 0540","antiguidade":8,"cnh":"01636908515","categoriaCnh":"AB","validCnh":"2026-03-09","nomePai":"Jose Sabino de Souza Filho","nomeMae":"Teresa da Silva Sousa","dataUltimaPromocao":"2022-12-15","classifBgo":"236"},{"id":50,"grau":"1º SGT PM","nome":"Rodrigo Costa Ribeiro","nomeGuerra":"Rodrigo","matricula":"30.389.617-8","localTrabalho":"4º Pelotão","dataNasc":"1977-11-06","cpf":"985.124.205-53","rg":"0701101741","admissao":"2003-03-10","planoSaude":"Unimed","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991427632","tipoSang":"A positivo","email":"rodrigosd20031@gmail.com","endereco":"Rua I, 287, Morada dos Passaros III, Felícia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"02787912260","categoriaCnh":"D","validCnh":"2033-03-20","cargo":"Operador do CICOM","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Jose Marcelino Ribeiro Aguiar","mae":"Terezinha Maria Ferreira","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"8946 6019 0574","antiguidade":24,"nomePai":"Jose Marcelino Ribeiro Aguiar","nomeMae":"Terezinha Maria Ferreira","dataUltimaPromocao":"2025-10-14","classifBgo":"400"},{"id":51,"grau":"1º SGT PM","nome":"Ronildo Vieira da Silva","nomeGuerra":"Ronildo","matricula":"30.389.042-3","localTrabalho":"3º Pelotão","dataNasc":"1975-09-11","cpf":"900.996.725-53","rg":"0664218539","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988253958","tipoSang":"A positivo","email":"danirov@hotmail.com","endereco":"Rua Jackson Luiz Santos Oliveira, 426, Felícia, Morada dos Passaros II, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Guarda do Hospital de Base","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Orlando Vieira da Silva","mae":"Anelita de Jesus Silva","filhos":"Sim","penultimaUnidade":"34ª CIPM","titulo":"0749 3670 0507","antiguidade":11,"cnh":"02615105373","categoriaCnh":"B","validCnh":"2033-05-09","nomePai":"Orlando Vieira da Silva","nomeMae":"Anelita de Jesus Silva","dataUltimaPromocao":"2023-11-29","classifBgo":"165"},{"id":52,"grau":"1º SGT PM","nome":"Ruberlando Vieira Soares","nomeGuerra":"Vieira","matricula":"30.389.728-9","localTrabalho":"1º Pelotão","dataNasc":"1978-01-10","cpf":"970.184.225-15","rg":"706144317","admissao":"2003-03-10","planoSaude":"Unimed","grauInstrucao":"Superior","ddd":"77","telefone":"981556270","tipoSang":"B positivo","email":"cosmusfc2018@gmail.com","endereco":"Avenida Para, 1235, Ibirapuera, Vitória da Conquista-BA","observacao":"LICENÇA-PRÊMIO / 01-30/04","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"04117624748","categoriaCnh":"AB","validCnh":"2034-06-26","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Antonio Soares do Prado","mae":"Edite Vieira Soares","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"08947 1100 558","antiguidade":27,"nomePai":"Antonio Soares do Prado","nomeMae":"Edite Vieira Soares","dataUltimaPromocao":"2025-10-14","classifBgo":"548"},{"id":53,"grau":"1º SGT PM","nome":"Sergio Saraiva Ribas Cordeiro","nomeGuerra":"Ribas","matricula":"30.295.439-7","localTrabalho":"3º Pelotão","dataNasc":"1973-12-12","cpf":"657.124.045-91","rg":"0404640591","admissao":"1997-06-30","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"981266651","tipoSang":"O negativo","email":"sergios.ribas01@outlook.com","endereco":"Via Local K, 19, Urbis V, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Guarda da Rodoviária","estadoCivil":"Casado(a)","naturalidade":"Sao Miguel Paulista-SP","pai":"Juscelino Ribas Cordeiro","mae":"Ana Saraiva Ribas Cordeiro","filhos":"Sim","penultimaUnidade":"92ª CIPM","titulo":"08047 6670 582","antiguidade":2,"nomePai":"Juscelino Ribas Cordeiro","nomeMae":"Ana Saraiva Ribas Cordeiro","dataUltimaPromocao":"2021-05-06","classifBgo":"87"},{"id":54,"grau":"1º SGT PM","nome":"Simone Carvalho Santana","nomeGuerra":"Simone","matricula":"30.296.882-5","localTrabalho":"6º Pelotão - PCS","dataNasc":"1977-02-13","cpf":"954.172.065-04","rg":"1122069138","admissao":"1997-06-30","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"981050387","tipoSang":"B positivo","email":"carvalhosantana77@gmail.com","endereco":"Condomínio Balvedere, Nova Cidade, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Adjunto ao Coordenador","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Antônio Carlos Porto Santana","mae":"Guilhermina Rocha Carvalho","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0799 4505 0582","antiguidade":31,"nomePai":"Antônio Carlos Porto Santana","nomeMae":"Guilhermina Rocha Carvalho","dataUltimaPromocao":"2025-10-14","classifBgo":"813"},{"id":55,"grau":"1º SGT PM","nome":"Wilmar Alves do Prado","nomeGuerra":"Prado","matricula":"30.390.760-2","localTrabalho":"2º Pelotão","dataNasc":"1974-06-03","cpf":"892.968.265-00","rg":"533040205","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"981083510","tipoSang":"B positivo","email":"wilmarprado2@gmail.com","endereco":"Rua Abmael Andrade Matos, 275, Condomínio Parque Vitória Sul, Bloco 20, Apto 303, Felícia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"04344244044","categoriaCnh":"B","validCnh":"2033-06-05","cargo":"Comandante de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Sao Miguel do Araguaia-GO","pai":"Enok Alves do Prado","mae":"Laura Maria de Andrade","filhos":"Não","penultimaUnidade":"8ª CIPM","titulo":"0746 7164 0523","antiguidade":29,"nomePai":"Enok Alves do Prado","nomeMae":"Laura Maria de Andrade","dataUltimaPromocao":"2025-10-14","classifBgo":"718"},{"id":56,"grau":"1º SGT PM RR/C","nome":"MARCOS LIMA DA SILVA ALCÂNTARA","nomeGuerra":"","matricula":"30.248.286-1","localTrabalho":"AGUARDANDO TRANSFERÊNCIA","dataNasc":"1970-08-12","cpf":"514.333.035-15","rg":"0474723402","admissao":"1992-09-04","planoSaude":"PLANSERV","grauInstrucao":"ENSINO MÉDIO COMPLETO","ddd":"77","telefone":"998079966","tipoSang":"O -","email":"marco.capeta248@gmail.com","endereco":"Avenida jequié, nº 115, Ibirapuera","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE"},{"id":57,"grau":"1º SGT PM RR/C","nome":"Maria Ilza Souza Silva","nomeGuerra":"Ilza","matricula":"30.295.223-0","localTrabalho":"CICOM","dataNasc":"1970-09-30","cpf":"660.283.615-34","rg":"0593622863","admissao":"1997-06-02","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988140752","tipoSang":"O positivo","email":"mariailzasousasilva237@gmail.com","endereco":"Avenida Macaúbas, 2102, Brasil, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Auxiliar do CICOM","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Joao Antônio da Silva","mae":"Eurides Sousa Silva","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0813 3177 0507","antiguidade":41,"cnh":"05114019066","categoriaCnh":"AB","validCnh":"2025-12-20","nomePai":"Joao Antônio da Silva","nomeMae":"Eurides Sousa Silva"},{"id":58,"grau":"AL SGT PM","nome":"Pablo Manoel Almeida Borba","nomeGuerra":"Almeida","matricula":"30.389.729-7","localTrabalho":"6º Pelotão - PCS","dataNasc":"1980-04-07","cpf":"825.355.825-20","rg":"0991100247","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"73","telefone":"73998609562","tipoSang":"O positivo","email":"borbalmeida40@gmail.com","endereco":"RUA Claudia Botelho,670 Bairro Primavera, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Auxiliar de Seção","estadoCivil":"Solteiro(a)","naturalidade":"Itapetinga-BA","pai":"Hildomar Souza Borba","mae":"Arlete Vilela Almeida Borba","filhos":"Sim","penultimaUnidade":"CIPE-SUDOESTE","titulo":"09398 3860 574","antiguidade":1,"nomePai":"Hildomar Souza Borba","nomeMae":"Arlete Vilela Almeida Borba","dataUltimaPromocao":"2025-10-14","classifBgo":"812"},{"id":59,"grau":"CB PM","nome":"Amadeus Nascimento Santos","nomeGuerra":"Amadeus","matricula":"30.505.863-7","localTrabalho":"3º Pelotão","dataNasc":"1985-11-02","cpf":"019.246.475-24","rg":"1331593379","admissao":"2009-12-21","planoSaude":"NÃO POSSUI","grauInstrucao":"Superior","ddd":"77","telefone":"991140564","tipoSang":"O negativo","email":"nascimento.amadeus@gmail.com","endereco":"Rua Euclides Dantas, 227, Sumare, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Guarda do Hospital de Base","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Abedeus Soares Santos","mae":"Dalvadizia Maria Nascimento","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1062 3773 0507","antiguidade":29,"cnh":"05393996840","categoriaCnh":"AB","validCnh":"2032-09-22","nomePai":"Abedeus Soares Santos","nomeMae":"Dalvadizia Maria Nascimento","dataUltimaPromocao":"2025-05-09","classifBgo":"46"},{"id":60,"grau":"CB PM","nome":"Ana Paula Cerqueira Reis","nomeGuerra":"Ana Reis","matricula":"30.505.474-8","localTrabalho":"3º Pelotão","dataNasc":"1980-12-08","cpf":"834.405.005-78","rg":"764281259","admissao":"2009-12-21","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988030475","tipoSang":"O positivo","email":"ana_reis@live.com","endereco":"Avenida Laura Nunes, 455, Condomínio Riviera, Bloco 7, Apto 303, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cnh":"04600599182","categoriaCnh":"AB","validCnh":"2033-10-03","cargo":"P.O","estadoCivil":"Casado(a)","naturalidade":"Jequie-Ba","pai":"Arnaldo Basílio Reis","mae":"Maria Lúcia Cerqueira Reis","filhos":"Sim","penultimaUnidade":"19º BPM","titulo":"1062 4615 0515","antiguidade":25,"nomePai":"Arnaldo Basílio Reis","nomeMae":"Maria Lúcia Cerqueira Reis","dataUltimaPromocao":"2024-10-10","classifBgo":"201"},{"id":61,"grau":"CB PM","nome":"Andre Souza de Oliveira","nomeGuerra":"Andre Oliveira","matricula":"30.505.868-7","localTrabalho":"5º Pelotão - PETO","dataNasc":"1988-01-25","cpf":"010.820.335-29","rg":"1145882285","admissao":"2009-12-21","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988007066","tipoSang":"O positivo","email":"andre2501@hotmail.com","endereco":"Rua Tamoios, 109, Alto Maron, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"03935046003","categoriaCnh":"AB","validCnh":"2026-03-28","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Paulo Lima de Oliveira","mae":"Maria Celia Souza de Oliveira","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1130 5788 0515","antiguidade":31,"nomePai":"Paulo Lima de Oliveira","nomeMae":"Maria Celia Souza de Oliveira","dataUltimaPromocao":"2025-05-09","classifBgo":"95"},{"id":62,"grau":"CB PM","nome":"Augusto Camilo da Cruz Neto","nomeGuerra":"Camilo","matricula":"30.481.393-7","localTrabalho":"1º Pelotão","dataNasc":"1981-02-08","cpf":"000.964.215-33","rg":"0701897309","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988191190","tipoSang":"O positivo","email":"augustocamilo23@gmail.com","endereco":"Sexta Avenida,332, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"02875274441","categoriaCnh":"D","validCnh":"2033-10-19","cargo":"Comandante/Motorista","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Antonito Silva Pereira","mae":"Sônia Cruz Pereira","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0951 1823 0531","antiguidade":11,"nomePai":"Antonito Silva Pereira","nomeMae":"Sônia Cruz Pereira","dataUltimaPromocao":"2023-07-28","classifBgo":"69"},{"id":63,"grau":"CB PM","nome":"BONIECK SILVA CAMPOS LIMA","nomeGuerra":"","matricula":"30506900","localTrabalho":"1º PEL/CANDEIAS","dataNasc":"","cpf":"","rg":"","admissao":"","planoSaude":"","grauInstrucao":"","ddd":"77","telefone":"","tipoSang":"","email":"","endereco":"","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE"},{"id":64,"grau":"CB PM","nome":"Camilla Matos Santos","nomeGuerra":"Camilla","matricula":"30.505.481-1","localTrabalho":"4º Pelotão","dataNasc":"1986-11-10","cpf":"024.107.975-63","rg":"1200792599","admissao":"2009-12-21","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988337900","tipoSang":"B positivo","email":"camilla_matos@hotmail.com","endereco":"Avenida Laura Nunes, 1725, Condomínio Jardim Bacelona, Rua C, Casa 43, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Operador do CICOM","estadoCivil":"Solteiro(a)","naturalidade":"Jequie-Ba","pai":"Jose Souza Santos","mae":"Maria da Conceiçao Matos Santos","filhos":"Sim","penultimaUnidade":"78ª CIPM","titulo":"1201 5402 0515","antiguidade":27,"nomePai":"Jose Souza Santos","nomeMae":"Maria da Conceiçao Matos Santos","dataUltimaPromocao":"2024-11-08","classifBgo":"122"},{"id":65,"grau":"CB PM","nome":"Carla Barbosa da Silva Oliveira","nomeGuerra":"Carla","matricula":"30.511.639-6","localTrabalho":"3º Pelotão","dataNasc":"1978-02-10","cpf":"920.037.105-15","rg":"0655146610","admissao":"2010-05-24","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"981098337","tipoSang":"B positivo","email":"maestra.carla@hotmail.com","endereco":"Travessa Monte Castelo,  31, Alto Maron, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Joao Barbosa da Silva","mae":"Luzia Pereira dos Santos","filhos":"Sim","penultimaUnidade":"79ª CIPM","titulo":"0804 7725 0590","antiguidade":42,"nomePai":"Joao Barbosa da Silva","nomeMae":"Luzia Pereira dos Santos","dataUltimaPromocao":"2025-09-26","classifBgo":"343"},{"id":66,"grau":"CB PM","nome":"Carlinho Batista da Silva","nomeGuerra":"Batista","matricula":"30.481.386-4","localTrabalho":"3º Pelotão","dataNasc":"1978-06-12","cpf":"973.991.325-34","rg":"0008117240","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988173522","tipoSang":"A positivo","email":"carlobates@hotmail.com","endereco":"Rua 28 de Dezembro, 220, Centro, Cordeiros-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"P.O","estadoCivil":"Solteiro(a)","naturalidade":"Cordeiros-BA","pai":"Jose Batista da Silva","mae":"Maria Madalena da Silva","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"0825 4581 0523","antiguidade":14,"cnh":"06284561057","categoriaCnh":"AB","validCnh":"2035-02-06","nomePai":"Jose Batista da Silva","nomeMae":"Maria Madalena da Silva","dataUltimaPromocao":"2023-09-22","classifBgo":"22"},{"id":67,"grau":"CB PM","nome":"Charles Souza do Nascimento","nomeGuerra":"Charles","matricula":"30.481.194-3","localTrabalho":"2º Pelotão","dataNasc":"1985-12-10","cpf":"023.837.905-16","rg":"0899352090","admissao":"2008-04-07","planoSaude":"Unimed","grauInstrucao":"Superior","ddd":"77","telefone":"988090656","tipoSang":"O positivo","email":"comcharles@gmail.com","endereco":"Avenida Boa Vontade, 2068, Brasil, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"03330608262","categoriaCnh":"AB","validCnh":"2032-02-16","cargo":"Comandante/Motorista","estadoCivil":"Solteiro(a)","naturalidade":"Jequie-BA","pai":"Aristóteles Emídio do Nascimento","mae":"Jandira Ferreira de Souza do Nascimento","filhos":"Sim","penultimaUnidade":"17º BPM","titulo":"1107 4292 0531","antiguidade":3,"nomePai":"Aristóteles Emídio do Nascimento","nomeMae":"Jandira Ferreira de Souza do Nascimento","dataUltimaPromocao":"2022-07-11","classifBgo":"51"},{"id":68,"grau":"CB PM","nome":"Cleber Sales Duarte","nomeGuerra":"Sales","matricula":"30.505.877-6","localTrabalho":"1º Pelotão","dataNasc":"1979-10-21","cpf":"967.864.775-34","rg":"0770542530","admissao":"2009-12-21","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988156264","tipoSang":"A positivo","email":"cleberpm99@hotmail.com","endereco":"Rua Porto Alegre,967, Patagônia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"02522720418","categoriaCnh":"AB","validCnh":"2034-03-12","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Valdeilde Duarte Andrade","mae":"Nilzete Sales Duarte","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0883 3311 0566","antiguidade":32,"nomePai":"Valdeilde Duarte Andrade","nomeMae":"Nilzete Sales Duarte","dataUltimaPromocao":"2025-05-09","classifBgo":"98"},{"id":69,"grau":"CB PM","nome":"Clotildes da Silva Santos","nomeGuerra":"Clotildes","matricula":"30.490.162-5","localTrabalho":"4º Pelotão","dataNasc":"1983-03-08","cpf":"835.008.635-15","rg":"0901239488","admissao":"2008-10-10","planoSaude":"Planserv","grauInstrucao":"Pós-graduação","ddd":"77","telefone":"981087022","tipoSang":"A positivo","email":"clotildess63@gmail.com","endereco":"Rua Tonico Lemos, 10, Condomínio Jardim Madrid, Casa 166, Alto Maron, Vitória da Conquista-BA","observacao":"CEVAP","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"CEVAP","estadoCivil":"Casado(a)","naturalidade":"Poções","pai":"Farlon José dos Santos","mae":"Creusa Moitinho da Silva Santos","filhos":"Sim","penultimaUnidade":"79ª CIPM","titulo":"0917 6864 0507","antiguidade":22,"nomePai":"Farlon José dos Santos","nomeMae":"Creusa Moitinho da Silva Santos","dataUltimaPromocao":"2024-05-15","classifBgo":"16"},{"id":70,"grau":"CB PM","nome":"Cristiano Americo Dias Santos","nomeGuerra":"Americo","matricula":"30.481.540-0","localTrabalho":"1º Pelotão","dataNasc":"1981-03-30","cpf":"004.185.775-52","rg":"0838348424","admissao":"2008-04-07","planoSaude":"Unimed","grauInstrucao":"Superior","ddd":"77","telefone":"999672832","tipoSang":"B positivo","email":"cristianoamerico81@gmail.com","endereco":"Rua Padre Arnaldo Lima, 385, Quadra 4, Casa 2, Primavera, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"04990949173","categoriaCnh":"B","validCnh":"2035-07-30","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Antônio Jose dos Santos","mae":"Vilma Lúcia Dias Santos","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0951 0820 0531","antiguidade":7,"nomePai":"Antônio Jose dos Santos","nomeMae":"Vilma Lúcia Dias Santos","dataUltimaPromocao":"2022-09-23","classifBgo":"166"},{"id":71,"grau":"CB PM","nome":"Diego Alessandro Pessoa Blatt","nomeGuerra":"Blatt","matricula":"30.513.122-3","localTrabalho":"6º Pelotão - PCS","dataNasc":"1981-02-05","cpf":"974.436.625-72","rg":"745918948","admissao":"2010-05-24","planoSaude":"NÃO POSSUI","grauInstrucao":"Médio","ddd":"77","telefone":"988046613","tipoSang":"A positivo","email":"diegoroad@yahoo.com.br","endereco":"Rua Joaquim dos Reis, 555, Cond Riverside, Bloco 40, AP 104, Felicia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Sala de Meios da Sede","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista","pai":"Valdir Blatt","mae":"Dayse Cristina Pessoa Blatt","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"0916 8149 0590","antiguidade":38,"cnh":"02820039900","categoriaCnh":"B","validCnh":"2033-02-28","nomePai":"Valdir Blatt","nomeMae":"Dayse Cristina Pessoa Blatt","dataUltimaPromocao":"2025-09-26","classifBgo":"172"},{"id":72,"grau":"CB PM","nome":"Fabio Rocha da Silva","nomeGuerra":"Fabio","matricula":"30.481.270-3","localTrabalho":"6º Pelotão - PCS","dataNasc":"1982-04-05","cpf":"824.188.705-10","rg":"0887792979","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988279954","tipoSang":"AB positivo","email":"bexter_555@hotmail.com","endereco":"Avenida Fernando Spinola,737, Jurema, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05187693448","categoriaCnh":"AB","validCnh":"2032-01-05","cargo":"Sala de Meios da Sede","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Jose Rocha da Silva","mae":"Antonia Francisca da Silva","filhos":"Sim","penultimaUnidade":"17º BPM","titulo":"1013 8546 0531","antiguidade":16,"nomePai":"Jose Rocha da Silva","nomeMae":"Antonia Francisca da Silva","dataUltimaPromocao":"2023-09-22","classifBgo":"196"},{"id":73,"grau":"CB PM","nome":"Igor Silva Dias","nomeGuerra":"Igor","matricula":"30.481.298-1","localTrabalho":"4º Pelotão","dataNasc":"1986-07-29","cpf":"021.581.155-05","rg":"0979998905","admissao":"2008-04-07","planoSaude":"Bradesco","grauInstrucao":"Superior","ddd":"77","telefone":"988213935","tipoSang":"O positivo","email":"igoradmh@gmail.com","endereco":"Rua Doutor Saul Quandos Filho,415,Boa Vista Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Guarda do Ministério Público","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Edson Ferreira Dias","mae":"Maria Nilva Silva Dias","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1062 0701 0566","antiguidade":12,"cnh":"03856813163","categoriaCnh":"AD","validCnh":"2035-03-24","nomePai":"Edson Ferreira Dias","nomeMae":"Maria Nilva Silva Dias","dataUltimaPromocao":"2023-07-28","classifBgo":"178"},{"id":74,"grau":"CB PM","nome":"Isaac Lee do Couto Rocha","nomeGuerra":"Isaac Lee","matricula":"30.481.370-9","localTrabalho":"1º Pelotão","dataNasc":"1981-11-29","cpf":"825.699.085-68","rg":"0981829864","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988375883","tipoSang":"O positivo","email":"isaaclee.couto@gmail.com","endereco":"Rua 8 de Maio 233, Alto Maron, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante/Motorista","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Fernanda Lula Rocha","mae":"Rosa Maria do Couto Rocha","filhos":"Sim","penultimaUnidade":"77ª CIPM","titulo":"0937 8080 0507","antiguidade":6,"cnh":"05235465860","categoriaCnh":"AB","validCnh":"2031-12-19","nomePai":"Fernanda Lula Rocha","nomeMae":"Rosa Maria do Couto Rocha","dataUltimaPromocao":"2022-08-04","classifBgo":"47"},{"id":75,"grau":"CB PM","nome":"Ismael Vieira dos Santos","nomeGuerra":"dos Santos","matricula":"30.481.296-5","localTrabalho":"1º Pelotão","dataNasc":"1979-11-28","cpf":"004.941.625-11","rg":"1289250430","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988311619","tipoSang":"O positivo","email":"ismaelvieiradossantos01@gmail.com","endereco":"Caminho 41,Casa 7 Urbis III, Vitória Da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"03515533928","categoriaCnh":"B","validCnh":"2034-09-10","cargo":"Comandante/Motorista","estadoCivil":"Casado(a)","naturalidade":"Remanso-BA","pai":"Benedito Vieira dos Santos","mae":"Izabel Pereira da Silva Pinto","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"088 0104 20523","antiguidade":8,"nomePai":"Benedito Vieira dos Santos","nomeMae":"Izabel Pereira da Silva Pinto","dataUltimaPromocao":"2022-09-23","classifBgo":"174"},{"id":76,"grau":"CB PM","nome":"Israel de Souza Bonfim","nomeGuerra":"Israel Bonfim","matricula":"30.506.876-3","localTrabalho":"4º Pelotão","dataNasc":"1990-09-13","cpf":"030.988.885-98","rg":"1316748111","admissao":"2009-12-21","planoSaude":"Unimed","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991010030","tipoSang":"B negativo","email":"israeldesouzabonfim@gmail.com","endereco":"Rua Placido de Castro, 914, Guarani, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Operador do CICOM","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Adelino Pereira Bomfim","mae":"Maria Jose de Souza","filhos":"Não","penultimaUnidade":"80ª CIPM","titulo":"1349 5824 0515","antiguidade":28,"cnh":"04793875264","categoriaCnh":"AB","validCnh":"2033-10-06","nomePai":"Adelino Pereira Bomfim","nomeMae":"Maria Jose de Souza","dataUltimaPromocao":"2024-11-08","classifBgo":"131"},{"id":77,"grau":"CB PM","nome":"Jamilton Santos da Silva","nomeGuerra":"Jamilton","matricula":"30.506.872-1","localTrabalho":"3º Pelotão","dataNasc":"1986-10-18","cpf":"020.520.995-57","rg":"1290307598","admissao":"2009-12-21","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"991408871","tipoSang":"A negativo","email":"jamabelfor@hotmail.com","endereco":"Avenida Bartolomeu de Gusmao, 998, Jurema, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"03882591116","categoriaCnh":"AD","validCnh":"2034-02-16","cargo":"Guarda do Fisco","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Jaudeci Santos da Silva","mae":"Dulce Alves da Silva","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1186 9052 0531","antiguidade":33,"nomePai":"Jaudeci Santos da Silva","nomeMae":"Dulce Alves da Silva","dataUltimaPromocao":"2025-05-09","classifBgo":"104"},{"id":78,"grau":"CB PM","nome":"Joan Rito Amorim de Carvalho","nomeGuerra":"Amorim","matricula":"30.481.523-0","localTrabalho":"1º Pelotão","dataNasc":"1985-07-15","cpf":"021.581.205-09","rg":"0883240602","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991554441","tipoSang":"A positivo","email":"joanracarvalho@yahoo.com.br","endereco":"Rua Claudia Botelho, 150, Condomínio Vivendas do Bosque, Rua, E, 27, Loteamento Primavera, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Vicente Soares de Carvalho","mae":"Maria dos Passos Amorim de Carvalho","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1130 2080 0558","antiguidade":15,"nomePai":"Vicente Soares de Carvalho","nomeMae":"Maria dos Passos Amorim de Carvalho","dataUltimaPromocao":"2023-09-22","classifBgo":"167"},{"id":79,"grau":"CB PM","nome":"Joao Rodrigues de Souza Filho","nomeGuerra":"Souza Filho","matricula":"30.513.141-9","localTrabalho":"3º Pelotão","dataNasc":"1988-08-18","cpf":"028.770.425-45","rg":"1281988693","admissao":"2010-05-24","planoSaude":"NÃO POSSUI","grauInstrucao":"Médio","ddd":"77","telefone":"988261891","tipoSang":"A positivo","email":"joaosdfilho@gmail.com","endereco":"Rua Colômbia, 69, Jurema, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Joao Rodrigues de Souza Filho","mae":"Maria Lúcia Moreira de Souza","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1304 5429 0507","antiguidade":40,"cnh":"06089591250","categoriaCnh":"AB","validCnh":"2018-08-28","nomePai":"Joao Rodrigues de Souza Filho","nomeMae":"Maria Lúcia Moreira de Souza","dataUltimaPromocao":"2025-09-26","classifBgo":"256"},{"id":80,"grau":"CB PM","nome":"Joselane Flora de Azevedo Cardoso","nomeGuerra":"Flora","matricula":"30.492.205-3","localTrabalho":"2º Pelotão","dataNasc":"1982-05-07","cpf":"805.151.425-49","rg":"1147185719","admissao":"2009-01-05","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991630134","tipoSang":"B positivo","email":"joselanecardoso77@gmail.com","endereco":"Avenida Guanabara,1011, Condomínio Pituba, Bloco Sol Apt 303, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Comandante de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Jequie-Ba","pai":"Jose Cardoso","mae":"Joselita Sousa de Azevedo","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"0956 2681 0566","antiguidade":24,"cnh":"04359216635","categoriaCnh":"B","validCnh":"2026-01-10","nomePai":"Jose Cardoso","nomeMae":"Joselita Sousa de Azevedo","dataUltimaPromocao":"2024-08-01","classifBgo":"17"},{"id":81,"grau":"CB PM","nome":"Kleber Jackson Rodrigues da Silva","nomeGuerra":"Rodrigues","matricula":"30.481.452-7","localTrabalho":"1º Pelotão","dataNasc":"1981-12-19","cpf":"005.577.025-85","rg":"0913946001","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988242070","tipoSang":"O positivo","email":"kjrssilva06@gmail.com","endereco":"Rua G, 32, Morada dos Passaros II, Felícia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"04795160831","categoriaCnh":"AB","validCnh":"2036-01-07","cargo":"Comandante/Motorista","estadoCivil":"Casado(a)","naturalidade":"Motuípe-BA","pai":"Jose Nunes da Silva","mae":"Maria da Conceiçao Rodrigues dos Santos","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0861 4987 0531","antiguidade":13,"nomePai":"Jose Nunes da Silva","nomeMae":"Maria da Conceiçao Rodrigues dos Santos","dataUltimaPromocao":"2023-07-28","classifBgo":"210"},{"id":82,"grau":"CB PM","nome":"Leandro Araujo Oliveira","nomeGuerra":"Araujo","matricula":"30.481.307-6","localTrabalho":"1º Pelotão","dataNasc":"1982-04-28","cpf":"824.270.115-68","rg":"0890183201","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988170705","tipoSang":"A negativo","email":"leandro.araujo428@gmail.com","endereco":"Sexta Avenida Boa Vista, 332, Cond Morada Sul, Bloco A, AP 203, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Patrulheiro","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Jose Quaresma de Oliveira","mae":"Antônia Araujo de Oliveira","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1013 8590 0507","antiguidade":10,"cnh":"03594652669","categoriaCnh":"AB","validCnh":"2034-10-23","nomePai":"Jose Quaresma de Oliveira","nomeMae":"Antônia Araujo de Oliveira","dataUltimaPromocao":"2023-04-28","classifBgo":"11"},{"id":83,"grau":"CB PM","nome":"Lourival Sancho Viana Filho","nomeGuerra":"Sancho","matricula":"30.505.915-4","localTrabalho":"4º Pelotão","dataNasc":"1982-07-14","cpf":"833.975.405-00","rg":"0945332882","admissao":"2009-12-21","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991394621","tipoSang":"O negativo","email":"lorosancho1@hotmail.com","endereco":"Rua Antônio Nascimento, 48, Cruzeiro, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"08094646006","categoriaCnh":"AB","validCnh":"2032-08-01","cargo":"Fórum do TJBA","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Lourival Sancho Viana","mae":"Maria de Lourdes dos Santos Viana","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"0951 1016 0507","antiguidade":36,"nomePai":"Lourival Sancho Viana","nomeMae":"Maria de Lourdes dos Santos Viana","dataUltimaPromocao":"2025-09-16","classifBgo":"136"},{"id":84,"grau":"CB PM","nome":"Lucas Silva de Melo","nomeGuerra":"Melo","matricula":"30.481.500-2","localTrabalho":"1º Pelotão","dataNasc":"1986-10-18","cpf":"027.433.352-22","rg":"1151014893","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988289679","tipoSang":"O positivo","email":"lucasmelocs@gmail.com","endereco":"Rua V, 34, Vila Serrana II, Zabelê, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Patrulheiro","estadoCivil":"Solteiro(a)","naturalidade":"Aurelino Leal-BA","pai":"Aderval Barbosa Alcântara de Melo","mae":"Ruthcelia Silva de Melo","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1211 8833 0574","antiguidade":9,"cnh":"04812116136","categoriaCnh":"AB","validCnh":"2035-04-10","nomePai":"Aderval Barbosa Alcântara de Melo","nomeMae":"Ruthcelia Silva de Melo","dataUltimaPromocao":"2022-09-23","classifBgo":"231"},{"id":85,"grau":"CB PM","nome":"Marcel Stenio Oliveira Silva","nomeGuerra":"Stenio","matricula":"30.505.919-6","localTrabalho":"1º Pelotão","dataNasc":"1986-04-21","cpf":"021.308.805-33","rg":"1131706021","admissao":"2009-12-21","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"991672992","tipoSang":"O positivo","email":"marcelstenio@gmail.com","endereco":"Rua Beija Flor, 274, Casa B, Recanto dos Passaros, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Patrulheiro","estadoCivil":"Casado(a)","naturalidade":"Bom Jesus da Lapa-BA","pai":"Giselio Ribeiro da Silva","mae":"Maria Socorro de Oliveira","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1137 7238 0566","antiguidade":35,"cnh":"04694073650","categoriaCnh":"AB","validCnh":"2024-11-17","nomePai":"Giselio Ribeiro da Silva","nomeMae":"Maria Socorro de Oliveira","dataUltimaPromocao":"2025-09-16","classifBgo":"55"},{"id":86,"grau":"CB PM","nome":"Marcos Jose Ribeiro Sa","nomeGuerra":"Marcos Sa","matricula":"30.480.525-1","localTrabalho":"3º Pelotão","dataNasc":"1978-11-26","cpf":"967.383.245-53","rg":"0868850659","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"73","telefone":"73988164404","tipoSang":"A positivo","email":"marcossaturismoo@gmail.com","endereco":"Rua R, 115-A, Morada dos Passaros II, Felícia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"01096625771","categoriaCnh":"AB","validCnh":"2032-11-07","cargo":"Guarda do Fórum","estadoCivil":"Casado(a)","naturalidade":"Ilheus-BA","pai":"Valdemir Souza Sa","mae":"Hilda Ribeiro Sa","filhos":"Sim","penultimaUnidade":"68ª CIPM","titulo":"0847 7912 0582","antiguidade":2,"nomePai":"Valdemir Souza Sa","nomeMae":"Hilda Ribeiro Sa","dataUltimaPromocao":"2022-07-11","classifBgo":"18"},{"id":87,"grau":"CB PM","nome":"Mario Rodrigues da Silva Neto","nomeGuerra":"Mario","matricula":"30.481.667-6","localTrabalho":"1º Pelotão","dataNasc":"1979-05-10","cpf":"777.384.385-68","rg":"0704142031","admissao":"2008-04-07","planoSaude":"NÃO POSSUI","grauInstrucao":"Superior","ddd":"77","telefone":"998726536","tipoSang":"O positivo","email":"marioneto2012@yahoo.com.br","endereco":"Rua da Conquista,660,apt302, Centro, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Salvador-BA","pai":"Antonio Santos Marinho da Silva","mae":"Maria Lúcia Rodrigues da Silva","filhos":"Sim","penultimaUnidade":"64ª CIPM","titulo":"0933 7465 0582","antiguidade":1,"cnh":"05239776790","categoriaCnh":"B","validCnh":"2021-02-17","nomePai":"Antonio Santos Marinho da Silva","nomeMae":"Maria Lúcia Rodrigues da Silva","dataUltimaPromocao":"2022-04-18","classifBgo":"76"},{"id":88,"grau":"CB PM","nome":"Mateus Alves de Oliveira Souza","nomeGuerra":"Souza","matricula":"30.481.450-1","localTrabalho":"6º Pelotão - PCS","dataNasc":"1981-09-29","cpf":"821.922.515-72","rg":"0973220678","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"999658950","tipoSang":"A positivo","email":"teusdepa@hotmail.com","endereco":"Avenida Geraldo Vaz Ferreira, 827, Loteamento Jardim Guanambara, Felícia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05736734280","categoriaCnh":"AB","validCnh":"2032-07-20","cargo":"STM","estadoCivil":"Casado(a)","naturalidade":"Poções-BA","pai":"Netario Gomes Souza","mae":"Wanith Alves de Oliveira Souza","filhos":"Sim","penultimaUnidade":"CPRSO","titulo":"0874 0041 0515","antiguidade":21,"nomePai":"Netario Gomes Souza","nomeMae":"Wanith Alves de Oliveira Souza","dataUltimaPromocao":"2023-12-21","classifBgo":"152"},{"id":89,"grau":"CB PM","nome":"Paulo Victor Ferreira de Oliveira","nomeGuerra":"Victor","matricula":"30.481.457-7","localTrabalho":"4º Pelotão","dataNasc":"1988-02-18","cpf":"022.821.855-10","rg":"1578112044","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Pós-graduação","ddd":"77","telefone":"988096494","tipoSang":"B positivo","email":"pvfoliveira@outlook.com","endereco":"Rua Doutor Sérgio Lamêgo, 312, Morada dos Pássaros I, Felícia, Vitória da Conquista-BA","observacao":"SAME","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Auxiliar do SAME","estadoCivil":"Casado(a)","naturalidade":"Itapetinga-BA","pai":"Nelson Alves de Oliveira Filho","mae":"Sirlei Ferreira de Oliveira","filhos":"Sim","penultimaUnidade":"CPRSO","titulo":"1152 0859 0531","antiguidade":23,"cnh":"04556256416","categoriaCnh":"AB","validCnh":"2033-09-12","nomePai":"Nelson Alves de Oliveira Filho","nomeMae":"Sirlei Ferreira de Oliveira","dataUltimaPromocao":"2024-07-25","classifBgo":"130"},{"id":90,"grau":"CB PM","nome":"Pedro Silva de Almeida","nomeGuerra":"Pedro","matricula":"30.511.491-2","localTrabalho":"5º Pelotão - PETO","dataNasc":"1977-09-13","cpf":"005.076.925-19","rg":"0834107759","admissao":"2010-05-24","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988131091","tipoSang":"AB negativo","email":"di_np_eu@hotmail.com","endereco":"Rua Caixias, 198, Bairro Cruzeiro, Vítória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05848167203","categoriaCnh":"AB","validCnh":"2033-09-01","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Feira de Santana-BA","pai":"Calixto Moreira de Almeida","mae":"Jerônima Ferreira  Silva","filhos":"Sim","penultimaUnidade":"19º BPM","titulo":"0865 9964 0507","antiguidade":41,"nomePai":"Calixto Moreira de Almeida","nomeMae":"Jerônima Ferreira  Silva","dataUltimaPromocao":"2025-09-26","classifBgo":"315"},{"id":91,"grau":"CB PM","nome":"Ranie Santos Bittencourt","nomeGuerra":"Ranie Bittencourt","matricula":"30.511.590-0","localTrabalho":"3º Pelotão","dataNasc":"1986-07-31","cpf":"022.531.915-23","rg":"091189130","admissao":"2010-05-24","planoSaude":"Planserv","grauInstrucao":"ENSINO MÉDIO COMPLETO","ddd":"77","telefone":"998705245","tipoSang":"A positivo","email":"ranierbenjamim@gmail.com","endereco":"Travessa Adelio Teixeira Sn, Candeias próximo a 77°Cipm, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"","estadoCivil":"Casado(a)","naturalidade":"Salvador-BA","pai":"Haroldo Oliveira Bittencourt","mae":"Rosimeire Santos Bittencourt","filhos":"Sim","penultimaUnidade":"BEPE","titulo":"1062 5958 0507","antiguidade":39,"cnh":"03867795957","categoriaCnh":"AB","validCnh":"2033-06-07","nomePai":"Haroldo Oliveira Bittencourt","nomeMae":"Rosimeire Santos Bittencourt","dataUltimaPromocao":"2025-09-26","classifBgo":"218"},{"id":92,"grau":"CB PM","nome":"Rodrigo Vieira Peixoto","nomeGuerra":"Rodrigo Peixoto","matricula":"30.479.090-1","localTrabalho":"6º Pelotão - PCS","dataNasc":"1981-11-26","cpf":"007.817.925-41","rg":"0791389774","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988247070","tipoSang":"O positivo","email":"digovp03@hotmail.com","endereco":"Rua Ulisses do Prado Nogueira, 255, AP 01, Felicia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"03233668300","categoriaCnh":"AB","validCnh":"2033-09-05","cargo":"Sala de Meios da Sede","estadoCivil":"Solteiro(a)","naturalidade":"Jequie-BA","pai":"Edelval Rodrigues Peixoto","mae":"Marilena Vieira Peixoto","filhos":"Sim","penultimaUnidade":"8ª CIPM","titulo":"0989 2475 0531","antiguidade":20,"nomePai":"Edelval Rodrigues Peixoto","nomeMae":"Marilena Vieira Peixoto","dataUltimaPromocao":"2023-12-21","classifBgo":"138"},{"id":93,"grau":"CB PM","nome":"Rogerio dos Santos Teixeira","nomeGuerra":"Rogerio Teixeira","matricula":"30.505.940-5","localTrabalho":"6º Pelotão - PCS","dataNasc":"1985-10-31","cpf":"327.643.968-99","rg":"1414272995","admissao":"2009-12-21","planoSaude":"Unimed","grauInstrucao":"Médio","ddd":"77","telefone":"988458480","tipoSang":"O positivo","email":"roge.sdmilitar@gmail.com","endereco":"3ª Avenida Boa Vista, 23, Bela Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Sala de Meios da Sede","estadoCivil":"Casado(a)","naturalidade":"Sao Paulo-SP","pai":"Josme Moreno Teixeira","mae":"Adira Soares dos Santos","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1062 6589 0507","antiguidade":30,"cnh":"03380031276","categoriaCnh":"AB","validCnh":"2026-02-07","nomePai":"Josme Moreno Teixeira","nomeMae":"Adira Soares dos Santos","dataUltimaPromocao":"2025-05-09","classifBgo":"67"},{"id":94,"grau":"CB PM","nome":"Tyrone Sousa Santos","nomeGuerra":"Tyrone","matricula":"30.507.510-0","localTrabalho":"2º Pelotão","dataNasc":"1991-02-03","cpf":"053.788.375-45","rg":"1175472808","admissao":"2009-12-21","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988025891","tipoSang":"O negativo","email":"tyronesousa@gmail.com","endereco":"Avenida Maceió, 827, AP 102, Brasil, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05475743497","categoriaCnh":"AB","validCnh":"2035-10-29","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista","pai":"Jesuito Silva Santos","mae":"Helenira Sousa Santos","filhos":"Sim","penultimaUnidade":"17º BPM","titulo":"1349 5076 0531","antiguidade":34,"nomePai":"Jesuito Silva Santos","nomeMae":"Helenira Sousa Santos","dataUltimaPromocao":"2025-07-18","classifBgo":"170"},{"id":95,"grau":"CB PM","nome":"Warley Farias Souza","nomeGuerra":"Farias","matricula":"30.481.476-3","localTrabalho":"4º Pelotão","dataNasc":"1985-11-07","cpf":"O24.927.775-10","rg":"1190251167","admissao":"2008-04-07","planoSaude":"Unimed","grauInstrucao":"Superior","ddd":"77","telefone":"991848363","tipoSang":"A negativo","email":"wsfarias133@gmail.com","endereco":"Rua , 04, Loteamento Leblon, Jurema, Vitória da Conquista-BA","observacao":"Polícia em Treino/CEVAP","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Polícia em Treino","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Edmilson dos Santos Souza","mae":"Maria do Socorro Farias Souza","filhos":"Sim","penultimaUnidade":"","titulo":"1107 8004 0531","antiguidade":18,"cnh":"05596619509","categoriaCnh":"AB","validCnh":"2033-05-16","nomePai":"Edmilson dos Santos Souza","nomeMae":"Maria do Socorro Farias Souza","dataUltimaPromocao":"2023-09-22","classifBgo":"409"},{"id":96,"grau":"CB PM","nome":"William Andrade Santos","nomeGuerra":"Andrade","matricula":"30.505.955-2","localTrabalho":"2º Pelotão","dataNasc":"1985-06-12","cpf":"020.118.975-56","rg":"994631308","admissao":"2009-12-21","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"998383323","tipoSang":"O positivo","email":"wandrade.william@gmail.com","endereco":"Rua,C,112, Loteamento Porto seguro,Boa Vista, Vitória da Conquista-Ba","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitoria da Conquista-Ba","pai":"Wilton Andrade Santos","mae":"Nailza Maria Santos","filhos":"Sim","penultimaUnidade":"CIPE-SUDOESTE","titulo":"1130 1601 0582","antiguidade":26,"cnh":"03279696562","categoriaCnh":"AD","validCnh":"2034-01-18","nomePai":"Wilton Andrade Santos","nomeMae":"Nailza Maria Santos","dataUltimaPromocao":"2024-11-08","classifBgo":"103"},{"id":97,"grau":"AL CB PM","nome":"Yolando Costa Correia Junior","nomeGuerra":"Yolando","matricula":"30.506.813-7","localTrabalho":"3º Pelotão","dataNasc":"1979-03-11","cpf":"992.188.445-04","rg":"765629569","admissao":"2009-12-21","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"75","telefone":"75991992284","tipoSang":"O positivo","email":"correiajunior32@hotmail.com","endereco":"Rua Antônio Cavalcante, Condomínio Dom Residence, Bloco 19, Apto 101, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"01158890010","categoriaCnh":"AB","validCnh":"2032-09-06","cargo":"Guarda da Rodoviária","estadoCivil":"Solteiro(a)","naturalidade":"Feira de Santana-BA","pai":"Yolando Costa Correia","mae":"Vera Lige dos Reis Correia","filhos":"Sim","penultimaUnidade":"78ª CIPM","titulo":"0914 1048 0239","antiguidade":1,"nomePai":"Yolando Costa Correia","nomeMae":"Vera Lige dos Reis Correia","dataUltimaPromocao":"2010-09-16","classifBgo":"544"},{"id":98,"grau":"Sd 1ª CL PM","nome":"Adriano Santos Silva","nomeGuerra":"Adriano","matricula":"30.643.032-9","localTrabalho":"5º Pelotão - PETO","dataNasc":"1993-01-21","cpf":"059.792.475-99","rg":"2004097868","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988474543","tipoSang":"O positivo","email":"adrianosilvagepm@gmail.com","endereco":"Rua P, 32, Morada dos Passaros III, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05285459881","categoriaCnh":"AD","validCnh":"2034-03-15","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Gilberto Vieira da Silva","mae":"Helena Alves Santos","filhos":"Não","penultimaUnidade":"46ª CIPM","titulo":"1518 8417 0507","antiguidade":70,"nomePai":"Gilberto Vieira da Silva","nomeMae":"Helena Alves Santos","dataUltimaPromocao":"2019-01-25","classifBgo":"1067"},{"id":99,"grau":"Sd 1ª CL PM","nome":"Alessandra Teixeira dos Santos","nomeGuerra":"Alessandra","matricula":"30.601.040-4","localTrabalho":"3º Pelotão","dataNasc":"1984-06-13","cpf":"028.401.105-39","rg":"0980002923","admissao":"2016-05-16","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991125276","tipoSang":"O positivo","email":"halessandra.teixeira.at@gmail.com","endereco":"Rua E, 20-A, Bateias, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Guarda do Fisco","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Joel Abade dos Santos","mae":"Sônia Teixeira dos Santos","filhos":"Sim","penultimaUnidade":"CPRSO","titulo":"1130 1416 0531","antiguidade":59,"cnh":"06473024594","categoriaCnh":"B","validCnh":"2031-07-26","nomePai":"Joel Abade dos Santos","nomeMae":"Sônia Teixeira dos Santos","dataUltimaPromocao":"2017-01-27","classifBgo":"4"},{"id":100,"grau":"Sd 1ª CL PM","nome":"Alexandre Mendes Araujo","nomeGuerra":"Alexandre Mendes","matricula":"30.583.435-0","localTrabalho":"SOINT","dataNasc":"1985-05-03","cpf":"022.258.695-88","rg":"0946114080","admissao":"2015-05-11","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988266626","tipoSang":"B positivo","email":"xandal09@hotmail.com","endereco":"Rua I, Quadra 07, Lote 17, Loteamento Bosque dos Flamboyants, Primavera, Vitória da Conquista-BA","observacao":"LICENÇA-PRÊMIO / 01-30/04","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"04192209962","categoriaCnh":"AB","validCnh":"2032-08-10","cargo":"Agente","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Edmundo Nunes Araújo","mae":"Elza Maria Mendes Araújo","filhos":"Sim","penultimaUnidade":"34ª CIPM","titulo":"1062 0147 0566","antiguidade":52,"nomePai":"Edmundo Nunes Araújo","nomeMae":"Elza Maria Mendes Araújo","dataUltimaPromocao":"2016-02-19","classifBgo":"373"},{"id":101,"grau":"Sd 1ª CL PM","nome":"Alexsandro Freire Gomes","nomeGuerra":"Freire","matricula":"30643410","localTrabalho":"Outros","dataNasc":"1990-08-08","cpf":"046.696.885-02","rg":"1308143931","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988470777","tipoSang":"O negativo","email":"alexsandrofreire93@gmail.com","endereco":"Avenida Barreiras, 2738, Brasil, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"04941954180","categoriaCnh":"AB","validCnh":"2034-07-19","cargo":"Motorista do Comandante","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Agnaldo dos Santos Gomes","mae":"Cleusa Rosa Freire Gomes","filhos":"Sim","penultimaUnidade":"Cipe Sudoeste","titulo":"1385 1231 0507","antiguidade":71,"nomePai":"Agnaldo dos Santos Gomes","nomeMae":"Cleusa Rosa Freire Gomes","dataUltimaPromocao":"2019-01-25","classifBgo":"1082"},{"id":102,"grau":"Sd 1ª CL PM","nome":"Alison Ivens Oliveira de Brito","nomeGuerra":"Ivens","matricula":"92137041","localTrabalho":"Sem local","dataNasc":"2001-09-15","cpf":"026.009.655-56","rg":"1407120034","admissao":"2024-11-25","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988515741","tipoSang":"O positivo","email":"alissonivensii@gmail.com","endereco":"Avenida Claudia Botelho, 1, Condominio Mirante Cidade, Bloco 7, Apto 203, Primavera, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"07515654047","categoriaCnh":"AB","validCnh":"2034-10-28","cargo":"Sem função","estadoCivil":"Solteiro(a)","naturalidade":"Jequié-BA","pai":"Ivan Brito de França","mae":"Alice de Souza Oliveira","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1660 8475 0515","antiguidade":97,"nomePai":"Ivan Brito de França","nomeMae":"Alice de Souza Oliveira","dataUltimaPromocao":"2025-12-05","classifBgo":"768"},{"id":103,"grau":"Sd 1ª CL PM","nome":"Augusto Soares Novais","nomeGuerra":"Novais","matricula":"92137093","localTrabalho":"Sem local","dataNasc":"1994-09-10","cpf":"061.404.355-79","rg":"1299627838","admissao":"2024-11-25","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"998706529","tipoSang":"A positivo","email":"augustosoaresnovais@gmail.com","endereco":"Travessa da Conquista, 70B, Simão, Vitoria da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05683635341","categoriaCnh":"B","validCnh":"2032-08-25","cargo":"Sem função","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Otavio Santos Novais","mae":"Gicelia Soares Novais","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1423 8417 0582","antiguidade":98,"nomePai":"Otavio Santos Novais","nomeMae":"Gicelia Soares Novais","dataUltimaPromocao":"2025-12-05","classifBgo":"812"},{"id":104,"grau":"Sd 1ª CL PM","nome":"Blenda Lorrane Almeida Fernandes","nomeGuerra":"Lorrane","matricula":"92110362","localTrabalho":"4º Pelotão","dataNasc":"1998-01-06","cpf":"081.884.195-83","rg":"1522918906","admissao":"2023-12-26","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"981217334","tipoSang":"O positivo","email":"blendalorrane57@gmail.com","endereco":"Avenida Gilenilda Alves, 700, Residencial Dona Gilenilda, Bloco 23, Apto 02, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Apresentado ao CPRSO","estadoCivil":"Casado(a)","naturalidade":"Vitória Da Conquista_BA","pai":"Janilton Fernandes Souza","mae":"Cristiane Almeida Fernandes","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1563 7777 0523","antiguidade":90,"cnh":"08198628571","categoriaCnh":"AB","validCnh":"2033-04-11","nomePai":"Janilton Fernandes Souza","nomeMae":"Cristiane Almeida Fernandes","dataUltimaPromocao":"2024-12-20","classifBgo":"702"},{"id":105,"grau":"Sd 1ª CL PM","nome":"Bruna dos Santos Caja","nomeGuerra":"Bruna Caja","matricula":"92069885","localTrabalho":"SPO","dataNasc":"1998-07-28","cpf":"067.290.795-09","rg":"1357324685","admissao":"2022-05-11","planoSaude":"Unimed","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988311638","tipoSang":"B negativo","email":"brunacaja@gmail.com","endereco":"Rua Poções, 154, Patagônia, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cnh":"07273963331","categoriaCnh":"AB","validCnh":"2034-06-11","cargo":"Auxiliar da SPO","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Antônio Marcos Caja dos Santos","mae":"Maria de Brotas dos Santos Pereira","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1545 6187 0582","antiguidade":86,"nomePai":"Antônio Marcos Caja dos Santos","nomeMae":"Maria de Brotas dos Santos Pereira","dataUltimaPromocao":"2023-03-31","classifBgo":"405"},{"id":106,"grau":"Sd 1ª CL PM","nome":"Bruno Moura Almeida","nomeGuerra":"Bruno Moura","matricula":"30.643.441-2","localTrabalho":"5º Pelotão - PETO","dataNasc":"1993-04-13","cpf":"059.759.815-06","rg":"1286146763","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988117013","tipoSang":"O negativo","email":"brunomouraalmeida7013@gmail.com","endereco":"Rua Ibiassucê, 400, Kadija, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05830563707","categoriaCnh":"AB","validCnh":"2034-09-13","cargo":"Patrulheiro/Motociclista","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Aldo Nascimento Almeida","mae":"Rosana Santos Moura","filhos":"Não","penultimaUnidade":"34ª CIPM","titulo":"1449 4712 0590","antiguidade":74,"nomePai":"Aldo Nascimento Almeida","nomeMae":"Rosana Santos Moura","dataUltimaPromocao":"2019-01-25","classifBgo":"1496"},{"id":107,"grau":"Sd 1ª CL PM","nome":"Caio Cesar Alves Gusmao","nomeGuerra":"Caio Cesar","matricula":"30.526.042-0","localTrabalho":"3º Pelotão","dataNasc":"1991-01-01","cpf":"839.831.715-91","rg":"1307788777","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988758954","tipoSang":"A positivo","email":"caiocealgu@gmail.com","endereco":"Avenida Chiara Lubich, 555, Condomínio Residencial Provence, Bloco 13, Apto 103, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05027924717","categoriaCnh":"B","validCnh":"2031-05-12","cargo":"Guarda da Rodoviária","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Juracy Alves Teixeira","mae":"Jane Luce Miranda Gusmao","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1323 8397 0574","antiguidade":18,"nomePai":"Juracy Alves Teixeira","nomeMae":"Jane Luce Miranda Gusmao","dataUltimaPromocao":"2012-04-25","classifBgo":"235"},{"id":108,"grau":"Sd 1ª CL PM","nome":"Carolina Brito Souza","nomeGuerra":"Carolina","matricula":"92137045","localTrabalho":"Sem local","dataNasc":"1998-02-20","cpf":"065.424.295-06","rg":"1205297006","admissao":"2024-11-25","planoSaude":"Planserv","grauInstrucao":"Mestrado","ddd":"77","telefone":"981048488","tipoSang":"O positivo","email":"carolbritos10@gmail.com","endereco":"Rua G, 235, Morada dos Pássaros I, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Sem função","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Júlio Pereira Sousa Neto","mae":"Marta Maria Brito Souza","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1547 4427 0515","antiguidade":99,"cnh":"07039587781","categoriaCnh":"AB","validCnh":"2032-03-07","nomePai":"Júlio Pereira Sousa Neto","nomeMae":"Marta Maria Brito Souza","dataUltimaPromocao":"2025-12-05","classifBgo":"818"},{"id":109,"grau":"Sd 1ª CL PM","nome":"Carlos Eduardo Carvalho Oliveira","nomeGuerra":"Carlos Eduardo","matricula":"92081598","localTrabalho":"1º Pelotão","dataNasc":"1999-10-16","cpf":"862.300.095-10","rg":"2001194510","admissao":"2022-08-08","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988520722","tipoSang":"O negativo","email":"carloseduardo8835@gmail.com","endereco":"Via Local K, 43, Urbis V, Zabelê, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"07027784758","categoriaCnh":"AB","validCnh":"2033-10-31","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Joao Raimundo Ribeiro Oliveira","mae":"Patrícia Sessulina Carvalho Oliveira","filhos":"Não","penultimaUnidade":"CFAP","titulo":"1564 2424 0507","antiguidade":88,"nomePai":"Joao Raimundo Ribeiro Oliveira","nomeMae":"Patrícia Sessulina Carvalho Oliveira","dataUltimaPromocao":"2023-07-21","classifBgo":"5"},{"id":110,"grau":"Sd 1ª CL PM","nome":"Daniela de Lourdes Monteiro","nomeGuerra":"Daniela","matricula":"30.653.794-3","localTrabalho":"Subcomando","dataNasc":"1988-05-04","cpf":"088.865.906-79","rg":"2269516184","admissao":"2018-08-21","planoSaude":"Unimed","grauInstrucao":"Superior","ddd":"27","telefone":"27997590519","tipoSang":"A positivo","email":"monteirodani@live.com","endereco":"Avenida Brasil, 1294, Residecial Luan Melo, Apto 201, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Auxiliar do Subcomando","estadoCivil":"Casado(a)","naturalidade":"Caratinga-MG","pai":"Joao Batista Monteiro","mae":"Maria de Lourdes da Cruz Monteiro","filhos":"Sim","penultimaUnidade":"17º BPM","titulo":"1685 2001 0205","antiguidade":78,"cnh":"04157735633","categoriaCnh":"B","validCnh":"2022-07-10","nomePai":"Joao Batista Monteiro","nomeMae":"Maria de Lourdes da Cruz Monteiro","dataUltimaPromocao":"2019-05-31","classifBgo":"64"},{"id":111,"grau":"Sd 1ª CL PM","nome":"Debora Batista Dutra Rodrigues","nomeGuerra":"Dutra","matricula":"92047852","localTrabalho":"6º Pelotão - PCS","dataNasc":"2000-04-02","cpf":"088.894.995-24","rg":"1519836740","admissao":"2021-07-05","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988047021","tipoSang":"O positivo","email":"bdebora337@gmail.com","endereco":"Rua TG Dezenove, 1195, Residencial Vila Bella, Casa 18, Espírito Santo, Vitória da Conquista-BA","observacao":"Auxiliar","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cnh":"07330441371","categoriaCnh":"B","validCnh":"2034-12-19","cargo":"Auxiliar do Almoxarifado","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Hermes Bastos Dutra","mae":"Rosilda Batista Sousa","filhos":"Sim","penultimaUnidade":"8ª CIPM","titulo":"1584 6338 0523","antiguidade":83,"nomePai":"Hermes Bastos Dutra","nomeMae":"Rosilda Batista Sousa","dataUltimaPromocao":"2022-04-29","classifBgo":"362"},{"id":112,"grau":"Sd 1ª CL PM","nome":"Diego Santos Freitas","nomeGuerra":"Freitas","matricula":"30586823","localTrabalho":"Sem local","dataNasc":"1992-02-25","cpf":"047.981.975-05","rg":"1202908985","admissao":"2015-06-19","planoSaude":"Planserv","grauInstrucao":"Pós-graduação","ddd":"77","telefone":"999222712","tipoSang":"A positivo","email":"diegofreitas@outlook.com","endereco":"Rua Abimael Andrade Matos, 275, Condomínio Parque Vitória Sul, Bloco 05, Apto 504, Felicia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Ilhéus-BA","pai":"Josenildo Freitas Nascimento","mae":"Marli Matos dos Santos","filhos":"Não","penultimaUnidade":"78ª CIPM","titulo":"1348 3342 0523","antiguidade":57,"cnh":"05052646187","categoriaCnh":"AB","validCnh":"2033-10-10","nomePai":"Josenildo Freitas Nascimento","nomeMae":"Marli Matos dos Santos","dataUltimaPromocao":"2016-04-01","classifBgo":"815"},{"id":113,"grau":"Sd 1ª CL PM","nome":"Diego Sousa Dantas","nomeGuerra":"Diego Dantas","matricula":"30.586.826-0","localTrabalho":"3º Pelotão","dataNasc":"1986-07-14","cpf":"021.562.995-79","rg":"0971064610","admissao":"2015-06-19","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988039981","tipoSang":"O negativo","email":"diegodantas.86.dd@gmail.com","endereco":"Rua F, 60, Morada Real 2ª Etapa, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Guarda do Fisco","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Jorge Dantas dos Santos","mae":"Maria das Graças de Jesus Sousa","filhos":"Não","penultimaUnidade":"8ª CIPM","titulo":"1130 3985 0590","antiguidade":55,"cnh":"03741929414","categoriaCnh":"AB","validCnh":"2035-02-18","nomePai":"Jorge Dantas dos Santos","nomeMae":"Maria das Graças de Jesus Sousa","dataUltimaPromocao":"2016-04-01","classifBgo":"612"},{"id":114,"grau":"Sd 1ª CL PM","nome":"Edjefeson Souza Torquato","nomeGuerra":"Torquato","matricula":"30.583.640-9","localTrabalho":"5º Pelotão - PETO","dataNasc":"1985-06-30","cpf":"021.949.875-09","rg":"1132361826","admissao":"2015-05-11","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"981520200","tipoSang":"A positivo","email":"gel1torquato@gmail.com","endereco":"Camino 22, Casa 01, URBIS V, Zabelê, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"03689750600","categoriaCnh":"AD","validCnh":"2035-11-10","cargo":"Comandante/Motociclista","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Edvando Santos Torquato","mae":"Vilma Lopes de Souza Torquato","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1061 9918 0582","antiguidade":50,"nomePai":"Edvando Santos Torquato","nomeMae":"Vilma Lopes de Souza Torquato","dataUltimaPromocao":"2016-02-19","classifBgo":"196"},{"id":115,"grau":"Sd 1ª CL PM","nome":"Edrei Almeida Sousa","nomeGuerra":"Edrei","matricula":"30.643.642-2","localTrabalho":"5º Pelotão - PETO","dataNasc":"1998-08-06","cpf":"080.114.485-01","rg":"1546439471","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"998439874","tipoSang":"A positivo","email":"edreisouza@outlook.com","endereco":"Rua Cegonha, 13, Bateias II, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"06860932801","categoriaCnh":"AB","validCnh":"2034-12-17","cargo":"Patrulheiro","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Luis Humberto Jesus Sousa","mae":"Rozana Almeida Sousa","filhos":"Não","penultimaUnidade":"17º BPM","titulo":"1545 6086 0531","antiguidade":76,"nomePai":"Luis Humberto Jesus Sousa","nomeMae":"Rozana Almeida Sousa","dataUltimaPromocao":"2019-01-25","classifBgo":"1902"},{"id":116,"grau":"Sd 1ª CL PM","nome":"Eliane de Jesus Brito Ferraz","nomeGuerra":"Eliane","matricula":"30.643.688-8","localTrabalho":"BCS","dataNasc":"1988-12-10","cpf":"034.096.965-20","rg":"1395862885","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Mestrado","ddd":"77","telefone":"999055478","tipoSang":"A negativo","email":"eliannejb@hotmail.com","endereco":"Avenida Larissa Cavalcante, 145, Dom Residencial, Bloco 10, Apto 105, Boa Vista, Vitória da Conquista","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"VItória da Conquista-BA","pai":"Aurielio Fernandes Brito","mae":"Eliene de Jesus Brito","filhos":"Não","penultimaUnidade":"8ª CIPM","titulo":"1201 6701 0582","antiguidade":63,"cnh":"06679183906","categoriaCnh":"B","validCnh":"2032-03-13","nomePai":"Aurielio Fernandes Brito","nomeMae":"Eliene de Jesus Brito","dataUltimaPromocao":"2019-01-25","classifBgo":"31"},{"id":117,"grau":"Sd 1ª CL PM","nome":"Elton Novaes Souza","nomeGuerra":"Elton Novaes","matricula":"30.564.279-5","localTrabalho":"SPO","dataNasc":"1986-06-30","cpf":"014.670.565-37","rg":"1191250210","admissao":"2014-01-06","planoSaude":"Unimed","grauInstrucao":"Pós-graduação","ddd":"77","telefone":"988025525","tipoSang":"O positivo","email":"eltinho.tinho@hotmail.com","endereco":"Avenida Pelotas, 687, Patagônia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"03520583774","categoriaCnh":"AB","validCnh":"2034-07-17","cargo":"Auxiliar da SPO","estadoCivil":"Casado(a)","naturalidade":"Jequie-BA","pai":"elio Barros de Souza","mae":"Rita de Cassia Novaes Souza","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1107 3995 0574","antiguidade":43,"nomePai":"elio Barros de Souza","nomeMae":"Rita de Cassia Novaes Souza","dataUltimaPromocao":"2014-09-19","classifBgo":"152"},{"id":118,"grau":"Sd 1ª CL PM","nome":"Eron Marques Pereira da Silva","nomeGuerra":"Eron","matricula":"30.653.702-4","localTrabalho":"1º Pelotão","dataNasc":"1997-07-15","cpf":"072.043.685-09","rg":"1544330120","admissao":"2018-08-21","planoSaude":"Unimed","grauInstrucao":"Médio","ddd":"77","telefone":"988395577","tipoSang":"O positivo","email":"eronmp21@gmail.com","endereco":"Rua Rio Grande do Sul, 911, Patagônia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"06884561476","categoriaCnh":"AB","validCnh":"2033-03-13","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Eli Lopes da Silva","mae":"Marlene Marques da Silva","filhos":"Não","penultimaUnidade":"94ª CIPM","titulo":"1529 0185 0507","antiguidade":80,"nomePai":"Eli Lopes da Silva","nomeMae":"Marlene Marques da Silva","dataUltimaPromocao":"2019-05-31","classifBgo":"221"},{"id":119,"grau":"Sd 1ª CL PM","nome":"Fabricia Louyse Santos Sousa","nomeGuerra":"Louyse","matricula":"92110401","localTrabalho":"2º Pelotão","dataNasc":"1994-02-15","cpf":"061.756.505-81","rg":"1273698568","admissao":"2023-12-26","planoSaude":"Unimed e Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991153740","tipoSang":"O positivo","email":"fabilouyse@gmail.com","endereco":"Avenida Paulo Filadelfo, 1295, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cnh":"02159684560","categoriaCnh":"AB","validCnh":"2032-04-03","cargo":"Patrulheira","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista BA","pai":"Fabio Luciano Oliveira Sousa","mae":"Luiza Vilma Sousa Santos","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1415 7686 0531","antiguidade":91,"nomePai":"Fabio Luciano Oliveira Sousa","nomeMae":"Luiza Vilma Sousa Santos","dataUltimaPromocao":"2024-12-20","classifBgo":"758"},{"id":120,"grau":"Sd 1ª CL PM","nome":"Felipe George de Souza Mineo","nomeGuerra":"Mineo","matricula":"92069968","localTrabalho":"5º Pelotão - PETO","dataNasc":"1994-10-03","cpf":"027.499.975-77","rg":"1515503257","admissao":"2022-05-11","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"981574174","tipoSang":"O positivo","email":"felipe.dangelomineo@gmail.com","endereco":"Rua Chico Mendes, 21, Boa vista, Vitória da Conquista -Ba","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"06596222426","categoriaCnh":"AB","validCnh":"2035-07-10","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Iguape-SP","pai":"Celso Minêo","mae":"Marcia Cristina de Souza","filhos":"Sim","penultimaUnidade":"24º BPM","titulo":"1415 8007 0507","antiguidade":87,"nomePai":"Celso Minêo","nomeMae":"Marcia Cristina de Souza","dataUltimaPromocao":"2023-03-31","classifBgo":"965"},{"id":121,"grau":"Sd 1ª CL PM","nome":"Francois Assis Macedo Lopes Junior","nomeGuerra":"Lopes","matricula":"30.526.130-3","localTrabalho":"3º Pelotão","dataNasc":"1988-07-22","cpf":"033.000.755-64","rg":"1206066156","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991514232","tipoSang":"B positivo","email":"lopaopm@gmail.com","endereco":"Rua Manoel Beckman, 22, Loteamento Vila America, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Guarda da Rodoviária","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Francois Assis Macedo Lopes","mae":"Ione de Oliveira Constâncio","filhos":"Sim","penultimaUnidade":"34ª CIPM","titulo":"1034 5204 0515","antiguidade":23,"nomePai":"Francois Assis Macedo Lopes","nomeMae":"Ione de Oliveira Constâncio","dataUltimaPromocao":"2012-04-25","classifBgo":"319"},{"id":122,"grau":"Sd 1ª CL PM","nome":"Francisco de Jesus Costa Andrade","nomeGuerra":"Jesus Costa","matricula":"92110576","localTrabalho":"5º Pelotão - PETO","dataNasc":"1996-07-14","cpf":"067.127.615-81","rg":"1503496295","admissao":"2023-12-26","planoSaude":"Planserv","grauInstrucao":"ENSINO MÉDIO COMPLETO","ddd":"77","telefone":"998689980","tipoSang":"A positivo","email":"franciscocosta852@gmail.com","endereco":"Rua Deodoro da Fonseca, 230, Iracema, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"06571960966","categoriaCnh":"AB","validCnh":"2035-02-26","cargo":"Patrulheiro/Motociclista","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista BA","pai":"Francisco de costa Neto","mae":"Euzinelia pereira de jesus","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1476 3320 0566","antiguidade":93,"nomePai":"Francisco de costa Neto","nomeMae":"Euzinelia pereira de jesus","dataUltimaPromocao":"2024-12-20","classifBgo":"1144"},{"id":123,"grau":"Sd 1ª CL PM","nome":"Gabriel Magno de Oliveira Silva","nomeGuerra":"Magno","matricula":"92137086","localTrabalho":"Sem local","dataNasc":"1999-05-18","cpf":"034.077.365-09","rg":"1176741926","admissao":"2024-11-25","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"998551999","tipoSang":"O negativo","email":"gabriel201019@hotmail.com","endereco":"Avenida Chiara Lubich, Residencial Provence, Bloco 03, Apto 201, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"07715727856","categoriaCnh":"AB","validCnh":"2036-01-13","cargo":"Sem função","estadoCivil":"Solteiro(a)","naturalidade":"Salvador-BA","pai":"Alex Magno Silveira da Silva","mae":"Gislane de Oliveira Silva","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1585 5668 0523","antiguidade":102,"nomePai":"Alex Magno Silveira da Silva","nomeMae":"Gislane de Oliveira Silva","dataUltimaPromocao":"2025-12-05","classifBgo":"1054"},{"id":124,"grau":"Sd 1ª CL PM","nome":"Geisa Santos Araujo","nomeGuerra":"Geisa","matricula":"30.526.147-6","localTrabalho":"4º Pelotão","dataNasc":"1983-10-08","cpf":"012.632.655-02","rg":"0843379588","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988215472","tipoSang":"O positivo","email":"geuaraujo8@bol.com.br","endereco":"Rua A, 415, Condomínio Candeias Premium, Torre Light, Apto 005, Candeias, Vitória da Conquista-BA","observacao":"Ronda Maria da Penha.","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Ronda Maria da Penha","estadoCivil":"Solteiro(a)","naturalidade":"Jequie-BA","pai":"Amilton Santos de Araújo","mae":"Jacira Santos Araújo","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1058 6974 0507","antiguidade":8,"cnh":"04516512974","categoriaCnh":"AB","validCnh":"2033-04-20","nomePai":"Amilton Santos de Araújo","nomeMae":"Jacira Santos Araújo","dataUltimaPromocao":"2012-04-25","classifBgo":"174"},{"id":125,"grau":"Sd 1ª CL PM","nome":"Givanildo Leite de Andrade","nomeGuerra":"Leite","matricula":"30.526.234-1","localTrabalho":"6º Pelotão - PCS","dataNasc":"1983-11-15","cpf":"821.856.035-15","rg":"0887219063","admissao":"2011-08-02","planoSaude":"Bradesco","grauInstrucao":"Superior","ddd":"77","telefone":"988155849","tipoSang":"A positivo","email":"givanildo.andrade@hotmail.com","endereco":"Rua Cardena Oliveira,430, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"STM","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Joaquim Tavares de Andrade","mae":"Avany Leite de Andrade","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1012 4376 0566","antiguidade":9,"cnh":"03729317490","categoriaCnh":"AB","validCnh":"2031-05-02","nomePai":"Joaquim Tavares de Andrade","nomeMae":"Avany Leite de Andrade","dataUltimaPromocao":"2012-04-25","classifBgo":"188"},{"id":126,"grau":"Sd 1ª CL PM","nome":"Hellen Mayara Freitas Gusmao","nomeGuerra":"Mayara","matricula":"30.643.915-3","localTrabalho":"SSO","dataNasc":"1989-08-27","cpf":"037.535.275-99","rg":"1017228183","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"999274416","tipoSang":"O positivo","email":"mayara.gusmao@pm.ba.gov.br","endereco":"Avenida José Fernandes Pedral Sampaio, 2695, Condomínio Jardim Pamplona, Casa 167, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cnh":"05552550402","categoriaCnh":"AB","validCnh":"2033-05-18","cargo":"Auxiliar da SSO","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"José Moura Gusmão","mae":"Itana Mara Freitas Gusmão","filhos":"Sim","penultimaUnidade":"8ª CIPM","titulo":"1271 8978 0558","antiguidade":65,"nomePai":"José Moura Gusmão","nomeMae":"Itana Mara Freitas Gusmão","dataUltimaPromocao":"2019-01-25","classifBgo":"687"},{"id":127,"grau":"Sd 1ª CL PM","nome":"Helton Ferreira Gomes","nomeGuerra":"Helton Gomes","matricula":"30.526.160-4","localTrabalho":"5º Pelotão - PETO","dataNasc":"1982-05-15","cpf":"295.621.468-39","rg":"2006557521","admissao":"2011-08-02","planoSaude":"Unimed","grauInstrucao":"Superior","ddd":"77","telefone":"991501027","tipoSang":"O positivo","email":"sd_gomespmba@hotmail.com","endereco":"Avenida B, 95, Condomínio Vog Primavera, Quadra G Casa 41, Bairro Primavera, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"02243658365","categoriaCnh":"B","validCnh":"2032-02-03","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Sao Paulo-SP","pai":"Deli Ferreira Gomes","mae":"Irene dos Santos Gomes","filhos":"Sim","penultimaUnidade":"BCS","titulo":"2691 3161 0124","antiguidade":17,"nomePai":"Deli Ferreira Gomes","nomeMae":"Irene dos Santos Gomes","dataUltimaPromocao":"2012-04-25","classifBgo":"231"},{"id":128,"grau":"Sd 1ª CL PM","nome":"Humberto Mendes Ribeiro","nomeGuerra":"Mendes","matricula":"30.526.187-4","localTrabalho":"3º Pelotão","dataNasc":"1985-06-01","cpf":"018.799.705-54","rg":"1004120508","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"73991611195","tipoSang":"AB positivo","email":"63mendes@gmail.com","endereco":"Avenida Lomanto Júnior, 345, Centro, Jequie-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Guarda do Fisco","estadoCivil":"Casado(a)","naturalidade":"Jequie-BA","pai":"Joao Duarte Lima","mae":"Maria Dinora Mendes Ribeiro","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1060 3563 0507","antiguidade":31,"nomePai":"Joao Duarte Lima","nomeMae":"Maria Dinora Mendes Ribeiro","dataUltimaPromocao":"2012-04-25","classifBgo":"550"},{"id":129,"grau":"Sd 1ª CL PM","nome":"Iago Santos Lopes","nomeGuerra":"Santos Lopes","matricula":"30.645.395-3","localTrabalho":"5º Pelotão - PETO","dataNasc":"1992-05-23","cpf":"055.752.995-62","rg":"1445701812","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"71","telefone":"71992696611","tipoSang":"O negativo","email":"iagolopes371@gmail.com","endereco":"Rua Joaquim dos Reis, 555, Condomínio Riverside, Bloco 10, Apto 101, Felicia, Vitória da Conquista-BA.","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05518826398","categoriaCnh":"AB","validCnh":"2032-09-15","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"VItória da Conquista-BA","pai":"Marcelo Cabral lopes","mae":"Neusa Santos lopes","filhos":"Não","penultimaUnidade":"49ªCIPM","titulo":"1402 3529 0590","antiguidade":73,"nomePai":"Marcelo Cabral lopes","nomeMae":"Neusa Santos lopes","dataUltimaPromocao":"2019-01-25","classifBgo":"1445"},{"id":130,"grau":"Sd 1ª CL PM","nome":"Iasmine Menezes Passinho","nomeGuerra":"Iasmine","matricula":"92038241","localTrabalho":"4º Pelotão","dataNasc":"1991-09-01","cpf":"037.574.145-35","rg":"1465636544","admissao":"2020-09-28","planoSaude":"Cassi","grauInstrucao":"Superior","ddd":"73","telefone":"73991155148","tipoSang":"A positivo","email":"iasmine4@hotmail.com","endereco":"Avenida Ivo Freire de Aguiar, 891, Candeias, Vitória da Conquista-BA","observacao":"CEVAP","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"CEVAP","estadoCivil":"Casado(a)","naturalidade":"Salvador-BA","pai":"Lúcio Xavier Passinho Neto","mae":"Mônica Menezes Passinho","filhos":"Sim","penultimaUnidade":"CFAP","titulo":"1393 6213 0540","antiguidade":82,"cnh":"05534709164","categoriaCnh":"B","validCnh":"2022-06-13","nomePai":"Lúcio Xavier Passinho Neto","nomeMae":"Mônica Menezes Passinho","dataUltimaPromocao":"2021-07-20","classifBgo":"3"},{"id":131,"grau":"Sd 1ª CL PM","nome":"Indira Maria Castro Santos","nomeGuerra":"Indira","matricula":"30.643.964-0","localTrabalho":"4º Pelotão","dataNasc":"1987-08-15","cpf":"026.793.785-71","rg":"1310163189","admissao":"2018-03-27","planoSaude":"Amil","grauInstrucao":"Mestrado","ddd":"73","telefone":"73991518294","tipoSang":"B positivo","email":"indira_castro@hotmail.com","endereco":"Av Contorno Guanabara, 1011, Residencial Pituba, Bloco Aquarius, AP 101, Boa Vista, Vitória da Conquista-BA","observacao":"SAME","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"CEVAP","estadoCivil":"Solteiro(a)","naturalidade":"Ilheus-BA","pai":"Paulo Ubiran de Oliveira Santos","mae":"Yara Maria Castros dos Santos","filhos":"Não","penultimaUnidade":"55ª CIPM","titulo":"1207 8786 0558","antiguidade":68,"cnh":"05925051692","categoriaCnh":"AB","validCnh":"2023-02-26","nomePai":"Paulo Ubiran de Oliveira Santos","nomeMae":"Yara Maria Castros dos Santos","dataUltimaPromocao":"2019-01-25","classifBgo":"953"},{"id":132,"grau":"Sd 1ª CL PM","nome":"Isaac Rodrigues Santana","nomeGuerra":"Isaac","matricula":"30.562.879-1","localTrabalho":"1º Pelotão","dataNasc":"1987-09-20","cpf":"033.576.665-02","rg":"1281926310","admissao":"2014-01-06","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"999924544","tipoSang":"O positivo","email":"zackrsantana@gmail.com","endereco":"Rua Patativa, 276B, Bairro Felícia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Judicael Gusmao Santana","mae":"Rosângela Santos Rodrigues","filhos":"Sim","penultimaUnidade":"82ª CIPM","titulo":"1156 5285 0507","antiguidade":36,"cnh":"05762516273","categoriaCnh":"AB","validCnh":"2024-01-09","nomePai":"Judicael Gusmao Santana","nomeMae":"Rosângela Santos Rodrigues","dataUltimaPromocao":"2014-09-19","classifBgo":"16"},{"id":133,"grau":"Sd 1ª CL PM","nome":"Ivonilson Gusmao de Oliveira","nomeGuerra":"Gusmao","matricula":"30.647.478-9","localTrabalho":"5º Pelotão - PETO","dataNasc":"1997-07-29","cpf":"072.943.515-62","rg":"1622197763","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"999300347","tipoSang":"O positivo","email":"IVONILSON0101@GMAIL.COM","endereco":"Rua Carlos Alberto Figueredo, N⁰900, Candeias - Vitória da Conquista - Bahia","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Patrulheiro/Motociclista","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Ivonildo Gusmao de Oliveira","mae":"Elúzia Gusmao de Oliveira","filhos":"Não","penultimaUnidade":"38ª CIPM","titulo":"1564 3093 0523","antiguidade":77,"cnh":"06662797183","categoriaCnh":"AB","validCnh":"2033-05-24","nomePai":"Ivonildo Gusmao de Oliveira","nomeMae":"Elúzia Gusmao de Oliveira","dataUltimaPromocao":"2019-01-25","classifBgo":"1951"},{"id":134,"grau":"Sd 1ª CL PM","nome":"Jean Marcio Dias da Cruz","nomeGuerra":"Jean Marcio","matricula":"30.526.235-9","localTrabalho":"5º Pelotão - PETO","dataNasc":"1983-05-25","cpf":"008.760.001-38","rg":"0838979173","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991176892","tipoSang":"A positivo","email":"jmcruz.dias@hotmail.com","endereco":"Avenida Laura Nunes, 455, Condomínio Riviera, Bloco 05, Apto 303, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"04509821645","categoriaCnh":"AB","validCnh":"2033-09-05","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Itabuna-BA","pai":"Joselito Assis da Cruz","mae":"Maria das Graças Dias Avelino","filhos":"Sim","penultimaUnidade":"34ª CIPM","titulo":"1059 6276 0574","antiguidade":22,"nomePai":"Joselito Assis da Cruz","nomeMae":"Maria das Graças Dias Avelino","dataUltimaPromocao":"2012-04-25","classifBgo":"297"},{"id":135,"grau":"Sd 1ª CL PM","nome":"Jeferson Paiva de Oliveira","nomeGuerra":"Oliveira","matricula":"92048251","localTrabalho":"1º Pelotão","dataNasc":"1994-07-19","cpf":"063.387.095-12","rg":"1417157747","admissao":"2022-04-29","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"981214301","tipoSang":"O positivo","email":"jeferson.oliveer@gmail.com","endereco":"Av. Dário Ciacci, 705, Condomínio Parque Vitória Boulevard, Apto 101, Bloco 7, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05740728641","categoriaCnh":"AB","validCnh":"2024-09-01","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista","pai":"Joselino Rocha de Oliveira","mae":"Veradilce Nascimento Paiva","filhos":"Não","penultimaUnidade":"94ª CIPM","titulo":"1449 4772 0523","antiguidade":84,"nomePai":"Joselino Rocha de Oliveira","nomeMae":"Veradilce Nascimento Paiva","dataUltimaPromocao":"2022-04-29","classifBgo":"807"},{"id":136,"grau":"Sd 1ª CL PM","nome":"Joabe Souza da Silva","nomeGuerra":"Joabe","matricula":"92110933","localTrabalho":"5º Pelotão - PETO","dataNasc":"2004-09-11","cpf":"092.682.545-30","rg":"1459978986","admissao":"2023-12-26","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988793653","tipoSang":"O positivo","email":"sdasilvajoabe@gmail.com","endereco":"Rua Durval B Santana, 10, Nova Cidade, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"08202405921","categoriaCnh":"AB","validCnh":"2033-02-02","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista BA","pai":"Edilson Lima da Silva","mae":"Eliene de Souza Santos","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1732 4474 0523","antiguidade":92,"nomePai":"Edilson Lima da Silva","nomeMae":"Eliene de Souza Santos","dataUltimaPromocao":"2024-12-20","classifBgo":"957"},{"id":137,"grau":"Sd 1ª CL PM","nome":"Jonas Soares Duque","nomeGuerra":"Duque","matricula":"30653730","localTrabalho":"Outros","dataNasc":"1992-10-30","cpf":"057.681.265-03","rg":"1398273589","admissao":"2018-08-21","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991787186","tipoSang":"A positivo","email":"jonasduque2014.21@gmail.com","endereco":"Avenida Jorge Teixeira, 13, Ccandeias, Vitória da Cconquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05299524224","categoriaCnh":"AB","validCnh":"2026-02-08","cargo":"Motorista do Comandante","estadoCivil":"Casado(a)","naturalidade":"Jequié-BA","pai":"Pedro Ivo Duque Santos","mae":"Naelza Soares Duque","filhos":"Não","penultimaUnidade":"80ª CIPM","titulo":"1415 7420 0582","antiguidade":79,"nomePai":"Pedro Ivo Duque Santos","nomeMae":"Naelza Soares Duque","dataUltimaPromocao":"2019-05-31","classifBgo":"69"},{"id":138,"grau":"Sd 1ª CL PM","nome":"Jorge Miguel Oliveira Almeida","nomeGuerra":"Miguel","matricula":"30.644.417-4","localTrabalho":"BCS","dataNasc":"1997-05-15","cpf":"022.601.705-28","rg":"1384236953","admissao":"2018-03-27","planoSaude":"Unimed","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"981573982","tipoSang":"A positivo","email":"jorgemoliveiraa@gmail.com","endereco":"Jardim Guanabara, 1011, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"06608540301","categoriaCnh":"AB","validCnh":"2025-12-20","cargo":"Administrativo da BCS","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Jorge Miguel Oliveira Almeida","mae":"Vanda Zeneide de Oliveira Almeida","filhos":"Não","penultimaUnidade":"79ª CIPM","titulo":"1563 7773 0507","antiguidade":64,"nomePai":"Jorge Miguel Oliveira Almeida","nomeMae":"Vanda Zeneide de Oliveira Almeida","dataUltimaPromocao":"2019-01-25","classifBgo":"419"},{"id":139,"grau":"Sd 1ª CL PM","nome":"Larissa Santos Rodrigues","nomeGuerra":"Larissa","matricula":"30586860","localTrabalho":"Outros","dataNasc":"1992-08-15","cpf":"053.232.065-43","rg":"1563736705","admissao":"2015-06-19","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"981058109","tipoSang":"O positivo","email":"Larissa.santos@pm.ba.gov.br","endereco":"Rua Cláudia Botelho, 1065 - Condomínio Alfa Park, Ccasa 262, Primavera, Vitória da Cconquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Sem função","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Josemar Rodrigues Santos","mae":"Olivia Montalvao dos santos","filhos":"Sim","penultimaUnidade":"CPR-SO","titulo":"1415 7062 0582","antiguidade":54,"cnh":"05862043286","categoriaCnh":"B","validCnh":"2035-05-27","nomePai":"Josemar Rodrigues Santos","nomeMae":"Olivia Montalvao dos santos","dataUltimaPromocao":"2016-04-01","classifBgo":"592"},{"id":140,"grau":"Sd 1ª CL PM","nome":"Luan Moraes Sousa","nomeGuerra":"Luan Moraes","matricula":"30.564.421-8","localTrabalho":"1º Pelotão","dataNasc":"1988-10-17","cpf":"057.372.915-88","rg":"1283061147","admissao":"2014-01-06","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"999888049","tipoSang":"A positivo","email":"luan.batista@gmail.com","endereco":"Caminho 18, 20, Urbis V, Zabelê, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05778805267","categoriaCnh":"B","validCnh":"2033-12-13","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Adalberto de Sousa","mae":"Ivete Moraes de Oliveira","filhos":"Sim","penultimaUnidade":"46ª CIPM","titulo":"0138 5953 0574","antiguidade":46,"nomePai":"Adalberto de Sousa","nomeMae":"Ivete Moraes de Oliveira","dataUltimaPromocao":"2014-09-19","classifBgo":"569"},{"id":141,"grau":"Sd 1ª CL PM","nome":"Marcelo Luis Pereira Cerqueira","nomeGuerra":"Marcelo Cerqueira","matricula":"30.583.534-8","localTrabalho":"1º Pelotão","dataNasc":"1986-06-19","cpf":"023.162.065-90","rg":"0881656399","admissao":"2015-05-11","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988094847","tipoSang":"B positivo","email":"marcelocerqueiralp@gmail.com","endereco":"Avenida Claudia Botelho, SN, Cond Alpha Park, 57, Primavera, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"04840322901","categoriaCnh":"AB","validCnh":"2033-07-03","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Newton Carlos Souza Cerqueira","mae":"Jaciara Pereira Sousa","filhos":"Não","penultimaUnidade":"17º BPM","titulo":"1304 5107 0507","antiguidade":51,"nomePai":"Newton Carlos Souza Cerqueira","nomeMae":"Jaciara Pereira Sousa","dataUltimaPromocao":"2016-02-19","classifBgo":"312"},{"id":142,"grau":"Sd 1ª CL PM","nome":"Marlon Barreto Soares","nomeGuerra":"Soares","matricula":"92136666","localTrabalho":"Sem local","dataNasc":"1998-02-27","cpf":"077.255.505-26","rg":"2136033905","admissao":"2024-11-25","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"999950449","tipoSang":"A positivo","email":"marlonsoaresbarreto@hotmail.com","endereco":"Rua Sabino Lourenço de Carvalho, 496, Malhada Branca, Brumado-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"06911052090","categoriaCnh":"AB","validCnh":"2032-04-01","cargo":"Sem função","estadoCivil":"Solteiro(a)","naturalidade":"Brumado-BA","pai":"Lourival Silva Soares","mae":"Cledis Barreto Soares","filhos":"Não","penultimaUnidade":"17º BPM","titulo":"1586 0208 0507","antiguidade":100,"nomePai":"Lourival Silva Soares","nomeMae":"Cledis Barreto Soares","dataUltimaPromocao":"2025-12-05","classifBgo":"877"},{"id":143,"grau":"Sd 1ª CL PM","nome":"Marlucio dos Santos Nascimento","nomeGuerra":"Marlucio","matricula":"30.526.508-0","localTrabalho":"1º Pelotão","dataNasc":"1985-08-20","cpf":"021.091.025-94","rg":"885409604","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991234302","tipoSang":"O positivo","email":"marluciounico@hotmail.com","endereco":"Rua A, 28, Urbis II, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"03840399739","categoriaCnh":"AB","validCnh":"2032-07-14","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Joao Evangelista Nascimento","mae":"Elza dos Santos Nascimento","filhos":"Não","penultimaUnidade":"78ª CIPM","titulo":"1130 2657 0590","antiguidade":7,"nomePai":"Joao Evangelista Nascimento","nomeMae":"Elza dos Santos Nascimento","dataUltimaPromocao":"2012-04-25","classifBgo":"156"},{"id":144,"grau":"Sd 1ª CL PM","nome":"Mauro Pereira Benevides","nomeGuerra":"Benevides","matricula":"30.526.269-2","localTrabalho":"3º Pelotão","dataNasc":"1989-07-26","cpf":"029.437.975-45","rg":"1350719684","admissao":"2011-08-02","planoSaude":"NÃO POSSUI","grauInstrucao":"Superior incompleto","ddd":"73","telefone":"73999997402","tipoSang":"O positivo","email":"maurinhobenevides@hotmail.com","endereco":"Praça Sao Francisco, 60, centro, Apuarema-Ba","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"","estadoCivil":"Casado(a)","naturalidade":"Ilheus-BA","pai":"Almir do Rosario Benevides","mae":"Maria de Fatima Pereira Benevides","filhos":"Sim","penultimaUnidade":"CIPE/CENTRAL","titulo":"1295 2919 0523","antiguidade":25,"cnh":"05788240325","categoriaCnh":"AB","validCnh":"2036-05-06","nomePai":"Almir do Rosario Benevides","nomeMae":"Maria de Fatima Pereira Benevides","dataUltimaPromocao":"2012-04-25","classifBgo":"367"},{"id":145,"grau":"Sd 1ª CL PM","nome":"Milton Soares de Sousa","nomeGuerra":"Milton","matricula":"92137064","localTrabalho":"Sem local","dataNasc":"1998-11-14","cpf":"057.232.495-25","rg":"1609474643","admissao":"2024-11-25","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"999355503","tipoSang":"O positivo","email":"miltonsoares9@gmail.com","endereco":"Avenida Régis Pacheco, 646, Apto 202 , Centro, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"07828242452","categoriaCnh":"AB","validCnh":"2036-01-12","cargo":"Sem função","estadoCivil":"Solteiro(a)","naturalidade":"São Paulo-SP","pai":"Milton Guimarães de Sousa","mae":"Edinilza Oliveira Soares","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1476 6004 0515","antiguidade":101,"nomePai":"Milton Guimarães de Sousa","nomeMae":"Edinilza Oliveira Soares","dataUltimaPromocao":"2025-12-05","classifBgo":"886"},{"id":146,"grau":"Sd 1ª CL PM","nome":"Osmane Oliveira Fernandes","nomeGuerra":"Osmane","matricula":"30.587.207-3","localTrabalho":"6º Pelotão - PCS","dataNasc":"1985-10-18","cpf":"013.714.865-81","rg":"0949315770","admissao":"2015-06-19","planoSaude":"Unimed","grauInstrucao":"Médio","ddd":"77","telefone":"988381820","tipoSang":"A positivo","email":"osmane.fernandes@yahoo.com.br","endereco":"Avenida Larissa Cavalcante, 145, Condomínio Don Residencial, Bloco 7, Apto 03, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Sala de Meios da Sede","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Osmane Macedo Fernandes","mae":"Sônia Oliveira Fernandes","filhos":"Sim","penultimaUnidade":"46ª CIPM","titulo":"1130 5095 0507","antiguidade":58,"cnh":"05611896007","categoriaCnh":"B","validCnh":"2032-09-23","nomePai":"Osmane Macedo Fernandes","nomeMae":"Sônia Oliveira Fernandes","dataUltimaPromocao":"2016-04-01","classifBgo":"885"},{"id":147,"grau":"Sd 1ª CL PM","nome":"Pedro Henrique Figueiredo Bahia","nomeGuerra":"Bahia","matricula":"30.587.208-1","localTrabalho":"SSO","dataNasc":"1990-05-21","cpf":"101.287.206-89","rg":"1323245472","admissao":"2015-06-19","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"992092209","tipoSang":"O positivo","email":"pedro.bahia@pm.ba.gov.br","endereco":"Avenida Jardim Guanabara,1900,Boa vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"04467230495","categoriaCnh":"AB","validCnh":"2035-10-24","cargo":"Auxiliar da SSO","estadoCivil":"Casado(a)","naturalidade":"Pedra Azul-MG","pai":"Edvaldo de Figueiredo e Silva","mae":"Vera Lúcia Bahia Figueiredo","filhos":"Sim","penultimaUnidade":"8ª CIPM","titulo":"1807 6293 0213","antiguidade":53,"nomePai":"Edvaldo de Figueiredo e Silva","nomeMae":"Vera Lúcia Bahia Figueiredo","dataUltimaPromocao":"2016-04-01","classifBgo":"178"},{"id":148,"grau":"Sd 1ª CL PM","nome":"Renato Nascimento de Aquino","nomeGuerra":"Aquino","matricula":"30.583.894-8","localTrabalho":"2º Pelotão","dataNasc":"1986-09-17","cpf":"081.136.386-44","rg":"1338694144","admissao":"2015-05-11","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"998499329","tipoSang":"A negativo","email":"renato.n.aquino@hotmail.com","endereco":"Av. Joao Abuchidid, 387, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05486460480","categoriaCnh":"B","validCnh":"2032-05-02","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Montes Claros-MG","pai":"Claudionor Jose de Aquino","mae":"Djanira Neves Nascimento de Aquino","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1584 7221 0272","antiguidade":48,"nomePai":"Claudionor Jose de Aquino","nomeMae":"Djanira Neves Nascimento de Aquino","dataUltimaPromocao":"2016-02-19","classifBgo":"162"},{"id":149,"grau":"Sd 1ª CL PM","nome":"Roberio do Prado Brito","nomeGuerra":"do Prado","matricula":"30.527.077-6","localTrabalho":"2º Pelotão","dataNasc":"1980-11-19","cpf":"998.464.705-68","rg":"0776120352","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"71","telefone":"71988896888","tipoSang":"B positivo","email":"prado-brito@hotmail.com","endereco":"Rua I, 36, Zabelê, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"02481993784","categoriaCnh":"AD","validCnh":"2034-10-29","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Caatiba-BA","pai":"Odílio Dias Brito","mae":"Ana Bela Dias do Prado","filhos":"Sim","penultimaUnidade":"24º BPM","titulo":"0845 9138 0523","antiguidade":34,"nomePai":"Odílio Dias Brito","nomeMae":"Ana Bela Dias do Prado","dataUltimaPromocao":"2012-04-25","classifBgo":"1441"},{"id":150,"grau":"Sd 1ª CL PM","nome":"Rogerio Sousa dos Santos","nomeGuerra":"Rogerio","matricula":"30.526.618-3","localTrabalho":"6º Pelotão - PCS","dataNasc":"1982-06-12","cpf":"008.110.715-37","rg":"1003657443","admissao":"2011-08-02","planoSaude":"NÃO POSSUI","grauInstrucao":"Médio","ddd":"77","telefone":"988487179","tipoSang":"O positivo","email":"rogeriosousa4557@gmail .com","endereco":"Rua Rio de Janeiro, 31, Cidade Maravilhosa, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Sala de Meios da Sede","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Ivo Bispo dos Santos","mae":"Adileuza de Jesus Sousa dos Santos","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1061 9383 0507","antiguidade":10,"nomePai":"Ivo Bispo dos Santos","nomeMae":"Adileuza de Jesus Sousa dos Santos","dataUltimaPromocao":"2012-04-25","classifBgo":"209"},{"id":151,"grau":"Sd 1ª CL PM","nome":"Romulo Santos Oliveira","nomeGuerra":"Romulo","matricula":"30.645.063-8","localTrabalho":"5º Pelotão - PETO","dataNasc":"1995-11-24","cpf":"056.129.545-06","rg":"1340325608","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991293184","tipoSang":"A positivo","email":"romuloliveiraa@gmail.com","endereco":"Rua Siqueira Campos, 1977, Condominio Residencial Bosque da Vitória, Apto 401, Recreio, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"06290009792","categoriaCnh":"B","validCnh":"2034-12-09","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Raildo Barbosa de Oliveira Silva","mae":"Cineia dos Santos","filhos":"Não","penultimaUnidade":"80ª CIPM","titulo":"1518 8784 0558","antiguidade":66,"nomePai":"Raildo Barbosa de Oliveira Silva","nomeMae":"Cineia dos Santos","dataUltimaPromocao":"2019-01-25","classifBgo":"818"},{"id":152,"grau":"Sd 1ª CL PM","nome":"Ronaldo Alves Dias Pinheiro","nomeGuerra":"Pinheiro","matricula":"30.505.941-3","localTrabalho":"3º Pelotão","dataNasc":"1982-01-16","cpf":"821.281.385-15","rg":"0743187806","admissao":"2009-12-21","planoSaude":"PLANSERV","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988037641","tipoSang":"O positivo","email":"xboxliveronne@gmail.com","endereco":"Rua N, 94, Morada dos Passaros I, Felícia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"P.O","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Augusto Alves Pinheiro","mae":"Iracy Pereira Dias","filhos":"Não","penultimaUnidade":"","titulo":"1010 4892 0507","antiguidade":2,"cnh":"02682411497","categoriaCnh":"AB","validCnh":"2034-02-06","nomePai":"Augusto Alves Pinheiro","nomeMae":"Iracy Pereira Dias","dataUltimaPromocao":"2010-09-16","classifBgo":"926"},{"id":153,"grau":"Sd 1ª CL PM","nome":"Ronyelle de Almeida Teles Florencio","nomeGuerra":"Almeida Teles","matricula":"30.564.040-0","localTrabalho":"4º Pelotão","dataNasc":"1992-11-05","cpf":"055.324.705-02","rg":"1521875707","admissao":"2014-01-06","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988489225","tipoSang":"O positivo","email":"rony007bond@hotmail.com","endereco":"Rua L, 17, Morada dos Passaros II, Felícia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05566166108","categoriaCnh":"B","validCnh":"2032-03-09","cargo":"Fórum do TJBA","estadoCivil":"Casado(a)","naturalidade":"Itapetinga-BA","pai":"Lindoaldo Silva Teles","mae":"Maria Jose Fernandes de Almeida","filhos":"Sim","penultimaUnidade":"34ª CIPM","titulo":"1401 9600 0558","antiguidade":45,"nomePai":"Lindoaldo Silva Teles","nomeMae":"Maria Jose Fernandes de Almeida","dataUltimaPromocao":"2014-09-19","classifBgo":"332"},{"id":154,"grau":"Sd 1ª CL PM","nome":"Samile Silva Neres","nomeGuerra":"Samile","matricula":"92137098","localTrabalho":"Sem local","dataNasc":"2004-05-09","cpf":"866.985.185-73","rg":"1529258561","admissao":"2024-11-25","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988743707","tipoSang":"A positivo","email":"Samileneres@gmail.com","endereco":"Rua Segunda Travessa Santo Amaro, 48, Alto Maron, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Sem função","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"José Neres de Jesus Filho","mae":"Kátia Pereira Silva","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1732 4401 0574","antiguidade":95,"cnh":"08240460702","categoriaCnh":"B","validCnh":"2033-04-12","nomePai":"José Neres de Jesus Filho","nomeMae":"Kátia Pereira Silva","dataUltimaPromocao":"2025-12-05","classifBgo":"106"},{"id":155,"grau":"Sd 1ª CL PM","nome":"Savio Vieira dos Santos","nomeGuerra":"Savio","matricula":"30.645.239-7","localTrabalho":"5º Pelotão - PETO","dataNasc":"1996-09-20","cpf":"069.085.055-70","rg":"1591208106","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"981541586","tipoSang":"O positivo","email":"vieira.savio@outlook.com","endereco":"Rua Maiquinique,07 Patagônia","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"06280514105","categoriaCnh":"AB","validCnh":"2034-09-12","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Alexandre Alves dos Santos","mae":"Elizabete Vieira dos Santos","filhos":"Sim","penultimaUnidade":"8ª CIPM","titulo":"1547 5233 0590","antiguidade":69,"nomePai":"Alexandre Alves dos Santos","nomeMae":"Elizabete Vieira dos Santos","dataUltimaPromocao":"2019-01-25","classifBgo":"1041"},{"id":156,"grau":"Sd 1ª CL PM","nome":"Siro Ferreira Sobrinho","nomeGuerra":"Siro","matricula":"30.587.017-8","localTrabalho":"SOINT","dataNasc":"1985-11-21","cpf":"014.897.025-71","rg":"1266203265","admissao":"2015-06-19","planoSaude":"Saúde Caixa","grauInstrucao":"Médio","ddd":"77","telefone":"998132420","tipoSang":"O positivo","email":"sirosobrinho_85@hotmail.com","endereco":"Avenida Laura Nunes,1725 Condomínio Jardim Barcelona,Casa 31,Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"03283500110","categoriaCnh":"AB","validCnh":"2036-01-29","cargo":"Agente","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Paulo Estevam Sobrinho","mae":"Lourdes Ferreira Sobrinho","filhos":"Sim","penultimaUnidade":"8ª CIPM","titulo":"1062 5734 0507","antiguidade":56,"nomePai":"Paulo Estevam Sobrinho","nomeMae":"Lourdes Ferreira Sobrinho","dataUltimaPromocao":"2016-04-01","classifBgo":"641"},{"id":157,"grau":"Sd 1ª CL PM","nome":"Suelle Oliveira Batista","nomeGuerra":"Suelle Batista","matricula":"92015716","localTrabalho":"Outros","dataNasc":"1986-06-05","cpf":"026.218.445-10","rg":"1284000567","admissao":"2019-05-27","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991440139","tipoSang":"O positivo","email":"suolibat@gmail.com","endereco":"Rua I, 13, Morada dos Pássaros 3 , Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Apresentada ao CPRSO","estadoCivil":"Casado(a)","naturalidade":"Itapetinga-BA","pai":"João Batista Filho","mae":"Noélia Rosa de Oliveira Batista","filhos":"Sim","penultimaUnidade":"34ª CIPM","titulo":"1186 9102 0558","antiguidade":81,"cnh":"05461798608","categoriaCnh":"AB","validCnh":"2031-08-23","nomePai":"João Batista Filho","nomeMae":"Noélia Rosa de Oliveira Batista","dataUltimaPromocao":"2020-04-01","classifBgo":"11"},{"id":158,"grau":"Sd 1ª CL PM","nome":"Taluana Alves de Oliveira","nomeGuerra":"Taluana","matricula":"30.564.226-6","localTrabalho":"SSO","dataNasc":"1984-09-19","cpf":"011.633.395-20","rg":"1161615237","admissao":"2014-01-06","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988013848","tipoSang":"O positivo","email":"taluana@hotmail.com","endereco":"Avenida Laura Nunes, 455, Condomínio Riviera, Bloco 08, Apto 101, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cnh":"03685891249","categoriaCnh":"B","validCnh":"2031-09-12","cargo":"Auxiliar da SSO","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Francisco Cardoso de Oliveira","mae":"Marivalda Alves Vieira","filhos":"Sim","penultimaUnidade":"46ª CIPM","titulo":"1046 8163 0523","antiguidade":40,"nomePai":"Francisco Cardoso de Oliveira","nomeMae":"Marivalda Alves Vieira","dataUltimaPromocao":"2014-09-19","classifBgo":"69"},{"id":159,"grau":"Sd 1ª CL PM","nome":"Thiago Moises Almeida Santos","nomeGuerra":"Moises","matricula":"30.526.690-5","localTrabalho":"3º Pelotão","dataNasc":"1984-01-05","cpf":"016.197.735-97","rg":"0904025535","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"991800106","tipoSang":"O positivo","email":"tthiago_tmas_1984@hotmail.com","endereco":"Avenida Lara Nunes, 455, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Guarda do Hospital de Base","estadoCivil":"Casado(a)","naturalidade":"Sume-PB","pai":"Joao Batista Santos","mae":"Maria Cecília de Almeida","filhos":"Não","penultimaUnidade":"34ª CIPM","titulo":"1110 7665 0507","antiguidade":21,"cnh":"04904851436","categoriaCnh":"AB","validCnh":"2024-09-17","nomePai":"Joao Batista Santos","nomeMae":"Maria Cecília de Almeida","dataUltimaPromocao":"2012-04-25","classifBgo":"295"},{"id":160,"grau":"Sd 1ª CL PM","nome":"Thyara Campos de Oliveira Miranda","nomeGuerra":"Thyara Campos","matricula":"30563458","localTrabalho":"4º Pelotão","dataNasc":"1986-02-26","cpf":"014.392.855-43","rg":"0984327100","admissao":"2014-01-06","planoSaude":"Planserv","grauInstrucao":"Pós-graduação","ddd":"77","telefone":"998274629","tipoSang":"AB positivo","email":"","endereco":"Rua Joaquim dos Reis, 555, Condomínio Residencial Riverside, Bloco 05, Apto 02, Felícia, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Auxiliar do SAME","estadoCivil":"Casado(a)","naturalidade":"Barreiras-BA","pai":"Diogo Antônio de Oliveira Miranda","mae":"Maria Geane Campos de Oliveira Miranda","filhos":"Não","penultimaUnidade":"CPR-SUL","titulo":"1048 8796 0566","antiguidade":39,"cnh":"04022163384","categoriaCnh":"AB","validCnh":"2032-02-08","nomePai":"Diogo Antônio de Oliveira Miranda","nomeMae":"Maria Geane Campos de Oliveira Miranda","dataUltimaPromocao":"2014-09-19","classifBgo":"57"},{"id":161,"grau":"Sd 1ª CL PM","nome":"Wagner de Vasconcelos Almeida","nomeGuerra":"Wagner Almeida","matricula":"30.575.535-2","localTrabalho":"Outros","dataNasc":"1986-07-24","cpf":"021.297.725-36","rg":"1138783625","admissao":"2014-08-04","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991105171","tipoSang":"A negativo","email":"wagnerad23@yahoo.com.br","endereco":"Rua Patativa, 36, Recanto dos Passaros, Vitória da Conquista-BA","observacao":"BGO 191 de 2024 - Lic. P/ Tratar de Int. Particular.","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cargo":"Afastado","estadoCivil":"Casado(a)","naturalidade":"VItória da Conquista-BA","pai":"Orlando Matos de Almeida Filho","mae":"Clecia Pereira de Vasconcelos Almeida","filhos":"Sim","penultimaUnidade":"CIPE-SUDOESTE","titulo":"1062 3690 0574","antiguidade":47,"cnh":"04154673851","categoriaCnh":"AB","validCnh":"2032-01-23","nomePai":"Orlando Matos de Almeida Filho","nomeMae":"Clecia Pereira de Vasconcelos Almeida","dataUltimaPromocao":"2015-05-29","classifBgo":"23"},{"id":162,"grau":"Sd 1ª CL PM","nome":"Wagson Souza da Silva","nomeGuerra":"Wagson","matricula":"92111130","localTrabalho":"5º Pelotão - PETO","dataNasc":"1993-08-16","cpf":"037.955.305-80","rg":"1359897798","admissao":"2023-12-26","planoSaude":"Planserv","grauInstrucao":"Pós-graduação","ddd":"77","telefone":"981186454","tipoSang":"O positivo","email":"wagsonsilva178@gmail.com","endereco":"Rua J, Nº 14, Primavera, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05461832447","categoriaCnh":"AB","validCnh":"2031-08-26","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista","pai":"Edilson Lima da Silva","mae":"Eliene de Souza Santos","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1469 1717 0507","antiguidade":89,"nomePai":"Edilson Lima da Silva","nomeMae":"Eliene de Souza Santos","dataUltimaPromocao":"2024-12-20","classifBgo":"666"},{"id":163,"grau":"Sd 1ª CL PM","nome":"Wallas Ferreira Lima","nomeGuerra":"Wallas Lima","matricula":"30.645.491-7","localTrabalho":"1º Pelotão","dataNasc":"1995-07-22","cpf":"859.393.935-00","rg":"1463180217","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991673598","tipoSang":"O positivo","email":"wallasferreira77@gmail.com","endereco":"Rua Brasília, 83, Patagônia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"06668002050","categoriaCnh":"AB","validCnh":"2032-05-17","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"VItória da Conquista-BA","pai":"Joseilton Ferreira Lima","mae":"Maria Senhora Lima Freitas","filhos":"Sim","penultimaUnidade":"94ª CIPM","titulo":"1440 6756 0507","antiguidade":75,"nomePai":"Joseilton Ferreira Lima","nomeMae":"Maria Senhora Lima Freitas","dataUltimaPromocao":"2019-01-25","classifBgo":"1900"},{"id":164,"grau":"Sd 1ª CL PM","nome":"Washington Castro Piraja","nomeGuerra":"Piraja","matricula":"30.526.703-2","localTrabalho":"3º Pelotão","dataNasc":"1983-09-08","cpf":"003.890.075-01","rg":"0880158310","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"73","telefone":"73991078632","tipoSang":"B positivo","email":"toncpiraja@hotmail.com","endereco":"Rua Visconde de Maua, 220, Guarani, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"03520596979","categoriaCnh":"B","validCnh":"2034-05-20","cargo":"Guarda do Fórum","estadoCivil":"Casado(a)","naturalidade":"Jequie-BA","pai":"Ubiracy Genê Piraja","mae":"Nade Castro Piraja","filhos":"Sim","penultimaUnidade":"19º BPM","titulo":"0989 2125 0582","antiguidade":3,"nomePai":"Ubiracy Genê Piraja","nomeMae":"Nade Castro Piraja","dataUltimaPromocao":"2012-04-25","classifBgo":"105"},{"id":165,"grau":"Sd 1ª CL PM","nome":"Welton Gomes de Souza","nomeGuerra":"Welton Gomes","matricula":"92048258","localTrabalho":"6º Pelotão - PCS","dataNasc":"1984-07-01","cpf":"024.872.455-06","rg":"1135307814","admissao":"2021-07-05","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988316090","tipoSang":"B positivo","email":"welton061@gmail.com","endereco":"Rua L, 31, Patagônia, Vit[ória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"04715059804","categoriaCnh":"AB","validCnh":"2034-12-18","cargo":"STM","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista BA","pai":"Deli Barbosa de souza","mae":"Mariene Gomes de souza","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1117 4857 0574","antiguidade":85,"nomePai":"Deli Barbosa de souza","nomeMae":"Mariene Gomes de souza","dataUltimaPromocao":"2022-04-29","classifBgo":"808"},{"id":166,"grau":"Sd 1ª CL PM","nome":"Wender Oliveira da Silva","nomeGuerra":"Wender","matricula":"30.564.263-0","localTrabalho":"5º Pelotão - PETO","dataNasc":"1991-03-02","cpf":"054.663.645-41","rg":"1326594923","admissao":"2014-01-06","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"981112800","tipoSang":"A positivo","email":"wenderoliveira.woo@gmail.com","endereco":"Rua Filipinas, 37, Ipanema, Vitória da Conquista-BA","observacao":"Férias aprovadas para novembro, irá gozar em dezembro.","sexo":"MASC","situacao":"Ativo","origem":"SEDE","cnh":"05193765071","categoriaCnh":"AB","validCnh":"2032-11-08","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Joselito Pereira da Silva","mae":"Iara Oliveira da Silva","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1323 8620 0582","antiguidade":37,"nomePai":"Joselito Pereira da Silva","nomeMae":"Iara Oliveira da Silva","dataUltimaPromocao":"2014-09-19","classifBgo":"27"},{"id":167,"grau":"Sd 1ª CL PM","nome":"Zoraide Batista Barros","nomeGuerra":"Zoraide","matricula":"30.564.269-8","localTrabalho":"4º Pelotão","dataNasc":"1985-11-09","cpf":"022.960.015-80","rg":"1331208645","admissao":"2014-01-06","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988073740","tipoSang":"B positivo","email":"zoraidebatistabarros@gmail.com","endereco":"Rua Dely Vieria Silva, 916, Alameda Morada dos Passaros, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"SEDE","cargo":"Operador do CICOM","estadoCivil":"Solteiro(a)","naturalidade":"Barra do Choça-BA","pai":"Wilson Alves de Barros","mae":"Janete Silva Batista","filhos":"Não","penultimaUnidade":"78ª CIPM","titulo":"1062 6824 0540","antiguidade":41,"cnh":"05583289672","categoriaCnh":"B","validCnh":"2032-11-29","nomePai":"Wilson Alves de Barros","nomeMae":"Janete Silva Batista","dataUltimaPromocao":"2014-09-19","classifBgo":"109"},{"id":168,"grau":"CAP PM","nome":"OSÉIAS SANTOS VARGES","nomeGuerra":"","matricula":"30.481.315-7","localTrabalho":"COMANDO","dataNasc":"1982-12-18","cpf":"009.662.285-70","rg":"0858801833","admissao":"2008-04-07","planoSaude":"PLANSERV","grauInstrucao":"ENSINO SUPERIOR COMPLETO","ddd":"77","telefone":"988070632","tipoSang":"O-","email":"oseias.varges@gmail.com","endereco":"Av. Carlos Alberto Figueredo, 900, Qd 09, Casa 36 - Conde I","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS"},{"id":169,"grau":"ST PM","nome":"Marcia Regina Souza","nomeGuerra":"Souza","matricula":"30.295.968-0","localTrabalho":"BCS","dataNasc":"1973-02-28","cpf":"599.010.395-68","rg":"0506208273","admissao":"1997-06-30","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988066349","tipoSang":"O positivo","email":"marciareginavc@hotmail.com","endereco":"Avenida Barreiras, 2880,Brasil, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"BCS","cargo":"Adjunto da BCS","estadoCivil":"Solteiro(a)","naturalidade":"Itapetinga-BA","pai":"Josival Vicente de Sousa","mae":"Mariana Alves dos Santos","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0629 0017 0507","antiguidade":9,"cnh":"01812362703","categoriaCnh":"B","validCnh":"2032-10-10","nomePai":"Josival Vicente de Sousa","nomeMae":"Mariana Alves dos Santos","dataUltimaPromocao":"2025-12-18","classifBgo":"158"},{"id":170,"grau":"1º SGT PM","nome":"Eliene Andrade Cezarano","nomeGuerra":"Cezarano","matricula":"30.337.921-5","localTrabalho":"BCS","dataNasc":"1970-03-18","cpf":"584.275.115-15","rg":"0341642517","admissao":"1999-08-02","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991343758","tipoSang":"O positivo","email":"lncezarano@gmail.com","endereco":"Rua Claudia Botelho, 670, Condomínio Mirante do Candeias, Bloco 24, Apto 101, Primavera, Vitória da COnquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"BCS","cargo":"Adjunto da BCS","estadoCivil":"Solteiro(a)","naturalidade":"Itabuna-BA","pai":"Raulindo Afonso Cezarano","mae":"Erenita Andrade dos Santos","filhos":"Não","penultimaUnidade":"15º BPM","titulo":"0550 2209 0507","antiguidade":9,"nomePai":"Raulindo Afonso Cezarano","nomeMae":"Erenita Andrade dos Santos","dataUltimaPromocao":"2023-09-20","classifBgo":"216"},{"id":171,"grau":"1º SGT PM","nome":"Ronaldo Sousa Mota Bispo","nomeGuerra":"Mota","matricula":"30.437.555-7","localTrabalho":"BCS","dataNasc":"1981-06-21","cpf":"002.809.295-36","rg":"0648160602","admissao":"2005-12-12","planoSaude":"NÃO POSSUO","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988095908","tipoSang":"A positivo","email":"ronaldosousamota@gmail.com","endereco":"Rua G, Condomínio Morada Sul Apt 332 Bloco Paraguai, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Rozenildo Mota Bispo","mae":"Zulene Silva Sousa","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0979 5172 0523","antiguidade":6,"cnh":"02760961705","categoriaCnh":"AD","validCnh":"2033-07-12","nomePai":"Rozenildo Mota Bispo","nomeMae":"Zulene Silva Sousa","dataUltimaPromocao":"2021-12-09","classifBgo":"121"},{"id":172,"grau":"1º SGT PM","nome":"Tedson Goncalves de Brito","nomeGuerra":"Tedson","matricula":"30.390.762-8","localTrabalho":"BCS","dataNasc":"1982-07-27","cpf":"823.776.345-91","rg":"0700163484","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"999620077","tipoSang":"A positivo","email":"tedsonbrito@gmail.com","endereco":"Avenida Guanambi, 22, Brasil, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"01602723345","categoriaCnh":"B","validCnh":"2031-12-13","cargo":"Adjunto da BCS","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Wdson Gonçalves de Oliveira","mae":"Terezinha Rosa de Brito Oliveira","filhos":"Sim","penultimaUnidade":"CIPRV/BRUMADO","titulo":"9510 2690 8582","antiguidade":14,"nomePai":"Wdson Gonçalves de Oliveira","nomeMae":"Terezinha Rosa de Brito Oliveira","dataUltimaPromocao":"2024-09-25","classifBgo":"269"},{"id":173,"grau":"1º SGT PM","nome":"Warley de Oliveira Ribeiro","nomeGuerra":"Warley","matricula":"30391130","localTrabalho":"6º Pelotão - PCS","dataNasc":"1979-10-18","cpf":"780.891.075-91","rg":"0762325909","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988452992","tipoSang":"A positivo","email":"warleyvc@hotmail.com","endereco":"Rua Caxias, 198, Cruziero, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cargo":"Adjunto ao Coordenador","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Milton Ribeiro","mae":"Ezildeni Sardinha de Oliveira Ribeiro","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0853 9374 0566","antiguidade":12,"cnh":"02921167880","categoriaCnh":"AD","validCnh":"2033-07-24","nomePai":"Milton Ribeiro","nomeMae":"Ezildeni Sardinha de Oliveira Ribeiro","dataUltimaPromocao":"2024-01-01","classifBgo":"241"},{"id":174,"grau":"1º SGT PM","nome":"Wallace Reboucas Silva","nomeGuerra":"Wallace","matricula":"30.389.703-5","localTrabalho":"BCS","dataNasc":"1979-01-01","cpf":"000.600.635-30","rg":"0699654394","admissao":"2003-03-10","planoSaude":"Planserv","grauInstrucao":"Pós-graduação","ddd":"77","telefone":"991298600","tipoSang":"A positivo","email":"wallacereboucasedf@gmail.com","endereco":"Rua 2, Casa 39, URBIS I, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cargo":"Adjunto da BCS","estadoCivil":"Casado(a)","naturalidade":"Itabuna-BA","pai":"Antônio Carlos da Silva","mae":"Djanira Rebouças da Silva","filhos":"Sim","penultimaUnidade":"CIPE-SUDOESTE","titulo":"0951 1718 0507","antiguidade":30,"cnh":"03535573283","categoriaCnh":"AB","validCnh":"2024-11-13","nomePai":"Antônio Carlos da Silva","nomeMae":"Djanira Rebouças da Silva","dataUltimaPromocao":"2025-10-14","classifBgo":"734"},{"id":175,"grau":"CB PM","nome":"Aleandro Silva Prado","nomeGuerra":"Aleandro Prado","matricula":"30.481.245-2","localTrabalho":"BCS","dataNasc":"1980-10-09","cpf":"823.798.585-00","rg":"0789309289","admissao":"2008-04-07","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"988010091","tipoSang":"B positivo","email":"aleandroguns@gmail.com","endereco":"Avenida Serrinha, 2172, Brasil, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"03929451560","categoriaCnh":"AB","validCnh":"2031-06-30","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Alexandre Rocha Prado","mae":"Maria de Lourdes Pereira Silva","filhos":"Sim","penultimaUnidade":"8ª CIPM","titulo":"1012 1701 0531","antiguidade":19,"nomePai":"Alexandre Rocha Prado","nomeMae":"Maria de Lourdes Pereira Silva","dataUltimaPromocao":"2023-12-21","classifBgo":"49"},{"id":176,"grau":"CB PM","nome":"Daniel da Silva Campos","nomeGuerra":"Campos","matricula":"30.484.230-0","localTrabalho":"BCS","dataNasc":"1981-09-20","cpf":"820.243.755-53","rg":"1269299204","admissao":"2008-04-19","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"999990820","tipoSang":"O positivo","email":"danyelmatematica@gmail.com","endereco":"Avenida B,100 Primavera, Vitória da Conquista-Ba","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"07231368518","categoriaCnh":"AB","validCnh":"2033-09-18","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Rafael Ferreira Campos","mae":"Regina Lúcia da Silva","filhos":"Sim","penultimaUnidade":"77ª CIPM","titulo":"0936 4242 0531","antiguidade":5,"nomePai":"Rafael Ferreira Campos","nomeMae":"Regina Lúcia da Silva","dataUltimaPromocao":"2022-07-29","classifBgo":"231"},{"id":177,"grau":"CB PM","nome":"FÁBIO PAIXÃO CAFÉ","nomeGuerra":"30.511.483-1","matricula":"","localTrabalho":"ADJUNTO DE DIA","dataNasc":"01/09/1979","cpf":"008.713.135-88","rg":"1154760596","admissao":"2010-05-24","planoSaude":"PLANSERV","grauInstrucao":"ENSINO SUPERIOR INCOMPLETO","ddd":"77","telefone":"988716955","tipoSang":"A-","email":"flexauto@hotmail.com","endereco":"Rua Oldack Amaral, nº 38, cidade de Dário Meira-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS"},{"id":178,"grau":"CB PM","nome":"Naum Rodrigues Silva","nomeGuerra":"Naum","matricula":"30.481.399-5","localTrabalho":"BCS","dataNasc":"1983-12-24","cpf":"017.437.295-70","rg":"1277018421","admissao":"2008-04-07","planoSaude":"Unimed","grauInstrucao":"Médio","ddd":"77","telefone":"988129826","tipoSang":"A positivo","email":"naum_rodrigues@hotmail.com","endereco":"Avenida Aracaju, 679, Brasil, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cargo":"Comandante de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"","mae":"Adenildes Rodrigues Silva","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1062 0010 0507","antiguidade":17,"cnh":"02968991443","categoriaCnh":"B","validCnh":"2034-12-10","nomeMae":"Adenildes Rodrigues Silva","dataUltimaPromocao":"2023-09-22","classifBgo":"356"},{"id":179,"grau":"CB PM","nome":"Willian Moreira Prates","nomeGuerra":"Prates","matricula":"30.481.447-0","localTrabalho":"BCS","dataNasc":"1978-05-12","cpf":"917.982.725-04","rg":"0596651147","admissao":"2008-03-07","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"992101591","tipoSang":"O positivo","email":"willprates@yahoo.com.br","endereco":"Rua G, Condomínio Sul Residence, Bloco Buenos Aires, Apto 103, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cargo":"Adjunto da BCS","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Ivan Moreira Prates","mae":"Maria Jacinta Amaral","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"0813 6777 0558","antiguidade":4,"cnh":"04921875982","categoriaCnh":"B","validCnh":"2022-04-03","nomePai":"Ivan Moreira Prates","nomeMae":"Maria Jacinta Amaral","dataUltimaPromocao":"2022-07-29","classifBgo":"186"},{"id":180,"grau":"Sd 1ª CL PM","nome":"Adriano Dutra Farias","nomeGuerra":"Adriano Farias","matricula":"30.583.418-0","localTrabalho":"BCS","dataNasc":"1988-02-02","cpf":"027.323.895-79","rg":"1148325956","admissao":"2015-05-11","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"998491581","tipoSang":"A positivo","email":"drio_vca@hotmail.com","endereco":"Rua Professora Ana Almeida,124, Sao Vicente, Vítoria Da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"04045781582","categoriaCnh":"AB","validCnh":"2031-09-04","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Joao Soares Farias","mae":"Valneide Dutra Farias","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1282 1680 0582","antiguidade":49,"nomePai":"Joao Soares Farias","nomeMae":"Valneide Dutra Farias","dataUltimaPromocao":"2016-02-19","classifBgo":"173"},{"id":181,"grau":"Sd 1ª CL PM","nome":"Alan da Silva Sa","nomeGuerra":"Silva Sa","matricula":"30.526.028-4","localTrabalho":"BCS","dataNasc":"1986-06-19","cpf":"025.400.475-05","rg":"1128260247","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991026947","tipoSang":"AB positivo","email":"plenitudey@gmail.com","endereco":"Rua Claudia Botelho,1065, Primavera Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"05917253309","categoriaCnh":"AB","validCnh":"2032-11-07","cargo":"Comandante/Motorista","estadoCivil":"Casado(a)","naturalidade":"Itabuna-BA","pai":"Ailton Batista de Sa","mae":"Emília Nascimento da Silva","filhos":"Sim","penultimaUnidade":"78ª CIPM","titulo":"1297 6450 0574","antiguidade":27,"nomePai":"Ailton Batista de Sa","nomeMae":"Emília Nascimento da Silva","dataUltimaPromocao":"2012-04-25","classifBgo":"415"},{"id":182,"grau":"Sd 1ª CL PM","nome":"Anne Daisy Cabral Sampaio","nomeGuerra":"Anne","matricula":"30.601.887-6","localTrabalho":"BCS","dataNasc":"1988-12-03","cpf":"035.715.045-77","rg":"1191428486","admissao":"2016-05-16","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988660986","tipoSang":"A positivo","email":"annedaisy@msn.com","endereco":"Avenida Gilenilda Alves, Condomínio Dona Gilenilda, Bloco 2, Casa 2, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"BCS","cargo":"Administrativo da BCS","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Antônio Tavares Sampaio Filho","mae":"Roseneide Santos Cabral","filhos":"Não","penultimaUnidade":"94ª CIPM","titulo":"1201 5515 0507","antiguidade":61,"cnh":"05742444275","categoriaCnh":"B","validCnh":"2023-03-04","nomePai":"Antônio Tavares Sampaio Filho","nomeMae":"Roseneide Santos Cabral","dataUltimaPromocao":"2017-01-27","classifBgo":"66"},{"id":183,"grau":"Sd 1ª CL PM","nome":"Boaventura da Rocha Lemos Neto","nomeGuerra":"Boaventura","matricula":"30.526.040-4","localTrabalho":"4º Pelotão","dataNasc":"1985-08-13","cpf":"011.887.195-13","rg":"1139526782","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"73991036112","tipoSang":"O positivo","email":"boa_neto@hotmail.com","endereco":"Rua C, 39, Loteamento Conquistense, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cargo":"Guarda do Ministério Público","estadoCivil":"Casado(a)","naturalidade":"Jequie-BA","pai":"Boaventura da Rocha Lemos Júnior","mae":"Maria Lúcia de Souza Lemos","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1033 4883 0523","antiguidade":11,"cnh":"03296736503","categoriaCnh":"AB","validCnh":"2034-04-11","nomePai":"Boaventura da Rocha Lemos Júnior","nomeMae":"Maria Lúcia de Souza Lemos","dataUltimaPromocao":"2012-04-25","classifBgo":"212"},{"id":184,"grau":"Sd 1ª CL PM","nome":"Carlos Rodrigo Ferreira Andrade","nomeGuerra":"Carlos Andrade","matricula":"30.526.054-3","localTrabalho":"BCS","dataNasc":"1983-11-23","cpf":"015.822.125-70","rg":"0958559392","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"991608530","tipoSang":"B positivo","email":"angraspirit@hotmail.com","endereco":"Avenida Botafogo, 495-A","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"03657922894","categoriaCnh":"B","validCnh":"2034-02-24","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Salvador-BA","pai":"","mae":"Edna Ferreira Sousa","filhos":"Sim","penultimaUnidade":"17º BPM","titulo":"1153 4521 0531","antiguidade":33,"nomeMae":"Edna Ferreira Sousa","dataUltimaPromocao":"2012-04-25","classifBgo":"708"},{"id":185,"grau":"Sd 1ª CL PM","nome":"Dacio Buriti de Almeida","nomeGuerra":"de Almeida","matricula":"30.526.058-5","localTrabalho":"BCS","dataNasc":"1984-02-10","cpf":"019.645.055-18","rg":"1177913267","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"ENSINO MÉDIO COMPLETO","ddd":"73","telefone":"73991534014","tipoSang":"A positivo","email":"dacio.artroses@hotmail.com","endereco":"Rua Deputado Fernado Ferrari, 309, Joaquim Romao, Jequie-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"06283328930","categoriaCnh":"AB","validCnh":"2034-07-04","cargo":"Sala de Meios da BCS","estadoCivil":"Casado(a)","naturalidade":"Jequie-BA","pai":"Walter Reis de Almeida","mae":"Maria da Cruz Buriti","filhos":"Sim","penultimaUnidade":"17º BPM","titulo":"1052 7943 0590","antiguidade":26,"nomePai":"Walter Reis de Almeida","nomeMae":"Maria da Cruz Buriti","dataUltimaPromocao":"2012-04-25","classifBgo":"395"},{"id":186,"grau":"Sd 1ª CL PM","nome":"Danilo Azevedo Ribeiro","nomeGuerra":"Danilo","matricula":"30.646.132-0","localTrabalho":"BCS","dataNasc":"1996-03-26","cpf":"040.924.565-81","rg":"1500699012","admissao":"2018-03-27","planoSaude":"NÃO POSSUO","grauInstrucao":"Superior","ddd":"77","telefone":"981081650","tipoSang":"B positivo","email":"danniloazevedo1@gmail.com","endereco":"Rua H, 24, Morada dos Pássaros 2, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"06123085062","categoriaCnh":"AB","validCnh":"2034-05-20","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Florisvaldo José Ribeiro","mae":"Rita de Cássia Azevedo dos Santos","filhos":"Sim","penultimaUnidade":"42ª CIPM","titulo":"1469 1064 0582","antiguidade":67,"nomePai":"Florisvaldo José Ribeiro","nomeMae":"Rita de Cássia Azevedo dos Santos","dataUltimaPromocao":"2019-01-25","classifBgo":"938"},{"id":187,"grau":"Sd 1ª CL PM","nome":"Darlan Oliveira Lima","nomeGuerra":"Oliveira Lima","matricula":"30.526.078-9","localTrabalho":"BCS","dataNasc":"1987-06-08","cpf":"031.432.975-73","rg":"0971047367","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"991064995","tipoSang":"A positivo","email":"darlan_dol@hotmail.com","endereco":"Avenida Chiara Lubich, 555, Condomínio Residencial Provence, Bloco 13, Apto 301, Bairro Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"04621014140","categoriaCnh":"AB","validCnh":"2034-10-25","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Adalvane Silva Lima","mae":"Maria do Carmo Oliveira Lima","filhos":"Sim","penultimaUnidade":"17º BPM","titulo":"1129 9018 0558","antiguidade":29,"nomePai":"Adalvane Silva Lima","nomeMae":"Maria do Carmo Oliveira Lima","dataUltimaPromocao":"2012-04-25","classifBgo":"524"},{"id":188,"grau":"Sd 1ª CL PM","nome":"Diego Oliveira do Carmo","nomeGuerra":"Diego do Carmo","matricula":"30.601.901-8","localTrabalho":"BCS","dataNasc":"1986-09-26","cpf":"021.847.225-02","rg":"0984665340","admissao":"2016-05-16","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988121271","tipoSang":"B positivo","email":"diogobalak65@gmail.com","endereco":"Rua E,1046,Cidade Modelo, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"03754249290","categoriaCnh":"AB","validCnh":"2035-08-06","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Crescêncio Moreno do Carmo","mae":"Ruth Maria de Oliveira Lopes","filhos":"Sim","penultimaUnidade":"46ª CIPM","titulo":"0014 4577 0566","antiguidade":60,"nomePai":"Crescêncio Moreno do Carmo","nomeMae":"Ruth Maria de Oliveira Lopes","dataUltimaPromocao":"2017-01-27","classifBgo":"32"},{"id":189,"grau":"Sd 1ª CL PM","nome":"Diego Silva Gusmao","nomeGuerra":"Diego Gusmao","matricula":"30.557.455-2","localTrabalho":"BCS","dataNasc":"1985-03-19","cpf":"021.233.375-52","rg":"1122898193","admissao":"2013-09-09","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"991813992","tipoSang":"O positivo","email":"diego.gusmao19@gmail.com","endereco":"Rua C, 10, Jardim Petrópolis, Cruzeiro, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"03250028571","categoriaCnh":"B","validCnh":"2035-01-16","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Djalma Soares Gusmao","mae":"Nilva Silva Gusmao","filhos":"Sim","penultimaUnidade":"CFAP","titulo":"1062 5529 0507","antiguidade":35,"nomePai":"Djalma Soares Gusmao","nomeMae":"Nilva Silva Gusmao","dataUltimaPromocao":"2014-05-19","classifBgo":"3"},{"id":190,"grau":"Sd 1ª CL PM","nome":"Gabriel Ferreira de Alcantara","nomeGuerra":"Alcantara","matricula":"30.614.699-6","localTrabalho":"3º Pelotão","dataNasc":"1990-05-01","cpf":"051.510.775-11","rg":"1315941414","admissao":"2016-09-12","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"991019925","tipoSang":"A positivo","email":"alcantararepres@gmail.com","endereco":"Rua Espírito Santo, 232, Brasil, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cargo":"Guarda da Rodoviária","estadoCivil":"Casado(a)","naturalidade":"VItória da Conquista-BA","pai":"-","mae":"Maurina Alcântara de Oliveira","filhos":"Sim","penultimaUnidade":"46ª CIPM","titulo":"1325 5827 0507","antiguidade":62,"cnh":"04984202103","categoriaCnh":"B","validCnh":"2025-01-20","nomePai":"-","nomeMae":"Maurina Alcântara de Oliveira","dataUltimaPromocao":"2017-07-06","classifBgo":"234"},{"id":191,"grau":"Sd 1ª CL PM","nome":"Helzio Leao Souza","nomeGuerra":"Helzio","matricula":"30.526.159-9","localTrabalho":"BCS","dataNasc":"194-01-19","cpf":"016.220.335-74","rg":"1127937111","admissao":"2011-02-08","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988076036","tipoSang":"A positivo","email":"helzioleao@gmail.com","endereco":"Av Antônio Nascimento, 85, Petrópolis, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"04271180118","categoriaCnh":"AB","validCnh":"2035-05-22","cargo":"Comandante/Motorista","estadoCivil":"Casado(a)","naturalidade":"Paramirim-BA","pai":"Advaldo Mariano de Souza","mae":"Alerdice de Oliveira Leão Souza","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1009 8330 0582","antiguidade":6,"nomePai":"Advaldo Mariano de Souza","nomeMae":"Alerdice de Oliveira Leão Souza","dataUltimaPromocao":"2012-04-25","classifBgo":"155"},{"id":192,"grau":"Sd 1ª CL PM","nome":"Idalmir Cunha de Sousa","nomeGuerra":"Sousa","matricula":"30.526.191-3","localTrabalho":"BCS","dataNasc":"1988-08-02","cpf":"029.779.305-58","rg":"1204149020","admissao":"2011-08-02","planoSaude":"Unimed","grauInstrucao":"Superior","ddd":"77","telefone":"988472898","tipoSang":"B negativo","email":"idalmircsousa@hotmail.com","endereco":"Rua do Atlântico, 25, Cruzeiro, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"04406258744","categoriaCnh":"AB","validCnh":"2033-02-13","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Salvador Alves de Sousa","mae":"Iraemes Cunha de Sousa","filhos":"Não","penultimaUnidade":"34ª CIPM","titulo":"1283 5413 0558","antiguidade":19,"nomePai":"Salvador Alves de Sousa","nomeMae":"Iraemes Cunha de Sousa","dataUltimaPromocao":"2012-04-25","classifBgo":"248"},{"id":193,"grau":"Sd 1ª CL PM","nome":"Jesse Souza Santos Neto","nomeGuerra":"Santos Neto","matricula":"30.526.237-5","localTrabalho":"3º Pelotão","dataNasc":"1985-09-21","cpf":"023.062.155-45","rg":"1174454016","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"981120065","tipoSang":"O positivo","email":"jesse.bme@hotmail.com","endereco":"Avenida Primavera, 1496, Primavera, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cargo":"Guarda do Fisco","estadoCivil":"Casado(a)","naturalidade":"Jequie-BA","pai":"Jackson Oliveira Santos","mae":"Valdilene Silva Santos","filhos":"Sim","penultimaUnidade":"17º BPM","titulo":"1125 5983 0523","antiguidade":32,"cnh":"03810811802","categoriaCnh":"AB","validCnh":"2034-11-27","nomePai":"Jackson Oliveira Santos","nomeMae":"Valdilene Silva Santos","dataUltimaPromocao":"2012-04-25","classifBgo":"644"},{"id":194,"grau":"Sd 1ª CL PM","nome":"Joelson Santos de Oliveira","nomeGuerra":"Joelson","matricula":"30.526.393-1","localTrabalho":"BCS","dataNasc":"1987-12-28","cpf":"028.698.585-31","rg":"1203291825","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988094176","tipoSang":"A negativo","email":"Joel_oliver@hotmail.com","endereco":"Quinta Avenida, 555, Condomínio Residencial Provence, Bloco 02, Apto 304, Boa Vista, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Itaguaí-RJ","pai":"Ernesto Vicente de Oliveira","mae":"Helenita Caetano Santos","filhos":"Sim","penultimaUnidade":"17º BPM","titulo":"1186 3332 0558","antiguidade":30,"cnh":"04749003908","categoriaCnh":"AB","validCnh":"2035-01-16","nomePai":"Ernesto Vicente de Oliveira","nomeMae":"Helenita Caetano Santos","dataUltimaPromocao":"2012-04-25","classifBgo":"548"},{"id":195,"grau":"Sd 1ª CL PM","nome":"Jose Antonio Teixeira Alves","nomeGuerra":"Teixeira","matricula":"30.526.409-2","localTrabalho":"BCS","dataNasc":"1984-02-25","cpf":"832.773.585-34","rg":"970814771","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988169293","tipoSang":"O positivo","email":"zealvespsi@hotmail.com","endereco":"Avenida Pernambuco, 229, Brasil, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"02592932219","categoriaCnh":"B","validCnh":"2034-10-16","cargo":"Sala de Meios da BCS","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Joaquim Alves da Rocha","mae":"Gersília Teixeira Alves","filhos":"Sim","penultimaUnidade":"17º BPM","titulo":"1129 8320 0507","antiguidade":28,"nomePai":"Joaquim Alves da Rocha","nomeMae":"Gersília Teixeira Alves","dataUltimaPromocao":"2012-04-25","classifBgo":"443"},{"id":196,"grau":"Sd 1ª CL PM","nome":"Keila Gomes Brito","nomeGuerra":"Keila","matricula":"92137066","localTrabalho":"Sem local","dataNasc":"1992-12-25","cpf":"059.384.935-36","rg":"1440151024","admissao":"2024-11-25","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991833398","tipoSang":"O positivo","email":"keilabarreto@live.com","endereco":"Rua Mãe da Lua, 185-D, Baterias 2, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"BCS","cargo":"Sem função","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Deusdete Gomes de Brito","mae":"Maria Rosa de Brito","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1440 7064 0523","antiguidade":96,"cnh":"06633444059","categoriaCnh":"AB","validCnh":"2031-10-31","nomePai":"Deusdete Gomes de Brito","nomeMae":"Maria Rosa de Brito","dataUltimaPromocao":"2025-12-05","classifBgo":"674"},{"id":197,"grau":"Sd 1ª CL PM","nome":"Leandro Silva de Santana","nomeGuerra":"Leandro","matricula":"30.526.423-8","localTrabalho":"BCS","dataNasc":"1986-09-07","cpf":"019.125.715-01","rg":"1208492403","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"77","telefone":"988011727","tipoSang":"A positivo","email":"soldadopmleandro@hotmail.com","endereco":"Rua Paraguaçu, 141-A, Alto Maron, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"03955607596","categoriaCnh":"B","validCnh":"2032-12-28","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Pedro Higino de Santana Filho","mae":"Pedrina Morais da Silva","filhos":"Sim","penultimaUnidade":"17º BPM","titulo":"1062 6318 0582","antiguidade":24,"nomePai":"Pedro Higino de Santana Filho","nomeMae":"Pedrina Morais da Silva","dataUltimaPromocao":"2012-04-25","classifBgo":"360"},{"id":198,"grau":"Sd 1ª CL PM","nome":"Luiz da Costa Nogueira","nomeGuerra":"Costa","matricula":"30.526.481-4","localTrabalho":"BCS","dataNasc":"1982-12-03","cpf":"825.437.555-00","rg":"0879748940","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"988261242","tipoSang":"A positivo","email":"lula821@hotmail.com","endereco":"Camino 07, Casa 26, URBIS V, Zabelê, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"04873026310","categoriaCnh":"AB","validCnh":"2034-09-13","cargo":"Motorista de Guarnição","estadoCivil":"Solteiro(a)","naturalidade":"Vitória da Conquista-BA","pai":"Normândio Nogueira de Souza","mae":"Maria Felizardo da Costa","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"9509 8530 5040","antiguidade":14,"nomePai":"Normândio Nogueira de Souza","nomeMae":"Maria Felizardo da Costa","dataUltimaPromocao":"2012-04-25","classifBgo":"222"},{"id":199,"grau":"Sd 1ª CL PM","nome":"Magnum Jardim Santa Rosa","nomeGuerra":"Magnum","matricula":"30.564.354-7","localTrabalho":"BCS","dataNasc":"1984-01-15","cpf":"009.075.645-26","rg":"0880315512","admissao":"2014-01-06","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991253451","tipoSang":"A positivo","email":"magnumjsr@gmail.com","endereco":"Rua Q, 379-A, Morada dos Passaros, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"04462244792","categoriaCnh":"AB","validCnh":"2032-12-28","cargo":"Motorista de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Iguaí-BA","pai":"Agdo Santa Rosa","mae":"Nilcelia Maria Jardim Santa Rosa","filhos":"Sim","penultimaUnidade":"79ª CIPM","titulo":"1061 8673 0566","antiguidade":44,"nomePai":"Agdo Santa Rosa","nomeMae":"Nilcelia Maria Jardim Santa Rosa","dataUltimaPromocao":"2014-09-19","classifBgo":"178"},{"id":200,"grau":"Sd 1ª CL PM","nome":"Marcos Alves de Souza","nomeGuerra":"Marcos Alves","matricula":"30.528.700-8","localTrabalho":"BCS","dataNasc":"1979-06-04","cpf":"927.264.105-53","rg":"0809488043","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Médio","ddd":"73","telefone":"73981396727","tipoSang":"O positivo","email":"msouzabcs77@gmail.com","endereco":"Rua Tia Zaza, 37, Cidade Modelo, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cargo":"Sala de Meios da BCS","estadoCivil":"Solteiro(a)","naturalidade":"Ilheus-BA","pai":"Antônio Alves de Souza","mae":"Marinalva Moreira Galvao","filhos":"Sim","penultimaUnidade":"34ª CIPM","titulo":"1501 8860 0590","antiguidade":20,"cnh":"04312631607","categoriaCnh":"AB","validCnh":"2022-09-21","nomePai":"Antônio Alves de Souza","nomeMae":"Marinalva Moreira Galvao","dataUltimaPromocao":"2012-04-25","classifBgo":"290"},{"id":201,"grau":"Sd 1ª CL PM","nome":"Marta Valeria dos Santos","nomeGuerra":"Marta","matricula":"30.526.568-2","localTrabalho":"BCS","dataNasc":"1988-06-06","cpf":"034.294.005-89","rg":"1347935100","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"73","telefone":"73988460076","tipoSang":"A positivo","email":"valeria_santos_12@hotmail.com","endereco":"Rua Claudionor de Oliveira, 130, Condomínio Rembrandt, Apto 101, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"BCS","cnh":"05969475442","categoriaCnh":"AB","validCnh":"2024-04-01","cargo":"Patrulha Comunitária","estadoCivil":"Solteiro(a)","naturalidade":"Jequie-BA","pai":"","mae":"Marinalva dos Santos","filhos":"Não","penultimaUnidade":"19º BPM","titulo":"1209 9536 0507","antiguidade":16,"nomeMae":"Marinalva dos Santos","dataUltimaPromocao":"2012-04-25","classifBgo":"228"},{"id":202,"grau":"Sd 1ª CL PM","nome":"Monique da Silva Costa","nomeGuerra":"Monique","matricula":"30.644.896-6","localTrabalho":"BCS","dataNasc":"1992-02-12","cpf":"036.910.275-47","rg":"1325754692","admissao":"2018-03-27","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"992101449","tipoSang":"A positivo","email":"monescosta@gmail.com","endereco":"Rua I, 327, Felícia, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"BCS","cnh":"05357779940","categoriaCnh":"AB","validCnh":"2031-08-12","cargo":"Patrulheira","estadoCivil":"Casado(a)","naturalidade":"Gandu-BA","pai":"Marcos Zeferino Costa","mae":"Solange da Silva Costa","filhos":"Sim","penultimaUnidade":"42ª CIPM","titulo":"1322 3296 0507","antiguidade":72,"nomePai":"Marcos Zeferino Costa","nomeMae":"Solange da Silva Costa","dataUltimaPromocao":"2019-01-25","classifBgo":"1108"},{"id":203,"grau":"Sd 1ª CL PM","nome":"Rogerio Ribeiro Santos","nomeGuerra":"Rogerio Santos","matricula":"30.526.613-3","localTrabalho":"BCS","dataNasc":"1982-09-04","cpf":"003.210.895-88","rg":"1120995809","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"999874440","tipoSang":"O positivo","email":"rogerio.bio.logia@hotmail.com","endereco":"Avenia Guanambi, 289, Patagônia, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cargo":"Comandante de Guarnição","estadoCivil":"Casado(a)","naturalidade":"Vitória da Conquista-BA","pai":"Antônio Ervanio Resende Santos","mae":"Maria de Fatima Ribeiro Santos","filhos":"Sim","penultimaUnidade":"78ª CIPM","titulo":"0949 9355 0566","antiguidade":5,"nomePai":"Antônio Ervanio Resende Santos","nomeMae":"Maria de Fatima Ribeiro Santos","dataUltimaPromocao":"2012-04-25","classifBgo":"144"},{"id":204,"grau":"Sd 1ª CL PM","nome":"Romario Soares de Magalhaes","nomeGuerra":"Magalhaes","matricula":"30.564.022-2","localTrabalho":"3º Pelotão","dataNasc":"1991-10-10","cpf":"049.020.985-80","rg":"1363614207","admissao":"2014-01-06","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"991671500","tipoSang":"O positivo","email":"romariomagalhaes6@gmail.com","endereco":"Avenida A, Loteamento Sol Nascente, 1088, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"05712292906","categoriaCnh":"AB","validCnh":"2032-09-20","cargo":"Guarda do Fisco","estadoCivil":"Casado(a)","naturalidade":"Jequie-BA","pai":"Vicente Valdomiro de Magalhaes","mae":"Anatalia Soares de Magalhaes","filhos":"Sim","penultimaUnidade":"9º BEIC","titulo":"1320 7446 0507","antiguidade":38,"nomePai":"Vicente Valdomiro de Magalhaes","nomeMae":"Anatalia Soares de Magalhaes","dataUltimaPromocao":"2014-09-19","classifBgo":"32"},{"id":205,"grau":"Sd 1ª CL PM","nome":"Silvana da Silva Souza","nomeGuerra":"Silvana","matricula":"30.564.283-4","localTrabalho":"BCS","dataNasc":"1987-08-08","cpf":"040.562.155-88","rg":"1391169905","admissao":"2014-01-06","planoSaude":"Planserv","grauInstrucao":"Superior","ddd":"77","telefone":"981601437","tipoSang":"O positivo","email":"silvana@pm.ba.gov.br","endereco":"Avenida Primavera, 1994, Primavera, Vitória da Conquista-BA","observacao":"","sexo":"FEM","situacao":"Ativo","origem":"BCS","cnh":"05813651924","categoriaCnh":"B","validCnh":"2022-10-10","cargo":"Administrativo da BCS","estadoCivil":"Solteiro(a)","naturalidade":"Caitite-BA","pai":"Valdemar de Brito Souza","mae":"Ana Pereira da Silva Souza","filhos":"Não","penultimaUnidade":"9º BEIC","titulo":"1179 3521 0523","antiguidade":42,"nomePai":"Valdemar de Brito Souza","nomeMae":"Ana Pereira da Silva Souza","dataUltimaPromocao":"2014-09-19","classifBgo":"111"},{"id":206,"grau":"Sd 1ª CL PM","nome":"Uiliam Alves Almeida","nomeGuerra":"Uiliam","matricula":"30.526.697-1","localTrabalho":"BCS","dataNasc":"1990-03-05","cpf":"032.957.845-66","rg":"1279261439","admissao":"2011-08-02","planoSaude":"Cassi","grauInstrucao":"Superior","ddd":"73","telefone":"73991693403","tipoSang":"AB positivo","email":"uiliamalvesalmeida@gmail.com","endereco":"Rua Claudia Botelho, 17, Candeias, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cnh":"04806363446","categoriaCnh":"AB","validCnh":"2033-12-04","cargo":"Projetos da BCS","estadoCivil":"Casado(a)","naturalidade":"Jequie-BA","pai":"Paulo de Souza Almeida","mae":"Maria Antonia Alves Almeida","filhos":"Não","penultimaUnidade":"19º BPM","titulo":"1288 6172 0507","antiguidade":4,"nomePai":"Paulo de Souza Almeida","nomeMae":"Maria Antonia Alves Almeida","dataUltimaPromocao":"2012-04-25","classifBgo":"143"},{"id":207,"grau":"Sd 1ª CL PM","nome":"Willy Iglezias Bomfim Santos","nomeGuerra":"Willy","matricula":"30.526.705-8","localTrabalho":"BCS","dataNasc":"1986-09-30","cpf":"341.775.858-07","rg":"2046406010","admissao":"2011-08-02","planoSaude":"Planserv","grauInstrucao":"Superior incompleto","ddd":"77","telefone":"998209295","tipoSang":"O positivo","email":"willycpd@gmail.com","endereco":"Avenida Claudia Botelho, 150, Condomínio Vivendas do Bosque, Rua E, Casa 25, Primavera, Vitória da Conquista-BA","observacao":"","sexo":"MASC","situacao":"Ativo","origem":"BCS","cargo":"Projetos da BCS","estadoCivil":"Solteiro(a)","naturalidade":"Sao Paulo-SP","pai":"Antônio Sandro Cerqueira Santos","mae":"Maria de Lourdes Iglezias Bomfim Santos","filhos":"Sim","penultimaUnidade":"19º BPM","titulo":"3258 5249 0191","antiguidade":15,"cnh":"05387540609","categoriaCnh":"AB","validCnh":"2016-02-08","nomePai":"Antônio Sandro Cerqueira Santos","nomeMae":"Maria de Lourdes Iglezias Bomfim Santos","dataUltimaPromocao":"2012-04-25","classifBgo":"227"}];

const INITIAL_LOCATIONS = ["1º PEL/CANDEIAS","1º PEL/CENTRO","1º PEL/ÁREA CENTRAL","2º PEL/ÁREA SUL 1","3º PEL/FISCO","3º PEL/FÓRUM JOÃO MANGABEIRA","3º PEL/POSTO ÁREA SUL","4º PEL/FÓRUM TJBA","5º PEL/PETO","6º PEL/ADJUNTO","6º PEL/SALA DE MEIOS","6º PEL/STM","ADJUNTO DE DIA","ADMINISTRATIVO","AGENTE/SOINT","AGUARDANDO TRANSFERÊNCIA","ALMOXARIFADO","ANALISTA/SOINT","APRESENTADO A BCS","APRESENTADO AO CPR/SO","APRESENTADO AO CPR/SO - PATRULHA SOLIDÁRIA","APRESENTADO AO CPR/SO/CEVAP","APRESENTADO AO CPR/SO/CORREGEDORIA","APRESENTADO AO CPR/SO/SAME","CHEFE/SOINT","CHEFE/SPO","CHEFE/SSO","CICOM","COMANDANTE 1º PEL/CENTRO-CANDEIAS","COMANDANTE 5º PEL/PETO","COMANDO","COORDENADOR DE ÁREA","COORDENADOR DE ÁREA - CMT PCS E 2º PEL","CORSET","FISCO","FORÇA NACIONAL","FÉRIAS","GUARDA DO QUARTEL","JUNTA MÉDICA DE SAÚDE","LIC. P/ TRATAR DE INT. PARTICULAR","LICENÇA-PRÊMIO","MINISTÉRIO PÚBLICO","MOTORISTA DO COMANDANTE","PATRULHA COMUNITÁRIA","PROJETOS","RÁDIO PATRULHA SETOR 1","RÁDIO PATRULHA SETOR 2","SPOI","SSO","SUBCOMANDANTE","SUBCOMANDO","SUBCOMANDO/PROJETOS"];

const RANK_ORDER = ["CEL PM","TEN CEL PM","MAJ PM","CAP PM","1º TEN PM","2º TEN PM","ASP PM","ST PM","1º SGT PM","1º SGT PM RR/C","2º SGT PM","3º SGT PM","AL SGT PM","CB PM","AL CB PM","Sd 1ª CL PM","Sd 2ª CL PM","CIVIL"];
const RANK_ABREV = {"MAJ PM":"Maj","CAP PM":"Cap","1º TEN PM":"1º Ten","2º TEN PM":"2º Ten","ASP PM":"Asp","ST PM":"ST","1º SGT PM":"1º Sgt","1º SGT PM RR/C":"1º Sgt RR","2º SGT PM":"2º Sgt","3º SGT PM":"3º Sgt","AL SGT PM":"Al Sgt","CB PM":"Cb","AL CB PM":"Al Cb","Sd 1ª CL PM":"Sd","CEL PM":"Cel","TEN CEL PM":"TC","CIVIL":"Civil"};

const SITUACOES_ATIVO = ["Ativo","Férias","Atestado","Licença Maternidade","Licença Paternidade","Junta Médica","Licença Prêmio","Afastado","Lic. Int. Particular","Apresentado CPR/SO","Restrição Médica"];

// Dados importados das planilhas (MOTORISTAS, CET, SUBSTITUIÇÃO, FÉRIAS 2026)
const INITIAL_PROMOCOES = [{"id":50000,"policialId":1,"data":"2023-05-26","posto":"MAJ PM","dataPub":"2023-05-26","bgo":"BGO Nº 43","fonte":"planilha_sso"},{"id":50001,"policialId":2,"data":"2025-09-09","posto":"MAJ PM","dataPub":"2025-09-09","bgo":"BGO Nº 1","fonte":"planilha_sso"},{"id":50002,"policialId":3,"data":"2020-02-04","posto":"CAP PM","dataPub":"2020-02-04","bgo":"BGO Nº 1","fonte":"planilha_sso"},{"id":50003,"policialId":4,"data":"2026-02-04","posto":"CAP PM","dataPub":"2026-02-04","bgo":"BGO Nº 65","fonte":"planilha_sso"},{"id":50004,"policialId":5,"data":"2025-09-09","posto":"CAP PM","dataPub":"2025-09-09","bgo":"BGO Nº 40","fonte":"planilha_sso"},{"id":50005,"policialId":6,"data":"2025-06-06","posto":"CAP PM","dataPub":"2025-06-06","bgo":"BGO Nº 32","fonte":"planilha_sso"},{"id":50006,"policialId":7,"data":"2022-06-30","posto":"CAP PM","dataPub":"2022-06-30","bgo":"BGO Nº 1","fonte":"planilha_sso"},{"id":50007,"policialId":8,"data":"2025-03-14","posto":"1º TEN PM","dataPub":"2025-03-14","bgo":"BGO Nº 96","fonte":"planilha_sso"},{"id":50008,"policialId":9,"data":"2020-05-09","posto":"1º TEN PM","dataPub":"2020-05-09","bgo":"BGO Nº 3","fonte":"planilha_sso"},{"id":50009,"policialId":10,"data":"2025-03-14","posto":"1º TEN PM","dataPub":"2025-03-14","bgo":"BGO Nº 30","fonte":"planilha_sso"},{"id":50010,"policialId":11,"data":"2025-12-18","posto":"ASP PM","dataPub":"2025-12-18","bgo":"BGO Nº 1","fonte":"planilha_sso"},{"id":50011,"policialId":12,"data":"2013-11-29","posto":"ASP PM","dataPub":"2013-11-29","bgo":"BGO Nº 61","fonte":"planilha_sso"},{"id":50012,"policialId":13,"data":"2016-12-23","posto":"ST PM","dataPub":"2016-12-23","bgo":"BGO Nº 99","fonte":"planilha_sso"},{"id":50013,"policialId":14,"data":"2024-08-22","posto":"ST PM","dataPub":"2024-08-22","bgo":"BGO Nº 160","fonte":"planilha_sso"},{"id":50014,"policialId":15,"data":"2025-12-18","posto":"ST PM","dataPub":"2025-12-18","bgo":"BGO Nº 95","fonte":"planilha_sso"},{"id":50015,"policialId":16,"data":"2025-02-14","posto":"ST PM","dataPub":"2025-02-14","bgo":"BGO Nº 128","fonte":"planilha_sso"},{"id":50016,"policialId":17,"data":"2025-02-14","posto":"ST PM","dataPub":"2025-02-14","bgo":"BGO Nº 129","fonte":"planilha_sso"},{"id":50017,"policialId":18,"data":"2024-08-22","posto":"ST PM","dataPub":"2024-08-22","bgo":"BGO Nº 114","fonte":"planilha_sso"},{"id":50018,"policialId":19,"data":"2025-12-18","posto":"ST PM","dataPub":"2025-12-18","bgo":"BGO Nº 25","fonte":"planilha_sso"},{"id":50019,"policialId":20,"data":"2025-12-18","posto":"ST PM","dataPub":"2025-12-18","bgo":"BGO Nº 276","fonte":"planilha_sso"},{"id":50020,"policialId":21,"data":"2025-02-14","posto":"ST PM","dataPub":"2025-02-14","bgo":"BGO Nº 152","fonte":"planilha_sso"},{"id":50021,"policialId":22,"data":"2025-01-14","posto":"1º SGT PM","dataPub":"2025-01-14","bgo":"BGO Nº 61","fonte":"planilha_sso"},{"id":50022,"policialId":23,"data":"2025-09-23","posto":"1º SGT PM","dataPub":"2025-09-23","bgo":"BGO Nº 10","fonte":"planilha_sso"},{"id":50023,"policialId":24,"data":"2025-11-25","posto":"1º SGT PM","dataPub":"2025-11-25","bgo":"BGO Nº 689","fonte":"planilha_sso"},{"id":50024,"policialId":25,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 167","fonte":"planilha_sso"},{"id":50025,"policialId":26,"data":"2025-11-25","posto":"1º SGT PM","dataPub":"2025-11-25","bgo":"","fonte":"planilha_sso"},{"id":50026,"policialId":27,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 538","fonte":"planilha_sso"},{"id":50027,"policialId":28,"data":"2025-11-25","posto":"1º SGT PM","dataPub":"2025-11-25","bgo":"BGO Nº 768","fonte":"planilha_sso"},{"id":50028,"policialId":29,"data":"2025-09-23","posto":"1º SGT PM","dataPub":"2025-09-23","bgo":"BGO Nº 33","fonte":"planilha_sso"},{"id":50029,"policialId":30,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 679","fonte":"planilha_sso"},{"id":50030,"policialId":31,"data":"2021-05-07","posto":"1º SGT PM","dataPub":"2021-05-07","bgo":"BGO Nº 87","fonte":"planilha_sso"},{"id":50031,"policialId":32,"data":"2025-11-25","posto":"1º SGT PM","dataPub":"2025-11-25","bgo":"BGO Nº 694","fonte":"planilha_sso"},{"id":50032,"policialId":33,"data":"2021-04-20","posto":"1º SGT PM","dataPub":"2021-04-20","bgo":"BGO Nº 110","fonte":"planilha_sso"},{"id":50033,"policialId":34,"data":"2024-09-25","posto":"1º SGT PM","dataPub":"2024-09-25","bgo":"BGO Nº 207","fonte":"planilha_sso"},{"id":50034,"policialId":35,"data":"2025-11-25","posto":"1º SGT PM","dataPub":"2025-11-25","bgo":"BGO Nº 330","fonte":"planilha_sso"},{"id":50035,"policialId":36,"data":"2025-11-25","posto":"1º SGT PM","dataPub":"2025-11-25","bgo":"BGO Nº 21","fonte":"planilha_sso"},{"id":50036,"policialId":37,"data":"44608","posto":"1º SGT PM","dataPub":"44608","bgo":"BGO Nº 3","fonte":"planilha_sso"},{"id":50037,"policialId":38,"data":"2023-09-29","posto":"1º SGT PM","dataPub":"2023-09-29","bgo":"BGO Nº 440","fonte":"planilha_sso"},{"id":50038,"policialId":39,"data":"2025-11-25","posto":"1º SGT PM","dataPub":"2025-11-25","bgo":"BGO Nº 178","fonte":"planilha_sso"},{"id":50039,"policialId":40,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 278","fonte":"planilha_sso"},{"id":50040,"policialId":41,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 511","fonte":"planilha_sso"},{"id":50041,"policialId":42,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 56","fonte":"planilha_sso"},{"id":50042,"policialId":43,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 366","fonte":"planilha_sso"},{"id":50043,"policialId":44,"data":"2025-01-14","posto":"1º SGT PM","dataPub":"2025-01-14","bgo":"BGO Nº 222","fonte":"planilha_sso"},{"id":50044,"policialId":45,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 138","fonte":"planilha_sso"},{"id":50045,"policialId":46,"data":"2021-10-14","posto":"1º SGT PM","dataPub":"2021-10-14","bgo":"BGO Nº 815","fonte":"planilha_sso"},{"id":50046,"policialId":47,"data":"2025-11-25","posto":"1º SGT PM","dataPub":"2025-11-25","bgo":"BGO Nº 52","fonte":"planilha_sso"},{"id":50047,"policialId":48,"data":"2021-05-06","posto":"1º SGT PM","dataPub":"2021-05-06","bgo":"BGO Nº 167","fonte":"planilha_sso"},{"id":50048,"policialId":49,"data":"2022-12-15","posto":"1º SGT PM","dataPub":"2022-12-15","bgo":"BGO Nº 236","fonte":"planilha_sso"},{"id":50049,"policialId":50,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 400","fonte":"planilha_sso"},{"id":50050,"policialId":51,"data":"2023-11-29","posto":"1º SGT PM","dataPub":"2023-11-29","bgo":"BGO Nº 165","fonte":"planilha_sso"},{"id":50051,"policialId":52,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 548","fonte":"planilha_sso"},{"id":50052,"policialId":53,"data":"2021-05-06","posto":"1º SGT PM","dataPub":"2021-05-06","bgo":"BGO Nº 87","fonte":"planilha_sso"},{"id":50053,"policialId":54,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 813","fonte":"planilha_sso"},{"id":50054,"policialId":55,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 718","fonte":"planilha_sso"},{"id":50055,"policialId":58,"data":"2025-10-14","posto":"AL SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 812","fonte":"planilha_sso"},{"id":50056,"policialId":59,"data":"2025-05-09","posto":"CB PM","dataPub":"2025-05-09","bgo":"BGO Nº 46","fonte":"planilha_sso"},{"id":50057,"policialId":60,"data":"2024-10-10","posto":"CB PM","dataPub":"2024-10-10","bgo":"BGO Nº 201","fonte":"planilha_sso"},{"id":50058,"policialId":61,"data":"2025-05-09","posto":"CB PM","dataPub":"2025-05-09","bgo":"BGO Nº 95","fonte":"planilha_sso"},{"id":50059,"policialId":62,"data":"2023-07-28","posto":"CB PM","dataPub":"2023-07-28","bgo":"BGO Nº 69","fonte":"planilha_sso"},{"id":50060,"policialId":64,"data":"2024-11-08","posto":"CB PM","dataPub":"2024-11-08","bgo":"BGO Nº 122","fonte":"planilha_sso"},{"id":50061,"policialId":65,"data":"2025-09-26","posto":"CB PM","dataPub":"2025-09-26","bgo":"BGO Nº 343","fonte":"planilha_sso"},{"id":50062,"policialId":66,"data":"2023-09-22","posto":"CB PM","dataPub":"2023-09-22","bgo":"BGO Nº 22","fonte":"planilha_sso"},{"id":50063,"policialId":67,"data":"2022-07-11","posto":"CB PM","dataPub":"2022-07-11","bgo":"BGO Nº 51","fonte":"planilha_sso"},{"id":50064,"policialId":68,"data":"2025-05-09","posto":"CB PM","dataPub":"2025-05-09","bgo":"BGO Nº 98","fonte":"planilha_sso"},{"id":50065,"policialId":69,"data":"2024-05-15","posto":"CB PM","dataPub":"2024-05-15","bgo":"BGO Nº 16","fonte":"planilha_sso"},{"id":50066,"policialId":70,"data":"2022-09-23","posto":"CB PM","dataPub":"2022-09-23","bgo":"BGO Nº 166","fonte":"planilha_sso"},{"id":50067,"policialId":71,"data":"2025-09-26","posto":"CB PM","dataPub":"2025-09-26","bgo":"BGO Nº 172","fonte":"planilha_sso"},{"id":50068,"policialId":72,"data":"2023-09-22","posto":"CB PM","dataPub":"2023-09-22","bgo":"BGO Nº 196","fonte":"planilha_sso"},{"id":50069,"policialId":73,"data":"2023-07-28","posto":"CB PM","dataPub":"2023-07-28","bgo":"BGO Nº 178","fonte":"planilha_sso"},{"id":50070,"policialId":74,"data":"2022-08-04","posto":"CB PM","dataPub":"2022-08-04","bgo":"BGO Nº 47","fonte":"planilha_sso"},{"id":50071,"policialId":75,"data":"2022-09-23","posto":"CB PM","dataPub":"2022-09-23","bgo":"BGO Nº 174","fonte":"planilha_sso"},{"id":50072,"policialId":76,"data":"2024-11-08","posto":"CB PM","dataPub":"2024-11-08","bgo":"BGO Nº 131","fonte":"planilha_sso"},{"id":50073,"policialId":77,"data":"2025-05-09","posto":"CB PM","dataPub":"2025-05-09","bgo":"BGO Nº 104","fonte":"planilha_sso"},{"id":50074,"policialId":78,"data":"2023-09-22","posto":"CB PM","dataPub":"2023-09-22","bgo":"BGO Nº 167","fonte":"planilha_sso"},{"id":50075,"policialId":79,"data":"2025-09-26","posto":"CB PM","dataPub":"2025-09-26","bgo":"BGO Nº 256","fonte":"planilha_sso"},{"id":50076,"policialId":80,"data":"2024-08-01","posto":"CB PM","dataPub":"2024-08-01","bgo":"BGO Nº 17","fonte":"planilha_sso"},{"id":50077,"policialId":81,"data":"2023-07-28","posto":"CB PM","dataPub":"2023-07-28","bgo":"BGO Nº 210","fonte":"planilha_sso"},{"id":50078,"policialId":82,"data":"2023-04-28","posto":"CB PM","dataPub":"2023-04-28","bgo":"BGO Nº 11","fonte":"planilha_sso"},{"id":50079,"policialId":83,"data":"2025-09-16","posto":"CB PM","dataPub":"2025-09-16","bgo":"BGO Nº 136","fonte":"planilha_sso"},{"id":50080,"policialId":84,"data":"2022-09-23","posto":"CB PM","dataPub":"2022-09-23","bgo":"BGO Nº 231","fonte":"planilha_sso"},{"id":50081,"policialId":85,"data":"2025-09-16","posto":"CB PM","dataPub":"2025-09-16","bgo":"BGO Nº 55","fonte":"planilha_sso"},{"id":50082,"policialId":86,"data":"2022-07-11","posto":"CB PM","dataPub":"2022-07-11","bgo":"BGO Nº 18","fonte":"planilha_sso"},{"id":50083,"policialId":87,"data":"2022-04-18","posto":"CB PM","dataPub":"2022-04-18","bgo":"BGO Nº 76","fonte":"planilha_sso"},{"id":50084,"policialId":88,"data":"2023-12-21","posto":"CB PM","dataPub":"2023-12-21","bgo":"BGO Nº 152","fonte":"planilha_sso"},{"id":50085,"policialId":89,"data":"2024-07-25","posto":"CB PM","dataPub":"2024-07-25","bgo":"BGO Nº 130","fonte":"planilha_sso"},{"id":50086,"policialId":90,"data":"2025-09-26","posto":"CB PM","dataPub":"2025-09-26","bgo":"BGO Nº 315","fonte":"planilha_sso"},{"id":50087,"policialId":91,"data":"2025-09-26","posto":"CB PM","dataPub":"2025-09-26","bgo":"BGO Nº 218","fonte":"planilha_sso"},{"id":50088,"policialId":92,"data":"2023-12-21","posto":"CB PM","dataPub":"2023-12-21","bgo":"BGO Nº 138","fonte":"planilha_sso"},{"id":50089,"policialId":93,"data":"2025-05-09","posto":"CB PM","dataPub":"2025-05-09","bgo":"BGO Nº 67","fonte":"planilha_sso"},{"id":50090,"policialId":94,"data":"2025-07-18","posto":"CB PM","dataPub":"2025-07-18","bgo":"BGO Nº 170","fonte":"planilha_sso"},{"id":50091,"policialId":95,"data":"2023-09-22","posto":"CB PM","dataPub":"2023-09-22","bgo":"BGO Nº 409","fonte":"planilha_sso"},{"id":50092,"policialId":96,"data":"2024-11-08","posto":"CB PM","dataPub":"2024-11-08","bgo":"BGO Nº 103","fonte":"planilha_sso"},{"id":50093,"policialId":97,"data":"2010-09-16","posto":"AL CB PM","dataPub":"2010-09-16","bgo":"BGO Nº 544","fonte":"planilha_sso"},{"id":50094,"policialId":98,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 1067","fonte":"planilha_sso"},{"id":50095,"policialId":99,"data":"2017-01-27","posto":"Sd 1ª CL PM","dataPub":"2017-01-27","bgo":"BGO Nº 4","fonte":"planilha_sso"},{"id":50096,"policialId":100,"data":"2016-02-19","posto":"Sd 1ª CL PM","dataPub":"2016-02-19","bgo":"BGO Nº 373","fonte":"planilha_sso"},{"id":50097,"policialId":101,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 1082","fonte":"planilha_sso"},{"id":50098,"policialId":102,"data":"2025-12-05","posto":"Sd 1ª CL PM","dataPub":"2025-12-05","bgo":"BGO Nº 768","fonte":"planilha_sso"},{"id":50099,"policialId":103,"data":"2025-12-05","posto":"Sd 1ª CL PM","dataPub":"2025-12-05","bgo":"BGO Nº 812","fonte":"planilha_sso"},{"id":50100,"policialId":104,"data":"2024-12-20","posto":"Sd 1ª CL PM","dataPub":"2024-12-20","bgo":"BGO Nº 702","fonte":"planilha_sso"},{"id":50101,"policialId":105,"data":"2023-03-31","posto":"Sd 1ª CL PM","dataPub":"2023-03-31","bgo":"BGO Nº 405","fonte":"planilha_sso"},{"id":50102,"policialId":106,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 1496","fonte":"planilha_sso"},{"id":50103,"policialId":107,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 235","fonte":"planilha_sso"},{"id":50104,"policialId":108,"data":"2025-12-05","posto":"Sd 1ª CL PM","dataPub":"2025-12-05","bgo":"BGO Nº 818","fonte":"planilha_sso"},{"id":50105,"policialId":109,"data":"2023-07-21","posto":"Sd 1ª CL PM","dataPub":"2023-07-21","bgo":"BGO Nº 5","fonte":"planilha_sso"},{"id":50106,"policialId":110,"data":"2019-05-31","posto":"Sd 1ª CL PM","dataPub":"2019-05-31","bgo":"BGO Nº 64","fonte":"planilha_sso"},{"id":50107,"policialId":111,"data":"2022-04-29","posto":"Sd 1ª CL PM","dataPub":"2022-04-29","bgo":"BGO Nº 362","fonte":"planilha_sso"},{"id":50108,"policialId":112,"data":"2016-04-01","posto":"Sd 1ª CL PM","dataPub":"2016-04-01","bgo":"BGO Nº 815","fonte":"planilha_sso"},{"id":50109,"policialId":113,"data":"2016-04-01","posto":"Sd 1ª CL PM","dataPub":"2016-04-01","bgo":"BGO Nº 612","fonte":"planilha_sso"},{"id":50110,"policialId":114,"data":"2016-02-19","posto":"Sd 1ª CL PM","dataPub":"2016-02-19","bgo":"BGO Nº 196","fonte":"planilha_sso"},{"id":50111,"policialId":115,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 1902","fonte":"planilha_sso"},{"id":50112,"policialId":116,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 31","fonte":"planilha_sso"},{"id":50113,"policialId":117,"data":"2014-09-19","posto":"Sd 1ª CL PM","dataPub":"2014-09-19","bgo":"BGO Nº 152","fonte":"planilha_sso"},{"id":50114,"policialId":118,"data":"2019-05-31","posto":"Sd 1ª CL PM","dataPub":"2019-05-31","bgo":"BGO Nº 221","fonte":"planilha_sso"},{"id":50115,"policialId":119,"data":"2024-12-20","posto":"Sd 1ª CL PM","dataPub":"2024-12-20","bgo":"BGO Nº 758","fonte":"planilha_sso"},{"id":50116,"policialId":120,"data":"2023-03-31","posto":"Sd 1ª CL PM","dataPub":"2023-03-31","bgo":"BGO Nº 965","fonte":"planilha_sso"},{"id":50117,"policialId":121,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 319","fonte":"planilha_sso"},{"id":50118,"policialId":122,"data":"2024-12-20","posto":"Sd 1ª CL PM","dataPub":"2024-12-20","bgo":"BGO Nº 1144","fonte":"planilha_sso"},{"id":50119,"policialId":123,"data":"2025-12-05","posto":"Sd 1ª CL PM","dataPub":"2025-12-05","bgo":"BGO Nº 1054","fonte":"planilha_sso"},{"id":50120,"policialId":124,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 174","fonte":"planilha_sso"},{"id":50121,"policialId":125,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 188","fonte":"planilha_sso"},{"id":50122,"policialId":126,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 687","fonte":"planilha_sso"},{"id":50123,"policialId":127,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 231","fonte":"planilha_sso"},{"id":50124,"policialId":128,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 550","fonte":"planilha_sso"},{"id":50125,"policialId":129,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 1445","fonte":"planilha_sso"},{"id":50126,"policialId":130,"data":"2021-07-20","posto":"Sd 1ª CL PM","dataPub":"2021-07-20","bgo":"BGO Nº 3","fonte":"planilha_sso"},{"id":50127,"policialId":131,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 953","fonte":"planilha_sso"},{"id":50128,"policialId":132,"data":"2014-09-19","posto":"Sd 1ª CL PM","dataPub":"2014-09-19","bgo":"BGO Nº 16","fonte":"planilha_sso"},{"id":50129,"policialId":133,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 1951","fonte":"planilha_sso"},{"id":50130,"policialId":134,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 297","fonte":"planilha_sso"},{"id":50131,"policialId":135,"data":"2022-04-29","posto":"Sd 1ª CL PM","dataPub":"2022-04-29","bgo":"BGO Nº 807","fonte":"planilha_sso"},{"id":50132,"policialId":136,"data":"2024-12-20","posto":"Sd 1ª CL PM","dataPub":"2024-12-20","bgo":"BGO Nº 957","fonte":"planilha_sso"},{"id":50133,"policialId":137,"data":"2019-05-31","posto":"Sd 1ª CL PM","dataPub":"2019-05-31","bgo":"BGO Nº 69","fonte":"planilha_sso"},{"id":50134,"policialId":138,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 419","fonte":"planilha_sso"},{"id":50135,"policialId":139,"data":"2016-04-01","posto":"Sd 1ª CL PM","dataPub":"2016-04-01","bgo":"BGO Nº 592","fonte":"planilha_sso"},{"id":50136,"policialId":140,"data":"2014-09-19","posto":"Sd 1ª CL PM","dataPub":"2014-09-19","bgo":"BGO Nº 569","fonte":"planilha_sso"},{"id":50137,"policialId":141,"data":"2016-02-19","posto":"Sd 1ª CL PM","dataPub":"2016-02-19","bgo":"BGO Nº 312","fonte":"planilha_sso"},{"id":50138,"policialId":142,"data":"2025-12-05","posto":"Sd 1ª CL PM","dataPub":"2025-12-05","bgo":"BGO Nº 877","fonte":"planilha_sso"},{"id":50139,"policialId":143,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 156","fonte":"planilha_sso"},{"id":50140,"policialId":144,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 367","fonte":"planilha_sso"},{"id":50141,"policialId":145,"data":"2025-12-05","posto":"Sd 1ª CL PM","dataPub":"2025-12-05","bgo":"BGO Nº 886","fonte":"planilha_sso"},{"id":50142,"policialId":146,"data":"2016-04-01","posto":"Sd 1ª CL PM","dataPub":"2016-04-01","bgo":"BGO Nº 885","fonte":"planilha_sso"},{"id":50143,"policialId":147,"data":"2016-04-01","posto":"Sd 1ª CL PM","dataPub":"2016-04-01","bgo":"BGO Nº 178","fonte":"planilha_sso"},{"id":50144,"policialId":148,"data":"2016-02-19","posto":"Sd 1ª CL PM","dataPub":"2016-02-19","bgo":"BGO Nº 162","fonte":"planilha_sso"},{"id":50145,"policialId":149,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 1441","fonte":"planilha_sso"},{"id":50146,"policialId":150,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 209","fonte":"planilha_sso"},{"id":50147,"policialId":151,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 818","fonte":"planilha_sso"},{"id":50148,"policialId":152,"data":"2010-09-16","posto":"Sd 1ª CL PM","dataPub":"2010-09-16","bgo":"BGO Nº 926","fonte":"planilha_sso"},{"id":50149,"policialId":153,"data":"2014-09-19","posto":"Sd 1ª CL PM","dataPub":"2014-09-19","bgo":"BGO Nº 332","fonte":"planilha_sso"},{"id":50150,"policialId":154,"data":"2025-12-05","posto":"Sd 1ª CL PM","dataPub":"2025-12-05","bgo":"BGO Nº 106","fonte":"planilha_sso"},{"id":50151,"policialId":155,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 1041","fonte":"planilha_sso"},{"id":50152,"policialId":156,"data":"2016-04-01","posto":"Sd 1ª CL PM","dataPub":"2016-04-01","bgo":"BGO Nº 641","fonte":"planilha_sso"},{"id":50153,"policialId":157,"data":"2020-04-01","posto":"Sd 1ª CL PM","dataPub":"2020-04-01","bgo":"BGO Nº 11","fonte":"planilha_sso"},{"id":50154,"policialId":158,"data":"2014-09-19","posto":"Sd 1ª CL PM","dataPub":"2014-09-19","bgo":"BGO Nº 69","fonte":"planilha_sso"},{"id":50155,"policialId":159,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 295","fonte":"planilha_sso"},{"id":50156,"policialId":160,"data":"2014-09-19","posto":"Sd 1ª CL PM","dataPub":"2014-09-19","bgo":"BGO Nº 57","fonte":"planilha_sso"},{"id":50157,"policialId":161,"data":"2015-05-29","posto":"Sd 1ª CL PM","dataPub":"2015-05-29","bgo":"BGO Nº 23","fonte":"planilha_sso"},{"id":50158,"policialId":162,"data":"2024-12-20","posto":"Sd 1ª CL PM","dataPub":"2024-12-20","bgo":"BGO Nº 666","fonte":"planilha_sso"},{"id":50159,"policialId":163,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 1900","fonte":"planilha_sso"},{"id":50160,"policialId":164,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 105","fonte":"planilha_sso"},{"id":50161,"policialId":165,"data":"2022-04-29","posto":"Sd 1ª CL PM","dataPub":"2022-04-29","bgo":"BGO Nº 808","fonte":"planilha_sso"},{"id":50162,"policialId":166,"data":"2014-09-19","posto":"Sd 1ª CL PM","dataPub":"2014-09-19","bgo":"BGO Nº 27","fonte":"planilha_sso"},{"id":50163,"policialId":167,"data":"2014-09-19","posto":"Sd 1ª CL PM","dataPub":"2014-09-19","bgo":"BGO Nº 109","fonte":"planilha_sso"},{"id":50164,"policialId":169,"data":"2025-12-18","posto":"ST PM","dataPub":"2025-12-18","bgo":"BGO Nº 158","fonte":"planilha_sso"},{"id":50165,"policialId":170,"data":"2023-09-20","posto":"1º SGT PM","dataPub":"2023-09-20","bgo":"BGO Nº 216","fonte":"planilha_sso"},{"id":50166,"policialId":171,"data":"2021-12-09","posto":"1º SGT PM","dataPub":"2021-12-09","bgo":"BGO Nº 121","fonte":"planilha_sso"},{"id":50167,"policialId":172,"data":"2024-09-25","posto":"1º SGT PM","dataPub":"2024-09-25","bgo":"BGO Nº 269","fonte":"planilha_sso"},{"id":50168,"policialId":173,"data":"2024-01-01","posto":"1º SGT PM","dataPub":"2024-01-01","bgo":"BGO Nº 241","fonte":"planilha_sso"},{"id":50169,"policialId":174,"data":"2025-10-14","posto":"1º SGT PM","dataPub":"2025-10-14","bgo":"BGO Nº 734","fonte":"planilha_sso"},{"id":50170,"policialId":175,"data":"2023-12-21","posto":"CB PM","dataPub":"2023-12-21","bgo":"BGO Nº 49","fonte":"planilha_sso"},{"id":50171,"policialId":176,"data":"2022-07-29","posto":"CB PM","dataPub":"2022-07-29","bgo":"BGO Nº 231","fonte":"planilha_sso"},{"id":50172,"policialId":178,"data":"2023-09-22","posto":"CB PM","dataPub":"2023-09-22","bgo":"BGO Nº 356","fonte":"planilha_sso"},{"id":50173,"policialId":179,"data":"2022-07-29","posto":"CB PM","dataPub":"2022-07-29","bgo":"BGO Nº 186","fonte":"planilha_sso"},{"id":50174,"policialId":180,"data":"2016-02-19","posto":"Sd 1ª CL PM","dataPub":"2016-02-19","bgo":"BGO Nº 173","fonte":"planilha_sso"},{"id":50175,"policialId":181,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 415","fonte":"planilha_sso"},{"id":50176,"policialId":182,"data":"2017-01-27","posto":"Sd 1ª CL PM","dataPub":"2017-01-27","bgo":"BGO Nº 66","fonte":"planilha_sso"},{"id":50177,"policialId":183,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 212","fonte":"planilha_sso"},{"id":50178,"policialId":184,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 708","fonte":"planilha_sso"},{"id":50179,"policialId":185,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 395","fonte":"planilha_sso"},{"id":50180,"policialId":186,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 938","fonte":"planilha_sso"},{"id":50181,"policialId":187,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 524","fonte":"planilha_sso"},{"id":50182,"policialId":188,"data":"2017-01-27","posto":"Sd 1ª CL PM","dataPub":"2017-01-27","bgo":"BGO Nº 32","fonte":"planilha_sso"},{"id":50183,"policialId":189,"data":"2014-05-19","posto":"Sd 1ª CL PM","dataPub":"2014-05-19","bgo":"BGO Nº 3","fonte":"planilha_sso"},{"id":50184,"policialId":190,"data":"2017-07-06","posto":"Sd 1ª CL PM","dataPub":"2017-07-06","bgo":"BGO Nº 234","fonte":"planilha_sso"},{"id":50185,"policialId":191,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 155","fonte":"planilha_sso"},{"id":50186,"policialId":192,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 248","fonte":"planilha_sso"},{"id":50187,"policialId":193,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 644","fonte":"planilha_sso"},{"id":50188,"policialId":194,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 548","fonte":"planilha_sso"},{"id":50189,"policialId":195,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 443","fonte":"planilha_sso"},{"id":50190,"policialId":196,"data":"2025-12-05","posto":"Sd 1ª CL PM","dataPub":"2025-12-05","bgo":"BGO Nº 674","fonte":"planilha_sso"},{"id":50191,"policialId":197,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 360","fonte":"planilha_sso"},{"id":50192,"policialId":198,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 222","fonte":"planilha_sso"},{"id":50193,"policialId":199,"data":"2014-09-19","posto":"Sd 1ª CL PM","dataPub":"2014-09-19","bgo":"BGO Nº 178","fonte":"planilha_sso"},{"id":50194,"policialId":200,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 290","fonte":"planilha_sso"},{"id":50195,"policialId":201,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 228","fonte":"planilha_sso"},{"id":50196,"policialId":202,"data":"2019-01-25","posto":"Sd 1ª CL PM","dataPub":"2019-01-25","bgo":"BGO Nº 1108","fonte":"planilha_sso"},{"id":50197,"policialId":203,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 144","fonte":"planilha_sso"},{"id":50198,"policialId":204,"data":"2014-09-19","posto":"Sd 1ª CL PM","dataPub":"2014-09-19","bgo":"BGO Nº 32","fonte":"planilha_sso"},{"id":50199,"policialId":205,"data":"2014-09-19","posto":"Sd 1ª CL PM","dataPub":"2014-09-19","bgo":"BGO Nº 111","fonte":"planilha_sso"},{"id":50200,"policialId":206,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 143","fonte":"planilha_sso"},{"id":50201,"policialId":207,"data":"2012-04-25","posto":"Sd 1ª CL PM","dataPub":"2012-04-25","bgo":"BGO Nº 227","fonte":"planilha_sso"}];

const INITIAL_VANTAGENS_DATA = [{"id":1,"policialMatricula":"30390771","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":2,"policialMatricula":"30429535","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":3,"policialMatricula":"30389687","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":4,"policialMatricula":"30479332","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":5,"policialMatricula":"30428812","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":6,"policialMatricula":"30295847","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":7,"policialMatricula":"30391139","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":8,"policialMatricula":"30389725","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":9,"policialMatricula":"30437167","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":10,"policialMatricula":"30389617","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":11,"policialMatricula":"30390762","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":12,"policialMatricula":"30390760","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":13,"policialMatricula":"30481245","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":14,"policialMatricula":"30505474","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":15,"policialMatricula":"30481393","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":16,"policialMatricula":"30481194","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":17,"policialMatricula":"30505877","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":18,"policialMatricula":"30481540","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":19,"policialMatricula":"30484230","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":20,"policialMatricula":"30481370","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":21,"policialMatricula":"30481296","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":22,"policialMatricula":"30481523","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":23,"policialMatricula":"30481452","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":24,"policialMatricula":"30505915","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":25,"policialMatricula":"30480525","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":26,"policialMatricula":"30501159","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":27,"policialMatricula":"30507510","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":28,"policialMatricula":"30505955","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":29,"policialMatricula":"30506813","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":30,"policialMatricula":"30526028","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":31,"policialMatricula":"30583435","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":32,"policialMatricula":"92137041","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":33,"policialMatricula":"92137093","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":34,"policialMatricula":"30526042","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":35,"policialMatricula":"92081598","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":36,"policialMatricula":"30526054","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":37,"policialMatricula":"30526058","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":38,"policialMatricula":"30646132","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":39,"policialMatricula":"30526078","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":40,"policialMatricula":"92047852","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":41,"policialMatricula":"30601901","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":42,"policialMatricula":"30557455","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":43,"policialMatricula":"30643642","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":44,"policialMatricula":"30643688","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":45,"policialMatricula":"30653702","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":46,"policialMatricula":"92110401","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":47,"policialMatricula":"92137086","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":48,"policialMatricula":"30526160","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":49,"policialMatricula":"30526159","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":50,"policialMatricula":"30526191","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":51,"policialMatricula":"30526235","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":52,"policialMatricula":"92048251","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":53,"policialMatricula":"30526237","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":54,"policialMatricula":"30526393","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":55,"policialMatricula":"30644417","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":56,"policialMatricula":"30526409","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":57,"policialMatricula":"30526423","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":58,"policialMatricula":"30564421","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":59,"policialMatricula":"30526481","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":60,"policialMatricula":"30564354","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":61,"policialMatricula":"92136666","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":62,"policialMatricula":"30583534","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":63,"policialMatricula":"30526508","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":64,"policialMatricula":"30526568","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":65,"policialMatricula":"92137064","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-01-05","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":66,"policialMatricula":"30644896","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":67,"policialMatricula":"30587208","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":68,"policialMatricula":"30583894","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":69,"policialMatricula":"30527077","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":70,"policialMatricula":"30564022","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":71,"policialMatricula":"30645063","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":72,"policialMatricula":"30564040","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":73,"policialMatricula":"30564283","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":74,"policialMatricula":"30587017","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":75,"policialMatricula":"30564226","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":76,"policialMatricula":"30563458","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":77,"policialMatricula":"30526697","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":78,"policialMatricula":"30645491","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":79,"policialMatricula":"30526703","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":80,"policialMatricula":"30564263","categoria":"cet","tipo":"4 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":81,"policialMatricula":"30505885","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":82,"policialMatricula":"30389626","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":83,"policialMatricula":"30430080","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":84,"policialMatricula":"30389728","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":85,"policialMatricula":"30505868","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":86,"policialMatricula":"30481270","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":87,"policialMatricula":"30506872","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":88,"policialMatricula":"30481450","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":89,"policialMatricula":"30511491","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":90,"policialMatricula":"30479090","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":91,"policialMatricula":"30583418","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":92,"policialMatricula":"30643032","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":93,"policialMatricula":"30643410","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":94,"policialMatricula":"92069885","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":95,"policialMatricula":"30643441","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":96,"policialMatricula":"30583640","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":97,"policialMatricula":"30564279","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":98,"policialMatricula":"92069968","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":99,"policialMatricula":"92110576","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":100,"policialMatricula":"30526234","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":101,"policialMatricula":"30643915","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":102,"policialMatricula":"30645395","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":103,"policialMatricula":"30647478","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":104,"policialMatricula":"92110933","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":105,"policialMatricula":"30653730","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":106,"policialMatricula":"30645239","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":107,"policialMatricula":"92111130","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":108,"policialMatricula":"92048258","categoria":"cet","tipo":"2 Rodas","dataInicio":"2026-04-01","bio":"BIO Nº 008 DE 16 A 30/04/2026","dataFim":"","bioFim":""},{"id":109,"policialMatricula":"92100607","categoria":"subst","grauSubst":"1º TEN PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":110,"policialMatricula":"30294196","categoria":"subst","grauSubst":"1º TEN PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":111,"policialMatricula":"30285764","categoria":"subst","grauSubst":"1º TEN PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":112,"policialMatricula":"30294449","categoria":"subst","grauSubst":"1º TEN PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":113,"policialMatricula":"30285086","categoria":"subst","grauSubst":"1º TEN PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":114,"policialMatricula":"30295609","categoria":"subst","grauSubst":"1º TEN PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":115,"policialMatricula":"30285788","categoria":"subst","grauSubst":"1º TEN PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":116,"policialMatricula":"30295851","categoria":"subst","grauSubst":"1º TEN PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":117,"policialMatricula":"30295406","categoria":"subst","grauSubst":"1º TEN PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":118,"policialMatricula":"30295968","categoria":"subst","grauSubst":"1º TEN PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":119,"policialMatricula":"30295681","categoria":"subst","grauSubst":"1º TEN PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":120,"policialMatricula":"30505858","categoria":"subst","grauSubst":"ST PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":121,"policialMatricula":"30479332","categoria":"subst","grauSubst":"ST PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":122,"policialMatricula":"30337921","categoria":"subst","grauSubst":"ST PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":123,"policialMatricula":"30389622","categoria":"subst","grauSubst":"ST PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":124,"policialMatricula":"30389687","categoria":"subst","grauSubst":"ST PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":125,"policialMatricula":"30295857","categoria":"subst","grauSubst":"ST PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":126,"policialMatricula":"30389626","categoria":"subst","grauSubst":"ST PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":127,"policialMatricula":"30296882","categoria":"subst","grauSubst":"ST PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":128,"policialMatricula":"30391130","categoria":"subst","grauSubst":"ST PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":129,"policialMatricula":"30481370","categoria":"subst","grauSubst":"1º SGT PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":130,"policialMatricula":"30511491","categoria":"subst","grauSubst":"1º SGT PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":131,"policialMatricula":"30643410","categoria":"subst","grauSubst":"1º SGT PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":132,"policialMatricula":"92069885","categoria":"subst","grauSubst":"1º SGT PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":133,"policialMatricula":"30564279","categoria":"subst","grauSubst":"1º SGT PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":134,"policialMatricula":"30653730","categoria":"subst","grauSubst":"1º SGT PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":135,"policialMatricula":"30587208","categoria":"subst","grauSubst":"1º SGT PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":136,"policialMatricula":"30564226","categoria":"subst","grauSubst":"1º SGT PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":137,"policialMatricula":"30583435","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":138,"policialMatricula":"30526054","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":139,"policialMatricula":"30653794","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":140,"policialMatricula":"30526078","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":141,"policialMatricula":"92047852","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":142,"policialMatricula":"30586826","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":143,"policialMatricula":"30583640","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":144,"policialMatricula":"30643688","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":145,"policialMatricula":"30526234","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":146,"policialMatricula":"30643915","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":147,"policialMatricula":"30526160","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":148,"policialMatricula":"30526191","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":149,"policialMatricula":"30562879","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":150,"policialMatricula":"30644417","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":151,"policialMatricula":"30526423","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":152,"policialMatricula":"30564421","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":153,"policialMatricula":"30526568","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":154,"policialMatricula":"30583894","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":155,"policialMatricula":"30526618","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":156,"policialMatricula":"30587017","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":157,"policialMatricula":"92015716","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":158,"policialMatricula":"30563458","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":159,"policialMatricula":"30526703","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":160,"policialMatricula":"92048258","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":161,"policialMatricula":"30564263","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":162,"policialMatricula":"30526697","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":163,"policialMatricula":"30526613","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":164,"policialMatricula":"30526159","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":165,"policialMatricula":"30526508","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":166,"policialMatricula":"30526147","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":167,"policialMatricula":"30526040","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":168,"policialMatricula":"30526481","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":169,"policialMatricula":"30526705","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":170,"policialMatricula":"30528700","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":171,"policialMatricula":"30526690","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":172,"policialMatricula":"30526235","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""},{"id":173,"policialMatricula":"30526130","categoria":"subst","grauSubst":"CB PM","dataInicio":"2026-04-16","bio":"BIO Nº 008 DE 16/04/2026 A 30/04/2026","dataFim":"","bioFim":""}];
const INITIAL_FERIAS_2026 = [{"id":10000,"tipo":"planejamento","mes":1,"ano":2026,"titulo":"Janeiro / 2026","dataInicio":"2026-01-01","dataFim":"2026-01-30","concluido":false,"periodoAqDe":"2025","periodoAqAte":"2026","participantes":[{"id":1000000,"policialMatricula":"305634205","nome":"Ian Diógenes Pitágoras Ribeiro","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"24","periodoAqAte":"25"},{"id":1000001,"policialMatricula":"30285086","nome":"Eleneide Alves de Araujo","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2024","periodoAqAte":"2025"},{"id":1000002,"policialMatricula":"30490162","nome":"Clotildes da Silva Santos","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000003,"policialMatricula":"30506266","nome":"Rafael Jesus de Queiroz","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000004,"policialMatricula":"305642266","nome":"Taluana Alves De Oliveira","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2024","periodoAqAte":"2025"},{"id":1000005,"policialMatricula":"30481457","nome":"Paulo Victor Ferreira de Oliveira","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000006,"policialMatricula":"30506876","nome":"Israel de Souza Bonfim","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000007,"policialMatricula":"30505915","nome":"Lourival Sancho Viana Filho","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000008,"policialMatricula":"30506876","nome":"Israel de Souza Bonfim","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000009,"policialMatricula":"305261599","nome":"Hélzio Leão Souza","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"24","periodoAqAte":"25"},{"id":1000010,"policialMatricula":"305260404","nome":"Boaventura Da Rocha Lemos Neto","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"24","periodoAqAte":"25"},{"id":1000011,"policialMatricula":"305265682","nome":"Marta Valéria Dos Santos","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"24","periodoAqAte":"25"},{"id":1000012,"policialMatricula":"305287008","nome":"Marcos Alves De Souza","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"24","periodoAqAte":"25"},{"id":1000013,"policialMatricula":"305262359","nome":"Jean Márcio Dias Da Cruz","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"24","periodoAqAte":"25"},{"id":1000014,"policialMatricula":"92081598","nome":"Carlos Eduardo Carvalho Oliveira","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"24","periodoAqAte":"25"},{"id":1000015,"policialMatricula":"30505877","nome":"Cleber Sales Duarte","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"24","periodoAqAte":"25"},{"id":1000016,"policialMatricula":"305262692","nome":"Mauro Pereira Benevides","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"24","periodoAqAte":"25"},{"id":1000017,"policialMatricula":"305261874","nome":"HUMBERTO MENDES RIBEIRO","dataInicio":"2026-01-01","dataFim":"2026-01-15","tipo":"FÉRIAS","periodoAqDe":"24","periodoAqAte":"25"},{"id":1000018,"policialMatricula":"304815400","nome":"CRISTIANO AMÉRICO DIAS SANTOS","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000019,"policialMatricula":"304295359","nome":"ALEX FERRAZ CORDEIRO","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000020,"policialMatricula":"303911300","nome":"WARLEY DE OLIVEIRA RIBEIRO","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000021,"policialMatricula":"30294449","nome":"Anderson de Souza Silva","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000022,"policialMatricula":"303896720","nome":"JOSÉ LÚCIO SANTOS TAVARES","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"24","periodoAqAte":"25"},{"id":1000023,"policialMatricula":"30391139","nome":"Marcondes de Souza Lobo","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000024,"policialMatricula":"303897289","nome":"Ruberlando Vieira Soares","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"24","periodoAqAte":"25"},{"id":1000025,"policialMatricula":"30562879","nome":"Isaac Rodrigues Santana","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000026,"policialMatricula":"30505940","nome":"Rogerio dos Santos Teixeira","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000027,"policialMatricula":"30506813","nome":"Yolando Costa Correia Junior","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000028,"policialMatricula":"30526234","nome":"Givanildo Leite de Andrade","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000029,"policialMatricula":"30526130","nome":"Francois Assis Macedo Lopes Junior","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000030,"policialMatricula":"30601040","nome":"Alessandra Teixeira dos Santos","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000031,"policialMatricula":"30653702","nome":"Eron Marques Pereira da Silva","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000032,"policialMatricula":"30437555","nome":"Ronaldo Sousa Mota Bispo","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000033,"policialMatricula":"30437167","nome":"Noelio Barbosa Goes da Silva","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000034,"policialMatricula":"30491530","nome":"Patrick Ribeiro Alves de Oliveira","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000035,"policialMatricula":"92053756","nome":"Anderson Henrique de Oliveira Santana","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000036,"policialMatricula":"92111104","nome":"Mauricio Silva Rocha Junior","dataInicio":"2026-01-01","dataFim":"2026-01-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"}]},{"id":10001,"tipo":"planejamento","mes":2,"ano":2026,"titulo":"Fevereiro / 2026","dataInicio":"2026-02-01","dataFim":"2026-02-30","concluido":false,"periodoAqDe":"2025","periodoAqAte":"2026","participantes":[{"id":1000100,"policialMatricula":"30586860","nome":"LARISSA SANTOS RODRIGUES","dataInicio":"2026-02-01","dataFim":"2026-02-30","tipo":"FÉRIAS","periodoAqDe":"2024","periodoAqAte":"2025"}]},{"id":10002,"tipo":"planejamento","mes":3,"ano":2026,"titulo":"Março / 2026","dataInicio":"2026-03-01","dataFim":"2026-03-30","concluido":false,"periodoAqDe":"2025","periodoAqAte":"2026","participantes":[{"id":1000200,"policialMatricula":"30535685","nome":"Marcus Vinicius Sampaio Rodrigues","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000201,"policialMatricula":"30647095","nome":"John Hebert Moura Santos","dataInicio":"2026-03-02","dataFim":"2026-03-21","tipo":"FÉRIAS","periodoAqDe":"2023","periodoAqAte":"2024"},{"id":1000202,"policialMatricula":"30429665","nome":"Radames Venturini","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000203,"policialMatricula":"30511590","nome":"Ranie Santos Bittencourt","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000204,"policialMatricula":"30492205","nome":"Joselane Flora de Azevedo Cardoso","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000205,"policialMatricula":"30505955","nome":"William Andrade Santos","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000206,"policialMatricula":"30526058","nome":"Dacio Buriti de Almeida","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000207,"policialMatricula":"30557455","nome":"Diego Silva Gusmao","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000208,"policialMatricula":"30601887","nome":"Anne Daisy Cabral Sampaio","dataInicio":"2026-03-22","dataFim":"2026-04-20","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000209,"policialMatricula":"92110576","nome":"Francisco de Jesus Costa Andrade","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000210,"policialMatricula":"30526690","nome":"Thiago Moises Almeida Santos","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000211,"policialMatricula":"92048251","nome":"Jeferson Paiva de Oliveira","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000212,"policialMatricula":"30526130","nome":"Francois Assis Macedo Lopes Junior","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000213,"policialMatricula":"30526269","nome":"Mauro Pereira Benevides","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000214,"policialMatricula":"30526409","nome":"Jose Antonio Teixeira Alves","dataInicio":"2026-03-01","dataFim":"2026-03-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000215,"policialMatricula":"304901625","nome":"Clotildes da Silva Santos","dataInicio":"2026-03-20","dataFim":"2026-06-17","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2018","periodoAqAte":"2023"}]},{"id":10003,"tipo":"planejamento","mes":4,"ano":2026,"titulo":"Abril / 2026","dataInicio":"2026-04-01","dataFim":"2026-04-30","concluido":false,"periodoAqDe":"2025","periodoAqAte":"2026","participantes":[{"id":1000300,"policialMatricula":"","nome":"ORLINS DOS SANTOS ALMEIDA","dataInicio":"2026-04-27","dataFim":"2026-05-16","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000301,"policialMatricula":"30270782","nome":"MARCONDES DANTAS PAIVA","dataInicio":"2026-04-16","dataFim":"2026-05-15","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000302,"policialMatricula":"302857888","nome":"EVERALDO FLORIANO DE JESUS","dataInicio":"2026-04-15","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000303,"policialMatricula":"30295857","nome":"Herling Santos Conceicao","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000304,"policialMatricula":"30390760","nome":"Wilmar Alves do Prado","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000305,"policialMatricula":"30389629","nome":"Linds Ley Silva Pereira","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000306,"policialMatricula":"30429535","nome":"Alex Ferraz Cordeiro","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000307,"policialMatricula":"305054811","nome":"CAMILLA MATOS SANTOS","dataInicio":"2026-04-01","dataFim":"2026-04-15","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000308,"policialMatricula":"30427440","nome":"Alessandro Vilas Boas Cardoso","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000309,"policialMatricula":"30481667","nome":"Mario Rodrigues da Silva Neto","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000310,"policialMatricula":"30481194","nome":"Charles Souza do Nascimento","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000311,"policialMatricula":"30481447","nome":"Willian Moreira Prates","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000312,"policialMatricula":"30481393","nome":"Augusto Camilo da Cruz Neto","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000313,"policialMatricula":"30481452","nome":"Kleber Jackson Rodrigues da Silva","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000314,"policialMatricula":"30481270","nome":"Fabio Rocha da Silva","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000315,"policialMatricula":"30481399","nome":"Naum Rodrigues Silva","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000316,"policialMatricula":"30564269","nome":"Zoraide Batista Barros","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000317,"policialMatricula":"30644896","nome":"Monique da Silva Costa","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000318,"policialMatricula":"30645395","nome":"Iago Santos Lopes","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000319,"policialMatricula":"92047852","nome":"Debora Batista Dutra Rodrigues","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000320,"policialMatricula":"30646132","nome":"Danilo Azevedo Ribeiro","dataInicio":"2026-04-01","dataFim":"2026-04-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000321,"policialMatricula":"30601887","nome":"Anne Daisy Cabral Sampaio","dataInicio":"2026-03-22","dataFim":"2026-04-20","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000322,"policialMatricula":"30643410","nome":"Alexsandro Freire Gomes","dataInicio":"2026-04-27","dataFim":"2026-05-16","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000323,"policialMatricula":"30653730","nome":"Jonas Soares Duque","dataInicio":"2026-04-27","dataFim":"2026-05-16","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000324,"policialMatricula":"30586823","nome":"Diego Santos Freitas","dataInicio":"2026-04-01","dataFim":"2026-06-29","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000325,"policialMatricula":"304901625","nome":"Clotildes da Silva Santos","dataInicio":"2026-03-20","dataFim":"2026-06-17","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2018","periodoAqAte":"2023"}]},{"id":10004,"tipo":"planejamento","mes":5,"ano":2026,"titulo":"Maio / 2026","dataInicio":"2026-05-01","dataFim":"2026-05-30","concluido":false,"periodoAqDe":"2025","periodoAqAte":"2026","participantes":[{"id":1000400,"policialMatricula":"30507751","nome":"Wellen Gonsalves Oliveira de Carvalho","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000401,"policialMatricula":"30270782","nome":"MARCONDES DANTAS PAIVA","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000402,"policialMatricula":"30270991","nome":"Fabio Augusto Santos Souza","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000403,"policialMatricula":"30428812","nome":"Geraldo Andre Matos de Oliveira","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000404,"policialMatricula":"30479090","nome":"Rodrigo Vieira Peixoto","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000405,"policialMatricula":"30505941","nome":"Ronaldo Alves Dias Pinheiro","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000406,"policialMatricula":"30526187","nome":"Humberto Mendes Ribeiro","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000407,"policialMatricula":"30583435","nome":"Alexandre Mendes Araujo","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000408,"policialMatricula":"30645239","nome":"Savio Vieira dos Santos","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000409,"policialMatricula":"92110933","nome":"Joabe Souza da Silva","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000410,"policialMatricula":"30583418","nome":"Adriano Dutra Farias","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000411,"policialMatricula":"30601901","nome":"Diego Oliveira do Carmo","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000412,"policialMatricula":"30653794","nome":"Daniela de Lourdes Monteiro","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000413,"policialMatricula":"92137086","nome":"Gabriel Magno de Oliveira Silva","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000414,"policialMatricula":"304901625","nome":"Clotildes da Silva Santos","dataInicio":"2026-03-20","dataFim":"2026-06-17","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2018","periodoAqAte":"2023"},{"id":1000415,"policialMatricula":"30586823","nome":"Diego Santos Freitas","dataInicio":"2026-04-01","dataFim":"2026-06-29","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000416,"policialMatricula":"305642698","nome":"Zoraide Batista Barros","dataInicio":"2026-05-01","dataFim":"2026-07-29","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2019","periodoAqAte":"2024"},{"id":1000417,"policialMatricula":"305260284","nome":"Alan da Silva Sa","dataInicio":"2026-05-01","dataFim":"2026-07-29","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"}]},{"id":10005,"tipo":"planejamento","mes":6,"ano":2026,"titulo":"Junho / 2026","dataInicio":"2026-06-01","dataFim":"2026-06-30","concluido":false,"periodoAqDe":"2025","periodoAqAte":"2026","participantes":[{"id":1000500,"policialMatricula":"30479974","nome":"Thander Almeida Santos","dataInicio":"2026-07-02","dataFim":"2026-07-31","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000501,"policialMatricula":"30294196","nome":"Adelice Santos Sande","dataInicio":"2026-06-02","dataFim":"2026-07-01","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000502,"policialMatricula":"30391130","nome":"Warley de Oliveira Ribeiro","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000503,"policialMatricula":"30389622","nome":"Luiz Carlos Evangelista da Silva","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000504,"policialMatricula":"30429525","nome":"Ionara Conceicao Vaconcelos Santos","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000505,"policialMatricula":"30295847","nome":"Ivan Santos Bittencourt","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000506,"policialMatricula":"30390762","nome":"Tedson Goncalves de Brito","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000507,"policialMatricula":"30390771","nome":"Adailson Machado de Castro","dataInicio":"2026-06-15","dataFim":"2026-07-14","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000508,"policialMatricula":"30427603","nome":"Alexandro Bomfim Lago","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000509,"policialMatricula":"30429439","nome":"Irlane Barbosa Brito","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000510,"policialMatricula":"30389617","nome":"Rodrigo Costa Ribeiro","dataInicio":"2026-06-01","dataFim":"2026-06-15","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000511,"policialMatricula":"30389703","nome":"Wallace Reboucas Silva","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000512,"policialMatricula":"305054811","nome":"Camilla Matos Santos","dataInicio":"2026-06-16","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000513,"policialMatricula":"30505474","nome":"Ana Paula Cerqueira Reis","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000514,"policialMatricula":"30511491","nome":"Pedro Silva de Almeida","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000515,"policialMatricula":"30513141","nome":"Joao Rodrigues de Souza Filho","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000516,"policialMatricula":"30484230","nome":"Daniel da Silva Campos","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000517,"policialMatricula":"30481476","nome":"Warley Farias Souza","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000518,"policialMatricula":"30481245","nome":"Aleandro Silva Prado","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000519,"policialMatricula":"30505863","nome":"Amadeus Nascimento Santos","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000520,"policialMatricula":"30481540","nome":"Cristiano Americo Dias Santos","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000521,"policialMatricula":"30513122","nome":"Diego Alessandro Pessoa Blatt","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000522,"policialMatricula":"92137041","nome":"Alison Ivens Oliveira de Brito","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000523,"policialMatricula":"30644417","nome":"Jorge Miguel Oliveira Almeida","dataInicio":"2026-06-15","dataFim":"2026-06-29","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000524,"policialMatricula":"30653794","nome":"Daniela de Lourdes Monteiro","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000525,"policialMatricula":"92110933","nome":"Joabe Souza da Silva","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000526,"policialMatricula":"304901625","nome":"Clotildes da Silva Santos","dataInicio":"2026-03-20","dataFim":"2026-06-17","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2018","periodoAqAte":"2023"},{"id":1000527,"policialMatricula":"305642698","nome":"Zoraide Batista Barros","dataInicio":"2026-05-01","dataFim":"2026-07-29","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2019","periodoAqAte":"2024"},{"id":1000528,"policialMatricula":"305260284","nome":"Alan da Silva Sa","dataInicio":"2026-05-01","dataFim":"2026-07-29","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000529,"policialMatricula":"30586823","nome":"Diego Santos Freitas","dataInicio":"2026-04-01","dataFim":"2026-06-29","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000530,"policialMatricula":"30505877","nome":"Cleber Sales Duarte","dataInicio":"2026-06-01","dataFim":"2026-06-30","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"}]},{"id":10006,"tipo":"planejamento","mes":7,"ano":2026,"titulo":"Julho / 2026","dataInicio":"2026-07-01","dataFim":"2026-07-30","concluido":false,"periodoAqDe":"2025","periodoAqAte":"2026","participantes":[{"id":1000600,"policialMatricula":"30479974","nome":"Thander Almeida Santos","dataInicio":"2026-07-02","dataFim":"2026-07-16","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000601,"policialMatricula":"30295968","nome":"Marcia Regina Souza","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000602,"policialMatricula":"30295436","nome":"Rejane Ribeiro Luz","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000603,"policialMatricula":"30295439","nome":"Sergio Saraiva Ribas Cordeiro","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000604,"policialMatricula":"30389725","nome":"Marconi Gomes Pereira","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000605,"policialMatricula":"30511483","nome":"Fabio Paixao Cafe","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000606,"policialMatricula":"30481523","nome":"Joan Rito Amorim de Carvalho","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000607,"policialMatricula":"30587017","nome":"Siro Ferreira Sobrinho","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000608,"policialMatricula":"30647478","nome":"Ivonilson Gusmao de Oliveira","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000609,"policialMatricula":"92038241","nome":"Iasmine Menezes Passinho","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000610,"policialMatricula":"92069968","nome":"Felipe George de Souza Mineo","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000611,"policialMatricula":"305287008","nome":"Marcos Alves De Souza","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000612,"policialMatricula":"30481450","nome":"Mateus Alves de Oliveira Souza","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000613,"policialMatricula":"30645491","nome":"Wallas Ferreira Lima","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000614,"policialMatricula":"30511590","nome":"Ranie Santos Bittencourt","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000615,"policialMatricula":"30564040","nome":"Ronyelle de Almeida Teles Florencio","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000616,"policialMatricula":"30586823","nome":"Diego Santos Freitas","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000617,"policialMatricula":"305642698","nome":"Zoraide Batista Barros","dataInicio":"2026-05-01","dataFim":"2026-07-29","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2019","periodoAqAte":"2024"},{"id":1000618,"policialMatricula":"305260284","nome":"Alan da Silva Sa","dataInicio":"2026-05-01","dataFim":"2026-07-29","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000619,"policialMatricula":"30513141","nome":"Joao Rodrigues de Souza Filho","dataInicio":"2026-05-01","dataFim":"2026-05-30","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"}]},{"id":10007,"tipo":"planejamento","mes":8,"ano":2026,"titulo":"Agosto / 2026","dataInicio":"2026-08-01","dataFim":"2026-08-30","concluido":false,"periodoAqDe":"2025","periodoAqAte":"2026","participantes":[{"id":1000700,"policialMatricula":"","nome":"ORLINS DOS SANTOS ALMEIDA","dataInicio":"2026-08-14","dataFim":"2026-08-23","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000701,"policialMatricula":"30486292","nome":"Marcos Venicius Costa Figueredo","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000702,"policialMatricula":"30295681","nome":"Robson Caracas de Souza","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000703,"policialMatricula":"30507510","nome":"Tyrone Sousa Santos","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000704,"policialMatricula":"30526508","nome":"Marlucio dos Santos Nascimento","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000705,"policialMatricula":"30526147","nome":"Geisa Santos Araujo","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000706,"policialMatricula":"30526618","nome":"Rogerio Sousa dos Santos","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000707,"policialMatricula":"30526409","nome":"Jose Antonio Teixeira Alves","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000708,"policialMatricula":"30527077","nome":"Roberio do Prado Brito","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000709,"policialMatricula":"30564421","nome":"Luan Moraes Sousa","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000710,"policialMatricula":"30643441","nome":"Bruno Moura Almeida","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000711,"policialMatricula":"30643642","nome":"Edrei Almeida Sousa","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000712,"policialMatricula":"92110401","nome":"Fabricia Louyse Santos Sousa","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000713,"policialMatricula":"30604302","nome":"Alexsandro Freire Gomes","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000714,"policialMatricula":"30586823","nome":"Diego Santos Freitas","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000715,"policialMatricula":"30526054","nome":"Carlos Rodrigo Ferreira Andrade","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000716,"policialMatricula":"30564354","nome":"Magnum Jardim Santa Rosa","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000717,"policialMatricula":"30526393","nome":"Joelson Santos de Oliveira","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000718,"policialMatricula":"30564022","nome":"Romario Soares de Magalhaes","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000719,"policialMatricula":"30643410","nome":"Alexsandro Freire Gomes","dataInicio":"2026-08-14","dataFim":"2026-08-23","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000720,"policialMatricula":"30653730","nome":"Jonas Soares Duque","dataInicio":"2026-08-14","dataFim":"2026-08-23","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000721,"policialMatricula":"92048258","nome":"Welton Gomes de Souza","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000722,"policialMatricula":"30296882","nome":"Simone Carvalho Santana","dataInicio":"2026-08-01","dataFim":"2026-08-30","tipo":"LICENÇA-PRÊMIO","periodoAqDe":"2025","periodoAqAte":"2026"}]},{"id":10008,"tipo":"planejamento","mes":9,"ano":2026,"titulo":"Setembro / 2026","dataInicio":"2026-09-01","dataFim":"2026-09-30","concluido":false,"periodoAqDe":"2025","periodoAqAte":"2026","participantes":[{"id":1000800,"policialMatricula":"30295609","nome":"Eneas de Oliveira Amaral","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000801,"policialMatricula":"30337921","nome":"Eliene Andrade Cezarano","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000802,"policialMatricula":"30296882","nome":"Simone Carvalho Santana","dataInicio":"2026-07-01","dataFim":"2026-07-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000803,"policialMatricula":"30505868","nome":"Andre Souza de Oliveira","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000804,"policialMatricula":"30481307","nome":"Leandro Araujo Oliveira","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000805,"policialMatricula":"30480525","nome":"Marcos Jose Ribeiro Sa","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000806,"policialMatricula":"30526542","nome":"Rafael Bastos dos Santos Souza","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000807,"policialMatricula":"30526481","nome":"Luiz da Costa Nogueira","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000808,"policialMatricula":"30526393","nome":"Joelson Santos de Oliveira","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000809,"policialMatricula":"30564283","nome":"Silvana da Silva Souza","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000810,"policialMatricula":"30583640","nome":"Edjefeson Souza Torquato","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000811,"policialMatricula":"30643688","nome":"Eliane de Jesus Brito Ferraz","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000812,"policialMatricula":"30646132","nome":"Danilo Azevedo Ribeiro","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000813,"policialMatricula":"30653730","nome":"Jonas Soares Duque","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000814,"policialMatricula":"30587208","nome":"Pedro Henrique Figueiredo Bahia","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000815,"policialMatricula":"92015716","nome":"Suelle Oliveira Batista","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000816,"policialMatricula":"30563458","nome":"Thyara Campos de Oliveira Miranda","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000817,"policialMatricula":"30645063","nome":"Romulo Santos Oliveira","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000818,"policialMatricula":"92137098","nome":"Samile Silva Neres","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000819,"policialMatricula":"92137064","nome":"Milton Soares de Sousa","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000820,"policialMatricula":"92137093","nome":"Augusto Soares Novais","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000821,"policialMatricula":"30587207","nome":"Osmane Oliveira Fernandes","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000822,"policialMatricula":"92136666","nome":"Marlon Barreto Soares","dataInicio":"2026-09-01","dataFim":"2026-09-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"}]},{"id":10009,"tipo":"planejamento","mes":11,"ano":2026,"titulo":"Novembro / 2026","dataInicio":"2026-11-01","dataFim":"2026-11-30","concluido":false,"periodoAqDe":"2025","periodoAqAte":"2026","participantes":[{"id":1000900,"policialMatricula":"30564476","nome":"Hudson Matos Cunha","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000901,"policialMatricula":"30285086","nome":"Eleneide Alves de Araujo","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000902,"policialMatricula":"30505858","nome":"Agenaldo Gama Silveira Junior","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000903,"policialMatricula":"30337635","nome":"Ricardo da Silva Souza","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000904,"policialMatricula":"30428812","nome":"Geraldo Andre Matos de Oliveira","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000905,"policialMatricula":"305068317","nome":"YOLANDO COSTA CORREIA JUNIOR","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2023","periodoAqAte":"2024"},{"id":1000906,"policialMatricula":"30481298","nome":"IGOR SILVA DIAS","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000907,"policialMatricula":"30526703","nome":"Washington Castro Piraja","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000908,"policialMatricula":"30526160","nome":"Helton Ferreira Gomes","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000909,"policialMatricula":"30526423","nome":"Leandro Silva de Santana","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000910,"policialMatricula":"30526028","nome":"Alan da Silva Sa","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000911,"policialMatricula":"30526078","nome":"Darlan Oliveira Lima","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000912,"policialMatricula":"30614699","nome":"Gabriel Ferreira de Alcantara","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000913,"policialMatricula":"92069885","nome":"Bruna dos Santos Caja","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000914,"policialMatricula":"92137066","nome":"Keila Gomes Brito","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000915,"policialMatricula":"30296878","nome":"Jose Maria Pinto","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000916,"policialMatricula":"30583534","nome":"Marcelo Luis Pereira Cerqueira","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000917,"policialMatricula":"30586860","nome":"Larissa Santos Rodrigues","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000918,"policialMatricula":"92137045","nome":"Carolina Brito Souza","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000919,"policialMatricula":"30643032","nome":"Adriano Santos Silva","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1000920,"policialMatricula":"92111130","nome":"Wagson Souza da Silva","dataInicio":"2026-11-01","dataFim":"2026-11-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"}]},{"id":10010,"tipo":"planejamento","mes":12,"ano":2026,"titulo":"Dezembro / 2026","dataInicio":"2026-12-01","dataFim":"2026-12-30","concluido":false,"periodoAqDe":"2025","periodoAqAte":"2026","participantes":[{"id":1001000,"policialMatricula":"30307755","nome":"Marcio de Souza Couto","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001001,"policialMatricula":"30479974","nome":"Thander Almeida Santos","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001002,"policialMatricula":"30295851","nome":"Jailton de Cintra Costa","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001003,"policialMatricula":"30295406","nome":"Joselita Barreto Bomfim Barbosa","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001004,"policialMatricula":"30430080","nome":"Joilson Santos Barreto","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001005,"policialMatricula":"30337569","nome":"Joelma de Almeida Cruz","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001006,"policialMatricula":"30389626","nome":"Hinattiano Ferreira Alves","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001007,"policialMatricula":"30389687","nome":"Alexandre Marques Silva","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001008,"policialMatricula":"30389617","nome":"Rodrigo Costa Ribeiro","dataInicio":"2026-12-30","dataFim":"2027-01-13","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001009,"policialMatricula":"30389703","nome":"Wallace Reboucas Silva","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001010,"policialMatricula":"30481370","nome":"Isaac Lee do Couto Rocha","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001011,"policialMatricula":"30481296","nome":"Ismael Vieira dos Santos","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001012,"policialMatricula":"30481500","nome":"Lucas Silva de Melo","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001013,"policialMatricula":"30481245","nome":"Aleandro Silva Prado","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001014,"policialMatricula":"30506872","nome":"Jamilton Santos da Silva","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001015,"policialMatricula":"30481386","nome":"Carlinho Batista da Silva","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001016,"policialMatricula":"30505919","nome":"Marcel Stenio Oliveira Silva","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001017,"policialMatricula":"30643688","nome":"Eliane de Jesus Brito Ferraz","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001018,"policialMatricula":"30514744","nome":"Isaac Rodrigues dos Santos","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001019,"policialMatricula":"30526613","nome":"Rogerio Ribeiro Santos","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001020,"policialMatricula":"30526705","nome":"Willy Iglezias Bomfim Santos","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001021,"policialMatricula":"30564263","nome":"Wender Oliveira da Silva","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001022,"policialMatricula":"30564279","nome":"Elton Novaes Souza","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001023,"policialMatricula":"30583894","nome":"Renato Nascimento de Aquino","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001024,"policialMatricula":"30586826","nome":"Diego Sousa Dantas","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001025,"policialMatricula":"30643915","nome":"Hellen Mayara Freitas Gusmao","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001026,"policialMatricula":"30643964","nome":"Indira Maria Castro Santos","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001027,"policialMatricula":"30526042","nome":"Caio Cesar Alves Gusmao","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001028,"policialMatricula":"30644417","nome":"Jorge Miguel Oliveira Almeida","dataInicio":"2026-12-01","dataFim":"2026-12-15","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"},{"id":1001029,"policialMatricula":"30481493","nome":"Wagner Ferreira da Silva","dataInicio":"2026-12-01","dataFim":"2026-12-30","tipo":"FÉRIAS","periodoAqDe":"2025","periodoAqAte":"2026"}]}];
const INITIAL_CNH_UPDATES = [{"mat":"30390771","cnh":"06399644473","categoriaCnh":"A/B","validCnh":"2035-03-14"},{"mat":"30429535","cnh":"04304853935","categoriaCnh":"A/B","validCnh":"2027-10-27"},{"mat":"30389687","cnh":"04037851790","categoriaCnh":"B","validCnh":"2031-05-30"},{"mat":"30479332","cnh":"5046903269","categoriaCnh":"AB","validCnh":"2031-05-30"},{"mat":"30428812","cnh":"02110911378","categoriaCnh":"D","validCnh":"2028-02-23"},{"mat":"30295847","cnh":"8857825903","categoriaCnh":"B","validCnh":"2025-12-22"},{"mat":"30391139","cnh":"00859336009","categoriaCnh":"A/D","validCnh":"2034-10-14"},{"mat":"30389725","cnh":"01293920340","categoriaCnh":"A/B","validCnh":"2028-02-08"},{"mat":"30437167","cnh":"3268556956","categoriaCnh":"A/B","validCnh":"2031-12-28"},{"mat":"30389617","cnh":"02787912260","categoriaCnh":"D","validCnh":"2033-03-20"},{"mat":"30390762","cnh":"01602723345","categoriaCnh":"B","validCnh":"2031-12-13"},{"mat":"30390760","cnh":"04344244044","categoriaCnh":"B","validCnh":"2033-06-05"},{"mat":"30481245","cnh":"3929451560","categoriaCnh":"AB","validCnh":"2031-06-30"},{"mat":"30505474","cnh":"4600599182","categoriaCnh":"A/B","validCnh":"2033-10-03"},{"mat":"30481393","cnh":"02875274441","categoriaCnh":"D","validCnh":"2033-01-19"},{"mat":"30481194","cnh":"03330608262","categoriaCnh":"A/B","validCnh":"2032-02-16"},{"mat":"30505877","cnh":"02522720418","categoriaCnh":"A/B","validCnh":"2034-03-12"},{"mat":"30481540","cnh":"04990949173","categoriaCnh":"B","validCnh":"2035-07-30"},{"mat":"30484230","cnh":"07231368518","categoriaCnh":"A/B","validCnh":"2033-09-18"},{"mat":"30481370","cnh":"05235465860","categoriaCnh":"A/B","validCnh":"2031-12-19"},{"mat":"30481296","cnh":"03515533928","categoriaCnh":"B","validCnh":"2034-09-10"},{"mat":"30481523","cnh":"9152540412","categoriaCnh":"AB","validCnh":"2026-10-29"},{"mat":"30481452","cnh":"04795160831","categoriaCnh":"A/B","validCnh":"2026-01-07"},{"mat":"30505915","cnh":"08094646006","categoriaCnh":"A/B","validCnh":"2032-08-01"},{"mat":"30480525","cnh":"01096625771","categoriaCnh":"A/B","validCnh":"2032-11-07"},{"mat":"30501159","cnh":"03867795957","categoriaCnh":"A/B","validCnh":"2033-06-07"},{"mat":"30507510","cnh":"05475743497","categoriaCnh":"A/B","validCnh":"2025-10-27"},{"mat":"30505955","cnh":"03279696562","categoriaCnh":"A/D","validCnh":"2034-01-18"},{"mat":"30506813","cnh":"01158990010","categoriaCnh":"A/B","validCnh":"2032-06-09"},{"mat":"30526028","cnh":"05917253309","categoriaCnh":"A/B","validCnh":"2032-11-07"},{"mat":"30583435","cnh":"04192209926","categoriaCnh":"A/B","validCnh":"2032-08-10"},{"mat":"92137041","cnh":"07515654047","categoriaCnh":"A/B","validCnh":"2034-10-28"},{"mat":"92137093","cnh":"05683635341","categoriaCnh":"B","validCnh":"2032-08-25"},{"mat":"30526042","cnh":"05027924717","categoriaCnh":"B","validCnh":"2031-05-12"},{"mat":"92081598","cnh":"07027784758","categoriaCnh":"A/B","validCnh":"2033-10-31"},{"mat":"30526054","cnh":"03657922894","categoriaCnh":"B","validCnh":"2026-02-01"},{"mat":"30526058","cnh":"06283328930","categoriaCnh":"A/B","validCnh":"2034-07-04"},{"mat":"30646132","cnh":"6123085062","categoriaCnh":"A/B","validCnh":"2034-05-20"},{"mat":"30526078","cnh":"04621014140","categoriaCnh":"A/B","validCnh":"2034-10-25"},{"mat":"92047852","cnh":"7330441371","categoriaCnh":"B","validCnh":"2034-12-19"},{"mat":"30601901","cnh":"03754249290","categoriaCnh":"A/B","validCnh":"2035-08-06"},{"mat":"30557455","cnh":"03250028571","categoriaCnh":"B","validCnh":"2035-01-16"},{"mat":"30643642","cnh":"06860932801","categoriaCnh":"B","validCnh":"2033-02-01"},{"mat":"30643688","cnh":"6679183906","categoriaCnh":"B","validCnh":"2032-03-13"},{"mat":"30653702","cnh":"6884561476","categoriaCnh":"A/B","validCnh":"2033-03-13"},{"mat":"92110401","cnh":"2159684560","categoriaCnh":"A/B","validCnh":"2032-04-03"},{"mat":"92137086","cnh":"7715727859","categoriaCnh":"A/B","validCnh":"2026-02-09"},{"mat":"30526160","cnh":"02243658365","categoriaCnh":"B","validCnh":"2032-02-03"},{"mat":"30526159","cnh":"04271180118","categoriaCnh":"A/B","validCnh":"2035-05-22"},{"mat":"30526191","cnh":"04406258744","categoriaCnh":"A/B","validCnh":"2033-02-13"},{"mat":"30526235","cnh":"04509821645","categoriaCnh":"A/B","validCnh":"2033-09-05"},{"mat":"92048251","cnh":"5740728641","categoriaCnh":"A/B","validCnh":"2024-09-01"},{"mat":"30526237","cnh":"03810811802","categoriaCnh":"A/B","validCnh":"2034-11-27"},{"mat":"30526393","cnh":"04749003908","categoriaCnh":"A/B","validCnh":"2035-04-16"},{"mat":"30644417","cnh":"06608540301","categoriaCnh":"A/B","validCnh":"2025-12-20"},{"mat":"30526409","cnh":"02592932219","categoriaCnh":"D","validCnh":"2034-10-16"},{"mat":"30526423","cnh":"03955607596","categoriaCnh":"B","validCnh":"2032-12-28"},{"mat":"30564421","cnh":"05778805267","categoriaCnh":"B","validCnh":"2033-12-13"},{"mat":"30526481","cnh":"04873026310","categoriaCnh":"A/B","validCnh":"2034-09-13"},{"mat":"30564354","cnh":"04462244792","categoriaCnh":"A/B","validCnh":"2032-12-28"},{"mat":"92136666","cnh":"6911052090","categoriaCnh":"A/B","validCnh":"2032-04-01"},{"mat":"30583534","cnh":"04940322901","categoriaCnh":"A/B","validCnh":"2033-07-03"},{"mat":"30526508","cnh":"038403399739","categoriaCnh":"A/B","validCnh":"2032-07-14"},{"mat":"30526568","cnh":"05969475442","categoriaCnh":"A/B","validCnh":"2034-04-23"},{"mat":"92137064","cnh":"7828242452","categoriaCnh":"A/B","validCnh":"2036-01-12"},{"mat":"30644896","cnh":"5357779940","categoriaCnh":"A/B","validCnh":"2031-08-12"},{"mat":"30587208","cnh":"4467230495","categoriaCnh":"A/B","validCnh":"2025-10-13"},{"mat":"30583894","cnh":"05486460480","categoriaCnh":"B","validCnh":"2032-05-02"},{"mat":"30527077","cnh":"02481993784","categoriaCnh":"A/D","validCnh":"2034-10-29"},{"mat":"30564022","cnh":"05712292906","categoriaCnh":"A/B","validCnh":"2032-09-20"},{"mat":"30645063","cnh":"6290009792","categoriaCnh":"B","validCnh":"2034-12-09"},{"mat":"30564040","cnh":"05566166108","categoriaCnh":"B","validCnh":"2032-03-09"},{"mat":"30564283","cnh":"5813651924","categoriaCnh":"B","validCnh":"2035-02-11"},{"mat":"30587017","cnh":"03283500110","categoriaCnh":"A/B","validCnh":"2026-01-10"},{"mat":"30564226","cnh":"03685891249","categoriaCnh":"B","validCnh":"2031-09-12"},{"mat":"30563458","cnh":"04022163384","categoriaCnh":"A/B","validCnh":"2032-02-08"},{"mat":"30526697","cnh":"04806363446","categoriaCnh":"A/B","validCnh":"2033-12-14"},{"mat":"30645491","cnh":"06668002050","categoriaCnh":"A/B","validCnh":"2032-05-17"},{"mat":"30526703","cnh":"03520596979","categoriaCnh":"B","validCnh":"2034-05-20"},{"mat":"30564263","cnh":"051933765071","categoriaCnh":"A/B","validCnh":"2032-11-08"},{"mat":"30505885","cnh":"07821599734","categoriaCnh":"A/B","validCnh":"2036-01-07"},{"mat":"30389626","cnh":"02241778699","categoriaCnh":"A/B","validCnh":"2031-07-18"},{"mat":"30430080","cnh":"02360385863","categoriaCnh":"A/D","validCnh":"2028-10-05"},{"mat":"30389728","cnh":"04117624748","categoriaCnh":"A/B","validCnh":"2034-06-26"},{"mat":"30505868","cnh":"03935046003","categoriaCnh":"A/B","validCnh":"2026-03-28"},{"mat":"30481270","cnh":"05187693448","categoriaCnh":"A/B","validCnh":"2032-01-05"},{"mat":"30506872","cnh":"03882591116","categoriaCnh":"A/D","validCnh":"2034-02-16"},{"mat":"30481450","cnh":"05736734280","categoriaCnh":"A/B","validCnh":"2032-07-20"},{"mat":"30511491","cnh":"05848167203","categoriaCnh":"A/B","validCnh":"2033-09-01"},{"mat":"30479090","cnh":"03233668300","categoriaCnh":"A/B","validCnh":"2033-09-05"},{"mat":"30583418","cnh":"04045781582","categoriaCnh":"A/B","validCnh":"2031-09-04"},{"mat":"30643032","cnh":"05285459881","categoriaCnh":"A/D","validCnh":"2034-03-15"},{"mat":"30643410","cnh":"04941954180","categoriaCnh":"A/B","validCnh":"2034-07-19"},{"mat":"92069885","cnh":"07273963331","categoriaCnh":"A/B","validCnh":"2034-06-11"},{"mat":"30643441","cnh":"05830563707","categoriaCnh":"A/B","validCnh":"2034-09-13"},{"mat":"30583640","cnh":"03689750600","categoriaCnh":"A/D","validCnh":"2035-11-10"},{"mat":"30564279","cnh":"03520583774","categoriaCnh":"A/B","validCnh":"2034-07-17"},{"mat":"92069968","cnh":"06596222426","categoriaCnh":"A/B","validCnh":"2035-07-10"},{"mat":"92110576","cnh":"06571960966","categoriaCnh":"A/B","validCnh":"2035-02-26"},{"mat":"30526234","cnh":"03729317490","categoriaCnh":"A/B","validCnh":"2031-05-02"},{"mat":"30643915","cnh":"05552550402","categoriaCnh":"A/B","validCnh":"2033-05-18"},{"mat":"30645395","cnh":"05518826398","categoriaCnh":"A/B","validCnh":"2032-09-15"},{"mat":"30647478","cnh":"06662797183","categoriaCnh":"A/B","validCnh":"2033-05-24"},{"mat":"92110933","cnh":"8202405921","categoriaCnh":"A/B","validCnh":"2033-02-02"},{"mat":"30653730","cnh":"5299524224","categoriaCnh":"A/B","validCnh":"2026-02-08"},{"mat":"30645239","cnh":"06280514105","categoriaCnh":"A/B","validCnh":"2034-09-12"},{"mat":"92111130","cnh":"05461832447","categoriaCnh":"A/B","validCnh":"2031-08-26"},{"mat":"92048258","cnh":"04715059804","categoriaCnh":"A/B","validCnh":"2034-12-18"}];
const SITUACOES_INATIVO = ["Transferido","Reserva/Inativo"];

// Dados de saúde importados da planilha SAÚDE.xlsx
const INITIAL_SAUDE_DATA = [{"id":100000,"policialId":58,"tipo":"Junta Médica","dataInicio":"2025-11-19","aContarDe":"2025-11-19","afastamento":180,"dataFim":"2026-05-18","novaInspDia":"2026-05-18","parecer":"INAPTO PARA O SERVIÇO PM","restricao":"","descricao":"","concluido":false,"_nome":"PABLO MANOEL ALMEIDA BORBA","_mat":"303897297"},{"id":100001,"policialId":48,"tipo":"Junta Médica","dataInicio":"2026-05-25","aContarDe":"2026-04-25","afastamento":180,"dataFim":"2026-10-22","novaInspDia":"2026-10-22","parecer":"APTO PARA O SERVIÇO ADM","restricao":"porte de arma e serviços noturnos","descricao":"porte de arma e serviços noturnos","concluido":false,"_nome":"REJANE RIBEIRO LUZ","_mat":"302954363"},{"id":100002,"policialId":20,"tipo":"Junta Médica","dataInicio":"2025-08-27","aContarDe":"2025-08-27","afastamento":180,"dataFim":"2026-02-23","novaInspDia":"2026-02-23","parecer":"APTO PARA O SERVIÇO ADM","restricao":"","descricao":"","concluido":false,"_nome":"JOSELITA BARRETO BOMFIM BARBOSA","_mat":"302954062"},{"id":100003,"policialId":200,"tipo":"Junta Médica","dataInicio":"2025-08-21","aContarDe":"2025-08-21","afastamento":120,"dataFim":"2025-12-19","novaInspDia":"2025-12-19","parecer":"APTO PARA O SERVIÇO ADM","restricao":"","descricao":"","concluido":false,"_nome":"MARCOS ALVES DE SOUZA","_mat":"305287008"},{"id":100004,"policialId":5,"tipo":"Junta Médica","dataInicio":"2025-12-15","aContarDe":"2025-12-15","afastamento":180,"dataFim":"2026-06-13","novaInspDia":"2026-06-13","parecer":"APTO PARA O SERVIÇO ADM","restricao":"esforço físico, atividade noturna, poluição sonora e carga horária extensa.","descricao":"esforço físico, atividade noturna, poluição sonora e carga horária extensa.","concluido":false,"_nome":"HUDSON MATOS CUNHA","_mat":"305644763"},{"id":100005,"policialId":130,"tipo":"Junta Médica","dataInicio":"2026-01-05","aContarDe":"2026-01-05","afastamento":180,"dataFim":"2026-06-14","novaInspDia":"2026-06-14","parecer":"APTO PARA O SERVIÇO ADM","restricao":"","descricao":"","concluido":false,"_nome":"IASMINE MENEZES PASSINHO","_mat":"92038241"},{"id":100006,"policialId":20,"tipo":"Junta Médica","dataInicio":"2026-02-09","aContarDe":"2026-02-09","afastamento":180,"dataFim":"2026-08-08","novaInspDia":"2026-08-08","parecer":"APTO PARA O SERVIÇO ADM","restricao":"exposição solar e ao calor","descricao":"exposição solar e ao calor","concluido":false,"_nome":"JOSELITA BARRETO BOMFIM BARBOSA","_mat":"302954062"},{"id":100007,"policialId":89,"tipo":"Junta Médica","dataInicio":"2025-11-27","aContarDe":"2025-11-27","afastamento":120,"dataFim":"2026-03-27","novaInspDia":"2026-03-27","parecer":"APTO PARA O SERVIÇO ADM","restricao":"atividade com exposição a elevados índices de poluição sonora e atividades noturnas","descricao":"atividade com exposição a elevados índices de poluição sonora e atividades noturnas","concluido":false,"_nome":"PAULO VICTOR FERREIRA DE OLIVEIRA","_mat":"304814577"},{"id":100008,"policialId":153,"tipo":"Junta Médica","dataInicio":"2026-01-29","aContarDe":"2026-01-29","afastamento":120,"dataFim":"2026-05-29","novaInspDia":"2026-05-29","parecer":"APTO PARA O SERVIÇO ADM","restricao":"","descricao":"","concluido":false,"_nome":"RONYELLE DE ALMEIDA TELES FLORÊNCIO","_mat":"305640400"},{"id":100009,"policialId":174,"tipo":"Junta Médica","dataInicio":"2026-02-09","aContarDe":"2026-02-09","afastamento":180,"dataFim":"2026-08-08","novaInspDia":"2026-08-08","parecer":"APTO PARA O SERVIÇO ADM","restricao":"","descricao":"","concluido":false,"_nome":"WALLACE REBOUÇAS SILVA","_mat":"303897035"},{"id":100010,"policialId":170,"tipo":"Junta Médica","dataInicio":"2026-03-05","aContarDe":"2026-03-05","afastamento":120,"dataFim":"2026-07-03","novaInspDia":"2026-07-03","parecer":"APTO PARA O SERVIÇO ADM","restricao":"","descricao":"","concluido":false,"_nome":"ELIENE ANDRADE CEZARANO","_mat":"303379215"},{"id":100011,"policialId":35,"tipo":"Junta Médica","dataInicio":"2026-02-09","aContarDe":"2026-02-09","afastamento":60,"dataFim":"2026-04-10","novaInspDia":"2026-04-10","parecer":"INAPTO PARA O SERVIÇO PM","restricao":"","descricao":"","concluido":false,"_nome":"IONARA CONCEIÇÃO VASCONCELOS SANTOS","_mat":"304295252"},{"id":100012,"policialId":152,"tipo":"Junta Médica","dataInicio":"2026-03-05","aContarDe":"2026-02-21","afastamento":93,"dataFim":"2026-05-25","novaInspDia":"2026-05-25","parecer":"INAPTO PARA O SERVIÇO PM","restricao":"","descricao":"","concluido":false,"_nome":"RONALDO ALVES DIAS PINHEIRO","_mat":"305059413"},{"id":100013,"policialId":86,"tipo":"Junta Médica","dataInicio":"2026-03-16","aContarDe":"2026-03-16","afastamento":180,"dataFim":"2026-09-12","novaInspDia":"2026-09-12","parecer":"APTO PARA O SERVIÇO ADM","restricao":"exposição solar e calor","descricao":"exposição solar e calor","concluido":false,"_nome":"MARCOS JOSÉ RIBEIRO SÁ","_mat":"304805251"},{"id":100014,"policialId":139,"tipo":"Junta Médica","dataInicio":"2006-04-28","aContarDe":"2026-04-28","afastamento":120,"dataFim":"2026-08-26","novaInspDia":"2026-08-26","parecer":"APTO PARA O SERVIÇO ADM","restricao":"esforço físico, atividade com carga, períodos prolongados em ortostase.","descricao":"esforço físico, atividade com carga, períodos prolongados em ortostase.","concluido":false,"_nome":"LARISSA SANTOS RODRIGUES","_mat":"30586860"},{"id":100015,"policialId":200,"tipo":"Junta Médica","dataInicio":"2026-03-16","aContarDe":"2026-03-16","afastamento":180,"dataFim":"2026-09-12","novaInspDia":"2026-09-12","parecer":"APTO PARA O SERVIÇO ADM","restricao":"","descricao":"","concluido":false,"_nome":"MARCOS ALVES DE SOUZA","_mat":"305287008"},{"id":100016,"policialId":35,"tipo":"Junta Médica","dataInicio":"2026-05-21","aContarDe":"2026-04-28","afastamento":null,"dataFim":"2026-04-28","novaInspDia":"2026-04-28","parecer":"INAPTO PARA O SERVIÇO PM","restricao":"","descricao":"","concluido":false,"_nome":"IONARA CONCEIÇÃO VASCONCELOS SANTOS","_mat":"304295252"},{"id":100017,"policialId":190,"tipo":"Junta Médica","dataInicio":"2026-05-21","aContarDe":"2026-04-28","afastamento":60,"dataFim":"2026-06-27","novaInspDia":"2026-06-27","parecer":"INAPTO PARA O SERVIÇO PM","restricao":"","descricao":"","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"30614699"},{"id":100018,"policialId":160,"tipo":"Junta Médica","dataInicio":"2026-05-08","aContarDe":"2026-05-08","afastamento":60,"dataFim":"2026-07-07","novaInspDia":"2026-07-07","parecer":"INAPTO PARA O SERVIÇO PM","restricao":"","descricao":"","concluido":false,"_nome":"THYARA CAMPOS DE OLIVEIRA MIRANDA","_mat":"30563458"},{"id":200000,"policialId":115,"tipo":"Atestado","dataInicio":"2024-12-19","dataFim":"2025-01-02","cid":"S631","medico":"CLAUDINEI ALVES DOS SANTOS","hospital":"CLAUDINEI ALVES","crm":"19351","dias":14,"descricao":"CID: S631","concluido":true,"_nome":"EDREI ALMEIDA SOUSA","_mat":"306436422"},{"id":200001,"policialId":180,"tipo":"Atestado","dataInicio":"2025-01-05","dataFim":"2025-01-07","cid":"","medico":"ZAYNE CABRAL GALVÃO ANDRADE","hospital":"HSVP","crm":"29278","dias":2,"descricao":"","concluido":true,"_nome":"ADRIANO DUTRA FARIAS","_mat":"305834180"},{"id":200002,"policialId":81,"tipo":"Atestado","dataInicio":"2025-01-08","dataFim":"2025-01-16","cid":"M542","medico":"ANTONIO JUNIOR COTRIM BRANDÃO","hospital":"IBR","crm":"8712","dias":8,"descricao":"CID: M542","concluido":true,"_nome":"KLÉBER JACKSON RODRIGUES DA SILVA","_mat":"304814527"},{"id":200003,"policialId":152,"tipo":"Atestado","dataInicio":"2025-01-20","dataFim":"2025-01-20","cid":"","medico":"ESPAÇO DE SAÚDE ALINE BISPO","hospital":"ESPAÇO ALINE BISPO","crm":"27458.018/0001-98","dias":null,"descricao":"","concluido":true,"_nome":"RONALDO ALVES DIAS PINHEIRO","_mat":"305059413"},{"id":200004,"policialId":53,"tipo":"Atestado","dataInicio":"2025-01-20","dataFim":"2025-01-23","cid":"M255","medico":"TIAGO FREIRE RIBEIRO","hospital":"IBR","crm":"19657","dias":3,"descricao":"CID: M255","concluido":true,"_nome":"SÉRGIO SARAIVA RIBAS CORDEIRO","_mat":"302954397"},{"id":200005,"policialId":70,"tipo":"Atestado","dataInicio":"2025-01-23","dataFim":"2025-01-23","cid":"K29","medico":"RODRIGO AUBIN DIAS","hospital":"HCC","crm":"8699","dias":null,"descricao":"CID: K29","concluido":true,"_nome":"CRISTIANO AMÉRICO DIAS SANTOS","_mat":"304815400"},{"id":200006,"policialId":202,"tipo":"Atestado","dataInicio":"2025-01-28","dataFim":"2025-02-02","cid":"H10","medico":"TAMARA CARVALHO VASCONCELOS","hospital":"SAMUR","crm":"39958","dias":5,"descricao":"CID: H10","concluido":true,"_nome":"MONIQUE DA SILVA COSTA","_mat":"306448966"},{"id":200007,"policialId":109,"tipo":"Atestado","dataInicio":"2025-01-30","dataFim":"2025-02-02","cid":"A09","medico":"DIEGO OLIVEIRA DA SILVA","hospital":"IBR","crm":"28544","dias":3,"descricao":"CID: A09","concluido":true,"_nome":"CARLOS EDUARDO CARVALHO OLIVEIRA","_mat":"92081598"},{"id":200008,"policialId":121,"tipo":"Atestado","dataInicio":"2025-01-30","dataFim":"2025-02-02","cid":"A09","medico":"DIEGO OLIVEIRA DA SILVA","hospital":"IBR","crm":"28544","dias":3,"descricao":"CID: A09","concluido":true,"_nome":"FRANÇOIS DE ASSIS MACEDO LOPES JUNIOR","_mat":"305261303"},{"id":200009,"policialId":94,"tipo":"Atestado","dataInicio":"2025-01-30","dataFim":"2025-01-30","cid":"","medico":"HOSPITAL SAMUR S/A","hospital":"SAMUR","crm":"16.205.262/0001-22","dias":null,"descricao":"","concluido":true,"_nome":"TYRONE SOUSA SANTOS","_mat":"305075100"},{"id":200010,"policialId":null,"tipo":"Atestado","dataInicio":"2025-01-30","dataFim":"2025-01-30","cid":"","medico":"ENZO FUSCO RIEGERT","hospital":"ORAL CINIC","crm":"10061","dias":null,"descricao":"","concluido":true,"_nome":"MARCELLE BITTENCOURT XAVIER","_mat":"305081818"},{"id":200011,"policialId":20,"tipo":"Atestado","dataInicio":"2025-01-30","dataFim":"2025-01-30","cid":"Z76.9","medico":"LIOMAR COUTO LEAL","hospital":"CORF","crm":"15320","dias":null,"descricao":"CID: Z76.9","concluido":true,"_nome":"JOSELITA BARRETO BOMFIM BARBOSA","_mat":"302954062"},{"id":200012,"policialId":null,"tipo":"Atestado","dataInicio":"2025-01-23","dataFim":"2025-02-06","cid":"M51","medico":"RENAN ARAUJO BRITO FARIAS","hospital":"SAMUR","crm":"26447","dias":14,"descricao":"CID: M51","concluido":true,"_nome":"GABRIEL ROCHA GOMES","_mat":"92110870"},{"id":200013,"policialId":83,"tipo":"Atestado","dataInicio":"2024-01-31","dataFim":"2024-02-15","cid":"I84","medico":"TONY GLEYSON DE OLIVEIRA SILVA","hospital":"UNIMED","crm":"15550","dias":15,"descricao":"CID: I84","concluido":true,"_nome":"LOURIVAL SANCHO VIANA FILHO","_mat":"305059154"},{"id":200014,"policialId":null,"tipo":"Atestado","dataInicio":"2025-02-06","dataFim":"2025-02-20","cid":"Z98","medico":"RENAN ARAUJO BRITO FARIAS","hospital":"ACURAE","crm":"26447","dias":14,"descricao":"CID: Z98","concluido":true,"_nome":"GABRIEL ROCHA GOMES","_mat":"92110870"},{"id":200015,"policialId":115,"tipo":"Atestado","dataInicio":"2024-02-01","dataFim":"2024-02-02","cid":"S631","medico":"CLAUDINEI ALVES DOS SANTOS","hospital":"SAMUR","crm":"19351","dias":1,"descricao":"CID: S631","concluido":true,"_nome":"EDREI ALMEIDA SOUSA","_mat":"306436422"},{"id":200016,"policialId":152,"tipo":"Atestado","dataInicio":"2025-02-04","dataFim":"2025-02-18","cid":"M51","medico":"RENAN ARAUJO BRITO FARIAS","hospital":"ACURAE","crm":"26447","dias":14,"descricao":"CID: M51","concluido":true,"_nome":"RONALDO ALVES DIAS PINHEIRO","_mat":"305059413"},{"id":200017,"policialId":94,"tipo":"Atestado","dataInicio":"2025-02-10","dataFim":"2025-02-12","cid":"M545","medico":"VANESSA D. P. R. MURTA","hospital":"PMVC","crm":"45870","dias":2,"descricao":"CID: M545","concluido":true,"_nome":"TYRONE SOUSA SANTOS","_mat":"305075100"},{"id":200018,"policialId":null,"tipo":"Atestado","dataInicio":"2025-02-12","dataFim":"2025-02-13","cid":"J06.9","medico":"WELLEN GONSALVES OLIVEIRA DE CARVALHO","hospital":"CEVAP","crm":"36416","dias":1,"descricao":"CID: J06.9","concluido":true,"_nome":"NATÁLIA DE ANDRADE SOUZA","_mat":"92111116"},{"id":200019,"policialId":null,"tipo":"Atestado","dataInicio":"2025-02-15","dataFim":"2025-02-19","cid":"S53","medico":"ANA CAROLINA B. MARTYN COSTA","hospital":"SAMUR","crm":"42614","dias":4,"descricao":"CID: S53","concluido":true,"_nome":"MARCELLE BITTENCOURT XAVIER","_mat":"305081818"},{"id":200020,"policialId":149,"tipo":"Atestado","dataInicio":"2025-02-20","dataFim":"2025-02-21","cid":"M545","medico":"TAMARA CARVALHO VASCONCELOS","hospital":"SAMUR","crm":"39958","dias":1,"descricao":"CID: M545","concluido":true,"_nome":"ROBÉRIO DO PRADO BRITO","_mat":"305270776"},{"id":200021,"policialId":59,"tipo":"Atestado","dataInicio":"2025-02-19","dataFim":"2025-02-19","cid":"","medico":"BRUNA XAVIER PEREIRA GOES","hospital":"UPA 24H","crm":"46720","dias":null,"descricao":"","concluido":true,"_nome":"AMADEUS NASCIMENTO SANTOS","_mat":"305058637"},{"id":200022,"policialId":32,"tipo":"Atestado","dataInicio":"2025-03-10","dataFim":"2025-03-14","cid":"S83","medico":"RAFAHEL S. BONFIM","hospital":"SAMUR","crm":"42151","dias":4,"descricao":"CID: S83","concluido":true,"_nome":"GERALDO ANDRÉ MATOS DE OLIVEIRA","_mat":"304288124"},{"id":200023,"policialId":111,"tipo":"Atestado","dataInicio":"2023-02-26","dataFim":"2023-02-28","cid":"","medico":"ANNIE FERRAZ DE OLVEIRA","hospital":"SAMUR","crm":"39014","dias":2,"descricao":"","concluido":true,"_nome":"DÉBORA BATISTA DUTRA RODRIGUES","_mat":"92047852"},{"id":200024,"policialId":87,"tipo":"Atestado","dataInicio":"2025-02-27","dataFim":"2025-02-27","cid":"Z 76.3","medico":"JOSÉ EVERALDO E SILVA","hospital":"HSVP","crm":"32797","dias":null,"descricao":"CID: Z 76.3","concluido":true,"_nome":"MÁRIO RODRIGUES DA SILVA NETO","_mat":"304816676"},{"id":200025,"policialId":94,"tipo":"Atestado","dataInicio":"2025-02-28","dataFim":"2025-02-28","cid":"","medico":"CRISTIANE DA SILVA MARINHO","hospital":"CD ADEMÁRIO SILVA","crm":"401753","dias":null,"descricao":"","concluido":true,"_nome":"TYRONE SOUSA SANTOS","_mat":"305075100"},{"id":200026,"policialId":182,"tipo":"Atestado","dataInicio":"2025-03-06","dataFim":"2025-03-13","cid":"B34","medico":"MALU FLORES FERRAZ","hospital":"HOSPITAL UNIMED","crm":"30219","dias":7,"descricao":"CID: B34","concluido":true,"_nome":"ANNE DAISY CABRAL SAMPAIO","_mat":"306018876"},{"id":200027,"policialId":148,"tipo":"Atestado","dataInicio":"2025-03-08","dataFim":"2025-03-11","cid":"S41","medico":"ANA LUISA DO VALE FERREIRA","hospital":"IBR","crm":"41568","dias":3,"descricao":"CID: S41","concluido":true,"_nome":"RENATO NASCIMENTO DE AQUINO","_mat":"305838948"},{"id":200028,"policialId":151,"tipo":"Atestado","dataInicio":"2025-03-08","dataFim":"2025-03-16","cid":"S93.4","medico":"LEONARDO MADUREIRA SILVA","hospital":"LEONARDO MADUREIRA","crm":"46352","dias":8,"descricao":"CID: S93.4","concluido":true,"_nome":"RÔMULO SANTOS OLIVEIRA","_mat":"306450638"},{"id":200029,"policialId":null,"tipo":"Atestado","dataInicio":"2025-03-10","dataFim":"2025-03-11","cid":"R53","medico":"MARCOS CABRAL GALVÃO","hospital":"HSVP","crm":"27911","dias":1,"descricao":"CID: R53","concluido":true,"_nome":"MAYCON SOARES NASCIMENTO","_mat":"92111079"},{"id":200030,"policialId":59,"tipo":"Atestado","dataInicio":"2025-03-13","dataFim":"2025-03-13","cid":"","medico":"DINO AUGUSTO ALVES DIAS","hospital":"HSVP","crm":"17322","dias":null,"descricao":"","concluido":true,"_nome":"AMADEUS NASCIMENTO SANTOS","_mat":"305058637"},{"id":200031,"policialId":192,"tipo":"Atestado","dataInicio":"2025-03-17","dataFim":"2025-03-19","cid":"R520","medico":"FILIPE ANTÔNIO FRANCA DA SILVA","hospital":"HOSPITAL UNIMED","crm":"40365","dias":2,"descricao":"CID: R520","concluido":true,"_nome":"IDALMIR CUNHA DE SOUSA","_mat":"305261913"},{"id":200032,"policialId":151,"tipo":"Atestado","dataInicio":"2025-03-17","dataFim":"2025-03-22","cid":"S93.4","medico":"LEONARDO MADUREIRA SILVA","hospital":"LEONARDO MADUREIRA","crm":"46352","dias":5,"descricao":"CID: S93.4","concluido":true,"_nome":"RÔMULO SANTOS OLIVEIRA","_mat":"306450638"},{"id":200033,"policialId":60,"tipo":"Atestado","dataInicio":"2025-03-17","dataFim":"2025-03-17","cid":"","medico":"MARÍLIA DE ALCÂNTARA RIBEIRO","hospital":"ELO CONSULTÓRIOS","crm":"27504","dias":null,"descricao":"","concluido":true,"_nome":"ANA PAULA CERQUEIRA REIS","_mat":"305054748"},{"id":200034,"policialId":35,"tipo":"Atestado","dataInicio":"2025-03-20","dataFim":"2025-03-21","cid":"M54.4","medico":"CARLOS HENRIQUE CASTRO","hospital":"CLÍNICA SÃO FRANCISCO DE ASSIS","crm":"7301","dias":1,"descricao":"CID: M54.4","concluido":true,"_nome":"IONARA CONCEIÇÃO VASCONCELOS SANTOS","_mat":"304295252"},{"id":200035,"policialId":null,"tipo":"Atestado","dataInicio":"2025-03-23","dataFim":"2025-03-25","cid":"","medico":"TAMARA CARVALHO VASCONCELOS","hospital":"SAMUR","crm":"39958","dias":2,"descricao":"","concluido":true,"_nome":"SÉRGIO SANTOS DOS REIS","_mat":"305266751"},{"id":200036,"policialId":55,"tipo":"Atestado","dataInicio":"2025-03-25","dataFim":"2025-03-26","cid":"H61.8","medico":"YURI CARVALHO","hospital":"OTORRINOMED","crm":"10604","dias":1,"descricao":"CID: H61.8","concluido":true,"_nome":"WILMAR ALVES DO PRADO","_mat":"303907602"},{"id":200037,"policialId":28,"tipo":"Atestado","dataInicio":"2025-03-24","dataFim":"2025-03-26","cid":"K08.1","medico":"VIRGÍNIA NASCIMENTO ANDRADE","hospital":"DRA VIRGÍNIA NASCIMENTO ODONTOLOGIA ESPECIALIZADA","crm":"9185","dias":2,"descricao":"CID: K08.1","concluido":true,"_nome":"ALESSANDRO VILAS BOAS CARDOSO","_mat":"304274400"},{"id":200038,"policialId":166,"tipo":"Atestado","dataInicio":"2025-03-26","dataFim":"2025-03-26","cid":"","medico":"MARIA AMELIA MIRANDA DE OLIVEIRA MELO","hospital":"SAÚDE ATENÇÃO BÁSICA VCA","crm":"44121","dias":null,"descricao":"","concluido":true,"_nome":"WENDER OLIVEIRA DA SILVA","_mat":"305642630"},{"id":200039,"policialId":91,"tipo":"Atestado","dataInicio":"2025-03-26","dataFim":"2025-03-29","cid":"J11","medico":"VITOR ARGÔLO BORGES","hospital":"UNIMED","crm":"43979","dias":3,"descricao":"CID: J11","concluido":true,"_nome":"RANIE SANTOS BITTENCOURT","_mat":"305115900"},{"id":200040,"policialId":32,"tipo":"Atestado","dataInicio":"2025-03-17","dataFim":"2025-03-22","cid":"S83","medico":"ANA CAROLINA B. MARTYN COSTA","hospital":"SAMUR","crm":"42614","dias":5,"descricao":"CID: S83","concluido":true,"_nome":"GERALDO ANDRÉ MATOS DE OLIVEIRA","_mat":"304288124"},{"id":200041,"policialId":32,"tipo":"Atestado","dataInicio":"2025-03-13","dataFim":"2025-03-16","cid":"M796","medico":"CAMILA CRUZES DE ANDRADE","hospital":"SAMUR","crm":"37917","dias":3,"descricao":"CID: M796","concluido":true,"_nome":"GERALDO ANDRÉ MATOS DE OLIVEIRA","_mat":"304288124"},{"id":200042,"policialId":32,"tipo":"Atestado","dataInicio":"2025-03-18","dataFim":"2025-04-01","cid":"M19.9","medico":"ADALBERTO MENDES PLACHA","hospital":"SAMUR","crm":"23826","dias":14,"descricao":"CID: M19.9","concluido":true,"_nome":"GERALDO ANDRÉ MATOS DE OLIVEIRA","_mat":"304288124"},{"id":200043,"policialId":104,"tipo":"Atestado","dataInicio":"2025-03-28","dataFim":"2025-04-02","cid":"H10.1","medico":"CESAR HENRIQUE SANTOS CAIRO","hospital":"CEOQ","crm":"36260","dias":5,"descricao":"CID: H10.1","concluido":true,"_nome":"BLENDA LORRANE ALMEIDA FERNANDES","_mat":"92110362"},{"id":200044,"policialId":104,"tipo":"Atestado","dataInicio":"2025-03-24","dataFim":"2025-03-27","cid":"B30","medico":"MARIA CAROLINA FERRAZ CAJADO SAMPAIO","hospital":"CEOQ","crm":"37754","dias":3,"descricao":"CID: B30","concluido":true,"_nome":"BLENDA LORRANE ALMEIDA FERNANDES","_mat":"92110362"},{"id":200045,"policialId":179,"tipo":"Atestado","dataInicio":"2025-03-30","dataFim":"2025-03-30","cid":"","medico":"IBR HOSPITAL","hospital":"IBR","crm":"13.284.872/0001-70","dias":null,"descricao":"","concluido":true,"_nome":"WILLIAM MOREIRA PRATES","_mat":"304814470"},{"id":200046,"policialId":null,"tipo":"Atestado","dataInicio":"2025-04-03","dataFim":"2025-04-04","cid":"K29","medico":"RHYAN COELHO SANTOS SOUZA","hospital":"IBR","crm":"47391","dias":1,"descricao":"CID: K29","concluido":true,"_nome":"NATÁLIA DE ANDRADE SOUZA","_mat":"92111116"},{"id":200047,"policialId":null,"tipo":"Atestado","dataInicio":"2025-04-04","dataFim":"2025-04-05","cid":"K52","medico":"CAMILA CRUZES DE ANDRADE","hospital":"SAMUR","crm":"37917","dias":1,"descricao":"CID: K52","concluido":true,"_nome":"PAULO ROBERTO SANTOS DE OLIVEIRA","_mat":"92111112"},{"id":200048,"policialId":91,"tipo":"Atestado","dataInicio":"2025-05-05","dataFim":"2025-05-08","cid":"A90","medico":"RAYANNE BRAGA FERREIRA MEIRA","hospital":"UNIMED","crm":"38770","dias":3,"descricao":"CID: A90","concluido":true,"_nome":"RANIE SANTOS BITTENCOURT","_mat":"305115900"},{"id":200049,"policialId":40,"tipo":"Atestado","dataInicio":"2025-04-09","dataFim":"2025-04-09","cid":"","medico":"PAULO YURI S. DE ANDRADE","hospital":"ALTIS MEDICINA DIAGNÓSTICA","crm":"25472","dias":null,"descricao":"","concluido":true,"_nome":"JOSÉ LÚCIO SANTOS TAVARES","_mat":"303896720"},{"id":200050,"policialId":192,"tipo":"Atestado","dataInicio":"2025-04-11","dataFim":"2025-04-13","cid":"W54","medico":"THAINAH PEREIRA ROCHA","hospital":"UNIMED","crm":"37365","dias":2,"descricao":"CID: W54","concluido":true,"_nome":"IDALMIR CUNHA DE SOUSA","_mat":"305261913"},{"id":200051,"policialId":39,"tipo":"Atestado","dataInicio":"2025-04-12","dataFim":"2025-04-26","cid":"k60","medico":"VIVIANE MOREIRA GUSMÃO","hospital":"SAMUR","crm":"30015","dias":14,"descricao":"CID: k60","concluido":true,"_nome":"JOILSON SANTOS BARRETO","_mat":"304300803"},{"id":200052,"policialId":null,"tipo":"Atestado","dataInicio":"2025-04-16","dataFim":"2025-04-19","cid":"A90","medico":"CAMILA CRUZES DE ANDRADE","hospital":"SAMUR","crm":"37917","dias":3,"descricao":"CID: A90","concluido":true,"_nome":"ANDRÉ BARBOSA COSTA","_mat":"92110714"},{"id":200053,"policialId":190,"tipo":"Atestado","dataInicio":"2025-04-15","dataFim":"2025-04-16","cid":"F51","medico":"LEANDRO SOUSA","hospital":"SECRETARIA DE SAÚDE VCA","crm":"22353","dias":1,"descricao":"CID: F51","concluido":true,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200054,"policialId":107,"tipo":"Atestado","dataInicio":"2025-04-22","dataFim":"2025-04-22","cid":"Z76.3","medico":"RICARDO DUTRA TEIXEIRA","hospital":"ORTOCLEAN","crm":"7032","dias":null,"descricao":"CID: Z76.3","concluido":true,"_nome":"CAIO CESAR ALVES GUSMÃO","_mat":"305260420"},{"id":200055,"policialId":null,"tipo":"Atestado","dataInicio":"2025-04-23","dataFim":"2025-04-25","cid":"A09","medico":"RAFAHEL S. BONFIM","hospital":"SAMUR","crm":"42151","dias":2,"descricao":"CID: A09","concluido":true,"_nome":"ISAAC QUIRINO DE LIMA SILVA","_mat":"30644141"},{"id":200056,"policialId":190,"tipo":"Atestado","dataInicio":"2025-04-26","dataFim":"2025-04-28","cid":"F51","medico":"LEANDRO SOUSA","hospital":"SECRETARIA DE SAÚDE VCA","crm":"22353","dias":2,"descricao":"CID: F51","concluido":true,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200057,"policialId":17,"tipo":"Atestado","dataInicio":"2025-04-28","dataFim":"2025-04-30","cid":"Z14.9","medico":"WAGNIS SOUSA","hospital":"HSVP","crm":"2889","dias":2,"descricao":"CID: Z14.9","concluido":true,"_nome":"ENÉAS DE OLIVEIRA AMARAL","_mat":"302956098"},{"id":200058,"policialId":132,"tipo":"Atestado","dataInicio":"2025-04-30","dataFim":"2025-05-01","cid":"A09","medico":"THAINAH PEREIRA ROCHA","hospital":"IBR","crm":"37365","dias":1,"descricao":"CID: A09","concluido":true,"_nome":"ISAAC RODRIGUES SANTANA","_mat":"305628791"},{"id":200059,"policialId":148,"tipo":"Atestado","dataInicio":"2025-04-30","dataFim":"2025-04-30","cid":"F41.1","medico":"CARLA FRAGA","hospital":"SECRETARIA DE SAÚDE VCA","crm":"13433","dias":null,"descricao":"CID: F41.1","concluido":true,"_nome":"RENATO NASCIMENTO DE AQUINO","_mat":"305838948"},{"id":200060,"policialId":59,"tipo":"Atestado","dataInicio":"2025-05-14","dataFim":"2025-05-14","cid":"Z 76.3","medico":"HSVP","hospital":"HSVP","crm":"17322","dias":null,"descricao":"CID: Z 76.3","concluido":true,"_nome":"AMADEUS NASCIMENTO SANTOS","_mat":"305058637"},{"id":200061,"policialId":97,"tipo":"Atestado","dataInicio":"2025-05-27","dataFim":"2025-06-06","cid":"","medico":"JOÃO CARLOS FERRAZ DE O. FILHO","hospital":"ODONTOLOGIA ESPECIALIZADA -DRº JOÃO CARLOS","crm":"6292","dias":10,"descricao":"","concluido":false,"_nome":"YOLANDO COSTA CORREIA JÚNIOR","_mat":"305068137"},{"id":200062,"policialId":109,"tipo":"Atestado","dataInicio":"2025-06-01","dataFim":"2025-06-01","cid":"","medico":"MATEUS G. SUAREZ","hospital":"IBR","crm":"34766","dias":null,"descricao":"","concluido":false,"_nome":"CARLOS EDUARDO CARVALHO OLIVEIRA","_mat":"92081598"},{"id":200063,"policialId":70,"tipo":"Atestado","dataInicio":"2025-06-10","dataFim":"2025-06-17","cid":"","medico":"ALISSON R. BOTELHO","hospital":"HCC","crm":"19718","dias":7,"descricao":"","concluido":false,"_nome":"CRISTIANO AMÉRICO DIAS SANTOS","_mat":"304815400"},{"id":200064,"policialId":121,"tipo":"Atestado","dataInicio":"2025-06-15","dataFim":"2025-06-17","cid":"M545","medico":"ANDREA SANTANA BRANDÃO","hospital":"HSVP","crm":"20143","dias":2,"descricao":"CID: M545","concluido":false,"_nome":"FRANÇOIS DE ASSIS MACEDO LOPES JUNIOR","_mat":"305261303"},{"id":200065,"policialId":49,"tipo":"Atestado","dataInicio":"2025-06-17","dataFim":"2025-06-23","cid":"","medico":"CHARLES NOGUEIRA","hospital":"INNOVEODONTO","crm":"18318","dias":6,"descricao":"","concluido":false,"_nome":"RICARDO DA SILVA SOUSA","_mat":"303376356"},{"id":200066,"policialId":164,"tipo":"Atestado","dataInicio":"2025-06-16","dataFim":"2025-07-01","cid":"D485","medico":"IGOR AZEVEDO DINIZ","hospital":"HOSPITAL SANTRA HELENA","crm":"30790","dias":15,"descricao":"CID: D485","concluido":false,"_nome":"WASHINGTON CASTRO PIRAJÁ","_mat":"305267032"},{"id":200067,"policialId":155,"tipo":"Atestado","dataInicio":"2025-06-18","dataFim":"2025-06-21","cid":"J03","medico":"ANA CAROLINA B. MARTYN COSTA","hospital":"SAMUR","crm":"42614","dias":3,"descricao":"CID: J03","concluido":false,"_nome":"SÁVIO VIEIRA DOS SANTOS","_mat":"306452397"},{"id":200068,"policialId":190,"tipo":"Atestado","dataInicio":"2025-07-04","dataFim":"2025-07-06","cid":"J069","medico":"TAMARA CARVALHO VASCONCELOS","hospital":"SAMUR","crm":"39958","dias":2,"descricao":"CID: J069","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200069,"policialId":70,"tipo":"Atestado","dataInicio":"2025-07-03","dataFim":"2025-07-10","cid":"A09","medico":"LETÍCIA AZEVEDO BARBOZA CARAN","hospital":"UNIMED","crm":"42619","dias":7,"descricao":"CID: A09","concluido":false,"_nome":"CRISTIANO AMÉRICO DIAS SANTOS","_mat":"304815400"},{"id":200070,"policialId":null,"tipo":"Atestado","dataInicio":"2025-06-29","dataFim":"2025-07-04","cid":"","medico":"DARLAN ANDRADE","hospital":"HOSPITAL MUNICIPAL VICENTE VIEIRA","crm":"45331","dias":5,"descricao":"","concluido":false,"_nome":"CAIO DIAS LEITE","_mat":"30643452"},{"id":200071,"policialId":140,"tipo":"Atestado","dataInicio":"2025-06-29","dataFim":"2025-07-01","cid":"M436","medico":"FELIPE DIAS WANDERLEY DE CARVALHO","hospital":"IBR","crm":"40266","dias":2,"descricao":"CID: M436","concluido":false,"_nome":"LUAN MORAES SOUSA","_mat":"305644218"},{"id":200072,"policialId":190,"tipo":"Atestado","dataInicio":"2025-07-02","dataFim":"2025-07-03","cid":"J01","medico":"LOY CARVALHO DE CASTRO","hospital":"SAMUR","crm":"42606","dias":1,"descricao":"CID: J01","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200073,"policialId":91,"tipo":"Atestado","dataInicio":"2025-07-06","dataFim":"2025-07-11","cid":"V49","medico":"JANINE LOUISE","hospital":"UNIMED","crm":"40385","dias":5,"descricao":"CID: V49","concluido":false,"_nome":"RANIE SANTOS BITTENCOURT","_mat":"305115900"},{"id":200074,"policialId":151,"tipo":"Atestado","dataInicio":"2025-07-10","dataFim":"2025-07-13","cid":"J11","medico":"DR BERNARDO WAIANDT SANTOS","hospital":"DR BERNARDO WAIANDT SANTOS","crm":"38899","dias":3,"descricao":"CID: J11","concluido":false,"_nome":"RÔMULO SANTOS OLIVEIRA","_mat":"306450638"},{"id":200075,"policialId":91,"tipo":"Atestado","dataInicio":"2025-07-10","dataFim":"2025-07-14","cid":"V29","medico":"ANA PAULA GONÇALVES FIGUEREDO","hospital":"UNIMED","crm":"40311","dias":4,"descricao":"CID: V29","concluido":false,"_nome":"RANIE SANTOS BITTENCOURT","_mat":"305115900"},{"id":200076,"policialId":83,"tipo":"Atestado","dataInicio":"2025-07-16","dataFim":"2025-07-16","cid":"","medico":"PAULINO C. FONSÊCA NETO","hospital":"SAMUR","crm":"26439","dias":null,"descricao":"","concluido":false,"_nome":"LOURIVAL SANCHO VIANA FILHO","_mat":"305059154"},{"id":200077,"policialId":49,"tipo":"Atestado","dataInicio":"2025-07-14","dataFim":"2025-07-14","cid":"","medico":"RAISSA AUREA DE OLIVEIRA","hospital":"HOSPITAL AFRÂNIO PEIXOTO","crm":"23405","dias":null,"descricao":"","concluido":false,"_nome":"RICARDO DA SILVA SOUSA","_mat":"303376356"},{"id":200078,"policialId":49,"tipo":"Atestado","dataInicio":"2025-07-15","dataFim":"2025-07-15","cid":"","medico":"RAISSA AUREA DE OLIVEIRA","hospital":"HOSPITAL AFRÂNIO PEIXOTO","crm":"23405","dias":null,"descricao":"","concluido":false,"_nome":"RICARDO DA SILVA SOUSA","_mat":"303376356"},{"id":200079,"policialId":53,"tipo":"Atestado","dataInicio":"2025-07-24","dataFim":"2025-07-25","cid":"","medico":"LAIS RODRIGUES","hospital":"IBR","crm":"35132","dias":1,"descricao":"","concluido":false,"_nome":"SÉRGIO SARAIVA RIBAS CORDEIRO","_mat":"302954397"},{"id":200080,"policialId":114,"tipo":"Atestado","dataInicio":"2025-07-30","dataFim":"2025-08-01","cid":"J01","medico":"DIEGO OLIVEIRA DA SILVA","hospital":"IBR","crm":"28544","dias":2,"descricao":"CID: J01","concluido":false,"_nome":"EDJEFESON SOUZA TORQUATO","_mat":"305836409"},{"id":200081,"policialId":null,"tipo":"Atestado","dataInicio":"2025-08-11","dataFim":"2025-08-26","cid":"S82.1","medico":"UMBERTO PAULO DE CASTRO ALVES FILHO","hospital":"CLINIQUE ESPECIALISTA EM JOELHOS","crm":"15409","dias":15,"descricao":"CID: S82.1","concluido":false,"_nome":"SAUL SANTOS FARIAS","_mat":"304805633"},{"id":200082,"policialId":83,"tipo":"Atestado","dataInicio":"2025-08-20","dataFim":"2025-08-20","cid":"","medico":"HOSPITAL SAMUR S/A","hospital":"SAMUR","crm":"16.205.262/0001-22","dias":null,"descricao":"","concluido":false,"_nome":"LOURIVAL SANCHO VIANA FILHO","_mat":"305059154"},{"id":200083,"policialId":81,"tipo":"Atestado","dataInicio":"2025-08-30","dataFim":"2025-09-02","cid":"M626","medico":"DIEGO OLIVEIRA DA SILVA","hospital":"IBR","crm":"28544","dias":3,"descricao":"CID: M626","concluido":false,"_nome":"KLÉBER JACKSON RODRIGUES DA SILVA","_mat":"304814527"},{"id":200084,"policialId":35,"tipo":"Atestado","dataInicio":"2025-08-30","dataFim":"2025-09-02","cid":"S934","medico":"DANILO R. CELINO","hospital":"HSVP","crm":"31770","dias":3,"descricao":"CID: S934","concluido":false,"_nome":"IONARA CONCEIÇÃO VASCONCELOS SANTOS","_mat":"304295252"},{"id":200085,"policialId":86,"tipo":"Atestado","dataInicio":"2025-09-08","dataFim":"2025-09-08","cid":"","medico":"JONATAS M. MONTEIRO","hospital":"QUALITY ODONTOLOGIA","crm":"11673","dias":null,"descricao":"","concluido":false,"_nome":"MARCOS JOSÉ RIBEIRO SÁ","_mat":"304805251"},{"id":200086,"policialId":70,"tipo":"Atestado","dataInicio":"2025-09-08","dataFim":"2025-09-08","cid":"k59","medico":"RODRIGO AUBIN DIAS","hospital":"HCC","crm":"20032","dias":null,"descricao":"CID: k59","concluido":false,"_nome":"CRISTIANO AMÉRICO DIAS SANTOS","_mat":"304815400"},{"id":200087,"policialId":97,"tipo":"Atestado","dataInicio":"2025-09-05","dataFim":"2025-09-08","cid":"","medico":"JOÃO CARLOS FERRAZ DE O. FILHO","hospital":"ODONTOLOGIA ESPECIALIZADA -DRº JOÃO CARLOS","crm":"6292","dias":3,"descricao":"","concluido":false,"_nome":"YOLANDO COSTA CORREIA JÚNIOR","_mat":"305068137"},{"id":200088,"policialId":188,"tipo":"Atestado","dataInicio":"2025-09-14","dataFim":"2025-09-16","cid":"","medico":"JOSÉ EVERALDO E SILVA","hospital":"HSVP","crm":"32797","dias":2,"descricao":"","concluido":false,"_nome":"DIEGO OLIVEIRA DO CARMO","_mat":"306019018"},{"id":200089,"policialId":167,"tipo":"Atestado","dataInicio":"2025-09-15","dataFim":"2025-09-29","cid":"Z35.9","medico":"WASTY SANTOS LIMA BRITO","hospital":"CLIGO","crm":"12393","dias":14,"descricao":"CID: Z35.9","concluido":false,"_nome":"ZORAIDE BATISTA BARROS","_mat":"305642698"},{"id":200090,"policialId":75,"tipo":"Atestado","dataInicio":"2025-09-16","dataFim":"2025-09-21","cid":"","medico":"LUIZ EDUARDO G LADEIA","hospital":"LADEIA ODONTOLOGIA","crm":"9043","dias":5,"descricao":"","concluido":false,"_nome":"ISMAEL VIEIRA DOS SANTOS","_mat":"304812965"},{"id":200091,"policialId":188,"tipo":"Atestado","dataInicio":"2025-09-19","dataFim":"2025-09-19","cid":"","medico":"HOSPITAL SÃO VICENTE DE PAULO","hospital":"HSVP","crm":"16.196.263/0001-58","dias":null,"descricao":"","concluido":false,"_nome":"DIEGO OLIVEIRA DO CARMO","_mat":"306019018"},{"id":200092,"policialId":188,"tipo":"Atestado","dataInicio":"2025-09-19","dataFim":"2025-09-20","cid":"","medico":"MARCOS HENRIQUE PARAÍSO SILVA","hospital":"HSVP","crm":"31246","dias":1,"descricao":"","concluido":false,"_nome":"DIEGO OLIVEIRA DO CARMO","_mat":"306019018"},{"id":200093,"policialId":121,"tipo":"Atestado","dataInicio":"2025-09-20","dataFim":"2025-09-21","cid":"J22","medico":"MARIA LUISA CARDOSO OLIVEIRA","hospital":"IBR","crm":"42251","dias":1,"descricao":"CID: J22","concluido":false,"_nome":"FRANÇOIS DE ASSIS MACEDO LOPES JUNIOR","_mat":"305261303"},{"id":200094,"policialId":81,"tipo":"Atestado","dataInicio":"2025-09-22","dataFim":"2025-09-22","cid":"Z76.3","medico":"BRUNO LADEIA MENDES","hospital":"POLICLÍNICA SAGRADA FAMÍLIA","crm":"26730","dias":null,"descricao":"CID: Z76.3","concluido":false,"_nome":"KLÉBER JACKSON RODRIGUES DA SILVA","_mat":"304814527"},{"id":200095,"policialId":176,"tipo":"Atestado","dataInicio":"2025-10-04","dataFim":"2025-10-04","cid":"Z76.3","medico":"JOSÉ EVERALDO E SILVA","hospital":"HSVP","crm":"32797","dias":null,"descricao":"CID: Z76.3","concluido":false,"_nome":"DANIEL DA SILVA CAMPOS","_mat":"304842300"},{"id":200096,"policialId":132,"tipo":"Atestado","dataInicio":"2025-10-09","dataFim":"2025-10-11","cid":"J06","medico":"WELLEN GONSALVES OLIVEIRA DE CARVALHO","hospital":"SAMUR","crm":"36416","dias":2,"descricao":"CID: J06","concluido":false,"_nome":"ISAAC RODRIGUES SANTANA","_mat":"305628791"},{"id":200097,"policialId":191,"tipo":"Atestado","dataInicio":"2025-10-15","dataFim":"2025-10-17","cid":"","medico":"RAFAHEL SANTOS SOUSA BONFIM","hospital":"SAMUR","crm":"42151","dias":2,"descricao":"","concluido":false,"_nome":"HÉLZIO LEÃO SOUZA","_mat":"305261599"},{"id":200098,"policialId":null,"tipo":"Atestado","dataInicio":"2025-10-16","dataFim":"2025-10-16","cid":"","medico":"VICTOR BARRETO SOBRAL WANDERLEY","hospital":"HSVP","crm":"36403","dias":null,"descricao":"","concluido":false,"_nome":"GILMAR MACIEL DE ALMEIDA","_mat":"302956234"},{"id":200099,"policialId":59,"tipo":"Atestado","dataInicio":"2025-10-17","dataFim":"2025-10-22","cid":"I86","medico":"ALAN PASCOAL","hospital":"UROLASER","crm":"27945","dias":5,"descricao":"CID: I86","concluido":false,"_nome":"AMADEUS NASCIMENTO SANTOS","_mat":"305058637"},{"id":200100,"policialId":58,"tipo":"Atestado","dataInicio":"2025-10-23","dataFim":"2025-10-28","cid":"S903","medico":"DAKSON ROCHA CAMARGO","hospital":"IBR","crm":"27501","dias":5,"descricao":"CID: S903","concluido":false,"_nome":"PABLO MANOEL ALMEIDA BORBA","_mat":"303897297"},{"id":200101,"policialId":75,"tipo":"Atestado","dataInicio":"2025-10-28","dataFim":"2025-11-02","cid":"","medico":"LUIZ EDUARDO G. LADEIA","hospital":"LADEIA ODONTOLOGIA","crm":"9043","dias":5,"descricao":"","concluido":false,"_nome":"ISMAEL VIEIRA DOS SANTOS","_mat":"304812965"},{"id":200102,"policialId":67,"tipo":"Atestado","dataInicio":"2025-10-27","dataFim":"2025-10-27","cid":"","medico":"LARISSA NEVES DIAS","hospital":"UNIMED","crm":"46127","dias":null,"descricao":"","concluido":false,"_nome":"CHARLES SOUZA DO NASCIMENTO","_mat":"304811943"},{"id":200103,"policialId":97,"tipo":"Atestado","dataInicio":"2025-10-18","dataFim":"2025-10-30","cid":"","medico":"JOÃO CARLOS FERRAZ DE O. FILHO","hospital":"ODONTOLOGIA ESPECIALIZADA -DRº JOÃO CARLOS","crm":"6292","dias":12,"descricao":"","concluido":false,"_nome":"YOLANDO COSTA CORREIA JÚNIOR","_mat":"305068137"},{"id":200104,"policialId":90,"tipo":"Atestado","dataInicio":"2025-10-22","dataFim":"2025-11-01","cid":"","medico":"DAYANNE BOTELHO","hospital":"DRA DAYANNE BOTELHO","crm":"17556","dias":10,"descricao":"","concluido":false,"_nome":"PEDRO SILVA DE ALMEIDA","_mat":"305114912"},{"id":200105,"policialId":155,"tipo":"Atestado","dataInicio":"2025-10-19","dataFim":"2025-11-02","cid":"S52.4","medico":"PAULINO C. FONSÊCA NETO","hospital":"SAMUR","crm":"26439","dias":14,"descricao":"CID: S52.4","concluido":false,"_nome":"SÁVIO VIEIRA DOS SANTOS","_mat":"306452397"},{"id":200106,"policialId":170,"tipo":"Atestado","dataInicio":"2025-10-30","dataFim":"2025-10-30","cid":"","medico":"HCC","hospital":"HCC","crm":"13.340.625/0001-44","dias":null,"descricao":"","concluido":false,"_nome":"ELIENE ANDRADE CEZARANO","_mat":"303379215"},{"id":200107,"policialId":202,"tipo":"Atestado","dataInicio":"2025-11-04","dataFim":"2025-11-05","cid":"","medico":"MARIA LUISA CARDOSO OLIVEIRA","hospital":"IBR","crm":"42251","dias":1,"descricao":"","concluido":false,"_nome":"MONIQUE DA SILVA COSTA","_mat":"306448966"},{"id":200108,"policialId":202,"tipo":"Atestado","dataInicio":"2025-11-03","dataFim":"2025-11-03","cid":"Z76.3","medico":"THAIS COSTA MARINHO DE CARVALHO","hospital":"HSVP","crm":"32579","dias":null,"descricao":"CID: Z76.3","concluido":false,"_nome":"MONIQUE DA SILVA COSTA","_mat":"306448966"},{"id":200109,"policialId":76,"tipo":"Atestado","dataInicio":"2025-11-18","dataFim":"2025-12-03","cid":"I63","medico":"PHILIP GLASS","hospital":"INSTITUTO GLASS","crm":"18913","dias":15,"descricao":"CID: I63","concluido":false,"_nome":"ISRAEL DE SOUZA BONFIM","_mat":"305068763"},{"id":200110,"policialId":190,"tipo":"Atestado","dataInicio":"2025-11-08","dataFim":"2025-11-09","cid":"","medico":"MAYARA VIEIRA","hospital":"IBR","crm":"28553","dias":1,"descricao":"","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200111,"policialId":190,"tipo":"Atestado","dataInicio":"2025-11-17","dataFim":"2025-11-22","cid":"","medico":"ANA CAROLINA B. MARTYN COSTA","hospital":"SAMUR","crm":"42614","dias":5,"descricao":"","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200112,"policialId":190,"tipo":"Atestado","dataInicio":"2025-11-22","dataFim":"2025-11-24","cid":"F51","medico":"FERNANDO FERNANDES GONÇALVES DA SILVA","hospital":"DR. FERNANDO FERNANDES PSIQUIATRIA E SAÚDE MENTAL","crm":"37012","dias":2,"descricao":"CID: F51","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200113,"policialId":191,"tipo":"Atestado","dataInicio":"2025-11-23","dataFim":"2025-11-25","cid":"R11","medico":"ISABELE FREITAS","hospital":"IBR","crm":"34831","dias":2,"descricao":"CID: R11","concluido":false,"_nome":"HÉLZIO LEÃO SOUZA","_mat":"305261599"},{"id":200114,"policialId":109,"tipo":"Atestado","dataInicio":"2025-12-07","dataFim":"2025-12-08","cid":"H612","medico":"MARIA LUISA CARDOSO OLIVEIRA","hospital":"IBR","crm":"42251","dias":1,"descricao":"CID: H612","concluido":false,"_nome":"CARLOS EDUARDO CARVALHO OLIVEIRA","_mat":"92081598"},{"id":200115,"policialId":88,"tipo":"Atestado","dataInicio":"2025-12-08","dataFim":"2025-12-08","cid":"","medico":"LORENA GALVÃO","hospital":"SANTA LUZIA HOSPITAL DE OLHOS","crm":"411067","dias":null,"descricao":"","concluido":false,"_nome":"MATEUS ALVES DE OLIVEIRA SOUZA","_mat":"304814501"},{"id":200116,"policialId":129,"tipo":"Atestado","dataInicio":"2025-12-16","dataFim":"2025-12-21","cid":"","medico":"FELIPE WOBETO","hospital":"SORRIFACIL","crm":"CRO 21424","dias":5,"descricao":"","concluido":false,"_nome":"IAGO SANTOS LOPES","_mat":"306453953"},{"id":200117,"policialId":98,"tipo":"Atestado","dataInicio":"2025-12-16","dataFim":"2025-12-19","cid":"K52","medico":"CAMILA CRUZES ANDRADE","hospital":"SAMUR","crm":"37917","dias":3,"descricao":"CID: K52","concluido":false,"_nome":"ADRIANO SANTOS SILVA","_mat":"306430329"},{"id":200118,"policialId":190,"tipo":"Atestado","dataInicio":"2025-01-04","dataFim":"2025-01-09","cid":"M51","medico":"FELIPE DIAS WANDERLEY DE CARVALHO","hospital":"IBR","crm":"40226","dias":5,"descricao":"CID: M51","concluido":true,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200119,"policialId":169,"tipo":"Atestado","dataInicio":"2025-01-07","dataFim":"2025-01-11","cid":"","medico":"MALU SEIXAS","hospital":"INSTITUTO TRANSFORME","crm":"CRO 17399","dias":4,"descricao":"","concluido":true,"_nome":"MÁRCIA REGINA SOUZA","_mat":"302959680"},{"id":200120,"policialId":172,"tipo":"Atestado","dataInicio":"2025-01-04","dataFim":"2025-01-05","cid":"A09","medico":"MAYARA VIEIRA","hospital":"IBR","crm":"28553","dias":1,"descricao":"CID: A09","concluido":true,"_nome":"TEDSON GONÇALVES DE BRITO","_mat":"303907628"},{"id":200121,"policialId":190,"tipo":"Atestado","dataInicio":"2025-01-09","dataFim":"2025-01-11","cid":"F51","medico":"FERNANDO FERNANDES GONÇALVES DA SILVA","hospital":"DR. FERNANDO FERNANDES PSIQUIATRIA E SAÚDE MENTAL","crm":"37012","dias":2,"descricao":"CID: F51","concluido":true,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200122,"policialId":190,"tipo":"Atestado","dataInicio":"2026-01-13","dataFim":"2026-01-14","cid":"F51","medico":"FERNANDO FERNANDES GONÇALVES DA SILVA","hospital":"DR. FERNANDO FERNANDES PSIQUIATRIA E SAÚDE MENTAL","crm":"37012","dias":1,"descricao":"CID: F51","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200123,"policialId":184,"tipo":"Atestado","dataInicio":"2026-01-14","dataFim":"2026-01-15","cid":"G43","medico":"CAMILA NEVES","hospital":"IBR","crm":"43456","dias":1,"descricao":"CID: G43","concluido":false,"_nome":"CARLOS RODRIGO FERREIRA ANDRADE","_mat":"305260543"},{"id":200124,"policialId":160,"tipo":"Atestado","dataInicio":"2026-01-19","dataFim":"2026-02-03","cid":"F32.2","medico":"IVAN GILSON SILVA MOURA","hospital":"IVAN MOURA","crm":"12849","dias":15,"descricao":"CID: F32.2","concluido":false,"_nome":"THYARA CAMPOS DE OLIVEIRA MIRANDA","_mat":"30563458"},{"id":200125,"policialId":133,"tipo":"Atestado","dataInicio":"2026-01-23","dataFim":"2026-01-26","cid":"","medico":"SILVIA MAGALHÃES DE CARVALHO","hospital":"DRA. SILVIA MAGALHÃES DE CARVALHO - DENTISTA","crm":"13543","dias":3,"descricao":"","concluido":false,"_nome":"IVONILSON GUSMÃO DE OLIVEIRA","_mat":"306474789"},{"id":200126,"policialId":194,"tipo":"Atestado","dataInicio":"2026-01-21","dataFim":"2026-01-26","cid":"Z96","medico":"NELSON LOPES JUNIOR","hospital":"LÍVIA BORGES CIRURGIÃ DENTISTA","crm":"MG 24265","dias":5,"descricao":"CID: Z96","concluido":false,"_nome":"JOELSON SANTOS DE OLIVEIRA","_mat":"305263931"},{"id":200127,"policialId":148,"tipo":"Atestado","dataInicio":"2026-01-21","dataFim":"2026-01-24","cid":"","medico":"RICARDO ALVES","hospital":"MENDONÇA ALVES IMPLANTODONTIA","crm":"CRO 5916","dias":3,"descricao":"","concluido":false,"_nome":"RENATO NASCIMENTO DE AQUINO","_mat":"305838948"},{"id":200128,"policialId":151,"tipo":"Atestado","dataInicio":"29/01/2026","dataFim":"29/01/2026","cid":"","medico":"EDUARDA NALILAN LEITE GOMES","hospital":"EDUARDA NALILAN LEITE GOMES","crm":"CREFITO 7 Nº 247015-7","dias":null,"descricao":"","concluido":false,"_nome":"RÔMULO SANTOS OLIVEIRA","_mat":"306450638"},{"id":200129,"policialId":188,"tipo":"Atestado","dataInicio":"31/01/2026","dataFim":"2026-02-02","cid":"","medico":"MAYARA VIEIRA","hospital":"IBR","crm":"28553","dias":2,"descricao":"","concluido":false,"_nome":"DIEGO OLIVEIRA DO CARMO","_mat":"306019018"},{"id":200130,"policialId":190,"tipo":"Atestado","dataInicio":"2026-01-29","dataFim":"2026-01-29","cid":"","medico":"MAURÍLIO M. S. CALDEIRA","hospital":"CLÍNICA VITÓRIA","crm":"18395","dias":null,"descricao":"","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200131,"policialId":190,"tipo":"Atestado","dataInicio":"2026-02-02","dataFim":"2026-02-04","cid":"F51","medico":"FERNANDO FERNANDES GONÇALVES DA SILVA","hospital":"DR. FERNANDO FERNANDES PSIQUIATRIA E SAÚDE MENTAL","crm":"37012","dias":2,"descricao":"CID: F51","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200132,"policialId":78,"tipo":"Atestado","dataInicio":"2026-02-04","dataFim":"2026-02-05","cid":"A09","medico":"MAYARA VIEIRA","hospital":"IBR","crm":"28553","dias":1,"descricao":"CID: A09","concluido":false,"_nome":"JOAN RITO AMORIM DE CARVALHO","_mat":"304815230"},{"id":200133,"policialId":28,"tipo":"Atestado","dataInicio":"2026-02-06","dataFim":"2026-02-20","cid":"Z54.0","medico":"LUIZ FELIPE SAMPAIO","hospital":"HOC","crm":"23644","dias":14,"descricao":"CID: Z54.0","concluido":false,"_nome":"ALESSANDRO VILAS BOAS CARDOSO","_mat":"304274400"},{"id":200134,"policialId":null,"tipo":"Atestado","dataInicio":"2026-02-05","dataFim":"2026-02-06","cid":"A09","medico":"RAFAHEL SANTOS SOUSA BONFIM","hospital":"SAMUR","crm":"42151","dias":1,"descricao":"CID: A09","concluido":false,"_nome":"JOSE MARIA PINTO","_mat":"30296878"},{"id":200135,"policialId":93,"tipo":"Atestado","dataInicio":"2026-02-02","dataFim":"2026-02-16","cid":"F41.1","medico":"ROXANA PIERRE M. FREITAS","hospital":"NEUROCENTER","crm":"24069","dias":14,"descricao":"CID: F41.1","concluido":false,"_nome":"ROGÉRIO DOS SANTOS TEIXEIRA","_mat":"305059405"},{"id":200136,"policialId":88,"tipo":"Atestado","dataInicio":"2026-02-03","dataFim":"2026-02-06","cid":"J01","medico":"ANA CAROLINA BARRETO MARTYN COSTA","hospital":"SAMUR","crm":"42614","dias":3,"descricao":"CID: J01","concluido":false,"_nome":"MATEUS ALVES DE OLIVEIRA SOUZA","_mat":"304814501"},{"id":200137,"policialId":38,"tipo":"Atestado","dataInicio":"2026-02-03","dataFim":"2026-02-04","cid":"E86","medico":"TALES BURITY","hospital":"DR. TIGRE","crm":"30126","dias":1,"descricao":"CID: E86","concluido":false,"_nome":"JOELMA DE ALMEIDA CRUZ","_mat":"303375693"},{"id":200138,"policialId":190,"tipo":"Atestado","dataInicio":"2026-02-12","dataFim":"2026-02-15","cid":"M53.2","medico":"ITALO DIAS ESPÍNOLA","hospital":"IBR","crm":"30648","dias":3,"descricao":"CID: M53.2","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200139,"policialId":37,"tipo":"Atestado","dataInicio":"2026-02-19","dataFim":"2026-03-06","cid":"S623","medico":"RAFAEL S. L. BARBOSA","hospital":"SAMUR","crm":"33964","dias":15,"descricao":"CID: S623","concluido":false,"_nome":"IVAN SANTOS BITTENCOURT","_mat":"302958472"},{"id":200140,"policialId":135,"tipo":"Atestado","dataInicio":"2026-02-21","dataFim":"2026-02-23","cid":"K29.1","medico":"MOANAH BRITO","hospital":"PMVC","crm":"48997","dias":2,"descricao":"CID: K29.1","concluido":false,"_nome":"JEFERSON PAIVA DE OLIVEIRA","_mat":"92048251"},{"id":200141,"policialId":140,"tipo":"Atestado","dataInicio":"2026-02-22","dataFim":"2026-02-23","cid":"J069","medico":"FELIPE D. W. DE CARVALHO","hospital":"IBR","crm":"40266","dias":1,"descricao":"CID: J069","concluido":false,"_nome":"LUAN MORAES SOUSA","_mat":"305644218"},{"id":200142,"policialId":189,"tipo":"Atestado","dataInicio":"2026-02-22","dataFim":"2026-02-23","cid":"J069","medico":"ANA CAROLINA BARRETO MARTYN COSTA","hospital":"SAMUR","crm":"42614","dias":1,"descricao":"CID: J069","concluido":false,"_nome":"DIEGO SILVA GUSMÃO","_mat":"305574552"},{"id":200143,"policialId":135,"tipo":"Atestado","dataInicio":"2026-02-24","dataFim":"2026-02-26","cid":"K29.1","medico":"REBECA B. F. LESSA","hospital":"PMVC","crm":"45478","dias":2,"descricao":"CID: K29.1","concluido":false,"_nome":"JEFERSON PAIVA DE OLIVEIRA","_mat":"92048251"},{"id":200144,"policialId":190,"tipo":"Atestado","dataInicio":"2026-02-20","dataFim":"2026-02-24","cid":"M544","medico":"RODRIGO MENDONÇA FREITAS","hospital":"IBR","crm":"27296","dias":4,"descricao":"CID: M544","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200145,"policialId":190,"tipo":"Atestado","dataInicio":"2026-02-24","dataFim":"2026-02-24","cid":"","medico":"GEFTER CORRÊA","hospital":"USF CIDADE MODELO","crm":"14275","dias":null,"descricao":"","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200146,"policialId":184,"tipo":"Atestado","dataInicio":"2026-03-10","dataFim":"2026-03-10","cid":"","medico":"ORTOMED","hospital":"ORTOMED","crm":"13.768.320/0001-38","dias":null,"descricao":"","concluido":false,"_nome":"CARLOS RODRIGO FERREIRA ANDRADE","_mat":"305260543"},{"id":200147,"policialId":125,"tipo":"Atestado","dataInicio":"2026-03-08","dataFim":"2026-03-08","cid":"","medico":"FLAVIO SANTOS (ADMINISTRATIVO)","hospital":"SAMUR","crm":"","dias":null,"descricao":"","concluido":false,"_nome":"GIVANILDO LEITE DE ANDRADE","_mat":"305262341"},{"id":200148,"policialId":38,"tipo":"Atestado","dataInicio":"2026-03-06","dataFim":"2026-03-06","cid":"","medico":"CARDIO RITMO","hospital":"CARDIO RITMO","crm":"10321492/0001-70","dias":null,"descricao":"","concluido":false,"_nome":"JOELMA DE ALMEIDA CRUZ","_mat":"303375693"},{"id":200149,"policialId":55,"tipo":"Atestado","dataInicio":"2026-03-08","dataFim":"2026-03-10","cid":"J069","medico":"ANA CAROLINA B. MARTYN COSTA","hospital":"SAMUR","crm":"42614","dias":2,"descricao":"CID: J069","concluido":false,"_nome":"WILMAR ALVES DO PRADO","_mat":"303907602"},{"id":200150,"policialId":140,"tipo":"Atestado","dataInicio":"2026-03-06","dataFim":"2026-03-09","cid":"L02.2","medico":"RHYAN COELHO SANTOS SOUZA","hospital":"IBR","crm":"47391","dias":3,"descricao":"CID: L02.2","concluido":false,"_nome":"LUAN MORAES SOUSA","_mat":"305644218"},{"id":200151,"policialId":94,"tipo":"Atestado","dataInicio":"2026-03-09","dataFim":"2026-03-10","cid":"T016","medico":"RAFAEL AUGUSTO RODRIGUES DOS SANTOS","hospital":"SAÚDE ATENÇÃO BÁSICA VCA","crm":"20060","dias":1,"descricao":"CID: T016","concluido":false,"_nome":"TYRONE SOUSA SANTOS","_mat":"305075100"},{"id":200152,"policialId":155,"tipo":"Atestado","dataInicio":"2026-03-09","dataFim":"2026-03-12","cid":"K08.1","medico":"ÍTALO ISRAEL ALMEIDA QUEIROZ","hospital":"CLÍNICA DE URGÊNCIA","crm":"12008","dias":3,"descricao":"CID: K08.1","concluido":false,"_nome":"SÁVIO VIEIRA DOS SANTOS","_mat":"306452397"},{"id":200153,"policialId":115,"tipo":"Atestado","dataInicio":"2026-03-11","dataFim":"2026-03-16","cid":"Z96","medico":"NELSON LOPES JUNIOR","hospital":"LÍVIA BORGES CIRURGIÃ DENTISTA","crm":"24265","dias":5,"descricao":"CID: Z96","concluido":false,"_nome":"EDREI ALMEIDA SOUSA","_mat":"306436422"},{"id":200154,"policialId":153,"tipo":"Atestado","dataInicio":"2026-03-12","dataFim":"2026-03-22","cid":"","medico":"JOSÉ DEOCLECIO ANDRADE FERRAZ","hospital":"HSVP","crm":"18337","dias":10,"descricao":"","concluido":false,"_nome":"RONYELLE DE ALMEIDA TELES","_mat":"305640400"},{"id":200155,"policialId":null,"tipo":"Atestado","dataInicio":"2026-03-13","dataFim":"2026-03-19","cid":"L038","medico":"JOSE EVERALDO E SILVA","hospital":"SAÚDE ATENÇÃO BÁSICA VCA","crm":"32797","dias":6,"descricao":"CID: L038","concluido":false,"_nome":"WAGNER FERREIRA DA SILVA","_mat":"304814933"},{"id":200156,"policialId":98,"tipo":"Atestado","dataInicio":"2026-03-15","dataFim":"2026-03-16","cid":"A09","medico":"MARIA LUISA CARDOSO OLIVEIRA","hospital":"IBR","crm":"42251","dias":1,"descricao":"CID: A09","concluido":false,"_nome":"ADRIANO SANTOS SILVA","_mat":"306430329"},{"id":200157,"policialId":105,"tipo":"Atestado","dataInicio":"2026-03-18","dataFim":"2026-04-01","cid":"F41.1","medico":"ANDRESSA ANDRADE","hospital":"PMBA","crm":"26146","dias":14,"descricao":"CID: F41.1","concluido":false,"_nome":"BRUNA  DOS SANTOS CAJÁ SOARES","_mat":"92069885"},{"id":200158,"policialId":129,"tipo":"Atestado","dataInicio":"2026-03-18","dataFim":"2026-03-19","cid":"","medico":"MARIA FERNANDA F.F. GREGÓRIO","hospital":"SORRIFACIL","crm":"17371","dias":1,"descricao":"","concluido":false,"_nome":"IAGO SANTOS LOPES","_mat":"306453953"},{"id":200159,"policialId":143,"tipo":"Atestado","dataInicio":"2026-03-20","dataFim":"2026-03-22","cid":"M54","medico":"CAMILA CRUZES DE ANDRADE","hospital":"SAMUR","crm":"37917","dias":2,"descricao":"CID: M54","concluido":false,"_nome":"MARLÚCIO DOS SANTOS NASCIMENTO","_mat":"305265080"},{"id":200160,"policialId":53,"tipo":"Atestado","dataInicio":"2026-03-20","dataFim":"2026-03-21","cid":"","medico":"ANDREZA QUEIROZ BRITO","hospital":"INOVAR","crm":"CRO-16925","dias":1,"descricao":"","concluido":false,"_nome":"SÉRGIO SARAIVA RIBAS CORDEIRO","_mat":"302954397"},{"id":200161,"policialId":148,"tipo":"Atestado","dataInicio":"2026-04-06","dataFim":"2026-04-13","cid":"","medico":"RICARDO ALVES","hospital":"MENDONÇA ALVES IMPLANTODONTIA","crm":"CRO BA 5916","dias":7,"descricao":"","concluido":false,"_nome":"RENATO NASCIMENTO DE AQUINO","_mat":"305838948"},{"id":200162,"policialId":175,"tipo":"Atestado","dataInicio":"2026-04-07","dataFim":"2026-04-09","cid":"N201","medico":"LUAN QUEIROZ DUTRA","hospital":"SAMUR","crm":"25544","dias":2,"descricao":"CID: N201","concluido":false,"_nome":"ALEANDRO SILVA PRADO","_mat":"304812452"},{"id":200163,"policialId":40,"tipo":"Atestado","dataInicio":"2026-04-15","dataFim":"2026-04-22","cid":"L02.2","medico":"CAMILA CRUZES DE ANDRADE","hospital":"SAMUR","crm":"37917","dias":7,"descricao":"CID: L02.2","concluido":false,"_nome":"JOSÉ LÚCIO SANTOS TAVARES","_mat":"303896720"},{"id":200164,"policialId":190,"tipo":"Atestado","dataInicio":"2026-04-15","dataFim":"2026-04-27","cid":"M54","medico":"ANTONIO JUNIOR COTRIM BRANDÃO","hospital":"IBR","crm":"8712/BA","dias":12,"descricao":"CID: M54","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200165,"policialId":190,"tipo":"Atestado","dataInicio":"2026-04-13","dataFim":"2026-04-16","cid":"M545","medico":"GABRIEL PRADO","hospital":"IBR","crm":"23875","dias":3,"descricao":"CID: M545","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200166,"policialId":190,"tipo":"Atestado","dataInicio":"2026-04-01","dataFim":"2026-04-09","cid":"F41.1","medico":"LEANDRO S. SOUSA","hospital":"PREFEITURA","crm":"22353","dias":8,"descricao":"CID: F41.1","concluido":false,"_nome":"GABRIEL FERREIRA DE ALCANTARA","_mat":"306146996"},{"id":200167,"policialId":121,"tipo":"Atestado","dataInicio":"2026-04-17","dataFim":"2026-04-19","cid":"S608","medico":"RODRIGO MENDONÇA FREITAS","hospital":"IBR","crm":"27296","dias":2,"descricao":"CID: S608","concluido":false,"_nome":"FRANÇOIS DE ASSIS MACEDO LOPES JUNIOR","_mat":"305261303"},{"id":200168,"policialId":159,"tipo":"Atestado","dataInicio":"2026-04-23","dataFim":"2026-04-23","cid":"","medico":"THIAGO S. NOVAIS","hospital":"SAMUR","crm":"17759","dias":null,"descricao":"","concluido":false,"_nome":"THIAGO MOISÉS ALMEIDA SANTOS","_mat":"305266905"},{"id":200169,"policialId":132,"tipo":"Atestado","dataInicio":"2026-04-23","dataFim":"2026-04-23","cid":"","medico":"PAOLLA CURCIO","hospital":"HSVP","crm":"40054","dias":null,"descricao":"","concluido":false,"_nome":"ISAAC RODRIGUES SANTANA","_mat":"305628791"},{"id":200170,"policialId":106,"tipo":"Atestado","dataInicio":"2026-04-22","dataFim":"2026-05-02","cid":"S934","medico":"ANTONIO RIBEIRO CORREIA","hospital":"ORTOMED","crm":"8952","dias":10,"descricao":"CID: S934","concluido":false,"_nome":"BRUNO MOURA ALMEIDA","_mat":"306434412"},{"id":200171,"policialId":115,"tipo":"Atestado","dataInicio":"2026-04-29","dataFim":"2026-05-14","cid":"S923","medico":"LUCAS OLIVEIRA MENDES","hospital":"SAMUR","crm":"48037","dias":15,"descricao":"CID: S923","concluido":false,"_nome":"EDREI ALMEIDA SOUSA","_mat":"306436422"},{"id":200172,"policialId":170,"tipo":"Atestado","dataInicio":"2026-05-10","dataFim":"2026-05-11","cid":"M511","medico":"BRUNA BRANDÃO","hospital":"IBR","crm":"49945","dias":1,"descricao":"CID: M511","concluido":false,"_nome":"ELIENE ANDRADE CEZARANO","_mat":"303379215"},{"id":200173,"policialId":127,"tipo":"Atestado","dataInicio":"2026-05-06","dataFim":"2026-05-06","cid":"J18","medico":"REBECA SANTANA P. DA S. BORGES","hospital":"HSVP","crm":"739275","dias":null,"descricao":"CID: J18","concluido":false,"_nome":"HELTON FERREIRA GOMES","_mat":"305261604"}];
const SITUACOES = [...SITUACOES_ATIVO, ...SITUACOES_INATIVO];

const USUARIOS_INICIAIS = []; // Usuários gerenciados pelo Supabase

// ──────────────────────────────────────────────
// UTILITÁRIOS
// ──────────────────────────────────────────────
function calcIdade(dn) {
  if (!dn) return null;
  const diff = Date.now() - new Date(dn).getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

function calcTS(adm) {
  if (!adm) return null;
  const diff = Date.now() - new Date(adm).getTime();
  const y = Math.floor(diff / (365.25 * 24 * 3600 * 1000));
  const m = Math.floor((diff / (30.44 * 24 * 3600 * 1000)) % 12);
  return `${y}a ${m}m`;
}

function fmtDate(d) {
  if (!d) return "-";
  const parts = d.split("-");
  if (parts.length !== 3) return d;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

// Remove pontos/traços de matrícula para comparação
function cleanMat(m) {
  return String(m||"").replace(/[\.\-]/g,"").toLowerCase().trim();
}

function rankSort(a, b) {
  const ai = RANK_ORDER.indexOf(a.grau ?? ""), bi = RANK_ORDER.indexOf(b.grau ?? "");
  return (ai===-1?99:ai)-(bi===-1?99:bi);
}

// useSupabaseState imported from ./useSupabase.js

// ──────────────────────────────────────────────
// COMPONENTES BASE
// ──────────────────────────────────────────────
const AVATAR_COLORS = ["#1a56db","#0694a2","#7e3af2","#ff5a1f","#057a55","#b45309","#be185d"];
function Avatar({ name, size=40 }) {
  const initials = (name||"?").split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("");
  const c = AVATAR_COLORS[(name||"").charCodeAt(0) % AVATAR_COLORS.length];
  return <div style={{width:size,height:size,borderRadius:"50%",background:c,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.35,fontWeight:600,flexShrink:0,userSelect:"none"}}>{initials.toUpperCase()}</div>;
}

function Badge({ children, color="#e8f0fe", textColor="#1a56db", size=11 }) {
  return <span style={{background:color,color:textColor,fontSize:size,fontWeight:500,padding:"2px 8px",borderRadius:999,whiteSpace:"nowrap"}}>{children}</span>;
}

function SitBadge({ sit }) {
  const map = {
    "Ativo":["#dcfce7","#15803d"],
    "Férias":["#dbeafe","#1d4ed8"],
    "Atestado":["#fef3c7","#92400e"],
    "Licença Maternidade":["#fce7f3","#9d174d"],
    "Licença Paternidade":["#ede9fe","#5b21b6"],
    "Junta Médica":["#fee2e2","#991b1b"],
    "Licença Prêmio":["#d1fae5","#065f46"],
    "Afastado":["#f3f4f6","#374151"],
  };
  const [bg, fg] = map[sit] || ["#f3f4f6","#374151"];
  return <Badge color={bg} textColor={fg}>{sit}</Badge>;
}

// Calcula situação real do policial cruzando módulos (férias, afastamentos)
function getSituacaoReal(officer, afastamentos, ferias) {
  if (!officer) return "Ativo";
  const today = new Date().toISOString().slice(0,10);
  const emFerias = (ferias||[]).some(pl=>
    (pl.participantes||[]).some(p=>{
      if (p.policialId!==officer.id) return false;
      const ini=p.dataInicio||pl.dataInicio; const fim=p.dataFim||pl.dataFim;
      return (ini&&fim&&ini<=today&&fim>=today)||(pl.status==="em_andamento");
    })
  );
  if (emFerias) return "Férias";
  const afast=(afastamentos||[]).filter(a=>
    a.policialId===officer.id&&!a.concluido&&
    (!a.dataInicio||a.dataInicio<=today)&&(!a.dataFim||a.dataFim>=today)
  );
  if (afast.length>0) {
    const prio=["Junta Médica","Restrição Médica","Atestado","Licença Maternidade","Licença Paternidade","Licença Prêmio","Luto","Núpcias"];
    for (const p of prio) { if (afast.some(a=>a.tipo===p)) return p; }
    return afast[0].tipo;
  }
  return officer.situacao||"Ativo";
}

function Card({ children, style={} }) {
  return <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:16,...style}}>{children}</div>;
}

function Input({ label, ...props }) {
  return (
    <div style={{marginBottom:12}}>
      {label && <label style={{display:"block",fontSize:12,color:"#374151",fontWeight:500,marginBottom:4}}>{label}</label>}
      <input style={{width:"100%",padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,outline:"none",boxSizing:"border-box"}} {...props}/>
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{marginBottom:12}}>
      {label && <label style={{display:"block",fontSize:12,color:"#374151",fontWeight:500,marginBottom:4}}>{label}</label>}
      <select style={{width:"100%",padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,background:"#fff",outline:"none",boxSizing:"border-box"}} {...props}>{children}</select>
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div style={{marginBottom:12}}>
      {label && <label style={{display:"block",fontSize:12,color:"#374151",fontWeight:500,marginBottom:4}}>{label}</label>}
      <textarea style={{width:"100%",padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,outline:"none",boxSizing:"border-box",resize:"vertical"}} {...props}/>
    </div>
  );
}

function Btn({ children, variant="primary", small=false, ...props }) {
  const base = {border:"none",borderRadius:7,cursor:"pointer",fontWeight:500,transition:"opacity 0.15s"};
  const v = {
    primary:{background:"#1e3a5f",color:"#fff",padding:small?"5px 12px":"8px 18px",fontSize:small?12:13},
    secondary:{background:"#f3f4f6",color:"#374151",padding:small?"5px 12px":"8px 18px",fontSize:small?12:13,border:"1px solid #d1d5db"},
    danger:{background:"#dc2626",color:"#fff",padding:small?"5px 12px":"8px 18px",fontSize:small?12:13},
    success:{background:"#16a34a",color:"#fff",padding:small?"5px 12px":"8px 18px",fontSize:small?12:13},
    warning:{background:"#d97706",color:"#fff",padding:small?"5px 12px":"8px 18px",fontSize:small?12:13},
  };
  return <button style={{...base,...v[variant]}} {...props}>{children}</button>;
}

function Modal({ title, onClose, children, wide=false }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:2000,overflowY:"auto",padding:"32px 16px"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:wide?760:520,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#1e3a5f,#2d5986)",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{color:"#fff",fontWeight:600,fontSize:15}}>{title}</span>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:13}}>✕</button>
        </div>
        <div style={{padding:20}}>{children}</div>
      </div>
    </div>
  );
}

// RelModal: exibe HTML gerado e permite imprimir via Blob URL
function RelModal({ html, onClose }) {
  function imprimir() {
    // html já é documento completo (começa com <!DOCTYPE) ou fragmento
    const isDoc = html.trim().startsWith("<!DOCTYPE") || html.trim().startsWith("<html");
    const conteudo = isDoc ? html : `<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>Relatório SiRH77</title>
      <style>
        @page{size:A4;margin:25mm 30mm 25mm 30mm;}
        body{font-family:Arial,sans-serif;font-size:12px;margin:0;padding:16px;}
        @media print{body{margin:0;padding:0;}}
        table{width:100%;border-collapse:collapse;font-size:11px;}
        th{background:#f0f4ff;padding:5px 8px;border:1px solid #ccc;}
        td{padding:4px 8px;border:1px solid #ddd;}
        tr:nth-child(even) td{background:#f9f9f9;}
      </style></head><body>${html}</body></html>`;
    const blob = new Blob([conteudo], {type:"text/html;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (w) {
      w.addEventListener("load", () => {
        setTimeout(() => { w.print(); URL.revokeObjectURL(url); }, 400);
      });
    }
  }
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:3000,overflowY:"auto",padding:"20px 12px"}}>
      <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:820,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#1e3a5f,#2d5986)",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{color:"#fff",fontWeight:700,fontSize:15}}>📄 Relatório</span>
          <div style={{display:"flex",gap:8}}>
            <button onClick={imprimir} style={{background:"#d4af37",border:"none",color:"#1e3a5f",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>🖨️ Imprimir</button>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12}}>✕ Fechar</button>
          </div>
        </div>
        <div style={{maxHeight:"80vh",overflowY:"auto",padding:16}} dangerouslySetInnerHTML={{__html:html}}/>
      </div>
    </div>
  );
}

function Confirm({ msg, onYes, onNo }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3000}}>
      <div style={{background:"#fff",borderRadius:10,padding:24,maxWidth:360,width:"90%"}}>
        <p style={{fontSize:14,color:"#374151",marginBottom:20}}>{msg}</p>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn variant="secondary" onClick={onNo}>Cancelar</Btn>
          <Btn variant="danger" onClick={onYes}>Confirmar</Btn>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// LOGIN
// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// BUSCA DE POLICIAL (reutilizável)
// ──────────────────────────────────────────────
function BuscaPolicial({ officers, excluirIds=[], onSelect }) {
  const [q, setQ] = useState("");
  const resultados = useMemo(() => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return [...officers]
      .filter(o => !excluirIds.includes(o.id) &&
        ((o.nome||"").toLowerCase().includes(lower) ||
         (o.nomeGuerra||"").toLowerCase().includes(lower) ||
         (cleanMat(o.matricula)).toLowerCase().includes(lower)))
      .sort(rankSort)
      .slice(0, 8);
  }, [q, officers, excluirIds]);

  return (
    <div style={{marginBottom:12}}>
      <input value={q} onChange={e=>setQ(e.target.value)}
        placeholder="🔍 Buscar por nome ou matrícula..."
        style={{width:"100%",padding:"9px 12px",border:"1px solid #d1d5db",borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
      {resultados.length>0 && (
        <div style={{border:"1px solid #e5e7eb",borderRadius:8,marginTop:4,overflow:"hidden",boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}}>
          {resultados.map(o=>(
            <div key={o.id} onClick={()=>{onSelect(o);setQ("");}}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",cursor:"pointer",background:"#fff",borderBottom:"1px solid #f3f4f6"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#f0f4ff";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
              <Avatar name={o.nome} size={30}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500,color:"#111827"}}>{o.nome}</div>
                <div style={{fontSize:11,color:"#6b7280"}}>{o.grau} · Mat. {o.matricula} {o.origem?("· "+o.origem):""}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {q.trim() && resultados.length===0 && (
        <div style={{padding:"10px 12px",fontSize:12,color:"#9ca3af",background:"#f9fafb",borderRadius:8,marginTop:4}}>Nenhum policial encontrado.</div>
      )}
    </div>
  );
}


function LoginScreen({ onLogin }) {
  const [mat, setMat] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [users, , loadingUsers] = useSupabaseState("sirh_users", USUARIOS_INICIAIS);
  const [waited, setWaited] = useState(false);

  // Wait up to 5 seconds for Supabase to load
  useEffect(()=>{
    const t = setTimeout(()=>setWaited(true), 5000);
    return ()=>clearTimeout(t);
  },[]);

  const isReady = !loadingUsers || waited;

  function handleLogin() {
    if (!isReady) { setErr("Aguardando conexão com o servidor..."); return; }
    // Merge Supabase users with fallback
    const supaUsers = Array.isArray(users) && users.length > 0 ? users : [];
    const allUsers = supaUsers;
    if (allUsers.length === 0) { 
      setErr("Sem conexão com o servidor. Tente novamente em instantes."); 
      return; 
    }
    const u = allUsers.find(u => 
      String(u.matricula||"").trim() === String(mat).trim() && 
      String(u.senha||"") === String(pwd) && 
      u.ativo !== false
    );
    if (!u) { setErr("Matrícula ou senha incorreta."); return; }
    onLogin(u);
  }

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1e3a5f 0%,#2d5986 60%,#3b82f6 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"#fff",borderRadius:16,padding:"40px 36px",width:360,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:64,height:64,background:"#1e3a5f",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:22,fontWeight:700,color:"#fbbf24"}}>77</div>
          <div style={{fontSize:22,fontWeight:700,color:"#1e3a5f"}}>SiRH77</div>
          <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>77ª Cia Independente · PMBA</div>
        </div>
        <Input label="Matrícula" value={mat} onChange={e=>setMat(e.target.value)} placeholder="Digite sua matrícula" onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        <Input label="Senha" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Digite sua senha" onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        {err && <div style={{color:"#dc2626",fontSize:12,marginBottom:10}}>{err}</div>}
        {!isReady && <div style={{textAlign:"center",fontSize:12,color:"#6b7280",marginBottom:8}}>⏳ Conectando...</div>}
        <Btn onClick={handleLogin} style={{width:"100%",padding:"10px",fontSize:14,opacity:!isReady?0.7:1}}>
          {!isReady ? "Aguardando..." : "Entrar"}
        </Btn>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// ALTERAR SENHA (primeiro acesso)
// ──────────────────────────────────────────────
function TrocarSenha({ user, onDone, users, setUsers }) {
  const [nova, setNova] = useState("");
  const [conf, setConf] = useState("");
  const [err, setErr] = useState("");

  function salvar() {
    if (nova.length < 6) { setErr("Mínimo 6 caracteres."); return; }
    if (nova !== conf) { setErr("Senhas não conferem."); return; }
    setUsers(us => us.map(u => u.id===user.id ? {...u, senha:nova, primeiroAcesso:false} : u));
    onDone({...user, senha:nova, primeiroAcesso:false});
  }

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1e3a5f,#2d5986)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"#fff",borderRadius:16,padding:"36px",width:360}}>
        <h2 style={{fontSize:18,fontWeight:700,color:"#1e3a5f",marginBottom:6}}>Trocar senha</h2>
        <p style={{fontSize:13,color:"#6b7280",marginBottom:20}}>Este é seu primeiro acesso. Defina uma senha pessoal.</p>
        <Input label="Nova senha" type="password" value={nova} onChange={e=>setNova(e.target.value)} />
        <Input label="Confirmar senha" type="password" value={conf} onChange={e=>setConf(e.target.value)} />
        {err && <div style={{color:"#dc2626",fontSize:12,marginBottom:10}}>{err}</div>}
        <Btn onClick={salvar} style={{width:"100%",padding:"10px"}}>Salvar senha</Btn>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// PERMISSÕES
// ──────────────────────────────────────────────
const PERMS = {
  Admin:    {efetivo:true, sso:true, corregedoria:true, documentos:true, admin:true, editarTudo:true},
  admin:    {efetivo:true, sso:true, corregedoria:true, documentos:true, admin:true, editarTudo:true},
  SSO:      {efetivo:true, sso:true, material:false, corregedoria:false, documentos:true, admin:false, editarTudo:false},
  SPO:      {efetivo:true, sso:true, material:false, corregedoria:false, documentos:true, admin:false, editarTudo:false},
  ALMOX:    {efetivo:true, sso:false, material:true, corregedoria:false, documentos:true, admin:false, editarTudo:false},
  Corregedoria:{efetivo:true, sso:false, material:false, corregedoria:true, documentos:true, admin:false, editarTudo:false},
};

// ──────────────────────────────────────────────
// PAINEL / DASHBOARD
// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// ALERTA BANNER (reutilizável, com ciência)
// ──────────────────────────────────────────────
function AlertaBanner({ cor, borda, icone, titulo, linhas, chaveStorage, loggedUser }) {
  const [aberto, setAberto] = useState(false);
  // Key: per-login so it reappears on next login, but not on same session
  const storageKey = chaveStorage
    ? chaveStorage + "_login_" + (loggedUser?.matricula||"anon") + "_" + new Date().toISOString().slice(0,10)
    : null;
  const [ciente, setCiente] = useState(()=>{
    if (!storageKey) return false;
    try { return sessionStorage.getItem(storageKey)==="1"; } catch { return false; }
  });

  if (ciente) return null;

  function marcarCiente() {
    if (storageKey) {
      try { sessionStorage.setItem(storageKey,"1"); } catch {}
    }
    setCiente(true);
  }

  return (
    <div style={{background:cor,border:`1px solid ${borda}`,borderRadius:9,padding:"10px 14px",marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
          <span style={{fontSize:16}}>{icone}</span>
          <span style={{fontSize:13,fontWeight:600,color:"#1c1917"}}>{titulo}</span>
        </div>
        <div style={{display:"flex",gap:6,flexShrink:0}}>
          <button onClick={()=>setAberto(v=>!v)}
            style={{background:"rgba(0,0,0,0.07)",border:"none",borderRadius:6,padding:"3px 10px",fontSize:11,cursor:"pointer",color:"#374151"}}>
            {aberto?"▲ Ocultar":"▼ Ver nomes"}
          </button>
          <button onClick={marcarCiente}
            style={{background:"#15803d",border:"none",borderRadius:6,padding:"3px 10px",fontSize:11,cursor:"pointer",color:"#fff",fontWeight:600}}>
            ✓ Ciente
          </button>
        </div>
      </div>
      {aberto && (
        <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${borda}`}}>
          {linhas.map((l,i)=>(
            <div key={i} style={{fontSize:12,color:"#374151",padding:"3px 0",borderBottom:i<linhas.length-1?"1px solid rgba(0,0,0,0.05)":"none"}}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function Dashboard({ officers, ferias: feriasList, afastamentos, onFilter, onGoSaude, onGoEfetivo, loggedUser, locations }) {
  const mesAtual = new Date().getMonth()+1;
  const mesNome = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"][mesAtual-1];
  const aniversariantes = (officers||[]).filter(o=>{
    if (!o.dataNasc) return false;
    const m = parseInt((o.dataNasc||"").split("-")[1]);
    return m===mesAtual;
  }).sort((a,b)=>{
    const da=parseInt((a.dataNasc||"").split("-")[2]);
    const db=parseInt((b.dataNasc||"").split("-")[2]);
    return da-db;
  });
  // Só conta efetivo ativo (não transferido/reserva)
  const ativos = officers.filter(o=>o.situacao!=="Transferido"&&o.situacao!=="Reserva/Inativo");
  const total = ativos.length;

  const byGrau = {};
  ativos.forEach(o => { const g = o.grau||"Outros"; byGrau[g]=(byGrau[g]||0)+1; });
  const grauSorted = Object.entries(byGrau).sort((a,b)=>(RANK_ORDER.indexOf(a[0])||99)-(RANK_ORDER.indexOf(b[0])||99));

  const bySit = {};
  ativos.forEach(o => { bySit[o.situacao||"Ativo"]=(bySit[o.situacao||"Ativo"]||0)+1; });

  // Locais — todos, ordem alfabética
  const byLoc = {};
  ativos.forEach(o => { const l=o.localTrabalho||"—"; byLoc[l]=(byLoc[l]||0)+1; });
  const allLocs = Object.entries(byLoc).sort((a,b)=>a[0].localeCompare(b[0]));

  const masc = ativos.filter(o=>o.sexo==="MASC").length;
  const fem = ativos.filter(o=>o.sexo==="FEM").length;

  // Férias: conta quem está em gozo de férias HOJE baseado nas datas reais
  const hoje = new Date();
  const todayStr = hoje.toISOString().slice(0,10);
  const mesAtualDash = hoje.getMonth()+1;
  const anoAtual = hoje.getFullYear();

  // Férias: participantes com datas que incluem hoje E tipo FÉRIAS
  // Férias: quem está no plano do MÊS ATUAL
  const feriasPoliciais = (() => {
    const ids = new Set();
    (feriasList||[])
      .filter(f=>f.tipo==="planejamento"&&!f.concluido&&f.mes===mesAtualDash&&f.ano===anoAtual)
      .forEach(plan=>{
        (plan.participantes||[])
          .filter(p=>
            p.tipo==="FÉRIAS" &&
            p.status==="em_andamento" &&  // SOMENTE em andamento
            p.policialId
          )
          .forEach(p=>ids.add(p.policialId));
      });
    return [...ids].map(id=>officers.find(o=>o.id===id)).filter(Boolean);
  })();

  // Licença-Prêmio: quem está no plano do MÊS ATUAL
  const licPremioPoliciais = (() => {
    const ids = new Set();
    (feriasList||[])
      .filter(f=>f.tipo==="planejamento"&&!f.concluido&&f.mes===mesAtualDash&&f.ano===anoAtual)
      .forEach(plan=>{
        (plan.participantes||[])
          .filter(p=>
            p.tipo==="LICENÇA-PRÊMIO" &&
            p.status==="em_andamento" &&  // SOMENTE em andamento
            p.policialId
          )
          .forEach(p=>ids.add(p.policialId));
      });
    // Also from localTrabalho
    ativos.filter(o=>{
      const loc=(o.localTrabalho||"").toUpperCase();
      return loc.includes("LICENÇA-PRÊMIO")||loc.includes("LICENÇA PRÊMIO")||loc.includes("LICENÇA PREMIO");
    }).forEach(o=>ids.add(o.id));
    return [...ids].map(id=>officers.find(o=>o.id===id)).filter(Boolean);
  })();

  // JMS: somente INAPTOS PARA O SERVIÇO PM (do módulo saúde)
  const jmsPoliciais = (() => {
    const ids = new Set();
    (afastamentos||[]).filter(a=>
      a.tipo==="Junta Médica" && !a.concluido &&
      a.parecer==="INAPTO PARA O SERVIÇO PM"
    ).forEach(a=>ids.add(a.policialId));
    return [...ids].map(id=>officers.find(o=>o.id===id)).filter(Boolean);
  })();

  // Apresentados CPR/SO: local de trabalho
  const aprCPRPoliciais = ativos.filter(o=>{
    const loc = (o.localTrabalho||"").toUpperCase();
    return loc.includes("CPR/SO")||loc.includes("CPRSO")||loc.includes("CPR-SO")||o.situacao==="Apresentado CPR/SO";
  });

  // Licença Int. Particular: local de trabalho OU campo específico licIntParticular
  const licPartPoliciais = ativos.filter(o=>{
    const loc = (o.localTrabalho||"").toUpperCase();
    return o.situacao==="Lic. Int. Particular"
      || o.licIntParticular?.ativo
      || loc.includes("LIC. P/ TRATAR")
      || loc.includes("INT. PARTICULAR")
      || loc.includes("LICENÇA PARA TRATAR")
      || loc.includes("LIC.INT.PART")
      || loc.includes("LIC INT PART");
  });

  // Restrições: JMS com parecer APTO PARA O SERVIÇO ADM
  const restricoesPoliciais = (() => {
    const map = {};
    (afastamentos||[]).filter(a=>
      a.tipo==="Junta Médica" && !a.concluido &&
      (a.parecer==="APTO PARA O SERVIÇO ADM") &&
      a.restricao
    ).forEach(a=>{
      const o = officers.find(x=>x.id===a.policialId);
      if (o) map[o.id] = {officer:o, restricao:a.restricao, parecer:a.parecer};
    });
    return Object.values(map);
  })();

  // Afastados: em gozo de luto, núpcias, maternidade, paternidade, ou atestado vigente hoje
  const afastadosPoliciais = (() => {
    const ids = new Set();
    const tiposAfast = ["Luto","Núpcias","Licença Maternidade","Licença Paternidade","Atestado"];
    (afastamentos||[]).filter(a=>
      tiposAfast.includes(a.tipo) && !a.concluido &&
      a.dataInicio && a.dataInicio<=todayStr &&
      (!a.dataFim || a.dataFim>=todayStr)
    ).forEach(a=>ids.add(a.policialId));
    return [...ids].map(id=>officers.find(o=>o.id===id)).filter(Boolean);
  })();

  const sede = ativos.filter(o=>(o.origem||"SEDE")==="SEDE").length;
  const bcs = ativos.filter(o=>o.origem==="BCS").length;
  const emFerias = feriasPoliciais.length;
  const jms = jmsPoliciais.length;
  const licPremio = licPremioPoliciais.length;
  const licPart = licPartPoliciais.length;
  const aprCPR = aprCPRPoliciais.length;
  const afastados = afastadosPoliciais.length;
  const restricoes = restricoesPoliciais.length;

  const statCards = [
    {label:"Efetivo total",       value:total,                   color:"#1e3a5f", bg:"#dbeafe", filter:{type:"all"}},
    {label:"SEDE",                value:sede,                    color:"#1d4ed8", bg:"#eff6ff", filter:{type:"origem",value:"SEDE"}},
    {label:"BCS",                 value:bcs,                     color:"#92400e", bg:"#fef3c7", filter:{type:"origem",value:"BCS"}},
    {label:"Ativos",              value:(bySit["Ativo"]||0),     color:"#15803d", bg:"#dcfce7", filter:{type:"sit",value:"Ativo"}},
    {label:"Férias",              value:emFerias,                color:"#1d4ed8", bg:"#dbeafe", filter:{type:"ids",ids:feriasPoliciais.map(o=>o.id)}},
    {label:"JMS (Inaptos)",       value:jms,                     color:"#991b1b", bg:"#fee2e2", filter:{type:"ids",ids:jmsPoliciais.map(o=>o.id)}},
    {label:"Restrições ADM",      value:restricoes,              color:"#92400e", bg:"#fff7ed", filter:{type:"restricoes",dados:restricoesPoliciais}},
    {label:"Lic. Int. Particular",value:licPart,                 color:"#7e3af2", bg:"#ede9fe", filter:{type:"ids",ids:licPartPoliciais.map(o=>o.id)}},
    {label:"Licença Prêmio",      value:licPremio,               color:"#065f46", bg:"#d1fae5", filter:{type:"ids",ids:licPremioPoliciais.map(o=>o.id)}},
    {label:"Apres. CPR/SO",       value:aprCPR,                  color:"#92400e", bg:"#fef3c7", filter:{type:"ids",ids:aprCPRPoliciais.map(o=>o.id)}},
    {label:"Afastados",           value:afastados,               color:"#dc2626", bg:"#fee2e2", filter:{type:"ids",ids:afastadosPoliciais.map(o=>o.id)}},
    {label:"Masculino",           value:masc,                    color:"#1e3a5f", bg:"#f0f4ff", filter:{type:"sexo",value:"MASC"}},
    {label:"Feminino",            value:fem,                     color:"#7e3af2", bg:"#ede9fe", filter:{type:"sexo",value:"FEM"}},
  ];

  // Locais cadastrados no módulo (vinculados ao cadastro oficial)
  // Locais cadastrados no módulo — excluir SEDE e BCS que já estão nos cards
  const EXCLUIR_DOS_LOCAIS = ["SEDE","BCS"];
  const locationCards = (locations||[])
    .filter(loc=>!EXCLUIR_DOS_LOCAIS.some(e=>loc.toUpperCase()===e.toUpperCase()))
    .map(loc => {
      const pols = ativos.filter(o=>(o.localTrabalho||"")=== loc);
      return { label:loc, value:pols.length, ids:pols.map(o=>o.id) };
    });

  // ─── Lic. Int. Particular - alerta 30 dias antes do fim ────────────────────
  const licPartAlert = (() => {
    const hoje30 = new Date(); hoje30.setDate(hoje30.getDate()+30);
    const hj = new Date().toISOString().slice(0,10);
    const h30 = hoje30.toISOString().slice(0,10);
    return ativos.filter(o => {
      const df = o.licIntParticular?.dataFim;
      return df && df >= hj && df <= h30;
    });
  })();

  // ─── Alertas calculados ──────────────────────────────────────────
  const hoje2 = new Date();

  // JMS: próxima inspeção em 15 dias (afastamentos de Junta Médica com dataFim próxima)
  const jmsProx = (afastamentos||[]).filter(a=>{
    if (a.tipo!=="Junta Médica" || a.concluido) return false;
    if (!a.dataFim) return false;
    const fim = new Date(a.dataFim+"T12:00:00");
    const diff = (fim-hoje2)/(24*3600*1000);
    return diff>=0 && diff<=15;
  });

  // CNH vencendo em 60 dias
  const d60 = new Date(hoje2); d60.setDate(d60.getDate()+60);
  const cnhVenc = officers.filter(o=>{
    if (!o.validCnh||SITUACOES_INATIVO.includes(o.situacao)) return false;
    const v = new Date(o.validCnh+"T12:00:00");
    return v<=d60;
  }).sort((a,b)=>a.validCnh.localeCompare(b.validCnh));

  // Afastamento acumulado >15 dias em 60 dias (SOMENTE ATESTADO, excluindo quem já está na JMS)
  const jmsIds = new Set((afastamentos||[]).filter(a=>a.tipo==="Junta Médica"&&!a.concluido).map(a=>a.policialId));
  const afastLongo = (() => {
    const limite60 = new Date(hoje2); limite60.setDate(limite60.getDate()-60);
    const byPolicial = {};
    (afastamentos||[]).filter(a=>a.tipo==="Atestado"&&!a.concluido).forEach(a=>{
      if (!a.dataInicio) return;
      if (jmsIds.has(a.policialId)) return; // já está na JMS, não precisa alertar
      const ini = new Date(a.dataInicio+"T12:00:00");
      if (ini < limite60) return;
      const fim = a.dataFim ? new Date(a.dataFim+"T12:00:00") : hoje2;
      const dias = Math.max(0, Math.ceil((fim-ini)/(24*3600*1000)));
      byPolicial[a.policialId] = (byPolicial[a.policialId]||0) + dias;
    });
    return Object.entries(byPolicial)
      .filter(([,dias])=>dias>15)
      .map(([id,dias])=>({officer: officers.find(o=>o.id===Number(id)), dias}))
      .filter(x=>x.officer);
  })();

  // Atestado >30 dias → verificar carga fixa
  const atestLongo = (afastamentos||[]).filter(a=>{
    if (a.tipo!=="Atestado"||a.concluido||!a.dataInicio) return false;
    const ini = new Date(a.dataInicio+"T12:00:00");
    const fim = a.dataFim ? new Date(a.dataFim+"T12:00:00") : hoje2;
    return Math.ceil((fim-ini)/(24*3600*1000))>30;
  }).map(a=>({a, officer:officers.find(o=>o.id===a.policialId)})).filter(x=>x.officer);

  return (
    <div>
      {/* ─── Alertas ─── */}
      {jmsProx.length>0 && (
        <AlertaBanner cor="#fee2e2" borda="#fca5a5" icone="🏥" titulo={`Inspeção de JMS em até 15 dias (${jmsProx.length})`}
          linhas={jmsProx.map(a=>{const o=officers.find(x=>x.id===a.policialId);return o?`${o.grau} ${o.nome} — vence ${fmtDate(a.dataFim)}`:"?";})}
          chaveStorage="jms_ciente" loggedUser={loggedUser}
        />
      )}
      {cnhVenc.length>0 && (
        <AlertaBanner cor="#fef3c7" borda="#fcd34d" icone="🚗" titulo={`CNH vencendo: ${cnhVenc.length} policial(is)`}
          linhas={cnhVenc.map(o=>{const diff=Math.ceil((new Date(o.validCnh+"T12:00:00")-hoje2)/(24*3600*1000));return `${o.grau} ${o.nome} — ${diff<=0?"VENCIDA":"vence em "+diff+" dias"} (${fmtDate(o.validCnh)})`;}) }
          chaveStorage="cnh_venc" loggedUser={loggedUser}
        />
      )}
      {afastLongo.length>0 && (
        <AlertaBanner cor="#fff7ed" borda="#fed7aa" icone="⚠️" titulo={`Afastamento >15 dias nos últimos 60 dias (${afastLongo.length}) — enviar ao Departamento de Saúde`}
          linhas={afastLongo.map(x=>`${x.officer.grau} ${x.officer.nome} — ${x.dias} dias acumulados`)}
          chaveStorage="afast_longo" loggedUser={loggedUser}
        />
      )}
      {atestLongo.length>0 && (
        <AlertaBanner cor="#ede9fe" borda="#c4b5fd" icone="📋" titulo={`Atestado acima de 30 dias (${atestLongo.length}) — verificar carga fixa`}
          linhas={atestLongo.map(x=>{const dias=Math.ceil((x.a.dataFim?new Date(x.a.dataFim+"T12:00:00"):hoje2-new Date(x.a.dataInicio+"T12:00:00"))/(24*3600*1000));return `${x.officer.grau} ${x.officer.nome} — ${dias} dias`;}) }
          chaveStorage="atest_longo" loggedUser={loggedUser}
        />
      )}

      {/* Alerta Lic. Int. Particular vencendo em 30 dias */}
      {licPartAlert.length>0 && (
        <AlertaBanner cor="#fef3c7" borda="#fcd34d" icone="📋"
          titulo={`${licPartAlert.length} policial(is) com Lic. Int. Particular vencendo em até 30 dias`}
          linhas={licPartAlert.map(o=>{
            const df=o.licIntParticular?.dataFim;
            const diff=Math.ceil((new Date(df+"T12:00:00")-new Date())/(24*3600*1000));
            return `${o.grau} ${o.nome} — vence em ${diff} dia(s) (${fmtDate(df)})`;
          })}
          chaveStorage="lic_part_venc" loggedUser={loggedUser}/>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:20}}>
        {statCards.map(s=>(
          <div key={s.label} onClick={()=>onFilter&&onFilter(s.filter)}
            style={{background:s.bg||"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 14px",cursor:onFilter?"pointer":"default",transition:"transform 0.1s,box-shadow 0.1s"}}
            onMouseEnter={e=>{if(onFilter){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.1)";}}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
            <div style={{fontSize:10,color:"#6b7280",marginBottom:4,fontWeight:500}}>{s.label}</div>
            <div style={{fontSize:24,fontWeight:700,color:s.color}}>{s.value}</div>
            {onFilter&&<div style={{fontSize:9,color:"#9ca3af",marginTop:2}}>clique para ver →</div>}
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card>
          <div style={{fontWeight:600,fontSize:14,marginBottom:12,color:"#374151"}}>Grau Hierárquico</div>
          <div style={{display:"flex",gap:4,marginBottom:6,fontSize:10,color:"#9ca3af",fontWeight:600}}>
            <span style={{minWidth:110}}>GRAU</span><span style={{flex:1}}></span>
            <span style={{minWidth:28,textAlign:"right"}}>TOT</span>
            <span style={{minWidth:24,textAlign:"right",color:"#3b82f6"}}>M</span>
            <span style={{minWidth:24,textAlign:"right",color:"#ec4899"}}>F</span>
          </div>
          {grauSorted.map(([g,c])=>{
            const masc=ativos.filter(o=>o.grau===g&&(o.sexo||"MASC")==="MASC").length;
            const fem=ativos.filter(o=>o.grau===g&&o.sexo==="FEM").length;
            return (
            <div key={g} style={{display:"flex",alignItems:"center",gap:4,marginBottom:5}}>
              <span style={{fontSize:11,color:"#6b7280",minWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g}</span>
              <div style={{flex:1,background:"#f3f4f6",borderRadius:4,height:10,overflow:"hidden"}}>
                <div style={{width:`${Math.round((c/total)*100)}%`,height:"100%",background:"#1e3a5f",borderRadius:4,minWidth:4}}/>
              </div>
              <span style={{fontSize:12,fontWeight:700,color:"#111827",minWidth:28,textAlign:"right"}}>{c}</span>
              <span style={{fontSize:11,fontWeight:500,color:"#3b82f6",minWidth:24,textAlign:"right"}}>{masc}</span>
              <span style={{fontSize:11,fontWeight:500,color:"#ec4899",minWidth:24,textAlign:"right"}}>{fem}</span>
            </div>
            );
          })}
        </Card>

        <Card style={{maxHeight:340,overflowY:"auto"}}>
          <div style={{fontWeight:600,fontSize:14,marginBottom:12,color:"#374151"}}>Locais de trabalho</div>
          {locationCards.length===0 && <p style={{color:"#9ca3af",fontSize:12}}>Nenhum local cadastrado.</p>}
          <div style={{display:"flex",gap:4,marginBottom:6,fontSize:10,color:"#9ca3af",fontWeight:600}}>
            <span style={{flex:1}}>LOCAL</span>
            <span style={{minWidth:28,textAlign:"right"}}>TOT</span>
            <span style={{minWidth:22,textAlign:"right",color:"#3b82f6"}}>M</span>
            <span style={{minWidth:22,textAlign:"right",color:"#ec4899"}}>F</span>
          </div>
          {locationCards.map(c=>{
            const masc = c.ids.filter(id=>{const o=officers.find(x=>x.id===id);return o&&(o.sexo||"MASC")==="MASC";}).length;
            const fem  = c.ids.filter(id=>{const o=officers.find(x=>x.id===id);return o&&o.sexo==="FEM";}).length;
            return (
              <div key={c.label} onClick={()=>onFilter({type:"ids",ids:c.ids})}
                style={{display:"flex",alignItems:"center",gap:4,marginBottom:5,cursor:"pointer",padding:"3px 6px",borderRadius:6,transition:"background 0.1s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#f0f4ff"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{fontSize:11,color:"#374151",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>{c.label}</span>
                <span style={{fontSize:12,fontWeight:700,color:"#111827",minWidth:28,textAlign:"right"}}>{c.value}</span>
                <span style={{fontSize:11,fontWeight:500,color:"#3b82f6",minWidth:22,textAlign:"right"}}>{masc}</span>
                <span style={{fontSize:11,fontWeight:500,color:"#ec4899",minWidth:22,textAlign:"right"}}>{fem}</span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Aniversariantes do mês */}
      {aniversariantes.length>0 && (
        <Card style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontWeight:600,fontSize:14,color:"#374151"}}>🎂 Aniversariantes — {mesNome}</div>
            <Badge color="#fce7f3" textColor="#9d174d">{aniversariantes.length}</Badge>
          </div>
          <details>
            <summary style={{fontSize:12,color:"#6b7280",cursor:"pointer"}}>Ver os {aniversariantes.length} aniversariante(s)</summary>
            <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:3}}>
              {aniversariantes.map(o=>{
                const dia=parseInt((o.dataNasc||"").split("-")[2]);
                const hoje=new Date().getDate();
                const isHoje=dia===hoje;
                return (
                  <div key={o.id} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 6px",borderRadius:6,background:isHoje?"#fce7f3":"transparent"}}>
                    <span style={{fontSize:12,fontWeight:600,color:"#9d174d",minWidth:22,textAlign:"right"}}>{String(dia).padStart(2,"0")}</span>
                    <span style={{fontSize:12,color:"#374151",flex:1}}>{o.grau} {o.nome.toUpperCase()}</span>
                    {isHoje&&<span style={{fontSize:11}}>🎉</span>}
                  </div>
                );
              })}
            </div>
          </details>
        </Card>
      )}

      <Card>
        <div style={{fontWeight:600,fontSize:14,marginBottom:12}}>Situação do efetivo</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {Object.entries(bySit).map(([sit,c])=>(
            <div key={sit} style={{display:"flex",alignItems:"center",gap:6}}>
              <SitBadge sit={sit}/><span style={{fontSize:12,color:"#374151",fontWeight:500}}>{c}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ──────────────────────────────────────────────
// FORMULÁRIO POLICIAL
// ──────────────────────────────────────────────
function FormPolicial({ initial={}, onSave, onCancel, locations }) {
  const [form, setForm] = useState({
    grau:"", nome:"", nomeGuerra:"", matricula:"", localTrabalho:"",
    origem:"SEDE", dataNasc:"", cpf:"", rg:"", admissao:"", planoSaude:"", grauInstrucao:"",
    nomePai:"", nomeMae:"", filhos:"",
    pai:"", mae:"", filhos:"", penultimaUnidade:"", titulo:"", cargo:"",
    ddd:"77", telefone:"", tipoSang:"", email:"", endereco:"",
    sexo:"MASC", situacao:"Ativo", observacao:"", pelotao:"", cargo:"",
    cnh:"", categoriaCnh:"", validCnh:"", pisPasep:"", estadoCivil:"",
    naturalidade:"",...initial
  });

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Select label="Grau hierárquico" value={form.grau} onChange={e=>set("grau",e.target.value)}>
          <option value="">Selecionar...</option>
          {RANK_ORDER.map(r=><option key={r} value={r}>{r}</option>)}
        </Select>
        <Select label="Sexo" value={form.sexo} onChange={e=>set("sexo",e.target.value)}>
          <option value="MASC">Masculino</option>
          <option value="FEM">Feminino</option>
        </Select>
        <div style={{marginBottom:12}}>
          <label style={{display:"block",fontSize:12,color:"#374151",fontWeight:500,marginBottom:6}}>Unidade (BCS / SEDE)</label>
          <div style={{display:"flex",gap:16}}>
            {["SEDE","BCS"].map(op=>(
              <label key={op} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:13,color:"#374151"}}>
                <input type="radio" name="origem" value={op} checked={(form.origem||"SEDE")===op} onChange={e=>set("origem",e.target.value)}
                  style={{accentColor:"#1e3a5f"}}/>
                {op}
              </label>
            ))}
          </div>
        </div>
      </div>
      <Input label="Nome completo *" value={form.nome} onChange={e=>set("nome",e.target.value)} />
      <Input label="Nome de guerra" value={form.nomeGuerra||""} onChange={e=>set("nomeGuerra",e.target.value)} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Input label="Matrícula *" value={form.matricula} onChange={e=>set("matricula",e.target.value)} />
        <Input label="CPF" value={form.cpf||""} onChange={e=>set("cpf",e.target.value)} placeholder="000.000.000-00"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Input label="RG" value={form.rg||""} onChange={e=>set("rg",e.target.value)} />
        <Input label="Data de nascimento" type="date" value={form.dataNasc||""} onChange={e=>set("dataNasc",e.target.value)} />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Input label="Data de admissão" type="date" value={form.admissao||""} onChange={e=>set("admissao",e.target.value)} />
        <Select label="Situação" value={form.situacao} onChange={e=>set("situacao",e.target.value)}>
          {SITUACOES.map(s=><option key={s} value={s}>{s}</option>)}
        </Select>
      </div>
      <Select label="Local de trabalho" value={form.localTrabalho||""} onChange={e=>set("localTrabalho",e.target.value)}>
        <option value="">Selecionar...</option>
        {locations.map(l=><option key={l} value={l}>{l}</option>)}
      </Select>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Input label="Pelotão" value={form.pelotao||""} onChange={e=>set("pelotao",e.target.value)} />
        <Input label="Cargo/função" value={form.cargo||""} onChange={e=>set("cargo",e.target.value)} />
      </div>
      <div style={{border:"1px solid #e5e7eb",borderRadius:8,padding:"10px 12px",marginBottom:4}}>
        <div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:8}}>Lic. para Tratar Interesse Particular</div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <input type="checkbox" id="licip_chk" checked={!!(form.licIntParticular?.ativo)} onChange={e=>set("licIntParticular",{...(form.licIntParticular||{}),ativo:e.target.checked})}/>
          <label htmlFor="licip_chk" style={{fontSize:12,cursor:"pointer"}}>Em gozo de Lic. Int. Particular</label>
        </div>
        {form.licIntParticular?.ativo && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Data início" type="date" value={form.licIntParticular?.dataInicio||""} onChange={e=>set("licIntParticular",{...(form.licIntParticular||{}),dataInicio:e.target.value})}/>
            <Input label="Data fim (retorno previsto)" type="date" value={form.licIntParticular?.dataFim||""} onChange={e=>set("licIntParticular",{...(form.licIntParticular||{}),dataFim:e.target.value})}/>
            <Input label="BGO" value={form.licIntParticular?.bgo||""} onChange={e=>set("licIntParticular",{...(form.licIntParticular||{}),bgo:e.target.value})} placeholder="BGO Nº 001 DE 2026"/>
          </div>
        )}
      </div>
      <div style={{borderTop:"1px solid #e5e7eb",margin:"12px 0",paddingTop:12}}>
        <div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:10}}>Dados complementares</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Select label="Estado civil" value={form.estadoCivil||""} onChange={e=>set("estadoCivil",e.target.value)}>
            <option value="">-</option>
            {["Solteiro(a)","Casado(a)","Divorciado(a)","Viúvo(a)","União estável"].map(s=><option key={s} value={s}>{s}</option>)}
          </Select>
          <Input label="Naturalidade" value={form.naturalidade||""} onChange={e=>set("naturalidade",e.target.value)} />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="Tipo sanguíneo" value={form.tipoSang||""} onChange={e=>set("tipoSang",e.target.value)} placeholder="A+, B-, O+..." />
          <Input label="Plano de saúde" value={form.planoSaude||""} onChange={e=>set("planoSaude",e.target.value)} />
        </div>
        <Select label="Grau de instrução" value={form.grauInstrucao||""} onChange={e=>set("grauInstrucao",e.target.value)}>
          <option value="">-</option>
          {["Ensino Fundamental","Ensino Médio Completo","Ensino Superior Incompleto","Ensino Superior Completo","Pós-Graduação","Mestrado","Doutorado"].map(s=><option key={s} value={s}>{s}</option>)}
        </Select>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="CNH (número)" value={form.cnh||""} onChange={e=>set("cnh",e.target.value)} />
          <Input label="Categoria CNH" value={form.categoriaCnh||""} onChange={e=>set("categoriaCnh",e.target.value)} placeholder="AB, B, C..." />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="Validade CNH" type="date" value={form.validCnh||""} onChange={e=>set("validCnh",e.target.value)} />
          <Input label="PIS/PASEP" value={form.pisPasep||""} onChange={e=>set("pisPasep",e.target.value)} />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"80px 1fr",gap:12}}>
          <Input label="DDD" value={form.ddd||""} onChange={e=>set("ddd",e.target.value)} />
          <Input label="Celular" value={form.telefone||""} onChange={e=>set("telefone",e.target.value)} />
        </div>
        <Textarea label="Endereço" value={form.endereco||""} onChange={e=>set("endereco",e.target.value)} rows={2} />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="Nome do pai" value={form.nomePai||""} onChange={e=>set("nomePai",e.target.value)}/>
          <Input label="Nome da mãe" value={form.nomeMae||""} onChange={e=>set("nomeMae",e.target.value)}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Select label="Tem filhos" value={form.filhos||""} onChange={e=>set("filhos",e.target.value)}>
            <option value="">-</option>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </Select>
          <Input label="E-mail" type="email" value={form.email||""} onChange={e=>set("email",e.target.value)} />
        </div>
        <Textarea label="Observação" value={form.observacao||""} onChange={e=>set("observacao",e.target.value)} rows={2} />
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16,borderTop:"1px solid #e5e7eb",paddingTop:12}}>
        <Btn variant="secondary" onClick={onCancel}>Cancelar</Btn>
        <Btn onClick={()=>onSave(form)}>Salvar</Btn>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// DETALHE DO POLICIAL
// ──────────────────────────────────────────────
function PolicialDetail({ officer, onClose, onEdit, perm, ferias, afastamentos, corregedoria, cursos, vantagens, promocoes, setPromocoes, onOpenPlan }) {
  const [tab, setTab] = useState("pessoal");
  const [relHtml, setRelHtml] = useState("");
  const [modalProm, setModalProm] = useState(null); // {data, posto, bgo}
  const tabs = [
    {id:"pessoal",label:"Dados Pessoais"},
    {id:"funcional",label:"Funcional"},
    {id:"saude",label:"Saúde"},
    {id:"ferias",label:"Férias"},
    {id:"cursos",label:"Cursos"},
        {id:"corregedoria",label:"Corregedoria"},

    {id:"vantagens",label:"Vantagens"},
  ];
  const id = officer.id;
  // férias: buscar participante dentro de cada planejamento
  const mFerias = (ferias||[]).filter(f=>f.tipo==="planejamento" && (f.participantes||[]).some(p=>p.policialId===id));
  const mAfast = (afastamentos||[]).filter(a=>a.policialId===id);
  const mCorr = (corregedoria||[]).filter(c=>c.policialId===id);
  // cursos: buscar participante dentro de cada curso
  const mCursos = (cursos||[]).filter(c=>(c.participantes||[]).some(p=>p.policialId===id));
  const idade = calcIdade(officer.dataNasc);
  const ts = calcTS(officer.admissao);

  const Field = ({label,value}) => (
    <div style={{display:"flex",borderBottom:"1px solid #f3f4f6",padding:"8px 0"}}>
      <span style={{fontSize:12,color:"#6b7280",minWidth:160,flexShrink:0}}>{label}</span>
      <span style={{fontSize:13,color:"#111827",flex:1,wordBreak:"break-word"}}>{value||"-"}</span>
    </div>
  );

  function gerarRelatorioGeral() {
    const o = officer;
    const agora = new Date();
    const dataEmissao = agora.toLocaleDateString("pt-BR");
    const horaEmissao = agora.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
    const matLimpa = cleanMat(o.matricula);

    function cab() {
      return `<div style="text-align:center;font-family:Arial,sans-serif;margin-bottom:18px;">
        <div style="font-weight:bold;font-size:12px;line-height:2.0;text-transform:uppercase;">
          POLÍCIA MILITAR DA BAHIA<br/>COMANDO DE POLICIAMENTO DA REGIÃO SUDOESTE<br/>
          77ª COMPANHIA INDEPENDENTE DE POLÍCIA MILITAR<br/>VITÓRIA DA CONQUISTA - ÁREA LESTE
        </div>
        <div style="margin-top:12px;font-size:15px;font-weight:bold;text-transform:uppercase;border-top:2px solid #000;border-bottom:2px solid #000;padding:8px 0;">
          FICHA FUNCIONAL — RELATÓRIO GERAL
        </div>
      </div>`;
    }
    function sec(titulo) {
      return `<div style="background:#1e3a5f;color:#fff;padding:6px 12px;font-weight:bold;font-size:12px;margin:14px 0 8px;font-family:Arial,sans-serif;">${titulo}</div>`;
    }
    function row(label, value) {
      if (!value) return "";
      return `<div style="display:flex;border-bottom:1px solid #f0f0f0;padding:5px 0;font-family:Arial,sans-serif;font-size:12px;">
        <span style="color:#666;min-width:180px;flex-shrink:0;">${label}</span>
        <span style="color:#111;flex:1;">${value}</span>
      </div>`;
    }
    function tbl(cols, rows) {
      if (!rows.length) return `<p style="color:#888;font-style:italic;font-size:11px;margin:4px 0 12px;">Nenhum registro.</p>`;
      const ths = cols.map(c=>`<th style="padding:6px 8px;border:1px solid #1e3a5f;font-size:11px;text-align:left;">${c}</th>`).join("");
      const trs = rows.map((r,i)=>{
        const tds = r.map(v=>`<td style="padding:5px 8px;border:1px solid #ddd;font-size:11px;">${v==null?"":v}</td>`).join("");
        return `<tr style="background:${i%2===0?"#fff":"#f9f9f9"};">${tds}</tr>`;
      }).join("");
      return `<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;margin-bottom:12px;">
        <thead><tr style="background:#1e3a5f;color:#fff;">${ths}</tr></thead>
        <tbody>${trs}</tbody>
      </table>`;
    }

    // --- DADOS PESSOAIS ---
    let html = cab() + sec("1. DADOS PESSOAIS");
    html += row("Nome completo", o.nome);
    html += row("Grau hierárquico", o.grau);
    html += row("Matrícula", matLimpa);
    html += row("Sexo", o.sexo==="MASC"?"Masculino":o.sexo==="FEM"?"Feminino":o.sexo);
    html += row("Data de nascimento", o.dataNasc?new Date(o.dataNasc+"T12:00:00").toLocaleDateString("pt-BR"):"");
    html += row("CPF", o.cpf);
    html += row("RG", o.rg);
    html += row("Tipo sanguíneo", o.tipoSang);
    html += row("Estado civil", o.estadoCivil);
    html += row("Naturalidade", o.naturalidade);
    html += row("Plano de saúde", o.planoSaude);
    html += row("Grau de instrução", o.grauInstrucao);
    html += row("CNH", o.cnh?(o.cnh+(o.categoriaCnh?" Cat."+o.categoriaCnh:"")+(o.validCnh?" val."+new Date(o.validCnh+"T12:00:00").toLocaleDateString("pt-BR"):"")):null);
    html += row("Telefone", o.ddd&&o.telefone?`(${o.ddd}) ${o.telefone}`:o.telefone);
    html += row("E-mail", o.email);
    html += row("Endereço", o.endereco);

    // --- DADOS FUNCIONAIS ---
    html += sec("2. DADOS FUNCIONAIS");
    html += row("Grau hierárquico", o.grau);
    html += row("Unidade", (o.origem||"SEDE"));
    html += row("Local de trabalho", o.localTrabalho);
    html += row("Pelotão", o.pelotao);
    html += row("Cargo/função", o.cargo);
    html += row("Data de admissão", o.admissao?new Date(o.admissao+"T12:00:00").toLocaleDateString("pt-BR"):"");
    html += row("Situação atual", o.situacao||"Ativo");

    // Promoções
    const mProm = [...(promocoes||[]).filter(p=>p.policialId===id)].sort((a,b)=>b.data.localeCompare(a.data));
    html += `<div style="margin-top:8px;font-weight:bold;font-size:11px;color:#1e3a5f;margin-bottom:4px;font-family:Arial,sans-serif;">Promoções (${mProm.length})</div>`;
    html += tbl(["Posto/Graduação","Data Promoção","Data Publicação","BGO"],
      mProm.map(p=>[p.posto, p.data, p.dataPub||"", p.bgo||""]));

    // --- SAÚDE ---
    html += sec("3. SAÚDE / AFASTAMENTOS");
    const mAfast = [...(afastamentos||[]).filter(a=>a.policialId===id)].sort((a,b)=>b.dataInicio.localeCompare(a.dataInicio));
    html += tbl(["Tipo","Data Início","Data Fim","CID","Descrição","Status"],
      mAfast.map(a=>[
        a.tipo, a.dataInicio?new Date(a.dataInicio+"T12:00:00").toLocaleDateString("pt-BR"):"",
        a.dataFim?new Date(a.dataFim+"T12:00:00").toLocaleDateString("pt-BR"):"Em aberto",
        a.cid||"", a.descricao||"", a.concluido?"Concluído":"Ativo"
      ]));

    // --- FÉRIAS ---
    html += sec("4. FÉRIAS / LICENÇA-PRÊMIO");
    const linhasF = [];
    const mFeriasPlan = (ferias||[]).filter(f=>f.tipo==="planejamento");
    mFeriasPlan.sort((a,b)=>a.ano-b.ano||a.mes-b.mes).forEach(plan=>{
      const part = (plan.participantes||[]).find(p=>p.policialId===id);
      if (!part) return;
      linhasF.push([
        plan.titulo, part.tipo||"FÉRIAS",
        part.periodoAqDe||plan.periodoAqDe||"", part.periodoAqAte||plan.periodoAqAte||"",
        part.dataInicio?new Date(part.dataInicio+"T12:00:00").toLocaleDateString("pt-BR"):"",
        part.dataFim?new Date(part.dataFim+"T12:00:00").toLocaleDateString("pt-BR"):""
      ]);
    });
    html += tbl(["Planejamento","Tipo","P.A. De","P.A. Até","Início","Fim"], linhasF);

    // --- CURSOS ---
    html += sec("5. CURSOS");
    const linhasC = [];
    (cursos||[]).forEach(curso=>{
      const part = (curso.participantes||[]).find(p=>p.policialId===id);
      if (!part) return;
      const res = part.resultado||(part.aprovado===true?"aprovado":part.aprovado===false?"reprovado":"em andamento");
      linhasC.push([
        curso.nome,
        curso.dataInicio?new Date(curso.dataInicio+"T12:00:00").toLocaleDateString("pt-BR"):"",
        curso.dataFim?new Date(curso.dataFim+"T12:00:00").toLocaleDateString("pt-BR"):"",
        curso.local||"", curso.cargaHoraria?curso.cargaHoraria+"h":"", res.toUpperCase(), part.bgo||""
      ]);
    });
    linhasC.sort((a,b)=>a[1].localeCompare(b[1]));
    html += tbl(["Curso","Data Início","Data Fim","Local","C.H.","Resultado","BGO"], linhasC);

    // --- CORREGEDORIA ---
    html += sec("6. CORREGEDORIA");
    const mCorr = [...(corregedoria||[]).filter(c=>c.policialId===id)].sort((a,b)=>b.data.localeCompare(a.data));
    html += tbl(["Data","Tipo","Subtipo","Descrição","BGO"],
      mCorr.map(c=>[
        c.data?new Date(c.data+"T12:00:00").toLocaleDateString("pt-BR"):"",
        c.tipoReg==="punicao"?"Punição":c.tipoReg==="elogio"?"Elogio":"Sindicância",
        c.tipo||"", c.descricao||"", c.bgo||""
      ]));



    // --- VANTAGENS ---
    html += sec("7. VANTAGENS");
    const mVant = [...(vantagens||[]).filter(v=>v.policialId===id)].sort((a,b)=>b.dataInicio.localeCompare(a.dataInicio));
    const linhasV = mVant.map(v=>
      v.categoria==="cet"
        ? ["CET", v.tipo||"", v.dataInicio?new Date(v.dataInicio+"T12:00:00").toLocaleDateString("pt-BR"):"", v.bio||"",
           v.dataFim?new Date(v.dataFim+"T12:00:00").toLocaleDateString("pt-BR"):"Em vigência", v.bioFim||""]
        : ["Substituição","Subst. de "+v.grauSubst,
           v.dataInicio?new Date(v.dataInicio+"T12:00:00").toLocaleDateString("pt-BR"):"", v.bio||"",
           v.dataFim?new Date(v.dataFim+"T12:00:00").toLocaleDateString("pt-BR"):"Em vigência", v.bioFim||""]
    );
    html += tbl(["Categoria","Tipo/Função","Data Início","BIO Início","Data Fim","BIO Fim"], linhasV);

    // RODAPÉ
    const emit = loggedUser ? `${loggedUser.grau||""} ${loggedUser.nome||""}, Matrícula ${cleanMat(loggedUser.matricula||"")}` : "Sistema";
    html += `<div style="margin-top:28px;border-top:1px solid #ccc;padding-top:8px;font-style:italic;font-size:10px;color:#555;font-family:Arial,sans-serif;">
      Relatório emitido por ${emit} em ${dataEmissao} às ${horaEmissao} — SiRH77</div>`;

    setRelHtml(html);
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:1000,overflowY:"auto",padding:"24px 12px"}}>
      {relHtml && <RelModal html={relHtml} onClose={()=>setRelHtml("")}/>}
      <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:680,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#1e3a5f,#2d5986)",padding:"20px 24px",display:"flex",gap:16,alignItems:"center"}}>
          <Avatar name={officer.nome} size={52}/>
          <div style={{flex:1}}>
            <div style={{fontSize:17,fontWeight:700,color:"#fff"}}>{officer.nomeGuerra||officer.nome}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginTop:2}}>{officer.grau} · {officer.localTrabalho||"-"}</div>
            <div style={{marginTop:6,display:"flex",gap:6,flexWrap:"wrap"}}>
              <SitBadge sit={officer.situacao||"Ativo"}/>
              {officer.sexo && <Badge color="rgba(255,255,255,0.15)" textColor="#fff">{officer.sexo==="MASC"?"Masculino":"Feminino"}</Badge>}
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexShrink:0}}>
            {(perm.editarTudo||perm.efetivo) && <Btn small onClick={onEdit} style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"none",padding:"5px 12px",fontSize:12,borderRadius:7,cursor:"pointer"}}>✏️ Editar</Btn>}
            <Btn small onClick={()=>gerarRelatorioGeral()} style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"none",padding:"5px 12px",fontSize:12,borderRadius:7,cursor:"pointer"}}>📄 Relatório</Btn>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:12}}>✕</button>
          </div>
        </div>

        <div style={{borderBottom:"1px solid #e5e7eb",display:"flex",overflowX:"auto",background:"#f9fafb"}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              background:"none",border:"none",padding:"10px 14px",cursor:"pointer",
              fontSize:12,fontWeight:tab===t.id?600:400,
              color:tab===t.id?"#1e3a5f":"#6b7280",
              borderBottom:tab===t.id?"2px solid #1e3a5f":"2px solid transparent",
              whiteSpace:"nowrap"
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{padding:20,maxHeight:"60vh",overflowY:"auto"}}>
          {tab==="pessoal" && (
            <div>
              <Field label="Nome completo" value={officer.nome}/>
              <Field label="Nome de guerra" value={officer.nomeGuerra}/>
              <Field label="Matrícula" value={officer.matricula}/>
              <Field label="CPF" value={officer.cpf}/>
              <Field label="RG" value={officer.rg}/>
              <Field label="Data de nascimento" value={fmtDate(officer.dataNasc)+(idade?` (${idade} anos)`:"")}/>
              <Field label="Tipo sanguíneo" value={officer.tipoSang}/>
              <Field label="Estado civil" value={officer.estadoCivil}/>
              <Field label="Naturalidade" value={officer.naturalidade}/>
              <Field label="Sexo" value={officer.sexo==="MASC"?"Masculino":officer.sexo==="FEM"?"Feminino":officer.sexo}/>
              <Field label="Plano de saúde" value={officer.planoSaude}/>
              <Field label="Grau de instrução" value={officer.grauInstrucao}/>
              <Field label="CNH" value={officer.cnh?(officer.cnh+(officer.categoriaCnh?" Cat."+officer.categoriaCnh:"")+(officer.validCnh?" val."+fmtDate(officer.validCnh):"")):null}/>
              <Field label="PIS/PASEP" value={officer.pisPasep}/>
              <Field label="Pai" value={officer.pai}/>
              <Field label="Mãe" value={officer.mae}/>
              <Field label="Filhos" value={officer.filhos}/>
              <Field label="Título de eleitor" value={officer.titulo}/>
              <Field label="Telefone" value={officer.ddd&&officer.telefone?`(${officer.ddd}) ${officer.telefone}`:officer.telefone}/>
              <Field label="E-mail" value={officer.email}/>
              <Field label="Nome do pai" value={officer.nomePai}/>
              <Field label="Nome da mãe" value={officer.nomeMae}/>
              <Field label="Filhos" value={officer.filhos}/>
              <Field label="Endereço" value={officer.endereco}/>
              <Field label="Observação" value={officer.observacao}/>
            </div>
          )}
          {tab==="funcional" && (
            <div>
              <Field label="Grau hierárquico" value={officer.grau}/>
              {officer.antiguidade!=null && <Field label="Antiguidade no grau" value={`${officer.antiguidade}º no grau`}/>}
              <Field label="Pelotão" value={officer.pelotao}/>
              <Field label="Local de trabalho" value={officer.localTrabalho}/>
              <Field label="Data de admissão" value={fmtDate(officer.admissao)}/>
              <Field label="Tempo de serviço" value={ts}/>
              <Field label="Situação atual" value={officer.situacao||"Ativo"}/>
              <Field label="Cargo/função" value={officer.cargo}/>
              {officer.licIntParticular?.ativo && (
                <div style={{marginTop:8,background:"#ede9fe",borderRadius:7,padding:"8px 12px",fontSize:12}}>
                  <strong>🔵 Lic. para Tratar Interesse Particular</strong><br/>
                  {officer.licIntParticular.dataInicio&&<span>Desde: {fmtDate(officer.licIntParticular.dataInicio)} </span>}
                  {officer.licIntParticular.bgo&&<span>· {officer.licIntParticular.bgo}</span>}
                </div>
              )}
              <Field label="Penúltima unidade" value={officer.penultimaUnidade}/>
              <Field label="Antiguidade no grau" value={officer.antiguidade?`${officer.antiguidade}º`:""}/>

              {/* PROMOÇÕES */}
              <div style={{marginTop:14,borderTop:"1px solid #f3f4f6",paddingTop:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <span style={{fontSize:13,fontWeight:600,color:"#1e3a5f"}}>🎖️ Promoções</span>
                  {(perm.editarTudo||perm.efetivo) && (
                    <button onClick={()=>setModalProm({data:"",posto:officer.grau,bgo:""})}
                      style={{background:"#1e3a5f",color:"#fff",border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",fontWeight:500}}>+ Adicionar</button>
                  )}
                </div>
                {modalProm && (
                  <div style={{background:"#f0f4ff",borderRadius:8,padding:12,marginBottom:10,border:"1px solid #c7d7f9"}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#1e3a5f",marginBottom:8}}>Nova promoção</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                      <div>
                        <div style={{fontSize:11,color:"#6b7280",marginBottom:3}}>Data da promoção</div>
                        <input type="date" value={modalProm.data} onChange={e=>setModalProm(m=>({...m,data:e.target.value}))}
                          style={{width:"100%",padding:"6px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:12,boxSizing:"border-box"}}/>
                      </div>
                      <div>
                        <div style={{fontSize:11,color:"#6b7280",marginBottom:3}}>Grau promovido para</div>
                        <select value={modalProm.posto} onChange={e=>setModalProm(m=>({...m,posto:e.target.value}))}
                          style={{width:"100%",padding:"6px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:12,background:"#fff",boxSizing:"border-box"}}>
                          {RANK_ORDER.map(r=><option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{marginBottom:8}}>
                      <div style={{fontSize:11,color:"#6b7280",marginBottom:3}}>Número do BGO</div>
                      <input value={modalProm.bgo} onChange={e=>setModalProm(m=>({...m,bgo:e.target.value}))}
                        placeholder="Ex: BGO Nº 161 DE 22/08/2024"
                        style={{width:"100%",padding:"6px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:12,boxSizing:"border-box"}}/>
                    </div>
                    <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                      <button onClick={()=>setModalProm(null)} style={{padding:"5px 12px",border:"1px solid #d1d5db",borderRadius:6,background:"#fff",cursor:"pointer",fontSize:12}}>Cancelar</button>
                      <button onClick={()=>{
                        if (!modalProm.data||!modalProm.posto) return;
                        const nova={id:Date.now(),policialId:officer.id,data:modalProm.data,posto:modalProm.posto,bgo:modalProm.bgo||""};
                        setPromocoes(ps=>[...ps,nova]);
                        setModalProm(null);
                      }} style={{padding:"5px 12px",background:"#1e3a5f",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>💾 Salvar</button>
                    </div>
                  </div>
                )}
                {(promocoes||[]).filter(p=>p.policialId===officer.id).length===0
                  ? <p style={{fontSize:12,color:"#9ca3af",margin:0}}>Nenhuma promoção registrada.</p>
                  : [...(promocoes||[]).filter(p=>p.policialId===officer.id)]
                    .sort((a,b)=>b.data.localeCompare(a.data))
                    .map(p=>(
                      <div key={p.id} style={{display:"flex",borderBottom:"1px solid #f3f4f6",padding:"8px 0",gap:8,alignItems:"flex-start"}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:600,color:"#1e3a5f"}}>{p.posto}</div>
                          <div style={{fontSize:11,color:"#6b7280"}}>
                            Promoção: {fmtDate(p.data)}
                            {p.dataPub && <span> · Publicação: {p.dataPub}</span>}
                            {p.bgo && <span> · <em>{p.bgo}</em></span>}
                          </div>
                        </div>
                        {(perm.editarTudo||perm.efetivo) && (
                          <button onClick={()=>setPromocoes(ps=>ps.filter(x=>x.id!==p.id))}
                            style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:13}}>✕</button>
                        )}
                      </div>
                    ))
                }
              </div>
            </div>
          )}
          {tab==="saude" && (
            <div>
              {mAfast.length===0 && <p style={{color:"#9ca3af",fontSize:13}}>Nenhum afastamento registrado.</p>}
              {mAfast.sort((a,b)=>b.dataInicio.localeCompare(a.dataInicio)).map(a=>(
                <div key={a.id} style={{border:"1px solid #e5e7eb",borderRadius:8,padding:12,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <Badge color={a.tipo==="Atestado"?"#fef3c7":a.tipo==="Junta Médica"?"#fee2e2":"#ede9fe"} textColor={a.tipo==="Atestado"?"#92400e":a.tipo==="Junta Médica"?"#991b1b":"#5b21b6"}>{a.tipo}</Badge>
                    <span style={{fontSize:11,color:"#6b7280"}}>{fmtDate(a.dataInicio)} → {fmtDate(a.dataFim)||"Em aberto"}</span>
                  </div>
                  {a.cid && <div style={{fontSize:12,color:"#6b7280"}}>CID: {a.cid}</div>}
                  {a.descricao && <div style={{fontSize:12,color:"#374151",marginTop:4}}>{a.descricao}</div>}
                </div>
              ))}
            </div>
          )}
          {tab==="ferias" && (
            <div>
              {mFerias.length===0 && <p style={{color:"#9ca3af",fontSize:13}}>Nenhuma férias/licença-prêmio registrada.</p>}
              {[...mFerias].sort((a,b)=>a.ano-b.ano||a.mes-b.mes).map(plan=>{
                const part = (plan.participantes||[]).find(p=>p.policialId===id);
                if (!part) return null;
                const statusColors={planejada:["#dbeafe","#1d4ed8"],concluida:["#dcfce7","#15803d"],suspensa:["#fee2e2","#991b1b"],em_andamento:["#fef3c7","#92400e"],executada:["#dcfce7","#15803d"]};
                const [bg,fg]=statusColors[part.status]||["#f3f4f6","#374151"];
                const statusLabel={planejada:"🟡 Planejada",em_andamento:"🔵 Em andamento",executada:"✅ Executada",concluida:"✅ Concluída",suspensa:"🔴 Suspensa"};
                return (
                  <div key={plan.id} style={{border:`2px solid ${part.status==="suspensa"?"#fca5a5":part.status==="executada"||part.status==="concluida"?"#86efac":"#e5e7eb"}`,borderRadius:8,padding:12,marginBottom:8,cursor:"pointer",background:part.status==="suspensa"?"#fff5f5":"#fff"}}
                    onClick={()=>onOpenPlan&&onOpenPlan(plan)}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <span style={{fontWeight:700,fontSize:13,color:"#1e3a5f"}}>{plan.titulo}</span>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <Badge color={part.tipo==="LICENÇA-PRÊMIO"?"#d1fae5":"#dbeafe"} textColor={part.tipo==="LICENÇA-PRÊMIO"?"#065f46":"#1d4ed8"}>{part.tipo||"FÉRIAS"}</Badge>
                        <Badge color={bg} textColor={fg}>{statusLabel[part.status]||part.status||"Planejada"}</Badge>
                      </div>
                    </div>
                    <div style={{fontSize:12,color:"#6b7280"}}>{fmtDate(part.dataInicio)} → {fmtDate(part.dataFim)}</div>
                    {part.periodoAqDe && <div style={{fontSize:11,color:"#9ca3af"}}>P.A.: {part.periodoAqDe}/{part.periodoAqAte}</div>}
                    {part.status==="suspensa" && part.suspensao && (
                      <div style={{marginTop:6,background:"#fee2e2",borderRadius:5,padding:"5px 8px",fontSize:11}}>
                        <strong>Suspensa a partir de:</strong> {fmtDate(part.suspensao.dataInicio)}<br/>
                        <strong>Motivo:</strong> {part.suspensao.motivo}<br/>
                        {part.suspensao.bgo && <span><strong>BGO:</strong> {part.suspensao.bgo}</span>}
                      </div>
                    )}
                    <div style={{fontSize:10,color:"#9ca3af",marginTop:4}}>↗ Clique para abrir o planejamento</div>
                  </div>
                );
              })}
            </div>
          )}
          {tab==="corregedoria" && (
            <div>
              {mCorr.length===0 && <p style={{color:"#9ca3af",fontSize:13}}>Nenhum registro.</p>}
              {mCorr.sort((a,b)=>(b.data||"").localeCompare(a.data||"")).map(c=>(
                <div key={c.id} style={{border:"1px solid #e5e7eb",borderRadius:8,padding:12,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <Badge color={c.tipoReg==="elogio"?"#dcfce7":c.tipoReg==="punicao"?"#fee2e2":"#fef3c7"} textColor={c.tipoReg==="elogio"?"#15803d":c.tipoReg==="punicao"?"#991b1b":"#92400e"}>{c.tipoReg==="elogio"?"Elogio":c.tipoReg==="punicao"?"Punição":"Sindicância"}</Badge>
                    <span style={{fontSize:11,color:"#6b7280"}}>{fmtDate(c.data)}</span>
                  </div>
                  <div style={{fontSize:13,color:"#374151"}}>{c.descricao}</div>
                  {c.bgo && <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>BGO: {c.bgo}</div>}
                </div>
              ))}
            </div>
          )}
          {tab==="vantagens" && (
            <div>
              {/* CET */}
              <div style={{marginBottom:16}}>
                <div style={{fontWeight:600,fontSize:13,color:"#1e3a5f",marginBottom:8}}>🚗 CET</div>
                {(vantagens||[]).filter(v=>v.policialId===id&&v.categoria==="cet").length===0
                  ? <p style={{color:"#9ca3af",fontSize:12}}>Nenhum CET registrado.</p>
                  : [...(vantagens||[]).filter(v=>v.policialId===id&&v.categoria==="cet")]
                    .sort((a,b)=>b.dataInicio.localeCompare(a.dataInicio))
                    .map(v=>(
                      <div key={v.id} style={{border:"1px solid #e5e7eb",borderRadius:7,padding:"8px 12px",marginBottom:6,background:v.dataFim?"#f9fafb":"#eff6ff"}}>
                        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                          <Badge color={v.tipo==="4 Rodas"?"#dbeafe":v.tipo==="2 Rodas"?"#d1fae5":"#fef3c7"} textColor={v.tipo==="4 Rodas"?"#1d4ed8":v.tipo==="2 Rodas"?"#065f46":"#92400e"}>{v.tipo}</Badge>
                          {v.dataFim&&<Badge color="#f3f4f6" textColor="#374151" size={10}>Encerrado</Badge>}
                        </div>
                        <div style={{fontSize:11,color:"#374151"}}>Início: {fmtDate(v.dataInicio)} · <em>{v.bio}</em></div>
                        {v.dataFim&&<div style={{fontSize:11,color:"#6b7280"}}>Fim: {fmtDate(v.dataFim)} · <em>{v.bioFim}</em></div>}
                      </div>
                    ))
                }
              </div>
              {/* Substituição */}
              <div>
                <div style={{fontWeight:600,fontSize:13,color:"#1e3a5f",marginBottom:8}}>⭐ Substituições</div>
                {(vantagens||[]).filter(v=>v.policialId===id&&v.categoria==="subst").length===0
                  ? <p style={{color:"#9ca3af",fontSize:12}}>Nenhuma substituição registrada.</p>
                  : [...(vantagens||[]).filter(v=>v.policialId===id&&v.categoria==="subst")]
                    .sort((a,b)=>b.dataInicio.localeCompare(a.dataInicio))
                    .map(v=>(
                      <div key={v.id} style={{border:"1px solid #e5e7eb",borderRadius:7,padding:"8px 12px",marginBottom:6,background:v.dataFim?"#f9fafb":"#f0fdf4"}}>
                        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                          <Badge color="#dcfce7" textColor="#15803d">Subst. de {v.grauSubst}</Badge>
                          {v.dataFim&&<Badge color="#f3f4f6" textColor="#374151" size={10}>Encerrado</Badge>}
                        </div>
                        <div style={{fontSize:11,color:"#374151"}}>Início: {fmtDate(v.dataInicio)} · <em>{v.bio}</em></div>
                        {v.dataFim&&<div style={{fontSize:11,color:"#6b7280"}}>Fim: {fmtDate(v.dataFim)} · <em>{v.bioFim}</em></div>}
                      </div>
                    ))
                }
              </div>
            </div>
          )}
          {tab==="cursos" && (
            <div>
              {mCursos.length===0 && <p style={{color:"#9ca3af",fontSize:13}}>Nenhum curso registrado.</p>}
              {[...mCursos].sort((a,b)=>(b.dataInicio||"").localeCompare(a.dataInicio||"")).map(c=>{
                const part=(c.participantes||[]).find(p=>p.policialId===id);
                if(!part) return null;
                const status = c.concluido ? "Concluído" : "Em andamento";
                const [sbg, sfg] = c.concluido ? ["#dcfce7","#15803d"] : ["#fef3c7","#92400e"];
                return (
                  <div key={c.id} style={{border:"1px solid #e5e7eb",borderRadius:8,padding:12,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span style={{fontWeight:600,fontSize:13}}>🎓 {c.nome}</span>
                      <Badge color={sbg} textColor={sfg}>{status}</Badge>
                    </div>
                    <div style={{fontSize:12,color:"#6b7280",marginBottom:6}}>{fmtDate(c.dataInicio)}{c.dataFim?" → "+fmtDate(c.dataFim):""}{c.local?" · "+c.local:""}{c.cargaHoraria?" · "+c.cargaHoraria+"h":""}</div>
                    {part.bgo&&<div style={{fontSize:11,color:"#6b7280",marginTop:4}}>{part.bgo}</div>}
                  </div>
                );
              })}
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// MÓDULO EFETIVO
// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// GESTÃO DE ANTIGUIDADE (componente top-level)
// ──────────────────────────────────────────────
function GerirAntiguidade({ officers, setOfficers }) {
  const [grauSel, setGrauSel] = useState(RANK_ORDER.find(r=>officers.some(o=>o.grau===r))||RANK_ORDER[0]);
  const polsGrau = [...officers.filter(o=>o.grau===grauSel&&!SITUACOES_INATIVO.includes(o.situacao||"Ativo"))]
    .sort((a,b)=>(a.antiguidade??9999)-(b.antiguidade??9999));
  return (
    <div style={{padding:20}}>
      <div style={{marginBottom:14}}>
        <label style={{fontSize:12,fontWeight:500,color:"#374151",display:"block",marginBottom:4}}>Grau hierárquico</label>
        <select value={grauSel} onChange={e=>setGrauSel(e.target.value)}
          style={{width:"100%",padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,background:"#fff"}}>
          {RANK_ORDER.filter(r=>officers.some(o=>o.grau===r)).map(r=><option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>{polsGrau.length} policial(is) — edite o número de ordem (1 = mais antigo):</div>
      <div style={{maxHeight:"50vh",overflowY:"auto"}}>
        {polsGrau.map((o,i)=>(
          <div key={o.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f3f4f6"}}>
            <input type="number" min="1" value={o.antiguidade??i+1}
              onChange={e=>setOfficers(os=>os.map(x=>x.id===o.id?{...x,antiguidade:Number(e.target.value)}:x))}
              style={{width:60,padding:"5px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:13,textAlign:"center",outline:"none"}}/>
            <Avatar name={o.nome} size={28}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13}}>{o.nome.toUpperCase()}</div>
              <div style={{fontSize:11,color:"#6b7280"}}>{o.grau} · Mat. {cleanMat(o.matricula)}</div>
            </div>
          </div>
        ))}
        {polsGrau.length===0&&<p style={{color:"#9ca3af",textAlign:"center",fontSize:13}}>Nenhum policial neste grau.</p>}
      </div>
      <div style={{marginTop:12,background:"#f0f4ff",borderRadius:7,padding:"8px 12px",fontSize:11,color:"#1e3a5f"}}>
        ℹ️ Os números definem a ordem dentro do grau. 1 = mais antigo. Após promoção, o número é definido pela classificação no curso.
      </div>
    </div>
  );
}

function ModEfetivo({ officers, setOfficers, perm, locations, ferias, afastamentos, corregedoria, cursos, vantagens, promocoes, setPromocoes, initialFilter, onFilterConsumed, onOpenFeriasPlan }) {
  const [search, setSearch] = useState("");
  const [fRank, setFRank] = useState("todos");
  const [fSexo, setFSexo] = useState("todos");
  const [fLoc, setFLoc] = useState("todos");
  const [fSit, setFSit] = useState("todos");
  const [fOrigem, setFOrigem] = useState("todos");
  const [fAtivo, setFAtivo] = useState("ativo"); // "ativo" | "inativo" | "todos"
  const [filterIds, setFilterIds] = useState(null); // set by dashboard click
  const [sortByAnt, setSortByAnt] = useState(false); // sort by antiguidade
  const [gerirAnt, setGerirAnt] = useState(false); // manage antiguidade screen

  useEffect(()=>{
    if (!initialFilter) return;
    const f = initialFilter;
    // Reset all filters first
    setSearch(""); setFRank("todos"); setFSexo("todos"); setFLoc("todos"); setFSit("todos"); setFOrigem("todos"); setFAtivo("ativo"); setFilterIds(null);
    if (f.type==="all") { setFAtivo("ativo"); }
    else if (f.type==="sit") { setFSit(f.value); }
    else if (f.type==="origem") { setFOrigem(f.value); }
    else if (f.type==="sexo") { setFSexo(f.value); }
    else if (f.type==="ferias") { setFAtivo("ativo"); }
    else if (f.type==="ids") { setFilterIds(f.ids); setFAtivo("todos"); }
    else if (f.type==="restricoes") { setFilterIds((f.dados||[]).map(d=>d.officer?.id).filter(Boolean)); setFAtivo("todos"); }
    if (onFilterConsumed) onFilterConsumed();
  }, [initialFilter]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const allLocs = ["todos",...new Set(officers.map(o=>o.localTrabalho).filter(Boolean))].sort();
  const allRanks = ["todos",...RANK_ORDER.filter(r=>officers.some(o=>o.grau===r))];

  const filtered = useMemo(()=>{
    let list = [...officers];
    if (search.trim()) {
      const q = search.toLowerCase();
      const qMat = cleanMat(search);
      list = list.filter(o=>
        (o.nome||"").toLowerCase().includes(q)||
        (o.nomeGuerra||"").toLowerCase().includes(q)||
        cleanMat(o.matricula).includes(qMat)
      );
    }
    if (fRank!=="todos") list=list.filter(o=>o.grau===fRank);
    if (fSexo!=="todos") list=list.filter(o=>o.sexo===fSexo);
    if (fLoc!=="todos") list=list.filter(o=>o.localTrabalho===fLoc);
    if (fSit!=="todos") {
      const todayStr2 = new Date().toISOString().slice(0,10);
      // Build sets of policialIds per situação cruzando com todos os módulos
      const afast = afastamentos||[];

      // Férias: policial está em plano de férias com status em_andamento ou com datas abrangendo hoje
      const ferIdsSet = new Set();
      (ferias||[]).forEach(plano=>{
        (plano.participantes||[]).forEach(p=>{
          if (!p.policialId) return;
          const ini = p.dataInicio||plano.dataInicio;
          const fim = p.dataFim||plano.dataFim;
          if (ini && fim && ini<=todayStr2 && fim>=todayStr2) ferIdsSet.add(p.policialId);
          else if (plano.status==="em_andamento" && p.policialId) ferIdsSet.add(p.policialId);
        });
      });

      const tipoSet = (tipo) => new Set(
        afast.filter(a=>a.tipo===tipo && !a.concluido &&
          (!a.dataInicio || a.dataInicio<=todayStr2) &&
          (!a.dataFim || a.dataFim>=todayStr2)
        ).map(a=>a.policialId)
      );

      const sitMap = {
        "Férias":           ferIdsSet,
        "Junta Médica":     tipoSet("Junta Médica"),
        "Atestado":         tipoSet("Atestado"),
        "Restrição Médica": tipoSet("Restrição Médica"),
        "Licença Maternidade": tipoSet("Licença Maternidade"),
        "Licença Paternidade": tipoSet("Licença Paternidade"),
        "Licença Prêmio":   tipoSet("Licença Prêmio"),
        "Luto":             tipoSet("Luto"),
        "Núpcias":          tipoSet("Núpcias"),
      };

      if (sitMap[fSit]) {
        const ids = sitMap[fSit];
        // Also fallback to officer.situacao field
        list = list.filter(o=>ids.has(o.id)||(o.situacao||"Ativo")===fSit);
      } else {
        list = list.filter(o=>(o.situacao||"Ativo")===fSit);
      }
    }
    if (fOrigem!=="todos") list=list.filter(o=>o.origem===fOrigem);
    if (fAtivo==="ativo") list=list.filter(o=>!SITUACOES_INATIVO.includes(o.situacao||"Ativo"));
    else if (fAtivo==="inativo") list=list.filter(o=>SITUACOES_INATIVO.includes(o.situacao||"Ativo"));
    if (filterIds!==null) list=list.filter(o=>filterIds.includes(o.id));
    if (sortByAnt) {
      return list.sort((a,b)=>{
        // Sort by rank first, then by antiguidade within same rank
        const rankDiff = rankSort(a,b);
        if (rankDiff !== 0) return rankDiff;
        const aa = a.antiguidade ?? 9999;
        const ab = b.antiguidade ?? 9999;
        return aa - ab;
      });
    }
    return list.sort(rankSort);
  }, [officers, afastamentos, ferias, search, fRank, fSexo, fLoc, fSit, fOrigem, fAtivo, filterIds, sortByAnt]);

  function saveNew(form) {
    if (!form.nome||!form.matricula) { alert("Nome e matrícula obrigatórios."); return; }
    const newId = Math.max(0,...officers.map(o=>o.id))+1;
    setOfficers(old=>[...old,{...form,id:newId,situacao:form.situacao||"Ativo"}]);
    setAdding(false);
  }

  function saveEdit(form) {
    setOfficers(old=>old.map(o=>o.id===form.id?{...o,...form}:o));
    setEditing(null);
    if (selected) setSelected({...selected,...form});
  }

  return (
    <div>
      {confirm && <Confirm msg={confirm.msg} onYes={()=>{confirm.action();setConfirm(null);}} onNo={()=>setConfirm(null)}/>}
      {selected && !editing && (
        <PolicialDetail officer={selected} onClose={()=>setSelected(null)} onEdit={()=>{setEditing(selected);setSelected(null);}}
          perm={perm} ferias={ferias} afastamentos={afastamentos} corregedoria={corregedoria} cursos={cursos} vantagens={vantagens} promocoes={promocoes} setPromocoes={setPromocoes} onOpenPlan={plan=>{setSelected(null);onOpenFeriasPlan&&onOpenFeriasPlan(plan);}}/>
      )}
      {(editing||adding) && (
        <Modal title={editing?"Editar policial":"Novo policial"} onClose={()=>{setEditing(null);setAdding(false);}} wide>
          <FormPolicial initial={editing||{}} locations={locations}
            onSave={editing?saveEdit:saveNew} onCancel={()=>{setEditing(null);setAdding(false);}}/>
        </Modal>
      )}

      {/* Modal: Gerir Antiguidade */}
      {gerirAnt && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:1000,overflowY:"auto",padding:"24px 12px"}}>
          <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:680,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#1e3a5f,#2d5986)",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:15}}>📋 Gestão de Antiguidade</span>
              <button onClick={()=>setGerirAnt(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"4px 12px",cursor:"pointer",fontSize:12}}>✕ Fechar</button>
            </div>
            <GerirAntiguidade officers={officers} setOfficers={setOfficers}/>
          </div>
        </div>
      )}

      {/* Alerta CNH vencendo — compacto com expand */}
      {(()=>{
        const hj = new Date();
        const d60 = new Date(hj); d60.setDate(d60.getDate()+60);
        const alertas = officers.filter(o=>{
          if (!o.validCnh || SITUACOES_INATIVO.includes(o.situacao)) return false;
          const venc = new Date(o.validCnh+"T12:00:00");
          return venc <= d60;
        }).sort((a,b)=>a.validCnh.localeCompare(b.validCnh));
        if (!alertas.length) return null;
        return (
          <AlertaBanner
            cor="#fef3c7" borda="#fcd34d" icone="🚗"
            titulo={`${alertas.length} policial(is) com CNH vencendo em 60 dias`}
            linhas={alertas.map(o=>{
              const diff=Math.ceil((new Date(o.validCnh+"T12:00:00")-hj)/(24*3600*1000));
              return `${o.grau} ${o.nome} — Cat. ${o.categoriaCnh||"?"} — ${diff<=0?"VENCIDA":"vence em "+diff+" dias"} (${fmtDate(o.validCnh)})`;
            })}
            chaveStorage="cnh_efetivo"
          />
        );
      })()}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:700,color:"#111827",margin:0}}>Efetivo</h2>
          <span style={{fontSize:12,color:"#6b7280"}}>{filtered.length} policiais encontrados</span>
          {filterIds!==null && <span style={{fontSize:11,background:"#fef3c7",color:"#92400e",borderRadius:5,padding:"2px 8px",marginLeft:6}}>🔍 Filtro do painel · <button onClick={()=>setFilterIds(null)} style={{background:"none",border:"none",color:"#92400e",cursor:"pointer",fontSize:11,padding:0}}>✕ limpar</button></span>}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setSortByAnt(s=>!s)} style={{padding:"7px 12px",border:`1px solid ${sortByAnt?"#1e3a5f":"#d1d5db"}`,borderRadius:7,fontSize:12,cursor:"pointer",background:sortByAnt?"#1e3a5f":"#fff",color:sortByAnt?"#fff":"#374151",fontWeight:sortByAnt?600:400}}>
            {sortByAnt?"↕ Antiguidade ✓":"↕ Antiguidade"}
          </button>
          <button onClick={()=>setGerirAnt(true)} style={{padding:"7px 12px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,cursor:"pointer",background:"#fff",color:"#374151"}}>📋 Gerir Antiguidade</button>
          {(perm.editarTudo||perm.efetivo) && <Btn onClick={()=>setAdding(true)}>+ Novo policial</Btn>}
        </div>
      </div>

      <Card style={{marginBottom:12,padding:12}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar nome ou matrícula..."
            style={{flex:1,minWidth:180,padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,outline:"none"}}/>
          <select value={fRank} onChange={e=>setFRank(e.target.value)} style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#fff"}}>
            <option value="todos">Todos graus</option>
            {allRanks.filter(r=>r!=="todos").map(r=><option key={r} value={r}>{r}</option>)}
          </select>
          <select value={fSexo} onChange={e=>setFSexo(e.target.value)} style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#fff"}}>
            <option value="todos">Sexo</option>
            <option value="MASC">Masc</option>
            <option value="FEM">Fem</option>
          </select>
          <select value={fSit} onChange={e=>setFSit(e.target.value)} style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#fff"}}>
            <option value="todos">Situação</option>
            {SITUACOES_ATIVO.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <select value={fLoc} onChange={e=>setFLoc(e.target.value)} style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#fff",maxWidth:200}}>
            {allLocs.map(l=><option key={l} value={l}>{l==="todos"?"Todos locais":l}</option>)}
          </select>
          <select value={fOrigem} onChange={e=>setFOrigem(e.target.value)} style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#fff"}}>
            <option value="todos">SEDE + BCS</option>
            <option value="SEDE">Só SEDE</option>
            <option value="BCS">Só BCS</option>
          </select>
          <div style={{display:"flex",background:"#f3f4f6",borderRadius:8,overflow:"hidden",border:"1px solid #e5e7eb"}}>
            <button onClick={()=>setFAtivo("ativo")} style={{padding:"6px 12px",border:"none",cursor:"pointer",fontSize:11,fontWeight:fAtivo==="ativo"?700:400,background:fAtivo==="ativo"?"#15803d":"transparent",color:fAtivo==="ativo"?"#fff":"#374151"}}>Ativos</button>
            <button onClick={()=>setFAtivo("inativo")} style={{padding:"6px 12px",border:"none",cursor:"pointer",fontSize:11,fontWeight:fAtivo==="inativo"?700:400,background:fAtivo==="inativo"?"#dc2626":"transparent",color:fAtivo==="inativo"?"#fff":"#374151"}}>Inativos</button>
            <button onClick={()=>setFAtivo("todos")} style={{padding:"6px 12px",border:"none",cursor:"pointer",fontSize:11,fontWeight:fAtivo==="todos"?700:400,background:fAtivo==="todos"?"#1e3a5f":"transparent",color:fAtivo==="todos"?"#fff":"#374151"}}>Todos</button>
          </div>
          {(search||fRank!=="todos"||fSexo!=="todos"||fLoc!=="todos"||fSit!=="todos"||fOrigem!=="todos") &&
            <button onClick={()=>{setSearch("");setFRank("todos");setFSexo("todos");setFLoc("todos");setFSit("todos");setFOrigem("todos");}}
              style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#f9fafb",cursor:"pointer",color:"#6b7280"}}>Limpar</button>}
        </div>
      </Card>

      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {filtered.map(o=>(
          <div key={o.id} onClick={()=>setSelected(o)} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:9,padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#93c5fd";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";}}>
            <div style={{width:80,flexShrink:0}}>
              <span style={{fontSize:11,fontWeight:600,color:"#1e3a5f",lineHeight:1.3,display:"block"}}>{o.grau}</span>
              {o.origem&&<Badge color={o.origem==="BCS"?"#fef3c7":"#dbeafe"} textColor={o.origem==="BCS"?"#92400e":"#1d4ed8"} size={9}>{o.origem}</Badge>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,color:"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {o.nomeGuerra
                  ? <><strong style={{fontWeight:700}}>{(o.nomeGuerra).toUpperCase()}</strong><span style={{fontWeight:400,color:"#6b7280"}}> — {(o.nome).toUpperCase()}</span></>
                  : <strong style={{fontWeight:600}}>{(o.nome).toUpperCase()}</strong>
                }
              </div>
              <div style={{fontSize:11,color:"#6b7280",marginTop:1}}>Mat. {cleanMat(o.matricula)||"-"}</div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
              <SitBadge sit={getSituacaoReal(o, afastamentos, ferias)}/>
              {o.sexo==="FEM"&&<Badge color="#fce7f3" textColor="#9d174d" size={10}>F</Badge>}
            </div>
          </div>
        ))}
        {filtered.length===0 && <div style={{textAlign:"center",padding:"32px",color:"#9ca3af",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>Nenhum policial encontrado</div>}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// MÓDULO LOCAIS DE TRABALHO
// ──────────────────────────────────────────────
function ModLocais({ locations, setLocations, officers, setOfficers }) {
  const [novo, setNovo] = useState("");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [localDetalhe, setLocalDetalhe] = useState(null); // local selecionado para gerenciar policiais
  const [buscarPol, setBuscarPol] = useState("");

  // Policiais agrupados por local
  const policiaisPorLocal = useMemo(() => {
    const map = {};
    officers.forEach(o => {
      const loc = o.localTrabalho || "(Sem local)";
      if (!map[loc]) map[loc] = [];
      map[loc].push(o);
    });
    return map;
  }, [officers]);

  function add() {
    const t = novo.trim().toUpperCase();
    if (!t) return;
    if (locations.includes(t)) { alert("Local já existe."); return; }
    setLocations(ls=>[...ls, t]);
    setNovo("");
  }

  function del(loc) {
    const count = (policiaisPorLocal[loc]||[]).length;
    if (count > 0) { alert(`Este local está em uso por ${count} policial(is). Mova-os antes de excluir.`); return; }
    setLocations(ls=>ls.filter(l=>l!==loc));
  }

  // Mover policial para este local
  function adicionarPolicial(officer) {
    setOfficers(os=>os.map(o=>o.id===officer.id?{...o,localTrabalho:localDetalhe}:o));
  }

  // Remover policial deste local (deixa sem local)
  function removerPolicial(officer) {
    setOfficers(os=>os.map(o=>o.id===officer.id?{...o,localTrabalho:""}:o));
  }

  const filtered = locations.filter(l=>l.toLowerCase().includes(search.toLowerCase()));

  // Se estiver no detalhe de um local
  if (localDetalhe) {
    const polsNoLocal = (policiaisPorLocal[localDetalhe]||[]).sort(rankSort);
    const polsSemEsse = officers.filter(o=>(o.localTrabalho||"")!==localDetalhe &&
      !["Transferido","Reserva/Inativo"].includes(o.situacao||"Ativo")
    ).sort(rankSort);
    const polsFiltrados = buscarPol.trim()
      ? polsSemEsse.filter(o=>o.nome.toLowerCase().includes(buscarPol.toLowerCase())||
          (o.matricula||"").includes(buscarPol))
      : polsSemEsse;

    return (
      <div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <button onClick={()=>{setLocalDetalhe(null);setBuscarPol("");}}
            style={{background:"none",border:"none",color:"#1e3a5f",cursor:"pointer",fontSize:20,padding:0}}>←</button>
          <div>
            <h2 style={{fontSize:18,fontWeight:700,margin:0}}>{localDetalhe}</h2>
            <span style={{fontSize:12,color:"#6b7280"}}>{polsNoLocal.length} policial(is) neste local</span>
          </div>
        </div>

        {/* Policiais neste local */}
        <Card style={{marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:10}}>
            Policiais em {localDetalhe}
          </div>
          {polsNoLocal.length===0 && (
            <p style={{color:"#9ca3af",fontSize:13,textAlign:"center"}}>Nenhum policial neste local.</p>
          )}
          {polsNoLocal.map(o=>(
            <div key={o.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f3f4f6"}}>
              <Avatar name={o.nome} size={32}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13}}>{o.nome.toUpperCase()}</div>
                <div style={{fontSize:11,color:"#6b7280"}}>{o.grau} · Mat. {cleanMat(o.matricula)}</div>
              </div>
              <Btn small variant="danger" onClick={()=>setConfirm({
                msg:`Remover ${o.nome} de ${localDetalhe}?`,
                action:()=>removerPolicial(o)
              })}>✕ Remover</Btn>
            </div>
          ))}
        </Card>

        {/* Adicionar policiais */}
        <Card>
          <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:10}}>
            Adicionar policiais a {localDetalhe}
          </div>
          <input value={buscarPol} onChange={e=>setBuscarPol(e.target.value)}
            placeholder="🔍 Buscar por nome ou matrícula..."
            style={{width:"100%",padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:10}}/>
          <div style={{maxHeight:400,overflowY:"auto"}}>
            {polsFiltrados.slice(0,50).map(o=>(
              <div key={o.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid #f3f4f6"}}>
                <Avatar name={o.nome} size={28}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500}}>{o.nome.toUpperCase()}</div>
                  <div style={{fontSize:11,color:"#6b7280"}}>{o.grau} · {o.localTrabalho||"Sem local"}</div>
                </div>
                <Btn small onClick={()=>adicionarPolicial(o)}>+ Adicionar</Btn>
              </div>
            ))}
            {polsFiltrados.length===0 && <p style={{color:"#9ca3af",fontSize:13,textAlign:"center"}}>Nenhum policial encontrado.</p>}
          </div>
        </Card>
        {confirm && <Confirm msg={confirm.msg} onYes={()=>{confirm.action();setConfirm(null);}} onNo={()=>setConfirm(null)}/>}
      </div>
    );
  }

  // Lista de locais
  return (
    <div>
      {confirm && <Confirm msg={confirm.msg} onYes={()=>{confirm.action();setConfirm(null);}} onNo={()=>setConfirm(null)}/>}
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:18,fontWeight:700,color:"#111827",margin:0}}>Locais de Trabalho</h2>
        <span style={{fontSize:12,color:"#6b7280"}}>{locations.length} locais cadastrados</span>
      </div>

      <Card style={{marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:10}}>Adicionar novo local</div>
        <div style={{display:"flex",gap:8}}>
          <input value={novo} onChange={e=>setNovo(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}
            placeholder="Nome do local (ex: 1º PEL/CENTRO)"
            style={{flex:1,padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,outline:"none"}}/>
          <Btn onClick={add}>Adicionar</Btn>
        </div>
      </Card>

      <Card>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filtrar locais..."
          style={{width:"100%",padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:12}}/>
        {filtered.length===0 && <p style={{color:"#9ca3af",fontSize:13,textAlign:"center"}}>Nenhum local encontrado.</p>}
        {filtered.map(l=>{
          const count = (policiaisPorLocal[l]||[]).length;
          return (
            <div key={l} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 0",borderBottom:"1px solid #f3f4f6"}}>
              <div style={{display:"flex",flexDirection:"column",gap:1}}>
                <button onClick={()=>{const i=locations.indexOf(l);if(i>0){const n=[...locations];[n[i-1],n[i]]=[n[i],n[i-1]];setLocations(n);}}}
                  style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:10,lineHeight:1,padding:"1px 3px"}} title="Mover para cima">▲</button>
                <button onClick={()=>{const i=locations.indexOf(l);if(i<locations.length-1){const n=[...locations];[n[i],n[i+1]]=[n[i+1],n[i]];setLocations(n);}}}
                  style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:10,lineHeight:1,padding:"1px 3px"}} title="Mover para baixo">▼</button>
              </div>
              <div style={{flex:1,cursor:"pointer"}} onClick={()=>setLocalDetalhe(l)}>
                <div style={{fontWeight:600,fontSize:13,color:"#1e3a5f"}}>{l}</div>
                <div style={{fontSize:11,color:"#6b7280"}}>{count} policial(is)</div>
              </div>
              <Badge color="#dbeafe" textColor="#1d4ed8">{count}</Badge>
              <span style={{color:"#9ca3af",fontSize:14,cursor:"pointer"}} onClick={()=>setLocalDetalhe(l)}>›</span>
              <button onClick={e=>{e.stopPropagation();setConfirm({msg:`Excluir local "${l}"?`,action:()=>del(l)});}}
                style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:13,padding:"0 4px"}}>🗑</button>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function ModFerias({ officers, ferias, setFerias, loggedUser, initialDetalhe, onDetalheConsumed }) {
  const [relHtml, setRelHtml] = useState("");

  function cabecalho() {
    return `<div style="text-align:center;font-family:Arial,sans-serif;margin-bottom:18px;"><div style="font-weight:bold;font-size:12px;line-height:2.0;text-transform:uppercase;">POLÍCIA MILITAR DA BAHIA<br/>COMANDO DE POLICIAMENTO DA REGIÃO SUDOESTE<br/>77ª COMPANHIA INDEPENDENTE DE POLÍCIA MILITAR<br/>VITÓRIA DA CONQUISTA - ÁREA LESTE</div></div>`;
  }
  function rodape(lu) {
    const agora=new Date();
    const d=agora.toLocaleDateString("pt-BR"),h=agora.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
    const por=lu?`${lu.grau||""} ${lu.nome} — Mat. ${lu.matricula}`.trim():"Sistema";
    return `<div style="margin-top:24px;border-top:1px solid #ccc;padding-top:8px;font-style:italic;font-size:10px;color:#555;text-align:right;font-family:Arial,sans-serif;">Relatório emitido em ${d} às ${h} por: ${por}</div>`;
  }
  function tituloBloco(txt) {
    return `<div style="text-align:center;font-size:14px;font-weight:bold;text-transform:uppercase;border-top:2px solid #000;border-bottom:2px solid #000;padding:7px 0;margin-bottom:14px;font-family:Arial,sans-serif;">${txt}</div>`;
  }
  function fichaPolicial(o) {
    return `<div style="background:#f5f5f5;border-radius:6px;padding:8px 12px;margin-bottom:14px;font-size:11px;font-family:Arial,sans-serif;"><strong>Nome:</strong> ${o.nome}&nbsp;&nbsp;<strong>Grau:</strong> ${o.grau}&nbsp;&nbsp;<strong>Matrícula:</strong> ${o.matricula}&nbsp;&nbsp;<strong>Unidade:</strong> ${o.origem||"SEDE"}&nbsp;&nbsp;<strong>Local:</strong> ${o.localTrabalho||"—"}</div>`;
  }
  function tabelaHTML(cols, linhas) {
    const ths = cols.map(c=>`<th style="padding:7px 8px;border:1px solid #1e3a5f;text-align:left;font-size:11px;">${c}</th>`).join("");
    const trs = linhas.map((r,i)=>{
      const tds = r.map(v=>`<td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;">${v==null?"":v}</td>`).join("");
      return `<tr style="background:${i%2===0?"#fff":"#f9f9f9"}">${tds}</tr>`;
    }).join("");
    return `<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;margin-bottom:16px;"><thead><tr style="background:#1e3a5f;color:#fff;">${ths}</tr></thead><tbody>${trs||`<tr><td colspan="${cols.length}" style="text-align:center;padding:12px;color:#666;font-style:italic">Nenhum registro encontrado.</td></tr>`}</tbody></table>`;
  }

  const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth()+1;

  const [detalhe, setDetalhe] = useState(null);
  const [modalNovo, setModalNovo] = useState(false);
  const [modalSuspensao, setModalSuspensao] = useState(null); // {plan, partId}
  const [formSuspensao, setFormSuspensao] = useState({dataInicio:"",motivo:"",bgo:""});

  useEffect(()=>{
    if (initialDetalhe) { setDetalhe(initialDetalhe); if(onDetalheConsumed) onDetalheConsumed(); }
  },[initialDetalhe]);
  const [formNovo, setFormNovo] = useState({mes:mesAtual, ano:anoAtual});
  const [verEncerrados, setVerEncerrados] = useState(false);
  const [busca, setBusca] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [alertaDup, setAlertaDup] = useState(null);

  function criarPlanejamento() {
    const mes = Number(formNovo.mes);
    const ano = Number(formNovo.ano);
    const jaExiste = ferias.find(f=>f.tipo==="planejamento"&&f.mes===mes&&f.ano===ano);
    if (jaExiste) { alert(`Já existe um planejamento para ${MESES[mes-1]}/${ano}.`); return; }
    const mm = String(mes).padStart(2,"0");
    const periodoAqDe = `${ano-1}`;
    const periodoAqAte = `${ano}`;
    const novo = {
      id: Date.now(), tipo:"planejamento", mes, ano,
      titulo:`${MESES[mes-1]} / ${ano}`,
      dataInicio:`${ano}-${mm}-01`,
      dataFim:`${ano}-${mm}-30`,
      concluido: false,
      periodoAqDe,
      periodoAqAte,
      participantes: []
    };
    setFerias(fs=>[...fs, novo]);
    setModalNovo(false);
    setDetalhe(novo);
  }

  function verificarDuplicata(plan, oficial) {
    return ferias.find(f=>
      f.tipo==="planejamento" && f.id!==plan.id && f.ano===plan.ano &&
      (f.participantes||[]).some(p=>p.policialId===oficial.id && p.tipo==="FÉRIAS")
    ) || null;
  }

  function adicionarPolicial(plan, oficial) {
    const dup = verificarDuplicata(plan, oficial);
    if (dup) {
      setAlertaDup({
        nome: oficial.nome,
        planAnterior: dup.titulo,
        onContinuar: () => { _fazerAdicionar(plan, oficial); setAlertaDup(null); },
        onCancelar: () => setAlertaDup(null)
      });
      return;
    }
    _fazerAdicionar(plan, oficial);
  }

  function _fazerAdicionar(plan, oficial) {
    const mm = String(plan.mes).padStart(2,"0");
    const novoP = {
      id: Date.now(), policialId: oficial.id,
      dataInicio:`${plan.ano}-${mm}-01`,
      dataFim:`${plan.ano}-${mm}-30`,
      tipo:"FÉRIAS",
      periodoAqDe: plan.periodoAqDe||String(plan.ano-1),
      periodoAqAte: plan.periodoAqAte||String(plan.ano),
    };
    const updated = {...plan, participantes:[...(plan.participantes||[]), novoP]};
    setFerias(fs=>fs.map(f=>f.id===plan.id?updated:f));
    setDetalhe(updated);
  }

  function removerPolicial(plan, partId) {
    const updated = {...plan, participantes:(plan.participantes||[]).filter(p=>p.id!==partId)};
    setFerias(fs=>fs.map(f=>f.id===plan.id?updated:f));
    setDetalhe(updated);
  }

  function atualizarP(plan, partId, campo, valor) {
    const updated = {...plan, participantes:(plan.participantes||[]).map(p=>p.id===partId?{...p,[campo]:valor}:p)};
    setFerias(fs=>fs.map(f=>f.id===plan.id?updated:f));
    setDetalhe(updated);
  }

  function alterarStatusGeral(plan, novoStatus) {
    const updated = {
      ...plan, statusGeral: novoStatus,
      participantes: (plan.participantes||[]).map(p=>({...p, status:novoStatus}))
    };
    setFerias(fs=>fs.map(f=>f.id===plan.id?updated:f));
    setDetalhe(updated);
  }

  function toggleEncerrar(plan) {
    const updated = {...plan, concluido:!plan.concluido};
    setFerias(fs=>fs.map(f=>f.id===plan.id?updated:f));
    setDetalhe(updated);
  }

  function excluir(planId) {
    setFerias(fs=>fs.filter(f=>f.id!==planId));
    setDetalhe(null);
  }

  const getOfficer = id => officers.find(o=>o.id===Number(id));
  const statusColors = {
    planejada:["#dbeafe","#1d4ed8"], concluida:["#dcfce7","#15803d"],
    suspensa:["#fee2e2","#991b1b"], em_andamento:["#fef3c7","#92400e"],
  };
  const statusOpts = [
    {v:"planejada",    l:"🟡 Planejada"},
    {v:"em_andamento", l:"🔵 Em andamento"},
    {v:"executada",    l:"✅ Executada"},
    {v:"suspensa",     l:"🔴 Suspensa"},
    {v:"concluida",    l:"⬜ Concluída"},
  ];

  const todos = ferias.filter(f=>f.tipo==="planejamento").sort((a,b)=>a.ano-b.ano||a.mes-b.mes);
  const filtrados = todos.filter(p=>{
    const matchStatus = verEncerrados ? p.concluido : !p.concluido;
    const matchBusca = !busca.trim() || p.titulo.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });
  const contFerias = p => (p.participantes||[]).filter(x=>x.tipo==="FÉRIAS").length;
  const contLic = p => (p.participantes||[]).filter(x=>x.tipo==="LICENÇA-PRÊMIO").length;

  // Ordena participantes do maior para menor grau
  const partsOrdenados = (plan) =>
    [...(plan.participantes||[])].sort((a,b)=>{
      const oa=getOfficer(a.policialId)||{}, ob=getOfficer(b.policialId)||{};
      return rankSort(oa,ob);
    });

  return (
    <div>
      {confirm && <Confirm msg={confirm.msg} onYes={()=>{confirm.action();setConfirm(null);}} onNo={()=>setConfirm(null)}/>}

      {/* Alerta de duplicata */}
      {alertaDup && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3000}}>
          <div style={{background:"#fff",borderRadius:12,padding:24,maxWidth:420,width:"90%"}}>
            <div style={{fontSize:20,marginBottom:8}}>⚠️</div>
            <div style={{fontWeight:700,fontSize:15,marginBottom:8,color:"#92400e"}}>Atenção — férias duplicadas</div>
            <p style={{fontSize:13,color:"#374151",marginBottom:16}}>
              <strong>{alertaDup.nome}</strong> já está incluído em férias de <strong>{alertaDup.planAnterior}</strong> (30 dias).
              Incluir em mais um mês ultrapassa o limite de 30 dias anuais.
            </p>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="secondary" onClick={alertaDup.onCancelar}>Cancelar</Btn>
              <Btn variant="warning" onClick={alertaDup.onContinuar}>Incluir mesmo assim</Btn>
            </div>
          </div>
        </div>
      )}

      {modalNovo && (
        <Modal title="Novo planejamento de férias" onClose={()=>setModalNovo(false)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Select label="Mês" value={formNovo.mes} onChange={e=>setFormNovo(f=>({...f,mes:Number(e.target.value)}))}>
              {MESES.map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}
            </Select>
            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:12,color:"#374151",fontWeight:500,marginBottom:4}}>Ano</label>
              <input type="number" value={formNovo.ano} onChange={e=>setFormNovo(f=>({...f,ano:Number(e.target.value)}))}
                min={2020} max={2099}
                style={{width:"100%",padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
          </div>
          <div style={{background:"#f0f4ff",borderRadius:8,padding:"10px 12px",fontSize:13,color:"#1e3a5f",marginBottom:16}}>
            📅 Período fixo: 01/{String(formNovo.mes).padStart(2,"0")}/{formNovo.ano} até 30/{String(formNovo.mes).padStart(2,"0")}/{formNovo.ano}
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setModalNovo(false)}>Cancelar</Btn>
            <Btn onClick={criarPlanejamento}>Criar planejamento</Btn>
          </div>
        </Modal>
      )}

      {/* Modal suspensão */}
      {modalSuspensao && (
        <Modal title="Suspender férias do policial" onClose={()=>setModalSuspensao(null)}>
          {(()=>{
            const o = officers.find(x=>x.id===modalSuspensao.partId);
            const plan = ferias.find(f=>f.id===modalSuspensao.planId);
            return (
              <>
                {o && <div style={{background:"#f0f4ff",borderRadius:7,padding:"8px 12px",marginBottom:12,fontSize:13}}>
                  <strong>{o.grau} {o.nome}</strong> — {plan?.titulo}
                </div>}
                <Input label="Data a partir de quando" type="date" value={formSuspensao.dataInicio} onChange={e=>setFormSuspensao(f=>({...f,dataInicio:e.target.value}))}/>
                <Textarea label="Motivo" value={formSuspensao.motivo} onChange={e=>setFormSuspensao(f=>({...f,motivo:e.target.value}))} rows={2}/>
                <Input label="Nº do BGO de publicação" value={formSuspensao.bgo} onChange={e=>setFormSuspensao(f=>({...f,bgo:e.target.value}))} placeholder="BGO Nº 001 DE 2026"/>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
                  <Btn variant="secondary" onClick={()=>setModalSuspensao(null)}>Cancelar</Btn>
                  <Btn variant="danger" onClick={()=>{
                    if (!formSuspensao.dataInicio||!formSuspensao.motivo){alert("Preencha data e motivo.");return;}
                    const updPlan = ferias.find(f=>f.id===modalSuspensao.planId);
                    if (!updPlan) return;
                    const updated = {...updPlan, participantes:(updPlan.participantes||[]).map(p=>
                      p.policialId===modalSuspensao.partId ? {...p, status:"suspensa", suspensao:{dataInicio:formSuspensao.dataInicio,motivo:formSuspensao.motivo,bgo:formSuspensao.bgo}} : p
                    )};
                    setFerias(fs=>fs.map(f=>f.id===updated.id?updated:f));
                    if (detalhe?.id===updated.id) setDetalhe(updated);
                    setModalSuspensao(null);
                    setFormSuspensao({dataInicio:"",motivo:"",bgo:""});
                  }}>🔴 Confirmar suspensão</Btn>
                </div>
              </>
            );
          })()}
        </Modal>
      )}

      {detalhe && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:1000,overflowY:"auto",padding:"24px 12px"}}>
          <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:760,overflow:"hidden"}}>
            <div style={{background:detalhe.concluido?"linear-gradient(135deg,#374151,#6b7280)":"linear-gradient(135deg,#1e3a5f,#2d5986)",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{color:"#fff",fontWeight:700,fontSize:16}}>🏖️ {detalhe.titulo}{detalhe.concluido&&<span style={{marginLeft:8,fontSize:12,background:"rgba(255,255,255,0.2)",borderRadius:6,padding:"2px 8px"}}>Encerrado</span>}</div>
                <div style={{color:"rgba(255,255,255,0.8)",fontSize:12,marginTop:2}}>
                  Dia 01 ao 30 · {contFerias(detalhe)} férias · {contLic(detalhe)} lic.-prêmio
                  {detalhe.periodoAqDe&&<span> · P.A.: {detalhe.periodoAqDe}/{detalhe.periodoAqAte}</span>}
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                <Btn small variant="secondary" onClick={()=>{
                  const partsOrd=[...(detalhe.participantes||[])].sort((a,b)=>{
                    const oa=officers.find(x=>x.id===a.policialId)||{};
                    const ob=officers.find(x=>x.id===b.policialId)||{};
                    return rankSort(oa,ob);
                  });
                  const cols=["Nº","G.H.","Nome","Matrícula","Tipo","P.A. De","P.A. Até","Início","Fim"];
                  const linhas=partsOrd.map((p,i)=>{
                    const o=officers.find(x=>x.id===p.policialId)||{};
                    return[i+1,o.grau||"",o.nome||"",cleanMat(o.matricula),p.tipo||"FÉRIAS",
                      p.periodoAqDe||detalhe.periodoAqDe||"",
                      p.periodoAqAte||detalhe.periodoAqAte||"",
                      p.dataInicio?new Date(p.dataInicio+"T12:00:00").toLocaleDateString("pt-BR"):"",
                      p.dataFim?new Date(p.dataFim+"T12:00:00").toLocaleDateString("pt-BR"):""];
                  });
                  setRelHtml(cabecalho()+tituloBloco("PLANEJAMENTO DE FÉRIAS — "+detalhe.titulo.toUpperCase())+
                    `<div style="font-size:11px;color:#555;margin-bottom:8px;font-family:Arial,sans-serif;">${partsOrd.length} policial(is)</div>`+
                    tabelaHTML(cols,linhas)+rodape(loggedUser));
                }}>📄 Imprimir plano</Btn>
                <Btn small variant={detalhe.concluido?"secondary":"success"} onClick={()=>toggleEncerrar(detalhe)}>
                  {detalhe.concluido?"↩ Reabrir":"✅ Encerrar"}
                </Btn>
                <Btn small variant="danger" onClick={()=>setConfirm({msg:"Excluir este planejamento?",action:()=>excluir(detalhe.id)})}>🗑</Btn>
                <button onClick={()=>setDetalhe(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:12}}>✕ Fechar</button>
              </div>
            </div>

            <div style={{padding:20}}>
              {/* Status do mês — altera TODOS */}
              {!detalhe.concluido && (
                <div style={{background:"#f0f4ff",borderRadius:8,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#1e3a5f",whiteSpace:"nowrap"}}>Status do mês (alterar todos):</span>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {statusOpts.map(s=>{
                      const ativo = (detalhe.statusGeral||"planejada")===s.v;
                      return (
                        <button key={s.v} onClick={()=>alterarStatusGeral(detalhe,s.v)}
                          style={{padding:"5px 12px",border:`2px solid ${ativo?"#1e3a5f":"#e5e7eb"}`,borderRadius:6,fontSize:12,cursor:"pointer",fontWeight:ativo?700:400,background:ativo?"#1e3a5f":"#fff",color:ativo?"#fff":"#374151",transition:"all 0.1s"}}>
                          {s.l}
                        </button>
                      );
                    })}
                  </div>
                  <span style={{fontSize:11,color:"#6b7280"}}>(muda o status de todos)</span>
                </div>
              )}

              {/* Período aquisitivo */}
              <div style={{background:"#f0f4ff",borderRadius:8,padding:"10px 14px",marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:600,color:"#1e3a5f",marginBottom:8}}>Período aquisitivo (todos)</div>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:12,color:"#374151"}}>De:</span>
                  <input value={detalhe.periodoAqDe||""} onChange={e=>{
                    const updated={...detalhe,periodoAqDe:e.target.value};
                    setFerias(fs=>fs.map(f=>f.id===detalhe.id?updated:f));
                    setDetalhe(updated);
                  }} style={{width:70,padding:"5px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:12,outline:"none"}} placeholder="2025"/>
                  <span style={{fontSize:12,color:"#374151"}}>Até:</span>
                  <input value={detalhe.periodoAqAte||""} onChange={e=>{
                    const updated={...detalhe,periodoAqAte:e.target.value};
                    setFerias(fs=>fs.map(f=>f.id===detalhe.id?updated:f));
                    setDetalhe(updated);
                  }} style={{width:70,padding:"5px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:12,outline:"none"}} placeholder="2026"/>
                  <span style={{fontSize:11,color:"#6b7280"}}>(edita todos os policiais do mês)</span>
                </div>
              </div>

              {!detalhe.concluido && (
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:8}}>Adicionar policial</div>
                  <BuscaPolicial officers={officers} excluirIds={(detalhe.participantes||[]).map(p=>p.policialId)} onSelect={o=>adicionarPolicial(detalhe,o)}/>
                </div>
              )}

              <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:8}}>
                Policiais ({(detalhe.participantes||[]).length}) — ordenados por grau
              </div>

              {(detalhe.participantes||[]).length===0 && (
                <div style={{textAlign:"center",padding:"24px",color:"#9ca3af",background:"#f9fafb",borderRadius:8,fontSize:13}}>
                  Nenhum policial adicionado. Use a busca acima.
                </div>
              )}

              <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:"50vh",overflowY:"auto"}}>
                {partsOrdenados(detalhe).map(p=>{
                  const o = getOfficer(p.policialId);
                  const [sbg,sfg] = statusColors[p.status]||["#f3f4f6","#374151"];
                  return (
                    <div key={p.id} style={{border:"1px solid #e5e7eb",borderRadius:9,padding:12,background:"#fff"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:600,fontSize:13}}>{o?(o.nome):"—"}</div>
                          <div style={{fontSize:11,color:"#6b7280"}}>{o?.grau} · Mat. {o?.matricula}</div>
                        </div>
                        {!detalhe.concluido && (
                          <div style={{display:"flex",gap:4}}>
                            {p.status!=="suspensa" && <button onClick={()=>{setFormSuspensao({dataInicio:"",motivo:"",bgo:""});setModalSuspensao({planId:detalhe.id,partId:p.policialId});}} style={{background:"#fee2e2",border:"none",color:"#991b1b",cursor:"pointer",borderRadius:5,padding:"3px 8px",fontSize:11,fontWeight:600}}>🔴 Suspender</button>}
                            {p.status==="suspensa" && <button onClick={()=>atualizarP(detalhe,p.id,"status","planejada")} style={{background:"#dcfce7",border:"none",color:"#15803d",cursor:"pointer",borderRadius:5,padding:"3px 8px",fontSize:11,fontWeight:600}}>↩ Reativar</button>}
                            <button onClick={()=>setConfirm({msg:`Remover ${o?o.nome:""}?`,action:()=>removerPolicial(detalhe,p.id)})} style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:16}}>✕</button>
                          </div>
                        )}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr",gap:6}}>
                        <div>
                          <label style={{fontSize:10,color:"#6b7280",display:"block",marginBottom:2}}>Tipo</label>
                          <select value={p.tipo||"FÉRIAS"} disabled={detalhe.concluido} onChange={e=>atualizarP(detalhe,p.id,"tipo",e.target.value)}
                            style={{width:"100%",padding:"5px 6px",border:"1px solid #d1d5db",borderRadius:6,fontSize:11,background:"#fff"}}>
                            <option value="FÉRIAS">🏖 FÉRIAS</option>
                            <option value="LICENÇA-PRÊMIO">🏅 LIC.-PRÊMIO</option>
                          </select>
                        </div>
                        <div>
                          <label style={{fontSize:10,color:"#6b7280",display:"block",marginBottom:2}}>Status</label>
                          <select value={p.status||"planejada"} disabled={detalhe.concluido||p.status==="suspensa"}
                            onChange={e=>atualizarP(detalhe,p.id,"status",e.target.value)}
                            style={{width:"100%",padding:"5px 6px",border:"1px solid #d1d5db",borderRadius:6,fontSize:11,
                              background:p.status==="executada"?"#dcfce7":p.status==="suspensa"?"#fee2e2":p.status==="em_andamento"?"#fef3c7":"#fff",
                              fontWeight:p.status&&p.status!=="planejada"?600:400,
                              color:p.status==="executada"?"#15803d":p.status==="suspensa"?"#991b1b":p.status==="em_andamento"?"#92400e":"#374151"}}>
                            {statusOpts.map(s=><option key={s.v} value={s.v}>{s.l}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{fontSize:10,color:"#6b7280",display:"block",marginBottom:2}}>P.A. De</label>
                          <input value={p.periodoAqDe||detalhe.periodoAqDe||""} disabled={detalhe.concluido}
                            onChange={e=>atualizarP(detalhe,p.id,"periodoAqDe",e.target.value)}
                            style={{width:"100%",padding:"5px 6px",border:"1px solid #d1d5db",borderRadius:6,fontSize:11,outline:"none"}} placeholder="2025"/>
                        </div>
                        <div>
                          <label style={{fontSize:10,color:"#6b7280",display:"block",marginBottom:2}}>P.A. Até</label>
                          <input value={p.periodoAqAte||detalhe.periodoAqAte||""} disabled={detalhe.concluido}
                            onChange={e=>atualizarP(detalhe,p.id,"periodoAqAte",e.target.value)}
                            style={{width:"100%",padding:"5px 6px",border:"1px solid #d1d5db",borderRadius:6,fontSize:11,outline:"none"}} placeholder="2026"/>
                        </div>
                        <div>
                          <label style={{fontSize:10,color:"#6b7280",display:"block",marginBottom:2}}>Início</label>
                          <input type="date" value={p.dataInicio||""} disabled={detalhe.concluido} onChange={e=>atualizarP(detalhe,p.id,"dataInicio",e.target.value)}
                            style={{width:"100%",padding:"5px 6px",border:"1px solid #d1d5db",borderRadius:6,fontSize:11,outline:"none"}}/>
                        </div>
                        <div>
                          <label style={{fontSize:10,color:"#6b7280",display:"block",marginBottom:2}}>Fim</label>
                          <input type="date" value={p.dataFim||""} disabled={detalhe.concluido} onChange={e=>atualizarP(detalhe,p.id,"dataFim",e.target.value)}
                            style={{width:"100%",padding:"5px 6px",border:"1px solid #d1d5db",borderRadius:6,fontSize:11,outline:"none"}}/>
                        </div>
                      </div>
                      {p.tipo==="LICENÇA-PRÊMIO"&&<div style={{marginTop:6,background:"#f0fdf4",borderRadius:5,padding:"4px 8px",fontSize:10,color:"#15803d"}}>ℹ️ Não entra na contagem de férias</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {relHtml && <RelModal html={relHtml} onClose={()=>setRelHtml("")}/>}

      {/* Policiais não incluídos em nenhum plano de 2026 */}
      {(() => {
        const anoVer = new Date().getFullYear();
        const planosAno = todos.filter(p=>p.ano===anoVer);
        if (planosAno.length===0) return null;
        const includedIds = new Set();
        planosAno.forEach(p=>(p.participantes||[]).forEach(x=>includedIds.add(x.policialId)));
        const ativos = officers.filter(o=>!["Transferido","Reserva/Inativo"].includes(o.situacao||"Ativo"));
        const naoPlanejados = ativos.filter(o=>!includedIds.has(o.id)).sort(rankSort);
        if (naoPlanejados.length===0) return null;
        return <AlertaBanner
          cor="#fff7ed" borda="#fed7aa" icone="📅"
          titulo={`${naoPlanejados.length} policial(is) sem férias planejadas em ${anoVer}`}
          linhas={naoPlanejados.map(o=>`${o.grau} ${o.nome} — Mat. ${cleanMat(o.matricula)}`)}
          chaveStorage="ferias_nao_planejados"
        />;
      })()}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:700,color:"#111827",margin:0}}>Férias / Licença-Prêmio</h2>
          <span style={{fontSize:12,color:"#6b7280"}}>{todos.length} planejamento(s)</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn variant="secondary" small onClick={()=>{
            // Gerar relatório consolidado de todos os planejamentos
            const MESES2=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
            const todosPlans=[...ferias].filter(f=>f.tipo==="planejamento").sort((a,b)=>a.ano-b.ano||a.mes-b.mes);
            let corpo="";
            todosPlans.forEach(plan=>{
              const partsOrd=[...(plan.participantes||[])].sort((a,b)=>{
                const oa=officers.find(x=>x.id===a.policialId)||{};
                const ob=officers.find(x=>x.id===b.policialId)||{};
                return rankSort(oa,ob);
              });
              const cols=["Nº","G.H.","Nome","Matrícula","Tipo","Início","Fim","Status"];
              const linhas=partsOrd.map((p,i)=>{
                const o=officers.find(x=>x.id===p.policialId)||{};
                const st={planejada:"Planejada",em_andamento:"Em andamento",concluida:"Concluída",suspensa:"Suspensa"};
                return[i+1,o.grau||"",o.nome||"",cleanMat(o.matricula),p.tipo||"FÉRIAS",
                  p.dataInicio?new Date(p.dataInicio+"T12:00:00").toLocaleDateString("pt-BR"):"",
                  p.dataFim?new Date(p.dataFim+"T12:00:00").toLocaleDateString("pt-BR"):"",
                  st[p.status]||p.status||"Planejada"];
              });
              corpo+=tituloBloco(`PLANEJAMENTO DE FÉRIAS — ${plan.titulo.toUpperCase()}`)+
                `<div style="font-size:11px;color:#555;margin-bottom:8px;font-family:Arial,sans-serif;">${partsOrd.length} policial(is)</div>`+
                tabelaHTML(cols,linhas);
            });
            if (!corpo) corpo="<p style='color:#666;font-style:italic'>Nenhum planejamento cadastrado.</p>";
            setRelHtml(cabecalho()+corpo+rodape(loggedUser));
          }}>📋 Todos os planos</Btn>
          <Btn onClick={()=>setModalNovo(true)}>+ Registrar férias</Btn>
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Buscar planejamento..."
          style={{flex:1,minWidth:160,padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,outline:"none"}}/>
        <div style={{display:"flex",background:"#f3f4f6",borderRadius:8,overflow:"hidden",border:"1px solid #e5e7eb"}}>
          <button onClick={()=>setVerEncerrados(false)} style={{padding:"7px 14px",border:"none",cursor:"pointer",fontSize:12,fontWeight:!verEncerrados?600:400,background:!verEncerrados?"#1e3a5f":"transparent",color:!verEncerrados?"#fff":"#374151"}}>Ativos</button>
          <button onClick={()=>setVerEncerrados(true)} style={{padding:"7px 14px",border:"none",cursor:"pointer",fontSize:12,fontWeight:verEncerrados?600:400,background:verEncerrados?"#374151":"transparent",color:verEncerrados?"#fff":"#374151"}}>Encerrados</button>
        </div>
      </div>

      {filtrados.length===0 && (
        <div style={{textAlign:"center",padding:"24px",color:"#9ca3af",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb",fontSize:13}}>
          {verEncerrados?"Nenhum planejamento encerrado.":"Nenhum planejamento ativo. Clique em '+ Registrar férias'."}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
        {filtrados.map(plan=>{
          const sg = plan.statusGeral||"planejada";
          const [sbg,sfg] = statusColors[sg]||["#f3f4f6","#374151"];
          return (
            <div key={plan.id} onClick={()=>setDetalhe(plan)}
              style={{background:plan.concluido?"#f9fafb":"#fff",border:`1px solid ${plan.concluido?"#d1d5db":"#e5e7eb"}`,borderRadius:12,padding:16,cursor:"pointer",transition:"all 0.15s",opacity:plan.concluido?0.8:1}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#3b82f6";e.currentTarget.style.boxShadow="0 4px 12px rgba(59,130,246,0.15)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=plan.concluido?"#d1d5db":"#e5e7eb";e.currentTarget.style.boxShadow="none";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <span style={{fontSize:22}}>🏖️</span>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"flex-end"}}>
                  {plan.concluido&&<Badge color="#f3f4f6" textColor="#374151">Encerrado</Badge>}
                  <Badge color={sbg} textColor={sfg}>{sg}</Badge>
                </div>
              </div>
              <div style={{fontWeight:700,fontSize:15,color:plan.concluido?"#374151":"#1e3a5f",marginBottom:2}}>{plan.titulo}</div>
              <div style={{fontSize:11,color:"#6b7280",marginBottom:8}}>Dia 01 ao dia 30</div>
              {(()=>{
                const nExec = (plan.participantes||[]).filter(p=>p.status==="executada"||p.status==="concluida").length;
                const nPlan = (plan.participantes||[]).filter(p=>p.status==="planejada"||p.status==="em_andamento").length;
                const nSusp = (plan.participantes||[]).filter(p=>p.status==="suspensa").length;
                return <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {nPlan>0&&<Badge color="#dbeafe" textColor="#1d4ed8">🟡 {nPlan} plan.</Badge>}
                  {nExec>0&&<Badge color="#dcfce7" textColor="#15803d">✅ {nExec} exec.</Badge>}
                  {nSusp>0&&<Badge color="#fee2e2" textColor="#991b1b">🔴 {nSusp} susp.</Badge>}
                  {contLic(plan)>0&&<Badge color="#d1fae5" textColor="#065f46">{contLic(plan)} lic.</Badge>}
                </div>;
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// FORMULÁRIO DE CURSO (fora de ModCursos para evitar re-mount a cada digitação)
// ──────────────────────────────────────────────
const TIPOS_CURSO_OPTS = ["CURSO DE PROMOÇÃO","CURSO DE APERFEIÇOAMENTO","CURSOS EXTRACURRICULARES"];

function FormCurso({ form, setForm, onSave, onCancel, titulo }) {
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  const isPromocao = form.tipoCurso==="CURSO DE PROMOÇÃO";
  return (
    <Modal title={titulo} onClose={onCancel}>
      <Input label="Nome do curso *" value={form.nome||""} onChange={e=>sf("nome",e.target.value)}/>
      <Select label="Tipo de curso" value={form.tipoCurso||"CURSOS EXTRACURRICULARES"} onChange={e=>sf("tipoCurso",e.target.value)}>
        {TIPOS_CURSO_OPTS.map(t=><option key={t} value={t}>{t}</option>)}
      </Select>
      {isPromocao && (
        <div style={{background:"#dbeafe",borderRadius:7,padding:"8px 12px",marginBottom:8}}>
          <div style={{fontSize:12,fontWeight:600,color:"#1d4ed8",marginBottom:6}}>🎖️ Curso de Promoção</div>
          <Select label="Próximo grau (ao concluir)" value={form.proxGrau||""} onChange={e=>sf("proxGrau",e.target.value)}>
            <option value="">Selecionar grau destino...</option>
            {RANK_ORDER.map(r=><option key={r} value={r}>{r}</option>)}
          </Select>
          <Input label="Data do BGO de publicação" type="date" value={form.dataBgoPromocao||""} onChange={e=>sf("dataBgoPromocao",e.target.value)}/>
          <Input label="A contar de (data de promoção)" type="date" value={form.dataContarPromocao||""} onChange={e=>sf("dataContarPromocao",e.target.value)}/>
          <Input label="Nº publicação (BGO)" value={form.bgo||""} onChange={e=>sf("bgo",e.target.value)} placeholder="BGO Nº 001 DE 2026"/>
        </div>
      )}
      <div style={{background:"#f0f4ff",borderRadius:7,padding:"6px 10px",fontSize:11,color:"#1e3a5f",marginBottom:8}}>
        ℹ️ As datas são opcionais.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Input label="Data início (opcional)" type="date" value={form.dataInicio||""} onChange={e=>sf("dataInicio",e.target.value)}/>
        <Input label="Data fim (opcional)" type="date" value={form.dataFim||""} onChange={e=>sf("dataFim",e.target.value)}/>
      </div>
      <Input label="Local de realização (opcional)" value={form.local||""} onChange={e=>sf("local",e.target.value)} placeholder="Ex: CFAP — Salvador"/>
      <Input label="Carga horária (h)" type="number" value={form.cargaHoraria||""} onChange={e=>sf("cargaHoraria",e.target.value)}/>
      {!isPromocao && <Input label="BGO do curso" value={form.bgo||""} onChange={e=>sf("bgo",e.target.value)} placeholder="BGO Nº 001 DE 2026"/>}
      {!isPromocao && (
        <Select label="Resultado geral do curso" value={form.resultado||""} onChange={e=>sf("resultado",e.target.value)}>
          <option value="">Em andamento</option>
          <option value="aprovado">✅ Aprovado</option>
          <option value="reprovado">❌ Reprovado</option>
          <option value="concluido">✓ Concluído</option>
        </Select>
      )}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
        <Btn variant="secondary" onClick={onCancel}>Cancelar</Btn>
        <Btn onClick={onSave}>{titulo.includes("Editar")?"Salvar":"Criar curso"}</Btn>
      </div>
    </Modal>
  );
}

function ModCursos({ officers, cursos, setCursos, loggedUser, setOfficers }) {
  const [relHtml, setRelHtml] = useState("");

  function cabecalho() {
    return `<div style="text-align:center;font-family:Arial,sans-serif;margin-bottom:18px;"><div style="font-weight:bold;font-size:12px;line-height:2.0;text-transform:uppercase;">POLÍCIA MILITAR DA BAHIA<br/>COMANDO DE POLICIAMENTO DA REGIÃO SUDOESTE<br/>77ª COMPANHIA INDEPENDENTE DE POLÍCIA MILITAR<br/>VITÓRIA DA CONQUISTA - ÁREA LESTE</div></div>`;
  }
  function rodape(lu) {
    const agora=new Date();
    const d=agora.toLocaleDateString("pt-BR"),h=agora.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
    const por=lu?`${lu.grau||""} ${lu.nome} — Mat. ${lu.matricula}`.trim():"Sistema";
    return `<div style="margin-top:24px;border-top:1px solid #ccc;padding-top:8px;font-style:italic;font-size:10px;color:#555;text-align:right;font-family:Arial,sans-serif;">Relatório emitido em ${d} às ${h} por: ${por}</div>`;
  }
  function tituloBloco(txt) {
    return `<div style="text-align:center;font-size:14px;font-weight:bold;text-transform:uppercase;border-top:2px solid #000;border-bottom:2px solid #000;padding:7px 0;margin-bottom:14px;font-family:Arial,sans-serif;">${txt}</div>`;
  }
  function tabelaHTML(cols, linhas) {
    const ths = cols.map(c=>`<th style="padding:7px 8px;border:1px solid #1e3a5f;text-align:left;font-size:11px;">${c}</th>`).join("");
    const trs = linhas.map((r,i)=>{
      const tds = r.map(v=>`<td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;">${v==null?"":v}</td>`).join("");
      return `<tr style="background:${i%2===0?"#fff":"#f9f9f9"}">${tds}</tr>`;
    }).join("");
    return `<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;margin-bottom:16px;"><thead><tr style="background:#1e3a5f;color:#fff;">${ths}</tr></thead><tbody>${trs||`<tr><td colspan="${cols.length}" style="text-align:center;padding:12px;color:#666;font-style:italic">Nenhum registro.</td></tr>`}</tbody></table>`;
  }

  const TIPOS_CURSO = ["CURSO DE PROMOÇÃO","CURSO DE APERFEIÇOAMENTO","CURSOS EXTRACURRICULARES"];
  const AVAL_OPTS = ["","APTO","INAPTO","RESTRIÇÃO"];
  const DOC_OPTS  = ["","ENVIADA","PENDENTE"];
  const TIPO_COR  = {
    "CURSO DE PROMOÇÃO":        ["#dbeafe","#1d4ed8"],
    "CURSO DE APERFEIÇOAMENTO": ["#d1fae5","#065f46"],
    "CURSOS EXTRACURRICULARES": ["#fef3c7","#92400e"],
  };
  const PROX_GRAU = {
    "Sd 2ª CL PM":"Sd 1ª CL PM","Sd 1ª CL PM":"CB PM","CB PM":"3º SGT PM","3º SGT PM":"2º SGT PM",
    "2º SGT PM":"1º SGT PM","1º SGT PM":"ST PM","ST PM":"2º TEN PM","2º TEN PM":"1º TEN PM",
    "1º TEN PM":"CAP PM","ASP PM":"2º TEN PM","CAP PM":"MAJ PM","MAJ PM":"TEN CEL PM","TEN CEL PM":"CEL PM",
  };

  const [detalhe, setDetalhe] = useState(null);
  const [modalNovo, setModalNovo] = useState(false);
  const [modalEditar, setModalEditar] = useState(null); // curso being edited
  const [formNovo, setFormNovo] = useState({nome:"",tipoCurso:"CURSOS EXTRACURRICULARES",dataInicio:"",dataFim:"",local:"",cargaHoraria:"",bgo:"",resultado:"",proxGrau:"",dataBgoPromocao:"",dataContarPromocao:""});
  const [verConcluidos, setVerConcluidos] = useState(false);
  const [busca, setBusca] = useState("");
  const [fTipo, setFTipo] = useState("todos");
  const [fDataIni, setFDataIni] = useState("");
  const [fDataFim, setFDataFim] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [relModal, setRelModal] = useState(false);
  const [relPeriodoIni, setRelPeriodoIni] = useState("");
  const [relPeriodoFim, setRelPeriodoFim] = useState("");
  const [relOfficer, setRelOfficer] = useState(null);

  function criarCurso() {
    if (!formNovo.nome.trim()) { alert("Nome do curso obrigatório."); return; }
    const novo = {...formNovo, id:Date.now(), concluido:false, participantes:[]};
    setCursos(cs=>[...cs, novo]);
    setModalNovo(false);
    setDetalhe(novo);
  }

  function salvarEdicao() {
    if (!modalEditar) return;
    const updated = {...modalEditar};
    setCursos(cs=>cs.map(c=>c.id===updated.id?updated:c));
    if (detalhe?.id===updated.id) setDetalhe(updated);
    setModalEditar(null);
  }

  function adicionarPolicial(curso, oficial) {
    const novoP = {id:Date.now(), policialId:oficial.id, aso:false, proxy:false, avalMedica:"", taf:"", documentacao:"", classificacao:""};
    const updated = {...curso, participantes:[...(curso.participantes||[]), novoP]};
    setCursos(cs=>cs.map(c=>c.id===curso.id?updated:c));
    setDetalhe(updated);
  }

  function removerPolicial(curso, partId) {
    const updated = {...curso, participantes:(curso.participantes||[]).filter(p=>p.id!==partId)};
    setCursos(cs=>cs.map(c=>c.id===curso.id?updated:c));
    setDetalhe(updated);
  }

  function atualizarP(curso, partId, campo, valor) {
    const updated = {...curso, participantes:(curso.participantes||[]).map(p=>p.id===partId?{...p,[campo]:valor}:p)};
    setCursos(cs=>cs.map(c=>c.id===curso.id?updated:c));
    setDetalhe(updated);
  }

  function atualizarCurso(curso, campo, valor) {
    const updated = {...curso, [campo]:valor};
    setCursos(cs=>cs.map(c=>c.id===curso.id?updated:c));
    setDetalhe(updated);
  }

  function concluirCurso(curso) {
    const isPromocao = curso.tipoCurso==="CURSO DE PROMOÇÃO";
    if (isPromocao && setOfficers) {
      // Promote officers automatically
      const proxGrau = curso.proxGrau;
      const policialIds = (curso.participantes||[]).map(p=>p.policialId);
      if (proxGrau && policialIds.length>0) {
        setOfficers(os=>os.map(o=>{
          if (!policialIds.includes(o.id)) return o;
          const part = (curso.participantes||[]).find(p=>p.policialId===o.id);
          const novaAnt = part?.classificacao ? Number(part.classificacao) : 9999;
          return {...o, grau:proxGrau, antiguidade:novaAnt};
        }));
      }
    }
    const updated = {...curso, concluido:true};
    setCursos(cs=>cs.map(c=>c.id===curso.id?updated:c));
    setDetalhe(updated);
  }

  function reabrirCurso(curso) {
    const updated = {...curso, concluido:false};
    setCursos(cs=>cs.map(c=>c.id===curso.id?updated:c));
    setDetalhe(updated);
  }

  function excluir(cursoId) { setCursos(cs=>cs.filter(c=>c.id!==cursoId)); setDetalhe(null); }

  const getOfficer = id => officers.find(o=>o.id===Number(id));
  const nAprov  = c => (c.participantes||[]).filter(p=>c.resultado==="aprovado"||p.resultado==="aprovado").length;
  const nAnd    = c => (c.participantes||[]).filter(p=>!p.finalizado).length;

  const partsOrdenados = curso => [...(curso.participantes||[])].sort((a,b)=>{
    // If curso de promoção, sort by classificação
    if (curso.tipoCurso==="CURSO DE PROMOÇÃO") {
      const ca = Number(a.classificacao)||9999, cb = Number(b.classificacao)||9999;
      return ca-cb;
    }
    const oa=getOfficer(a.policialId)||{}, ob=getOfficer(b.policialId)||{};
    return rankSort(oa,ob);
  });

  const todos = [...cursos].sort((a,b)=>(a.dataInicio||"zzz").localeCompare(b.dataInicio||"zzz"));
  const filtrados = todos.filter(c=>{
    if (verConcluidos ? !c.concluido : c.concluido) return false;
    if (fTipo!=="todos" && c.tipoCurso!==fTipo) return false;
    if (fDataIni && c.dataInicio && c.dataInicio < fDataIni) return false;
    if (fDataFim && c.dataInicio && c.dataInicio > fDataFim) return false;
    if (busca.trim() && !c.nome.toLowerCase().includes(busca.toLowerCase()) && !(c.local||"").toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  // ─── Modal formulário de curso (novo ou editar) ──────────────────────────
  return (
    <div>
      {relHtml && <RelModal html={relHtml} onClose={()=>setRelHtml("")}/>}
      {confirm && <Confirm msg={confirm.msg} onYes={()=>{confirm.action();setConfirm(null);}} onNo={()=>setConfirm(null)}/>}

      {/* Modal: novo curso */}
      {modalNovo && <FormCurso form={formNovo} setForm={setFormNovo} titulo="Novo curso" onSave={criarCurso} onCancel={()=>setModalNovo(false)}/>}

      {/* Modal: editar curso */}
      {modalEditar && <FormCurso form={modalEditar} setForm={setModalEditar} titulo="Editar curso" onSave={salvarEdicao} onCancel={()=>setModalEditar(null)}/>}

      {/* Relatório modais (geral/individual) */}
      {relModal && (
        <Modal title="Relatório de Cursos" onClose={()=>setRelModal(false)}>
          {relModal==="individual" && (
            <>
              <BuscaPolicial officers={officers} excluirIds={[]} onSelect={o=>setRelOfficer(o)}/>
              {relOfficer && <div style={{background:"#f0f4ff",borderRadius:7,padding:"8px 12px",fontSize:13,marginBottom:8}}><strong>{relOfficer.grau} {relOfficer.nome}</strong></div>}
            </>
          )}
          {relModal==="geral" && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Input label="Data início — De" type="date" value={relPeriodoIni} onChange={e=>setRelPeriodoIni(e.target.value)}/>
              <Input label="Data início — Até" type="date" value={relPeriodoFim} onChange={e=>setRelPeriodoFim(e.target.value)}/>
            </div>
          )}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setRelModal(false)}>Cancelar</Btn>
            <Btn onClick={()=>{
              let html="";
              if (relModal==="individual") {
                if (!relOfficer) {alert("Selecione um policial.");return;}
                const lista=[];
                cursos.forEach(curso=>{const part=(curso.participantes||[]).find(p=>p.policialId===relOfficer.id);if(part)lista.push({curso,part});});
                lista.sort((a,b)=>(a.curso.dataInicio||"").localeCompare(b.curso.dataInicio||""));
                const cols=["Data Início","Data Fim","Curso","Tipo","Local","C.H.","Resultado","BGO"];
                const rows=lista.map(({curso,part})=>[
                  curso.dataInicio?new Date(curso.dataInicio+"T12:00:00").toLocaleDateString("pt-BR"):"",
                  curso.dataFim?new Date(curso.dataFim+"T12:00:00").toLocaleDateString("pt-BR"):"",
                  curso.nome||"",curso.tipoCurso||"",curso.local||"",curso.cargaHoraria?curso.cargaHoraria+"h":"",
                  (curso.resultado||"Em andamento").toUpperCase(),curso.bgo||""
                ]);
                html=cabecalho()+tituloBloco("HISTÓRICO FUNCIONAL — CURSOS")+
                  `<div style="background:#f5f5f5;border-radius:6px;padding:8px 12px;margin-bottom:14px;font-size:11px;font-family:Arial,sans-serif;"><strong>Nome:</strong> ${relOfficer.nome}&nbsp;&nbsp;<strong>Grau:</strong> ${relOfficer.grau}&nbsp;&nbsp;<strong>Mat.:</strong> ${cleanMat(relOfficer.matricula)}</div>`+
                  tabelaHTML(cols,rows)+rodape(loggedUser);
              } else {
                const cf=cursos.filter(c=>{
                  if(relPeriodoIni&&(c.dataInicio||"")<relPeriodoIni)return false;
                  if(relPeriodoFim&&(c.dataInicio||"")>relPeriodoFim)return false;
                  return true;
                }).sort((a,b)=>(a.dataInicio||"").localeCompare(b.dataInicio||""));
                const rows=[];
                cf.forEach(curso=>{
                  partsOrdenados(curso).forEach(part=>{
                    const o=getOfficer(part.policialId)||{};
                    rows.push([curso.dataInicio?new Date(curso.dataInicio+"T12:00:00").toLocaleDateString("pt-BR"):"",curso.nome||"",curso.tipoCurso||"",curso.local||"",curso.cargaHoraria?curso.cargaHoraria+"h":"",o.grau||"",o.nome||"",cleanMat(o.matricula)||"",(curso.resultado||"Em andamento").toUpperCase(),curso.bgo||""]);
                  });
                });
                const cols=["Data","Curso","Tipo","Local","C.H.","G.H.","Nome","Matrícula","Resultado","BGO"];
                html=cabecalho()+tituloBloco("CURSOS")+tabelaHTML(cols,rows)+rodape(loggedUser);
              }
              setRelHtml(html);setRelModal(false);setRelOfficer(null);
            }}>📄 Gerar relatório</Btn>
          </div>
        </Modal>
      )}

      {/* Detalhe do curso */}
      {detalhe && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:1000,overflowY:"auto",padding:"24px 12px"}}>
          <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:1050,overflow:"hidden"}}>
            {/* Header */}
            <div style={{background:detalhe.concluido?"linear-gradient(135deg,#374151,#6b7280)":"linear-gradient(135deg,#1e3a5f,#2d5986)",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{color:"#fff",fontWeight:700,fontSize:15}}>🎓 {detalhe.nome}{detalhe.concluido&&<span style={{marginLeft:8,fontSize:11,background:"rgba(255,255,255,0.2)",borderRadius:5,padding:"2px 7px"}}>Concluído</span>}</div>
                <div style={{color:"rgba(255,255,255,0.8)",fontSize:11,marginTop:2}}>
                  {detalhe.tipoCurso||""}
                  {detalhe.dataInicio?" · "+fmtDate(detalhe.dataInicio)+(detalhe.dataFim?" → "+fmtDate(detalhe.dataFim):""):" · Data a definir"}
                  {detalhe.local?" · "+detalhe.local:""}{detalhe.cargaHoraria?" · "+detalhe.cargaHoraria+"h":""}
                  {detalhe.bgo?" · "+detalhe.bgo:""}
                </div>
                {detalhe.resultado&&<div style={{color:"#86efac",fontSize:11,marginTop:2,fontWeight:600}}>Resultado: {detalhe.resultado.toUpperCase()}</div>}
                {detalhe.tipoCurso==="CURSO DE PROMOÇÃO"&&detalhe.proxGrau&&<div style={{color:"#fbbf24",fontSize:11,marginTop:2}}>🎖️ Promoção para: {detalhe.proxGrau}{detalhe.dataContarPromocao?" a contar de "+fmtDate(detalhe.dataContarPromocao):""}</div>}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                <Btn small variant="secondary" onClick={()=>setModalEditar({...detalhe})}>✏️ Editar</Btn>
                {!detalhe.concluido
                  ? <Btn small variant="success" onClick={()=>setConfirm({
                      msg:detalhe.tipoCurso==="CURSO DE PROMOÇÃO"
                        ?`Concluir o curso e PROMOVER automaticamente ${(detalhe.participantes||[]).length} policial(is) para ${detalhe.proxGrau||"grau definido"}?`
                        :"Concluir o curso?",
                      action:()=>concluirCurso(detalhe)
                    })}>✅ Concluir curso</Btn>
                  : <Btn small variant="secondary" onClick={()=>reabrirCurso(detalhe)}>↩ Reabrir</Btn>
                }
                <Btn small variant="danger" onClick={()=>setConfirm({msg:"Excluir este curso?",action:()=>excluir(detalhe.id)})}>🗑</Btn>
                <button onClick={()=>setDetalhe(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:12}}>✕</button>
              </div>
            </div>

            <div style={{padding:20}}>
              {/* Resumo */}
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                <Badge color="#dbeafe" textColor="#1d4ed8">{(detalhe.participantes||[]).length} participantes</Badge>
                {detalhe.resultado&&<Badge color="#dcfce7" textColor="#15803d">{detalhe.resultado.toUpperCase()}</Badge>}
              </div>

              {/* Busca */}
              {!detalhe.concluido && (
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Adicionar participante</div>
                  <BuscaPolicial officers={officers} excluirIds={(detalhe.participantes||[]).map(p=>p.policialId)} onSelect={o=>adicionarPolicial(detalhe,o)}/>
                </div>
              )}

              {/* Tabela de participantes tipo planilha */}
              {(detalhe.participantes||[]).length>0 && (
                <div style={{overflowX:"auto",maxHeight:"55vh",overflowY:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead>
                      <tr style={{background:"#f8faff",borderBottom:"2px solid #e5e7eb",position:"sticky",top:0}}>
                        <th style={{padding:"8px 10px",textAlign:"left",fontWeight:600,color:"#374151",minWidth:180,whiteSpace:"nowrap"}}>Policial</th>
                        {detalhe.tipoCurso==="CURSO DE PROMOÇÃO"&&<th style={{padding:"8px 8px",textAlign:"center",fontWeight:600,color:"#374151",minWidth:70}}>Classif.</th>}
                        <th style={{padding:"8px 8px",textAlign:"center",fontWeight:600,color:"#374151",minWidth:55}}>ASO</th>
                        <th style={{padding:"8px 8px",textAlign:"center",fontWeight:600,color:"#374151",minWidth:65}}>PROXY</th>
                        <th style={{padding:"8px 8px",textAlign:"center",fontWeight:600,color:"#374151",minWidth:110}}>AVAL. MÉDICA</th>
                        <th style={{padding:"8px 8px",textAlign:"center",fontWeight:600,color:"#374151",minWidth:100}}>TAF</th>
                        <th style={{padding:"8px 8px",textAlign:"center",fontWeight:600,color:"#374151",minWidth:110}}>DOCUMENTAÇÃO</th>
                        {!detalhe.concluido&&<th style={{padding:"8px 8px",textAlign:"center",fontWeight:600,color:"#374151",minWidth:40}}></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {partsOrdenados(detalhe).map((p,i)=>{
                        const o = getOfficer(p.policialId);
                        const rowBg = i%2===0?"#fff":"#f9fafb";
                        const selStyle = (val,apto,inap,rest) => ({
                          padding:"4px 6px",border:`1px solid ${val===apto?"#86efac":val===inap?"#fca5a5":val===rest?"#fcd34d":"#e5e7eb"}`,
                          borderRadius:5,fontSize:11,background:"#fff",fontWeight:val?600:400,
                          color:val===apto?"#15803d":val===inap?"#991b1b":val===rest?"#92400e":"#374151",
                          width:"100%"
                        });
                        return (
                          <tr key={p.id} style={{background:rowBg,borderBottom:"1px solid #f0f0f0"}}>
                            <td style={{padding:"7px 10px",fontWeight:500,color:"#111827"}}>
                              <div>{o?(o.nomeGuerra||o.nome):"—"}</div>
                              <div style={{fontSize:10,color:"#6b7280"}}>{o?.grau} · {cleanMat(o?.matricula)}</div>
                            </td>
                            {detalhe.tipoCurso==="CURSO DE PROMOÇÃO"&&(
                              <td style={{padding:"7px 8px",textAlign:"center"}}>
                                <input value={p.classificacao||""} onChange={e=>atualizarP(detalhe,p.id,"classificacao",e.target.value)}
                                  placeholder="Nº" style={{width:50,padding:"3px 5px",border:"1px solid #d1d5db",borderRadius:5,fontSize:11,textAlign:"center",outline:"none"}}/>
                              </td>
                            )}
                            <td style={{padding:"7px 8px",textAlign:"center"}}>
                              <input type="checkbox" checked={!!p.aso} onChange={e=>atualizarP(detalhe,p.id,"aso",e.target.checked)} style={{accentColor:"#1e3a5f",width:16,height:16,cursor:"pointer"}}/>
                            </td>
                            <td style={{padding:"7px 8px",textAlign:"center"}}>
                              <input type="checkbox" checked={!!p.proxy} onChange={e=>atualizarP(detalhe,p.id,"proxy",e.target.checked)} style={{accentColor:"#1e3a5f",width:16,height:16,cursor:"pointer"}}/>
                            </td>
                            <td style={{padding:"7px 8px"}}>
                              <select value={p.avalMedica||""} onChange={e=>atualizarP(detalhe,p.id,"avalMedica",e.target.value)} style={selStyle(p.avalMedica,"APTO","INAPTO","RESTRIÇÃO")}>
                                {AVAL_OPTS.map(v=><option key={v} value={v}>{v||"—"}</option>)}
                              </select>
                            </td>
                            <td style={{padding:"7px 8px"}}>
                              <select value={p.taf||""} onChange={e=>atualizarP(detalhe,p.id,"taf",e.target.value)} style={selStyle(p.taf,"APTO","INAPTO","RESTRIÇÃO")}>
                                {AVAL_OPTS.map(v=><option key={v} value={v}>{v||"—"}</option>)}
                              </select>
                            </td>
                            <td style={{padding:"7px 8px"}}>
                              <select value={p.documentacao||""} onChange={e=>atualizarP(detalhe,p.id,"documentacao",e.target.value)} style={selStyle(p.documentacao,"ENVIADA","PENDENTE","")}>
                                {DOC_OPTS.map(v=><option key={v} value={v}>{v||"—"}</option>)}
                              </select>
                            </td>
                            {!detalhe.concluido&&(
                              <td style={{padding:"7px 8px",textAlign:"center"}}>
                                <button onClick={()=>setConfirm({msg:`Remover ${o?o.nome:""}?`,action:()=>removerPolicial(detalhe,p.id)})}
                                  style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:15}}>✕</button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {(detalhe.participantes||[]).length===0 && (
                <div style={{textAlign:"center",padding:"24px",color:"#9ca3af",background:"#f9fafb",borderRadius:8,fontSize:13}}>
                  Nenhum participante. Use a busca acima.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho + filtros */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:700,color:"#111827",margin:0}}>Cursos</h2>
          <span style={{fontSize:12,color:"#6b7280"}}>{todos.length} curso(s)</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn variant="secondary" small onClick={()=>{setRelPeriodoIni("");setRelPeriodoFim("");setRelOfficer(null);setRelModal("geral");}}>📋 Rel. geral</Btn>
          <Btn variant="secondary" small onClick={()=>{setRelOfficer(null);setRelModal("individual");}}>👤 Rel. individual</Btn>
          <Btn onClick={()=>{setFormNovo({nome:"",tipoCurso:"CURSOS EXTRACURRICULARES",dataInicio:"",dataFim:"",local:"",cargaHoraria:"",bgo:"",resultado:"",proxGrau:"",dataBgoPromocao:"",dataContarPromocao:""});setModalNovo(true);}}>+ Novo curso</Btn>
        </div>
      </div>

      <Card style={{marginBottom:12,padding:12}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Buscar por nome ou local..."
            style={{flex:1,minWidth:160,padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,outline:"none"}}/>
          <select value={fTipo} onChange={e=>setFTipo(e.target.value)} style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#fff"}}>
            <option value="todos">Todos os tipos</option>
            {TIPOS_CURSO.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontSize:11,color:"#6b7280",whiteSpace:"nowrap"}}>Data:</span>
            <input type="date" value={fDataIni} onChange={e=>setFDataIni(e.target.value)} style={{padding:"6px 8px",border:"1px solid #d1d5db",borderRadius:7,fontSize:11,outline:"none"}}/>
            <span style={{fontSize:11,color:"#6b7280"}}>→</span>
            <input type="date" value={fDataFim} onChange={e=>setFDataFim(e.target.value)} style={{padding:"6px 8px",border:"1px solid #d1d5db",borderRadius:7,fontSize:11,outline:"none"}}/>
          </div>
          {(fTipo!=="todos"||fDataIni||fDataFim)&&<button onClick={()=>{setFTipo("todos");setFDataIni("");setFDataFim("");}} style={{padding:"6px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:11,background:"#f9fafb",cursor:"pointer",color:"#6b7280"}}>✕</button>}
          <div style={{display:"flex",background:"#f3f4f6",borderRadius:8,overflow:"hidden",border:"1px solid #e5e7eb"}}>
            <button onClick={()=>setVerConcluidos(false)} style={{padding:"7px 14px",border:"none",cursor:"pointer",fontSize:12,fontWeight:!verConcluidos?600:400,background:!verConcluidos?"#1e3a5f":"transparent",color:!verConcluidos?"#fff":"#374151"}}>Em andamento</button>
            <button onClick={()=>setVerConcluidos(true)} style={{padding:"7px 14px",border:"none",cursor:"pointer",fontSize:12,fontWeight:verConcluidos?600:400,background:verConcluidos?"#374151":"transparent",color:verConcluidos?"#fff":"#374151"}}>Concluídos</button>
          </div>
        </div>
      </Card>

      {filtrados.length===0&&(
        <div style={{textAlign:"center",padding:"24px",color:"#9ca3af",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb",fontSize:13}}>
          {verConcluidos?"Nenhum curso concluído.":"Nenhum curso em andamento. Clique em '+ Novo curso'."}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
        {filtrados.map(c=>{
          const [bg,fg]=TIPO_COR[c.tipoCurso]||["#f3f4f6","#374151"];
          return (
            <div key={c.id} onClick={()=>setDetalhe(c)}
              style={{background:c.concluido?"#f9fafb":"#fff",border:`1px solid ${c.concluido?"#d1d5db":"#e5e7eb"}`,borderRadius:12,padding:16,cursor:"pointer",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#3b82f6";e.currentTarget.style.boxShadow="0 4px 12px rgba(59,130,246,0.15)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=c.concluido?"#d1d5db":"#e5e7eb";e.currentTarget.style.boxShadow="none";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <span style={{fontSize:20}}>{c.tipoCurso==="CURSO DE PROMOÇÃO"?"🎖️":"🎓"}</span>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"flex-end"}}>
                  {c.concluido&&<Badge color="#f3f4f6" textColor="#374151" size={10}>Concluído</Badge>}
                  {c.tipoCurso&&<Badge color={bg} textColor={fg} size={10}>{c.tipoCurso}</Badge>}
                </div>
              </div>
              <div style={{fontWeight:700,fontSize:13,color:c.concluido?"#374151":"#1e3a5f",marginBottom:2}}>{c.nome}</div>
              {(c.dataInicio||c.dataFim)
                ?<div style={{fontSize:11,color:"#6b7280",marginBottom:3}}>{fmtDate(c.dataInicio)||"Sem data"}{c.dataFim?" → "+fmtDate(c.dataFim):""}</div>
                :<div style={{fontSize:11,color:"#9ca3af",marginBottom:3,fontStyle:"italic"}}>Data a definir</div>
              }
              {c.local&&<div style={{fontSize:11,color:"#6b7280",marginBottom:2}}>📍 {c.local}</div>}
              {c.cargaHoraria&&<div style={{fontSize:11,color:"#6b7280"}}>⏱ {c.cargaHoraria}h</div>}
              {c.resultado&&<div style={{fontSize:11,fontWeight:600,color:"#15803d",marginTop:4}}>✓ {c.resultado.toUpperCase()}</div>}
              {c.tipoCurso==="CURSO DE PROMOÇÃO"&&c.proxGrau&&<div style={{fontSize:11,color:"#1d4ed8",marginTop:2}}>🎖️ → {c.proxGrau}</div>}
              <div style={{fontSize:10,color:"#9ca3af",marginTop:6}}>{(c.participantes||[]).length} participante(s)</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModSaude({ officers, afastamentos, setAfastamentos, setOfficers, loggedUser }) {
  const hoje = new Date();
  const todayStr = hoje.toISOString().slice(0,10);

  // Auto-concluir atestados passados
  const afastamentosCorrigidos = useMemo(()=>
    afastamentos.map(a=>{
      if (a.tipo==='Atestado' && !a.concluido && a.dataFim && a.dataFim < todayStr)
        return {...a, concluido:true};
      return a;
    })
  ,[afastamentos, todayStr]);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    policialId:"", tipo:"Atestado",
    dataInicio:"", aContarDe:"", afastamento:"", dataFim:"",
    novaInspDia:"", parecer:"", restricao:"",
    cid:"", medico:"", hospital:"", crm:"",
    descricao:"", concluido:false,
    // Núpcias
    dataCasamento:"", nomeConjuge:"",
    // Maternidade
    nomeFilho:"", dataNascFilho:"", certidaoNasc:"", cpfFilho:"",
    // Luto
    parentesco:"", nomeFalecido:"", dataObito:"", registroObito:"",
  });
  const [fBusca, setFBusca] = useState("");
  const [fTipo, setFTipo] = useState("todos");
  const [fGrau, setFGrau] = useState("todos");
  const [verConcluidos, setVerConcluidos] = useState(false);
  const [relHtml, setRelHtml] = useState("");
  const [modalRelSaude, setModalRelSaude] = useState(false);
  const [relOfficer, setRelOfficer] = useState(null);
  const TIPOS_SAUDE_REL = ["Junta Médica","Atestado","Restrição Médica","Licença Maternidade","Licença Paternidade","Licença Prêmio","Luto","Núpcias"];
  const [relSaudeConfig, setRelSaudeConfig] = useState({tipos:["Junta Médica","Atestado","Restrição Médica"],apenasAtivos:true,ini:"",fim:""});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));


  // ── Helpers de relatório (padrão A4) ─────────────────────────────────────
  // CSS padrão A4 para relatórios
  const REL_CSS = [
    "<style>",
    "@page{size:A4;margin:25mm 30mm 25mm 30mm;}",
    "body{font-family:Arial,sans-serif;font-size:12px;margin:0;padding:0;color:#111;}",
    ".cab{text-align:center;font-weight:bold;font-size:11px;line-height:1.9;text-transform:uppercase;margin-bottom:12px;}",
    ".tit{text-align:center;font-size:13px;font-weight:bold;text-transform:uppercase;border-top:2px solid #000;border-bottom:2px solid #000;padding:7px 0;margin-bottom:16px;}",
    ".sec{background:#1e3a5f;color:#fff;padding:5px 10px;font-weight:bold;font-size:11px;margin:14px 0 6px;}",
    "table{width:100%;border-collapse:collapse;font-size:11px;}",
    "th{background:#f0f4ff;padding:5px 8px;text-align:left;border:1px solid #ccc;font-weight:600;}",
    "td{padding:4px 8px;border:1px solid #ddd;vertical-align:top;}",
    "tr:nth-child(even) td{background:#f9f9f9;}",
    ".rod{margin-top:30px;border-top:1px solid #ccc;padding-top:6px;font-size:10px;color:#555;font-style:italic;}",
    "</style>"
  ].join("");

  function relCab(titulo) {
    return "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>" + titulo + "</title>"
      + REL_CSS + "</head><body>"
      + "<div class=\"cab\">POLÍCIA MILITAR DA BAHIA<br>COMANDO DE POLICIAMENTO DA REGIÃO SUDOESTE<br>77ª COMPANHIA INDEPENDENTE DE POLÍCIA MILITAR</div>"
      + "<div class=\"tit\">" + titulo + "</div>";
  }
  function relRod() {
    const agora = new Date();
    const emit = loggedUser ? ((loggedUser.grau||"")+" "+(loggedUser.nome||"")+", Matrícula "+cleanMat(loggedUser.matricula||"")) : "Sistema";
    const dataHora = agora.toLocaleDateString("pt-BR") + " às " + agora.toLocaleTimeString("pt-BR");
    return "<div class=\"rod\">Relatório emitido por " + emit + " em " + dataHora + " — SiRH77</div></body></html>";
  }
  function relImprimir(html) {
    const blob = new Blob([html],{type:"text/html;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const w = window.open(url,"_blank");
    if(w) w.addEventListener("load",()=>{ setTimeout(()=>{ w.print(); URL.revokeObjectURL(url); },400); });
  }

  function gerarRelSaude(modo, officerFiltro) {
    // Filtros vêm do modal: relSaudeConfig = {tipos:[], ativo:bool, ini:"", fim:""}
    const cfg = relSaudeConfig;
    const tipos = cfg.tipos.length>0 ? cfg.tipos : ["Junta Médica","Atestado","Restrição Médica","Licença Maternidade","Licença Paternidade","Licença Prêmio","Luto","Núpcias"];
    const getO = id => officers.find(o=>o.id===id);

    let lista = [...afastamentosCorrigidos].filter(a=>{
      if (!tipos.includes(a.tipo)) return false;
      if (cfg.apenasAtivos && a.concluido) return false;
      if (officerFiltro && a.policialId!==officerFiltro.id) return false;
      // Filtro por período: a.dataInicio dentro do intervalo
      if (cfg.ini && a.dataInicio && a.dataInicio < cfg.ini) return false;
      if (cfg.fim && a.dataInicio && a.dataInicio > cfg.fim) return false;
      return true;
    }).sort((a,b)=>(a.dataInicio||"").localeCompare(b.dataInicio||""));

    const titulo = officerFiltro
      ? `RELATÓRIO DE SAÚDE — ${officerFiltro.grau} ${officerFiltro.nome}`
      : (cfg.apenasAtivos ? "RELATÓRIO DE AFASTAMENTOS ATIVOS" : "RELATÓRIO GERAL DE SAÚDE / AFASTAMENTOS");

    let html = relCab(titulo);
    const periodo = cfg.ini||cfg.fim ? `Período: ${cfg.ini?new Date(cfg.ini+"T12:00:00").toLocaleDateString("pt-BR"):"início"} a ${cfg.fim?new Date(cfg.fim+"T12:00:00").toLocaleDateString("pt-BR"):"hoje"}` : "Todos os registros";
    html += `<p style="font-size:11px;color:#555;margin-bottom:12px;">${periodo} — ${lista.length} registro(s)</p>`;

    for (const tipo of tipos) {
      const grupo = lista.filter(a=>a.tipo===tipo).sort((a,b)=>(a.dataInicio||"").localeCompare(b.dataInicio||""));
      if (!grupo.length) continue;
      html += `<div class="sec">${tipo} (${grupo.length})</div>`;
      html += `<table><thead><tr><th>Grau / Nome</th><th>Matrícula</th><th>Início</th><th>Fim / Previsão</th><th>Situação</th><th>Observação</th></tr></thead><tbody>`;
      grupo.forEach(a=>{
        const o=getO(a.policialId);
        const fim = a.dataFim ? new Date(a.dataFim+"T12:00:00").toLocaleDateString("pt-BR") : a.novaInspDia ? `Próx. JMS: ${new Date(a.novaInspDia+"T12:00:00").toLocaleDateString("pt-BR")}` : "Em aberto";
        html += `<tr><td>${o?`${o.grau} ${o.nome}`:"—"}</td><td>${o?o.matricula:"—"}</td><td>${a.dataInicio?new Date(a.dataInicio+"T12:00:00").toLocaleDateString("pt-BR"):"—"}</td><td>${fim}</td><td>${a.concluido?"Concluído":"Ativo"}</td><td>${a.parecer||a.cid||a.restricao||a.descricao||"—"}</td></tr>`;
      });
      html += `</tbody></table>`;
    }
    if (lista.length===0) html += `<p style="font-size:12px;color:#555;text-align:center;padding:20px;">Nenhum registro encontrado para os filtros selecionados.</p>`;
    html += relRod();
    setRelHtml(html);
    setModalRelSaude(false);
    setRelOfficer(null);
  }


  // Prazos automáticos por tipo
  const PRAZOS = {
    "Núpcias":8, "Luto":8, "Licença Paternidade":5, "Licença Maternidade":180,
    "Junta Médica":180
  };

  function calcDataFim(tipo, dataInicio, dias) {
    if (!dataInicio) return "";
    const prazo = dias || PRAZOS[tipo];
    if (!prazo) return "";
    const d = new Date(dataInicio+"T12:00:00");
    d.setDate(d.getDate() + Number(prazo));
    return d.toISOString().slice(0,10);
  }

  function onChangeTipo(tipo) {
    const prazo = PRAZOS[tipo];
    set("tipo", tipo);
    if (prazo && form.dataInicio) {
      set("dataFim", calcDataFim(tipo, form.dataInicio, prazo));
    }
    if (tipo==="Junta Médica" && form.aContarDe) {
      set("novaInspDia", calcDataFim(tipo, form.aContarDe, form.afastamento||180));
    }
  }

  function onChangeDataInicio(v) {
    set("dataInicio", v);
    const prazo = PRAZOS[form.tipo];
    if (prazo) set("dataFim", calcDataFim(form.tipo, v, prazo));
    if (form.tipo==="Junta Médica") set("aContarDe", v);
  }

  function onChangeAfastamento(v) {
    set("afastamento", v);
    if (form.tipo==="Junta Médica" && form.aContarDe)
      set("novaInspDia", calcDataFim("Junta Médica", form.aContarDe, v));
  }

  function save() {
    if (!form.policialId||!form.dataInicio) { alert("Policial e data são obrigatórios."); return; }
    const newA = {...form, id:modal?.edit?.id||Date.now(), policialId:Number(form.policialId)};
    if (form.tipo==="Junta Médica" && form.aContarDe && form.afastamento)
      newA.novaInspDia = calcDataFim("Junta Médica", form.aContarDe, form.afastamento);
    if (modal?.edit) {
      setAfastamentos(as=>as.map(a=>a.id===modal.edit.id?newA:a));
    } else {
      setAfastamentos(as=>[...as, newA]);
      if (!newA.concluido) {
        const sit = {
          "Atestado":"Atestado","Junta Médica":"Junta Médica",
          "Licença Maternidade":"Licença Maternidade","Licença Paternidade":"Licença Paternidade",
          "Restrição Médica":"Atestado","Núpcias":"Ativo","Luto":"Ativo",
        }[newA.tipo]||"Atestado";
        setOfficers(os=>os.map(o=>o.id===newA.policialId?{...o,situacao:sit}:o));
      }
    }
    setModal(null);
  }

  const getOfficer = id => officers.find(o=>o.id===Number(id));

  const filtrados = [...afastamentosCorrigidos].filter(a=>{
    if (verConcluidos ? !a.concluido : a.concluido) return false;
    if (fTipo!=="todos" && a.tipo!==fTipo) return false;
    if (fGrau!=="todos") { const o=getOfficer(a.policialId); if (!o||o.grau!==fGrau) return false; }
    if (fBusca.trim()) {
      const o=getOfficer(a.policialId); const q=fBusca.toLowerCase();
      if (!((o?.nome||"").toLowerCase().includes(q)||(o?.matricula||"").toLowerCase().includes(q))) return false;
    }
    return true;
  }).sort((a,b)=>(b.dataInicio||"").localeCompare(a.dataInicio||""));

  const PARECER_COR = {
    "INAPTO PARA O SERVIÇO PM":   ["#fee2e2","#991b1b","🔴"],
    "APTO PARA O SERVIÇO ADM":    ["#dbeafe","#1d4ed8","🔵"],
    "APTO PARA O SERVIÇO PM":     ["#dcfce7","#15803d","🟢"],
  };
  const tipoCores = {
    Atestado:["#fef3c7","#92400e"],
    "Junta Médica":["#fee2e2","#991b1b"],
    "Licença Maternidade":["#fce7f3","#9d174d"],
    "Licença Paternidade":["#ede9fe","#5b21b6"],
    "Restrição Médica":["#fff7ed","#c2410c"],
    "Núpcias":["#fdf2f8","#9d174d"],
    "Luto":["#f3f4f6","#374151"],
  };

  // ─── JMS: alerta 15 dias ────────────────────────────────────────────
  const jmsAlerta = afastamentosCorrigidos.filter(a=>{
    if (a.tipo!=="Junta Médica"||a.concluido||!a.novaInspDia) return false;
    const diff=(new Date(a.novaInspDia+"T12:00:00")-hoje)/(24*3600*1000);
    return diff>=0&&diff<=15;
  });

  return (
    <div>
      {modal && (
        <Modal title={modal.edit?"Editar registro":"Novo registro de saúde"} onClose={()=>setModal(null)} wide>
          {!form.policialId ? (
            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:12,color:"#374151",fontWeight:500,marginBottom:4}}>Policial *</label>
              <BuscaPolicial officers={officers} excluirIds={[]} onSelect={o=>set("policialId",o.id)}/>
            </div>
          ) : (
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#f0f4ff",borderRadius:8,marginBottom:12}}>
              <Avatar name={officers.find(o=>o.id===Number(form.policialId))?.nome||""} size={30}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500}}>{officers.find(o=>o.id===Number(form.policialId))?.nome}</div>
                <div style={{fontSize:11,color:"#6b7280"}}>{officers.find(o=>o.id===Number(form.policialId))?.grau}</div>
              </div>
              <button onClick={()=>set("policialId","")} style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:13}}>Trocar</button>
            </div>
          )}

          <Select label="Tipo de afastamento" value={form.tipo} onChange={e=>onChangeTipo(e.target.value)}>
            {["Atestado","Junta Médica","Licença Maternidade","Licença Paternidade","Restrição Médica","Núpcias","Luto"].map(t=><option key={t} value={t}>{t}</option>)}
          </Select>

          {/* Campos comuns */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label={form.tipo==="Junta Médica"?"Data da inspeção":"Data início"} type="date" value={form.dataInicio} onChange={e=>onChangeDataInicio(e.target.value)}/>
            {form.tipo==="Junta Médica"
              ? <Input label="A contar de" type="date" value={form.aContarDe||""} onChange={e=>{set("aContarDe",e.target.value);set("novaInspDia",calcDataFim("Junta Médica",e.target.value,form.afastamento||180));}}/>
              : <Input label={`Data fim${PRAZOS[form.tipo]?" (automático: "+PRAZOS[form.tipo]+" dias)":""}` } type="date" value={form.dataFim||""} onChange={e=>set("dataFim",e.target.value)}/>
            }
          </div>

          {/* Campos específicos Junta Médica */}
          {form.tipo==="Junta Médica" && (
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Input label="Dias de afastamento" type="number" value={form.afastamento||""} onChange={e=>onChangeAfastamento(e.target.value)}/>
                <Input label="Nova inspeção (automático)" type="date" value={form.novaInspDia||""} onChange={e=>set("novaInspDia",e.target.value)}/>
              </div>
              <Select label="Parecer médico" value={form.parecer||""} onChange={e=>set("parecer",e.target.value)}>
                <option value="">Selecionar...</option>
                <option value="INAPTO PARA O SERVIÇO PM">🔴 INAPTO PARA O SERVIÇO PM</option>
                <option value="APTO PARA O SERVIÇO ADM">🔵 APTO PARA O SERVIÇO ADM</option>
                <option value="APTO PARA O SERVIÇO PM">🟢 APTO PARA O SERVIÇO PM</option>
              </Select>
              <Textarea label="Restrições" value={form.restricao||""} onChange={e=>set("restricao",e.target.value)} rows={2}/>
            </>
          )}

          {/* Campos específicos Atestado */}
          {form.tipo==="Atestado" && (
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Input label="CID" value={form.cid||""} onChange={e=>set("cid",e.target.value)} placeholder="Ex: M54.5"/>
                <Input label="Dias" type="number" value={form.dias||""} onChange={e=>{set("dias",e.target.value);set("dataFim",calcDataFim("Atestado",form.dataInicio,e.target.value));}}/>
              </div>
              <Input label="Nome do médico" value={form.medico||""} onChange={e=>set("medico",e.target.value)}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Input label="Hospital/Unidade" value={form.hospital||""} onChange={e=>set("hospital",e.target.value)}/>
                <Input label="CRM/CRO" value={form.crm||""} onChange={e=>set("crm",e.target.value)}/>
              </div>
            </>
          )}

          {/* Restrição Médica */}
          {form.tipo==="Restrição Médica" && (
            <>
              <Input label="Data fim da restrição" type="date" value={form.dataFim||""} onChange={e=>set("dataFim",e.target.value)}/>
              <Textarea label="Descrição da restrição" value={form.restricao||""} onChange={e=>set("restricao",e.target.value)} rows={2}/>
            </>
          )}

          {/* Núpcias */}
          {form.tipo==="Núpcias" && (
            <>
              <div style={{background:"#f0fdf4",borderRadius:7,padding:"6px 10px",fontSize:11,color:"#15803d",marginBottom:8}}>ℹ️ Prazo automático: 8 dias</div>
              <Input label="Data do casamento" type="date" value={form.dataCasamento||""} onChange={e=>set("dataCasamento",e.target.value)}/>
              <Input label="Nome do cônjuge (opcional)" value={form.nomeConjuge||""} onChange={e=>set("nomeConjuge",e.target.value)}/>
            </>
          )}

          {/* Licença Maternidade */}
          {form.tipo==="Licença Maternidade" && (
            <>
              <div style={{background:"#fdf2f8",borderRadius:7,padding:"6px 10px",fontSize:11,color:"#9d174d",marginBottom:8}}>ℹ️ Prazo automático: 180 dias</div>
              <Input label="Nome do filho" value={form.nomeFilho||""} onChange={e=>set("nomeFilho",e.target.value)}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Input label="Data de nascimento" type="date" value={form.dataNascFilho||""} onChange={e=>set("dataNascFilho",e.target.value)}/>
                <Input label="CPF do filho (se houver)" value={form.cpfFilho||""} onChange={e=>set("cpfFilho",e.target.value)}/>
              </div>
              <Input label="Nº Certidão de Nascimento" value={form.certidaoNasc||""} onChange={e=>set("certidaoNasc",e.target.value)}/>
            </>
          )}

          {/* Licença Paternidade */}
          {form.tipo==="Licença Paternidade" && (
            <div style={{background:"#ede9fe",borderRadius:7,padding:"6px 10px",fontSize:11,color:"#5b21b6",marginBottom:8}}>ℹ️ Prazo automático: 5 dias</div>
          )}

          {/* Luto */}
          {form.tipo==="Luto" && (
            <>
              <div style={{background:"#f3f4f6",borderRadius:7,padding:"6px 10px",fontSize:11,color:"#374151",marginBottom:8}}>ℹ️ Prazo automático: 8 dias</div>
              <Select label="Parentesco" value={form.parentesco||""} onChange={e=>set("parentesco",e.target.value)}>
                <option value="">Selecionar...</option>
                {["Cônjuge/Companheiro(a)","Pai","Mãe","Filho(a)","Irmão/Irmã","Sogro(a)","Avô/Avó"].map(p=><option key={p} value={p}>{p}</option>)}
              </Select>
              <Input label="Nome do falecido" value={form.nomeFalecido||""} onChange={e=>set("nomeFalecido",e.target.value)}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Input label="Data do óbito" type="date" value={form.dataObito||""} onChange={e=>set("dataObito",e.target.value)}/>
                <Input label="Nº Registro de óbito" value={form.registroObito||""} onChange={e=>set("registroObito",e.target.value)}/>
              </div>
            </>
          )}

          <Textarea label="Observação/Descrição" value={form.descricao||""} onChange={e=>set("descricao",e.target.value)} rows={2}/>

          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <input type="checkbox" id="conc_chk" checked={!!form.concluido} onChange={e=>set("concluido",e.target.checked)}/>
            <label htmlFor="conc_chk" style={{fontSize:13,color:"#374151",cursor:"pointer"}}>Marcar como concluído</label>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setModal(null)}>Cancelar</Btn>
            <Btn onClick={save}>Salvar</Btn>
          </div>
        </Modal>
      )}

      {/* Alerta JMS 15 dias */}
      {jmsAlerta.length>0 && (
        <AlertaBanner cor="#fee2e2" borda="#fca5a5" icone="🏥"
          titulo={`Nova inspeção de JMS em até 15 dias (${jmsAlerta.length})`}
          linhas={jmsAlerta.map(a=>{const o=getOfficer(a.policialId);const diff=Math.ceil((new Date(a.novaInspDia+"T12:00:00")-hoje)/(24*3600*1000));return `${o?.grau||""} ${o?.nome||""} — inspeção em ${diff} dia(s) (${fmtDate(a.novaInspDia)})`;}) }
          chaveStorage="jms_insp_ciente"
        />
      )}

      {/* RelModal */}
      {relHtml && <RelModal html={relHtml} onClose={()=>setRelHtml("")}/>}

      {/* Modal relatório de saúde */}
      {modalRelSaude && (
        <Modal title="Relatório de Saúde" onClose={()=>setModalRelSaude(false)} wide>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <Input label="Data início (período)" type="date" value={relSaudeConfig.ini} onChange={e=>setRelSaudeConfig(c=>({...c,ini:e.target.value}))}/>
            <Input label="Data fim (período)" type="date" value={relSaudeConfig.fim} onChange={e=>setRelSaudeConfig(c=>({...c,fim:e.target.value}))}/>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Tipos de afastamento</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {TIPOS_SAUDE_REL.map(t=>(
                <label key={t} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,cursor:"pointer",background:relSaudeConfig.tipos.includes(t)?"#dbeafe":"#f3f4f6",padding:"4px 10px",borderRadius:6,border:`1px solid ${relSaudeConfig.tipos.includes(t)?"#3b82f6":"#e5e7eb"}`}}>
                  <input type="checkbox" checked={relSaudeConfig.tipos.includes(t)} onChange={e=>{
                    setRelSaudeConfig(c=>({...c,tipos:e.target.checked?[...c.tipos,t]:c.tipos.filter(x=>x!==t)}));
                  }}/> {t}
                </label>
              ))}
            </div>
            <div style={{display:"flex",gap:8,marginTop:6}}>
              <button onClick={()=>setRelSaudeConfig(c=>({...c,tipos:[...TIPOS_SAUDE_REL]}))} style={{fontSize:11,border:"none",background:"none",color:"#1d4ed8",cursor:"pointer",textDecoration:"underline"}}>Selecionar todos</button>
              <button onClick={()=>setRelSaudeConfig(c=>({...c,tipos:[]}))} style={{fontSize:11,border:"none",background:"none",color:"#6b7280",cursor:"pointer",textDecoration:"underline"}}>Limpar</button>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <input type="checkbox" id="apenasAtivos" checked={relSaudeConfig.apenasAtivos} onChange={e=>setRelSaudeConfig(c=>({...c,apenasAtivos:e.target.checked}))}/>
            <label htmlFor="apenasAtivos" style={{fontSize:12,cursor:"pointer"}}>Apenas afastamentos ativos (excluir concluídos)</label>
          </div>
          <div style={{borderTop:"1px solid #e5e7eb",paddingTop:12}}>
            <div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Relatório individual (opcional)</div>
            <BuscaPolicial officers={officers} excluirIds={[]} onSelect={o=>setRelOfficer(o)}/>
            {relOfficer && <div style={{background:"#f0f4ff",borderRadius:6,padding:"6px 10px",fontSize:12,marginTop:6}}><strong>{relOfficer.grau} {relOfficer.nome}</strong> — relatório individual</div>}
            {relOfficer && <button onClick={()=>setRelOfficer(null)} style={{fontSize:11,border:"none",background:"none",color:"#dc2626",cursor:"pointer",marginTop:4}}>✕ Remover seleção (gerar geral)</button>}
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:12}}>
            <Btn variant="secondary" onClick={()=>setModalRelSaude(false)}>Cancelar</Btn>
            <Btn onClick={()=>gerarRelSaude("modal", relOfficer||null)}>📋 Gerar relatório</Btn>
          </div>
        </Modal>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h2 style={{fontSize:18,fontWeight:700,margin:0}}>Saúde / Afastamentos</h2>
        <div style={{display:"flex",gap:8}}>
          <Btn small variant="secondary" onClick={()=>{setRelOfficer(null);setModalRelSaude(true);}}>📋 Relatório</Btn>
          <Btn onClick={()=>{setForm({policialId:"",tipo:"Atestado",dataInicio:"",aContarDe:"",afastamento:"",dataFim:"",novaInspDia:"",parecer:"",restricao:"",cid:"",medico:"",hospital:"",crm:"",descricao:"",concluido:false,dataCasamento:"",nomeConjuge:"",nomeFilho:"",dataNascFilho:"",certidaoNasc:"",cpfFilho:"",parentesco:"",nomeFalecido:"",dataObito:"",registroObito:""});setModal({mode:"new"});}}>+ Registrar</Btn>
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        <input value={fBusca} onChange={e=>setFBusca(e.target.value)} placeholder="🔍 Buscar por nome ou matrícula..."
          style={{flex:1,minWidth:160,padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,outline:"none"}}/>
        <select value={fTipo} onChange={e=>setFTipo(e.target.value)} style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#fff"}}>
          <option value="todos">Todos tipos</option>
          {["Atestado","Junta Médica","Licença Maternidade","Licença Paternidade","Restrição Médica","Núpcias","Luto"].map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <select value={fGrau} onChange={e=>setFGrau(e.target.value)} style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#fff"}}>
          <option value="todos">Todos graus</option>
          {RANK_ORDER.filter(r=>officers.some(o=>o.grau===r)).map(r=><option key={r} value={r}>{r}</option>)}
        </select>
        <div style={{display:"flex",background:"#f3f4f6",borderRadius:8,overflow:"hidden",border:"1px solid #e5e7eb"}}>
          <button onClick={()=>setVerConcluidos(false)} style={{padding:"7px 12px",border:"none",cursor:"pointer",fontSize:12,fontWeight:!verConcluidos?600:400,background:!verConcluidos?"#1e3a5f":"transparent",color:!verConcluidos?"#fff":"#374151"}}>Ativos</button>
          <button onClick={()=>setVerConcluidos(true)} style={{padding:"7px 12px",border:"none",cursor:"pointer",fontSize:12,fontWeight:verConcluidos?600:400,background:verConcluidos?"#374151":"transparent",color:verConcluidos?"#fff":"#374151"}}>Concluídos</button>
        </div>
      </div>

      {filtrados.length===0 && <Card><p style={{color:"#9ca3af",fontSize:13,textAlign:"center",margin:0}}>{verConcluidos?"Nenhum registro concluído.":"Nenhum afastamento ativo."}</p></Card>}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtrados.map(a=>{
          const o=getOfficer(a.policialId);
          const [bg,fg]=tipoCores[a.tipo]||["#f3f4f6","#374151"];
          const isJms = a.tipo==="Junta Médica";
          const parecerInfo = isJms ? PARECER_COR[a.parecer] : null;
          const novaInspDiff = isJms&&a.novaInspDia ? Math.ceil((new Date(a.novaInspDia+"T12:00:00")-hoje)/(24*3600*1000)) : null;
          return (
            <Card key={a.id} style={{display:"flex",alignItems:"flex-start",gap:12,opacity:a.concluido?0.75:1,borderLeft:`3px solid ${parecerInfo?parecerInfo[1]:bg}`}}>
              {o&&<Avatar name={o.nome} size={36}/>}
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13}}>{o?o.nome:"—"}</div>
                <div style={{fontSize:11,color:"#6b7280"}}>{o?.grau} · Mat. {o?cleanMat(o.matricula):""}</div>
                <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{fmtDate(a.dataInicio)} → {fmtDate(a.dataFim)||"Em aberto"}</div>
                {isJms && a.aContarDe && <div style={{fontSize:11,color:"#6b7280"}}>A contar de: {fmtDate(a.aContarDe)}</div>}
                {isJms && a.novaInspDia && (
                  <div style={{fontSize:11,color:novaInspDiff!==null&&novaInspDiff<=15?"#dc2626":"#6b7280",fontWeight:novaInspDiff!==null&&novaInspDiff<=15?700:400}}>
                    Nova inspeção: {fmtDate(a.novaInspDia)}{novaInspDiff!==null&&novaInspDiff>=0?` (em ${novaInspDiff} dias)`:""}
                  </div>
                )}
                {isJms && parecerInfo && <div style={{fontSize:11,fontWeight:600,color:parecerInfo[1],marginTop:2}}>{parecerInfo[2]} {a.parecer}</div>}
                {a.restricao && <div style={{fontSize:11,color:"#374151",marginTop:2}}>⚠️ {a.restricao}</div>}
                {a.cid&&<div style={{fontSize:11,color:"#6b7280"}}>CID: {a.cid}</div>}
                {a.medico&&<div style={{fontSize:11,color:"#6b7280"}}>Dr(a). {a.medico}{a.crm?" · CRM "+a.crm:""}</div>}
                {/* Núpcias */}
                {a.tipo==="Núpcias"&&a.nomeConjuge&&<div style={{fontSize:11,color:"#6b7280"}}>Cônjuge: {a.nomeConjuge}</div>}
                {/* Maternidade */}
                {a.tipo==="Licença Maternidade"&&a.nomeFilho&&<div style={{fontSize:11,color:"#6b7280"}}>Filho(a): {a.nomeFilho}{a.dataNascFilho?" — "+fmtDate(a.dataNascFilho):""}</div>}
                {/* Luto */}
                {a.tipo==="Luto"&&a.nomeFalecido&&<div style={{fontSize:11,color:"#6b7280"}}>{a.parentesco}: {a.nomeFalecido}{a.dataObito?" — "+fmtDate(a.dataObito):""}</div>}
                {a.descricao&&!a.restricao&&<div style={{fontSize:12,color:"#374151",marginTop:2}}>{a.descricao}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                <Badge color={bg} textColor={fg}>{a.tipo}</Badge>
                {a.concluido&&<Badge color="#dcfce7" textColor="#15803d" size={10}>✓ Concluído</Badge>}
                <div style={{display:"flex",gap:4}}>
                  {!a.concluido&&<Btn small variant="success" onClick={()=>setAfastamentos(as=>as.map(x=>x.id===a.id?{...x,concluido:true}:x))}>✓</Btn>}
                  <Btn small variant="secondary" onClick={()=>{setForm({...a,policialId:String(a.policialId)});setModal({edit:a});}}>✏️</Btn>
                  <Btn small variant="danger" onClick={()=>setAfastamentos(as=>as.filter(x=>x.id!==a.id))}>🗑</Btn>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// MÓDULO CORREGEDORIA — COMPLETO
// ──────────────────────────────────────────────
const TIPOS_PROCESSO = ["IPM","PAD","PDS","SIND","IT","AP. SUMÁRIA","MILAE","ELOGIO"];
const STATUS_PROCESSO = ["Pendente","Em andamento","Aguardando Despacho","Finalizado","Sobrestado","Remitido","Arquivado"];

const PRAZOS_DEFAULT = {
  IPM:         {base:40, prorroga:20, preso:0,  prorrogaPreso:0},
  PAD:         {base:60, prorroga:60, preso:0,  prorrogaPreso:0},
  PDS:         {base:30, prorroga:15, preso:0,  prorrogaPreso:0},
  SIND:        {base:30, prorroga:15, preso:0,  prorrogaPreso:0},
  IT:          {base:30, prorroga:15, preso:0,  prorrogaPreso:0},
  "AP. SUMÁRIA":{base:30, prorroga:0, preso:0,  prorrogaPreso:0},
};

const PONTOS_PUNICAO = {Repreensão:1, Detenção:2, Prisão:4};

function calcDataLimite(dataCarga, tipo, diasProrroga, preso, prazos) {
  if (!dataCarga) return "";
  const cfg = (prazos||{})[tipo] || PRAZOS_DEFAULT[tipo] || {base:30,prorroga:0};
  const base = preso ? (cfg.preso||cfg.base) : cfg.base;
  const prorroga = Number(diasProrroga||0);
  const d = new Date(dataCarga+"T12:00:00");
  d.setDate(d.getDate() + base + prorroga);
  return d.toISOString().slice(0,10);
}

function calcStatusPrazo(status, dataLimite) {
  if (!dataLimite) return {label:"—",cor:"#6b7280"};
  if (status==="Finalizado") return {label:"✅ Concluído",cor:"#15803d"};
  if (status==="Sobrestado") return {label:"Sobrestado",cor:"#6b7280"};
  if (status==="Arquivado")  return {label:"Arquivado",cor:"#6b7280"};
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const lim  = new Date(dataLimite+"T12:00:00");
  if (hoje < lim) return {label:"✅ Em dia",cor:"#15803d"};
  const dias = Math.ceil((hoje-lim)/(24*3600*1000));
  return {label:`⚠️ Atrasado (${dias}d)`,cor:"#dc2626"};
}

function classifComportamento(policialId, processos) {
  const hoje = new Date();
  const y1 = new Date(hoje); y1.setFullYear(hoje.getFullYear()-1);
  const y5 = new Date(hoje); y5.setFullYear(hoje.getFullYear()-5);
  const y9 = new Date(hoje); y9.setFullYear(hoje.getFullYear()-9);
  const punicoes = (processos||[]).filter(p=>{
    if (!p.investigados?.some(inv=>inv.policialId===policialId)) return false;
    if (!p.solucao) return false;
    const dt = new Date((p.dataInstauracao||"")+"T12:00:00");
    return !isNaN(dt);
  });
  if (!punicoes.length) {
    return "Excepcional";
  }
  const pontos1ano = punicoes
    .filter(p=>new Date(p.dataInstauracao+"T12:00:00")>=y1)
    .reduce((s,p)=>s+(PONTOS_PUNICAO[p.solucao]||0),0);
  if (pontos1ano > 8) return "Mau";
  if (pontos1ano === 8) return "Insuficiente";
  if (pontos1ano > 0) return "Bom";
  const algumEm5 = punicoes.some(p=>new Date(p.dataInstauracao+"T12:00:00")>=y5);
  if (algumEm5) return "Bom";
  const algumEm9 = punicoes.some(p=>new Date(p.dataInstauracao+"T12:00:00")>=y9);
  if (algumEm9) return "Ótimo";
  return "Excepcional";
}

function AbaProcessos({ officers, podeEditar, loggedUser, processos, setProcessos, prazos, setPrazos, numeracao, setNumeracao }) {
  const [modal, setModal] = useState(null); // null | "new" | processo
  const [modalAba, setModalAba] = useState("dados");
  const [form, setForm] = useState({});
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  const [fEncarregado, setFEncarregado] = useState("todos");
  const [fTipo, setFTipo] = useState("todos");
  const [fStatus, setFStatus] = useState("todos");
  const [fPrazo, setFPrazo] = useState("todos");
  const [busca, setBusca] = useState("");
  const [showPrazos, setShowPrazos] = useState(false);
  const [formPrazos, setFormPrazos] = useState({...(prazos||PRAZOS_DEFAULT)});
  const [showNumeracao, setShowNumeracao] = useState(false);
  const [formNum, setFormNum] = useState({...(numeracao||{PDS:0,PAD:0,IPM:0,Portaria:0,IT:0,Sindicância:0,SubstEncarregado:0,APSumaria:0,BGOsLidos:0})});

  function openNew() {
    setForm({tipo:"IPM",status:"Pendente",investigados:[],andamentos:[],preso:false,diasProrroga:0});
    setModalAba("dados"); setModal("new");
  }
  function openEdit(p) {
    setForm({...p}); setModalAba("dados"); setModal(p);
  }

  function saveProcesso() {
    const dataLimite = calcDataLimite(form.dataCarga, form.tipo, form.diasProrroga, form.preso, prazos);
    const now = new Date().toISOString();
    if (modal==="new") {
      const novo = {...form, id:Date.now(), dataLimite, criadoEm:now};
      setProcessos(ps=>[...ps, novo]);
    } else {
      setProcessos(ps=>ps.map(p=>p.id===form.id?{...form, dataLimite}:p));
    }
    setModal(null);
  }

  function addAndamento(texto) {
    if (!texto.trim()) return;
    const novo = {texto, dataHora: new Date().toLocaleString("pt-BR"), autor: loggedUser?.nome||"Sistema"};
    sf("andamentos", [...(form.andamentos||[]), novo]);
  }

  function addInvestigado(obj) {
    sf("investigados", [...(form.investigados||[]), obj]);
  }

  const getOfficer = id => officers.find(o=>o.id===Number(id));
  const hoje = new Date().toISOString().slice(0,10);

  const naoArquivados = processos.filter(p=>p.status!=="Arquivado");
  const filtrados = processos.filter(p=>{
    if (fStatus==="todos" && p.status==="Arquivado") return false;
    if (fStatus!=="todos" && p.status!==fStatus) return false;
    if (fTipo!=="todos" && p.tipo!==fTipo) return false;
    if (fEncarregado!=="todos" && (p.encarregadoId!==fEncarregado && p.encarregadoNome!==fEncarregado)) return false;
    if (fPrazo!=="todos") {
      const sp = calcStatusPrazo(p.status, p.dataLimite);
      if (fPrazo==="atrasado" && !sp.label.includes("Atrasado")) return false;
      if (fPrazo==="em_dia" && !sp.label.includes("Em dia")) return false;
    }
    if (busca.trim()) {
      const q = busca.toLowerCase();
      const inv = (p.investigados||[]).map(i=>i.nome||"").join(" ").toLowerCase();
      if (!(p.numProcesso||"").toLowerCase().includes(q) &&
          !(p.encarregadoNome||"").toLowerCase().includes(q) &&
          !inv.includes(q) && !(p.sei||"").toLowerCase().includes(q)) return false;
    }
    return true;
  }).sort((a,b)=>(a.dataInstauracao||"").localeCompare(b.dataInstauracao||""));

  // Dashboard cards
  const tiposCard = ["IPM","PAD","PDS","IT","AP. SUMÁRIA","SIND"];
  const dashCards = tiposCard.map(tipo=>{
    const ativos = naoArquivados.filter(p=>p.tipo===tipo);
    const atrasados = ativos.filter(p=>calcStatusPrazo(p.status,p.dataLimite).label.includes("Atrasado"));
    return {tipo, total:ativos.length, emDia:ativos.length-atrasados.length, atrasados:atrasados.length};
  });

  const encarregados = [...new Set(processos.map(p=>p.encarregadoNome).filter(Boolean))];

  return (
    <div>
      {/* Modal configurar prazos */}
      {showPrazos && (
        <Modal title="⚙️ Configurar Prazos Legais" onClose={()=>setShowPrazos(false)} wide>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:"#1e3a5f",color:"#fff"}}>
                <th style={{padding:"8px 10px",textAlign:"left"}}>Tipo</th>
                <th style={{padding:"8px 10px",textAlign:"center"}}>Prazo base (dias)</th>
                <th style={{padding:"8px 10px",textAlign:"center"}}>Prorrogação (dias)</th>
                <th style={{padding:"8px 10px",textAlign:"center"}}>Se preso (dias)</th>
                <th style={{padding:"8px 10px",textAlign:"center"}}>Prorrogação preso</th>
              </tr></thead>
              <tbody>
                {Object.entries(formPrazos).map(([tipo,cfg],i)=>(
                  <tr key={tipo} style={{background:i%2===0?"#fff":"#f9fafb"}}>
                    <td style={{padding:"8px 10px",fontWeight:600}}>{tipo}</td>
                    {["base","prorroga","preso","prorrogaPreso"].map(k=>(
                      <td key={k} style={{padding:"6px 8px",textAlign:"center"}}>
                        <input type="number" value={cfg[k]||0}
                          onChange={e=>setFormPrazos(fp=>({...fp,[tipo]:{...fp[tipo],[k]:Number(e.target.value)}}))}
                          style={{width:70,padding:"4px 6px",border:"1px solid #d1d5db",borderRadius:5,fontSize:12,textAlign:"center",outline:"none"}}/>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:12}}>
            <Btn variant="secondary" onClick={()=>setShowPrazos(false)}>Cancelar</Btn>
            <Btn onClick={()=>{setPrazos(formPrazos);setShowPrazos(false);}}>Salvar prazos</Btn>
          </div>
        </Modal>
      )}

      {/* Modal numeração */}
      {showNumeracao && (
        <Modal title="Controle de Numeração" onClose={()=>setShowNumeracao(false)}>
          {Object.entries(formNum).map(([k,v])=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8,padding:"8px 10px",background:"#f9fafb",borderRadius:7}}>
              <span style={{flex:1,fontSize:13,fontWeight:500}}>{k.replace(/([A-Z])/g," $1").trim()}</span>
              <span style={{fontSize:12,color:"#6b7280"}}>Último nº:</span>
              <input type="number" value={v}
                onChange={e=>setFormNum(fn=>({...fn,[k]:Number(e.target.value)}))}
                style={{width:90,padding:"5px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:13,textAlign:"center",outline:"none"}}/>
            </div>
          ))}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setShowNumeracao(false)}>Cancelar</Btn>
            <Btn onClick={()=>{setNumeracao(formNum);setShowNumeracao(false);}}>Salvar</Btn>
          </div>
        </Modal>
      )}

      {/* Modal processo */}
      {modal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:2000,overflowY:"auto",padding:"16px 12px"}}>
          <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:780,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#1e3a5f,#2d5986)",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:15}}>{modal==="new"?"Novo Processo":"Editar Processo"}</span>
              <button onClick={()=>setModal(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"4px 12px",cursor:"pointer",fontSize:12}}>✕</button>
            </div>
            {/* Abas internas */}
            <div style={{display:"flex",borderBottom:"1px solid #e5e7eb",background:"#f9fafb"}}>
              {["dados","andamentos","investigados"].map(a=>(
                <button key={a} onClick={()=>setModalAba(a)} style={{padding:"9px 16px",border:"none",background:"none",cursor:"pointer",fontSize:12,fontWeight:modalAba===a?700:400,color:modalAba===a?"#1e3a5f":"#6b7280",borderBottom:modalAba===a?"2px solid #1e3a5f":"none"}}>
                  {a==="dados"?"📋 Dados":a==="andamentos"?"📝 Andamentos":"👤 Investigados"}
                </button>
              ))}
            </div>
            <div style={{padding:20,maxHeight:"70vh",overflowY:"auto"}}>

              {/* ABA DADOS */}
              {modalAba==="dados" && (
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:4}}>
                    <Input label="Data de Instauração" type="date" value={form.dataInstauracao||""} onChange={e=>sf("dataInstauracao",e.target.value)}/>
                    <Input label="Data de Carga" type="date" value={form.dataCarga||""} onChange={e=>{sf("dataCarga",e.target.value);}}/>
                    <Input label="Data de Distribuição" type="date" value={form.dataDistribuicao||""} onChange={e=>sf("dataDistribuicao",e.target.value)}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <Select label="Tipo de Processo" value={form.tipo||"IPM"} onChange={e=>sf("tipo",e.target.value)}>
                      {TIPOS_PROCESSO.map(t=><option key={t} value={t}>{t}</option>)}
                    </Select>
                    <Input label="Número do Processo" value={form.numProcesso||""} onChange={e=>sf("numProcesso",e.target.value)}/>
                  </div>
                  {/* Encarregado */}
                  <div style={{marginBottom:12}}>
                    <label style={{display:"block",fontSize:12,color:"#374151",fontWeight:500,marginBottom:4}}>Encarregado</label>
                    {form.encarregadoId ? (
                      <div style={{display:"flex",alignItems:"center",gap:8,background:"#f0f4ff",borderRadius:7,padding:"7px 10px"}}>
                        <Avatar name={getOfficer(form.encarregadoId)?.nome||form.encarregadoNome||""} size={28}/>
                        <span style={{fontSize:13,flex:1}}>{form.encarregadoNome}</span>
                        <button onClick={()=>{sf("encarregadoId",null);sf("encarregadoNome","");}} style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer"}}>✕</button>
                      </div>
                    ) : (
                      <div>
                        <BuscaPolicial officers={officers} excluirIds={[]} onSelect={o=>{sf("encarregadoId",o.id);sf("encarregadoNome",o.nome);}}/>
                        <div style={{display:"flex",gap:8,marginTop:4}}>
                          <input value={form.encarregadoManual||""} onChange={e=>sf("encarregadoManual",e.target.value)} placeholder="Ou digitar manualmente..." style={{flex:1,padding:"6px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:12,outline:"none"}}/>
                          <Btn small onClick={()=>{if(form.encarregadoManual){sf("encarregadoNome",form.encarregadoManual);sf("encarregadoManual","");}}}>Usar</Btn>
                        </div>
                      </div>
                    )}
                  </div>
                  <Textarea label="Fato/Resumo" value={form.fato||""} onChange={e=>sf("fato",e.target.value)} rows={2}/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                      <input type="checkbox" id="preso_chk" checked={!!form.preso} onChange={e=>sf("preso",e.target.checked)}/>
                      <label htmlFor="preso_chk" style={{fontSize:13,cursor:"pointer",fontWeight:500}}>Preso</label>
                    </div>
                    <Input label="Dias de Prorrogação" type="number" value={form.diasProrroga||0} onChange={e=>sf("diasProrroga",Number(e.target.value))}/>
                    <Select label="Status" value={form.status||"Pendente"} onChange={e=>sf("status",e.target.value)}>
                      {STATUS_PROCESSO.map(s=><option key={s} value={s}>{s}</option>)}
                    </Select>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:4}}>
                    <Select label="Solução" value={form.solucao||""} onChange={e=>sf("solucao",e.target.value)}>
                      <option value="">Sem solução</option>
                      {Object.keys(PONTOS_PUNICAO).map(s=><option key={s} value={s}>{s} ({PONTOS_PUNICAO[s]} ponto{PONTOS_PUNICAO[s]>1?"s":""})</option>)}
                      <option value="Absolvição">Absolvição</option>
                      <option value="Remissão">Remissão</option>
                      <option value="Arquivamento">Arquivamento</option>
                    </Select>
                    <Input label="Processo SEI" value={form.sei||""} onChange={e=>sf("sei",e.target.value)}/>
                  </div>
                  <Textarea label="Observações" value={form.observacoes||""} onChange={e=>sf("observacoes",e.target.value)} rows={2}/>
                  {/* Campos calculados */}
                  {form.dataCarga && (
                    <div style={{background:"#f0f4ff",borderRadius:8,padding:"10px 12px",marginTop:8,fontSize:12}}>
                      <div>Data Limite: <strong>{fmtDate(calcDataLimite(form.dataCarga,form.tipo,form.diasProrroga,form.preso,prazos))}</strong></div>
                      {(()=>{const sp=calcStatusPrazo(form.status,calcDataLimite(form.dataCarga,form.tipo,form.diasProrroga,form.preso,prazos));return <div>Status do prazo: <strong style={{color:sp.cor}}>{sp.label}</strong></div>;})()} 
                    </div>
                  )}
                </div>
              )}

              {/* ABA ANDAMENTOS */}
              {modalAba==="andamentos" && (
                <div>
                  <div style={{marginBottom:12}}>
                    <label style={{display:"block",fontSize:12,fontWeight:500,color:"#374151",marginBottom:4}}>Próximo passo</label>
                    <div style={{display:"flex",gap:8}}>
                      <input id="prox_passo_inp" placeholder="Descreva o próximo passo..." style={{flex:1,padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,outline:"none"}}/>
                      <Btn onClick={()=>{const inp=document.getElementById("prox_passo_inp");if(inp.value.trim()){addAndamento(inp.value.trim());inp.value="";}else alert("Digite o andamento.")}}>Registrar</Btn>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:"40vh",overflowY:"auto"}}>
                    {[...(form.andamentos||[])].reverse().map((a,i)=>(
                      <div key={i} style={{background:"#f9fafb",borderRadius:7,padding:"8px 12px",borderLeft:"3px solid #1e3a5f"}}>
                        <div style={{fontSize:11,color:"#6b7280",marginBottom:2}}>{a.dataHora} — {a.autor}</div>
                        <div style={{fontSize:13}}>{a.texto}</div>
                      </div>
                    ))}
                    {!(form.andamentos||[]).length && <p style={{color:"#9ca3af",fontSize:13}}>Nenhum andamento registrado.</p>}
                  </div>
                </div>
              )}

              {/* ABA INVESTIGADOS */}
              {modalAba==="investigados" && (
                <div>
                  <div style={{marginBottom:12}}>
                    <label style={{display:"block",fontSize:12,fontWeight:500,color:"#374151",marginBottom:4}}>Adicionar investigado</label>
                    <BuscaPolicial officers={officers} excluirIds={(form.investigados||[]).map(i=>i.policialId).filter(Boolean)}
                      onSelect={o=>addInvestigado({policialId:o.id,nome:o.nome,matricula:o.matricula})}/>
                    <div style={{display:"flex",gap:8,marginTop:6}}>
                      <input id="inv_nome" placeholder="Nome (manual)" style={{flex:2,padding:"6px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:12,outline:"none"}}/>
                      <input id="inv_mat" placeholder="Matrícula" style={{flex:1,padding:"6px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:12,outline:"none"}}/>
                      <Btn small onClick={()=>{const n=document.getElementById("inv_nome").value.trim(),m=document.getElementById("inv_mat").value.trim();if(n){addInvestigado({nome:n,matricula:m});document.getElementById("inv_nome").value="";document.getElementById("inv_mat").value="";}}}>+ Add</Btn>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {(form.investigados||[]).map((inv,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:"#f9fafb",borderRadius:7}}>
                        <Avatar name={inv.nome} size={28}/>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:500}}>{inv.nome}</div>
                          <div style={{fontSize:11,color:"#6b7280"}}>{inv.matricula?`Mat. ${cleanMat(inv.matricula)}`:""}</div>
                        </div>
                        <button onClick={()=>sf("investigados",(form.investigados||[]).filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:15}}>✕</button>
                      </div>
                    ))}
                    {!(form.investigados||[]).length && <p style={{color:"#9ca3af",fontSize:13}}>Nenhum investigado adicionado.</p>}
                  </div>
                </div>
              )}
            </div>
            <div style={{padding:"12px 20px",borderTop:"1px solid #e5e7eb",display:"flex",gap:8,justifyContent:"flex-end",background:"#f9fafb"}}>
              <Btn variant="secondary" onClick={()=>setModal(null)}>Cancelar</Btn>
              {podeEditar && <Btn onClick={saveProcesso}>💾 Salvar processo</Btn>}
            </div>
          </div>
        </div>
      )}

      {/* Linha 1: Dashboard cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:12}}>
        {dashCards.map(dc=>(
          <div key={dc.tipo} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:9,padding:"10px 12px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>{dc.tipo}</div>
            <div style={{fontSize:20,fontWeight:700,color:"#111827"}}>{dc.total}</div>
            <div style={{fontSize:10,color:"#15803d"}}>✅ Em dia: {dc.emDia}</div>
            {dc.atrasados>0 && <div style={{fontSize:10,color:"#dc2626"}}>⚠️ Atrasados: {dc.atrasados}</div>}
          </div>
        ))}
      </div>

      {/* Linha 2: Controle de numeração */}
      {podeEditar && (
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          {Object.entries(numeracao).map(([k,v])=>(
            <div key={k} style={{background:"#f0f4ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"6px 12px",fontSize:11,cursor:"pointer"}} onClick={()=>{setFormNum({...numeracao});setShowNumeracao(true);}}>
              <div style={{color:"#6b7280",marginBottom:2}}>{k.replace(/([A-Z])/g," $1").trim()}</div>
              <div style={{fontWeight:700,fontSize:14,color:"#1e3a5f"}}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {/* Linha 3: Filtros + ações */}
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Processo, investigado, encarregado, SEI..."
          style={{flex:1,minWidth:200,padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,outline:"none"}}/>
        <select value={fTipo} onChange={e=>setFTipo(e.target.value)} style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#fff"}}>
          <option value="todos">Todos tipos</option>
          {TIPOS_PROCESSO.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#fff"}}>
          <option value="todos">Todos status</option>
          {STATUS_PROCESSO.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select value={fEncarregado} onChange={e=>setFEncarregado(e.target.value)} style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#fff"}}>
          <option value="todos">Todos encarregados</option>
          {encarregados.map(e=><option key={e} value={e}>{e}</option>)}
        </select>
        <select value={fPrazo} onChange={e=>setFPrazo(e.target.value)} style={{padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,background:"#fff"}}>
          <option value="todos">Todos prazos</option>
          <option value="em_dia">Em dia</option>
          <option value="atrasado">Atrasado</option>
        </select>
        {podeEditar && <Btn onClick={()=>{setFormPrazos({...prazos});setShowPrazos(true);}} variant="secondary" small>⚙️ Prazos</Btn>}
        {podeEditar && <Btn onClick={openNew}>+ Novo processo</Btn>}
      </div>

      {/* Listagem */}
      {filtrados.length===0 && <div style={{textAlign:"center",padding:24,color:"#9ca3af",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb",fontSize:13}}>Nenhum processo encontrado.</div>}
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:"#1e3a5f",color:"#fff"}}>
              {["Instauração","Nº Portaria","Tipo","Encarregado","SEI","Investigados","Status","Prazo"].map(h=>(
                <th key={h} style={{padding:"8px 10px",textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>
              ))}
              <th style={{padding:"8px 10px"}}></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p,i)=>{
              const sp = calcStatusPrazo(p.status, p.dataLimite);
              const atrasado = sp.label.includes("Atrasado");
              const rowBg = atrasado ? "#fff5f5" : i%2===0?"#fff":"#f9fafb";
              return (
                <tr key={p.id} style={{background:rowBg,borderBottom:"1px solid #f0f0f0",cursor:"pointer"}} onClick={()=>openEdit(p)}>
                  <td style={{padding:"7px 10px",whiteSpace:"nowrap"}}>{fmtDate(p.dataInstauracao)}</td>
                  <td style={{padding:"7px 10px"}}>{p.numProcesso||"—"}</td>
                  <td style={{padding:"7px 10px"}}><Badge color="#dbeafe" textColor="#1d4ed8">{p.tipo}</Badge></td>
                  <td style={{padding:"7px 10px"}}>{p.encarregadoNome||"—"}</td>
                  <td style={{padding:"7px 10px",color:"#6b7280"}}>{p.sei||"—"}</td>
                  <td style={{padding:"7px 10px"}}>
                    {(p.investigados||[]).slice(0,2).map(inv=>inv.nome).join(", ")}
                    {(p.investigados||[]).length>2&&` +${(p.investigados||[]).length-2}`}
                  </td>
                  <td style={{padding:"7px 10px"}}><Badge color={p.status==="Finalizado"?"#dcfce7":p.status==="Arquivado"?"#f3f4f6":"#fef3c7"} textColor={p.status==="Finalizado"?"#15803d":p.status==="Arquivado"?"#374151":"#92400e"}>{p.status}</Badge></td>
                  <td style={{padding:"7px 10px",fontWeight:atrasado?700:400,color:sp.cor,whiteSpace:"nowrap"}}>{sp.label}</td>
                  <td style={{padding:"7px 10px"}} onClick={e=>e.stopPropagation()}>
                    {podeEditar && <Btn small variant="danger" onClick={()=>setProcessos(ps=>ps.filter(x=>x.id!==p.id))}>🗑</Btn>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── ABA ELOGIOS ────────────────────────────────────────────────────────────


function AbaElogios({ officers, podeEditar, loggedUser, elogios, setElogios }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));

  function save() {
    if (!form.data) { alert("Data obrigatória."); return; }
    const novo = {...form, id:Date.now()};
    if (form.id) setElogios(es=>es.map(e=>e.id===form.id?novo:e));
    else setElogios(es=>[...es,novo]);
    setModal(false);
  }

  return (
    <div>
      {modal && (
        <Modal title={form.id?"Editar Elogio":"Novo Elogio"} onClose={()=>setModal(false)} wide>
          <Input label="Data do Despacho" type="date" value={form.data||""} onChange={e=>sf("data",e.target.value)}/>
          <Input label="Processo SEI" value={form.sei||""} onChange={e=>sf("sei",e.target.value)}/>
          <div style={{marginBottom:12}}>
            <label style={{display:"block",fontSize:12,fontWeight:500,color:"#374151",marginBottom:4}}>Policiais contemplados</label>
            <BuscaPolicial officers={officers} excluirIds={(form.policiais||[]).map(p=>p.policialId).filter(Boolean)}
              onSelect={o=>sf("policiais",[...(form.policiais||[]),{policialId:o.id,nome:o.nome,matricula:o.matricula}])}/>
            <div style={{marginTop:6,display:"flex",flexDirection:"column",gap:4}}>
              {(form.policiais||[]).map((p,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",background:"#f0f4ff",borderRadius:6}}>
                  <span style={{flex:1,fontSize:12}}>{p.nome}</span>
                  <button onClick={()=>sf("policiais",(form.policiais||[]).filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer"}}>✕</button>
                </div>
              ))}
            </div>
          </div>
          <Textarea label="Nota/Descrição" value={form.nota||""} onChange={e=>sf("nota",e.target.value)} rows={3}/>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <input type="checkbox" id="pub_boletim" checked={!!form.publicadoBoletim} onChange={e=>sf("publicadoBoletim",e.target.checked)}/>
            <label htmlFor="pub_boletim" style={{fontSize:12,cursor:"pointer"}}>Publicado em Boletim</label>
          </div>
          <Textarea label="Observações" value={form.observacoes||""} onChange={e=>sf("observacoes",e.target.value)} rows={2}/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setModal(false)}>Cancelar</Btn>
            <Btn onClick={save}>Salvar</Btn>
          </div>
        </Modal>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div><h3 style={{margin:0,fontSize:16,fontWeight:700}}>Elogios</h3><span style={{fontSize:12,color:"#6b7280"}}>{elogios.length} registro(s)</span></div>
        {podeEditar && <Btn onClick={()=>{setForm({});setModal(true);}}>+ Novo elogio</Btn>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[...elogios].sort((a,b)=>(b.data||"").localeCompare(a.data||"")).map(e=>(
          <Card key={e.id} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{fmtDate(e.data)} {e.sei&&<span style={{color:"#6b7280",fontWeight:400}}>— SEI {e.sei}</span>}</div>
              <div style={{fontSize:12,color:"#374151",marginBottom:4}}>{e.nota}</div>
              <div style={{fontSize:11,color:"#6b7280"}}>{(e.policiais||[]).map(p=>p.nome).join(", ")}</div>
            </div>
            {e.publicadoBoletim && <Badge color="#dcfce7" textColor="#15803d" size={10}>Publicado no BGO</Badge>}
            {podeEditar && (
              <div style={{display:"flex",gap:4}}>
                <Btn small variant="secondary" onClick={()=>{setForm(e);setModal(true);}}>✏️</Btn>
                <Btn small variant="danger" onClick={()=>setElogios(es=>es.filter(x=>x.id!==e.id))}>🗑</Btn>
              </div>
            )}
          </Card>
        ))}
        {!elogios.length && <div style={{textAlign:"center",padding:24,color:"#9ca3af",fontSize:13}}>Nenhum elogio registrado.</div>}
      </div>
    </div>
  );
}

// ── ABA MILAE ──────────────────────────────────────────────────────────────


function AbaMilae({ officers, podeEditar, loggedUser, milae, setMilae }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  function save() {
    const novo = {...form, id:Date.now()};
    if (form.id) setMilae(ms=>ms.map(m=>m.id===form.id?novo:m));
    else setMilae(ms=>[...ms,novo]);
    setModal(false);
  }
  return (
    <div>
      {modal && (
        <Modal title="Registro MILAE" onClose={()=>setModal(false)} wide>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Data do Fato" type="date" value={form.dataFato||""} onChange={e=>sf("dataFato",e.target.value)}/>
            <Input label="Número" value={form.numero||""} onChange={e=>sf("numero",e.target.value)}/>
          </div>
          <Input label="Local" value={form.local||""} onChange={e=>sf("local",e.target.value)}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Resistente" value={form.resistente||""} onChange={e=>sf("resistente",e.target.value)}/>
            <Input label="Processo SEI" value={form.sei||""} onChange={e=>sf("sei",e.target.value)}/>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:8}}>
            <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
              <input type="checkbox" checked={!!form.preso} onChange={e=>sf("preso",e.target.checked)}/> Preso
            </label>
            <Input label="Dias Prorrogação" type="number" value={form.diasProrroga||0} onChange={e=>sf("diasProrroga",e.target.value)}/>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{display:"block",fontSize:12,fontWeight:500,color:"#374151",marginBottom:4}}>Policiais envolvidos</label>
            <BuscaPolicial officers={officers} excluirIds={(form.policiais||[]).map(p=>p.policialId).filter(Boolean)}
              onSelect={o=>sf("policiais",[...(form.policiais||[]),{policialId:o.id,nome:o.nome,matricula:o.matricula}])}/>
            <div style={{marginTop:6,display:"flex",flexDirection:"column",gap:4}}>
              {(form.policiais||[]).map((p,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",background:"#f0f4ff",borderRadius:6}}>
                  <span style={{flex:1,fontSize:12}}>{p.nome}</span>
                  <button onClick={()=>sf("policiais",(form.policiais||[]).filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer"}}>✕</button>
                </div>
              ))}
            </div>
          </div>
          <Textarea label="Medidas Adotadas" value={form.medidas||""} onChange={e=>sf("medidas",e.target.value)} rows={3}/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setModal(false)}>Cancelar</Btn>
            <Btn onClick={save}>Salvar</Btn>
          </div>
        </Modal>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div><h3 style={{margin:0,fontSize:16,fontWeight:700}}>MILAE</h3><span style={{fontSize:12,color:"#6b7280"}}>{milae.length} registro(s)</span></div>
        {podeEditar && <Btn onClick={()=>{setForm({});setModal(true);}}>+ Novo MILAE</Btn>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[...milae].sort((a,b)=>(b.dataFato||"").localeCompare(a.dataFato||"")).map(m=>(
          <Card key={m.id} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13}}>{fmtDate(m.dataFato)} — Nº {m.numero||"—"}</div>
              <div style={{fontSize:12,color:"#6b7280"}}>{m.local}</div>
              <div style={{fontSize:12,color:"#374151",marginTop:4}}>{(m.policiais||[]).map(p=>p.nome).join(", ")}</div>
              {m.medidas && <div style={{fontSize:11,color:"#374151",marginTop:4}}>{m.medidas}</div>}
            </div>
            {podeEditar && (
              <div style={{display:"flex",gap:4}}>
                <Btn small variant="secondary" onClick={()=>{setForm(m);setModal(true);}}>✏️</Btn>
                <Btn small variant="danger" onClick={()=>setMilae(ms=>ms.filter(x=>x.id!==m.id))}>🗑</Btn>
              </div>
            )}
          </Card>
        ))}
        {!milae.length && <div style={{textAlign:"center",padding:24,color:"#9ca3af",fontSize:13}}>Nenhum registro MILAE.</div>}
      </div>
    </div>
  );
}

// ── ABA EXPEDIENTES ────────────────────────────────────────────────────────


function AbaExpedientes({ officers, podeEditar, loggedUser, expedientes, setExpedientes }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [verConcluidos, setVerConcluidos] = useState(false);
  const [confirmConcluir, setConfirmConcluir] = useState(null);
  const [proxAto, setProxAto] = useState({ato:"",dataLimite:""});
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  const hoje = new Date().toISOString().slice(0,10);

  function save() {
    const novo = {...form, id:form.id||Date.now(), concluido:false};
    if (form.id) setExpedientes(es=>es.map(e=>e.id===form.id?novo:e));
    else setExpedientes(es=>[...es,novo]);
    setModal(false);
  }

  function tentarConcluir(exp) {
    setConfirmConcluir(exp);
    setProxAto({ato:"",dataLimite:""});
  }

  function confirmarConcluir(temProximo) {
    const exp = confirmConcluir;
    if (temProximo) {
      if (!proxAto.ato || !proxAto.dataLimite) { alert("Preencha o próximo ato e data."); return; }
      setExpedientes(es=>es.map(e=>e.id===exp.id?{...e,ato:proxAto.ato,dataLimite:proxAto.dataLimite,concluido:false}:e));
    } else {
      setExpedientes(es=>es.map(e=>e.id===exp.id?{...e,concluido:true}:e));
    }
    setConfirmConcluir(null);
  }

  const filtrados = expedientes.filter(e=>verConcluidos?e.concluido:!e.concluido)
    .sort((a,b)=>(a.dataLimite||"").localeCompare(b.dataLimite||""));

  return (
    <div>
      {confirmConcluir && (
        <Modal title="Concluir Expediente" onClose={()=>setConfirmConcluir(null)}>
          <p style={{fontSize:13,marginBottom:12}}>Há um próximo ato para este expediente?</p>
          <Textarea label="Próximo ato (opcional)" value={proxAto.ato} onChange={e=>setProxAto(x=>({...x,ato:e.target.value}))} rows={2}/>
          {proxAto.ato && <Input label="Nova data limite" type="date" value={proxAto.dataLimite} onChange={e=>setProxAto(x=>({...x,dataLimite:e.target.value}))}/>}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="secondary" onClick={()=>confirmarConcluir(false)}>Não — marcar concluído</Btn>
            <Btn onClick={()=>confirmarConcluir(true)}>Sim — atualizar ato</Btn>
          </div>
        </Modal>
      )}
      {modal && (
        <Modal title={form.id?"Editar Expediente":"Novo Expediente"} onClose={()=>setModal(false)}>
          <Input label="Título" value={form.titulo||""} onChange={e=>sf("titulo",e.target.value)}/>
          <Input label="Nº Processo SEI" value={form.sei||""} onChange={e=>sf("sei",e.target.value)}/>
          <Textarea label="Ato (o que precisa ser feito)" value={form.ato||""} onChange={e=>sf("ato",e.target.value)} rows={2}/>
          <Input label="Data Limite" type="date" value={form.dataLimite||""} onChange={e=>sf("dataLimite",e.target.value)}/>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <input type="checkbox" id="recorrente_chk" checked={!!form.recorrente} onChange={e=>sf("recorrente",e.target.checked)}/>
            <label htmlFor="recorrente_chk" style={{fontSize:12,cursor:"pointer"}}>Recorrência mensal</label>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setModal(false)}>Cancelar</Btn>
            <Btn onClick={save}>Salvar</Btn>
          </div>
        </Modal>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div><h3 style={{margin:0,fontSize:16,fontWeight:700}}>Expedientes</h3><span style={{fontSize:12,color:"#6b7280"}}>{filtrados.length} registro(s)</span></div>
        <div style={{display:"flex",gap:8}}>
          <div style={{display:"flex",background:"#f3f4f6",borderRadius:8,overflow:"hidden",border:"1px solid #e5e7eb"}}>
            <button onClick={()=>setVerConcluidos(false)} style={{padding:"6px 12px",border:"none",cursor:"pointer",fontSize:12,fontWeight:!verConcluidos?600:400,background:!verConcluidos?"#1e3a5f":"transparent",color:!verConcluidos?"#fff":"#374151"}}>Pendentes</button>
            <button onClick={()=>setVerConcluidos(true)} style={{padding:"6px 12px",border:"none",cursor:"pointer",fontSize:12,fontWeight:verConcluidos?600:400,background:verConcluidos?"#374151":"transparent",color:verConcluidos?"#fff":"#374151"}}>Concluídos</button>
          </div>
          {podeEditar && <Btn onClick={()=>{setForm({});setModal(true);}}>+ Novo expediente</Btn>}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtrados.map(e=>{
          const atrasado = !e.concluido && e.dataLimite && e.dataLimite < hoje;
          return (
            <Card key={e.id} style={{borderLeft:`3px solid ${atrasado?"#dc2626":e.recorrente?"#7c3aed":"#1e3a5f"}`,background:atrasado?"#fff5f5":"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:atrasado?"#dc2626":"#111827"}}>{e.titulo}</div>
                  {e.sei && <div style={{fontSize:11,color:"#6b7280"}}>SEI: {e.sei}</div>}
                  <div style={{fontSize:12,color:"#374151",marginTop:4}}>{e.ato}</div>
                  <div style={{fontSize:11,color:atrasado?"#dc2626":"#6b7280",marginTop:2}}>
                    Prazo: {fmtDate(e.dataLimite)} {atrasado&&"— ATRASADO"} {e.recorrente&&"🔄"}
                  </div>
                </div>
                {podeEditar && !e.concluido && (
                  <div style={{display:"flex",gap:4,marginLeft:8}}>
                    <Btn small variant="success" onClick={()=>tentarConcluir(e)}>✓ Concluído</Btn>
                    <Btn small variant="secondary" onClick={()=>{setForm(e);setModal(true);}}>✏️</Btn>
                    <Btn small variant="danger" onClick={()=>setExpedientes(es=>es.filter(x=>x.id!==e.id))}>🗑</Btn>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
        {!filtrados.length && <div style={{textAlign:"center",padding:24,color:"#9ca3af",fontSize:13}}>Nenhum expediente {verConcluidos?"concluído":"pendente"}.</div>}
      </div>
    </div>
  );
}


function ModCorregedoria({ officers, corregedoria, setCorregedoria, perm, loggedUser }) {
  const podeEditar = perm.admin || perm.corregedoria;

  // Sub-state: processos, elogios, milae, expedientes
  const [processosRaw,  setProcessos]  = useSupabaseState("sirh_corr_processos",  []);
  const [elogiosRaw,    setElogios]    = useSupabaseState("sirh_corr_elogios",    []);
  const [milaeRaw,      setMilae]      = useSupabaseState("sirh_corr_milae",      []);
  const [expedientesRaw,setExpedientes]= useSupabaseState("sirh_corr_expedientes",[]);
  const processos   = processosRaw   || [];
  const elogios     = elogiosRaw     || [];
  const milae       = milaeRaw       || [];
  const expedientes = expedientesRaw || [];
  const [prazosRaw,     setPrazos]     = useSupabaseState("sirh_corr_prazos",     PRAZOS_DEFAULT);
  const [numeracaoRaw,  setNumeracao]  = useSupabaseState("sirh_corr_numeracao",  {PDS:0,PAD:0,IPM:0,Portaria:0,IT:0,Sindicância:0,SubstEncarregado:0,APSumaria:0,BGOsLidos:0});
  const prazos = prazosRaw || PRAZOS_DEFAULT;
  const numeracao = numeracaoRaw || {PDS:0,PAD:0,IPM:0,Portaria:0,IT:0,Sindicância:0,SubstEncarregado:0,APSumaria:0,BGOsLidos:0};

  const [aba, setAba] = useState("processos");

  // ── RENDER PRINCIPAL ───────────────────────────────────────────────────────
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{fontSize:18,fontWeight:700,margin:0}}>Corregedoria</h2>
      </div>
      <div style={{display:"flex",borderBottom:"2px solid #e5e7eb",marginBottom:16,gap:0}}>
        {[
          {id:"processos",  label:"⚖️ Processos"},
          {id:"elogios",    label:"🏅 Elogios"},
          {id:"milae",      label:"🛡️ MILAE"},
          {id:"expedientes",label:"📋 Expedientes"},
        ].map(a=>(
          <button key={a.id} onClick={()=>setAba(a.id)}
            style={{padding:"10px 18px",border:"none",background:"none",cursor:"pointer",fontSize:13,
              fontWeight:aba===a.id?700:400,color:aba===a.id?"#1e3a5f":"#6b7280",
              borderBottom:aba===a.id?"3px solid #1e3a5f":"3px solid transparent",
              marginBottom:"-2px"}}>
            {a.label}
          </button>
        ))}
      </div>
      {aba==="processos"   && <AbaProcessos officers={officers} podeEditar={podeEditar} loggedUser={loggedUser} processos={processos} setProcessos={setProcessos} prazos={prazos} setPrazos={setPrazos} numeracao={numeracao} setNumeracao={setNumeracao}/>}
      {aba==="elogios"     && <AbaElogios officers={officers} podeEditar={podeEditar} loggedUser={loggedUser} elogios={elogios} setElogios={setElogios}/>}
      {aba==="milae"       && <AbaMilae officers={officers} podeEditar={podeEditar} loggedUser={loggedUser} milae={milae} setMilae={setMilae}/>}
      {aba==="expedientes" && <AbaExpedientes officers={officers} podeEditar={podeEditar} loggedUser={loggedUser} expedientes={expedientes} setExpedientes={setExpedientes}/>}
    </div>
  );
}

// Módulos do sistema e seus labels
// ─── MÓDULO GESTÃO DE PELOTÃO ─────────────────────────────────────────────
const LEGENDAS_ESCALA = {
  A1:"08h-12h/14h-18h", A11:"22h-06h", A4:"08h-12h/13h-17h",
  B1:"07h-13h", B2:"13h-19h", C1:"07h-19h", C11:"13h-01h",
  C2:"19h-07h", C8:"06h-18h", C9:"18h-06h",
  CR:"Em curso", F:"Férias", F5:"06h-06h", G1:"06h-21h",
  H5:"09h-01h", JMS:"Junta médica", LP:"Licença Prêmio",
  M3:"07h30-19h30", R19:"06h30-18h30", R20:"18h30-06h30",
  R21:"06h-18h", AT:"Atestado", D:"Dispensa",
  P:"Lic.Paternidade", LM:"Lic.Maternidade",
};
const HORAS_LEGENDA = {
  A1:8, A11:8, A4:8, B1:6, B2:6, C1:12, C11:12, C2:12, C8:12, C9:12,
  F5:24, G1:15, H5:16, M3:12, R19:12, R20:12, R21:12,
  CR:0, F:0, JMS:0, LP:0, AT:0, D:0, P:0, LM:0,
};
// Horas noturnas (22h-05h = 7h) por legenda
const NOTURNO_LEGENDA = {
  A11:7, C2:7, C11:3, C9:7, R20:7,
  F5:7,  // 24x96: das 22h às 05h = 7h noturnas
};
const GRUPO_CORES = {
  A:["#1e3a5f","#fff"], B:["#15803d","#fff"],
  C:["#92400e","#fff"], D:["#5b21b6","#fff"], E:["#9d174d","#fff"],
};

function calcHoras(cellMap, diasNoMes) {
  let total = 0, noturno = 0;
  for (let d = 1; d <= diasNoMes; d++) {
    const leg = cellMap[d];
    if (!leg) continue;
    total   += HORAS_LEGENDA[leg]  || 0;
    noturno += NOTURNO_LEGENDA[leg]|| 0;
  }
  return {total, noturno};
}

// ─── Aba Escala ──────────────────────────────────────────────────────────────
function AbaEscala({ pelotao, escalas, setEscalas, officers, mes, ano }) {
  // ── state ──────────────────────────────────────────────────────────────────
  const [escalaSel, setEscalaSel] = useState(null); // id da sub-escala selecionada
  const [modalCriar, setModalCriar] = useState(false);
  const [modalGrupo, setModalGrupo] = useState(null); // {grupoId, escalaId}
  const [editCell, setEditCell]   = useState(null);   // {escalaId, grupoId, pid, dia}
  const [editLeg, setEditLeg]     = useState("");
  const [confirmDel, setConfirmDel] = useState(null);
  const [formEscala, setFormEscala] = useState({
    nome:"", tipo:"24x96",
    horaInicio:"06:30", horaFim:"18:30",
    horaInicio2:"18:30", horaFim2:"06:30",
  });
  const setFE = (k,v) => setFormEscala(f=>({...f,[k]:v}));

  const diasNoMes = new Date(ano, mes, 0).getDate();
  const hoje = new Date();
  const isCurrentMonth = mes===hoje.getMonth()+1 && ano===hoje.getFullYear();
  const diaHoje = hoje.getDate();

  // All escalas for this pelotao/mes/ano (can be multiple)
  const escalasDoPeriodo = escalas.filter(e => e.pelotaoId===pelotao.id && e.mes===mes && e.ano===ano);
  const escalaAtual = escalasDoPeriodo.find(e=>e.id===escalaSel) || escalasDoPeriodo[0] || null;

  // Key: pid + "_" + dia  (not grupoId!)
  // Isso garante que remover um dia de um policial não afeta outro

  function updateCell(eid, pid, dia, leg) {
    setEscalas(es=>es.map(e=> e.id!==eid ? e : {
      ...e,
      celulas: {...(e.celulas||{}), [pid+"_"+dia]: leg || undefined}
    }));
  }

  // ── Geração automática das células ───────────────────────────────────────
  // Para 24x96: grupo A começa dia 1, B dia 2, C dia 3, D dia 4, E dia 5
  // Para 12x24x72: grupo A dia (1 turno dia), B dia (1 noite), C dia (2 dia), D dia (2 noite)...
  function gerarCelulas(tipo, grupos, hi1, hi2) {
    const celulas = {};
    const gruposList = grupos.map(g=>g.id).sort();
    const n = gruposList.length;

    if (tipo === "24x96") {
      for (let d=1; d<=diasNoMes; d++) {
        gruposList.forEach((gId, gi) => {
          const membros = grupos.find(g=>g.id===gId)?.membros || [];
          if ((d-1-gi) % n === 0) {
            membros.forEach(pid => { celulas[pid+"_"+d] = "C8"; });
          }
        });
      }
    } else {
      // 12x24 12x72: a cada dia há 2 turnos (dia e noite)
      // posição no ciclo = (dia-1)*2 + turno (0=dia,1=noite)
      // grupo gi trabalha quando ciclo % n === gi
      // legenda: turno 0 = hi1 (ex C8 06-18), turno 1 = hi2 (ex C9 18-06)
      const legDia   = hi1==="06:30" ? "R19" : "C8";
      const legNoite = hi2==="18:30" ? "R20" : "C9";
      for (let d=1; d<=diasNoMes; d++) {
        gruposList.forEach((gId, gi) => {
          const membros = grupos.find(g=>g.id===gId)?.membros || [];
          const cicloD = ((d-1)*2)   % n;
          const cicloN = ((d-1)*2+1) % n;
          if (gi === cicloD) membros.forEach(pid => { celulas[pid+"_"+d] = legDia; });
          if (gi === cicloN) membros.forEach(pid => { celulas[pid+"_"+d] = legNoite; });
        });
      }
    }
    return celulas;
  }

  function criarEscala() {
    if (!formEscala.nome.trim()) { alert("Nome obrigatório (ex: CENTRO, CANDEIAS)."); return; }
    const novosGrupos = ["A","B","C","D","E"].map(id=>({id, membros:[]}));
    const nova = {
      id: Date.now(),
      pelotaoId: pelotao.id,
      mes, ano,
      nome: formEscala.nome.trim().toUpperCase(),
      tipo: formEscala.tipo,
      horaInicio:  formEscala.horaInicio,
      horaFim:     formEscala.horaFim,
      horaInicio2: formEscala.horaInicio2,
      horaFim2:    formEscala.horaFim2,
      titulo: "ESCALA ORDINÁRIA "+["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"][mes-1]+"/"+ano,
      grupos: novosGrupos,
      celulas: {},
    };
    setEscalas(es=>[...es, nova]);
    setEscalaSel(nova.id);
    setModalCriar(false);
    setFormEscala({nome:"",tipo:"24x96",horaInicio:"06:30",horaFim:"18:30",horaInicio2:"18:30",horaFim2:"06:30"});
  }

  function excluirEscala(eid) {
    setEscalas(es=>es.filter(e=>e.id!==eid));
    setEscalaSel(null);
  }

  function addMembro(eid, gId, pid) {
    setEscalas(es=>es.map(e=> {
      if (e.id!==eid) return e;
      const gruposList = ["A","B","C","D","E"];
      const gi = gruposList.indexOf(gId); // 0=A,1=B,2=C,3=D,4=E
      const n = gruposList.length; // 5
      const novasCelulas = {...(e.celulas||{})};

      const legDia   = (e.horaInicio||"").startsWith("06:3") ? "R19" : "C8";
      const legNoite = (e.horaInicio2||"").startsWith("18:3") ? "R20" : "C9";

      if (e.tipo==="24x96") {
        // Cada grupo trabalha 1 dia e folga 4 (ciclo de 5)
        // Legenda 24x96 = F5 (06h às 06h = 24h)
        for (let d=1; d<=diasNoMes; d++) {
          if ((d-1-gi) % n === 0) novasCelulas[pid+"_"+d] = "F5";
        }
      } else {
        // 12x24x72 — ciclo de 5 dias: 1 DIA + 1 NOITE + 3 FOLGAS
        // A: DIA dia1, NOITE dia2, folga 3,4,5
        // B: NOITE dia1, folga 2,3,4, DIA dia5, NOITE dia6...
        // C: DIA dia2, NOITE dia3, folga 4,5,6
        // D: NOITE dia2, folga 3,4,5, DIA dia6... (mesmo pos A, turno noite)
        // E: DIA dia3, NOITE dia4, folga 5,6,7
        const SLOTS = {A:{dia:0,noite:1},B:{dia:4,noite:0},C:{dia:1,noite:2},D:{dia:2,noite:3},E:{dia:3,noite:4}};
        const s = SLOTS[gId]||{dia:0,noite:1};
        for (let d=1; d<=diasNoMes; d++) {
          const pos=(d-1)%5;
          if(pos===s.dia)   novasCelulas[pid+"_"+d]=legDia;
          if(pos===s.noite) novasCelulas[pid+"_"+d]=legNoite;
        }
      }

      return {
        ...e,
        celulas: novasCelulas,
        grupos: e.grupos.map(g=> g.id!==gId ? g : {
          ...g, membros:[...new Set([...g.membros, pid])]
        })
      };
    }));
  }

  function removeMembro(eid, gId, pid) {
    // Remove policial do grupo E das celulas
    setEscalas(es=>es.map(e=> e.id!==eid ? e : {
      ...e,
      grupos: e.grupos.map(g=> g.id!==gId ? g : {
        ...g, membros: g.membros.filter(x=>x!==pid)
      }),
      celulas: Object.fromEntries(
        Object.entries(e.celulas||{}).filter(([k])=>!k.startsWith(pid+"_"))
      )
    }));
  }

  // ── Cálculo de horas por policial ─────────────────────────────────────────
  // 12x24x72: ao fazer serviço de DIAS alternados (dia/noite), conta certo
  function calcHorasPolicial(escala, pid) {
    if (!escala) return {total:0, noturno:0};
    let total=0, noturno=0;
    for (let d=1; d<=diasNoMes; d++) {
      const leg = (escala.celulas||{})[pid+"_"+d];
      if (!leg) continue;
      total   += HORAS_LEGENDA[leg]   || 0;
      noturno += NOTURNO_LEGENDA[leg] || 0;
    }
    return {total, noturno};
  }

  // ── Em serviço hoje ────────────────────────────────────────────────────────
  const emServicoPorEscala = escalasDoPeriodo.map(esc=>{
    if (!isCurrentMonth) return {escala:esc, servicos:[]};
    const servicos = esc.grupos.flatMap(g =>
      g.membros.filter(pid=>{
        const leg=(esc.celulas||{})[pid+"_"+diaHoje];
        return leg && !["F","JMS","LP","AT","D","P","LM","CR"].includes(leg);
      }).map(pid=>({pid, grupo:g.id, leg:(esc.celulas||{})[pid+"_"+diaHoje]}))
    );
    return {escala:esc, servicos};
  }).filter(x=>x.servicos.length>0);

  const thS = {padding:"3px 2px",textAlign:"center",fontSize:10,fontWeight:600,borderBottom:"2px solid #1e3a5f",minWidth:28,background:"#f8faff",whiteSpace:"nowrap"};
  const tdS = {padding:"2px",textAlign:"center",fontSize:11,borderBottom:"1px solid #f0f0f0"};
  const DS  = ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"];

  return (
    <div>
      {/* Modal criar */}
      {modalCriar&&(
        <Modal title="Nova escala" onClose={()=>setModalCriar(false)}>
          <Input label="Nome (ex: CENTRO, CANDEIAS, BCS)" value={formEscala.nome} onChange={e=>setFE("nome",e.target.value)} placeholder="CENTRO"/>
          <Select label="Tipo de escala" value={formEscala.tipo} onChange={e=>setFE("tipo",e.target.value)}>
            <option value="24x96">24x96 (24h serviço / 96h folga)</option>
            <option value="12x24x72">12x24 12x72 (dois turnos por dia)</option>
          </Select>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Input label="Início 1º turno" type="time" value={formEscala.horaInicio} onChange={e=>setFE("horaInicio",e.target.value)}/>
            <Input label="Fim 1º turno" type="time" value={formEscala.horaFim} onChange={e=>setFE("horaFim",e.target.value)}/>
            {formEscala.tipo==="12x24x72"&&<>
              <Input label="Início 2º turno" type="time" value={formEscala.horaInicio2} onChange={e=>setFE("horaInicio2",e.target.value)}/>
              <Input label="Fim 2º turno" type="time" value={formEscala.horaFim2} onChange={e=>setFE("horaFim2",e.target.value)}/>
            </>}
          </div>
          <div style={{background:"#f0f4ff",borderRadius:7,padding:8,fontSize:12,marginTop:6}}>
            <strong>ESCALA ORDINÁRIA {["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"][mes-1]}/{ano}</strong>
            {formEscala.nome?" — "+formEscala.nome.toUpperCase():""}
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:12}}>
            <Btn variant="secondary" onClick={()=>setModalCriar(false)}>Cancelar</Btn>
            <Btn onClick={criarEscala}>✓ Criar</Btn>
          </div>
        </Modal>
      )}

      {/* Modal grupo */}
      {modalGrupo&&escalaAtual&&(()=>{
        const {grupoId:gId, escalaId:eId} = modalGrupo;
        const g = escalaAtual.grupos.find(x=>x.id===gId)||{membros:[]};
        const [bg,fg] = GRUPO_CORES[gId]||["#1e3a5f","#fff"];
        return (
          <Modal title={"Grupo "+gId+" — "+escalaAtual.nome} onClose={()=>setModalGrupo(null)}>
            <div style={{background:bg,color:fg,borderRadius:7,padding:"5px 12px",fontWeight:700,marginBottom:10}}>GRUPO {gId}</div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:600,marginBottom:5}}>Adicionar policial</div>
              <BuscaPolicial officers={officers} excluirIds={g.membros} onSelect={o=>addMembro(eId,gId,o.id)}/>
            </div>
            {g.membros.map(pid=>{
              const o=officers.find(x=>x.id===pid); if(!o) return null;
              return (
                <div key={pid} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f0f0f0"}}>
                  <Avatar name={o.nome} size={26}/>
                  <div style={{flex:1,fontSize:12}}><strong>{o.grau}</strong> {o.nome}</div>
                  <button onClick={()=>removeMembro(eId,gId,pid)} style={{background:"#fee2e2",border:"none",borderRadius:5,padding:"3px 8px",color:"#dc2626",cursor:"pointer",fontSize:12}}>Excluir</button>
                </div>
              );
            })}
            {g.membros.length===0&&<p style={{fontSize:12,color:"#9ca3af",textAlign:"center"}}>Nenhum policial no grupo.</p>}
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}><Btn onClick={()=>setModalGrupo(null)}>✓ Fechar</Btn></div>
          </Modal>
        );
      })()}

      {/* Modal editar célula */}
      {editCell&&escalaAtual&&(()=>{
        const o = officers.find(x=>x.id===editCell.pid);
        return (
          <Modal title={"Dia "+editCell.dia+" — "+(o?o.grau+" "+o.nome:"")} onClose={()=>setEditCell(null)}>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:8}}>Selecione a legenda ou limpe o campo:</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
              {Object.entries(LEGENDAS_ESCALA).map(([leg,desc])=>(
                <button key={leg} onClick={()=>setEditLeg(editLeg===leg?"":leg)}
                  style={{padding:"4px 8px",borderRadius:5,border:"2px solid "+(editLeg===leg?"#1e3a5f":"#e5e7eb"),background:editLeg===leg?"#1e3a5f":"#fff",color:editLeg===leg?"#fff":"#374151",fontSize:11,cursor:"pointer"}}>
                  <strong>{leg}</strong> <span style={{fontSize:9,opacity:0.7}}>{desc}</span>
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="secondary" onClick={()=>{updateCell(escalaAtual.id,editCell.pid,editCell.dia,"");setEditCell(null);}}>🗑 Limpar</Btn>
              <Btn variant="secondary" onClick={()=>setEditCell(null)}>Cancelar</Btn>
              <Btn onClick={()=>{updateCell(escalaAtual.id,editCell.pid,editCell.dia,editLeg);setEditCell(null);}}>✓ Salvar</Btn>
            </div>
          </Modal>
        );
      })()}

      {/* Confirm excluir escala */}
      {confirmDel&&<Confirm msg={"Excluir escala "+confirmDel.nome+"?"} onYes={()=>{excluirEscala(confirmDel.id);setConfirmDel(null);}} onNo={()=>setConfirmDel(null)}/>}

      {/* Header: abas de escalas + botão criar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",flex:1}}>
          {escalasDoPeriodo.map(e=>(
            <button key={e.id} onClick={()=>setEscalaSel(e.id)}
              style={{padding:"5px 14px",border:"2px solid "+(escalaSel===e.id?"#1e3a5f":"#e5e7eb"),borderRadius:6,background:escalaSel===e.id?"#1e3a5f":"#fff",color:escalaSel===e.id?"#fff":"#374151",fontSize:12,cursor:"pointer",fontWeight:escalaSel===e.id?700:400}}>
              {e.nome||"Escala"}
            </button>
          ))}
          <button onClick={()=>setModalCriar(true)}
            style={{padding:"5px 12px",border:"2px dashed #d1d5db",borderRadius:6,background:"transparent",color:"#6b7280",fontSize:12,cursor:"pointer"}}>
            + Nova escala
          </button>
        </div>
      </div>

      {/* Info da escala selecionada */}
      {escalaAtual&&(
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,background:"#f8faff",borderRadius:7,padding:"8px 12px",border:"1px solid #e5e7eb"}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{escalaAtual.titulo} — {escalaAtual.nome}</div>
            <div style={{fontSize:11,color:"#6b7280"}}>{escalaAtual.tipo==="24x96"?"24x96":"12x24 12x72"} · {escalaAtual.horaInicio}-{escalaAtual.horaFim}{escalaAtual.horaInicio2?" | "+escalaAtual.horaInicio2+"-"+escalaAtual.horaFim2:""}</div>
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            {["A","B","C","D","E"].map(g=>{
              const [bg,fg]=GRUPO_CORES[g]||["#1e3a5f","#fff"];
              const c=(escalaAtual.grupos.find(x=>x.id===g)?.membros||[]).length;
              return <button key={g} onClick={()=>setModalGrupo({grupoId:g,escalaId:escalaAtual.id})}
                style={{background:bg,color:fg,border:"none",borderRadius:5,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                {g} ({c})
              </button>;
            })}
            <button onClick={()=>setConfirmDel(escalaAtual)} style={{background:"#fee2e2",border:"none",borderRadius:5,padding:"4px 8px",color:"#dc2626",cursor:"pointer",fontSize:11}}>🗑</button>
          </div>
        </div>
      )}

      {/* Em serviço hoje — por escala */}
      {isCurrentMonth&&emServicoPorEscala.length>0&&(
        <div style={{marginBottom:12}}>
          {emServicoPorEscala.map(({escala:esc,servicos})=>(
            <Card key={esc.id} style={{marginBottom:6,background:"#f0f4ff",border:"1px solid #c7d7f9"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1e3a5f",marginBottom:5}}>{esc.nome} — Em serviço hoje (dia {diaHoje})</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {servicos.map(({pid,grupo,leg})=>{
                  const o=officers.find(x=>x.id===pid); if(!o) return null;
                  const [bg,fg]=GRUPO_CORES[grupo]||["#1e3a5f","#fff"];
                  return <span key={pid} style={{background:bg,color:fg,borderRadius:999,padding:"2px 9px",fontSize:11}}>
                    <strong>{grupo}</strong> {o.nomeGuerra||o.nome.split(" ")[0]} · {leg}
                  </span>;
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tabela de escala */}
      {escalaAtual&&(()=>{
        const pDia = new Date(ano,mes-1,1).getDay();
        const dias = Array.from({length:diasNoMes},(_,i)=>i+1);
        return (
          <div>
            {escalaAtual.grupos.map(g=>{
              const membros = g.membros||[];
              if(!membros.length) return null;
              const [bgG]=GRUPO_CORES[g.id]||["#1e3a5f"];
              // Ordenar por grau hierárquico
              const membrosOrdenados = [...membros].sort((a,b)=>{
                const oa=officers.find(x=>x.id===a); const ob=officers.find(x=>x.id===b);
                if(!oa||!ob) return 0;
                return rankSort(oa,ob);
              });
              return (
                <div key={g.id} style={{marginBottom:18}}>
                  <div style={{background:bgG,color:"#fff",padding:"4px 12px",fontWeight:700,fontSize:12,borderRadius:"6px 6px 0 0"}}>GRUPO {g.id}</div>
                  <div style={{overflowX:"auto"}}>
                    <table style={{borderCollapse:"collapse",fontSize:10,width:"100%",tableLayout:"fixed"}}>
                      <thead>
                        <tr>
                          <th style={{...thS,width:180,textAlign:"left",padding:"4px 6px"}}>Nome</th>
                          <th style={{...thS,width:85,textAlign:"left",padding:"4px 6px"}}>Função</th>
                          {dias.map(d=>{
                            const ds=DS[(pDia+d-1)%7];
                            const isW=ds==="Sab"||ds==="Dom";
                            const isH=isCurrentMonth&&d===diaHoje;
                            return <th key={d} style={{...thS,width:26,background:isH?"#1e3a5f":isW?"#fee2e2":"#f8faff",color:isH?"#fff":isW?"#991b1b":"#374151"}}>
                              <div style={{fontSize:8}}>{ds}</div>
                              <div>{d}</div>
                            </th>;
                          })}
                          <th style={{...thS,width:36,background:"#374151",color:"#fff",fontSize:9}}>Ad.Not</th>
                          <th style={{...thS,width:44,background:"#1e3a5f",color:"#fff",fontSize:9}}>Total h</th>
                          <th style={{...thS,width:28,background:"#4b5563",color:"#fff",fontSize:9}}>VD</th>
                          <th style={{...thS,width:28,background:"#4b5563",color:"#fff",fontSize:9}}>HE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {membrosOrdenados.map(pid=>{
                          const o=officers.find(x=>x.id===pid); if(!o) return null;
                          const {total,noturno} = calcHorasPolicial(escalaAtual, pid);
                          return (
                            <tr key={pid}>
                              <td style={{...tdS,textAlign:"left",padding:"3px 6px",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                                {o.grau} {o.nome.toUpperCase()} {cleanMat(o.matricula)}
                              </td>
                              <td style={{...tdS,textAlign:"left",padding:"3px 6px",color:"#6b7280",fontSize:9,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                                {o.cargo||""}
                              </td>
                              {dias.map(d=>{
                                const leg=(escalaAtual.celulas||{})[pid+"_"+d];
                                const ds=DS[(pDia+d-1)%7];
                                const isW=ds==="Sab"||ds==="Dom";
                                const isH=isCurrentMonth&&d===diaHoje;
                                const bg=leg?(leg==="F"?"#dbeafe":leg==="JMS"||leg==="AT"?"#fee2e2":leg==="CR"?"#fef3c7":"#dcfce7"):isH?"#eff6ff":isW?"#fff5f5":"#fff";
                                return (
                                  <td key={d} style={{...tdS,background:bg,cursor:"pointer",fontWeight:leg?700:400,color:leg?"#1e3a5f":"#e5e7eb"}}
                                    onClick={()=>{setEditCell({escalaId:escalaAtual.id,grupoId:g.id,pid,dia:d});setEditLeg(leg||"");}}>
                                    {leg||""}
                                  </td>
                                );
                              })}
                              <td style={{...tdS,fontWeight:700,background:"#f0f4ff"}}>{noturno||""}</td>
                              <td style={{...tdS,fontWeight:700,color:"#1e3a5f",background:"#dbeafe"}}>{total||""}</td>
                              <td style={{...tdS,background:"#f9fafb"}}></td>
                              <td style={{...tdS,background:"#f9fafb"}}></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
            {/* Legendas */}
            <div style={{padding:"6px 10px",background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:6,fontSize:10,color:"#374151",marginTop:6,lineHeight:1.6}}>
              <strong>Legendas:</strong> [ {Object.entries(LEGENDAS_ESCALA).map(([k,v])=>k+": "+v).join(", ")} ]
            </div>
          </div>
        );
      })()}

      {escalasDoPeriodo.length===0&&(
        <div style={{textAlign:"center",padding:36,color:"#9ca3af",background:"#f9fafb",borderRadius:10,border:"2px dashed #e5e7eb"}}>
          <div style={{fontSize:28,marginBottom:8}}>📋</div>
          <div style={{fontWeight:500}}>Nenhuma escala para {["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"][mes-1]}/{ano}</div>
          <div style={{marginTop:10}}><Btn onClick={()=>setModalCriar(true)}>+ Criar escala</Btn></div>
        </div>
      )}
    </div>
  );
}
// ─── Aba Efetivo Pelotão ─────────────────────────────────────────────────────
function AbaEfetivoPelotao({ pelotao, officers, afastamentos, ferias, mes, ano }) {
  const [fSit, setFSit] = useState("todos");
  const mesNome = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"][mes-1];
  const manualKey = mes+"_"+ano;
  const manuais = (pelotao.manualMes||{})[manualKey]||[];
  const baseIds = officers.filter(o=>(pelotao.locais||[]).includes(o.localTrabalho||"")).map(o=>o.id);
  const allIds = [...new Set([...baseIds,...manuais])];
  const membros = officers.filter(o=>allIds.includes(o.id));
  const getSit = o => getSituacaoReal(o, afastamentos, ferias);
  let lista = fSit==="todos" ? membros
    : fSit==="Férias"   ? membros.filter(o=>getSit(o)==="Férias")
    : fSit==="JMS"      ? membros.filter(o=>getSit(o)==="Junta Médica")
    : fSit==="Atestado" ? membros.filter(o=>getSit(o)==="Atestado")
    : membros.filter(o=>(o.situacao||"Ativo")===fSit);
  lista = lista.sort(rankSort);
  const masc = membros.filter(o=>(o.sexo||"MASC")==="MASC").length;
  const fem  = membros.filter(o=>o.sexo==="FEM").length;
  const byGrau = {};
  membros.forEach(o=>{byGrau[o.grau]=(byGrau[o.grau]||0)+1;});
  const hoje2 = new Date();
  const aniv = membros.filter(o=>o.dataNasc&&parseInt((o.dataNasc||"").split("-")[1])===mes)
    .sort((a,b)=>parseInt(a.dataNasc.split("-")[2])-parseInt(b.dataNasc.split("-")[2]));
  const anivHoje = mes===hoje2.getMonth()+1 ? aniv.filter(o=>parseInt((o.dataNasc||"").split("-")[2])===hoje2.getDate()) : [];
  return (
    <div>
      {anivHoje.length>0&&(
        <div style={{background:"#fce7f3",border:"1px solid #f9a8d4",borderRadius:8,padding:"8px 14px",marginBottom:12,fontSize:13}}>
          🎂 <strong>Aniversariante(s) hoje:</strong> {anivHoje.map(o=>o.grau+" "+o.nome).join(", ")}
        </div>
      )}
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <div style={{background:"#1e3a5f",color:"#fff",borderRadius:7,padding:"6px 14px",fontSize:13,fontWeight:600}}>Total: {membros.length}</div>
        <div style={{background:"#3b82f6",color:"#fff",borderRadius:7,padding:"6px 14px",fontSize:13,fontWeight:600}}>M: {masc}</div>
        <div style={{background:"#ec4899",color:"#fff",borderRadius:7,padding:"6px 14px",fontSize:13,fontWeight:600}}>F: {fem}</div>
        {Object.entries(byGrau).map(([g,c])=>(
          <div key={g} style={{background:"#f3f4f6",borderRadius:7,padding:"6px 10px",fontSize:11,fontWeight:500}}>{g}: {c}</div>
        ))}
      </div>
      {aniv.length>0&&(
        <Card style={{marginBottom:12}}>
          <div style={{fontWeight:600,fontSize:12,color:"#9d174d",marginBottom:6}}>🎂 Aniversariantes de {mesNome}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {aniv.map(o=>{
              const dia=parseInt((o.dataNasc||"").split("-")[2]);
              const isHj=dia===hoje2.getDate()&&mes===hoje2.getMonth()+1;
              return <span key={o.id} style={{background:isHj?"#fce7f3":"#f3f4f6",color:isHj?"#9d174d":"#374151",borderRadius:999,padding:"2px 9px",fontSize:11}}>
                {String(dia).padStart(2,"0")} — {o.grau} {o.nome}{isHj?" 🎉":""}
              </span>;
            })}
          </div>
        </Card>
      )}
      <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
        {["todos","Ativo","Férias","JMS","Atestado"].map(s=>(
          <button key={s} onClick={()=>setFSit(s)}
            style={{padding:"4px 11px",border:"2px solid "+(fSit===s?"#1e3a5f":"#e5e7eb"),borderRadius:6,background:fSit===s?"#1e3a5f":"#fff",color:fSit===s?"#fff":"#374151",fontSize:11,cursor:"pointer",fontWeight:fSit===s?600:400}}>
            {s==="todos"?"Todos":s}
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {lista.map(o=>(
          <div key={o.id} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:7,padding:"7px 12px",display:"flex",alignItems:"center",gap:9}}>
            <Avatar name={o.nome} size={30}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:12}}>{o.grau} {o.nome.toUpperCase()}</div>
              <div style={{fontSize:10,color:"#6b7280"}}>Mat. {cleanMat(o.matricula)}{o.cargo?" · "+o.cargo:""}</div>
            </div>
            <SitBadge sit={getSit(o)}/>
            {o.sexo==="FEM"&&<Badge color="#fce7f3" textColor="#9d174d" size={10}>F</Badge>}
          </div>
        ))}
        {lista.length===0&&<div style={{textAlign:"center",padding:24,color:"#9ca3af"}}>Nenhum policial encontrado.</div>}
      </div>
    </div>
  );
}

// ─── ModPelotao principal ────────────────────────────────────────────────────
function ModPelotao({ officers, afastamentos, ferias, vantagens, pelotoes, setPelotoes, escalas, setEscalas, loggedUser, perm, locations }) {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth()+1);
  const [ano, setAno] = useState(hoje.getFullYear());
  const [pelSel, setPelSel] = useState(null);
  const [aba, setAba] = useState("efetivo");
  const [modalNovo, setModalNovo] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [formPel, setFormPel] = useState({nome:"",comandanteId:"",locais:[],comandanteNome:""});
  const [modalAddManual, setModalAddManual] = useState(false);
  const setFP = (k,v) => setFormPel(f=>({...f,[k]:v}));

  const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  function savePelotao(dados, isEdit) {
    if (!dados.nome.trim()) { alert("Nome obrigatório."); return; }
    if (isEdit) {
      setPelotoes(ps=>ps.map(p=>p.id===isEdit?{...p,...dados}:p));
    } else {
      setPelotoes(ps=>[...ps,{...dados, id:Date.now(), manualMes:{}}]);
    }
    setModalNovo(false); setModalEditar(null);
  }

  function canView() { return true; } // Todos podem visualizar
  function canEdit(pel) {
    if (perm.admin) return true;
    if (!pel.comandanteId) return false;
    return pel.comandanteId===loggedUser?.matricula ||
           pel.comandanteId===String(loggedUser?.id) ||
           cleanMat(pel.comandanteId)===cleanMat(loggedUser?.matricula||"");
  }

  const ABAS_PEL = ["efetivo","escala","extras","ocorrências","saúde","vantagens"];

  // Form helpers
  function toggleLocal(loc) {
    setFormPel(f=>({...f, locais: f.locais.includes(loc)?f.locais.filter(l=>l!==loc):[...f.locais,loc]}));
  }

  // ── Tela interna do pelotão ──
  if (pelSel) {
    const pel = pelotoes.find(p=>p.id===pelSel);
    if (!pel) { setPelSel(null); return null; }

    // canEdit controls edit buttons; all users can view

    const manualKey = mes+"_"+ano;
    const cmd = officers.find(o=>cleanMat(o.matricula)===pel.comandanteId||String(o.id)===pel.comandanteId);

    return (
      <div>
        {modalAddManual&&(
          <Modal title="Adicionar policial manual" onClose={()=>setModalAddManual(false)}>
            <p style={{fontSize:12,color:"#6b7280",marginBottom:8}}>Válido apenas para {MESES[mes-1]}/{ano}.</p>
            <BuscaPolicial officers={officers} excluirIds={(pel.manualMes||{})[manualKey]||[]} onSelect={o=>{
              setPelotoes(ps=>ps.map(p=>p.id!==pel.id?p:{...p,manualMes:{...(p.manualMes||{}),[manualKey]:[...new Set([...((p.manualMes||{})[manualKey]||[]),o.id])]}}));
              setModalAddManual(false);
            }}/>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}><Btn variant="secondary" onClick={()=>setModalAddManual(false)}>Fechar</Btn></div>
          </Modal>
        )}

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setPelSel(null)} style={{background:"#f3f4f6",border:"none",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12}}>← Voltar</button>
            <div>
              <div style={{fontWeight:700,fontSize:16,color:"#1e3a5f"}}>&#128081; {pel.nome}</div>
              {cmd&&<div style={{fontSize:11,color:"#6b7280"}}>Cmt: {cmd.grau} {cmd.nome}</div>}
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <select value={mes} onChange={e=>setMes(Number(e.target.value))} style={{padding:"5px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:12,outline:"none"}}>
              {MESES.map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}
            </select>
            <select value={ano} onChange={e=>setAno(Number(e.target.value))} style={{padding:"5px 8px",border:"1px solid #d1d5db",borderRadius:6,fontSize:12,outline:"none"}}>
              {[2024,2025,2026,2027].map(a=><option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div style={{display:"flex",gap:2,marginBottom:14,borderBottom:"2px solid #e5e7eb",flexWrap:"wrap"}}>
          {ABAS_PEL.map(a=>(
            <button key={a} onClick={()=>setAba(a)}
              style={{padding:"7px 15px",border:"none",borderBottom:"2px solid "+(aba===a?"#1e3a5f":"transparent"),background:"transparent",cursor:"pointer",fontSize:11,fontWeight:aba===a?700:400,color:aba===a?"#1e3a5f":"#6b7280",textTransform:"uppercase",marginBottom:-2}}>
              {a}
            </button>
          ))}
          {aba==="efetivo"&&(
            <button onClick={()=>setModalAddManual(true)} style={{marginLeft:"auto",padding:"5px 11px",background:"#1e3a5f",color:"#fff",border:"none",borderRadius:6,fontSize:11,cursor:"pointer",fontWeight:600}}>
              + Manual
            </button>
          )}
        </div>

        {aba==="efetivo"&&<AbaEfetivoPelotao pelotao={pel} officers={officers} afastamentos={afastamentos} ferias={ferias} mes={mes} ano={ano}/>}
        {aba==="escala"&&<AbaEscala pelotao={pel} escalas={escalas} setEscalas={setEscalas} officers={officers} mes={mes} ano={ano} afastamentos={afastamentos} ferias={ferias}/>}
        {["extras","ocorrências","saúde","vantagens"].includes(aba)&&(
          <div style={{textAlign:"center",padding:40,color:"#9ca3af",background:"#f9fafb",borderRadius:10,border:"2px dashed #e5e7eb"}}>
            <div style={{fontSize:28,marginBottom:8}}>🚧</div>
            <div style={{fontWeight:500,fontSize:14}}>Aba <strong>{aba.toUpperCase()}</strong> em desenvolvimento</div>
          </div>
        )}
      </div>
    );
  }

  // ── Modal criar/editar pelotão ──
  // ── Tela de listagem ──
  return (
    <div>
      {confirm&&<Confirm msg={confirm.msg} onYes={()=>{confirm.action();setConfirm(null);}} onNo={()=>setConfirm(null)}/>}

      {(modalNovo||modalEditar)&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:1000,overflowY:"auto",padding:"24px 12px"}}>
          <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:540,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#1e3a5f,#2d5986)",padding:"13px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:14}}>{modalNovo?"Novo pelotão":"Editar — "+(modalEditar?.nome||"")}</span>
              <button onClick={()=>{setModalNovo(false);setModalEditar(null);}} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"3px 10px",cursor:"pointer"}}>✕</button>
            </div>
            <div style={{padding:20}}>
              <div style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:4}}>Nome do pelotão</label>
                <input value={formPel.nome} onChange={e=>setFP("nome",e.target.value)} placeholder="Ex: 1º Pelotão"
                  style={{width:"100%",padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Comandante de pelotão</div>
                <BuscaPolicial officers={officers} excluirIds={[]} onSelect={o=>{setFP("comandanteId",cleanMat(o.matricula));setFP("comandanteNome",o.grau+" "+o.nome);}}/>
                {formPel.comandanteNome&&<div style={{background:"#f0f4ff",borderRadius:6,padding:"5px 10px",fontSize:12,marginTop:5}}>{formPel.comandanteNome}</div>}
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Locais de trabalho vinculados</div>
                <div style={{fontSize:11,color:"#6b7280",marginBottom:6}}>Os policiais lotados nestes locais serão incluídos automaticamente no efetivo do pelotão.</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,maxHeight:200,overflowY:"auto",padding:4}}>
                  {(locations||[]).map(loc=>{
                    const sel=formPel.locais.includes(loc);
                    return <button key={loc} onClick={()=>toggleLocal(loc)}
                      style={{padding:"4px 10px",borderRadius:6,border:"2px solid "+(sel?"#1e3a5f":"#e5e7eb"),background:sel?"#1e3a5f":"#fff",color:sel?"#fff":"#374151",fontSize:11,cursor:"pointer",fontWeight:sel?600:400}}>
                      {loc}
                    </button>;
                  })}
                  {(!locations||!locations.length)&&<span style={{fontSize:11,color:"#9ca3af"}}>Nenhum local cadastrado.</span>}
                </div>
                {formPel.locais.length>0&&<div style={{fontSize:11,color:"#1e3a5f",marginTop:4,fontWeight:500}}>{formPel.locais.length} local(is) selecionado(s)</div>}
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <Btn variant="secondary" onClick={()=>{setModalNovo(false);setModalEditar(null);}}>Cancelar</Btn>
                <Btn onClick={()=>modalNovo?savePelotao(formPel,false):savePelotao(formPel,modalEditar.id)}>💾 Salvar</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{fontSize:18,fontWeight:700,margin:0}}>&#128081; Gestão de Pelotão</h2>
        {perm.admin&&<Btn onClick={()=>{setFormPel({nome:"",comandanteId:"",locais:[],comandanteNome:""});setModalNovo(true);}}>+ Novo pelotão</Btn>}
      </div>

      {pelotoes.length===0&&(
        <div style={{textAlign:"center",padding:48,color:"#9ca3af",background:"#f9fafb",borderRadius:10,border:"2px dashed #e5e7eb"}}>
          <div style={{fontSize:32,marginBottom:8}}>&#128081;</div>
          <div style={{fontSize:14,fontWeight:500}}>Nenhum pelotão cadastrado ainda.</div>
          {perm.admin&&<div style={{fontSize:12,marginTop:4}}>Clique em "+ Novo pelotão" para criar.</div>}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {pelotoes.map(pel=>{
          const cmd = officers.find(o=>cleanMat(o.matricula)===pel.comandanteId||String(o.id)===pel.comandanteId);
          const count = officers.filter(o=>(pel.locais||[]).includes(o.localTrabalho||"")).length;
          const acesso = canEdit(pel);
          return (
            <div key={pel.id} style={{background:"#fff",border:"2px solid "+(acesso?"#1e3a5f":"#e5e7eb"),borderRadius:10,padding:16,cursor:"pointer",transition:"all 0.15s",opacity:acesso?1:0.65}}
              onClick={()=>setPelSel(pel.id)}
              onMouseEnter={e=>{if(acesso){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.1)";}}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{fontWeight:700,fontSize:15,color:"#1e3a5f"}}>&#128081; {pel.nome}</div>
                <Badge color={canEdit(pel)?"#dbeafe":"#dcfce7"} textColor={canEdit(pel)?"#1d4ed8":"#15803d"} size={10}>{canEdit(pel)?"✏️ Editar":"👁 Ver"}</Badge>
              </div>
              <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>{count} policial(is)</div>
              {(pel.locais||[]).length>0&&(
                <div style={{fontSize:10,color:"#6b7280",marginBottom:4}}>
                  Locais: {pel.locais.join(", ")}
                </div>
              )}
              {cmd
                ? <div style={{fontSize:11,background:"#f0f4ff",borderRadius:5,padding:"3px 8px",color:"#1d4ed8",marginBottom:8}}>Cmt: {cmd.grau} {cmd.nome}</div>
                : <div style={{fontSize:11,color:"#d97706",marginBottom:8}}>⚠️ Sem comandante</div>}
              {canEdit(pel)&&(
                <div style={{display:"flex",gap:5}} onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>{
                    const cmd2=officers.find(o=>cleanMat(o.matricula)===pel.comandanteId||String(o.id)===pel.comandanteId);
                    setFormPel({nome:pel.nome,comandanteId:pel.comandanteId||"",locais:pel.locais||[],comandanteNome:cmd2?cmd2.grau+" "+cmd2.nome:""});
                    setModalEditar(pel);
                  }} style={{flex:1,background:"#f3f4f6",border:"none",borderRadius:5,padding:"4px",fontSize:11,cursor:"pointer"}}>✏️ Editar</button>
                  {perm.admin&&<button onClick={()=>setConfirm({msg:"Excluir pelotão "+pel.nome+"?",action:()=>setPelotoes(ps=>ps.filter(p=>p.id!==pel.id))})}
                    style={{background:"#fee2e2",border:"none",borderRadius:5,padding:"4px 8px",fontSize:11,cursor:"pointer",color:"#dc2626"}}>🗑</button>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MODULOS_SISTEMA = [
  {id:"efetivo",     label:"Efetivo"},
  {id:"locais",      label:"Locais de Trabalho"},
  {id:"ferias",      label:"Férias"},
  {id:"saude",       label:"Saúde"},
  {id:"cursos",      label:"Cursos"},
  {id:"vantagens",   label:"Vantagens"},
  {id:"corregedoria",label:"Corregedoria"},
  {id:"exportar",    label:"Exportar"},
];

// Permissões padrão por perfil
const PERMS_PADRAO = {
  "Admin":        {efetivo:"editar",locais:"editar",ferias:"editar",saude:"editar",cursos:"editar",vantagens:"editar",corregedoria:"editar",exportar:"editar"},
  "SSO":          {efetivo:"editar",locais:"editar",ferias:"editar",saude:"editar",cursos:"editar",vantagens:"editar",corregedoria:"ver",exportar:"ver"},
  "SPO":          {efetivo:"ver",locais:"ver",ferias:"ver",saude:"ver",cursos:"ver",vantagens:"ver",corregedoria:"ver",exportar:"nenhum"},
  "ALMOX":        {efetivo:"ver",locais:"nenhum",ferias:"nenhum",saude:"nenhum",cursos:"nenhum",vantagens:"ver",corregedoria:"nenhum",exportar:"ver"},
  "Corregedoria": {efetivo:"ver",locais:"nenhum",ferias:"nenhum",saude:"nenhum",cursos:"nenhum",vantagens:"nenhum",corregedoria:"editar",exportar:"nenhum"},
};

function ModAdmin({ users, setUsers, officers }) {
  const [modal, setModal] = useState(null); // "novo" | {user}
  const [form, setForm] = useState({nome:"",matricula:"",grau:"",perfil:"SSO",modulos:{}});
  const [confirm, setConfirm] = useState(null);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  // When perfil changes, reset modulos to defaults
  function setPerfil(perfil) {
    setForm(f=>({...f, perfil, modulos:{...(PERMS_PADRAO[perfil]||{})}}));
  }

  function setModPerm(modId, perm) {
    setForm(f=>({...f, modulos:{...f.modulos, [modId]:perm}}));
  }

  function getModulos(formData) {
    // Merge defaults with custom
    const base = PERMS_PADRAO[formData.perfil]||{};
    return {...base, ...formData.modulos};
  }

  function save() {
    if (!form.matricula) { alert("Matrícula obrigatória."); return; }
    const mods = getModulos(form);
    if (modal==="novo") {
      const newU = {
        ...form, id:Date.now(), senha:form.matricula,
        ativo:true, primeiroAcesso:true, modulos:mods,
      };
      setUsers(us=>[...us, newU]);
    } else {
      setUsers(us=>us.map(x=>x.id===modal.id?{...x,...form,modulos:mods}:x));
    }
    setModal(null);
  }

  function openEdit(u) {
    const mods = u.modulos || PERMS_PADRAO[u.perfil] || {};
    setForm({nome:u.nome,matricula:u.matricula,grau:u.grau||"",perfil:u.perfil||"SSO",modulos:{...mods}});
    setModal(u);
  }

  const isNovo = modal==="novo";
  const modalTitle = isNovo ? "Novo usuário" : "Editar usuário";

  const NIVEL_LABELS = {nenhum:"🚫 Sem acesso", ver:"👁 Somente visualizar", editar:"✏️ Visualizar e editar"};
  const NIVEL_COLORS = {nenhum:["#f3f4f6","#6b7280"], ver:["#dbeafe","#1d4ed8"], editar:["#dcfce7","#15803d"]};

  return (
    <div>
      {confirm && <Confirm msg={confirm.msg} onYes={()=>{confirm.action();setConfirm(null);}} onNo={()=>setConfirm(null)}/>}

      {modal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:1000,overflowY:"auto",padding:"24px 12px"}}>
          <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:640,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#1e3a5f,#2d5986)",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:15}}>{modalTitle}</span>
              <button onClick={()=>setModal(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"4px 12px",cursor:"pointer",fontSize:12}}>✕</button>
            </div>
            <div style={{padding:20}}>
              {isNovo && (
                <div style={{marginBottom:12}}>
                  <label style={{display:"block",fontSize:12,color:"#374151",fontWeight:500,marginBottom:4}}>Buscar policial para vincular</label>
                  <BuscaPolicial officers={officers} excluirIds={[]} onSelect={o=>{
                    setForm(f=>({...f,nome:o.nome,matricula:o.matricula,grau:o.grau}));
                  }}/>
                </div>
              )}
              {form.nome && (
                <div style={{background:"#f0f4ff",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:13}}>
                  <strong>{form.grau} {form.nome}</strong> — Mat. {form.matricula}
                </div>
              )}
              <Input label="Nome completo" value={form.nome} onChange={e=>set("nome",e.target.value)}/>
              <Input label="Matrícula (login)" value={form.matricula} onChange={e=>set("matricula",e.target.value)}/>
              <div style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:12,color:"#374151",fontWeight:500,marginBottom:4}}>Perfil base</label>
                <select value={form.perfil} onChange={e=>setPerfil(e.target.value)}
                  style={{width:"100%",padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:8,fontSize:13,background:"#fff",outline:"none"}}>
                  {["Admin","SSO","SPO","ALMOX","Corregedoria"].map(p=><option key={p} value={p}>{p}</option>)}
                </select>
                <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>O perfil base define as permissões padrão abaixo, que podem ser ajustadas individualmente.</div>
              </div>

              {/* Permissões por módulo */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:8}}>Permissões por módulo</div>
                <div style={{border:"1px solid #e5e7eb",borderRadius:8,overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",background:"#f8faff",padding:"6px 12px",fontSize:11,fontWeight:600,color:"#6b7280",gap:4}}>
                    <span>MÓDULO</span>
                    <span style={{minWidth:80,textAlign:"center"}}>Sem acesso</span>
                    <span style={{minWidth:80,textAlign:"center"}}>Só ver</span>
                    <span style={{minWidth:80,textAlign:"center"}}>Ver+Editar</span>
                  </div>
                  {MODULOS_SISTEMA.map((mod,i)=>{
                    const cur = form.modulos[mod.id] || PERMS_PADRAO[form.perfil]?.[mod.id] || "nenhum";
                    return (
                      <div key={mod.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",padding:"8px 12px",gap:4,alignItems:"center",background:i%2===0?"#fff":"#f9fafb",borderTop:"1px solid #f0f0f0"}}>
                        <span style={{fontSize:13,fontWeight:500,color:"#374151"}}>{mod.label}</span>
                        {["nenhum","ver","editar"].map(nivel=>{
                          const sel = cur===nivel;
                          const [bg,fg] = sel ? NIVEL_COLORS[nivel] : ["#f3f4f6","#9ca3af"];
                          return (
                            <button key={nivel} onClick={()=>setModPerm(mod.id,nivel)}
                              style={{minWidth:80,padding:"4px 0",border:`2px solid ${sel?"currentColor":"#e5e7eb"}`,borderRadius:6,background:bg,color:fg,fontSize:11,fontWeight:sel?700:400,cursor:"pointer",transition:"all 0.1s"}}>
                              {nivel==="nenhum"?"🚫 Nenhum":nivel==="ver"?"👁 Ver":"✏️ Editar"}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {isNovo && (
                <div style={{background:"#fef3c7",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#92400e",marginBottom:12}}>
                  ⚠️ A senha inicial será a própria matrícula. No primeiro login, o usuário será solicitado a criar uma senha pessoal.
                </div>
              )}
              <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
                <Btn variant="secondary" onClick={()=>setModal(null)}>Cancelar</Btn>
                <Btn onClick={save}>{isNovo?"Criar usuário":"💾 Salvar alterações"}</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{fontSize:18,fontWeight:700,margin:0}}>Administração de Usuários</h2>
        <Btn onClick={()=>{setForm({nome:"",matricula:"",grau:"",perfil:"SSO",modulos:{...PERMS_PADRAO["SSO"]}});setModal("novo");}}>+ Novo usuário</Btn>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {users.map(u=>{
          const mods = u.modulos || PERMS_PADRAO[u.perfil] || {};
          const editCount = Object.values(mods).filter(v=>v==="editar").length;
          const verCount  = Object.values(mods).filter(v=>v==="ver").length;
          return (
            <Card key={u.id} style={{padding:"12px 16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                <Avatar name={u.nome} size={38}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13}}>{u.grau?u.grau+" ":""}{u.nome}</div>
                  <div style={{fontSize:11,color:"#6b7280"}}>Login: {u.matricula}</div>
                  {u.primeiroAcesso&&<div style={{fontSize:10,color:"#d97706"}}>⚠️ Aguardando troca de senha</div>}
                </div>
                <Badge color="#dbeafe" textColor="#1d4ed8">{u.perfil||"SSO"}</Badge>
                <Badge color={u.ativo?"#dcfce7":"#fee2e2"} textColor={u.ativo?"#15803d":"#991b1b"}>{u.ativo?"Ativo":"Inativo"}</Badge>
              </div>
              {/* Resumo de permissões */}
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
                {MODULOS_SISTEMA.map(mod=>{
                  const perm = mods[mod.id]||"nenhum";
                  if (perm==="nenhum") return null;
                  const [bg,fg] = NIVEL_COLORS[perm];
                  return <span key={mod.id} style={{background:bg,color:fg,borderRadius:999,padding:"1px 8px",fontSize:10,fontWeight:500}}>{mod.label}: {perm==="editar"?"✏️":"👁"}</span>;
                })}
              </div>
              <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                <Btn small variant="secondary" onClick={()=>openEdit(u)}>✏️ Editar acesso</Btn>
                <Btn small variant="secondary" onClick={()=>setUsers(us=>us.map(x=>x.id===u.id?{...x,senha:x.matricula,primeiroAcesso:true}:x))}>🔑 Reset senha</Btn>
                <Btn small variant={u.ativo?"warning":"success"} onClick={()=>setUsers(us=>us.map(x=>x.id===u.id?{...x,ativo:!x.ativo}:x))}>{u.ativo?"Desativar":"Ativar"}</Btn>
                {u.perfil!=="Admin" && <Btn small variant="danger" onClick={()=>setConfirm({msg:`Excluir usuário ${u.nome}?`,action:()=>setUsers(us=>us.filter(x=>x.id!==u.id))})}>🗑</Btn>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// MÓDULO RELATÓRIOS
// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// HELPER: Modal de relatório / impressão (reutilizável)
// ──────────────────────────────────────────────

// ──────────────────────────────────────────────
// MÓDULO VANTAGENS (CET + Substituição)
// ──────────────────────────────────────────────
const CET_TIPOS = ["Operacional","4 Rodas","2 Rodas"];
const SUBST_MAPA = {
  "Sd 1ª CL PM":  ["CB PM","1º SGT PM"],
  "Sd 2ª CL PM":  ["CB PM","1º SGT PM"],
  "CB PM":        ["1º SGT PM","2º SGT PM","3º SGT PM"],
  "AL CB PM":     ["1º SGT PM","2º SGT PM","3º SGT PM"],
  "2º SGT PM":    ["ST PM","1º SGT PM"],
  "3º SGT PM":    ["ST PM","1º SGT PM"],
  "1º SGT PM":    ["ST PM"],
  "AL SGT PM":    ["ST PM"],
  "ST PM":        ["1º TEN PM","2º TEN PM","ASP PM"],
  "ASP PM":       ["1º TEN PM","2º TEN PM"],
  "1º TEN PM":    ["CAP PM"],
  "2º TEN PM":    ["CAP PM"],
};

function ModVantagens({ officers, vantagens, setVantagens, loggedUser }) {
  const [aba, setAba] = useState("lista");
  const [confirm, setConfirm] = useState(null);
  const [masfOfficer, setMasfOfficer] = useState(null);
  const [masfData, setMasfData] = useState(null);
  const [relVantHtml, setRelVantHtml] = useState("");
  // Modal de edição em massa por tipo
  const [modalEditar, setModalEditar] = useState(null); // {tipo, categoria} ex: {tipo:"4 Rodas", categoria:"cet"}
  const [buscaEdicao, setBuscaEdicao] = useState("");
  // Modal nova vantagem individual
  const [modalNova, setModalNova] = useState(null);
  const [formNova, setFormNova] = useState({});

  const hoje = new Date().toISOString().slice(0,10);
  const getOfficer = id => officers.find(o=>o.id===Number(id));

  const vantAtivas    = (vantagens||[]).filter(v=>!v.dataFim||v.dataFim>=hoje);
  const vantConcluidas= (vantagens||[]).filter(v=>v.dataFim&&v.dataFim<hoje);

  // Grupos de vantagens ativas
  const cet4    = vantAtivas.filter(v=>v.categoria==="cet"&&v.tipo==="4 Rodas");
  const cet2    = vantAtivas.filter(v=>v.categoria==="cet"&&v.tipo==="2 Rodas");
  const substs  = vantAtivas.filter(v=>v.categoria==="subst");

  function gerarMASF(officer) {
    const cets = vantAtivas.filter(v=>v.policialId===officer.id&&v.categoria==="cet");
    const subs = vantAtivas.filter(v=>v.policialId===officer.id&&v.categoria==="subst");
    const cetDesc = cets.length>0?cets.map(c=>`CET ${c.tipo} (${c.bio||""})`).join(", "):"CET Operacional";
    const subDesc = subs.length>0?subs.map(s=>`Substituição de ${s.grauSubst} (${s.bio||""})`).join(", "):null;
    const d = masfData?new Date(masfData+"T12:00:00").toLocaleDateString("pt-BR"):new Date().toLocaleDateString("pt-BR");
    const emit = loggedUser?`${loggedUser.grau||""} ${loggedUser.nome}`.trim():"Sistema";
    const html=`<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px 32px;">
      <div style="text-align:center;margin-bottom:20px;font-weight:bold;font-size:12px;line-height:2;text-transform:uppercase;">
        POLÍCIA MILITAR DA BAHIA<br/>COMANDO DE POLICIAMENTO DA REGIÃO SUDOESTE<br/>77ª COMPANHIA INDEPENDENTE DE POLÍCIA MILITAR<br/>VITÓRIA DA CONQUISTA - ÁREA LESTE
      </div>
      <div style="text-align:center;font-size:15px;font-weight:bold;text-transform:uppercase;border-top:2px solid #000;border-bottom:2px solid #000;padding:8px 0;margin-bottom:20px;">DECLARAÇÃO — MASF</div>
      <p style="font-size:13px;line-height:1.8;text-align:justify;">Declaro que o(a) <strong>${officer.grau} PM ${officer.nome}</strong>, matrícula <strong>${cleanMat(officer.matricula)}</strong>, lotado(a) nesta Unidade, recebe as seguintes vantagens:</p>
      <div style="margin:16px 0;padding:12px 16px;border:1px solid #ccc;border-radius:6px;background:#f9f9f9;">
        <p style="font-size:13px;margin:0 0 8px;"><strong>CET:</strong> ${cetDesc}</p>
        ${subDesc?`<p style="font-size:13px;margin:0;"><strong>Substituição:</strong> ${subDesc}</p>`:""}
      </div>
      <p style="font-size:13px;text-align:center;margin-top:32px;">Vitória da Conquista, ${d}.</p>
      <div style="margin-top:48px;text-align:center;"><div style="border-top:1px solid #000;display:inline-block;min-width:280px;padding-top:6px;font-size:12px;">${emit}<br/>Comandante — 77ª CIPM</div></div>
    </div>`;
    const w=window.open("","_blank");
    if(w){w.document.open();w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>MASF</title></head><body>${html}</body></html>`);w.document.close();setTimeout(()=>w.print(),600);}
  }

  // ── Tabela de vantagem (usada em cada grupo) ───────────────────────────────
  function TabelaVant({ lista, titulo, cor, corText }) {
    const hoje = new Date().toISOString().slice(0,10);
    const ativos = lista.filter(v=>!v.dataFim||v.dataFim>=hoje);
    const hist   = lista.filter(v=>v.dataFim&&v.dataFim<hoje);
    const policiais = ativos.map(v=>({v, o:getOfficer(v.policialId)})).filter(x=>x.o).sort((a,b)=>rankSort(a.o,b.o));
    return (
      <Card style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <Badge color={cor} textColor={corText}>{titulo}</Badge>
            <span style={{fontSize:12,color:"#6b7280",marginLeft:8}}>{policiais.length} policial(is) ativo(s){hist.length>0&&` · ${hist.length} no histórico`}</span>
          </div>
          <Btn small variant="secondary" onClick={()=>{setBuscaEdicao("");setModalEditar({titulo, lista});}}>✏️ Editar lista</Btn>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:"#f8faff",borderBottom:"2px solid #e5e7eb"}}>
                <th style={{padding:"6px 10px",textAlign:"left",color:"#374151"}}>G.H.</th>
                <th style={{padding:"6px 10px",textAlign:"left",color:"#374151"}}>Nome</th>
                <th style={{padding:"6px 10px",textAlign:"left",color:"#374151"}}>Matrícula</th>
                <th style={{padding:"6px 10px",textAlign:"left",color:"#374151"}}>Início</th>
                <th style={{padding:"6px 10px",textAlign:"left",color:"#374151"}}>Fim</th>
                <th style={{padding:"6px 10px",textAlign:"left",color:"#374151"}}>BGO</th>
                <th style={{padding:"6px 10px",textAlign:"center",color:"#374151"}}></th>
              </tr>
            </thead>
            <tbody>
              {policiais.map(({v,o},i)=>(
                <tr key={v.id} style={{background:i%2===0?"#fff":"#f9fafb",borderBottom:"1px solid #f0f0f0"}}>
                  <td style={{padding:"6px 10px"}}>{o.grau}</td>
                  <td style={{padding:"6px 10px",fontWeight:500}}>{o.nomeGuerra||o.nome}</td>
                  <td style={{padding:"6px 10px",color:"#6b7280"}}>{cleanMat(o.matricula)}</td>
                  <td style={{padding:"6px 10px",color:"#6b7280"}}>{fmtDate(v.dataInicio)}</td>
                  <td style={{padding:"6px 10px"}}>
                    <input type="date" value={v.dataFim||""} onChange={e=>{
                      setVantagens(vs=>vs.map(x=>x.id===v.id?{...x,dataFim:e.target.value}:x));
                    }} style={{border:"1px solid #d1d5db",borderRadius:5,padding:"2px 6px",fontSize:11,outline:"none",color:v.dataFim?"#dc2626":"#6b7280"}}/>
                  </td>
                  <td style={{padding:"6px 10px",color:"#6b7280"}}>{v.bio||"—"}</td>
                  <td style={{padding:"6px 10px",textAlign:"center"}}>
                    <button onClick={()=>setConfirm({msg:`Remover ${o.nome} de ${titulo}?`,action:()=>setVantagens(vs=>vs.filter(x=>x.id!==v.id))})}
                      style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:14}}>✕</button>
                  </td>
                </tr>
              ))}
              {policiais.length===0&&<tr><td colSpan={7} style={{padding:12,textAlign:"center",color:"#9ca3af"}}>Nenhum policial ativo.</td></tr>}
            </tbody>
          </table>
        </div>
        {/* Histórico */}
        {hist.length>0 && (
          <details style={{marginTop:10}}>
            <summary style={{fontSize:12,color:"#6b7280",cursor:"pointer",padding:"4px 0"}}>📋 Histórico — {hist.length} registro(s) encerrado(s)</summary>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,marginTop:6,opacity:0.75}}>
              <thead><tr style={{background:"#f3f4f6"}}>
                <th style={{padding:"4px 8px",textAlign:"left"}}>G.H.</th>
                <th style={{padding:"4px 8px",textAlign:"left"}}>Nome</th>
                <th style={{padding:"4px 8px",textAlign:"left"}}>Início</th>
                <th style={{padding:"4px 8px",textAlign:"left"}}>Fim</th>
                <th style={{padding:"4px 8px",textAlign:"left"}}>BGO</th>
                <th style={{padding:"4px 8px"}}></th>
              </tr></thead>
              <tbody>
                {hist.map((v,i)=>{const o=getOfficer(v.policialId);return (
                  <tr key={v.id} style={{background:i%2===0?"#fafafa":"#f3f4f6",borderBottom:"1px solid #e5e7eb"}}>
                    <td style={{padding:"4px 8px"}}>{o?.grau||"—"}</td>
                    <td style={{padding:"4px 8px"}}>{o?.nome||"—"}</td>
                    <td style={{padding:"4px 8px",color:"#6b7280"}}>{fmtDate(v.dataInicio)}</td>
                    <td style={{padding:"4px 8px",color:"#dc2626"}}>{fmtDate(v.dataFim)}</td>
                    <td style={{padding:"4px 8px",color:"#6b7280"}}>{v.bio||"—"}</td>
                    <td style={{padding:"4px 8px",textAlign:"center"}}>
                      <button onClick={()=>setVantagens(vs=>vs.filter(x=>x.id!==v.id))} style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:12}}>🗑</button>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
          </details>
        )}
      </Card>
    );
  }


  function gerarRelVantagens() {
    const agora = new Date();
    const emit = loggedUser ? (loggedUser.grau||"") + " " + (loggedUser.nome||"") + ", Matrícula " + cleanMat(loggedUser.matricula||"") : "Sistema";
    const dataHora = agora.toLocaleDateString("pt-BR") + " às " + agora.toLocaleTimeString("pt-BR");
    const titulo = "RELATÓRIO DE VANTAGENS ATIVAS";
    const css = "<style>@page{size:A4;margin:25mm 30mm 25mm 30mm;}body{font-family:Arial,sans-serif;font-size:12px;margin:0;padding:0;}.cab{text-align:center;font-weight:bold;font-size:11px;line-height:1.9;text-transform:uppercase;margin-bottom:12px;}.tit{text-align:center;font-size:13px;font-weight:bold;text-transform:uppercase;border-top:2px solid #000;border-bottom:2px solid #000;padding:7px 0;margin-bottom:16px;}.sec{background:#1e3a5f;color:#fff;padding:5px 10px;font-weight:bold;font-size:11px;margin:14px 0 6px;}table{width:100%;border-collapse:collapse;font-size:11px;}th{background:#f0f4ff;padding:5px 8px;text-align:left;border:1px solid #ccc;}td{padding:4px 8px;border:1px solid #ddd;}.rod{margin-top:30px;border-top:1px solid #ccc;padding-top:6px;font-size:10px;color:#555;font-style:italic;}</style>";
    var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>" + titulo + "</title>" + css + "</head><body>";
    html += "<div class='cab'>POLÍCIA MILITAR DA BAHIA<br>COMANDO DE POLICIAMENTO DA REGIÃO SUDOESTE<br>77ª COMPANHIA INDEPENDENTE DE POLÍCIA MILITAR</div>";
    html += "<div class='tit'>" + titulo + "</div>";
    html += "<p style='font-size:11px;color:#555;margin-bottom:12px;'>Emissão: " + agora.toLocaleDateString("pt-BR") + " — Total ativo: " + vantAtivas.length + " vantagem(ns)</p>";
    var grupos = [{lista:cet4,tit:"CET 4 RODAS (85%)"},{lista:cet2,tit:"CET 2 RODAS (105%)"},{lista:substs,tit:"SUBSTITUIÇÃO DE FUNÇÃO"}];
    grupos.forEach(function(g) {
      if (!g.lista.length) return;
      var rows = g.lista.map(function(v) {
        var o = getOfficer(v.policialId);
        if (!o) return "";
        var ini = v.dataInicio ? new Date(v.dataInicio+"T12:00:00").toLocaleDateString("pt-BR") : "—";
        return "<tr><td>" + o.grau + "</td><td>" + o.nome.toUpperCase() + "</td><td>" + cleanMat(o.matricula) + "</td><td>" + ini + "</td><td>" + (v.bio||"—") + "</td></tr>";
      }).join("");
      html += "<div class='sec'>" + g.tit + " — " + g.lista.length + " policial(is)</div>";
      html += "<table><thead><tr><th>G.H.</th><th>Nome</th><th>Matrícula</th><th>Início</th><th>BGO</th></tr></thead><tbody>" + rows + "</tbody></table>";
    });
    html += "<div class='rod'>Relatório emitido por " + emit + " em " + dataHora + " — SiRH77</div></body></html>";
    var blob = new Blob([html],{type:"text/html;charset=utf-8"});
    var url = URL.createObjectURL(blob);
    var w = window.open(url,"_blank");
    if(w) w.addEventListener("load",function(){ setTimeout(function(){ w.print(); URL.revokeObjectURL(url); },400); });
  }

  return (
    <div>
      {confirm && <Confirm msg={confirm.msg} onYes={()=>{confirm.action();setConfirm(null);}} onNo={()=>setConfirm(null)}/>}

      {/* Modal MASF */}
      {masfOfficer && (
        <Modal title="Declaração MASF" onClose={()=>setMasfOfficer(null)}>
          <div style={{background:"#f0f4ff",borderRadius:7,padding:"8px 12px",marginBottom:12,fontSize:13}}>
            <strong>{masfOfficer.grau} {masfOfficer.nome}</strong>
          </div>
          <Input label="Data da declaração" type="date" value={masfData||hoje} onChange={e=>setMasfData(e.target.value)}/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setMasfOfficer(null)}>Cancelar</Btn>
            <Btn onClick={()=>{gerarMASF(masfOfficer);setMasfOfficer(null);}}>🖨️ Gerar</Btn>
          </div>
        </Modal>
      )}

      {/* Modal editar lista em massa */}
      {modalEditar && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:1000,overflowY:"auto",padding:"24px 12px"}}>
          <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:700,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#1e3a5f,#2d5986)",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:15}}>✏️ Editar — {modalEditar.titulo}</span>
              <button onClick={()=>setModalEditar(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"4px 12px",cursor:"pointer",fontSize:12}}>✕</button>
            </div>
            <div style={{padding:20}}>
              {/* Adicionar policial */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Adicionar policial</div>
                <BuscaPolicial officers={officers}
                  excluirIds={modalEditar.lista.map(v=>v.policialId).filter(Boolean)}
                  onSelect={o=>{
                    // Find a template from existing vantagem to copy categoria/tipo
                    const tmpl = modalEditar.lista[0]||{};
                    const nova = {...tmpl, id:Date.now(), policialId:o.id, dataInicio:"", bio:""};
                    setVantagens(vs=>[...vs, nova]);
                    setModalEditar(me=>({...me, lista:[...me.lista, nova]}));
                  }}/>
              </div>
              {/* Editar campos de cada policial */}
              <div style={{maxHeight:"50vh",overflowY:"auto"}}>
                <input value={buscaEdicao} onChange={e=>setBuscaEdicao(e.target.value)} placeholder="🔍 Filtrar por nome..."
                  style={{width:"100%",padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:12,outline:"none",boxSizing:"border-box",marginBottom:10}}/>
                {modalEditar.lista
                  .map(v=>({v, o:getOfficer(v.policialId)}))
                  .filter(({o})=>o&&(buscaEdicao.trim()?o.nome.toLowerCase().includes(buscaEdicao.toLowerCase()):true))
                  .sort((a,b)=>rankSort(a.o,b.o))
                  .map(({v,o})=>(
                    <div key={v.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f0f0f0"}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:500}}>{o.nome.toUpperCase()}</div>
                        <div style={{fontSize:11,color:"#6b7280"}}>{o.grau}</div>
                      </div>
                      <input type="date" defaultValue={v.dataInicio||""} onChange={e=>{
                        setVantagens(vs=>vs.map(x=>x.id===v.id?{...x,dataInicio:e.target.value}:x));
                      }} style={{padding:"5px 7px",border:"1px solid #d1d5db",borderRadius:6,fontSize:11,outline:"none"}}/>
                      <input defaultValue={v.bio||""} placeholder="BGO..." onChange={e=>{
                        setVantagens(vs=>vs.map(x=>x.id===v.id?{...x,bio:e.target.value}:x));
                      }} style={{padding:"5px 7px",border:"1px solid #d1d5db",borderRadius:6,fontSize:11,outline:"none"}}/>
                      <button onClick={()=>{setVantagens(vs=>vs.filter(x=>x.id!==v.id));setModalEditar(me=>({...me,lista:me.lista.filter(x=>x.id!==v.id)}));}}
                        style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:15}}>✕</button>
                    </div>
                  ))}
              </div>
            </div>
            <div style={{padding:"12px 20px",borderTop:"1px solid #e5e7eb",display:"flex",justifyContent:"flex-end",background:"#f9fafb"}}>
              <Btn onClick={()=>setModalEditar(null)}>✓ Fechar</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Alerta CNH */}
      {(()=>{
        const d60=new Date();d60.setDate(d60.getDate()+60);const d60str=d60.toISOString().slice(0,10);
        const cetIds=new Set(vantAtivas.filter(v=>v.categoria==="cet").map(v=>v.policialId));
        const alerta=officers.filter(o=>cetIds.has(o.id)&&o.validCnh&&o.validCnh<=d60str).sort((a,b)=>a.validCnh.localeCompare(b.validCnh));
        if(!alerta.length)return null;
        return <AlertaBanner cor="#fee2e2" borda="#fca5a5" icone="🚗"
          titulo={`${alerta.length} policial(is) com CET têm CNH vencida ou vencendo em 60 dias`}
          linhas={alerta.map(o=>{const diff=Math.ceil((new Date(o.validCnh+"T12:00:00")-new Date())/(24*3600*1000));return `${o.grau} ${o.nome} — ${diff<=0?"⛔ VENCIDA":"vence em "+diff+" dias"} (${fmtDate(o.validCnh)})`;}) }
          chaveStorage="vant_cnh_venc" loggedUser={loggedUser}/>;
      })()}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h2 style={{fontSize:18,fontWeight:700,color:"#111827",margin:0}}>Vantagens</h2>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <Btn small variant="secondary" onClick={gerarRelVantagens}>🖨️ Relatório</Btn>
          <div style={{display:"flex",background:"#f3f4f6",borderRadius:8,overflow:"hidden",border:"1px solid #e5e7eb"}}>
            <button onClick={()=>setAba("lista")} style={{padding:"7px 16px",border:"none",cursor:"pointer",fontSize:12,fontWeight:aba==="lista"?600:400,background:aba==="lista"?"#1e3a5f":"transparent",color:aba==="lista"?"#fff":"#374151"}}>📋 Listas</button>
            <button onClick={()=>setAba("historico")} style={{padding:"7px 16px",border:"none",cursor:"pointer",fontSize:12,fontWeight:aba==="historico"?600:400,background:aba==="historico"?"#374151":"transparent",color:aba==="historico"?"#fff":"#374151"}}>🗂 Histórico</button>
          </div>
        </div>
      </div>

      {aba==="lista" && (
        <div>
          <TabelaVant lista={cet4}   titulo="CET 4 Rodas (85%)" cor="#d1fae5" corText="#065f46"/>
          <TabelaVant lista={cet2}   titulo="CET 2 Rodas (105%)"cor="#fef3c7" corText="#92400e"/>
          <TabelaVant lista={substs} titulo="Substituição de Função" cor="#ede9fe" corText="#5b21b6"/>
        </div>
      )}

      {aba==="historico" && (
        <Card>
          <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:10}}>Vantagens encerradas</div>
          {vantConcluidas.length===0&&<p style={{color:"#9ca3af",fontSize:13,textAlign:"center"}}>Nenhuma vantagem encerrada.</p>}
          {[...vantConcluidas].sort((a,b)=>(b.dataFim||"").localeCompare(a.dataFim||"")).map(v=>{
            const o=getOfficer(v.policialId);
            return (
              <div key={v.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f0f0f0",opacity:0.8}}>
                {o&&<Avatar name={o.nome} size={28}/>}
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500}}>{o?o.nome.toUpperCase():"—"}</div>
                  <div style={{fontSize:11,color:"#6b7280"}}>{o?.grau} · {v.categoria==="cet"?`CET ${v.tipo||""}`:v.categoria==="subst"?`Subst. ${v.grauSubst||""}`:"MASF"}</div>
                  <div style={{fontSize:11,color:"#9ca3af"}}>{fmtDate(v.dataInicio)} → {fmtDate(v.dataFim)}</div>
                </div>
                <Btn small variant="danger" onClick={()=>setVantagens(vs=>vs.filter(x=>x.id!==v.id))}>🗑</Btn>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

function ModExportar({ officers }) {
  const [msg, setMsg] = useState("");

  function exportarCSV() {
    const header = [
      "ORD","G.H.","NOME","NOME DE GUERRA","MATRICULA","UNIDADE","LOCAL DE TRABALHO",
      "DATA NASC","CPF","RG","ADMISSAO","PLANO DE SAUDE","GRAU DE INSTRUCAO",
      "DDD","TELEFONE","TIPO SANG","EMAIL","ENDERECO","SITUACAO","SEXO","OBSERVACAO"
    ];
    const sorted = [...officers].sort(rankSort);
    const rows = sorted.map((o,i)=>[
      i+1, o.grau||"", o.nome||"", o.nomeGuerra||"", cleanMat(o.matricula),
      o.origem||"SEDE", o.localTrabalho||"",
      o.dataNasc||"", o.cpf||"", o.rg||"", o.admissao||"",
      o.planoSaude||"", o.grauInstrucao||"",
      o.ddd||"", o.telefone||"", o.tipoSang||"",
      o.email||"", o.endereco||"", o.situacao||"Ativo",
      o.sexo||"MASC", o.observacao||""
    ]);
    const esc = v => {
      const s = String(v == null ? "" : v).replace(/[\r\n]+/g," ");
      return s.indexOf(";") >= 0 || s.indexOf('"') >= 0 ? '"'+s.replace(/"/g,'""')+'"' : s;
    };
    const csvContent = [header,...rows].map(r=>r.map(esc).join(";")).join("\r\n");
    const encoded = "data:text/csv;charset=utf-8," + encodeURIComponent("\uFEFF" + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download","Efetivo_77CIPM_"+new Date().toISOString().slice(0,10)+".csv");
    link.style.display="none";
    document.body.appendChild(link);
    link.click();
    setTimeout(()=>{ try{document.body.removeChild(link);}catch(e){} },1000);
    // Try blob URL first (works in most environments)
    try {
      const csvBlob = new Blob(["﻿"+csvContent], {type:"text/csv;charset=utf-8"});
      const blobUrl = URL.createObjectURL(csvBlob);
      link.setAttribute("href", blobUrl);
      link.setAttribute("download","Efetivo_77CIPM_"+new Date().toISOString().slice(0,10)+".csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(()=>URL.revokeObjectURL(blobUrl),5000);
    } catch(e) {
      // fallback: data URI link
      link.setAttribute("href", encoded);
      link.setAttribute("download","Efetivo_77CIPM_"+new Date().toISOString().slice(0,10)+".csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // Always show manual link
    const fb = document.getElementById("csv-fallback");
    if (fb) {
      try {
        const b2 = new Blob(["﻿"+csvContent],{type:"text/csv;charset=utf-8"});
        const u2 = URL.createObjectURL(b2);
        fb.innerHTML = `<a href="${u2}" download="Efetivo_77CIPM_${new Date().toISOString().slice(0,10)}.csv" style="display:inline-block;margin-top:8px;padding:8px 16px;background:#1e3a5f;color:#fff;border-radius:7px;text-decoration:none;font-size:13px;font-weight:600;">⬇️ Clique aqui para baixar a planilha</a>`;
      } catch(e2) {
        fb.innerHTML = `<a href="${encoded}" download="Efetivo_77CIPM_${new Date().toISOString().slice(0,10)}.csv" style="display:inline-block;margin-top:8px;padding:8px 16px;background:#1e3a5f;color:#fff;border-radius:7px;text-decoration:none;font-size:13px;font-weight:600;">⬇️ Clique aqui para baixar a planilha</a>`;
      }
    }
    setMsg("Se o download não iniciar, clique no botão abaixo:");
  }

  const ativos = officers.filter(o=>!["Transferido","Reserva/Inativo"].includes(o.situacao||"Ativo")).length;

  function exportarPeculioCPR() {
    // Build RESUMO table matching PECÚLIO CPR structure
    const GRAUS_ORDEM = ["CEL PM","TEN CEL PM","MAJ PM","CAP PM","1º TEN PM","2º TEN PM","ASP PM","ST PM","1º SGT PM","2º SGT PM","3º SGT PM","CB PM","AL CB PM","Sd 1ª CL PM","Sd 2ª CL PM","CIVIL"];
    const ativos2 = officers.filter(o=>!["Transferido","Reserva/Inativo"].includes(o.situacao||"Ativo"));
    const sede = ativos2.filter(o=>(o.origem||"SEDE")==="SEDE");
    const bcs = ativos2.filter(o=>o.origem==="BCS");

    // Count by grau and sex for SEDE and BCS
    function countByGrauSex(list) {
      const c = {};
      list.forEach(o=>{
        const g = o.grau||"Outros";
        if (!c[g]) c[g]={M:0,F:0};
        c[g][o.sexo==="FEM"?"F":"M"]++;
      });
      return c;
    }

    const sCount = countByGrauSex(sede);
    const bCount = countByGrauSex(bcs);

    const header1 = ["GRAU HIERÁRQUICO","SEDE M","SEDE F","BCS M","BCS F","TOTAL M","TOTAL F","TOTAL"];
    const rows = GRAUS_ORDEM.map(g=>{
      const sm = sCount[g]?.M||0, sf = sCount[g]?.F||0;
      const bm = bCount[g]?.M||0, bf = bCount[g]?.F||0;
      return [g, sm, sf, bm, bf, sm+bm, sf+bf, sm+sf+bm+bf];
    }).filter(r=>r[7]>0);
    rows.push(["TOTAL",
      sede.filter(o=>o.sexo!=="FEM").length, sede.filter(o=>o.sexo==="FEM").length,
      bcs.filter(o=>o.sexo!=="FEM").length, bcs.filter(o=>o.sexo==="FEM").length,
      ativos2.filter(o=>o.sexo!=="FEM").length, ativos2.filter(o=>o.sexo==="FEM").length,
      ativos2.length
    ]);

    // Situação breakdown
    const SITS = ["Ativo","Férias","Atestado","Junta Médica","Licença Maternidade","Licença Paternidade","Licença Prêmio","Lic. Int. Particular","Apresentado CPR/SO","Afastado"];
    const header2 = ["SITUAÇÃO","SEDE M","SEDE F","BCS M","BCS F","TOTAL"];
    const rows2 = SITS.map(s=>{
      const sm = sede.filter(o=>(o.situacao||"Ativo")===s&&o.sexo!=="FEM").length;
      const sf = sede.filter(o=>(o.situacao||"Ativo")===s&&o.sexo==="FEM").length;
      const bm = bcs.filter(o=>(o.situacao||"Ativo")===s&&o.sexo!=="FEM").length;
      const bf = bcs.filter(o=>(o.situacao||"Ativo")===s&&o.sexo==="FEM").length;
      return [s,sm,sf,bm,bf,sm+sf+bm+bf];
    }).filter(r=>r[5]>0);

    const esc = v=>{const s=String(v==null?"":v);return s.indexOf(";")>=0||s.indexOf('"')>=0?'"'+s.replace(/"/g,'""')+'"':s;};
    const csvStr = [
      ["RESUMO EFETIVO - 77ª CIPM","","","","","","",""],
      ["Gerado em: "+new Date().toLocaleDateString("pt-BR"),"","","","","","",""],
      [""],
      ["=== EFETIVO POR GRAU HIERÁRQUICO ==="],
      header1,
      ...rows,
      [""],
      ["=== EFETIVO POR SITUAÇÃO ==="],
      header2,
      ...rows2
    ].map(r=>r.map(esc).join(";")).join("\r\n");

    const encoded = "data:text/csv;charset=utf-8,"+encodeURIComponent("﻿"+csvStr);
    try {
      const blob = new Blob(["﻿"+csvStr],{type:"text/csv;charset=utf-8"});
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href=blobUrl;a.download="PECULIO_CPR_RESUMO_"+new Date().toISOString().slice(0,10)+".csv";
      document.body.appendChild(a);a.click();document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(blobUrl),3000);
    } catch(e) {
      const a=document.createElement("a");a.href=encoded;
      a.download="PECULIO_CPR_RESUMO_"+new Date().toISOString().slice(0,10)+".csv";
      document.body.appendChild(a);a.click();document.body.removeChild(a);
    }
    const fb=document.getElementById("csv-fallback2");
    if(fb){
      try{const b2=new Blob(["﻿"+csvStr],{type:"text/csv"});const u2=URL.createObjectURL(b2);
      fb.innerHTML=`<a href="${u2}" download="PECULIO_CPR_RESUMO.csv" style="display:inline-block;margin-top:8px;padding:6px 14px;background:#065f46;color:#fff;border-radius:7px;text-decoration:none;font-size:13px;">⬇️ Baixar PECÚLIO CPR</a>`;}
      catch(e2){fb.innerHTML=`<a href="${encoded}" download="PECULIO_CPR_RESUMO.csv" style="display:inline-block;margin-top:8px;padding:6px 14px;background:#065f46;color:#fff;border-radius:7px;text-decoration:none;font-size:13px;">⬇️ Baixar PECÚLIO CPR</a>`;}
    }
  }

  return (
    <div>
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:18,fontWeight:700,color:"#111827",margin:0}}>Exportar Dados</h2>
        <p style={{fontSize:12,color:"#6b7280",margin:"4px 0 0"}}>Baixe os dados do efetivo em planilha compatível com Excel.</p>
      </div>
      <Card>
        <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:8}}>Planilha do Efetivo — formato CSV</div>
        <div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>{officers.length} policiais · {ativos} ativos · {officers.length-ativos} inativos/transferidos</div>
        <div style={{background:"#f0f4ff",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#1e3a5f",marginBottom:16}}>
          ℹ️ Arquivo CSV com separador <strong>;</strong> — compatível com Excel. Ao abrir no Excel, use <em>Dados → Do Texto/CSV</em> e selecione ";" como separador.
        </div>
        <Btn onClick={exportarCSV}>⬇️ Baixar planilha</Btn>
        {msg && <div style={{marginTop:10,fontSize:12,color:"#374151"}}>{msg}</div>}
        <div id="csv-fallback" style={{marginTop:8}}/>
      </Card>

      <Card style={{marginTop:16}}>
        <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:8}}>PECÚLIO CPR — Aba RESUMO</div>
        <div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>
          Exporta o resumo do efetivo por grau hierárquico e por situação, equivalente à aba RESUMO do PECÚLIO CPR.
        </div>
        <Btn onClick={exportarPeculioCPR} variant="success">⬇️ Baixar PECÚLIO CPR (RESUMO)</Btn>
        <div id="csv-fallback2" style={{marginTop:8}}/>
        <div style={{marginTop:14,borderTop:"1px solid #e5e7eb",paddingTop:12,fontSize:11,color:"#9ca3af"}}>
          Colunas: ORD · G.H. · NOME · NOME DE GUERRA · MATRÍCULA · UNIDADE · LOCAL · DATA NASC · CPF · RG · ADMISSÃO · PLANO DE SAÚDE · GRAU INSTRUÇÃO · DDD · TELEFONE · TIPO SANG. · E-MAIL · ENDEREÇO · SITUAÇÃO · SEXO · OBSERVAÇÃO
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [loggedUser, setLoggedUser] = useState(()=>{
    try { const s=sessionStorage.getItem("sirh77_session"); return s?JSON.parse(s):null; } catch { return null; }
  });
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [officers, setOfficers] = useSupabaseState("sirh_officers_v7", INITIAL_OFFICERS);
  const [locations, setLocations] = useSupabaseState("sirh_locations", INITIAL_LOCATIONS);
  const [ferias, setFerias] = useSupabaseState("sirh_ferias_v3", ()=>{
    // Match participants by 8-digit matricula (most reliable) then by first name
    const by8 = {};
    INITIAL_OFFICERS.forEach(o=>{
      const k = (o.matricula||"").replace(/[^\d]/g,"").slice(0,8);
      if (k) by8[k] = o;
    });
    return INITIAL_FERIAS_2026.map(plan=>({
      ...plan,
      participantes: (plan.participantes||[]).map((p,i)=>{
        const mat8 = (p.policialMatricula||"").replace(/[^\d]/g,"").slice(0,8);
        let officer = by8[mat8];
        if (!officer && p.nome) {
          const firstName = (p.nome||"").trim().split(" ")[0].toLowerCase();
          officer = INITIAL_OFFICERS.find(o=>(o.nome||"").toLowerCase().startsWith(firstName)&&(o.nome||"").toLowerCase().includes((p.nome||"").trim().split(" ").slice(-1)[0].toLowerCase()));
        }
        return {...p, policialId: officer ? officer.id : null, id: plan.id*1000+i};
      }).filter(p=>p.policialId!=null)
    }));
  });
  const [afastamentos, setAfastamentos] = useSupabaseState("sirh_afastamentos_v2", ()=>{
    // Initialize from planilha data — filter only matched records
    return INITIAL_SAUDE_DATA.filter(a=>a.policialId!=null).map((a,i)=>({...a, id:a.id||(i+1)}));
  });
  const [corregedoria, setCorregedoria] = useSupabaseState("sirh_corregedoria", []);
  const [cursos, setCursos] = useSupabaseState("sirh_cursos", []);
  const [vantagens, setVantagens] = useSupabaseState("sirh_vantagens_v3", ()=>{
    // Initialize vantagens from spreadsheet data, matching officers by matricula
    const initVants = [];
    let vid = 1;
    INITIAL_VANTAGENS_DATA.forEach(v=>{
      const officer = INITIAL_OFFICERS.find(o=>cleanMat(o.matricula)===v.policialMatricula);
      if (officer) {
        initVants.push({...v, id:vid++, policialId:officer.id});
      }
    });
    return initVants;
  });
  const [promocoes, setPromocoes] = useSupabaseState("sirh_promocoes_v2", ()=>{
    const raw = [{"oficialId":1,"posto":"MAJ PM","data":"2023-05-26","bgo":"BGO Nº 43"},{"oficialId":2,"posto":"MAJ PM","data":"2025-09-09","bgo":"BGO Nº 1"},{"oficialId":3,"posto":"CAP PM","data":"2020-02-04","bgo":"BGO Nº 1"},{"oficialId":4,"posto":"CAP PM","data":"2026-02-04","bgo":"BGO Nº 65"},{"oficialId":5,"posto":"CAP PM","data":"2025-09-09","bgo":"BGO Nº 40"},{"oficialId":6,"posto":"CAP PM","data":"2025-06-06","bgo":"BGO Nº 32"},{"oficialId":7,"posto":"CAP PM","data":"2022-06-30","bgo":"BGO Nº 1"},{"oficialId":8,"posto":"1º TEN PM","data":"2025-03-14","bgo":"BGO Nº 96"},{"oficialId":9,"posto":"1º TEN PM","data":"2020-05-09","bgo":"BGO Nº 3"},{"oficialId":10,"posto":"1º TEN PM","data":"2025-03-14","bgo":"BGO Nº 30"},{"oficialId":11,"posto":"ASP PM","data":"2025-12-18","bgo":"BGO Nº 1"},{"oficialId":12,"posto":"ASP PM","data":"2013-11-29","bgo":"BGO Nº 61"},{"oficialId":13,"posto":"ST PM","data":"2016-12-23","bgo":"BGO Nº 99"},{"oficialId":14,"posto":"ST PM","data":"2024-08-22","bgo":"BGO Nº 160"},{"oficialId":15,"posto":"ST PM","data":"2025-12-18","bgo":"BGO Nº 95"},{"oficialId":16,"posto":"ST PM","data":"2025-02-14","bgo":"BGO Nº 128"},{"oficialId":17,"posto":"ST PM","data":"2025-02-14","bgo":"BGO Nº 129"},{"oficialId":18,"posto":"ST PM","data":"2024-08-22","bgo":"BGO Nº 114"},{"oficialId":19,"posto":"ST PM","data":"2025-12-18","bgo":"BGO Nº 25"},{"oficialId":20,"posto":"ST PM","data":"2025-12-18","bgo":"BGO Nº 276"},{"oficialId":21,"posto":"ST PM","data":"2025-02-14","bgo":"BGO Nº 152"},{"oficialId":22,"posto":"1º SGT PM","data":"2025-01-14","bgo":"BGO Nº 61"},{"oficialId":23,"posto":"1º SGT PM","data":"2025-09-23","bgo":"BGO Nº 10"},{"oficialId":24,"posto":"1º SGT PM","data":"2025-11-25","bgo":"BGO Nº 689"},{"oficialId":25,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 167"},{"oficialId":27,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 538"},{"oficialId":28,"posto":"1º SGT PM","data":"2025-11-25","bgo":"BGO Nº 768"},{"oficialId":29,"posto":"1º SGT PM","data":"2025-09-23","bgo":"BGO Nº 33"},{"oficialId":30,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 679"},{"oficialId":31,"posto":"1º SGT PM","data":"2021-05-07","bgo":"BGO Nº 87"},{"oficialId":32,"posto":"1º SGT PM","data":"2025-11-25","bgo":"BGO Nº 694"},{"oficialId":33,"posto":"1º SGT PM","data":"2021-04-20","bgo":"BGO Nº 110"},{"oficialId":34,"posto":"1º SGT PM","data":"2024-09-25","bgo":"BGO Nº 207"},{"oficialId":35,"posto":"1º SGT PM","data":"2025-11-25","bgo":"BGO Nº 330"},{"oficialId":36,"posto":"1º SGT PM","data":"2025-11-25","bgo":"BGO Nº 21"},{"oficialId":37,"posto":"1º SGT PM","data":"44608","bgo":"BGO Nº 3"},{"oficialId":38,"posto":"1º SGT PM","data":"2023-09-29","bgo":"BGO Nº 440"},{"oficialId":39,"posto":"1º SGT PM","data":"2025-11-25","bgo":"BGO Nº 178"},{"oficialId":40,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 278"},{"oficialId":41,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 511"},{"oficialId":42,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 56"},{"oficialId":43,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 366"},{"oficialId":44,"posto":"1º SGT PM","data":"2025-01-14","bgo":"BGO Nº 222"},{"oficialId":45,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 138"},{"oficialId":46,"posto":"1º SGT PM","data":"2021-10-14","bgo":"BGO Nº 815"},{"oficialId":47,"posto":"1º SGT PM","data":"2025-11-25","bgo":"BGO Nº 52"},{"oficialId":48,"posto":"1º SGT PM","data":"2021-05-06","bgo":"BGO Nº 167"},{"oficialId":49,"posto":"1º SGT PM","data":"2022-12-15","bgo":"BGO Nº 236"},{"oficialId":50,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 400"},{"oficialId":51,"posto":"1º SGT PM","data":"2023-11-29","bgo":"BGO Nº 165"},{"oficialId":52,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 548"},{"oficialId":53,"posto":"1º SGT PM","data":"2021-05-06","bgo":"BGO Nº 87"},{"oficialId":54,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 813"},{"oficialId":55,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 718"},{"oficialId":58,"posto":"AL SGT PM","data":"2025-10-14","bgo":"BGO Nº 812"},{"oficialId":59,"posto":"CB PM","data":"2025-05-09","bgo":"BGO Nº 46"},{"oficialId":60,"posto":"CB PM","data":"2024-10-10","bgo":"BGO Nº 201"},{"oficialId":61,"posto":"CB PM","data":"2025-05-09","bgo":"BGO Nº 95"},{"oficialId":62,"posto":"CB PM","data":"2023-07-28","bgo":"BGO Nº 69"},{"oficialId":64,"posto":"CB PM","data":"2024-11-08","bgo":"BGO Nº 122"},{"oficialId":65,"posto":"CB PM","data":"2025-09-26","bgo":"BGO Nº 343"},{"oficialId":66,"posto":"CB PM","data":"2023-09-22","bgo":"BGO Nº 22"},{"oficialId":67,"posto":"CB PM","data":"2022-07-11","bgo":"BGO Nº 51"},{"oficialId":68,"posto":"CB PM","data":"2025-05-09","bgo":"BGO Nº 98"},{"oficialId":69,"posto":"CB PM","data":"2024-05-15","bgo":"BGO Nº 16"},{"oficialId":70,"posto":"CB PM","data":"2022-09-23","bgo":"BGO Nº 166"},{"oficialId":71,"posto":"CB PM","data":"2025-09-26","bgo":"BGO Nº 172"},{"oficialId":72,"posto":"CB PM","data":"2023-09-22","bgo":"BGO Nº 196"},{"oficialId":73,"posto":"CB PM","data":"2023-07-28","bgo":"BGO Nº 178"},{"oficialId":74,"posto":"CB PM","data":"2022-08-04","bgo":"BGO Nº 47"},{"oficialId":75,"posto":"CB PM","data":"2022-09-23","bgo":"BGO Nº 174"},{"oficialId":76,"posto":"CB PM","data":"2024-11-08","bgo":"BGO Nº 131"},{"oficialId":77,"posto":"CB PM","data":"2025-05-09","bgo":"BGO Nº 104"},{"oficialId":78,"posto":"CB PM","data":"2023-09-22","bgo":"BGO Nº 167"},{"oficialId":79,"posto":"CB PM","data":"2025-09-26","bgo":"BGO Nº 256"},{"oficialId":80,"posto":"CB PM","data":"2024-08-01","bgo":"BGO Nº 17"},{"oficialId":81,"posto":"CB PM","data":"2023-07-28","bgo":"BGO Nº 210"},{"oficialId":82,"posto":"CB PM","data":"2023-04-28","bgo":"BGO Nº 11"},{"oficialId":83,"posto":"CB PM","data":"2025-09-16","bgo":"BGO Nº 136"},{"oficialId":84,"posto":"CB PM","data":"2022-09-23","bgo":"BGO Nº 231"},{"oficialId":85,"posto":"CB PM","data":"2025-09-16","bgo":"BGO Nº 55"},{"oficialId":86,"posto":"CB PM","data":"2022-07-11","bgo":"BGO Nº 18"},{"oficialId":87,"posto":"CB PM","data":"2022-04-18","bgo":"BGO Nº 76"},{"oficialId":88,"posto":"CB PM","data":"2023-12-21","bgo":"BGO Nº 152"},{"oficialId":89,"posto":"CB PM","data":"2024-07-25","bgo":"BGO Nº 130"},{"oficialId":90,"posto":"CB PM","data":"2025-09-26","bgo":"BGO Nº 315"},{"oficialId":91,"posto":"CB PM","data":"2025-09-26","bgo":"BGO Nº 218"},{"oficialId":92,"posto":"CB PM","data":"2023-12-21","bgo":"BGO Nº 138"},{"oficialId":93,"posto":"CB PM","data":"2025-05-09","bgo":"BGO Nº 67"},{"oficialId":94,"posto":"CB PM","data":"2025-07-18","bgo":"BGO Nº 170"},{"oficialId":95,"posto":"CB PM","data":"2023-09-22","bgo":"BGO Nº 409"},{"oficialId":96,"posto":"CB PM","data":"2024-11-08","bgo":"BGO Nº 103"},{"oficialId":97,"posto":"AL CB PM","data":"2010-09-16","bgo":"BGO Nº 544"},{"oficialId":98,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 1067"},{"oficialId":99,"posto":"Sd 1ª CL PM","data":"2017-01-27","bgo":"BGO Nº 4"},{"oficialId":100,"posto":"Sd 1ª CL PM","data":"2016-02-19","bgo":"BGO Nº 373"},{"oficialId":101,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 1082"},{"oficialId":102,"posto":"Sd 1ª CL PM","data":"2025-12-05","bgo":"BGO Nº 768"},{"oficialId":103,"posto":"Sd 1ª CL PM","data":"2025-12-05","bgo":"BGO Nº 812"},{"oficialId":104,"posto":"Sd 1ª CL PM","data":"2024-12-20","bgo":"BGO Nº 702"},{"oficialId":105,"posto":"Sd 1ª CL PM","data":"2023-03-31","bgo":"BGO Nº 405"},{"oficialId":106,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 1496"},{"oficialId":107,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 235"},{"oficialId":108,"posto":"Sd 1ª CL PM","data":"2025-12-05","bgo":"BGO Nº 818"},{"oficialId":109,"posto":"Sd 1ª CL PM","data":"2023-07-21","bgo":"BGO Nº 5"},{"oficialId":110,"posto":"Sd 1ª CL PM","data":"2019-05-31","bgo":"BGO Nº 64"},{"oficialId":111,"posto":"Sd 1ª CL PM","data":"2022-04-29","bgo":"BGO Nº 362"},{"oficialId":112,"posto":"Sd 1ª CL PM","data":"2016-04-01","bgo":"BGO Nº 815"},{"oficialId":113,"posto":"Sd 1ª CL PM","data":"2016-04-01","bgo":"BGO Nº 612"},{"oficialId":114,"posto":"Sd 1ª CL PM","data":"2016-02-19","bgo":"BGO Nº 196"},{"oficialId":115,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 1902"},{"oficialId":116,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 31"},{"oficialId":117,"posto":"Sd 1ª CL PM","data":"2014-09-19","bgo":"BGO Nº 152"},{"oficialId":118,"posto":"Sd 1ª CL PM","data":"2019-05-31","bgo":"BGO Nº 221"},{"oficialId":119,"posto":"Sd 1ª CL PM","data":"2024-12-20","bgo":"BGO Nº 758"},{"oficialId":120,"posto":"Sd 1ª CL PM","data":"2023-03-31","bgo":"BGO Nº 965"},{"oficialId":121,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 319"},{"oficialId":122,"posto":"Sd 1ª CL PM","data":"2024-12-20","bgo":"BGO Nº 1144"},{"oficialId":123,"posto":"Sd 1ª CL PM","data":"2025-12-05","bgo":"BGO Nº 1054"},{"oficialId":124,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 174"},{"oficialId":125,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 188"},{"oficialId":126,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 687"},{"oficialId":127,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 231"},{"oficialId":128,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 550"},{"oficialId":129,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 1445"},{"oficialId":130,"posto":"Sd 1ª CL PM","data":"2021-07-20","bgo":"BGO Nº 3"},{"oficialId":131,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 953"},{"oficialId":132,"posto":"Sd 1ª CL PM","data":"2014-09-19","bgo":"BGO Nº 16"},{"oficialId":133,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 1951"},{"oficialId":134,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 297"},{"oficialId":135,"posto":"Sd 1ª CL PM","data":"2022-04-29","bgo":"BGO Nº 807"},{"oficialId":136,"posto":"Sd 1ª CL PM","data":"2024-12-20","bgo":"BGO Nº 957"},{"oficialId":137,"posto":"Sd 1ª CL PM","data":"2019-05-31","bgo":"BGO Nº 69"},{"oficialId":138,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 419"},{"oficialId":139,"posto":"Sd 1ª CL PM","data":"2016-04-01","bgo":"BGO Nº 592"},{"oficialId":140,"posto":"Sd 1ª CL PM","data":"2014-09-19","bgo":"BGO Nº 569"},{"oficialId":141,"posto":"Sd 1ª CL PM","data":"2016-02-19","bgo":"BGO Nº 312"},{"oficialId":142,"posto":"Sd 1ª CL PM","data":"2025-12-05","bgo":"BGO Nº 877"},{"oficialId":143,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 156"},{"oficialId":144,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 367"},{"oficialId":145,"posto":"Sd 1ª CL PM","data":"2025-12-05","bgo":"BGO Nº 886"},{"oficialId":146,"posto":"Sd 1ª CL PM","data":"2016-04-01","bgo":"BGO Nº 885"},{"oficialId":147,"posto":"Sd 1ª CL PM","data":"2016-04-01","bgo":"BGO Nº 178"},{"oficialId":148,"posto":"Sd 1ª CL PM","data":"2016-02-19","bgo":"BGO Nº 162"},{"oficialId":149,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 1441"},{"oficialId":150,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 209"},{"oficialId":151,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 818"},{"oficialId":152,"posto":"Sd 1ª CL PM","data":"2010-09-16","bgo":"BGO Nº 926"},{"oficialId":153,"posto":"Sd 1ª CL PM","data":"2014-09-19","bgo":"BGO Nº 332"},{"oficialId":154,"posto":"Sd 1ª CL PM","data":"2025-12-05","bgo":"BGO Nº 106"},{"oficialId":155,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 1041"},{"oficialId":156,"posto":"Sd 1ª CL PM","data":"2016-04-01","bgo":"BGO Nº 641"},{"oficialId":157,"posto":"Sd 1ª CL PM","data":"2020-04-01","bgo":"BGO Nº 11"},{"oficialId":158,"posto":"Sd 1ª CL PM","data":"2014-09-19","bgo":"BGO Nº 69"},{"oficialId":159,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 295"},{"oficialId":160,"posto":"Sd 1ª CL PM","data":"2014-09-19","bgo":"BGO Nº 57"},{"oficialId":161,"posto":"Sd 1ª CL PM","data":"2015-05-29","bgo":"BGO Nº 23"},{"oficialId":162,"posto":"Sd 1ª CL PM","data":"2024-12-20","bgo":"BGO Nº 666"},{"oficialId":163,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 1900"},{"oficialId":164,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 105"},{"oficialId":165,"posto":"Sd 1ª CL PM","data":"2022-04-29","bgo":"BGO Nº 808"},{"oficialId":166,"posto":"Sd 1ª CL PM","data":"2014-09-19","bgo":"BGO Nº 27"},{"oficialId":167,"posto":"Sd 1ª CL PM","data":"2014-09-19","bgo":"BGO Nº 109"},{"oficialId":169,"posto":"ST PM","data":"2025-12-18","bgo":"BGO Nº 158"},{"oficialId":170,"posto":"1º SGT PM","data":"2023-09-20","bgo":"BGO Nº 216"},{"oficialId":171,"posto":"1º SGT PM","data":"2021-12-09","bgo":"BGO Nº 121"},{"oficialId":172,"posto":"1º SGT PM","data":"2024-09-25","bgo":"BGO Nº 269"},{"oficialId":173,"posto":"1º SGT PM","data":"2024-01-01","bgo":"BGO Nº 241"},{"oficialId":174,"posto":"1º SGT PM","data":"2025-10-14","bgo":"BGO Nº 734"},{"oficialId":175,"posto":"CB PM","data":"2023-12-21","bgo":"BGO Nº 49"},{"oficialId":176,"posto":"CB PM","data":"2022-07-29","bgo":"BGO Nº 231"},{"oficialId":178,"posto":"CB PM","data":"2023-09-22","bgo":"BGO Nº 356"},{"oficialId":179,"posto":"CB PM","data":"2022-07-29","bgo":"BGO Nº 186"},{"oficialId":180,"posto":"Sd 1ª CL PM","data":"2016-02-19","bgo":"BGO Nº 173"},{"oficialId":181,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 415"},{"oficialId":182,"posto":"Sd 1ª CL PM","data":"2017-01-27","bgo":"BGO Nº 66"},{"oficialId":183,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 212"},{"oficialId":184,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 708"},{"oficialId":185,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 395"},{"oficialId":186,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 938"},{"oficialId":187,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 524"},{"oficialId":188,"posto":"Sd 1ª CL PM","data":"2017-01-27","bgo":"BGO Nº 32"},{"oficialId":189,"posto":"Sd 1ª CL PM","data":"2014-05-19","bgo":"BGO Nº 3"},{"oficialId":190,"posto":"Sd 1ª CL PM","data":"2017-07-06","bgo":"BGO Nº 234"},{"oficialId":191,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 155"},{"oficialId":192,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 248"},{"oficialId":193,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 644"},{"oficialId":194,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 548"},{"oficialId":195,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 443"},{"oficialId":196,"posto":"Sd 1ª CL PM","data":"2025-12-05","bgo":"BGO Nº 674"},{"oficialId":197,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 360"},{"oficialId":198,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 222"},{"oficialId":199,"posto":"Sd 1ª CL PM","data":"2014-09-19","bgo":"BGO Nº 178"},{"oficialId":200,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 290"},{"oficialId":201,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 228"},{"oficialId":202,"posto":"Sd 1ª CL PM","data":"2019-01-25","bgo":"BGO Nº 1108"},{"oficialId":203,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 144"},{"oficialId":204,"posto":"Sd 1ª CL PM","data":"2014-09-19","bgo":"BGO Nº 32"},{"oficialId":205,"posto":"Sd 1ª CL PM","data":"2014-09-19","bgo":"BGO Nº 111"},{"oficialId":206,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 143"},{"oficialId":207,"posto":"Sd 1ª CL PM","data":"2012-04-25","bgo":"BGO Nº 227"}];
    return raw.map((p,i)=>({...p, id:i+1}));
  });
  const [users, setUsers] = useSupabaseState("sirh_users", USUARIOS_INICIAIS);
  const [pelotoes, setPelotoes] = useSupabaseState("sirh_pelotoes", []);
  const [escalas, setEscalas] = useSupabaseState("sirh_escalas", []);
  const [dashFilter, setDashFilter] = useState(null);
  const [feriasDetalhe, setFeriasDetalhe] = useState(null);

  // Show loading screen while Supabase data loads
  if (isConfigured && !officers?.length && typeof window !== 'undefined') {
    // wait briefly for initial load
  }

  if (!loggedUser) return <LoginScreen onLogin={u=>{
    if (u.primeiroAcesso) setLoggedUser({...u,_needsChange:true});
    else { 
      setLoggedUser(u);
      try { sessionStorage.setItem("sirh77_session", JSON.stringify(u)); } catch {}
    }
  }}/>;

  if (loggedUser._needsChange) return (
    <TrocarSenha user={loggedUser} onDone={u=>{
      const updated = {...u, _needsChange:false};
      setLoggedUser(updated);
      try { sessionStorage.setItem("sirh77_session", JSON.stringify(updated)); } catch {}
    }} users={users} setUsers={setUsers}/>
  );

  // Build perm object from user.modulos (new system) or legacy PERMS (fallback)
  const userMods = loggedUser.modulos || PERMS_PADRAO[loggedUser.perfil] || PERMS_PADRAO["SSO"];
  const perm = {
    admin:      loggedUser.perfil==="Admin" || loggedUser.perfil==="admin",
    editarTudo: loggedUser.perfil==="Admin" || loggedUser.perfil==="admin",
    // Per-module: true if can edit, false if only view or none
    efetivo:     userMods.efetivo==="editar",
    locais:      userMods.locais==="editar",
    ferias:      userMods.ferias==="editar",
    saude:       userMods.saude==="editar",
    cursos:      userMods.cursos==="editar",
    vantagens:   userMods.vantagens==="editar",
    corregedoria:userMods.corregedoria==="editar",
    // Can access (view OR edit)
    verEfetivo:     userMods.efetivo!=="nenhum",
    verLocais:      userMods.locais!=="nenhum",
    verFerias:      userMods.ferias!=="nenhum",
    verSaude:       userMods.saude!=="nenhum",
    verCursos:      userMods.cursos!=="nenhum",
    verVantagens:   userMods.vantagens!=="nenhum",
    verCorregedoria:userMods.corregedoria!=="nenhum",
    verExportar:    userMods.exportar!=="nenhum",
    // Legacy compat
    sso: userMods.saude!=="nenhum" || userMods.ferias!=="nenhum",
  };

  const navItems = [
    {id:"dashboard",    label:"Início",       icon:"🏠", show:true},
    {id:"efetivo",      label:"Efetivo",      icon:"👮", show:perm.verEfetivo||perm.admin},
    {id:"locais",       label:"Locais",       icon:"📍", show:perm.verLocais||perm.admin},
    {id:"ferias",       label:"Férias",       icon:"🏖️", show:perm.verFerias||perm.admin},
    {id:"saude",        label:"Saúde",        icon:"🏥", show:perm.verSaude||perm.admin},
    {id:"cursos",       label:"Cursos",       icon:"🎓", show:perm.verCursos||perm.admin},
    {id:"vantagens",    label:"Vantagens",    icon:"⭐", show:perm.verVantagens||perm.admin},
    {id:"corregedoria", label:"Corregedoria", icon:"⚖️", show:perm.verCorregedoria||perm.admin},
    {id:"exportar",     label:"Exportar",     icon:"📊", show:perm.verExportar||perm.admin},
    {id:"pelotao",      label:"Pelotão",     icon:"👥", show:true},
    {id:"admin",        label:"Admin",        icon:"⚙️", show:perm.admin},
  ].filter(n=>n.show);

  const notifs = [];
  const hoje = today();

  return (
    <div style={{minHeight:"100vh",background:"#f3f4f6",fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <nav style={{background:"linear-gradient(135deg,#1e3a5f,#2d5986)",padding:"0 16px",display:"flex",alignItems:"center",height:56,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginRight:16}}>
          <div style={{width:32,height:32,background:"#1e3a5f",border:"2px solid #fbbf24",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fbbf24"}}>77</div>
          <div style={{fontWeight:700,fontSize:14,color:"#fff"}}>SiRH77</div>
        </div>
        <div style={{display:"flex",gap:2,flex:1,overflowX:"auto"}}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{
              background:page===n.id?"rgba(255,255,255,0.2)":"transparent",
              border:"none",color:"#fff",padding:"6px 10px",borderRadius:6,cursor:"pointer",
              fontSize:12,fontWeight:page===n.id?600:400,whiteSpace:"nowrap",
              opacity: !perm[n.id] && n.id!=="dashboard" && n.id!=="efetivo" && n.id!=="locais" ? 0.5 : 1
            }}>{n.icon} {n.label}</button>
          ))}
        </div>
        {notifs.length>0 && (
          <div title={notifs.join("\n")} style={{background:"#dc2626",color:"#fff",borderRadius:999,fontSize:11,fontWeight:700,padding:"2px 8px",marginRight:8,cursor:"help"}}>{notifs.length} ⚠️</div>
        )}
        <div style={{background:"rgba(255,255,255,0.15)",borderRadius:999,padding:"4px 10px",fontSize:11,color:"rgba(255,255,255,0.9)",cursor:"pointer",whiteSpace:"nowrap"}}
          onClick={()=>{setLoggedUser(null);try{sessionStorage.removeItem("sirh77_session");}catch{}}}>{loggedUser.nome.split(" ")[0]} · Sair</div>
      </nav>

      <div style={{padding:"20px",maxWidth:1100,margin:"0 auto"}}>
        {page==="dashboard" && (
          <div>
            <div style={{marginBottom:16}}>
              <h1 style={{fontSize:20,fontWeight:700,color:"#111827",margin:0}}>Painel Geral</h1>
              <p style={{fontSize:12,color:"#6b7280",margin:"3px 0 0"}}>77ª Companhia Independente de Polícia Militar · Vitória da Conquista</p>
            </div>
            <Dashboard officers={officers} ferias={ferias} afastamentos={afastamentos} loggedUser={loggedUser} locations={locations} onFilter={f=>{ if(!f) return; setDashFilter(f); setPage("efetivo"); }}/>
          </div>
        )}
        {page==="efetivo" && <ModEfetivo officers={officers} setOfficers={setOfficers} perm={perm} locations={locations} ferias={ferias} afastamentos={afastamentos} corregedoria={corregedoria} cursos={cursos} vantagens={vantagens} promocoes={promocoes} setPromocoes={setPromocoes} initialFilter={dashFilter} onFilterConsumed={()=>setDashFilter(null)} onOpenFeriasPlan={plan=>{setFeriasDetalhe(plan);setPage("ferias");}}/>}
        {page==="locais" && <ModLocais locations={locations} setLocations={setLocations} officers={officers} setOfficers={setOfficers}/>}
        {page==="ferias" && <ModFerias officers={officers} ferias={ferias} setFerias={setFerias} setOfficers={setOfficers} loggedUser={loggedUser} initialDetalhe={feriasDetalhe} onDetalheConsumed={()=>setFeriasDetalhe(null)}/>}
        {page==="saude" && <ModSaude officers={officers} afastamentos={afastamentos} setAfastamentos={setAfastamentos} setOfficers={setOfficers} loggedUser={loggedUser}/>}
        {page==="cursos" && <ModCursos officers={officers} cursos={cursos} setCursos={setCursos} loggedUser={loggedUser} setOfficers={setOfficers}/>}
        {page==="vantagens" && <ModVantagens officers={officers} vantagens={vantagens} setVantagens={setVantagens} loggedUser={loggedUser}/>}
        {page==="corregedoria" && <ModCorregedoria officers={officers} corregedoria={corregedoria} setCorregedoria={setCorregedoria} perm={perm} loggedUser={loggedUser}/>}
        {page==="relatorios" && <ModRelatorios officers={officers} corregedoria={corregedoria} cursos={cursos} afastamentos={afastamentos} ferias={ferias} loggedUser={loggedUser}/>}
        {page==="pelotao" && <ModPelotao
          officers={officers} afastamentos={afastamentos} ferias={ferias}
          vantagens={vantagens} pelotoes={pelotoes} setPelotoes={setPelotoes}
          escalas={escalas} setEscalas={setEscalas} locations={locations}
          loggedUser={loggedUser} perm={perm}/>}
        {page==="exportar" && (perm.admin||perm.verExportar) && <ModExportar officers={officers}/>}
        {page==="admin" && perm.admin && <ModAdmin users={users} setUsers={setUsers} officers={officers}/>}
        {page==="admin" && !perm.admin && <div style={{textAlign:"center",padding:40,color:"#9ca3af"}}>Acesso restrito.</div>}
      </div>
    </div>
  );
}
