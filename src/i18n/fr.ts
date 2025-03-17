
import { en } from "./en";
type Translation = typeof en;

export const fr: Translation = {
  common: {
    loading: "Chargement...",
  },
  nav: {
    brawlers: "Brawlers",
    maps: "Cartes",
    events: "Événements",
    player: "Joueur",
  },
  events: {
    title: "Événements",
    subtitle: "Événements Brawl Stars actuels et à venir",
    startTime: "Heure de début",
    endTime: "Heure de fin",
    activeTitle: "Événements en cours",
    upcomingTitle: "Événements à venir",
    endsIn: "Se termine dans",
    startsIn: "Commence dans",
  },
  search: {
    placeholder: "Rechercher un joueur par tag",
    clubPlaceholder: "Rechercher un club par tag",
    error: {
      invalidTag: "Le tag est invalide",
      fetchError: "Impossible de récupérer les données",
    },
    previousSearches: "Recherches précédentes",
    clearSearches: "Effacer les recherches",
  },
  player: {
    title: "Statistiques du joueur",
    lastOnline: "Dernière activité",
    trophies: "Trophées",
    highestTrophies: "Trophées les plus élevés",
    powerPlayPoints: "Points Power Play",
    highestPowerPlayPoints: "Points Power Play les plus élevés",
    club: "Club",
    noClub: "Aucun club",
    brawlers: "Brawlers",
  },
  maps: {
    title: "Cartes",
    subtitle: "Explorez toutes les cartes de Brawl Stars et leurs statistiques",
    backToMaps: "Retour aux cartes",
    notFound: "Carte introuvable",
    notFoundDesc: "La carte que vous recherchez n'existe pas ou a été supprimée",
    createdBy: "Créée par",
    topBrawlers: "Meilleurs Brawlers",
    topTeams: "Meilleures équipes",
    noMaps: "Aucune carte disponible pour le moment"
  },
  club: {
    title: "Détails du Club",
    members: "Membres",
    trophies: "Trophées",
    requiredTrophies: "Trophées Requis",
    description: "Description",
    roles: {
      president: "Président",
      vicePresident: "Vice-Président",
      senior: "Sénior",
      member: "Membre"
    }
  }
};
