
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
      fetchError: "Oups ! Joueur introuvable. Vérifiez le tag et réessayez.",
      playerNotFound: "Joueur introuvable. Vérifiez que le tag est correct.",
      clubNotFound: "Club introuvable. Veuillez vérifier le tag du club.",
      networkError: "Problème de connexion. Vérifiez votre internet et réessayez.",
      rateLimitError: "Trop de recherches ! Veuillez patienter un instant.",
      serverError: "Un problème est survenu. Veuillez réessayer dans un instant.",
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
  },
  dashboard: {
    title: "Mon Tableau de Bord",
    subtitle: "Vue d'ensemble de vos favoris et accès rapide",
    statistics: "Statistiques",
    recentActivity: "Activité Récente",
    quickActions: "Actions Rapides",
    favorites: "Favoris",
    totalFavorites: "Total de Favoris",
    searchPlayer: "Rechercher un Joueur",
    searchClub: "Rechercher un Club",
    browseBrawlers: "Parcourir les Brawlers",
    viewMaps: "Voir les Cartes",
    viewEvents: "Voir les Événements",
    clearAll: "Tout Effacer",
    emptyState: {
      noFavorites: "Aucun favori pour le moment",
      noPlayers: "Aucun joueur favori pour le moment",
      noClubs: "Aucun club favori pour le moment",
      noBrawlers: "Aucun brawler favori pour le moment",
      startExploring: "Commencez à explorer et ajoutez vos favoris pour les voir ici !"
    },
    tabs: {
      all: "Tous",
      players: "Joueurs",
      clubs: "Clubs",
      brawlers: "Brawlers"
    },
    actions: {
      viewProfile: "Voir le Profil",
      viewClub: "Voir le Club",
      viewBrawler: "Voir le Brawler",
      viewDetails: "Voir les Détails",
      remove: "Supprimer"
    }
  }
};
