
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
      fetchError: "Erro ao buscar dados",
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
  }
};
