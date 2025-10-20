
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
    clubPlaceholder: "Pesquisar clube por tag",
    error: {
      invalidTag: "Tag inválida",
      fetchError: "Ops! Não encontramos esse jogador. Verifique a tag e tente novamente.",
      playerNotFound: "Jogador não encontrado. Certifique-se de que a tag está correta.",
      clubNotFound: "Clube não encontrado. Verifique se a tag do clube está correta.",
      networkError: "Problema de conexão. Verifique sua internet e tente novamente.",
      rateLimitError: "Muitas buscas! Aguarde um momento e tente novamente.",
      serverError: "Algo deu errado. Por favor, tente novamente em instantes.",
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
  club: {
    title: "Detalhes do Clube",
    members: "Membros",
    trophies: "Troféus",
    requiredTrophies: "Troféus Necessários",
    description: "Descrição",
    roles: {
      president: "Presidente",
      vicePresident: "Vice-Presidente",
      senior: "Veterano",
      member: "Membro"
    }
  },
  dashboard: {
    title: "Meu Painel",
    subtitle: "Visão geral dos seus favoritos e acesso rápido",
    statistics: "Estatísticas",
    recentActivity: "Atividade Recente",
    quickActions: "Ações Rápidas",
    favorites: "Favoritos",
    totalFavorites: "Total de Favoritos",
    searchPlayer: "Pesquisar Jogador",
    searchClub: "Pesquisar Clube",
    browseBrawlers: "Navegar Brawlers",
    viewMaps: "Ver Mapas",
    viewEvents: "Ver Eventos",
    clearAll: "Limpar Tudo",
    emptyState: {
      noFavorites: "Nenhum favorito ainda",
      noPlayers: "Nenhum jogador favoritado ainda",
      noClubs: "Nenhum clube favoritado ainda",
      noBrawlers: "Nenhum brawler favoritado ainda",
      startExploring: "Comece a explorar e adicione seus favoritos para vê-los aqui!"
    },
    tabs: {
      all: "Todos",
      players: "Jogadores",
      clubs: "Clubes",
      brawlers: "Brawlers"
    },
    actions: {
      viewProfile: "Ver Perfil",
      viewClub: "Ver Clube",
      viewBrawler: "Ver Brawler",
      viewDetails: "Ver Detalhes",
      remove: "Remover"
    }
  }
};
