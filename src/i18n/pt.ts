import { en } from "./en";

type Translation = typeof en;

export const pt: Translation = {
  common: {
    loading: "Carregando...",
    error: "Erro",
  },
  nav: {
    home: "Início",
    brawlers: "Brawlers",
    maps: "Mapas",
    events: "Eventos",
  },
  search: {
    placeholder: "Pesquisar jogador por tag",
    error: {
      invalidTag: "Tag de jogador inválida",
      fetchError: "Erro ao buscar dados do jogador",
    },
    previousSearches: "Pesquisas anteriores",
  },
  player: {
    title: "Estatísticas do Jogador",
    brawlers: "Brawlers",
    noBattles: "Nenhuma batalha recente encontrada",
  },
  brawlersPage: {
    title: "Brawlers",
    subtitle: "Explore todos os Brawlers de Brawl Stars",
  },
  brawlerDetails: {
    description: "Descrição",
    attack: "Ataque",
    super: "Super",
    gadgets: "Gadgets",
    starPowers: "Poderes Estelares",
  },
  events: {
    title: "Eventos",
    subtitle: "Veja os eventos ativos e futuros",
    startTime: "Começa",
    endTime: "Termina",
  },
  maps: {
    title: "Mapas",
    subtitle: "Explore todos os mapas de Brawl Stars e suas estatísticas",
    backToMaps: "Voltar para Mapas",
    notFound: "Mapa não encontrado",
    notFoundDesc: "O mapa que você está procurando não existe ou foi removido",
    createdBy: "Criado por",
    topBrawlers: "Melhores Brawlers",
    topTeams: "Melhores Equipes",
    noMaps: "Nenhum mapa disponível no momento"
  },
};
