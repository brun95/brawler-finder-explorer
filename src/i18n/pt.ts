import { en } from "./en";
type Translation = typeof en;

export const pt: Translation = {
  common: {
    loading: "Carregando...",
  },
  nav: {
    brawlers: "Brawlers",
    maps: "Mapas",
    events: "Eventos",
    player: "Jogador",
  },
  events: {
    title: "Eventos",
    subtitle: "Veja os eventos ativos e futuros",
    startTime: "Começa",
    endTime: "Termina",
    activeTitle: "Eventos Atuais",
    upcomingTitle: "Próximos Eventos",
    endsIn: "Termina em",
    startsIn: "Começa em",
  },
  search: {
    placeholder: "Pesquisar jogador por tag",
    error: {
      invalidTag: "Tag de jogador inválida",
      fetchError: "Erro ao buscar dados do jogador",
    },
    previousSearches: "Pesquisas anteriores",
    clearSearches: "Limpar pesquisas",
  },
  player: {
    title: "Estatísticas do Jogador",
    lastOnline: "Última vez online",
    trophies: "Troféus",
    highestTrophies: "Maior quantidade de troféus",
    powerPlayPoints: "Pontos Power Play",
    highestPowerPlayPoints: "Maior quantidade de pontos Power Play",
    club: "Clube",
    noClub: "Sem clube",
    brawlers: "Brawlers",
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
