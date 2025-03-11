import { en } from "./en";

type Translation = typeof en;

export const fr: Translation = {
  common: {
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    edit: "Modifier",
    delete: "Supprimer",
    cancel: "Annuler",
    save: "Enregistrer",
  },
  nav: {
    home: "Accueil",
    brawlers: "Brawlers",
    maps: "Cartes",
    player: "Joueur",
    events: "Événements",
  },
  search: {
    placeholder: "Rechercher un joueur par tag",
    error: {
      invalidTag: "Le tag de joueur est invalide",
      fetchError: "Impossible de récupérer les données du joueur",
    },
  },
  player: {
    title: "Statistiques du joueur",
    lastActive: "Dernière activité",
    trophies: "Trophées",
    highestTrophies: "Trophées les plus élevés",
    level: "Niveau",
    club: "Club",
    noClub: "Aucun club",
    battleLog: "Historique des combats",
    brawlers: "Brawlers",
  },
  brawlers: {
    title: "Brawlers",
    noBrawlers: "Aucun Brawler trouvé",
  },
  events: {
    title: "Événements",
    subtitle: "Événements Brawl Stars actuels et à venir",
    startTime: "Heure de début",
    endTime: "Heure de fin",
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
};
